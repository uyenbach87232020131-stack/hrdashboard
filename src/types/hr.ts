/**
 * HR Analytics Dashboard - Type Definitions
 * Core TypeScript interfaces for the HR data model
 */

// ============================================================
// Column Mapping - Maps detected Excel columns to standard fields
// ============================================================
export interface ColumnMapping {
  employeeId?: string;
  name?: string;
  department?: string;
  gender?: string;
  age?: string;
  salary?: string;
  hireDate?: string;
  terminationDate?: string;
  status?: string;
  performanceScore?: string;
  engagementScore?: string;
  trainingHours?: string;
  absenceDays?: string;
  promotionCount?: string;
  jobTitle?: string;
  education?: string;
  maritalStatus?: string;
  [key: string]: string | undefined;
}

// ============================================================
// Raw Employee Record (after parsing + mapping)
// ============================================================
export interface HREmployee {
  employeeId: string | number;
  name: string;
  department: string;
  gender: string;
  age: number | null;
  salary: number | null;
  hireDate: Date | null;
  terminationDate: Date | null;
  status: string;
  performanceScore: number | null;
  engagementScore: number | null;
  trainingHours: number | null;
  absenceDays: number | null;
  promotionCount: number | null;
  jobTitle: string;
  education: string;
  maritalStatus: string;
  // Keep raw data for AI context
  rawData: Record<string, unknown>;
}

// ============================================================
// KPI Definitions
// ============================================================
export interface KPIData {
  totalEmployees: number;
  activeEmployees: number;
  terminatedEmployees: number;
  turnoverRate: number;
  averageAge: number;
  averageSalary: number;
  medianSalary: number;
  averagePerformance: number;
  averageEngagement: number;
  averageTrainingHours: number;
  averageAbsenceDays: number;
  averagePromotionCount: number;
}

// ============================================================
// Filter State
// ============================================================
export interface FilterState {
  departments: string[];
  genders: string[];
  ageRange: [number, number];
  salaryRange: [number, number];
  hireYears: number[];
  performanceRange: [number, number];
  engagementRange: [number, number];
}

export interface FilterOptions {
  departments: string[];
  genders: string[];
  ageMin: number;
  ageMax: number;
  salaryMin: number;
  salaryMax: number;
  hireYears: number[];
  performanceMin: number;
  performanceMax: number;
  engagementMin: number;
  engagementMax: number;
}

// ============================================================
// Chart Data Types
// ============================================================
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface CorrelationCell {
  x: string;
  y: string;
  value: number;
}

// ============================================================
// AI Integration
// ============================================================
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIReportSection {
  title: string;
  content: string;
}

// ============================================================
// App State
// ============================================================
export interface AppData {
  rawRows: Record<string, unknown>[];
  employees: HREmployee[];
  columns: string[];
  columnMapping: ColumnMapping;
  fileName: string;
  rowCount: number;
}

export type NavSection = 
  | 'upload'
  | 'dashboard'
  | 'charts'
  | 'ai-insights'
  | 'ai-chat'
  | 'export';
