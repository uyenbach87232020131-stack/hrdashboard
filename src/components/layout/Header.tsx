import React from 'react';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'HR Analytics Dashboard' }: HeaderProps) {
  const { data, isLoaded } = useData();

  return (
    <div className="h-20 flex items-center justify-between px-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h2>
      </div>
      
      {isLoaded && data && (
        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {data.fileName}
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
            {data.rowCount.toLocaleString()} rows
          </span>
        </div>
      )}
    </div>
  );
}
