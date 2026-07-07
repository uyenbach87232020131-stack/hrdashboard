/**
 * Data Processing Utilities
 * Statistical functions, data cleaning, and aggregation for HR analytics
 */

import { HREmployee, ColumnMapping, KPIData, FilterState, FilterOptions } from '../types/hr';

// ============================================================
// Data Parsing & Cleaning
// ============================================================

/**
 * Parse a raw Excel row into an HREmployee record using column mapping
 */
export function parseEmployee(
  row: Record<string, unknown>,
  mapping: ColumnMapping,
  index: number
): HREmployee {
  const getString = (field: keyof ColumnMapping): string => {
    const col = mapping[field];
    if (!col || row[col] === undefined || row[col] === null) return '';
    return String(row[col]).trim();
  };

  const getNumber = (field: keyof ColumnMapping): number | null => {
    const col = mapping[field];
    if (!col || row[col] === undefined || row[col] === null || row[col] === '') return null;
    const num = Number(row[col]);
    return isNaN(num) ? null : num;
  };

  const getDate = (field: keyof ColumnMapping): Date | null => {
    const col = mapping[field];
    if (!col || row[col] === undefined || row[col] === null || row[col] === '') return null;
    
    const val = row[col];
    
    // Handle Excel serial date numbers
    if (typeof val === 'number') {
      // Excel serial date: days since 1900-01-01 (with the 1900 leap year bug)
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + val * 86400000);
      if (!isNaN(date.getTime())) return date;
    }
    
    // Handle string dates
    if (typeof val === 'string') {
      const date = new Date(val);
      if (!isNaN(date.getTime())) return date;
      
      // Try DD/MM/YYYY format common in Vietnamese data
      const parts = val.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
      if (parts) {
        const d = new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1]));
        if (!isNaN(d.getTime())) return d;
      }
    }
    
    if (val instanceof Date) return val;
    
    return null;
  };

  // Determine status
  let status = getString('status');
  if (!status) {
    // Infer from termination date
    const termDate = getDate('terminationDate');
    status = termDate ? 'Terminated' : 'Active';
  }

  // Normalize status values
  const statusLower = status.toLowerCase();
  if (statusLower.includes('active') || statusLower.includes('đang làm') || statusLower.includes('hoạt động')) {
    status = 'Active';
  } else if (statusLower.includes('terminated') || statusLower.includes('nghỉ') || statusLower.includes('thôi') || statusLower.includes('left') || statusLower.includes('resigned') || statusLower.includes('fired')) {
    status = 'Terminated';
  }

  return {
    employeeId: getString('employeeId') || index + 1,
    name: getString('name'),
    department: getString('department') || 'Unknown',
    gender: normalizeGender(getString('gender')),
    age: getNumber('age'),
    salary: getNumber('salary'),
    hireDate: getDate('hireDate'),
    terminationDate: getDate('terminationDate'),
    status,
    performanceScore: getNumber('performanceScore'),
    engagementScore: getNumber('engagementScore'),
    trainingHours: getNumber('trainingHours'),
    absenceDays: getNumber('absenceDays'),
    promotionCount: getNumber('promotionCount'),
    jobTitle: getString('jobTitle'),
    education: getString('education'),
    maritalStatus: getString('maritalStatus'),
    rawData: { ...row },
  };
}

function normalizeGender(value: string): string {
  const lower = value.toLowerCase();
  if (lower === 'male' || lower === 'nam' || lower === 'm') return 'Male';
  if (lower === 'female' || lower === 'nữ' || lower === 'nu' || lower === 'f') return 'Female';
  if (lower === 'other' || lower === 'khác' || lower === 'khac') return 'Other';
  return value || 'Unknown';
}

// ============================================================
// Statistical Functions
// ============================================================

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / (values.length - 1));
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

export function quartiles(values: number[]): { q1: number; q2: number; q3: number; min: number; max: number } {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    min: sorted[0] || 0,
    q1: percentile(sorted, 25),
    q2: percentile(sorted, 50),
    q3: percentile(sorted, 75),
    max: sorted[sorted.length - 1] || 0,
  };
}

// ============================================================
// KPI Calculations
// ============================================================

export function calculateKPIs(employees: HREmployee[]): KPIData {
  const active = employees.filter(e => e.status === 'Active');
  const terminated = employees.filter(e => e.status === 'Terminated');
  
  const ages = employees.map(e => e.age).filter((v): v is number => v !== null);
  const salaries = employees.map(e => e.salary).filter((v): v is number => v !== null);
  const perfScores = employees.map(e => e.performanceScore).filter((v): v is number => v !== null);
  const engScores = employees.map(e => e.engagementScore).filter((v): v is number => v !== null);
  const trainingHrs = employees.map(e => e.trainingHours).filter((v): v is number => v !== null);
  const absDays = employees.map(e => e.absenceDays).filter((v): v is number => v !== null);
  const promoCount = employees.map(e => e.promotionCount).filter((v): v is number => v !== null);

  return {
    totalEmployees: employees.length,
    activeEmployees: active.length,
    terminatedEmployees: terminated.length,
    turnoverRate: employees.length > 0 ? (terminated.length / employees.length) * 100 : 0,
    averageAge: mean(ages),
    averageSalary: mean(salaries),
    medianSalary: median(salaries),
    averagePerformance: mean(perfScores),
    averageEngagement: mean(engScores),
    averageTrainingHours: mean(trainingHrs),
    averageAbsenceDays: mean(absDays),
    averagePromotionCount: mean(promoCount),
  };
}

// ============================================================
// Filter Logic
// ============================================================

export function getFilterOptions(employees: HREmployee[]): FilterOptions {
  const departments = [...new Set(employees.map(e => e.department))].filter(Boolean).sort();
  const genders = [...new Set(employees.map(e => e.gender))].filter(Boolean).sort();
  
  const ages = employees.map(e => e.age).filter((v): v is number => v !== null);
  const salaries = employees.map(e => e.salary).filter((v): v is number => v !== null);
  const perfScores = employees.map(e => e.performanceScore).filter((v): v is number => v !== null);
  const engScores = employees.map(e => e.engagementScore).filter((v): v is number => v !== null);
  
  const hireYears = employees
    .map(e => e.hireDate?.getFullYear())
    .filter((v): v is number => v !== undefined && v !== null);
  const uniqueYears = [...new Set(hireYears)].sort();

  return {
    departments,
    genders,
    ageMin: ages.length ? Math.min(...ages) : 0,
    ageMax: ages.length ? Math.max(...ages) : 100,
    salaryMin: salaries.length ? Math.min(...salaries) : 0,
    salaryMax: salaries.length ? Math.max(...salaries) : 1000000,
    hireYears: uniqueYears,
    performanceMin: perfScores.length ? Math.min(...perfScores) : 0,
    performanceMax: perfScores.length ? Math.max(...perfScores) : 10,
    engagementMin: engScores.length ? Math.min(...engScores) : 0,
    engagementMax: engScores.length ? Math.max(...engScores) : 10,
  };
}

export function createDefaultFilter(options: FilterOptions): FilterState {
  return {
    departments: [],
    genders: [],
    ageRange: [options.ageMin, options.ageMax],
    salaryRange: [options.salaryMin, options.salaryMax],
    hireYears: [],
    performanceRange: [options.performanceMin, options.performanceMax],
    engagementRange: [options.engagementMin, options.engagementMax],
  };
}

export function applyFilters(employees: HREmployee[], filters: FilterState): HREmployee[] {
  return employees.filter(emp => {
    // Department filter
    if (filters.departments.length > 0 && !filters.departments.includes(emp.department)) {
      return false;
    }
    
    // Gender filter
    if (filters.genders.length > 0 && !filters.genders.includes(emp.gender)) {
      return false;
    }
    
    // Age range filter
    if (emp.age !== null) {
      if (emp.age < filters.ageRange[0] || emp.age > filters.ageRange[1]) {
        return false;
      }
    }
    
    // Salary range filter
    if (emp.salary !== null) {
      if (emp.salary < filters.salaryRange[0] || emp.salary > filters.salaryRange[1]) {
        return false;
      }
    }
    
    // Hire year filter
    if (filters.hireYears.length > 0 && emp.hireDate) {
      if (!filters.hireYears.includes(emp.hireDate.getFullYear())) {
        return false;
      }
    }
    
    // Performance range filter
    if (emp.performanceScore !== null) {
      if (emp.performanceScore < filters.performanceRange[0] || emp.performanceScore > filters.performanceRange[1]) {
        return false;
      }
    }
    
    // Engagement range filter
    if (emp.engagementScore !== null) {
      if (emp.engagementScore < filters.engagementRange[0] || emp.engagementScore > filters.engagementRange[1]) {
        return false;
      }
    }
    
    return true;
  });
}

// ============================================================
// Aggregation Functions for Charts
// ============================================================

export function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function countByField(employees: HREmployee[], field: keyof HREmployee): { name: string; value: number }[] {
  const groups = groupBy(employees, e => String(e[field] || 'Unknown'));
  return Object.entries(groups)
    .map(([name, items]) => ({ name, value: items.length }))
    .sort((a, b) => b.value - a.value);
}

export function averageByField(
  employees: HREmployee[],
  groupField: keyof HREmployee,
  valueField: keyof HREmployee
): { name: string; value: number }[] {
  const groups = groupBy(employees, e => String(e[groupField] || 'Unknown'));
  return Object.entries(groups)
    .map(([name, items]) => {
      const values = items
        .map(e => e[valueField])
        .filter((v): v is number => typeof v === 'number' && v !== null);
      return { name, value: values.length ? mean(values) : 0 };
    })
    .sort((a, b) => b.value - a.value);
}

export function createHistogramData(
  values: number[],
  binCount: number = 10
): { name: string; value: number }[] {
  if (values.length === 0) return [];
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / binCount || 1;
  
  const bins: { name: string; value: number }[] = [];
  for (let i = 0; i < binCount; i++) {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    const label = `${Math.round(binStart)}-${Math.round(binEnd)}`;
    const count = values.filter(v => v >= binStart && (i === binCount - 1 ? v <= binEnd : v < binEnd)).length;
    bins.push({ name: label, value: count });
  }
  
  return bins;
}

export function getHiringByYear(employees: HREmployee[]): { name: string; value: number }[] {
  const yearsMap: Record<string, number> = {};
  employees.forEach(emp => {
    if (emp.hireDate) {
      const year = emp.hireDate.getFullYear().toString();
      yearsMap[year] = (yearsMap[year] || 0) + 1;
    }
  });
  return Object.entries(yearsMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getHiringByMonth(employees: HREmployee[]): { name: string; value: number }[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthCounts = new Array(12).fill(0);
  employees.forEach(emp => {
    if (emp.hireDate) {
      monthCounts[emp.hireDate.getMonth()]++;
    }
  });
  return months.map((name, i) => ({ name, value: monthCounts[i] }));
}

export function getTerminationByYear(employees: HREmployee[]): { name: string; value: number }[] {
  const yearsMap: Record<string, number> = {};
  employees.forEach(emp => {
    if (emp.terminationDate) {
      const year = emp.terminationDate.getFullYear().toString();
      yearsMap[year] = (yearsMap[year] || 0) + 1;
    }
  });
  return Object.entries(yearsMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getMonthlyTurnover(employees: HREmployee[]): { name: string; hired: number; terminated: number; turnoverRate: number }[] {
  const monthlyData: Record<string, { hired: number; terminated: number; total: number }> = {};
  
  employees.forEach(emp => {
    if (emp.hireDate) {
      const key = `${emp.hireDate.getFullYear()}-${String(emp.hireDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) monthlyData[key] = { hired: 0, terminated: 0, total: 0 };
      monthlyData[key].hired++;
    }
    if (emp.terminationDate) {
      const key = `${emp.terminationDate.getFullYear()}-${String(emp.terminationDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) monthlyData[key] = { hired: 0, terminated: 0, total: 0 };
      monthlyData[key].terminated++;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, data]) => ({
      name,
      hired: data.hired,
      terminated: data.terminated,
      turnoverRate: data.hired > 0 ? (data.terminated / data.hired) * 100 : 0,
    }));
}

/**
 * Generate summary statistics for AI context
 */
export function generateDataSummary(employees: HREmployee[], kpis: KPIData): string {
  const departments = countByField(employees, 'department');
  const genderDist = countByField(employees, 'gender');
  const salaries = employees.map(e => e.salary).filter((v): v is number => v !== null);
  const ages = employees.map(e => e.age).filter((v): v is number => v !== null);
  
  return `
DATASET SUMMARY:
- Total Employees: ${kpis.totalEmployees}
- Active: ${kpis.activeEmployees}, Terminated: ${kpis.terminatedEmployees}
- Turnover Rate: ${kpis.turnoverRate.toFixed(1)}%

DEMOGRAPHICS:
- Average Age: ${kpis.averageAge.toFixed(1)} (range: ${ages.length ? Math.min(...ages) : 'N/A'} - ${ages.length ? Math.max(...ages) : 'N/A'})
- Gender Distribution: ${genderDist.map(g => `${g.name}: ${g.value}`).join(', ')}

DEPARTMENTS (${departments.length}):
${departments.map(d => `- ${d.name}: ${d.value} employees`).join('\n')}

COMPENSATION:
- Average Salary: ${kpis.averageSalary.toFixed(0)}
- Median Salary: ${kpis.medianSalary.toFixed(0)}
- Range: ${salaries.length ? Math.min(...salaries).toFixed(0) : 'N/A'} - ${salaries.length ? Math.max(...salaries).toFixed(0) : 'N/A'}
- Avg by Department: ${averageByField(employees, 'department', 'salary').map(d => `${d.name}: ${d.value.toFixed(0)}`).join(', ')}

PERFORMANCE:
- Average Score: ${kpis.averagePerformance.toFixed(2)}
- By Department: ${averageByField(employees, 'department', 'performanceScore').map(d => `${d.name}: ${d.value.toFixed(2)}`).join(', ')}

ENGAGEMENT:
- Average Score: ${kpis.averageEngagement.toFixed(2)}

TRAINING:
- Average Hours: ${kpis.averageTrainingHours.toFixed(1)}

ABSENCE:
- Average Days: ${kpis.averageAbsenceDays.toFixed(1)}

PROMOTIONS:
- Average Count: ${kpis.averagePromotionCount.toFixed(2)}
`.trim();
}
