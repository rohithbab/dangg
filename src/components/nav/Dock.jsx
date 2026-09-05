import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useDragControls } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';
import { DASHBOARD_NAV_ITEMS, getNavItemByPath } from '../../routes/dashboardRoutes';

/**
 * DOCK — assistive ball navigation.
 *
 * At rest this is a small circular "ball" floating over the content. Hovering
 * (or focusing / tapping) expands it into the full nav panel; moving away
 * collapses it back. That keeps persistent chrome down to ~48px of screen.
 *
 * POSITIONING IS FREE-FORM. The ball can be dropped anywhere — a centimetre or
 * across the whole screen — and stays exactly where it is released. There is no
 * edge snapping. Its position is stored as a viewport RATIO (0..1) rather than
 * pixels, so it lands in the same relative spot after a resize or on a
 * different display, and is clamped on load so it can never end up off-screen.
 *
 * The expanded panel opens toward whichever side has room, so a ball parked in
 * a corner still reveals its full panel on-screen.
 */

const STORE_KEY = 'dangg_dock_pos';
const IDLE_MS = 4500;
const BALL = 48;          // ball diameter (px)
const MARGIN = 12;        // keep-on-screen inset (px)
const ROW = 40;           // height of one nav row in the vertical panel

const DEFAULT_POS = { rx: 0.018, ry: 0.5 };   // left edge, vertically centred

function loadPos() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return DEFAULT_POS;
    const p = JSON.parse(raw);
    if (typeof p?.rx !== 'number' || typeof p?.ry !== 'number') return DEFAULT_POS;
    return { rx: clamp01(p.rx), ry: clamp01(p.ry) };
  } catch {
    return DEFAULT_POS;
  }
}

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function Dock({ onOpenPalette }) {
  const { pathname } = useLocation();
  const active = getNavItemByPath(pathname);
  const reduce = useReducedMotion();

  const [pos, setPos] = useState(loadPos);        // ratio of viewport
  const [open, setOpen] = useState(false);        // ball ⇄ panel
  const [idle, setIdle] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [compact, setCompact] = useState(false);
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
  const [vh, setVh] = useState(() => (typeof window === 'undefined' ? 900 : window.innerHeight));

  const idleTimer = useRef(null);
  const closeTimer = useRef(null);
  const ballRef = useRef(null);
  const movedRef = useRef(false);
  const downPt = useRef({ x: 0, y: 0 });

  /* Owned explicitly so the drag offset can be reset on drop. */
  const dragControls = useDragControls();
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  /* Touch / small screens → fixed bottom bar, always expanded, not draggable. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /* Track viewport so the stored ratio always resolves to on-screen pixels. */
  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const wake = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS);
  }, []);

  useEffect(() => {
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS);
    const evts = ['pointermove', 'keydown', 'wheel', 'pointerdown'];
    evts.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      evts.forEach((e) => window.removeEventListener(e, wake));
      clearTimeout(idleTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, [wake]);

  /* Resolve ratio → pixels, clamped so the ball is always fully visible. */
  const x = clamp(pos.rx * vw, MARGIN, Math.max(MARGIN, vw - BALL - MARGIN));
  const y = clamp(pos.ry * vh, MARGIN, Math.max(MARGIN, vh - BALL - MARGIN));

  /* Open the panel toward whichever side has room. */
  const openLeft = x > vw * 0.62;    // ball is right-ish → grow leftwards

  /* The panel is a vertical column: 8 rows of 40px + gaps + 8px padding.
     It is centred on the ball, then nudged by `panelShift` so that a tall
     column parked near the top or bottom stays fully on screen. */
  const panelH = DASHBOARD_NAV_ITEMS.length * ROW + (DASHBOARD_NAV_ITEMS.length - 1) * 2 + 16;
  const ballCentreY = y + BALL / 2;
  const idealTop = ballCentreY - panelH / 2;
  const clampedTop = clamp(idealTop, MARGIN, Math.max(MARGIN, vh - panelH - MARGIN));
  const panelShift = clampedTop - idealTop;

  const handleDragEnd = (_e, info) => {
    setDragging(false);
    /* info.point is viewport-relative; store where the ball's top-left lands,
       normalised. No snapping — it stays exactly where it was dropped. */
    const nx = clamp(info.point.x - BALL / 2, MARGIN, vw - BALL - MARGIN);
    const ny = clamp(info.point.y - BALL / 2, MARGIN, vh - BALL - MARGIN);
    const next = { rx: nx / vw, ry: ny / vh };
    setPos(next);
    /* The new position is expressed as left/top, so the drag transform that
       produced it must be zeroed — otherwise the two compose and the ball
       flies off-screen. Set the motion values directly: an `animate` prop
       cannot beat the drag gesture's own writes to x/y. */
    dragX.set(0);
    dragY.set(0);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* private mode */ }
  };

  const openNow = () => { clearTimeout(closeTimer.current); setOpen(true); wake(); };
  /* Small close delay so the pointer can cross the gap into the panel. */
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 260);
  };

  const items = compact
    ? DASHBOARD_NAV_ITEMS.filter((i) =>
        ['analytics', 'revenue', 'payout', 'verification', 'users'].includes(i.id))
    : DASHBOARD_NAV_ITEMS;

  /* ── Compact: plain fixed bottom bar, no ball, no dragging ─────────────── */
  if (compact) {
    return (
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"
        style={{ pointerEvents: 'none' }}
      >
        <div style={{ pointerEvents: 'auto' }} className="dock-surface flex items-center gap-0.5 p-1.5">
          {items.map((item) => (
            <DockLink key={item.id} item={item} active={active} onNav={wake} />
          ))}
          <span className="mx-0.5 h-5 w-px shrink-0 bg-hairline" />
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Search"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-pill ${
              items.some((i) => i.id === active?.id) ? 'text-ink-2' : 'bg-ink text-ink-inverse'
            }`}
          >
            <MaterialIcon name="search" size="sm" />
          </button>
        </div>
      </nav>
    );
  }

  /* ── Desktop: draggable assistive ball ─────────────────────────────────── */
  return (
    <motion.div
      ref={ballRef}
      drag={!reduce}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => { setDragging(true); setOpen(false); }}
      onDragEnd={handleDragEnd}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        x: dragX,
        y: dragY,
        zIndex: 60,
        touchAction: 'none',
      }}
      onPointerEnter={openNow}
      onPointerLeave={closeSoon}
      onFocusCapture={openNow}
      onBlurCapture={closeSoon}
    >
      <motion.div
        animate={{
          opacity: dragging ? 1 : open ? 1 : idle ? 0.5 : 0.9,
          scale: dragging ? 1.06 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* The ball itself — always present, acts as the drag handle. */}
        <button
          type="button"
          /* A drag also fires click; only treat it as a click if the pointer
             barely moved, otherwise dropping the ball would open the palette. */
          onClick={() => { if (!movedRef.current) onOpenPalette(); }}
          /* Only the ball starts a drag — the expanded panel must stay
             clickable, so dragListener is off and the gesture is begun here. */
          onPointerDown={(e) => {
            movedRef.current = false;
            downPt.current = { x: e.clientX, y: e.clientY };
            if (!reduce) dragControls.start(e);
          }}
          onPointerUp={(e) => {
            const d = Math.hypot(e.clientX - downPt.current.x, e.clientY - downPt.current.y);
            movedRef.current = d > 4;
          }}
          title="Drag to move · click to search (⌘K)"
          aria-label="Navigation. Drag to move, click to open command palette."
          aria-expanded={open}
          style={{ width: BALL, height: BALL, touchAction: 'none' }}
          className="dock-ball grid cursor-grab place-items-center rounded-full
                     active:cursor-grabbing"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'search' : 'brand'}
              initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
              transition={{ duration: 0.18 }}
              className="grid place-items-center text-white"
            >
              {open
                ? <MaterialIcon name="search" size="sm" />
                : <span className="font-display text-[17px] font-semibold leading-none">D</span>}
            </motion.span>
          </AnimatePresence>

          {/* Idle breathing ring — a quiet "I'm here" without taking space. */}
          {!open && !dragging && !reduce && (
            <span className="pointer-events-none absolute inset-0 animate-pulse-ring rounded-full bg-ember/25" />
          )}
        </button>

        {/* The VERTICAL panel that grows out of the ball on hover. It is
            centred on the ball and shifted by `panelShift` so a tall column
            never runs off the top or bottom of the viewport. */}
        <AnimatePresence>
          {open && !dragging && (
            <motion.nav
              aria-label="Primary"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: openLeft ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, x: openLeft ? 6 : -6 }}
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              style={{
                position: 'absolute',
                top: '50%',
                marginTop: -panelH / 2 + panelShift,
                left: openLeft ? undefined : BALL + 12,
                right: openLeft ? BALL + 12 : undefined,
                transformOrigin: `${openLeft ? 'right' : 'left'} center`,
              }}
              className="dock-surface dock-panel flex flex-col gap-0.5 p-2"
            >
              {DASHBOARD_NAV_ITEMS.map((item, i) => (
                <DockLink
                  key={item.id}
                  item={item}
                  active={active}
                  onNav={wake}
                  index={i}
                  labelSide={openLeft ? 'left' : 'right'}
                />
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/**
 * One nav row.
 *
 * `index` marks it as part of the vertical panel: rows are full-width, carry a
 * visible text label (a vertical icon-only rail is a guessing game), and stagger
 * in. Without `index` it renders as a bare icon button for the compact bottom
 * bar.
 */
function DockLink({ item, active, onNav, index, labelSide = 'right' }) {
  const isActive = active?.id === item.id;
  const vertical = index !== undefined;

  if (!vertical) {
    return (
      <Link
        to={item.path}
        title={item.label}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        onClick={onNav}
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-pill
                   transition-colors duration-200"
      >
        {isActive && (
          <motion.span
            layoutId="dock-active"
            className="absolute inset-0 rounded-pill bg-ink"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
        <MaterialIcon
          name={item.icon}
          size="sm"
          fill={isActive}
          className={`relative z-10 transition-colors ${
            isActive ? 'text-ink-inverse' : 'text-ink-2 hover:text-ink'
          }`}
        />
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: labelSide === 'left' ? 8 : -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.02 + index * 0.028, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={item.path}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        onClick={onNav}
        style={{ height: ROW }}
        className={`group/row relative flex items-center gap-2.5 rounded-well px-2.5
                    transition-colors duration-200
                    ${labelSide === 'left' ? 'flex-row-reverse text-right' : ''}
                    ${isActive ? '' : 'hover:bg-canvas-sunk'}`}
      >
        {isActive && (
          <motion.span
            layoutId="dock-active"
            className="absolute inset-0 rounded-well bg-ink"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
        <MaterialIcon
          name={item.icon}
          size="sm"
          fill={isActive}
          className={`relative z-10 shrink-0 transition-colors ${
            isActive ? 'text-ink-inverse' : 'text-ink-2 group-hover/row:text-ink'
          }`}
        />
        <span
          className={`relative z-10 flex-1 whitespace-nowrap text-body-sm font-medium
                      transition-colors ${
                        isActive ? 'text-ink-inverse' : 'text-ink-2 group-hover/row:text-ink'
                      }`}
        >
          {item.label}
        </span>
      </Link>
    </motion.div>
  );
}
