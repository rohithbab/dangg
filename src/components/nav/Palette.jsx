import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';
import { DASHBOARD_NAV_ITEMS } from '../../routes/dashboardRoutes';
import { logout } from '../../lib/auth';

/**
 * COMMAND PALETTE — ⌘K / Ctrl-K
 *
 * The primary navigation for anyone on a keyboard, and the reason the dock is
 * allowed to fade out of the way. Fuzzy-ish subsequence matching so "pyt"
 * finds Payout; full keyboard control; Escape closes.
 */

/* Subsequence match — every query char appears in order. Cheap and forgiving. */
function matches(haystack, query) {
  if (!query) return true;
  const h = haystack.toLowerCase();
  const q = query.toLowerCase();
  let i = 0;
  for (const ch of h) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return i === q.length;
}

/* Exported wrapper: keying the inner component on `open` remounts it each time
   the palette is opened, so query/cursor start fresh without an effect that
   writes state on every open. */
export function Palette({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && <PaletteInner key="palette" onClose={onClose} />}
    </AnimatePresence>
  );
}

function PaletteInner({ onClose }) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => {
    const nav = DASHBOARD_NAV_ITEMS.map((i) => ({
      id: i.id,
      icon: i.icon,
      label: i.label,
      hint: i.title || 'Go to page',
      run: () => navigate(i.path),
    }));
    return [
      ...nav,
      {
        id: '_reload',
        icon: 'refresh',
        label: 'Refresh data',
        hint: 'Re-run queries on this page',
        run: () => window.location.reload(),
      },
      {
        id: '_logout',
        icon: 'logout',
        label: 'Log out',
        hint: 'End this admin session',
        run: () => { logout(); navigate('/login', { replace: true }); },
      },
    ];
  }, [navigate]);

  const results = useMemo(
    () => commands.filter((c) => matches(c.label + ' ' + c.hint, query)),
    [commands, query],
  );

  /* Focus on mount. The component is remounted per open (see Palette), so
     there is no state to reset here. */
  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  /* Cursor resets on every keystroke — derived from the query, so it is set in
     the change handler rather than an effect. */
  const onQueryChange = (e) => {
    setQuery(e.target.value);
    setCursor(0);
  };

  /* Lock background scroll while open. */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (c + 1) % Math.max(results.length, 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % Math.max(results.length, 1));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = results[cursor];
      if (cmd) { cmd.run(); onClose(); }
    }
  };

  return (
    <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* scrim */}
          <div
            className="absolute inset-0 bg-ink/25 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 460, damping: 34 }}
            onKeyDown={onKeyDown}
            className="relative w-full max-w-lg overflow-hidden rounded-card border
                       border-white/60 bg-card-raised/95 shadow-pop backdrop-blur-2xl"
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-hairline px-4">
              <MaterialIcon name="search" size="sm" className="shrink-0 text-ink-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={onQueryChange}
                placeholder="Jump to a page or run a command…"
                aria-label="Search commands"
                className="w-full border-0 bg-transparent py-4 text-body text-ink
                           placeholder:text-ink-3 focus:outline-none focus:ring-0"
              />
              <kbd className="hidden shrink-0 rounded-md bg-canvas-sunk px-1.5 py-0.5
                              text-label-xs text-ink-3 sm:block">
                ESC
              </kbd>
            </div>

            {/* results */}
            <ul className="max-h-[46vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-body-sm text-ink-3">
                  Nothing matches “{query}”
                </li>
              )}
              {results.map((c, i) => {
                const on = i === cursor;
                return (
                  <li key={c.id} role="option" aria-selected={on}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => { c.run(); onClose(); }}
                      className={`flex w-full items-center gap-3 rounded-well px-3 py-2.5 text-left
                                  transition-colors ${on ? 'bg-canvas-sunk' : ''}`}
                    >
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-well
                                        ${on ? 'bg-ember text-white' : 'bg-canvas-sunk text-ink-2'}`}>
                        <MaterialIcon name={c.icon} size="sm" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body font-medium text-ink">{c.label}</span>
                        <span className="block truncate text-label-xs text-ink-3">{c.hint}</span>
                      </span>
                      {on && (
                        <kbd className="hidden shrink-0 rounded-md bg-card px-1.5 py-0.5
                                        text-label-xs text-ink-3 sm:block">
                          ↵
                        </kbd>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
      </motion.div>
    </motion.div>
  );
}
