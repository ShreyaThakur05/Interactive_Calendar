# Interactive Wall Calendar

A highly interactive, polished React wall calendar with range selection, per-date notes, holiday indicators, smooth flip animations, and a rich widget ecosystem.

## Live Features

### Core Calendar
- **Month navigation** with 3D flip animation (perspective rotateX), keyboard arrows (`←` / `→`), and swipe gestures
- **Drag-to-select date ranges** with real-time hover preview using the Pointer Events API
- **Per-date and range notes** — click a day or drag a range to open a stacked note deck
- **Monthly memo** — always-visible textarea for the current month
- **Holiday indicators** — dot + tooltip for Indian public holidays (13 holidays defined)
- **Today highlight** — accent-colored ring on the current date
- **"Today" button** — jumps back to the current month with a directional flip animation
- **Dynamic accent colors** — each month has its own color palette applied via CSS custom properties (`--accent`, `--accent-light`, `--accent-rgb`)
- **Spiral binding** — 13 decorative rings rendered above the card
- **Geometric SVG overlay** — layered triangular accent shapes on the hero image
- **Parallax hero image** — mouse-tracking tilt effect on the left panel image
- **Adjacent month preloading** — silently preloads prev/next hero images
- **Responsive layout** — stacks vertically on mobile, side-by-side on desktop
- **Notes persistence** — all notes saved to `localStorage` and restored on reload
- **Note color labels** — 5 color options (default, rose, amber, emerald, violet) per note
- **Word count** — live word count shown on the active note card

### Widgets
| Widget | Description |
|---|---|
| **MonthHeroStrip** | Full-width gradient banner above the card with month emoji, theme tagline, and a 12-dot progress bar |
| **YearProgress** | Mini progress bar + percentage showing how far through the year we are; hover reveals day-of-year tooltip |
| **EarthOrbitWidget** | Toggleable SVG diagram showing Earth's approximate orbital position for the current month, with star field and sun corona |
| **ThemeSwitcher** | 5 themes (Light, Dark, Nature, Cosmic, Minimal) applied via `data-theme` on `<html>`, persisted to `localStorage` |
| **EventBadge** | Colored pill on day cells for notable events (loaded from `/data/events.json`); hover shows a rich tooltip card |
| **ZodiacStrip** | Thin colored strip on day cells showing the zodiac sign (loaded from `/data/zodiac.json`); hover shows sign details |
| **FactBadge** (in DayCell) | Lightbulb icon on days with a historical fact (loaded from `/data/facts.json`); hover shows a "Did you know?" card |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** — dev server and build
- **CSS Modules** — all styles scoped, no CSS-in-JS runtime
- **Framer Motion** — available as a dependency (installed)
- No date library — vanilla `Date` API only

## Data Files (`/public/data/`)

| File | Contents |
|---|---|
| `events.json` | 20 notable events with name, emoji, type, color, and description |
| `facts.json` | 34 historical facts keyed by `MM-DD` |
| `months.json` | Per-month theme name, tagline, emoji, and gradient palette |
| `zodiac.json` | 12 zodiac signs with date ranges, element, color, and trait |

All JSON files are fetched once and cached in module scope via the `useJsonData` hook — no redundant network requests across widget instances.

## Design Decisions

### No date library
The vanilla JS `Date` API is sufficient for month grids, ISO string formatting, and day-of-week offsets. Adding `date-fns` or `dayjs` would add ~10–20 KB for no benefit.

### Pointer Events for touch
Mouse events don't fire reliably during touch drags. Using `onPointerDown/Move/Up` with `setPointerCapture` ensures the drag target receives all subsequent pointer events even when the finger moves across other cells.

### Dynamic accent colors via CSS custom properties
Each month defines `accentColor`, `accentLight`, and `accentRgb`. On month change, a `useEffect` writes these to `--accent`, `--accent-light`, and `--accent-rgb` on `:root`. All selection, header, and indicator styles reference these variables — no prop drilling needed.

### React.memo on DayCell
The grid renders up to 42 cells. Memoizing `DayCell` with primitive props (strings, booleans) prevents re-rendering unaffected cells during hover/selection updates.

### Module-level JSON cache in useJsonData
The `useJsonData` hook stores fetched JSON in a module-level `cache` object and uses a pub/sub `listeners` map. Multiple widget instances on the same page share one fetch and one cached result — no `Context` or global store needed.

### Notes persistence
Notes are stored in `localStorage` under the key `wallcalendar_notes` and loaded synchronously as the initial `useState` value. Theme preference is stored separately under `wallcalendar_theme`.

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
        EarthOrbitWidget.tsx   ← SVG orbital diagram
        EventBadge.tsx         ← event pill + tooltip card
        FactTooltip.tsx        ← reusable fact tooltip wrapper
        MonthHeroStrip.tsx     ← gradient banner above card
        ThemeSwitcher.tsx      ← 5-theme switcher + useTheme hook
        useJsonData.ts         ← cached JSON fetch hook
        widgets.module.css     ← all widget styles
        YearProgress.tsx       ← year % progress bar
        ZodiacStrip.tsx        ← zodiac strip + tooltip card
      index.tsx              ← root component, all state
      HeroPanel.tsx          ← image + parallax + nav arrows
      CalendarGrid.tsx       ← 7-column date grid
      DayCell.tsx            ← memoized single day cell + FactBadge
      NotesPanel.tsx         ← monthly memo + stacked note deck
      constants.ts           ← HOLIDAYS, MONTH_META, NOTE_COLORS, WEEKDAYS
      types.ts               ← DateRange, Note, NoteColor, MonthMeta
      utils.ts               ← toISO, buildMonthGrid, shortDate, isBetween, isRangeStart, isRangeEnd
      WallCalendar.module.css
  App.tsx
  main.tsx
```
