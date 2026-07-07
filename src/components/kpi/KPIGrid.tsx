import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { calculateKPIs } from '../../utils/dataProcessing';
import { formatNumber, formatPercent, formatCurrency } from '../../utils/formatters';
import KPICard from './KPICard';
import { Users, UserCheck, UserX, TrendingDown, Calendar, DollarSign, BarChart2, Star, Heart, BookOpen, BedDouble, Award } from 'lucide-react';

export default function KPIGrid() {
  const { filteredEmployees } = useFilter();
  const kpis = useMemo(() => calculateKPIs(filteredEmployees), [filteredEmployees]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      <KPICard title="Total Employees" value={formatNumber(kpis.totalEmployees)} icon={<Users size={20} />} color="bg-gradient-to-br from-blue-500 to-blue-600" />
      <KPICard title="Active Employees" value={formatNumber(kpis.activeEmployees)} icon={<UserCheck size={20} />} color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
      <KPICard title="Terminated" value={formatNumber(kpis.terminatedEmployees)} icon={<UserX size={20} />} color="bg-gradient-to-br from-red-500 to-red-600" />
      <KPICard title="Turnover Rate" value={formatPercent(kpis.turnoverRate)} icon={<TrendingDown size={20} />} color="bg-gradient-to-br from-orange-500 to-orange-600" />
      
      <KPICard title="Average Age" value={formatNumber(kpis.averageAge, 1)} icon={<Calendar size={20} />} color="bg-gradient-to-br from-cyan-500 to-cyan-600" />
      <KPICard title="Average Salary" value={formatCurrency(kpis.averageSalary)} icon={<DollarSign size={20} />} color="bg-gradient-to-br from-violet-500 to-violet-600" />
      <KPICard title="Median Salary" value={formatCurrency(kpis.medianSalary)} icon={<DollarSign size={20} />} color="bg-gradient-to-br from-purple-500 to-purple-600" />
      <KPICard title="Avg Performance" value={formatNumber(kpis.averagePerformance, 2)} icon={<Star size={20} />} color="bg-gradient-to-br from-amber-500 to-amber-600" />
      
      <KPICard title="Avg Engagement" value={formatNumber(kpis.averageEngagement, 2)} icon={<Heart size={20} />} color="bg-gradient-to-br from-pink-500 to-pink-600" />
      <KPICard title="Avg Training Hrs" value={formatNumber(kpis.averageTrainingHours, 1)} icon={<BookOpen size={20} />} color="bg-gradient-to-br from-indigo-500 to-indigo-600" />
      <KPICard title="Avg Absence Days" value={formatNumber(kpis.averageAbsenceDays, 1)} icon={<BedDouble size={20} />} color="bg-gradient-to-br from-slate-500 to-slate-600" />
      <KPICard title="Avg Promotions" value={formatNumber(kpis.averagePromotionCount, 2)} icon={<Award size={20} />} color="bg-gradient-to-br from-teal-500 to-teal-600" />
    </div>
  );
}