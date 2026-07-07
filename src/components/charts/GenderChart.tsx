import React, { useMemo } from 'react';
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
            label={({percent}) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}