import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useJsonData } from './useJsonData';
import widgetStyles from './widgets.module.css';

interface CalEvent {
  key: string; name: string; emoji: string;
  type: string; color: string; desc: string;
}

export default function EventBadge({ mmdd }: { mmdd: string }) {
  const events = useJsonData<CalEvent[]>('/data/events.json');
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const event = events?.find((e) => e.key === mmdd);
  if (!event) return null;

  const show = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top + window.scrollY });
    }
  };

  // Pick icon path based on event type
  const iconPath = getIconPath(event.type);

  return (
    <div className={widgetStyles.eventBadgeWrap}>
      <div
        ref={ref}
        className={widgetStyles.eventPill}
        style={{ background: event.color }}
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
        aria-label={event.name}
        role="img"
        title={event.name}
      >
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={iconPath} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {pos && createPortal(
        <div
          className={widgetStyles.eventCard}
          role="tooltip"
          style={{ left: pos.x, top: pos.y }}
        >
          <div className={widgetStyles.eventCardHeader} style={{ background: event.color }}>
            {/* SVG icon in header */}
            <span className={widgetStyles.eventCardIconWrap}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d={iconPath} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <strong>{event.name}</strong>
            <span className={widgetStyles.eventType}>{event.type}</span>
          </div>
          <p className={widgetStyles.eventDesc}>{event.desc}</p>
        </div>,
        document.body
      )}
    </div>
  );
}

/** Returns an SVG path string based on event type */
function getIconPath(type: string): string {
  switch (type) {
    case 'celestial':
      // Star / sparkle
      return 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z';
    case 'national':
      // Flag
      return 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7';
    case 'cultural':
      // Sparkles
      return 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z';
    case 'global':
    default:
      // Globe
      return 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z';
  }
}
