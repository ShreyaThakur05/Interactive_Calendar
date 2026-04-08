import { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useJsonData } from './useJsonData';
import widgetStyles from './widgets.module.css';

interface ZodiacEntry { sign: string; emoji: string; start: string; end: string; element: string; color: string; trait: string; }

function mmddToNum(s: string) { const [m, d] = s.split('-').map(Number); return m * 100 + d; }

export default function ZodiacStrip({ mmdd }: { mmdd: string }) {
  const zodiacs = useJsonData<ZodiacEntry[]>('/data/zodiac.json');
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const zodiac = useMemo(() => {
    if (!zodiacs) return null;
    const n = mmddToNum(mmdd);
    return zodiacs.find((z) => {
      const s = mmddToNum(z.start), e = mmddToNum(z.end);
      if (s > e) return n >= s || n <= e;
      return n >= s && n <= e;
    }) ?? null;
  }, [zodiacs, mmdd]);

  if (!zodiac) return null;

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
    <div className={widgetStyles.zodiacWrap}>
      <div ref={ref} className={widgetStyles.zodiacStrip}
        style={{ background: zodiac.color }}
        onMouseEnter={show} onMouseLeave={hide}
        aria-label={`${zodiac.sign} ${zodiac.emoji}`}
      />
      {pos && createPortal(
        <div className={widgetStyles.zodiacCard} style={{ left: pos.x, top: pos.y }}>
          <div className={widgetStyles.zodiacCardHead}>
            <span className={widgetStyles.zodiacEmoji}>{zodiac.emoji}</span>
            <div>
              <div className={widgetStyles.zodiacSign}>{zodiac.sign}</div>
              <div className={widgetStyles.zodiacElement} style={{ color: zodiac.color }}>{zodiac.element} sign</div>
            </div>
          </div>
          <p className={widgetStyles.zodiacTrait}>{zodiac.trait}</p>
        </div>,
        document.body
      )}
    </div>
  );
}
