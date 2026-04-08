import { memo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { PointerEvent } from 'react';
import styles from './WallCalendar.module.css';
import widgetStyles from './widgets/widgets.module.css';
import EventBadge from './widgets/EventBadge';
import ZodiacStrip from './widgets/ZodiacStrip';
import { useJsonData } from './widgets/useJsonData';

interface DayCellProps {
  day: number | null;
  dateStr: string;
  mmdd: string;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  isHoverPreview: boolean;
  isWeekend: boolean;
  hasNote: boolean;
  holidayName: string;
  onMouseDown: (d: string) => void;
  onMouseEnter: (d: string) => void;
  onMouseUp: (d: string) => void;
  onPointerDown: (e: PointerEvent<HTMLDivElement>, d: string) => void;
  onPointerMove: (e: PointerEvent<HTMLDivElement>, d: string) => void;
  onPointerUp: (e: PointerEvent<HTMLDivElement>, d: string) => void;
}

const DayCell = memo(function DayCell({
  day, dateStr, mmdd,
  isToday, isStart, isEnd, inRange, isHoverPreview, isWeekend,
  hasNote, holidayName,
  onMouseDown, onMouseEnter, onMouseUp,
  onPointerDown, onPointerMove, onPointerUp,
}: DayCellProps) {
  if (day === null) return <div className={styles.dayCellEmpty} aria-hidden="true" />;

  const cls = [
    styles.dayCell,
    isToday        && styles.isToday,
    isStart        && styles.isStart,
    isEnd          && styles.isEnd,
    inRange        && styles.inRange,
    isHoverPreview && styles.isHoverPreview,
    isWeekend && !isStart && !isEnd && styles.isWeekend,
  ].filter(Boolean).join(' ');

  return (
    <div
      data-daycell="true"
      role="button"
      tabIndex={0}
      aria-label={`${dateStr}${holidayName ? `, ${holidayName}` : ''}`}
      aria-pressed={isStart || isEnd}
      className={cls}
      title={holidayName || undefined}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(dateStr); }}
      onMouseEnter={() => onMouseEnter(dateStr)}
      onMouseUp={() => onMouseUp(dateStr)}
      onPointerDown={(e) => onPointerDown(e, dateStr)}
      onPointerMove={(e) => onPointerMove(e, dateStr)}
      onPointerUp={(e) => onPointerUp(e, dateStr)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onMouseDown(dateStr); }}
    >
      <span className={styles.dayNumber}>{day}</span>

      {/* Indicator dots — absolutely positioned, never affect centering */}
      <div className={styles.dayDots}>
        {holidayName && <span className={styles.dotHoliday} aria-hidden="true" />}
        {hasNote     && <span className={styles.dotNote}    aria-hidden="true" />}
      </div>

      {/* Additive widgets — all absolutely positioned */}
      <FactBadge mmdd={mmdd} />
      <EventBadge mmdd={mmdd} />
      <ZodiacStrip mmdd={mmdd} />
    </div>
  );
});

export default DayCell;

/* ─────────────────────────────────────────────────────────────
   FactBadge — lightbulb SVG icon, top-left corner
───────────────────────────────────────────────────────────── */
function FactBadge({ mmdd }: { mmdd: string }) {
  const facts = useJsonData<Record<string, string>>('/data/facts.json');
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fact = facts?.[mmdd];
  if (!fact) return null;

  const show = () => {
    timer.current = setTimeout(() => {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        setPos({ x: r.left + r.width / 2, y: r.top + window.scrollY });
      }
    }, 400);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setPos(null);
  };

  return (
    <>
      <span
        ref={ref}
        className={widgetStyles.factBadge}
        onMouseEnter={show}
        onMouseLeave={hide}
        aria-label="Daily fact"
      >
        {/* Lightbulb icon */}
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {pos && fact && createPortal(
        <div className={widgetStyles.factCard} style={{ left: pos.x, top: pos.y }}>
          <div className={widgetStyles.factCardHead}>
            <span className={widgetStyles.factCardIconWrap}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"
                  stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className={widgetStyles.factCardTitle}>Did you know?</span>
          </div>
          <p className={widgetStyles.factCardBody}>{fact}</p>
        </div>,
        document.body
      )}
    </>
  );
}
