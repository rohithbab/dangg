const path = require('path');

module.exports = {
  darkMode: 'class',
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, 'src/**/*.css'),
  ],
  theme: {
    extend: {
      colors: {
        /* Brand — acid green accent */
        primary: '#c8f500',
        'on-primary': '#0e0e0d',
        'primary-container': '#a8d000',
        'on-primary-container': '#0e0e0d',
        'primary-fixed': '#e8ff90',
        'primary-fixed-dim': '#c8f500',
        'on-primary-fixed': '#0e0e0d',
        'on-primary-fixed-variant': '#1e2e00',
        'inverse-primary': '#3a4a00',
        'surface-tint': '#c8f500',

        /* Secondary — electric blue */
        secondary: '#3b82f6',
        'on-secondary': '#ffffff',
        'secondary-container': '#1d4ed8',
        'on-secondary-container': '#ffffff',
        'secondary-fixed': '#dbeafe',
        'secondary-fixed-dim': '#bfdbfe',
        'on-secondary-fixed': '#1e3a8a',
        'on-secondary-fixed-variant': '#1d4ed8',

        /* Tertiary — warm amber */
        tertiary: '#f59e0b',
        'on-tertiary': '#0e0e0d',
        'tertiary-container': '#d97706',
        'on-tertiary-container': '#ffffff',
        'tertiary-fixed': '#fef3c7',
        'tertiary-fixed-dim': '#fde68a',
        'on-tertiary-fixed': '#78350f',
        'on-tertiary-fixed-variant': '#92400e',

        /* Canvas — much darker warm gray for card contrast */
        background: '#d6d2c8',
        'on-background': '#0e0e0d',
        surface: '#f8f6f1',
        'surface-bright': '#ffffff',
        'surface-dim': '#c8c4ba',
        'surface-container-lowest': '#f8f6f1',
        'surface-container-low': '#ede9e0',
        'surface-container': '#e0dbd0',
        'surface-container-high': '#ccc7bc',
        'surface-container-highest': '#b8b3a8',
        'surface-variant': '#dedad0',

        /* Sidebar — near-black warm */
        sidebar: '#0e0e0d',
        'sidebar-surface': '#181816',
        'sidebar-hover': '#222220',
        'sidebar-active': '#2a2a28',
        'sidebar-border': '#282826',
        'on-sidebar': '#f0ede6',
        'on-sidebar-muted': '#7a7870',
        'on-sidebar-active': '#c8f500',

        /* Typography */
        'on-surface': '#0e0e0d',
        'on-surface-variant': '#5c5a54',

        /* Borders */
        outline: '#7a7870',
        'outline-variant': '#ccc8be',

        /* Inverse */
        'inverse-surface': '#0e0e0d',
        'inverse-on-surface': '#f0ede6',

        /* Error */
        error: '#dc2626',
        'on-error': '#ffffff',
        'error-container': '#fee2e2',
        'on-error-container': '#991b1b',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        full: '9999px',
      },
      spacing: {
        stack_md: '1rem',
        sidebar_width: '248px',
        container_padding: '2rem',
        stack_sm: '0.5rem',
        stack_lg: '1.5rem',
        gutter: '1.5rem',
      },
      fontFamily: {
        /* Display — Syne for punchy headers */
        display: ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'headline-lg': ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'headline-md': ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        /* Body — DM Sans for clean readability */
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body-lg': ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body-md': ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'label-md': ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'label-sm': ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-lg': ['26px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'label-md': ['11px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '600' }],
        display: ['40px', { lineHeight: '46px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'label-sm': ['10px', { lineHeight: '14px', fontWeight: '600' }],
        'headline-md': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
      },
      maxWidth: {
        shell: '80rem',
      },
      boxShadow: {
        /* Strong shadows — cards pop against dark canvas */
        card: '0 2px 8px 0 rgb(14 14 13 / 0.12), 0 1px 2px 0 rgb(14 14 13 / 0.08)',
        'card-hover': '0 12px 32px -4px rgb(14 14 13 / 0.20), 0 4px 12px -2px rgb(14 14 13 / 0.12)',
        'card-lift': '0 16px 40px -8px rgb(14 14 13 / 0.24)',
        header: '0 1px 0 0 rgb(14 14 13 / 0.10)',
        'accent-glow': '0 0 24px 0 rgb(200 245 0 / 0.35)',
        'sidebar-active': 'inset 0 0 0 1px rgb(200 245 0 / 0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
