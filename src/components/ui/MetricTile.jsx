import React from 'react';

const BORDER_COLORS = {
  emerald: 'border-l-4 border-l-emerald-600',
  amber: 'border-l-4 border-l-amber-500',
  red: 'border-l-4 border-l-red-600',
  dhis: 'border-l-4 border-l-dhis-700',
  slate: 'border-l-4 border-l-slate-400',
};

const RTL_BORDER_COLORS = {
  emerald: 'rtl:border-l-0 rtl:border-r-4 rtl:border-r-emerald-600',
  amber: 'rtl:border-l-0 rtl:border-r-4 rtl:border-r-amber-500',
  red: 'rtl:border-l-0 rtl:border-r-4 rtl:border-r-red-600',
  dhis: 'rtl:border-l-0 rtl:border-r-4 rtl:border-r-dhis-700',
  slate: 'rtl:border-l-0 rtl:border-r-4 rtl:border-r-slate-400',
};

export default function MetricTile({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'dhis',
  className = '',
}) {
  const borderStyle = BORDER_COLORS[variant] || BORDER_COLORS.dhis;
  const rtlBorderStyle = RTL_BORDER_COLORS[variant] || RTL_BORDER_COLORS.dhis;

  return (
    <div
      className={`bg-white border border-slate-200 rounded-sm p-4 ${borderStyle} ${rtlBorderStyle} ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
          {value}
        </span>
      </div>
      {subtext && (
        <p className="text-[11px] text-slate-500 mt-1 truncate">
          {subtext}
        </p>
      )}
    </div>
  );
}