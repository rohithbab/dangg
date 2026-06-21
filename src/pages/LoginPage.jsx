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
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-outline-variant overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-8 py-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <MaterialIcon name="admin_panel_settings" className="!text-[36px] text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">DANGG ADMIN</h1>
            <p className="text-white/70 text-sm mt-1">Secure admin console access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/70">
                Username
              </label>
              <div className="relative">
                <MaterialIcon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-on-surface font-medium"
                  placeholder="admin@danggapp"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/70">
                Password
              </label>
              <div className="relative">
                <MaterialIcon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-on-surface font-medium"
                  placeholder="••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="!text-[20px]" />
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 bg-error/10 border border-error/20 rounded-xl"
              >
                <MaterialIcon name="error" className="!text-[18px] text-error shrink-0" />
                <p className="text-sm font-semibold text-error">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <MaterialIcon name="refresh" className="!text-[20px]" />
                  </motion.span>
                  Signing in…
                </>
              ) : (
                <>
                  <MaterialIcon name="login" className="!text-[20px]" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
