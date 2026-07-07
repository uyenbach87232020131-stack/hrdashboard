import React, { useMemo } from 'react';
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
}