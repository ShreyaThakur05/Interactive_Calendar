import { useState, useEffect, useCallback, useRef } from 'react';
import { MONTH_META, MONTH_NAMES } from './constants';
import styles from './WallCalendar.module.css';

interface HeroPanelProps {
  monthIndex: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function HeroPanel({ monthIndex, year, onPrev, onNext }: HeroPanelProps) {
  const meta = MONTH_META[monthIndex];

  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const isLoaded = loadedUrls.has(meta.url);
  const isFailed = failedUrls.has(meta.url);

  // Preload adjacent months silently
  useEffect(() => {
    const prev = MONTH_META[(monthIndex + 11) % 12].url;
    const next = MONTH_META[(monthIndex + 1)  % 12].url;
    [prev, next].forEach((url) => {
      if (!loadedUrls.has(url) && !failedUrls.has(url)) {
        const img = new Image();
        img.src = url;
        img.onload  = () => setLoadedUrls((s) => new Set(s).add(url));
        img.onerror = () => setFailedUrls((s) => new Set(s).add(url));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    setParallax({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  return (
    <div
      className={styles.heroPanel}
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient fallback */}
      <div
        className={styles.heroFallback}
        style={{ background: meta.gradient }}
        aria-hidden="true"
      />

      {/* Real image with parallax */}
      {!isFailed && (
        <img
          key={meta.url}
          src={meta.url}
          alt={meta.alt}
          className={`${styles.heroImage} ${isLoaded ? styles.heroImageVisible : ''}`}
          draggable={false}
          style={{
            transform: `scale(1.08) translate(${parallax.x}px, ${parallax.y}px)`,
            transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease',
          }}
          onLoad={() => setLoadedUrls((s) => new Set(s).add(meta.url))}
          onError={() => setFailedUrls((s) => new Set(s).add(meta.url))}
        />
      )}

      <div className={styles.heroScrim} />

      {/* Geometric accent */}
      <svg
        className={styles.heroGeometry}
        viewBox="0 0 300 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="0,160 300,0 300,160"   fill={meta.accentColor} opacity="0.82" />
        <polygon points="90,160 300,50 300,160" fill={meta.accentColor} opacity="0.48" />
        <polygon points="160,160 300,90 300,160" fill="rgba(255,255,255,0.06)" />
      </svg>

      {/* Month + year label */}
      <div className={styles.heroLabel}>
        <span className={styles.heroYear}>{year}</span>
        <span className={styles.heroMonth}>{MONTH_NAMES[monthIndex].toUpperCase()}</span>
      </div>

      <span className={styles.heroWatermark} aria-hidden="true">
        {String(monthIndex + 1).padStart(2, '0')}
      </span>

      {/* Nav arrows */}
      <button
        className={`${styles.navBtn} ${styles.navBtnPrev}`}
        onClick={onPrev}
        aria-label="Previous month"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className={`${styles.navBtn} ${styles.navBtnNext}`}
        onClick={onNext}
        aria-label="Next month"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
