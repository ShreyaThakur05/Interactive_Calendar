import { useState, useEffect, useMemo } from 'react';
import type { Note, NoteColor } from './types';
import { NOTE_COLORS } from './constants';
import styles from './WallCalendar.module.css';

interface NotesPanelProps {
  notes: Note[];
  activeNoteKey: string | null;
  monthKey: string;
  currentMonthLabel: string;
  onNoteChange: (key: string, text: string) => void;
  onNoteColorChange: (key: string, color: NoteColor) => void;
  onDeleteNote: (key: string) => void;
}

const COLOR_OPTIONS: NoteColor[] = ['default', 'rose', 'amber', 'emerald', 'violet'];
const TAB_H = 30; // px each buried tab peeks out

export default function NotesPanel({
  notes, activeNoteKey, monthKey, currentMonthLabel,
  onNoteChange, onNoteColorChange, onDeleteNote,
}: NotesPanelProps) {
  const monthlyKey  = `monthly-${monthKey}`;
  const monthlyNote = notes.find((n) => n.dateKey === monthlyKey);

  const [yyyy, mm] = monthKey.split('-');
  const monthNotes = useMemo(() => notes.filter((n) => {
    if (n.dateKey === monthlyKey) return false;
    return n.dateKey.split('_')[0].startsWith(`${yyyy}-${mm}`);
  }), [notes, monthlyKey, yyyy, mm]);

  const [topKey, setTopKey] = useState<string | null>(
    () => monthNotes.length > 0 ? monthNotes[monthNotes.length - 1].dateKey : null
  );

  useEffect(() => {
    if (activeNoteKey && activeNoteKey !== monthlyKey) setTopKey(activeNoteKey);
  }, [activeNoteKey, monthlyKey]);

  useEffect(() => {
    if (monthNotes.length > 0) {
      setTopKey((prev) => {
        const exists = monthNotes.some((n) => n.dateKey === prev);
        return exists ? prev : monthNotes[monthNotes.length - 1].dateKey;
      });
    } else {
      setTopKey(null);
    }
  }, [monthNotes]);

  const topNote    = monthNotes.find((n) => n.dateKey === topKey) ?? monthNotes[0] ?? null;
  const buriedNotes = monthNotes.filter((n) => n.dateKey !== topNote?.dateKey);

  return (
    <div className={styles.notesPanel}>

      {/* ── Monthly memo ── */}
      <div className={styles.notesMemo}>
        <div className={styles.notesSectionHead}>
          <IconDoc />
          <span>{currentMonthLabel}</span>
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Monthly memo…"
          value={monthlyNote?.text ?? ''}
          onChange={(e) => onNoteChange(monthlyKey, e.target.value)}
          rows={2}
          aria-label="Monthly memo"
        />
      </div>

      {/* ── Stacked deck ── */}
      <div className={styles.notesAllSection}>
        <div className={styles.notesSectionHead}>
          <IconStack />
          <span>Notes</span>
          {monthNotes.length > 0 && (
            <span className={styles.badge}>{monthNotes.length}</span>
          )}
          {monthNotes.length > 1 && (
            <span className={styles.deckHint}>click a tab to switch</span>
          )}
        </div>

        {monthNotes.length === 0 ? (
          <div className={styles.emptyDeck}>
            <IconPencil />
            <span>Click a date or drag a range<br />to create a note</span>
          </div>
        ) : (
          <div
            className={styles.deckContainer}
            style={{ paddingBottom: buriedNotes.length * TAB_H }}
          >
            {/* ── Top card ── */}
            {topNote && (
              <div
                className={styles.deckCardTop}
                style={{ '--chip': NOTE_COLORS[topNote.color].chip } as React.CSSProperties}
              >
                {/* Colored header bar */}
                <div className={styles.deckHeader}>
                  <div className={styles.deckHeaderLeft}>
                    <span className={styles.deckHeaderLabel}>{topNote.label}</span>
                    {topNote.text && (
                      <span className={styles.deckHeaderWordCount}>
                        {topNote.text.trim().split(/\s+/).filter(Boolean).length}w
                      </span>
                    )}
                  </div>
                  <div className={styles.deckHeaderRight}>
                    <ColorPicker
                      value={topNote.color}
                      onChange={(c) => onNoteColorChange(topNote.dateKey, c)}
                    />
                    <button
                      className={styles.deckDeleteBtn}
                      onClick={() => onDeleteNote(topNote.dateKey)}
                      aria-label={`Delete note for ${topNote.label}`}
                      type="button"
                    >
                      <IconX size={10} />
                    </button>
                  </div>
                </div>

                {/* Ruled paper body */}
                <div className={styles.deckBody}>
                  <textarea
                    className={styles.deckTextarea}
                    value={topNote.text}
                    onChange={(e) => onNoteChange(topNote.dateKey, e.target.value)}
                    placeholder="Write your note here…"
                    aria-label={`Note for ${topNote.label}`}
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* ── Buried tabs ── */}
            {buriedNotes.map((note, i) => {
              const colors = NOTE_COLORS[note.color];
              // Stack from bottom: i=0 is lowest (furthest back)
              const bottom = i * TAB_H;
              // Slight horizontal offset for physical stack feel
              const offsetX = (buriedNotes.length - 1 - i) * 2;
              return (
                <button
                  key={note.dateKey}
                  className={styles.deckTabBuried}
                  style={{
                    bottom,
                    zIndex: i + 1,
                    background: colors.bg,
                    borderColor: colors.border,
                    transform: `translateX(${offsetX}px)`,
                  }}
                  onClick={() => setTopKey(note.dateKey)}
                  aria-label={`Switch to note: ${note.label}`}
                  type="button"
                >
                  <span
                    className={styles.deckTabPip}
                    style={{ background: colors.chip }}
                  />
                  <span className={styles.deckTabLabel}>{note.label}</span>
                  {note.text ? (
                    <span className={styles.deckTabPreview}>
                      {note.text.slice(0, 28)}{note.text.length > 28 ? '\u2026' : ''}
                    </span>
                  ) : (
                    <span className={styles.deckTabEmpty}>Empty</span>
                  )}
                  <button
                    type="button"
                    className={styles.deckDeleteBtn}
                    style={{ marginLeft: 'auto', flexShrink: 0 }}
                    onClick={(e) => { e.stopPropagation(); onDeleteNote(note.dateKey); }}
                    aria-label={`Delete note for ${note.label}`}
                  >
                    <IconX size={9} />
                  </button>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: NoteColor; onChange: (c: NoteColor) => void }) {
  return (
    <div className={styles.colorPicker} role="group" aria-label="Note color">
      {COLOR_OPTIONS.map((c) => (
        <button
          key={c}
          type="button"
          className={`${styles.colorSwatch} ${value === c ? styles.colorSwatchActive : ''}`}
          style={{ background: NOTE_COLORS[c].chip }}
          onClick={(e) => { e.stopPropagation(); onChange(c); }}
          aria-label={`Color: ${c}`}
          aria-pressed={value === c}
        />
      ))}
    </div>
  );
}

function IconDoc() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}
function IconStack() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}
function IconPencil() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function IconX({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
