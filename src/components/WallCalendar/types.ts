export interface DateRange {
  start: string | null; // ISO "YYYY-MM-DD"
  end: string | null;
}

export interface Note {
  dateKey: string; // "YYYY-MM-DD" | "YYYY-MM-DD_YYYY-MM-DD" | "monthly-YYYY-MM"
  label: string;
  text: string;
  color: NoteColor;
}

export type NoteColor = 'default' | 'rose' | 'amber' | 'emerald' | 'violet';

export interface MonthMeta {
  url: string;
  alt: string;
  accentColor: string;
  accentLight: string;
  accentRgb: string; // "r, g, b"
  gradient: string;
}
