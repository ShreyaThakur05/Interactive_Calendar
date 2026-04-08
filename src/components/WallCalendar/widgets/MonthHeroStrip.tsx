import { useJsonData } from './useJsonData';
import widgetStyles from './widgets.module.css';

interface MonthData {
  month: number; name: string; theme: string;
  emoji: string; tagline: string; palette: string[];
}

export default function MonthHeroStrip({ month, year }: { month: number; year: number }) {
  const months = useJsonData<MonthData[]>('/data/months.json');
  const data = months?.[month] ?? null;

  if (!data) return <div style={{ width: '100%', height: 72, marginBottom: 12 }} />;

  const [c0, c1, c2] = data.palette;

  return (
    <div
      key={`hero-${month}`}
      className={widgetStyles.heroStrip}
      style={{ background: `linear-gradient(135deg, ${c0} 0%, ${c1} 55%, ${c2} 100%)` }}
    >
      <div className={widgetStyles.heroStripShimmer} />
      <span className={widgetStyles.heroStripEmoji}>{data.emoji}</span>
      <div className={widgetStyles.heroStripText}>
        <div className={widgetStyles.heroStripTheme}>{data.theme}</div>
        <div className={widgetStyles.heroStripTagline}>{data.tagline}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, zIndex: 1, position: 'relative' }}>
        <div className={widgetStyles.heroStripYear}>{data.name} · {year}</div>
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              width: i === month ? 14 : 5, height: 5, borderRadius: 3,
              background: i === month ? 'rgba(255,255,255,0.9)' : i < month ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
