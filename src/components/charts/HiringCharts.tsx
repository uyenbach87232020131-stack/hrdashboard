import React, { useMemo } from 'react';
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
}