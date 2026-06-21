import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';
import { Divider } from '../ui/Divider';
import { logout } from '../../lib/auth';

export function TopBar({ title, subtitle, actions, leading, user }) {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="shell-header">
      <div className="flex items-center gap-4">
        {leading}
        {title && (
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="type-headline-md font-bold text-on-surface"
          >
            {title}
          </motion.h2>
        )}
        {subtitle && (
          <>
            <Divider />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-on-surface-variant"
            >
              {subtitle}
            </motion.p>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {actions && (
          <div className="flex items-center gap-4 border-r border-outline-variant pr-4">
            {actions}
          </div>
        )}

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            type="button" 
            className="btn-icon" 
            title="Refresh"
            onClick={handleRefresh}
          >
            <MaterialIcon name="refresh" className="text-primary" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button" 
            className="btn-outline px-4 py-1.5 text-sm"
            onClick={handleLogout}
          >
            Logout
          </motion.button>

          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="ml-1 h-9 w-9 rounded-full border border-outline-variant bg-surface-variant overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            title={user?.name || 'User Profile'}
          >
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-container text-primary text-sm font-bold">
                {user?.initials || user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
