import React from 'react';

export default function ClinicalCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = '',
  bodyClassName = 'p-4',
  headerClassName = '',
}) {
  const hasHeader = title || subtitle || Icon || action;

  return (
    <div className={`clinical-card ${className}`}>
      {hasHeader && (
        <div
          className={`px-4 py-3 border-b border-slate-200 bg-slate-50/75 flex flex-wrap items-center justify-between gap-3 ${headerClassName}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="w-7 h-7 rounded-sm bg-dhis-100 text-dhis-700 flex items-center justify-center shrink-0 border border-dhis-200">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}