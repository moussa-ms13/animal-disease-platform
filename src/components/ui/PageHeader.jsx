import React from 'react';
import StatusBadge from './StatusBadge';

export default function PageHeader({
  title,
  subtitle,
  category,
  badge,
  badgeVariant = 'dhis',
  actions,
  children,
  className = '',
}) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-sm p-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {category && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-dhis-700 bg-dhis-50 border border-dhis-200 px-2 py-0.5 rounded-sm">
                {category}
              </span>
            )}
            {badge && (
              <StatusBadge variant={badgeVariant} dot>
                {badge}
              </StatusBadge>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {actions}
          </div>
        )}
      </div>
      {children && <div className="mt-4 pt-3 border-t border-slate-100">{children}</div>}
    </div>
  );
}