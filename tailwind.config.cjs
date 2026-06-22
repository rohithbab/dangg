const path = require('path');

/**
 * REDESIGNED theme — Modern Bento UI
 * Dark sidebar (#111110) + acid-green accent (#c8f500) + warm off-white surface (#f5f3ef)
 */
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
        'on-primary': '#111110',
        'primary-container': '#b5de00',
        'on-primary-container': '#111110',
        'primary-fixed': '#e8ffa0',
        'primary-fixed-dim': '#d4f500',
        'on-primary-fixed': '#111110',
        'on-primary-fixed-variant': '#2a3500',
        'inverse-primary': '#3a4a00',
        'surface-tint': '#c8f500',

        /* Secondary — electric blue */
        secondary: '#3b82f6',
        'on-secondary': '#ffffff',
        'secondary-container': '#2563eb',
        'on-secondary-container': '#ffffff',
        'secondary-fixed': '#dbeafe',
        'secondary-fixed-dim': '#bfdbfe',
        'on-secondary-fixed': '#1e3a8a',
        'on-secondary-fixed-variant': '#1d4ed8',

        /* Tertiary — warm amber */
        tertiary: '#f59e0b',
        'on-tertiary': '#111110',
        'tertiary-container': '#d97706',
        'on-tertiary-container': '#ffffff',
        'tertiary-fixed': '#fef3c7',
        'tertiary-fixed-dim': '#fde68a',
        'on-tertiary-fixed': '#78350f',
        'on-tertiary-fixed-variant': '#92400e',

        /* Surfaces — warm off-white canvas */
        background: '#f5f3ef',
        'on-background': '#111110',
        surface: '#ffffff',
        'surface-bright': '#ffffff',
        'surface-dim': '#e8e5de',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3ef',
        'surface-container': '#eceae4',
        'surface-container-high': '#e0ddd6',
        'surface-container-highest': '#d4d0c8',
        'surface-variant': '#e8e5de',

        /* Sidebar — near-black warm dark */
        sidebar: '#111110',
        'sidebar-surface': '#1a1a18',
        'sidebar-hover': '#252522',
        'sidebar-active': '#2d2d2a',
        'sidebar-border': '#2a2a27',
        'on-sidebar': '#f5f3ef',
        'on-sidebar-muted': '#8a8880',
        'on-sidebar-active': '#c8f500',

        /* Typography */
        'on-surface': '#111110',
        'on-surface-variant': '#6b6860',

        /* Borders */
        outline: '#8a8880',
        'outline-variant': '#dedad2',

        /* Inverse / dark shell */
        'inverse-surface': '#111110',
        'inverse-on-surface': '#f5f3ef',

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
        '3xl': '1.5rem',
        full: '9999px',
      },
      spacing: {
        stack_md: '1rem',
        sidebar_width: '240px',
        container_padding: '2rem',
        stack_sm: '0.5rem',
        stack_lg: '1.5rem',
        gutter: '1.5rem',
      },
      fontFamily: {
        'headline-lg': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'label-md': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'label-sm': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'headline-md': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body-lg': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body-md': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-lg': ['24px', { lineHeight: '30px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'label-md': ['11px', { lineHeight: '16px', letterSpacing: '0.06em', fontWeight: '600' }],
        display: ['36px', { lineHeight: '42px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'label-sm': ['10px', { lineHeight: '14px', fontWeight: '600' }],
        'headline-md': ['18px', { lineHeight: '26px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
      },
      maxWidth: {
        shell: '80rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(17 17 16 / 0.06), 0 1px 2px -1px rgb(17 17 16 / 0.04)',
        'card-hover': '0 8px 24px -4px rgb(17 17 16 / 0.12), 0 4px 8px -2px rgb(17 17 16 / 0.06)',
        'card-lift': '0 12px 32px -8px rgb(17 17 16 / 0.16)',
        header: '0 1px 0 0 rgb(17 17 16 / 0.06)',
        'accent-glow': '0 4px 20px -4px rgb(200 245 0 / 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
