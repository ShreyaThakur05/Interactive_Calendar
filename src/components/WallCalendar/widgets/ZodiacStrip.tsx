import { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useJsonData } from './useJsonData';
import widgetStyles from './widgets.module.css';

interface ZodiacEntry {
  sign: string; emoji: string;
  start: string; end: string;
  element: string; color: string; trait: string;
}

interface ZodiacStripProps { mmdd: string; }

function toNum(s: string) {
  const [m, d] = s.split('-').map(Number);
  return m * 100 + d;
}

export default function ZodiacStrip({ mmdd }: ZodiacStripProps) {
  const zodiacs = useJsonData<ZodiacEntry[]>('/data/zodiac.json');
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const zodiac = useMemo(() => {
    if (!zodiacs) return null;
    const n = toNum(mmdd);
    return zodiacs.find((z) => {
      const s = toNum(z.start), e = toNum(z.end);
      return s > e ? (n >= s || n <= e) : (n >= s && n <= e);
    }) ?? null;
  }, [zodiacs, mmdd]);

  if (!zodiac) return null;

  const show = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top + window.scrollY });
    }
  };

  return (
    <div className={widgetStyles.zodiacWrap}>
      <div
        ref={ref}
        className={widgetStyles.zodiacStrip}
        style={{ background: zodiac.color }}
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
        aria-label={`${zodiac.sign} ${zodiac.emoji}`}
      />
      {pos && createPortal(
        <div
          className={widgetStyles.zodiacCard}
          role="tooltip"
          style={{ left: pos.x, top: pos.y }}
        >
          <div className={widgetStyles.zodiacCardHead}>
            <span className={widgetStyles.zodiacEmoji}>{zodiac.emoji}</span>
            <div>
              <div className={widgetStyles.zodiacSign}>{zodiac.sign}</div>
              <div className={widgetStyles.zodiacElement} style={{ color: zodiac.color }}>
                {zodiac.element} sign
              </div>
            </div>
          </div>
          <p className={widgetStyles.zodiacTrait}>{zodiac.trait}</p>
        </div>,
        document.body
      )}
    </div>
  );
}
