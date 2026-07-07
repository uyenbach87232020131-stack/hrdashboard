/**
 * Correlation Matrix Calculator
 * Computes Pearson correlation coefficients between numerical columns
 */

import { HREmployee } from '../types/hr';
import { mean } from './dataProcessing';

export interface CorrelationResult {
  labels: string[];
  matrix: number[][];
}

/**
 * Compute Pearson correlation coefficient between two arrays
 */
function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);
  
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    sumXY += dx * dy;
    sumX2 += dx * dx;
    sumY2 += dy * dy;
  }
  
  const denominator = Math.sqrt(sumX2 * sumY2);
  if (denominator === 0) return 0;
  
  return sumXY / denominator;
}

type NumericField = 'age' | 'salary' | 'performanceScore' | 'trainingHours' | 'absenceDays' | 'promotionCount' | 'engagementScore';

const FIELD_LABELS: Record<NumericField, string> = {
  age: 'Age',
  salary: 'Salary',
  performanceScore: 'Performance',
  trainingHours: 'Training Hrs',
  absenceDays: 'Absence Days',
  promotionCount: 'Promotions',
  engagementScore: 'Engagement',
};

/**
 * Calculate correlation matrix for all numeric HR fields
 */
export function calculateCorrelationMatrix(employees: HREmployee[]): CorrelationResult {
  const fields: NumericField[] = [
    'age', 'salary', 'performanceScore', 'trainingHours',
    'absenceDays', 'promotionCount', 'engagementScore',
  ];

  // Only include fields that have data
  const activeFields = fields.filter(field => {
    return employees.some(e => e[field] !== null && e[field] !== undefined);
  });

  const labels = activeFields.map(f => FIELD_LABELS[f]);

  // Extract valid numeric arrays for each field
  const dataArrays: Record<string, number[]> = {};
  
  // Get indices where ALL fields have valid values
  const validIndices: number[] = [];
  for (let i = 0; i < employees.length; i++) {
    const allValid = activeFields.every(field => {
      const val = employees[i][field];
      return val !== null && val !== undefined && typeof val === 'number';
    });
    if (allValid) validIndices.push(i);
  }

  activeFields.forEach(field => {
    dataArrays[field] = validIndices.map(i => employees[i][field] as number);
  });

  // Compute correlation matrix
  const n = activeFields.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else if (j > i) {
        const corr = pearsonCorrelation(dataArrays[activeFields[i]], dataArrays[activeFields[j]]);
        matrix[i][j] = corr;
        matrix[j][i] = corr; // Symmetric
      }
    }
  }

  return { labels, matrix };
}

/**
 * Get color for correlation value
 * Returns a CSS color string based on correlation strength
 */
export function getCorrelationColor(value: number, isDark: boolean = false): string {
  const abs = Math.abs(value);
  const alpha = Math.max(0.15, abs);
  
  if (value > 0) {
    // Positive correlation: blue shades
    return isDark 
      ? `rgba(96, 165, 250, ${alpha})`  // blue-400
      : `rgba(37, 99, 235, ${alpha})`;   // blue-600
  } else if (value < 0) {
    // Negative correlation: red shades
    return isDark 
      ? `rgba(248, 113, 113, ${alpha})` // red-400
      : `rgba(220, 38, 38, ${alpha})`;   // red-600
  }
  
  return isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)';
}
