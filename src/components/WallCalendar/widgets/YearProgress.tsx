// YearProgress — shows day-of-year and % progress near the panel header
// Purely additive widget; injected as a sibling, not inside existing header
import { useState } from 'react';
import widgetStyles from './widgets.module.css';

interface YearProgressProps {
  year: number;
  month: number; // 0-indexed
}

export default function YearProgress({ year }: YearProgressProps) {
  const [hovered, setHovered] = useState(false);
  const now = new Date();

  // Only show for current year
  if (now.getFullYear() !== year) return null;

  const start     = new Date(year, 0, 1);
  const dayOfYear = Math.ceil((now.getTime() - start.getTime()) / 86400000);
  const isLeap    = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;
  const pct       = Math.round((dayOfYear / totalDays) * 100);
  const remaining = totalDays - dayOfYear;

  return (
    <div
      className={widgetStyles.yearProgress}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <div className={widgetStyles.yearProgressBar}>
        <div
          className={widgetStyles.yearProgressFill}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={widgetStyles.yearProgressLabel}>
        {pct}%
      </span>
      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 10px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#f1f5f9',
          fontSize: '11px',
          lineHeight: '1.6',
          padding: '8px 12px',
          borderRadius: '10px',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          zIndex: 200,
          pointerEvents: 'none',
          border: '1px solid rgba(255,255,255,0.07)',
          animation: 'none',
        }}>
          <div style={{ fontWeight: 800, marginBottom: 2 }}>📅 Day {dayOfYear} of {totalDays}</div>
          <div style={{ color: '#94a3b8' }}>{remaining} days remaining in {year}</div>
        </div>
      )}
    </div>
  );
}
