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
        setError('Invalid username or password.')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — dark brand block */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-16 h-56 w-56 rounded-full bg-primary/5 blur-2xl" />

        {/* Brand */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <span className="text-sm font-black text-on-primary leading-none">D</span>
          </div>
          <div>
            <span className="text-sm font-black tracking-wider text-on-sidebar">DANGG</span>
            <p className="text-[10px] font-medium uppercase tracking-widest text-on-sidebar-muted">
              Admin Console
            </p>
          </div>
        </div>

        {/* Center text */}
        <div className="relative">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-on-sidebar-muted">
            Secure Access
          </p>
          <h2 className="text-4xl font-black tracking-tight text-on-sidebar leading-[1.1]">
            Manage your<br />platform with<br />
            <span className="text-primary">confidence.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm text-on-sidebar-muted leading-relaxed">
            Full oversight of users, revenue, chat sessions, and payouts — all in one place.
          </p>
        </div>

        {/* Bottom note */}
        <p className="relative text-[11px] text-on-sidebar-muted/40 font-medium">
          v1.0 · Admin Panel · Protected
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar">
              <span className="text-xs font-black text-on-sidebar leading-none">D</span>
            </div>
            <span className="text-base font-black tracking-wider text-on-surface">DANGG Admin</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight text-on-surface">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Sign in to your admin account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Username
              </label>
              <div className="relative">
                <MaterialIcon
                  name="person"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 !text-[18px]"
                />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-on-surface/15 focus:border-on-surface/40 outline-none transition-all text-on-surface text-sm font-medium placeholder:text-on-surface-variant/40"
                  placeholder="admin@danggapp"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <MaterialIcon
                  name="lock"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 !text-[18px]"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-on-surface/15 focus:border-on-surface/40 outline-none transition-all text-on-surface text-sm font-medium placeholder:text-on-surface-variant/40"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface transition-colors"
                >
                  <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="!text-[18px]" />
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3.5 py-3 bg-error-container border border-error/20 rounded-xl"
              >
                <MaterialIcon name="error" className="!text-[16px] text-error shrink-0" />
                <p className="text-xs font-semibold text-error">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-sidebar text-on-sidebar font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
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
                  <MaterialIcon name="login" className="!text-[18px]" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
