import React from 'react';

const VARIANTS = {
  primary:
    'bg-dhis-700 hover:bg-dhis-800 active:bg-dhis-900 text-white border-dhis-800 focus:ring-dhis-700',
  secondary:
    'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-slate-300 focus:ring-slate-400',
  danger:
    'bg-red-700 hover:bg-red-800 active:bg-red-900 text-white border-red-800 focus:ring-red-600',
  success:
    'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white border-emerald-800 focus:ring-emerald-600',
  outline:
    'bg-transparent hover:bg-slate-100 text-slate-700 border-slate-300 focus:ring-slate-400',
};

const SIZES = {
  sm: 'h-7 text-xs px-2.5 gap-1',
  md: 'h-8 text-xs px-3.5 gap-1.5',
  lg: 'h-9 text-sm px-4 gap-2',
};

export default function ClinicalButton({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'start',
  children,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyle = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold border rounded-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'start' && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'end' && <Icon className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );
}