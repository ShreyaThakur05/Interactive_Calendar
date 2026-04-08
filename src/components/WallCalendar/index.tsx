import { useState, useEffect, useCallback, useRef, PointerEvent } from 'react';
import HeroPanel from './HeroPanel';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import { MONTH_META, MONTH_NAMES } from './constants';
import { toISO, buildMonthGrid, shortDate } from './utils';
import type { DateRange, Note, NoteColor } from './types';
import styles from './WallCalendar.module.css';
import YearProgress from './widgets/YearProgress';
import EarthOrbitWidget from './widgets/EarthOrbitWidget';
import ThemeSwitcher, { useTheme } from './widgets/ThemeSwitcher';
import MonthHeroStrip from './widgets/MonthHeroStrip';

const STORAGE_KEY = 'wallcalendar_notes';

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

export default function WallCalendar() {
  const { theme, setTheme } = useTheme();
  const now = new Date();

  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selection,   setSelection]   = useState<DateRange>({ start: null, end: null });
  const [hoverDate,   setHoverDate]   = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [notes,         setNotes]         = useState<Note[]>(loadNotes);
  const [activeNoteKey, setActiveNoteKey] = useState<string | null>(null);
  const [isFlipping,    setIsFlipping]    = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeLocked = useRef<'horiz' | 'vert' | null>(null);

  const today    = toISO(now.getFullYear(), now.getMonth(), now.getDate());
  const days     = buildMonthGrid(year, month);
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* quota */ }
  }, [notes]);

  useEffect(() => {
    const { accentColor, accentLight, accentRgb } = MONTH_META[month];
    const root = document.documentElement;
    root.style.setProperty('--accent',       accentColor);
    root.style.setProperty('--accent-light', accentLight);
    root.style.setProperty('--accent-rgb',   accentRgb);
  }, [month]);

  useEffect(() => {
    const cancel = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-daycell]')) setIsSelecting(false);
    };
    window.addEventListener('mouseup', cancel);
    return () => window.removeEventListener('mouseup', cancel);
  }, []);

  const navigateMonth = useCallback((dir: 'next' | 'prev') => {
    if (isFlipping) return;
    setFlipDirection(dir);
    setIsFlipping(true);
    setTimeout(() => {
      if (dir === 'next') {
        setMonth((m) => { if (m === 11) { setYear((y) => y + 1); return 0; } return m + 1; });
      } else {
        setMonth((m) => { if (m === 0) { setYear((y) => y - 1); return 11; } return m - 1; });
      }
      setIsFlipping(false);
      setSelection({ start: null, end: null });
      setHoverDate(null);
      setActiveNoteKey(null);
    }, 320);
  }, [isFlipping]);

  const goToToday = useCallback(() => {
    const t = new Date();
    const tm = t.getMonth();
    const ty = t.getFullYear();
    if (tm === month && ty === year) return;
    const dir = ty > year || (ty === year && tm > month) ? 'next' : 'prev';
    setFlipDirection(dir);
    setIsFlipping(true);
    setTimeout(() => {
      setMonth(tm); setYear(ty);
      setIsFlipping(false);
      setSelection({ start: null, end: null });
      setHoverDate(null);
      setActiveNoteKey(null);
    }, 320);
  }, [month, year]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') navigateMonth('next');
      if (e.key === 'ArrowLeft')  navigateMonth('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigateMonth]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipeLocked.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    if (swipeLocked.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > 12 || dy > 12) swipeLocked.current = dx > dy ? 'horiz' : 'vert';
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || swipeLocked.current !== 'horiz') {
      touchStartX.current = null; touchStartY.current = null; swipeLocked.current = null;
      return;
    }
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null; touchStartY.current = null; swipeLocked.current = null;
    if (Math.abs(delta) < 50) return;
    navigateMonth(delta < 0 ? 'next' : 'prev');
  }, [navigateMonth]);

  const handleDayMouseDown = useCallback((dateStr: string) => {
    setIsSelecting(true);
    setSelection({ start: dateStr, end: null });
    setHoverDate(dateStr);
  }, []);

  const handleDayMouseEnter = useCallback((dateStr: string) => {
    if (!isSelecting) return;
    setHoverDate(dateStr);
  }, [isSelecting]);

  const handleDayMouseUp = useCallback((dateStr: string) => {
    if (!isSelecting) return;
    setIsSelecting(false);
    const anchor = selection.start!;
    const [s, e] = anchor <= dateStr ? [anchor, dateStr] : [dateStr, anchor];
    setSelection({ start: s, end: e });
    const key   = s === e ? s : `${s}_${e}`;
    const label = s === e ? shortDate(s) : `${shortDate(s)} - ${shortDate(e)}`;
    setNotes((prev) => {
      if (prev.some((n) => n.dateKey === key)) return prev;
      return [...prev, { dateKey: key, label, text: '', color: 'default' }];
    });
    setActiveNoteKey(key);
  }, [isSelecting, selection.start]);

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>, d: string) => {
    if (e.pointerType !== 'mouse') {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      handleDayMouseDown(d);
    }
  }, [handleDayMouseDown]);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>, d: string) => {
    if (e.pointerType !== 'mouse') handleDayMouseEnter(d);
  }, [handleDayMouseEnter]);

  const handlePointerUp = useCallback((e: PointerEvent<HTMLDivElement>, d: string) => {
    if (e.pointerType !== 'mouse') handleDayMouseUp(d);
  }, [handleDayMouseUp]);

  const handleNoteChange = useCallback((key: string, text: string) => {
    setNotes((prev) => {
      const exists = prev.find((n) => n.dateKey === key);
      if (exists) return prev.map((n) => n.dateKey === key ? { ...n, text } : n);
      return [...prev, { dateKey: key, label: key, text, color: 'default' }];
    });
  }, []);

  const handleNoteColorChange = useCallback((key: string, color: NoteColor) => {
    setNotes((prev) => prev.map((n) => n.dateKey === key ? { ...n, color } : n));
  }, []);

  const handleDeleteNote = useCallback((key: string) => {
    setNotes((prev) => prev.filter((n) => n.dateKey !== key));
    if (activeNoteKey === key) {
      setActiveNoteKey(null);
      setSelection({ start: null, end: null });
    }
  }, [activeNoteKey]);

  const dayCount = (() => {
    if (!selection.start || !selection.end || selection.start === selection.end) return null;
    const ms = new Date(selection.end).getTime() - new Date(selection.start).getTime();
    return Math.round(ms / 86400000) + 1;
  })();

  const selectionHint = (() => {
    if (selection.start && selection.end && selection.start !== selection.end)
      return `${shortDate(selection.start)} - ${shortDate(selection.end)}`;
    if (selection.start) return shortDate(selection.start);
    return null;
  })();

  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();
  const flipClass = isFlipping
    ? flipDirection === 'next' ? styles.flippingNext : styles.flippingPrev
    : '';

  return (
    <div className={styles.wrapper}>
      <MonthHeroStrip month={month} year={year} />
      <div className={styles.spirals} aria-hidden="true">
        {Array.from({ length: 13 }).map((_, i) => (
          <div key={i} className={styles.spiralRing} />
        ))}
      </div>
      <main
        className={`${styles.calendarCard} ${flipClass}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.leftPanel}>
          <HeroPanel
            monthIndex={month}
            year={year}
            onPrev={() => navigateMonth('prev')}
            onNext={() => navigateMonth('next')}
          />
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.panelHeader}>
            <h1 className={styles.panelTitle}>
              {MONTH_NAMES[month]}
              <span className={styles.panelTitleYear}>{year}</span>
            </h1>
            <div className={styles.panelHeaderRight}>
              {selectionHint && (
                <span className={styles.selectionBadge} aria-live="polite">
                  {selectionHint}
                  {dayCount && <strong> &middot; {dayCount}d</strong>}
                </span>
              )}
              {!isCurrentMonth && (
                <button className={styles.todayBtn} onClick={goToToday} type="button" aria-label="Go to today">
                  Today
                </button>
              )}
              <YearProgress year={year} month={month} />
              <EarthOrbitWidget month={month} />
              <ThemeSwitcher theme={theme} setTheme={setTheme} />
            </div>
          </div>
          <CalendarGrid
            year={year} month={month} days={days}
            selection={selection} hoverDate={hoverDate} isSelecting={isSelecting}
            notes={notes} today={today}
            onDayMouseDown={handleDayMouseDown}
            onDayMouseEnter={handleDayMouseEnter}
            onDayMouseUp={handleDayMouseUp}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
          <div className={styles.divider} />
          <NotesPanel
            notes={notes} activeNoteKey={activeNoteKey}
            monthKey={monthKey} currentMonthLabel={`${MONTH_NAMES[month]} ${year}`}
            onNoteChange={handleNoteChange}
            onNoteColorChange={handleNoteColorChange}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </main>
    </div>
  );
}
