// EarthOrbitWidget — small SVG showing Earth's approximate position by month
// Toggleable, self-contained, placed outside the calendar card
import { useState } from 'react';
import widgetStyles from './widgets.module.css';

interface EarthOrbitWidgetProps {
  month: number; // 0-indexed
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// A handful of static star positions (deterministic, no random)
const STARS = [
  [12,8],[28,22],[48,6],[72,14],[92,28],[108,10],[118,38],
  [8,52],[22,68],[38,88],[58,72],[78,92],[98,78],[112,62],
  [18,108],[42,118],[68,104],[88,116],[106,98],[120,112],
];

export default function EarthOrbitWidget({ month }: EarthOrbitWidgetProps) {
  const [visible, setVisible] = useState(false);

  const cx = 65, cy = 65, rx = 44, ry = 30;

  // Earth angle: Jan starts at top (-90°), each month = 30°
  const angleDeg = (month / 12) * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const ex = cx + rx * Math.cos(angleRad);
  const ey = cy + ry * Math.sin(angleRad);

  return (
    <div className={widgetStyles.orbitWidget}>
      <button
        className={widgetStyles.orbitToggle}
        onClick={() => setVisible((v) => !v)}
        title="Earth–Sun position"
        aria-label="Toggle Earth orbit widget"
        type="button"
      >
        🌍
      </button>
      {visible && (
        <div className={widgetStyles.orbitPanel}>
          <div className={widgetStyles.orbitTitle}>Earth's Position · {MONTH_LABELS[month]}</div>
          <svg width="130" height="130" viewBox="0 0 130 130" aria-hidden="true">
            {/* Star field */}
            {STARS.map(([sx, sy], i) => (
              <circle key={i} cx={sx} cy={sy} r={0.8} fill="rgba(255,255,255,0.55)" />
            ))}

            {/* Orbit path */}
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
              fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" strokeDasharray="4 3" />

            {/* Month tick marks */}
            {MONTH_LABELS.map((label, i) => {
              const a = ((i / 12) * 360 - 90) * Math.PI / 180;
              const tx = cx + (rx + 10) * Math.cos(a);
              const ty = cy + (ry + 10) * Math.sin(a);
              const isActive = i === month;
              return (
                <text key={i} x={tx} y={ty}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={isActive ? 7.5 : 6}
                  fontWeight={isActive ? '800' : '400'}
                  fill={isActive ? '#fbbf24' : 'rgba(255,255,255,0.28)'}
                >
                  {label}
                </text>
              );
            })}

            {/* Sun glow layers */}
            <circle cx={cx} cy={cy} r={16} fill="rgba(251,191,36,0.06)" />
            <circle cx={cx} cy={cy} r={11} fill="rgba(251,191,36,0.14)" />
            <circle cx={cx} cy={cy} r={7}  fill="#fbbf24" />
            {/* Sun corona rays */}
            {[0,45,90,135,180,225,270,315].map((deg) => {
              const r = deg * Math.PI / 180;
              return (
                <line key={deg}
                  x1={cx + 8 * Math.cos(r)} y1={cy + 8 * Math.sin(r)}
                  x2={cx + 13 * Math.cos(r)} y2={cy + 13 * Math.sin(r)}
                  stroke="rgba(251,191,36,0.4)" strokeWidth="1" strokeLinecap="round"
                />
              );
            })}

            {/* Earth orbit trail (arc from prev month to current) */}
            {(() => {
              const prevAngle = ((month - 1) / 12) * 360 - 90;
              const pa = prevAngle * Math.PI / 180;
              const px = cx + rx * Math.cos(pa);
              const py = cy + ry * Math.sin(pa);
              return (
                <path
                  d={`M ${px} ${py} A ${rx} ${ry} 0 0 1 ${ex} ${ey}`}
                  fill="none"
                  stroke="rgba(59,130,246,0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })()}

            {/* Earth glow */}
            <circle cx={ex} cy={ey} r={9}  fill="rgba(59,130,246,0.12)" />
            <circle cx={ex} cy={ey} r={6}  fill="rgba(59,130,246,0.22)" />
            {/* Earth */}
            <circle cx={ex} cy={ey} r={4.5} fill="#3b82f6" />
            {/* Earth highlight */}
            <circle cx={ex - 1.2} cy={ey - 1.2} r={1.5} fill="rgba(255,255,255,0.45)" />
          </svg>
          <div className={widgetStyles.orbitNote}>
            Month {month + 1} of 12 · {Math.round((month / 12) * 100)}% through orbit
          </div>
        </div>
      )}
    </div>
  );
}
