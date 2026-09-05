import React from 'react';

const variantStyles = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  brand: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
};

const dotColors = {
  emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
  rose: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]',
  amber: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
  brand: 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]',
  sky: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]',
  slate: 'bg-slate-400',
};

export default function Badge({ children, variant = 'slate', dot = false, pulse = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant] || variantStyles.slate} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant] || dotColors.slate}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant] || dotColors.slate}`} />
        </span>
      )}
      {children}
    </span>
  );
}
