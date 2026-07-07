import React, { useMemo } from 'react';
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
          <g transform={`translate(${MARGIN_LEFT}, ${MARGIN_TOP})`}>
            {/* Draw Columns */}
            {labels.map((label, i) => (
              <text 
                key={`col-${i}`}
                x={i * CELL_SIZE + CELL_SIZE / 2} 
                y={-10}
                textAnchor="start"
                transform={`rotate(-45, ${i * CELL_SIZE + CELL_SIZE / 2}, -10)`}
                fill="currentColor"
                className="text-slate-600 dark:text-slate-300 font-medium"
              >
                {label}
              </text>
            ))}
            
            {/* Draw Rows & Cells */}
            {labels.map((rowLabel, i) => (
              <g key={`row-${i}`}>
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
                  <g key={`cell-${i}-${j}`}>
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
}