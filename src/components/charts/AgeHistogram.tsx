import React, { useMemo } from 'react';
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
}