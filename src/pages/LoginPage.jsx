import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../lib/auth'
import { MaterialIcon } from '../components/ui/MaterialIcon'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0e0e0d' }}>

      {/* ── Left brand panel ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Acid-green glow blob */}
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: '10%', left: '-10%',
            width: '50%', height: '40%',
            background: 'radial-gradient(ellipse, rgba(200,245,0,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Brand mark */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <span className="font-display text-lg font-black text-on-primary leading-none">D</span>
          </div>
          <div>
            <span className="font-display text-sm font-black tracking-[0.15em] text-on-sidebar uppercase">DANGG</span>
            <p className="text-[10px] font-medium uppercase tracking-widest text-on-sidebar-muted/50 leading-tight mt-0.5">
              Admin Console
            </p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-sidebar-muted"
          >
            Secure Access
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-5xl font-black tracking-tight text-on-sidebar leading-[1.0]"
          >
            Manage<br />
            your<br />
            platform<br />
            <span style={{ color: '#c8f500' }}>confidently.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-sm text-on-sidebar-muted leading-relaxed max-w-xs"
          >
            Full oversight of users, revenue, chats and payouts — all in one place.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex gap-8"
          >
            {[
              { n: '8', label: 'Modules' },
              { n: '∞', label: 'Users' },
              { n: '24/7', label: 'Live' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-black text-on-sidebar leading-none">{n}</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-on-sidebar-muted/50">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="relative text-[10px] text-on-sidebar-muted/25 font-medium">
          v1.0 · Protected · Admin only
        </p>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="hidden lg:block w-px bg-sidebar-border" />

      {/* ── Right form panel ────────────────────────────────── */}
      <div
        className="flex flex-1 items-center justify-center p-8"
        style={{ backgroundColor: '#d6d2c8' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[360px]"
        >
          {/* Card */}
          <div className="rounded-3xl bg-surface shadow-card-lift overflow-hidden">

            {/* Card header stripe */}
            <div className="px-8 pt-8 pb-6 border-b border-outline-variant">
              <div className="mb-1 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                  Secure Sign In
                </span>
              </div>
              <h1 className="font-display text-3xl font-black tracking-tight text-on-surface leading-tight">
                Welcome<br />back.
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
              {/* Username */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                  Username
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="person"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 !text-[16px] text-on-surface-variant/40"
                  />
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full rounded-xl border-2 border-outline-variant bg-surface-container-low py-3 pl-10 pr-4 text-sm font-medium text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 focus:border-on-surface focus:bg-surface"
                    placeholder="admin@danggapp"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                  Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="lock"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 !text-[16px] text-on-surface-variant/40"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-outline-variant bg-surface-container-low py-3 pl-10 pr-11 text-sm font-medium text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 focus:border-on-surface focus:bg-surface"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
                  >
                    <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="!text-[16px]" />
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-error/20 bg-error-container px-3.5 py-2.5"
                >
                  <MaterialIcon name="error" className="!text-[14px] shrink-0 text-error" />
                  <p className="text-xs font-semibold text-error">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sidebar py-3.5 text-sm font-bold text-on-sidebar transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <MaterialIcon name="refresh" className="!text-[18px]" />
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
        </motion.div>
      </div>
    </div>
  )
}
