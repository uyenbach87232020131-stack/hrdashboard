import React, { useMemo } from 'react';
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
}