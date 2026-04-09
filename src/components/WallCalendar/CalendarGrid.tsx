import type { PointerEvent } from 'react';
import DayCell from './DayCell';
import { WEEKDAYS, HOLIDAYS } from './constants';
import { toISO, isBetween, isRangeStart, isRangeEnd } from './utils';
import type { DateRange, Note } from './types';
import styles from './WallCalendar.module.css';

interface CalendarGridProps {
  year: number;
  month: number;
  days: (number | null)[];
  selection: DateRange;
  hoverDate: string | null;
  isSelecting: boolean;
  notes: Note[];
  today: string;
  onDayMouseDown: (d: string) => void;
  onDayMouseEnter: (d: string) => void;
  onDayMouseUp: (d: string) => void;
  onPointerDown: (e: PointerEvent<HTMLDivElement>, d: string) => void;
  onPointerMove: (e: PointerEvent<HTMLDivElement>, d: string) => void;
  onPointerUp: (e: PointerEvent<HTMLDivElement>, d: string) => void;
}

export default function CalendarGrid({
  year, month, days,
  selection, hoverDate, isSelecting,
  notes, today,
  onDayMouseDown, onDayMouseEnter, onDayMouseUp,
  onPointerDown, onPointerMove, onPointerUp,
}: CalendarGridProps) {
  // While dragging, show live preview range; otherwise show committed selection
  const previewEnd = isSelecting && hoverDate ? hoverDate : selection.end;
  const rangeStart = isSelecting ? selection.start : selection.start;
  const rangeEnd   = previewEnd;

  // Build a Set of dateKeys that have notes for O(1) lookup
  const noteKeySet = new Set(notes.map((n) => n.dateKey));

  const mm = String(month + 1).padStart(2, '0');

  return (
    <div
      className={`${styles.calendarGrid} ${isSelecting ? styles.selecting : ''}`}
      role="grid"
      aria-label="Calendar"
    >
      {/* Weekday header row */}
      {WEEKDAYS.map((wd, i) => (
        <div
          key={wd}
          role="columnheader"
          className={`${styles.weekdayHeader} ${i >= 5 ? styles.weekendHeader : ''}`}
        >
          {wd}
        </div>
      ))}

      {/* Day cells */}
      {days.map((day, idx) => {
        const dateStr   = day !== null ? toISO(year, month, day) : '';
        const col       = idx % 7;
        const isWknd    = col === 5 || col === 6;
        const dd        = day !== null ? String(day).padStart(2, '0') : '';
        const holiday   = day !== null ? (HOLIDAYS[`${mm}-${dd}`] ?? '') : '';

        const iS = day !== null && isRangeStart(dateStr, rangeStart, rangeEnd);
        const iE = day !== null && isRangeEnd(dateStr, rangeStart, rangeEnd);
        const iR = day !== null && isBetween(dateStr, rangeStart, rangeEnd);

        // Hover preview: cells between anchor and current hover that aren't start/end
        const isPreview = isSelecting && day !== null && !iS && !iE && !iR &&
          (isBetween(dateStr, selection.start, hoverDate) || dateStr === hoverDate);

        return (
          <DayCell
            key={idx}
            day={day}
            dateStr={dateStr}
            mmdd={day !== null ? `${mm}-${dd}` : ''}
            isToday={day !== null && dateStr === today}
            isStart={iS}
            isEnd={iE}
            inRange={iR}
            isHoverPreview={isPreview}
            isWeekend={isWknd}
            hasNote={day !== null && noteKeySet.has(dateStr)}
            holidayName={holiday}
            onMouseDown={onDayMouseDown}
            onMouseEnter={onDayMouseEnter}
            onMouseUp={onDayMouseUp}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
        );
      })}
    </div>
  );
}
