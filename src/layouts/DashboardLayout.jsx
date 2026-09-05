import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dock } from '../components/nav/Dock';
import { Palette } from '../components/nav/Palette';
import { usePaletteHotkey } from '../components/nav/usePaletteHotkey';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { DanggLogo } from '../components/brand/Logo';
import { ProfileTopBarActions } from '../components/layout/ProfileTopBarActions';
import { ChatReplayTopBarActions } from '../components/layout/ChatReplayTopBarActions';
import { getNavItemByPath } from '../routes/dashboardRoutes';
import { CURRENT_ADMIN_USER } from '../data/adminUser';
import { logout } from '../lib/auth';

/**
 * DASHBOARD LAYOUT
 *
 * There is no sidebar. Navigation lives in a floating draggable Dock plus the
 * ⌘K command palette, so the content gets the full width of the viewport at
 * every breakpoint.
 *
 * The only persistent chrome is a slim, mostly-transparent context bar that
 * names the current page and carries per-route actions.
 */
export function DashboardLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const route = getNavItemByPath(pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);
  usePaletteHotkey(setPaletteOpen);

  const backPath =
    route.profileHeader === 'transcript'
      ? '/transcript'
      : route.profileHeader
        ? '/users'
        : null;

  const handleDeleteTranscript = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this chat transcript forever? This action cannot be undone.',
      )
    ) {
      navigate('/transcript');
    }
  };

  const actions =
    route.profileHeader === 'transcript' ? (
      <ChatReplayTopBarActions onDelete={handleDeleteTranscript} />
    ) : route.profileHeader === 'male' || route.profileHeader === 'female' ? (
      <ProfileTopBarActions adminName="Admin" />
    ) : null;

  return (
    <div className="relative min-h-screen">
      {/* ── Context bar ──────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex h-[54px] items-center gap-3 border-b
                   border-hairline/70 glass px-4 sm:px-6"
      >
        {backPath && (
          <button
            type="button"
            onClick={() => navigate(backPath)}
            aria-label="Back"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-pill
                       text-ink-2 transition-colors hover:bg-canvas-sunk hover:text-ink"
          >
            <MaterialIcon name="arrow_back" size="sm" />
          </button>
        )}

        {/* Brand mark — small, ink-toned so it sits quietly beside the page
            title rather than competing with it. Hidden on the narrowest
            screens where the title needs the width. */}
        <DanggLogo height={17} tone="ink" className="hidden shrink-0 opacity-80 sm:block" />
        <span className="hidden h-5 w-px shrink-0 bg-hairline sm:block" />

        <div className="min-w-0 flex-1">
          {route.title && (
            <motion.h2
              key={route.title}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="truncate font-display text-title text-ink"
            >
              {route.title}
            </motion.h2>
          )}
          {route.subtitle && (
            <p className="truncate text-label-xs text-ink-3">{route.subtitle}</p>
          )}
        </div>

        {/* Search affordance — the discoverable route into the palette. */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hidden items-center gap-2 rounded-pill bg-canvas-sunk px-3 py-1.5
                     text-body-sm text-ink-3 transition-colors hover:text-ink sm:flex"
        >
          <MaterialIcon name="search" size="sm" />
          <span>Search</span>
          <kbd className="rounded bg-card px-1.5 py-0.5 text-label-xs">⌘K</kbd>
        </button>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}

        <button
          type="button"
          onClick={() => { logout(); navigate('/login', { replace: true }); }}
          aria-label="Log out"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-pill text-ink-2
                     transition-colors hover:bg-critical-soft hover:text-critical"
        >
          <MaterialIcon name="logout" size="sm" />
        </button>

        <img
          src={CURRENT_ADMIN_USER.avatarUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded-pill object-cover ring-1 ring-hairline"
        />
      </header>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main
        /* Bottom padding clears the mobile dock; side padding clears the
           desktop dock when it is docked left or right. */
        className="pb-28 md:pb-12 md:pl-[86px] md:pr-4"
      >
        <Outlet />
      </main>

      <Dock onOpenPalette={() => setPaletteOpen(true)} />
      <Palette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
