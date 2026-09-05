# Dangg Admin — "Warm Signal" Design System

**Status:** Official. Supersedes the previous slate/indigo system entirely.
**Theme:** Warm cream canvas, near-white floating cards, one hot ember accent.
**Stack:** React 19 · Tailwind 3 · Framer Motion 12 · Recharts 3 · NumberFlow

---

## 1. Intent

Operators stare at this panel all day. The old system was a flat white
enterprise grid; this one treats the canvas as a warm, physical surface with
cards floating on it, and reserves saturated colour for the things that matter.

Two rules drive everything:

1. **One hot accent per view.** Ember (`#E8511F`) marks the single most
   important thing on screen. If everything is ember, nothing is.
2. **A number is never alone.** Every metric carries a second encoding — a
   sparkline, capacity bars, a dot matrix, a gauge, a meter. The figure gives
   precision; the graphic gives shape at a glance.

---

## 2. Sources of truth

| File | Purpose |
|---|---|
| `tailwind.config.cjs` | Colour, type, radii, shadow, easing tokens |
| `src/index.css` | `@layer components` — cards, pills, buttons, wells, chart chrome |
| `src/components/motion/` | Motion primitives (`Stagger`, `Reveal`, `Lift`, `Pop`), `Metric`, `Placeholder` |
| `src/components/nav/` | `Dock.jsx` (assistive ball) + `Palette.jsx` (⌘K) |
| `src/components/viz/` | `palette.js` (validated hues), `micro.jsx`, `charts.jsx` |
| `src/components/ui/KpiCard.jsx` | The canonical metric card |
| `src/styles/legacy-bridge.css` | **Temporary.** Delete as pages migrate. |

---

## 3. Colour

### Canvas & planes
| Token | Hex | Role |
|---|---|---|
| `canvas` | `#F7F5EE` | App background — warm cream, never white |
| `canvas-sunk` | `#F1EEE4` | Wells, tracks, inset areas |
| `card` | `#FCFBF7` | Card plane |
| `hairline` | `#E7E2D4` | Whisper border — use sparingly |

Cards separate from the canvas by **tone and shadow, not borders**. Shadows are
warm-tinted (`rgba(60,50,25,…)`) — a neutral gray shadow on cream looks dirty.

### Ink
`ink #14140F` · `ink-2 #5C594C` · `ink-3 #8C887A` (labels, axes)

### Accent
`ember #E8511F` · hover `#CF4517` · soft `#FBE4DA`

### Chart hues — **validated, do not substitute by eye**

```
light (surface #FCFBF7)  #E8511F  #2F6FA8  #3E9B72  #B8891B  #8C5BC4
dark  (surface #17160F)  #E4552B  #4785BE  #38996F  #B07F1E  #8F66C4
```

Both sets pass all six checks of the dataviz validator (lightness band, chroma
floor, CVD separation, normal-vision floor, contrast). Re-run before changing:

```bash
node scripts/validate_palette.js "<hex,hex,…>" --mode light --surface "#FCFBF7"
```

The gold↔green pair sits near the tritan floor, so any chart using both **must**
also carry direct value labels. Assign hues in fixed order; never cycle them.

Status colours (`good`/`warn`/`critical`/`info`) are reserved and never reused
as a series colour.

---

## 4. Typography

- **Display — Fraunces** (variable serif, SOFT + WONK axes): headings and all
  metric figures. The wonk axis splays terminals just enough that headings read
  as editorial rather than as a default sans.
- **Body/UI — Schibsted Grotesk**: warm Norwegian grotesk, open apertures.
- Metrics use `tabular-nums` so digits never jitter while counting

| Token | Size | Use |
|---|---|---|
| `metric-xl` / `metric` / `metric-sm` | fluid 30→46 / 25→36 / 19→24px | KPI figures |
| `display-lg` / `display-md` | fluid 23→34 / 17→21px | Page & card titles |
| `body` / `body-sm` | fluid 13→14 / 12→12.8px | Copy |
| `label` / `label-xs` | fluid ~11 / ~10px | Tracked-out uppercase labels |

---

## 5. Motion

House curve: `cubic-bezier(0.22, 1, 0.36, 1)` — decisive ease-out, no bounce.

The page-load choreography (~1.4s, from the reference):
1. Cards cascade in reading order (`Stagger` + `Reveal`, 60–90ms apart)
2. Numbers roll up simultaneously (`Metric`, 1.2–1.4s)
3. Bars and arcs grow from their baseline

**Every primitive honours `prefers-reduced-motion`**, collapsing to a plain
fade. `index.css` also kills all animation globally under that query. Motion is
emphasis here, never meaning — the page must read identically without it.

---

## 6. Charts

Follow the procedure in the `dataviz` skill: **form first, colour last.**

- Pick the form from the data's job. A handful of headline numbers is a **KPI
  row**, not a bar chart.
- **Never a dual axis.** Two measures of different scale → two charts, or
  independent meters each against their own ceiling.
- Values spanning orders of magnitude must not share a linear axis. Use
  `FunnelBars scale="log"` **and** state that bar length is log-scaled.
- Percentages only where a genuine part-to-whole exists. Sessions are not a
  subset of users — no percentage relates them.
- Hover layer (tooltip/crosshair) ships by default on every real chart.
- Thin marks, 4px rounded data-ends, 2px gaps between adjacent fills,
  recessive grid, direct labels over legends where possible.

---

## 7. Navigation — assistive ball, no sidebar

Chrome is deliberately minimal so content owns the viewport.

- **Dock ball** (`src/components/nav/Dock.jsx`) — a 48px ember sphere floating
  over the page. **Hovering (or focusing) expands it into the full nav panel**;
  moving away collapses it back, so persistent chrome is one small circle.
- **Free-form positioning.** The ball drags anywhere — a centimetre or right
  across the screen — and stays exactly where it is dropped. **No edge
  snapping.** Position is stored as a viewport *ratio* (0–1) in `localStorage`,
  so it survives resizes and different displays, and is clamped on load so it
  can never end up off-screen.
- The panel is **vertical** — a labelled column, not an icon strip. An
  icon-only vertical rail is a guessing game, so every row carries its text.
  It is centred on the ball and nudged by `panelShift` so a tall column parked
  near the top or bottom edge stays fully on screen, and it opens toward
  whichever side has room (`openLeft`).
- **Command palette** (`Palette.jsx`, ⌘K / Ctrl-K) — subsequence search over
  every page plus refresh and logout. This is why the ball is allowed to
  recede: it is never the only way to navigate.
- **Context bar** — a slim sticky header naming the current page.

Three implementation details that are easy to break:

1. Drag starts from the ball only — `dragListener={false}` plus
   `dragControls.start(e)` on the ball's `onPointerDown`. Without this, the
   expanded panel becomes a drag surface and its links stop being clickable.
2. On drop, `dragX` / `dragY` are **reset to 0**, because the new location is
   written as `left` / `top`. Leaving the drag transform in place composes the
   two and throws the ball off-screen.
3. A drag also fires `click`. The click handler ignores any click where the
   pointer moved more than 4px, so dropping the ball does not open the palette.

On `max-width: 900px` or a coarse pointer there is no ball at all: navigation
becomes a fixed bottom bar in the thumb zone, trimmed to the five primary
destinations, with the palette button covering everything else.

---

## 8. Responsive

Type is **fluid** — every step is a `clamp()` that scales with the viewport, so
sizes are never re-specified per breakpoint and nothing jumps at a boundary.

Breakpoints: `xs 420` · `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`
· `3xl 1800`.

Layout rules:
- KPI row: 1-up below 420px, 2-up from `xs`, 4-up from `xl`.
- Panel rows collapse `lg:grid-cols-12` → single column; the 3-up row goes 2-up
  at `md` before 3-up at `xl`.
- Micro-viz inside KPI cards is hidden below `xs`, where the figure needs the
  full card width.
- Long labels `truncate` with `min-w-0` on the flex parent; figures `shrink-0`.

---

## 9. Loading — live, never a grey block

Pages **never** early-return a skeleton. All chrome — titles, labels, icons,
card frames — renders from first paint, so the layout is final before any data
arrives and nothing reflows when it does.

Only the network-dependent parts animate, and they stay *alive* while waiting:

| Component | Behaviour |
|---|---|
| `ValuePlaceholder` | Digits scramble at a decaying rate (60ms → 260ms), then settle into the real figure. Pass `sample` (e.g. `"₹00,000"`, `"0.00"`) so the placeholder is the exact shape and width of the result. |
| `TrackPlaceholder` | An ember sweep travels along the track instead of a 0%-wide bar. |
| `TextPlaceholder` | A travelling-highlight shimmer bar for labels. |
| `LoadingBar` | One thin indeterminate line at the top of the viewport while any query is in flight. |
| `LoadingRegion` | A single polite `aria-live` announcement for the whole page. |

**Never render a real-looking zero while loading.** A percentage that is not yet
known shows `—`, not `0%` — a placeholder may be vague but must not assert
something false. All of the above degrade to static, non-animated forms under
`prefers-reduced-motion`.
---

## 10. Governance

- Use only the tokens and component classes above. No ad-hoc hex.
- New pages compose `KpiCard`, `Panel`, the `viz/` primitives and the motion
  primitives before inventing anything.
- `legacy-bridge.css` is scaffolding: when a page is migrated, delete the rules
  it was using. When the file is empty, the migration is complete.

### Migration status

All 12 screens are on Warm Signal:

- [x] `/login` — split layout, inverted brand panel
- [x] `/analytics` — reference implementation
- [x] `/revenue` — KpiCard + FunnelBars + margin dial
- [x] `/payout` — stat row, modals, toasts, table skeleton
- [x] `/verification` — stat chips, search, reject modal, toasts
- [x] `/users` — search/filter bar, table skeleton
- [x] `/chats` — rebuilt as a real request funnel
- [x] `/transcript` and `/transcript/:id` — list, filters, replay
- [x] `/chats/detail` — session cards
- [x] `/users/male/:id` and `/users/female/:id` — profile pages

`src/styles/legacy-bridge.css` still carries the shared UI components' class
names. Retire it by rewriting each component in `src/components/ui/` to compose
`card` / `pill` / `btn` directly, deleting its rule as you go. When the file is
empty the migration is complete.

**A warning that cost real debugging time:** a large block of those class names
(`profile-header-card`, `chat-metric-card`, `account-info-panel`, the pagination
and status-dot families…) had been referenced by components but defined
**nowhere** — they were lost with the old system, so those cards silently
rendered with no surface at all. Before deleting any rule here, grep for the
class across `src/` and confirm nothing still uses it.
