/**
 * DANGG ADMIN — "WARM SIGNAL" DESIGN SYSTEM
 *
 * Canvas is warm cream, never sterile white. Cards float on it as near-white
 * planes with almost no border — separation comes from tone + soft shadow.
 * ONE hot accent (ember) carries emphasis; everything else stays quiet so the
 * accent actually means something.
 *
 * Chart hues are NOT decorative — they are the validated categorical ramp from
 * scripts/validate_palette.js (all six checks pass, light + dark). Do not
 * substitute them by eye.
 */
module.exports = {
  darkMode: 'class',
  /* POSIX-style relative globs only.
     These were previously built with path.join(__dirname, …), which on Windows
     produces backslash paths (src\**\*.jsx). Tailwind's glob matcher requires
     forward slashes, so NOTHING under src/ was ever scanned — utilities only
     survived if they also appeared in an @apply rule in the CSS. Do not
     reintroduce path.join here. */
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Canvas & planes ─────────────────────────────────────────────── */
        canvas: '#F7F5EE',          // warm cream app background
        'canvas-sunk': '#F1EEE4',   // wells, tracks, inset areas
        card: '#FCFBF7',            // card plane — near-white, still warm
        'card-raised': '#FFFFFF',   // hover / popover / modal
        hairline: '#E7E2D4',        // whisper border (use sparingly)
        'hairline-strong': '#D8D1BE',

        /* ── Ink ─────────────────────────────────────────────────────────── */
        ink: '#14140F',             // primary text, near-black warm
        'ink-2': '#5C594C',         // secondary text
        'ink-3': '#8C887A',         // muted labels, axis text
        'ink-inverse': '#FBFAF6',

        /* ── Accent — ember. Use sparingly: one per view. ────────────────── */
        ember: '#E8511F',
        'ember-hover': '#CF4517',
        'ember-soft': '#FBE4DA',    // tint fills
        'ember-glow': '#F9D2C4',
        'on-ember': '#FFFFFF',

        /* ── Validated categorical ramp (charts only) ────────────────────── */
        'cat-1': '#E8511F',         // ember
        'cat-2': '#2F6FA8',         // blue
        'cat-3': '#3E9B72',         // green
        'cat-4': '#B8891B',         // gold
        'cat-5': '#8C5BC4',         // violet

        /* ── Status — reserved, never reused as a series color ───────────── */
        good: '#2E7D5B',
        'good-soft': '#DCEFE5',
        warn: '#9A6B12',
        'warn-soft': '#F6EBD2',
        critical: '#B3341A',
        'critical-soft': '#F9DED7',
        info: '#2F6FA8',
        'info-soft': '#DCE8F4',

        /* ── Soft support tints (from the inspo micro-viz) ───────────────── */
        mint: '#CFE8D2',
        peri: '#C3CEF2',
        peach: '#F7D6B0',
        sand: '#EDE7D6',

        /* ── Legacy token aliases ─────────────────────────────────────────
           The 12 not-yet-migrated pages reference the previous system's token
           names. Mapping them onto Warm Signal values means those pages pick
           up the new palette instead of rendering with missing colours.
           DELETE each alias as its consumers are migrated. */
        background: '#F7F5EE',
        surface: '#FCFBF7',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F7F5EE',
        'surface-container': '#F1EEE4',
        'surface-container-high': '#E7E2D4',
        'on-surface': '#14140F',
        'on-surface-variant': '#5C594C',
        outline: '#8C887A',
        'outline-variant': '#E7E2D4',
        sidebar: '#F1EEE4',
        'text-on-sidebar': '#14140F',
        primary: '#E8511F',
        'on-primary': '#FFFFFF',
        'primary-container': '#CF4517',
        'on-primary-container': '#FFFFFF',
        secondary: '#2F6FA8',
        'on-secondary': '#FFFFFF',
        tertiary: '#B8891B',
        'on-tertiary': '#FFFFFF',
        error: '#B3341A',
        'on-error': '#FFFFFF',
      },

      fontFamily: {
        /* Display — Fraunces: a variable serif with SOFT and WONK axes. The
           wonk axis gives the italic-ish splayed terminals that stop headings
           reading as default-sans. Editorial, not corporate. */
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        /* Body/UI — Schibsted Grotesk: Norwegian grotesk, slightly warm, open
           apertures, genuinely good tabular figures. */
        sans: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      /* Fluid type — every step scales with the viewport between a phone-safe
         minimum and a desktop maximum, so nothing has to be re-specified per
         breakpoint. clamp() means no layout jumps at breakpoint boundaries. */
      fontSize: {
        'metric-xl':  ['clamp(30px, 1.6vw + 22px, 46px)', { lineHeight: '1',    letterSpacing: '-0.035em', fontWeight: '600' }],
        metric:       ['clamp(25px, 1.1vw + 19px, 36px)', { lineHeight: '1.05', letterSpacing: '-0.03em',  fontWeight: '600' }],
        'metric-sm':  ['clamp(19px, 0.5vw + 16px, 24px)', { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '600' }],
        'display-lg': ['clamp(23px, 1.2vw + 17px, 34px)', { lineHeight: '1.12', letterSpacing: '-0.02em',  fontWeight: '600' }],
        'display-md': ['clamp(17px, 0.4vw + 15px, 21px)', { lineHeight: '1.25', letterSpacing: '-0.012em', fontWeight: '600' }],
        title:        ['clamp(14px, 0.2vw + 13px, 15.5px)', { lineHeight: '1.35', letterSpacing: '-0.008em', fontWeight: '600' }],
        body:         ['clamp(13px, 0.15vw + 12.4px, 14px)', { lineHeight: '1.5',  fontWeight: '400' }],
        'body-sm':    ['clamp(12px, 0.1vw + 11.6px, 12.8px)', { lineHeight: '1.45', fontWeight: '400' }],
        label:        ['clamp(10.5px, 0.06vw + 10.2px, 11px)', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-xs':   ['clamp(9.5px, 0.05vw + 9.3px, 10px)',  { lineHeight: '1.3', letterSpacing: '0.07em', fontWeight: '500' }],
      },

      screens: {
        xs: '420px',
        '3xl': '1800px',
      },

      borderRadius: {
        card: '22px',      // the signature generous card radius
        'card-lg': '26px',
        well: '16px',
        pill: '999px',
      },

      boxShadow: {
        /* Warm-tinted shadows — a neutral gray shadow on cream looks dirty */
        card: '0 1px 2px rgba(60,50,25,0.04), 0 4px 14px -4px rgba(60,50,25,0.06)',
        'card-hover': '0 2px 6px rgba(60,50,25,0.06), 0 16px 34px -10px rgba(60,50,25,0.13)',
        pop: '0 10px 40px -8px rgba(60,50,25,0.18)',
        ember: '0 6px 20px -6px rgba(232,81,31,0.45)',
        inset: 'inset 0 1px 2px rgba(60,50,25,0.05)',
      },

      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },

      transitionTimingFunction: {
        /* The motion signature — a confident overshoot-free ease-out */
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'draw-in': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.06)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite linear',
        'rise-in': 'rise-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        breathe: 'breathe 3.5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.22,1,0.36,1) infinite',
      },

      maxWidth: {
        shell: '1560px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
