import React, { useMemo } from 'react';
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
}