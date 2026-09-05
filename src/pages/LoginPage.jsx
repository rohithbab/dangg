import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../lib/auth'
import { MaterialIcon } from '../components/ui/MaterialIcon'

/**
 * LOGIN — Warm Signal
 *
 * Split layout: an ink-dark brand panel on the left (the one place in the app
 * that inverts, so the sign-in moment feels like a threshold), and the form on
 * the warm canvas at right. Collapses to form-only below `lg`.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /* ── AUTH LOGIC — UNCHANGED ─────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const ok = login(username, password)
      if (ok) {
        navigate('/analytics', { replace: true })
      } else {
        setError('Invalid credentials. Please try again.')
        setLoading(false)
      }
    }, 400)
  }

  const stats = [
    { n: '8', label: 'Modules' },
    { n: '∞', label: 'Users' },
    { n: '24/7', label: 'Live' },
  ]

  return (
    <div className="flex min-h-screen bg-canvas">

      {/* ── Left brand panel ────────────────────────────────────────────── */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-[46%]"
        style={{ backgroundColor: '#14140F' }}
      >
        {/* Warm ember bloom, low and left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            bottom: '-15%', left: '-20%', width: '75%', height: '65%',
            background: 'radial-gradient(ellipse, rgba(232,81,31,0.34) 0%, transparent 68%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            top: '-10%', right: '-15%', width: '55%', height: '45%',
            background: 'radial-gradient(ellipse, rgba(247,214,176,0.14) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center gap-3"
        >
          <div className="dock-ball grid h-11 w-11 place-items-center rounded-2xl">
            <span className="font-display text-lg font-semibold leading-none text-white">D</span>
          </div>
          <div>
            <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-[#FBFAF6]">
              Dangg
            </span>
            <p className="mt-0.5 text-label-xs uppercase tracking-widest text-[#8C887A]">
              Admin Console
            </p>
          </div>
        </motion.div>

        {/* Headline */}
        <div className="relative">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-5 text-label uppercase tracking-[0.2em] text-[#8C887A]"
          >
            Operations Control
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[44px] font-semibold leading-[1.08] tracking-tight text-[#FBFAF6]"
          >
            Manage your
            <br />
            platform{' '}
            <span className="text-ember">confidently.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.5 }}
            className="mt-6 max-w-sm text-body leading-relaxed text-[#A8A396]"
          >
            Full oversight of users, verification, chats and payouts — all in one
            place.
          </motion.p>

          {/* Stats */}
          <div className="mt-10 flex gap-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="font-display text-2xl font-semibold leading-none text-[#FBFAF6] tabular">
                  {s.n}
                </div>
                <div className="mt-1.5 text-label-xs uppercase tracking-widest text-[#8C887A]">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative text-label-xs font-medium text-[#5C594C]">
          v1.0 · Internal use only
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Compact brand for small screens, where the left panel is hidden */}
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <div className="dock-ball grid h-10 w-10 place-items-center rounded-xl">
              <span className="font-display text-base font-semibold leading-none text-white">D</span>
            </div>
            <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink">
              Dangg
            </span>
          </div>

          <div className="card overflow-hidden">
            {/* Header */}
            <div className="px-7 pb-6 pt-7">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ember" />
                <span className="text-label uppercase text-ink-3">Secure sign in</span>
              </div>
              <h1 className="font-display text-[30px] font-semibold leading-tight tracking-tight text-ink">
                Welcome back.
              </h1>
            </div>

            <div className="h-px bg-hairline" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 px-7 pb-7 pt-6">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-label uppercase text-ink-3">
                  Username
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="person"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 !text-[16px] text-ink-3"
                  />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@danggapp"
                    autoComplete="username"
                    required
                    className="w-full rounded-well border border-hairline bg-canvas-sunk py-3 pl-10 pr-4
                               text-body font-medium text-ink outline-none transition-all
                               placeholder:text-ink-3 focus:border-ember focus:bg-card
                               focus:ring-2 focus:ring-ember-soft"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-label uppercase text-ink-3">
                  Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="lock"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 !text-[16px] text-ink-3"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-well border border-hairline bg-canvas-sunk py-3 pl-10 pr-11
                               text-body font-medium text-ink outline-none transition-all
                               placeholder:text-ink-3 focus:border-ember focus:bg-card
                               focus:ring-2 focus:ring-ember-soft"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3
                               transition-colors hover:text-ink"
                  >
                    <MaterialIcon
                      name={showPassword ? 'visibility_off' : 'visibility'}
                      className="!text-[16px]"
                    />
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-center gap-2 rounded-well bg-critical-soft px-3.5 py-2.5"
                >
                  <MaterialIcon name="error" className="!text-[14px] shrink-0 text-critical" />
                  <p className="text-body-sm font-medium text-critical">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary mt-2 w-full py-3.5"
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      className="grid place-items-center"
                    >
                      <MaterialIcon name="progress_activity" className="!text-[18px]" />
                    </motion.span>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <MaterialIcon name="arrow_forward" className="!text-[16px]" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-label-xs text-ink-3">
            Authorised personnel only · All activity is logged
          </p>
        </motion.div>
      </div>
    </div>
  )
}
