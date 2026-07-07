import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { Filter, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { filterState, filterOptions, updateFilter, resetFilters, activeFilterCount } = useFilter();

  const handleCheckbox = (key: 'departments' | 'genders' | 'hireYears', value: string | number) => {
    const current = filterState[key] as any[];
    if (current.includes(value)) {
      updateFilter(key, current.filter(v => v !== value) as any);
    } else {
      updateFilter(key, [...current, value] as any);
    }
  };

  const handleRange = (key: 'ageRange' | 'salaryRange' | 'performanceRange' | 'engagementRange', index: 0 | 1, value: number) => {
    const newRange = [...filterState[key]] as [number, number];
    newRange[index] = value;
    updateFilter(key, newRange);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full font-medium">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors" title="Reset All">
                <RotateCcw size={18} />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <FilterSection title="Departments">
            <div className="space-y-2">
              {filterOptions.departments.map(dept => (
                <label key={dept} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filterState.departments.includes(dept)} onChange={() => handleCheckbox('departments', dept)} className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600" />
                  <span className="text-sm">{dept}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Gender">
            <div className="space-y-2">
              {filterOptions.genders.map(g => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filterState.genders.includes(g)} onChange={() => handleCheckbox('genders', g)} className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600" />
                  <span className="text-sm">{g}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Age Range">
            <div className="flex items-center gap-2">
              <input type="number" value={filterState.ageRange[0]} min={filterOptions.ageMin} max={filterState.ageRange[1]} onChange={e => handleRange('ageRange', 0, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <span className="text-slate-500">-</span>
              <input type="number" value={filterState.ageRange[1]} min={filterState.ageRange[0]} max={filterOptions.ageMax} onChange={e => handleRange('ageRange', 1, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            </div>
          </FilterSection>
          
          <FilterSection title="Salary Range">
            <div className="flex items-center gap-2">
              <input type="number" value={filterState.salaryRange[0]} min={filterOptions.salaryMin} max={filterState.salaryRange[1]} onChange={e => handleRange('salaryRange', 0, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <span className="text-slate-500">-</span>
              <input type="number" value={filterState.salaryRange[1]} min={filterState.salaryRange[0]} max={filterOptions.salaryMax} onChange={e => handleRange('salaryRange', 1, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            </div>
          </FilterSection>

          <FilterSection title="Performance Score">
            <div className="flex items-center gap-2">
              <input type="number" value={filterState.performanceRange[0]} min={filterOptions.performanceMin} max={filterState.performanceRange[1]} onChange={e => handleRange('performanceRange', 0, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <span className="text-slate-500">-</span>
              <input type="number" value={filterState.performanceRange[1]} min={filterState.performanceRange[0]} max={filterOptions.performanceMax} onChange={e => handleRange('performanceRange', 1, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            </div>
          </FilterSection>
        </div>
      </div>
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <h3 className="font-semibold text-sm">{title}</h3>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}