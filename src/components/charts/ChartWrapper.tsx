import React from 'react';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartWrapper({ title, subtitle, children, className = '' }: ChartWrapperProps) {
  return (
    <div className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="w-full relative" style={{ minHeight: '300px' }}>
        {children}
      </div>
    </div>
  );
}