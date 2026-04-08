import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useJsonData } from './useJsonData';
import widgetStyles from './widgets.module.css';

interface FactTooltipProps {
  mmdd: string;
  children: React.ReactNode;
}

export default function FactTooltip({ mmdd, children }: FactTooltipProps) {
  const facts = useJsonData<Record<string, string>>('/data/facts.json');
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fact = facts?.[mmdd];

  const show = () => {
    if (!fact) return;
    timerRef.current = setTimeout(() => {
      if (wrapRef.current) {
        const r = wrapRef.current.getBoundingClientRect();
        setPos({ x: r.left + r.width / 2, y: r.top + window.scrollY });
      }
    }, 500);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPos(null);
  };

  // Wrap with a display:contents div so layout is completely unaffected
  // The div is invisible to layout but captures mouse events
  return (
    <>
      <div
        ref={wrapRef}
        style={{ display: 'contents' }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </div>
      {pos && fact && createPortal(
        <div
          className={widgetStyles.tooltip}
          role="tooltip"
          style={{ left: pos.x, top: pos.y }}
        >
          <span className={widgetStyles.tooltipIcon}>💡</span>
          {fact}
        </div>,
        document.body
      )}
    </>
  );
}
