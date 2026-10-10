import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'teal';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
  };

  const textColors = {
    neutral: 'text-slate-600',
    indigo: 'text-indigo-700',
    emerald: 'text-emerald-700',
    violet: 'text-violet-700',
    amber: 'text-amber-800',
    rose: 'text-rose-700',
    teal: 'text-teal-700',
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    violet: 'bg-violet-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    teal: 'bg-teal-600',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium tracking-normal ${sizes[size]} ${textColors[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

