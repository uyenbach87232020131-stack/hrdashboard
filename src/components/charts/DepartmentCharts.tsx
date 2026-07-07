import React, { useMemo } from 'react';
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
            <YAxis 
              stroke="currentColor" 
              className="text-slate-500 text-xs" 
              tickFormatter={(v) => v >= 1000 ? `${Math.round(v/1000)}k` : `$${v}`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              cursor={{fill: 'transparent'}} 
              formatter={(val: number) => [`$${Math.round(val).toLocaleString()}/year`, 'Avg Salary']} 
            />
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
}