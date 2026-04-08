import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useJsonData } from './useJsonData';
import widgetStyles from './widgets.module.css';

interface CalEvent { key: string; name: string; emoji: string; type: string; color: string; desc: string; }

export default function EventBadge({ mmdd }: { mmdd: string }) {
  const events = useJsonData<CalEvent[]>('/data/events.json');
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const event = events?.find((e) => e.key === mmdd);
  if (!event) return null;

  const show = () => {
    timer.current = setTimeout(() => {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        setPos({ x: r.left + r.width / 2, y: r.top + window.scrollY });
      }
    }, 200);
  };
  const hide = () => { if (timer.current) clearTimeout(timer.current); setPos(null); };

  return (
    <div className={widgetStyles.eventBadgeWrap}>
      <span ref={ref} className={widgetStyles.eventEmoji}
        onMouseEnter={show} onMouseLeave={hide}
        aria-label={event.name} role="img">
        {event.emoji}
      </span>
      {pos && createPortal(
        <div className={widgetStyles.eventCard} style={{ left: pos.x, top: pos.y }}>
          <div className={widgetStyles.eventCardHeader}
            style={{ background: `linear-gradient(135deg, ${event.color}dd, ${event.color}88)` }}>
            <span style={{ fontSize: 18 }}>{event.emoji}</span>
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
