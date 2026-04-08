import type { MonthMeta, NoteColor } from './types';

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const HOLIDAYS: Readonly<Record<string, string>> = {
  '01-01': "New Year's Day",
  '01-14': 'Makar Sankranti',
  '01-26': 'Republic Day',
  '03-25': 'Holi',
  '04-14': 'Dr. Ambedkar Jayanti',
  '04-18': 'Good Friday',
  '05-01': 'Labour Day',
  '08-15': 'Independence Day',
  '10-02': 'Gandhi Jayanti',
  '10-12': 'Dussehra',
  '11-01': 'Diwali',
  '11-15': 'Guru Nanak Jayanti',
  '12-25': 'Christmas',
};

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; chip: string }> = {
  default: { bg: 'var(--accent-light)', border: 'var(--accent)', chip: 'var(--accent)' },
  rose:    { bg: '#fff1f2', border: '#fb7185', chip: '#e11d48' },
  amber:   { bg: '#fffbeb', border: '#fbbf24', chip: '#d97706' },
  emerald: { bg: '#ecfdf5', border: '#34d399', chip: '#059669' },
  violet:  { bg: '#f5f3ff', border: '#a78bfa', chip: '#7c3aed' },
};

export const MONTH_META: MonthMeta[] = [
  {
    url: 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?auto=format&fit=crop&w=800&q=80',
    alt: 'Snowy mountain peaks',
    accentColor: '#2563EB', accentLight: '#DBEAFE', accentRgb: '37,99,235',
    gradient: 'linear-gradient(160deg,#1e3a5f,#2563EB)',
  },
  {
    url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    alt: 'Misty winter forest',
    accentColor: '#7C3AED', accentLight: '#EDE9FE', accentRgb: '124,58,237',
    gradient: 'linear-gradient(160deg,#2d1b69,#7C3AED)',
  },
  {
    url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?auto=format&fit=crop&w=800&q=80',
    alt: 'Cherry blossoms',
    accentColor: '#DB2777', accentLight: '#FCE7F3', accentRgb: '219,39,119',
    gradient: 'linear-gradient(160deg,#831843,#DB2777)',
  },
  {
    url: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=800&q=80',
    alt: 'Spring meadow',
    accentColor: '#16A34A', accentLight: '#DCFCE7', accentRgb: '22,163,74',
    gradient: 'linear-gradient(160deg,#14532d,#16A34A)',
  },
  {
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    alt: 'Vibrant flowers',
    accentColor: '#EA580C', accentLight: '#FFEDD5', accentRgb: '234,88,12',
    gradient: 'linear-gradient(160deg,#7c2d12,#EA580C)',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    alt: 'Tropical beach',
    accentColor: '#0891B2', accentLight: '#CFFAFE', accentRgb: '8,145,178',
    gradient: 'linear-gradient(160deg,#164e63,#0891B2)',
  },
  {
    url: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=800&q=80',
    alt: 'Golden summer fields',
    accentColor: '#D97706', accentLight: '#FEF3C7', accentRgb: '217,119,6',
    gradient: 'linear-gradient(160deg,#78350f,#D97706)',
  },
  {
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    alt: 'Late summer landscape',
    accentColor: '#DC2626', accentLight: '#FEE2E2', accentRgb: '220,38,38',
    gradient: 'linear-gradient(160deg,#7f1d1d,#DC2626)',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    alt: 'Autumn forest',
    accentColor: '#B45309', accentLight: '#FEF3C7', accentRgb: '180,83,9',
    gradient: 'linear-gradient(160deg,#451a03,#B45309)',
  },
  {
    url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=800&q=80',
    alt: 'Fall foliage',
    accentColor: '#C2410C', accentLight: '#FFEDD5', accentRgb: '194,65,12',
    gradient: 'linear-gradient(160deg,#431407,#C2410C)',
  },
  {
    url: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=800&q=80',
    alt: 'Misty November morning',
    accentColor: '#475569', accentLight: '#F1F5F9', accentRgb: '71,85,105',
    gradient: 'linear-gradient(160deg,#0f172a,#475569)',
  },
  {
    url: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?auto=format&fit=crop&w=800&q=80',
    alt: 'Snowy December landscape',
    accentColor: '#1D4ED8', accentLight: '#DBEAFE', accentRgb: '29,78,216',
    gradient: 'linear-gradient(160deg,#1e1b4b,#1D4ED8)',
  },
];
