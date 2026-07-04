import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';
import { DASHBOARD_NAV_ITEMS, getNavItemByPath } from '../../routes/dashboardRoutes';

function SidebarNavItem({ to, icon, label, id }) {
  const { pathname } = useLocation();
  const currentItem = getNavItemByPath(pathname);
  const isActive = currentItem?.id === id;

  return (
    <Link to={to} className="block px-3">
      <div
        className={
          isActive
            ? 'relative flex items-center gap-3 rounded-xl px-3 py-2.5 bg-sidebar-active'
            : 'relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-sidebar-hover'
        }
      >
        <MaterialIcon
          name={icon}
          fill={isActive}
          size="sm"
          className={isActive ? 'text-on-sidebar-active' : 'text-on-sidebar-muted'}
        />

        <span
          className={
            isActive
              ? 'text-[13px] font-semibold tracking-normal text-on-sidebar-active'
              : 'text-[13px] font-medium tracking-normal text-on-sidebar-muted'
          }
        >
          {label}
        </span>

        {isActive && (
          <motion.div
            layoutId="activeDot"
            className="ml-auto h-1.5 w-1.5 rounded-full bg-on-sidebar-active"
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
        )}

        {isActive && (
          <motion.div
            layoutId="activeBar"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center -translate-x-full -ml-[1px]"
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            <div className="h-5 w-[3px] rounded-full bg-on-sidebar-active" />
          </motion.div>
        )}
      </div>
    </Link>
  );
}

export function Sidebar({ brandTitle = 'DANGG', brandSubtitle = 'Admin Console' }) {
  return (
    <aside className="shell-sidebar flex flex-col">
      {/* Brand */}
      <div className="px-6 pb-6 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
            <span className="font-display text-base font-black text-on-primary leading-none">D</span>
          </div>
          <div>
            <h1 className="font-display text-sm font-black tracking-widest text-on-sidebar uppercase leading-none">
              {brandTitle}
            </h1>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-on-sidebar-muted/60 leading-none">
              {brandSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-4 h-px bg-sidebar-border" />

      {/* Nav label */}
      <div className="mb-1.5 px-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-on-sidebar-muted/40">
          Menu
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 pb-4">
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

      {/* Divider */}
      <div className="mx-5 mb-4 h-px bg-sidebar-border" />

      {/* Footer */}
      <div className="px-6 pb-5">
        <p className="text-[10px] font-medium text-on-sidebar-muted/30 leading-none">
          v1.0 · Admin Panel
        </p>
      </div>
    </aside>
  );
}
