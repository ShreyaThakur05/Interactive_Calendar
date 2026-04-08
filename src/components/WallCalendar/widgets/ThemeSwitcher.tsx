// ThemeSwitcher — 5 themes via CSS class on <html>, persisted to localStorage
import { useState, useEffect, useRef } from 'react';
import widgetStyles from './widgets.module.css';

export type Theme = 'light' | 'dark' | 'nature' | 'cosmic' | 'minimal';

const THEMES: { id: Theme; label: string; emoji: string; swatch: string }[] = [
  { id: 'light',   label: 'Light',   emoji: '☀️',  swatch: '#eef2f7' },
  { id: 'dark',    label: 'Dark',    emoji: '🌙',  swatch: '#0f172a' },
  { id: 'nature',  label: 'Nature',  emoji: '🌿',  swatch: '#16a34a' },
  { id: 'cosmic',  label: 'Cosmic',  emoji: '🌌',  swatch: '#4f46e5' },
  { id: 'minimal', label: 'Minimal', emoji: '◻️',  swatch: '#e5e5e5' },
];

const STORAGE_KEY = 'wallcalendar_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme;
    return (saved && THEMES.some(t => t.id === saved)) ? saved : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme: setThemeState };
}

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export default function ThemeSwitcher({ theme, setTheme }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = THEMES.find((t) => t.id === theme);

  return (
    <div className={widgetStyles.themeSwitcher} ref={ref}>
      <button
        className={widgetStyles.themeToggleBtn}
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch theme"
        title={`Theme: ${current?.label}`}
        type="button"
      >
        {current?.emoji ?? '☀️'}
      </button>
      {open && (
        <div className={widgetStyles.themeMenu}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`${widgetStyles.themeOption} ${theme === t.id ? widgetStyles.themeOptionActive : ''}`}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              type="button"
            >
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: t.swatch,
                border: '1.5px solid rgba(0,0,0,0.12)',
                flexShrink: 0,
                display: 'inline-block',
              }} />
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
