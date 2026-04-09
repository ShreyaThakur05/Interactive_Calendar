# Interactive Wall Calendar

A highly interactive, polished React wall calendar with range selection, per-date notes, holiday indicators, smooth animations, glassmorphic popups, and a rich widget ecosystem.

**Live Demo:** [https://github.com/ShreyaThakur05/Interactive_Calendar](https://github.com/ShreyaThakur05/Interactive_Calendar)

---

## Features

### Core Calendar
- **Month navigation** — keyboard arrows (`←` / `→`), swipe gestures on touch, and nav buttons with smooth fade-scale transition
- **Card entrance animation** — calendar slides up and fades in on load
- **Drag-to-select date ranges** — real-time hover preview using the Pointer Events API; works on both mouse and touch
- **Per-date and range notes** — click a day or drag a range to open a stacked note deck
- **Monthly memo** — always-visible textarea for the current month
- **Holiday indicators** — amber dot on Indian public holidays (13 defined)
- **Today highlight** — filled accent circle with outer pulse ring on the current date
- **"Today" button** — jumps back to the current month
- **Dynamic accent colors** — each month has its own color palette via CSS custom properties (`--accent`, `--accent-light`, `--accent-rgb`)
- **Spiral binding** — 13 decorative 3D metallic rings above the card with hover lift animation
- **Geometric SVG overlay** — layered triangular accent shapes on the hero image
- **Parallax hero image** — mouse-tracking tilt effect on desktop
- **Ken Burns effect** — slow zoom animation on hero image when loaded
- **Adjacent month preloading** — silently preloads prev/next hero images
- **Responsive layout** — stacks vertically on mobile, side-by-side on desktop; hero image uses `object-position: center top` on mobile to prevent cutoff
- **Notes persistence** — all notes saved to `localStorage` and restored on reload
- **Note color labels** — 5 color options (default, rose, amber, emerald, violet) per note
- **Delete notes** — delete button on both the active top card and all buried tab notes
- **Word count** — live word count shown on the active note card
- **Stacked note deck** — buried notes peek as tabs below the active card; click to bring to front

### Widgets

| Widget | Description |
|---|---|
| **MonthHeroStrip** | Full-width gradient banner above the card with month emoji, theme tagline, and a 12-dot month progress indicator |
| **YearProgress** | Mini progress bar + percentage showing how far through the year we are; hover reveals day-of-year tooltip |
| **EarthOrbitWidget** | Toggleable SVG diagram showing Earth's approximate orbital position for the current month, with star field, sun corona rays, orbit trail, and month tick labels |
| **ThemeSwitcher** | 5 themes (Light, Dark, Nature, Cosmic, Minimal) with color swatches, applied via `data-theme` on `<html>`, persisted to `localStorage`; closes on outside click |
| **EventBadge** | Emoji icon on day cells for notable events (from `/data/events.json`); hover shows a glassmorphic portal tooltip card |
| **ZodiacStrip** | Thin colored strip at the bottom of day cells showing the zodiac sign (from `/data/zodiac.json`); hover shows sign details in a portal card |
| **FactBadge** | Lightbulb SVG icon on days with a historical fact (from `/data/facts.json`); hover shows a "Did you know?" glassmorphic portal card |

### Popup / Tooltip System
- All tooltips (Fact, Event, Zodiac) use **`createPortal`** to render into `document.body`
- **`position: fixed`** with mouse coordinates — renders above all content, never clipped by parent overflow
- **Glassmorphic design** — `backdrop-filter: blur(20px)`, dark semi-opaque background, subtle rim light border
- **Spring bounce entrance** — `cubic-bezier(0.34, 1.56, 0.64, 1)` animation with slight overshoot
- `z-index: 99999` — always on top

### Theme System
- 5 themes: **Light**, **Dark**, **Nature**, **Cosmic**, **Minimal**
- Theme applied via `data-theme` attribute on `<html>` element
- CSS variables (`--card-bg`, `--panel-bg`, `--text-primary`, `--border`, `--surface`) update per theme
- Theme persisted to `localStorage` under key `wallcalendar_theme`
- Inline `<script>` in `index.html` applies saved theme before React renders — zero flash of wrong theme

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** + **TypeScript** | UI framework |
| **Vite 8** | Dev server and production build |
| **CSS Modules** | Scoped styles, no CSS-in-JS runtime |
| **Vanilla `Date` API** | No date library needed |
| **`createPortal`** | Tooltip rendering above all content |
| **Pointer Events API** | Touch + mouse drag selection |

> Framer Motion is installed as a dependency but is not used in the critical render path — removed from MonthHeroStrip to fix React StrictMode double-invoke issues.

---

## Data Files (`/public/data/`)

| File | Contents |
|---|---|
| `events.json` | 20 notable events with name, emoji, type, color, and description |
| `facts.json` | 34 historical facts keyed by `MM-DD` |
| `months.json` | Per-month theme name, tagline, emoji, and gradient palette |
| `zodiac.json` | 12 zodiac signs with date ranges, element, color, and trait |

All JSON files are fetched once and cached in module scope via the `useJsonData` hook — no redundant network requests across widget instances. Uses a pub/sub `listeners` map so multiple components share one fetch.

---

## Design Decisions

### No date library
The vanilla JS `Date` API is sufficient for month grids, ISO string formatting, and day-of-week offsets. Adding `date-fns` or `dayjs` would add ~10–20 KB for no benefit.

### Pointer Events for touch drag
Mouse events don't fire reliably during touch drags. Using `onPointerDown/Move/Up` with `setPointerCapture` ensures the drag target receives all subsequent pointer events even when the finger moves across other cells.

### Dynamic accent colors via CSS custom properties
Each month defines `accentColor`, `accentLight`, and `accentRgb`. On month change, a `useEffect` writes these to `--accent`, `--accent-light`, and `--accent-rgb` on `:root`. All selection, header, and indicator styles reference these variables — no prop drilling needed.

### React.memo on DayCell
The grid renders up to 42 cells. Memoizing `DayCell` with primitive props (strings, booleans) prevents re-rendering unaffected cells during hover/selection updates.

### Module-level JSON cache in useJsonData
The `useJsonData` hook stores fetched JSON in a module-level `cache` object and uses a pub/sub `listeners` map. Multiple widget instances on the same page share one fetch and one cached result — no `Context` or global store needed.

### createPortal for tooltips
Tooltips rendered inside day cells would be clipped by `overflow: hidden` on parent containers. Using `createPortal` to render into `document.body` with `position: fixed` and mouse coordinates solves this completely.

### Theme flash prevention
`useTheme` sets `data-theme` via `useEffect` which runs after paint. To prevent a flash of the wrong theme, an inline `<script>` in `index.html` reads `localStorage` and sets `data-theme` synchronously before React loads.

### Notes persistence
Notes are stored in `localStorage` under the key `wallcalendar_notes` and loaded synchronously as the initial `useState` value. Theme preference is stored separately under `wallcalendar_theme`.

---

## File Structure

```
public/
  data/
    events.json        ← notable events per MM-DD
    facts.json         ← historical facts per MM-DD
    months.json        ← per-month theme/tagline/palette
    zodiac.json        ← zodiac sign date ranges and traits
src/
  components/
    WallCalendar/
      widgets/
        EarthOrbitWidget.tsx   ← SVG orbital diagram with star field
        EventBadge.tsx         ← event emoji + glassmorphic portal card
        FactTooltip.tsx        ← (legacy, unused — replaced by FactBadge in DayCell)
        MonthHeroStrip.tsx     ← gradient banner above card with progress dots
        ThemeSwitcher.tsx      ← 5-theme switcher + useTheme hook
        useJsonData.ts         ← cached JSON fetch hook with pub/sub
        widgets.module.css     ← all widget styles including glassmorphic cards
        YearProgress.tsx       ← year % progress bar with hover tooltip
        ZodiacStrip.tsx        ← zodiac strip + portal tooltip card
      index.tsx              ← root component, all state
      HeroPanel.tsx          ← image + parallax + Ken Burns + nav arrows
      CalendarGrid.tsx       ← 7-column date grid
      DayCell.tsx            ← memoized single day cell + FactBadge + EventBadge + ZodiacStrip
      NotesPanel.tsx         ← monthly memo + stacked note deck with delete buttons
      constants.ts           ← HOLIDAYS, MONTH_META, NOTE_COLORS, WEEKDAYS
      types.ts               ← DateRange, Note, NoteColor, MonthMeta
      utils.ts               ← toISO, buildMonthGrid, shortDate, isBetween, isRangeStart, isRangeEnd
      WallCalendar.module.css ← all calendar styles + animations
  App.tsx
  index.css              ← global styles + theme variable overrides
  main.tsx
index.html               ← theme flash prevention script
```

---

## Author

**Shreya Thakur** — [@ShreyaThakur05](https://github.com/ShreyaThakur05)
