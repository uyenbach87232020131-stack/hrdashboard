import React, { useState } from 'react';
import KPIGrid from '../components/kpi/KPIGrid';
import DepartmentCharts from '../components/charts/DepartmentCharts';
import GenderChart from '../components/charts/GenderChart';
import AgeHistogram from '../components/charts/AgeHistogram';
import SalaryCharts from '../components/charts/SalaryCharts';
import PerformanceChart from '../components/charts/PerformanceChart';
import EngagementChart from '../components/charts/EngagementChart';
import TrainingChart from '../components/charts/TrainingChart';
import PromotionChart from '../components/charts/PromotionChart';
import AbsenceChart from '../components/charts/AbsenceChart';
import HiringCharts from '../components/charts/HiringCharts';
import TurnoverCharts from '../components/charts/TurnoverCharts';
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap';
import FilterPanel from '../components/filters/FilterPanel';
import { useFilter } from '../context/FilterContext';
import { Filter } from 'lucide-react';

export default function DashboardPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { activeFilterCount } = useFilter();

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
          )}
        </button>
      </div>

      <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} />

      <KPIGrid />
      
      <h2 className="text-xl font-bold mb-4 mt-8">Department Analysis</h2>
      <DepartmentCharts />
      
      <h2 className="text-xl font-bold mb-4 mt-8">Demographics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GenderChart />
        <AgeHistogram />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Compensation</h2>
      <SalaryCharts />

      <h2 className="text-xl font-bold mb-4 mt-8">Performance & Engagement</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PerformanceChart />
        <EngagementChart />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Training & Promotions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrainingChart />
        <PromotionChart />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Absence</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AbsenceChart />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Hiring Trends</h2>
      <HiringCharts />

      <h2 className="text-xl font-bold mb-4 mt-8">Turnover Analysis</h2>
      <TurnoverCharts />

      <h2 className="text-xl font-bold mb-4 mt-8">Correlations</h2>
      <CorrelationHeatmap />
    </div>
  );
}