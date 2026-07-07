/**
 * Column Detector - Automatically maps Excel column headers to standard HR fields
 * Uses fuzzy matching to handle Vietnamese and English column name variations
 */

import { ColumnMapping } from '../types/hr';

// Pattern maps: each key is the standard field name, value is an array of regex patterns
const COLUMN_PATTERNS: Record<keyof ColumnMapping, RegExp[]> = {
  employeeId: [
    /^(employee[\s_-]?id|emp[\s_-]?id|id|mã[\s_-]?nhân[\s_-]?viên|mã[\s_-]?nv|ma[\s_-]?nhan[\s_-]?vien|stt|employee[\s_-]?number|emp[\s_-]?no)$/i,
  ],
  name: [
    /^(name|full[\s_-]?name|employee[\s_-]?name|họ[\s_-]?tên|ho[\s_-]?ten|tên|ten|họ[\s_-]?và[\s_-]?tên|ho[\s_-]?va[\s_-]?ten)$/i,
  ],
  department: [
    /^(department|dept|phòng[\s_-]?ban|phong[\s_-]?ban|bộ[\s_-]?phận|bo[\s_-]?phan|division|department[\s_-]?name|ten[\s_-]?phong[\s_-]?ban)$/i,
  ],
  gender: [
    /^(gender|sex|giới[\s_-]?tính|gioi[\s_-]?tinh|phái|phai)$/i,
  ],
  age: [
    /^(age|tuổi|tuoi|năm[\s_-]?tuổi)$/i,
  ],
  salary: [
    /^(salary|pay|wage|lương|luong|mức[\s_-]?lương|muc[\s_-]?luong|thu[\s_-]?nhập|thu[\s_-]?nhap|annual[\s_-]?salary|monthly[\s_-]?salary|base[\s_-]?salary)$/i,
  ],
  hireDate: [
    /^(hire[\s_-]?date|start[\s_-]?date|join[\s_-]?date|date[\s_-]?hired|ngày[\s_-]?vào[\s_-]?làm|ngay[\s_-]?vao[\s_-]?lam|ngày[\s_-]?tuyển[\s_-]?dụng|ngay[\s_-]?tuyen[\s_-]?dung|ngày[\s_-]?bắt[\s_-]?đầu|date[\s_-]?of[\s_-]?hire|hiring[\s_-]?date|ngày[\s_-]?gia[\s_-]?nhập|employment[\s_-]?date)$/i,
  ],
  terminationDate: [
    /^(termination[\s_-]?date|end[\s_-]?date|leave[\s_-]?date|exit[\s_-]?date|ngày[\s_-]?nghỉ[\s_-]?việc|ngay[\s_-]?nghi[\s_-]?viec|ngày[\s_-]?thôi[\s_-]?việc|ngay[\s_-]?thoi[\s_-]?viec|ngày[\s_-]?kết[\s_-]?thúc|separation[\s_-]?date|last[\s_-]?working[\s_-]?day)$/i,
  ],
  status: [
    /^(status|employment[\s_-]?status|tình[\s_-]?trạng|tinh[\s_-]?trang|trạng[\s_-]?thái|trang[\s_-]?thai|active|emp[\s_-]?status)$/i,
  ],
  performanceScore: [
    /^(performance[\s_-]?score|performance|điểm[\s_-]?hiệu[\s_-]?suất|diem[\s_-]?hieu[\s_-]?suat|hiệu[\s_-]?suất|hieu[\s_-]?suat|perf[\s_-]?score|performance[\s_-]?rating|đánh[\s_-]?giá[\s_-]?hiệu[\s_-]?suất|kpi[\s_-]?score|điểm[\s_-]?kpi)$/i,
  ],
  engagementScore: [
    /^(engagement[\s_-]?score|engagement|độ[\s_-]?gắn[\s_-]?kết|do[\s_-]?gan[\s_-]?ket|điểm[\s_-]?gắn[\s_-]?kết|diem[\s_-]?gan[\s_-]?ket|satisfaction[\s_-]?score|mức[\s_-]?độ[\s_-]?hài[\s_-]?lòng|employee[\s_-]?satisfaction)$/i,
  ],
  trainingHours: [
    /^(training[\s_-]?hours|training|giờ[\s_-]?đào[\s_-]?tạo|gio[\s_-]?dao[\s_-]?tao|số[\s_-]?giờ[\s_-]?đào[\s_-]?tạo|so[\s_-]?gio[\s_-]?dao[\s_-]?tao|hours[\s_-]?trained|training[\s_-]?time)$/i,
  ],
  absenceDays: [
    /^(absence[\s_-]?days|absences|days[\s_-]?absent|ngày[\s_-]?nghỉ|ngay[\s_-]?nghi|số[\s_-]?ngày[\s_-]?nghỉ|so[\s_-]?ngay[\s_-]?nghi|sick[\s_-]?days|ngày[\s_-]?vắng|ngay[\s_-]?vang|leave[\s_-]?days|absent[\s_-]?days)$/i,
  ],
  promotionCount: [
    /^(promotion[\s_-]?count|promotions|số[\s_-]?lần[\s_-]?thăng[\s_-]?tiến|so[\s_-]?lan[\s_-]?thang[\s_-]?tien|thăng[\s_-]?tiến|thang[\s_-]?tien|times[\s_-]?promoted|promotion[\s_-]?history|số[\s_-]?lần[\s_-]?thăng[\s_-]?chức)$/i,
  ],
  jobTitle: [
    /^(job[\s_-]?title|title|position|chức[\s_-]?vụ|chuc[\s_-]?vu|vị[\s_-]?trí|vi[\s_-]?tri|chức[\s_-]?danh|chuc[\s_-]?danh|role|job[\s_-]?position)$/i,
  ],
  education: [
    /^(education|degree|trình[\s_-]?độ|trinh[\s_-]?do|học[\s_-]?vấn|hoc[\s_-]?van|bằng[\s_-]?cấp|bang[\s_-]?cap|qualification|education[\s_-]?level)$/i,
  ],
  maritalStatus: [
    /^(marital[\s_-]?status|married|tình[\s_-]?trạng[\s_-]?hôn[\s_-]?nhân|tinh[\s_-]?trang[\s_-]?hon[\s_-]?nhan|hôn[\s_-]?nhân|hon[\s_-]?nhan)$/i,
  ],
};

function isNumericColumn(rawRows: Record<string, unknown>[], header: string): boolean {
  let numericCount = 0;
  let totalCount = 0;
  for (const row of rawRows) {
    const val = row[header];
    if (val === undefined || val === null || val === '') continue;
    totalCount++;
    
    // Clean from currency symbols, commas, spaces
    const cleaned = String(val).replace(/[$\u20AC\u20AB\s,]/g, '');
    if (cleaned !== '' && !isNaN(Number(cleaned))) {
      numericCount++;
    }
  }
  return totalCount > 0 && (numericCount / totalCount) > 0.5;
}

export function detectSalaryColumn(columns: string[], rawRows: Record<string, unknown>[]): string | undefined {
  const candidates = [
    /^(salary\s*\(\$\/year\))$/i,
    /^(salary)$/i,
    /^(annual\s*salary)$/i,
    /^(salary_usd)$/i,
    /^(base\s*salary)$/i,
    /^(lương|luong|mức\s*lương|muc\s*luong)$/i
  ];

  // 1. Search for matches among the standard candidates that are numeric
  for (const pattern of candidates) {
    for (const col of columns) {
      if (pattern.test(col.trim()) && isNumericColumn(rawRows, col)) {
        return col;
      }
    }
  }

  // 2. Fallback: Search for any column containing "salary" (case-insensitive) that is numeric
  for (const col of columns) {
    if (/salary/i.test(col.trim()) && isNumericColumn(rawRows, col)) {
      return col;
    }
  }

  return undefined;
}

/**
 * Automatically detect and map Excel column headers to standard HR fields
 */
export function detectColumns(headers: string[], rawRows?: Record<string, unknown>[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const usedHeaders = new Set<string>();

  // 1. Detect salary column dynamically first if rawRows is available
  if (rawRows && rawRows.length > 0) {
    const salaryCol = detectSalaryColumn(headers, rawRows);
    if (salaryCol) {
      mapping.salary = salaryCol;
      usedHeaders.add(salaryCol);
    }
  }

  // 2. First pass: exact/regex matching for other fields
  for (const [field, patterns] of Object.entries(COLUMN_PATTERNS)) {
    if (field === 'salary' && mapping.salary) continue; // Already mapped dynamically

    for (const header of headers) {
      if (usedHeaders.has(header)) continue;
      const trimmed = header.trim();
      for (const pattern of patterns) {
        if (pattern.test(trimmed)) {
          mapping[field as keyof ColumnMapping] = header;
          usedHeaders.add(header);
          break;
        }
      }
      if (mapping[field as keyof ColumnMapping]) break;
    }
  }

  return mapping;
}

/**
 * Get a human-readable label for a mapped field
 */
export function getFieldLabel(field: keyof ColumnMapping): string {
  const labels: Record<string, string> = {
    employeeId: 'Employee ID',
    name: 'Name',
    department: 'Department',
    gender: 'Gender',
    age: 'Age',
    salary: 'Salary',
    hireDate: 'Hire Date',
    terminationDate: 'Termination Date',
    status: 'Status',
    performanceScore: 'Performance Score',
    engagementScore: 'Engagement Score',
    trainingHours: 'Training Hours',
    absenceDays: 'Absence Days',
    promotionCount: 'Promotion Count',
    jobTitle: 'Job Title',
    education: 'Education',
    maritalStatus: 'Marital Status',
  };
  return labels[field as string] || String(field);
}

/**
 * Check which fields were successfully mapped
 */
export function getMappedFields(mapping: ColumnMapping): string[] {
  return Object.entries(mapping)
    .filter(([, value]) => value !== undefined)
    .map(([key]) => String(key));
}

/**
 * Check if a specific field was mapped
 */
export function hasField(mapping: ColumnMapping, field: keyof ColumnMapping): boolean {
  return mapping[field] !== undefined;
}
