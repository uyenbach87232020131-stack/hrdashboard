import React, { useMemo } from 'react';
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
            <YAxis stroke="currentColor" className="text-slate-500 text-xs" tickFormatter={(v) => `${v/1000}k`} />
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
}