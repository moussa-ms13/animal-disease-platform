import React from 'react';

const VARIANTS = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  warning: 'bg-amber-50 text-amber-800 border-amber-300',
  danger: 'bg-red-50 text-red-800 border-red-300',
  info: 'bg-sky-50 text-sky-800 border-sky-300',
  dhis: 'bg-dhis-50 text-dhis-800 border-dhis-300',
  neutral: 'bg-slate-50 text-slate-700 border-slate-300',
};

const DOT_COLORS = {
  success: 'bg-emerald-600',
  warning: 'bg-amber-600',
  danger: 'bg-red-600',
  info: 'bg-sky-600',
  dhis: 'bg-dhis-700',
  neutral: 'bg-slate-500',
};

export default function StatusBadge({
  variant = 'neutral',
  label,
  children,
  dot = false,
  className = '',
}) {
  const badgeStyle = VARIANTS[variant] || VARIANTS.neutral;
  const dotStyle = DOT_COLORS[variant] || DOT_COLORS.neutral;
  const text = label || children;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold border rounded-sm uppercase tracking-wide whitespace-nowrap ${badgeStyle} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-none shrink-0 ${dotStyle}`} />}
      <span>{text}</span>
    </span>
  );
}