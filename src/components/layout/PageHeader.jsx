import React from 'react';

/**
 * Reusable Page Header component for dashboard pages.
 * Renders page-specific descriptions and actions.
 * The main page title is rendered by the TopBar in DashboardLayout.
 */
export function PageHeader({ description, children, className = '' }) {
  return (
    <header className={`mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 ${className}`.trim()}>
      {description && (
        <div className="max-w-2xl">
          <p className="text-body-lg normal-case text-on-surface-variant">
            {description}
          </p>
        </div>
      )}
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
}
