import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'indigo' | 'emerald' | 'amber' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5',
  };

  const variants = {
    // Dark editorial slate
    primary: 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white shadow-xs',
    // Clean secondary
    secondary: 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800',
    // Doctor Care
    indigo: 'bg-indigo-900 hover:bg-indigo-800 active:bg-indigo-950 text-white shadow-xs',
    // Diagnostics
    emerald: 'bg-emerald-850 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-xs bg-[#064e3b]',
    // Care Assist
    amber: 'bg-amber-800 hover:bg-amber-700 active:bg-amber-900 text-white shadow-xs bg-[#78350f]',
    // Outline
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 active:bg-slate-100',
    // Ghost
    ghost: 'text-slate-600 hover:bg-slate-100/80 active:bg-slate-200/60',
    // Danger
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
