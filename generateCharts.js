const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'src', 'components', 'charts');
const kpiDir = path.join(__dirname, 'src', 'components', 'kpi');
fs.mkdirSync(chartsDir, { recursive: true });
fs.mkdirSync(kpiDir, { recursive: true });

const files = {
  'kpi/KPICard.tsx': `import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export default function KPICard({ title, value, icon, color, subtitle }: KPICardProps) {
  return (
    <div className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-5 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-default">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={\`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center \${color} shadow-lg text-white\`}>
          {icon}
        </div>
      </div>
    </div>
  );
}`,

  'kpi/KPIGrid.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { calculateKPIs } from '../../utils/dataProcessing';
import { formatNumber, formatPercent } from '../../utils/formatters';
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
      <KPICard title="Average Salary" value={formatNumber(kpis.averageSalary)} icon={<DollarSign size={20} />} color="bg-gradient-to-br from-violet-500 to-violet-600" />
      <KPICard title="Median Salary" value={formatNumber(kpis.medianSalary)} icon={<DollarSign size={20} />} color="bg-gradient-to-br from-purple-500 to-purple-600" />
      <KPICard title="Avg Performance" value={formatNumber(kpis.averagePerformance, 2)} icon={<Star size={20} />} color="bg-gradient-to-br from-amber-500 to-amber-600" />
      
      <KPICard title="Avg Engagement" value={formatNumber(kpis.averageEngagement, 2)} icon={<Heart size={20} />} color="bg-gradient-to-br from-pink-500 to-pink-600" />
      <KPICard title="Avg Training Hrs" value={formatNumber(kpis.averageTrainingHours, 1)} icon={<BookOpen size={20} />} color="bg-gradient-to-br from-indigo-500 to-indigo-600" />
      <KPICard title="Avg Absence Days" value={formatNumber(kpis.averageAbsenceDays, 1)} icon={<BedDouble size={20} />} color="bg-gradient-to-br from-slate-500 to-slate-600" />
      <KPICard title="Avg Promotions" value={formatNumber(kpis.averagePromotionCount, 2)} icon={<Award size={20} />} color="bg-gradient-to-br from-teal-500 to-teal-600" />
    </div>
  );
}`,

  'charts/ChartWrapper.tsx': `import React from 'react';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartWrapper({ title, subtitle, children, className = '' }: ChartWrapperProps) {
  return (
    <div className={\`bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 \${className}\`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="w-full relative" style={{ minHeight: '300px' }}>
        {children}
      </div>
    </div>
  );
}`,

  'charts/DepartmentCharts.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { countByField, averageByField } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#818cf8', '#60a5fa', '#38bdf8', '#22d3ee', '#2dd4bf', '#34d399', '#4ade80', '#a3e635'];

export default function DepartmentCharts() {
  const { filteredEmployees } = useFilter();

  const countData = useMemo(() => countByField(filteredEmployees, 'department'), [filteredEmployees]);
  const salaryData = useMemo(() => averageByField(filteredEmployees, 'department', 'salary'), [filteredEmployees]);
  const perfData = useMemo(() => averageByField(filteredEmployees, 'department', 'performanceScore'), [filteredEmployees]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
      <ChartWrapper title="Employee Count by Department">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countData} layout="vertical" margin={{ left: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis type="number" stroke="currentColor" className="text-slate-500" />
            <YAxis type="category" dataKey="name" width={80} stroke="currentColor" className="text-slate-500 text-xs" />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: 'var(--tw-prose-bg)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
            <Bar dataKey="value" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
      
      <ChartWrapper title="Average Salary by Department">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salaryData} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" stroke="currentColor" className="text-slate-500 text-xs" />
            <YAxis stroke="currentColor" className="text-slate-500 text-xs" tickFormatter={(v) => \`\${v/1000}k\`} />
            <Tooltip cursor={{fill: 'transparent'}} formatter={(val: number) => [val.toFixed(0), 'Avg Salary']} />
            <Bar dataKey="value" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Average Performance by Department">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perfData} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" stroke="currentColor" className="text-slate-500 text-xs" />
            <YAxis stroke="currentColor" className="text-slate-500 text-xs" domain={[0, 10]} />
            <Tooltip cursor={{fill: 'transparent'}} formatter={(val: number) => [val.toFixed(2), 'Avg Score']} />
            <Bar dataKey="value" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}`,

  'charts/GenderChart.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { countByField } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function GenderChart() {
  const { filteredEmployees } = useFilter();
  const data = useMemo(() => countByField(filteredEmployees, 'gender'), [filteredEmployees]);

  return (
    <ChartWrapper title="Gender Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({percent}) => \`\${(percent * 100).toFixed(0)}%\`}
          >
            {data.map((entry, index) => (
              <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}`,

  'charts/AgeHistogram.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { createHistogramData } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AgeHistogram() {
  const { filteredEmployees } = useFilter();
  const data = useMemo(() => {
    const ages = filteredEmployees.map(e => e.age).filter((a): a is number => a !== null);
    return createHistogramData(ages, 8);
  }, [filteredEmployees]);

  return (
    <ChartWrapper title="Age Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
          <XAxis dataKey="name" stroke="currentColor" className="text-slate-500" />
          <YAxis stroke="currentColor" className="text-slate-500" />
          <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.1)'}} formatter={(val: number) => [val, 'Count']} />
          <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}`,

  'charts/SalaryCharts.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { createHistogramData, quartiles } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalaryCharts() {
  const { filteredEmployees } = useFilter();
  
  const histogramData = useMemo(() => {
    const salaries = filteredEmployees.map(e => e.salary).filter((s): s is number => s !== null);
    return createHistogramData(salaries, 10);
  }, [filteredEmployees]);

  const boxPlotData = useMemo(() => {
    const salaries = filteredEmployees.map(e => e.salary).filter((s): s is number => s !== null);
    if (salaries.length === 0) return [];
    const q = quartiles(salaries);
    // Render a simplistic box plot data shape
    return [
      { name: 'Salary', min: q.min, q1: q.q1, median: q.q2, q3: q.q3, max: q.max }
    ];
  }, [filteredEmployees]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartWrapper title="Salary Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" stroke="currentColor" className="text-slate-500 text-xs" />
            <YAxis stroke="currentColor" className="text-slate-500 text-xs" tickFormatter={(v) => \`\${v/1000}k\`} />
            <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.1)'}} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Salary Box Plot (Summary)">
        <div className="flex flex-col justify-center h-full space-y-4 px-8">
          {boxPlotData.length > 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Maximum</span>
                <span className="font-semibold">{boxPlotData[0].max.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">3rd Quartile</span>
                <span className="font-semibold">{boxPlotData[0].q3.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2 text-indigo-600 dark:text-indigo-400 font-bold border-y border-slate-200 dark:border-slate-700 py-2">
                <span>Median</span>
                <span>{boxPlotData[0].median.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2 mt-2">
                <span className="text-slate-500">1st Quartile</span>
                <span className="font-semibold">{boxPlotData[0].q1.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Minimum</span>
                <span className="font-semibold">{boxPlotData[0].min.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">No data available</div>
          )}
        </div>
      </ChartWrapper>
    </div>
  );
}`,

  'charts/PerformanceChart.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { createHistogramData } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformanceChart() {
  const { filteredEmployees } = useFilter();
  const data = useMemo(() => {
    const scores = filteredEmployees.map(e => e.performanceScore).filter((s): s is number => s !== null);
    return createHistogramData(scores, 5);
  }, [filteredEmployees]);

  return (
    <ChartWrapper title="Performance Score Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
          <XAxis dataKey="name" stroke="currentColor" className="text-slate-500" />
          <YAxis stroke="currentColor" className="text-slate-500" />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}`,

  'charts/EngagementChart.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { createHistogramData } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EngagementChart() {
  const { filteredEmployees } = useFilter();
  const data = useMemo(() => {
    const scores = filteredEmployees.map(e => e.engagementScore).filter((s): s is number => s !== null);
    return createHistogramData(scores, 5);
  }, [filteredEmployees]);

  return (
    <ChartWrapper title="Engagement Score Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
          <XAxis dataKey="name" stroke="currentColor" className="text-slate-500" />
          <YAxis stroke="currentColor" className="text-slate-500" />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}`,

  'charts/TrainingChart.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { averageByField } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrainingChart() {
  const { filteredEmployees } = useFilter();
  const data = useMemo(() => averageByField(filteredEmployees, 'department', 'trainingHours'), [filteredEmployees]);

  return (
    <ChartWrapper title="Average Training Hours by Department">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" stroke="currentColor" className="text-slate-500 text-xs" />
          <YAxis stroke="currentColor" className="text-slate-500" />
          <Tooltip cursor={{fill: 'transparent'}} formatter={(val: number) => [val.toFixed(1), 'Hours']} />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}`,

  'charts/PromotionChart.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { averageByField } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PromotionChart() {
  const { filteredEmployees } = useFilter();
  const data = useMemo(() => averageByField(filteredEmployees, 'department', 'promotionCount'), [filteredEmployees]);

  return (
    <ChartWrapper title="Average Promotion Count by Department">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" stroke="currentColor" className="text-slate-500 text-xs" />
          <YAxis stroke="currentColor" className="text-slate-500" />
          <Tooltip cursor={{fill: 'transparent'}} formatter={(val: number) => [val.toFixed(2), 'Promotions']} />
          <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}`,

  'charts/AbsenceChart.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { createHistogramData } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AbsenceChart() {
  const { filteredEmployees } = useFilter();
  const data = useMemo(() => {
    const days = filteredEmployees.map(e => e.absenceDays).filter((a): a is number => a !== null);
    return createHistogramData(days, 8);
  }, [filteredEmployees]);

  return (
    <ChartWrapper title="Absence Days Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
          <XAxis dataKey="name" stroke="currentColor" className="text-slate-500" />
          <YAxis stroke="currentColor" className="text-slate-500" />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}`,

  'charts/HiringCharts.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { getHiringByYear, getHiringByMonth } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HiringCharts() {
  const { filteredEmployees } = useFilter();
  const yearlyData = useMemo(() => getHiringByYear(filteredEmployees), [filteredEmployees]);
  const monthlyData = useMemo(() => getHiringByMonth(filteredEmployees), [filteredEmployees]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartWrapper title="Hiring Trend (Yearly)">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={yearlyData}>
            <defs>
              <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis dataKey="name" stroke="currentColor" className="text-slate-500" />
            <YAxis stroke="currentColor" className="text-slate-500" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorHired)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
      
      <ChartWrapper title="Hiring Seasonality (Monthly)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis dataKey="name" stroke="currentColor" className="text-slate-500 text-xs" />
            <YAxis stroke="currentColor" className="text-slate-500" />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}`,

  'charts/TurnoverCharts.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { getTerminationByYear, getMonthlyTurnover } from '../../utils/dataProcessing';
import ChartWrapper from './ChartWrapper';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TurnoverCharts() {
  const { filteredEmployees } = useFilter();
  const yearlyData = useMemo(() => getTerminationByYear(filteredEmployees), [filteredEmployees]);
  const monthlyData = useMemo(() => getMonthlyTurnover(filteredEmployees), [filteredEmployees]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartWrapper title="Terminations by Year">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis dataKey="name" stroke="currentColor" className="text-slate-500" />
            <YAxis stroke="currentColor" className="text-slate-500" />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
      
      <ChartWrapper title="Monthly Turnover Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis dataKey="name" stroke="currentColor" className="text-slate-500 text-xs" tickFormatter={(v) => v.substring(2)} />
            <YAxis yAxisId="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="hired" stroke="#3b82f6" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="terminated" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}`,

  'charts/CorrelationHeatmap.tsx': `import React, { useMemo } from 'react';
import { useFilter } from '../../context/FilterContext';
import { calculateCorrelationMatrix, getCorrelationColor } from '../../utils/correlationMatrix';
import { useTheme } from '../../context/ThemeContext';
import ChartWrapper from './ChartWrapper';

export default function CorrelationHeatmap() {
  const { filteredEmployees } = useFilter();
  const { isDark } = useTheme();
  
  const { labels, matrix } = useMemo(() => calculateCorrelationMatrix(filteredEmployees), [filteredEmployees]);

  const CELL_SIZE = 50;
  const MARGIN_LEFT = 100;
  const MARGIN_TOP = 100;
  
  if (labels.length === 0) {
    return <ChartWrapper title="Correlation Heatmap"><div className="p-8 text-center text-slate-500">Not enough data to calculate correlations.</div></ChartWrapper>;
  }

  const width = labels.length * CELL_SIZE + MARGIN_LEFT + 20;
  const height = labels.length * CELL_SIZE + MARGIN_TOP + 20;

  return (
    <ChartWrapper title="Correlation Heatmap">
      <div className="overflow-x-auto w-full flex justify-center pb-4">
        <svg width={width} height={height} className="text-xs">
          <g transform={\`translate(\${MARGIN_LEFT}, \${MARGIN_TOP})\`}>
            {/* Draw Columns */}
            {labels.map((label, i) => (
              <text 
                key={\`col-\${i}\`}
                x={i * CELL_SIZE + CELL_SIZE / 2} 
                y={-10}
                textAnchor="start"
                transform={\`rotate(-45, \${i * CELL_SIZE + CELL_SIZE / 2}, -10)\`}
                fill="currentColor"
                className="text-slate-600 dark:text-slate-300 font-medium"
              >
                {label}
              </text>
            ))}
            
            {/* Draw Rows & Cells */}
            {labels.map((rowLabel, i) => (
              <g key={\`row-\${i}\`}>
                <text 
                  x={-10} 
                  y={i * CELL_SIZE + CELL_SIZE / 2} 
                  dominantBaseline="middle" 
                  textAnchor="end"
                  fill="currentColor"
                  className="text-slate-600 dark:text-slate-300 font-medium"
                >
                  {rowLabel}
                </text>
                
                {matrix[i].map((val, j) => (
                  <g key={\`cell-\${i}-\${j}\`}>
                    <rect 
                      x={j * CELL_SIZE} 
                      y={i * CELL_SIZE} 
                      width={CELL_SIZE} 
                      height={CELL_SIZE}
                      fill={getCorrelationColor(val, isDark)}
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                      strokeWidth={1}
                    />
                    <text 
                      x={j * CELL_SIZE + CELL_SIZE / 2} 
                      y={i * CELL_SIZE + CELL_SIZE / 2}
                      dominantBaseline="middle" 
                      textAnchor="middle"
                      fill={isDark ? '#f8fafc' : '#0f172a'}
                      className={Math.abs(val) > 0.5 ? 'font-bold' : ''}
                    >
                      {val === 1 ? '1.00' : val.toFixed(2)}
                    </text>
                  </g>
                ))}
              </g>
            ))}
          </g>
        </svg>
      </div>
    </ChartWrapper>
  );
}`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, 'src', 'components', filename), content);
}
console.log('Charts components generated successfully.');
