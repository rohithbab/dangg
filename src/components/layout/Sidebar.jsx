import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';
import { DASHBOARD_NAV_ITEMS, getNavItemByPath } from '../../routes/dashboardRoutes';

function SidebarNavItem({ to, icon, label, id }) {
  const { pathname } = useLocation();
  const currentItem = getNavItemByPath(pathname);
  const isActive = currentItem?.id === id;

  return (
    <Link
      to={to}
      className={`nav-item group relative ${isActive ? 'nav-item-active' : ''}`}
    >
      <div className="flex items-center gap-3">
        <MaterialIcon 
          name={icon} 
          fill={isActive} 
          className={isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}
        />
        <span className="type-label-md normal-case tracking-normal">{label}</span>
      </div>
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function Sidebar({ brandTitle = 'DANGG', brandSubtitle = 'ADMIN CONSOLE' }) {
  return (
    <aside className="shell-sidebar">
      <div className="mb-8 px-6">
        <h1 className="type-headline-md font-bold text-on-surface dark:text-on-surface-variant">
          {brandTitle}
        </h1>
        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          {brandSubtitle}
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        {DASHBOARD_NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.id}
            id={item.id}
            to={item.path}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </aside>
  );
}
