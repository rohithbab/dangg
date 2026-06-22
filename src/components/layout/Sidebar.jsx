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
      className={isActive ? 'nav-item-active' : 'nav-item'}
    >
      <MaterialIcon
        name={icon}
        fill={isActive}
        className={isActive ? 'text-on-sidebar-active' : 'text-on-sidebar-muted group-hover:text-on-sidebar'}
        size="sm"
      />
      <span className="nav-label">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="ml-auto h-1.5 w-1.5 rounded-full bg-on-sidebar-active"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function Sidebar({ brandTitle = 'DANGG', brandSubtitle = 'Admin Console' }) {
  return (
    <aside className="shell-sidebar">
      {/* Brand */}
      <div className="mb-8 px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-black text-on-primary leading-none">D</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-on-sidebar leading-none">
              {brandTitle}
            </h1>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-on-sidebar-muted">
              {brandSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div className="mb-2 px-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-sidebar-muted/60">
          Navigation
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5">
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

      {/* Bottom divider line */}
      <div className="mx-5 border-t border-sidebar-border" />

      {/* Version tag */}
      <div className="px-5 pt-4">
        <p className="text-[10px] text-on-sidebar-muted/40 font-medium">v1.0 · Admin Panel</p>
      </div>
    </aside>
  );
}
