import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';
import { logout } from '../../lib/auth';

export function TopBar({ title, subtitle, actions, leading, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="shell-header">
      <div className="flex items-center gap-3">
        {leading}
        <div className="flex flex-col">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-on-surface leading-tight"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-on-surface-variant leading-tight"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions && (
          <div className="flex items-center gap-2 border-r border-outline-variant pr-3 mr-1">
            {actions}
          </div>
        )}

        {/* Refresh */}
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          type="button"
          className="btn-icon"
          title="Refresh"
          onClick={() => window.location.reload()}
        >
          <MaterialIcon name="refresh" size="sm" className="text-on-surface-variant" />
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface px-3 py-1.5 text-xs font-semibold text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface"
          onClick={handleLogout}
        >
          <MaterialIcon name="logout" size="sm" className="opacity-70" />
          <span>Logout</span>
        </motion.button>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          className="ml-1 h-8 w-8 rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-on-surface/20 transition-all"
          title={user?.name || 'User'}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-sidebar text-on-sidebar text-xs font-black">
              {user?.initials || user?.name?.charAt(0) || 'A'}
            </div>
          )}
        </motion.div>
      </div>
    </header>
  );
}
