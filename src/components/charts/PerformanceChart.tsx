import React, { useMemo } from 'react';
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
}