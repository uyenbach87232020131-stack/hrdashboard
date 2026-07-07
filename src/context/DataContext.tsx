import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { HREmployee, ColumnMapping, AppData } from '../types/hr';
import { detectColumns } from '../utils/columnDetector';
import { parseEmployee } from '../utils/dataProcessing';

interface DataContextType {
  data: AppData | null;
  isLoaded: boolean;
  setData: (rawRows: Record<string, unknown>[], fileName: string, columns: string[]) => void;
  clearData: () => void;
}

const DataContext = createContext<DataContextType>({
  data: null,
  isLoaded: false,
  setData: () => {},
  clearData: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<AppData | null>(null);

  const setData = useCallback((rawRows: Record<string, unknown>[], fileName: string, columns: string[]) => {
    const columnMapping = detectColumns(columns, rawRows);
    let employees = rawRows.map((row, index) => parseEmployee(row, columnMapping, index));

    // Verify if salary parsing worked
    const validSalaries = employees.filter(e => e.salary !== null && e.salary !== undefined);
    if (validSalaries.length === 0 && rawRows.length > 0) {
      console.warn("Salary parsing failed or no salary column was mapped. Attempting automatic recovery of numeric salary column...");
      
      // Find any numeric column that isn't mapped to known non-salary fields
      const excludedFields = ['age', 'performanceScore', 'engagementScore', 'trainingHours', 'absenceDays', 'promotionCount', 'employeeId'];
      const excludedHeaders = excludedFields.map(f => columnMapping[f]).filter(Boolean) as string[];
      
      let fallbackHeader: string | undefined = undefined;
      for (const col of columns) {
        if (excludedHeaders.includes(col)) continue;
        
        let numericCount = 0;
        let totalCount = 0;
        for (const row of rawRows) {
          const val = row[col];
          if (val === undefined || val === null || val === '') continue;
          totalCount++;
          const cleaned = String(val).replace(/[$\u20AC\u20AB\s,]/g, '');
          if (cleaned !== '' && !isNaN(Number(cleaned))) {
            numericCount++;
          }
        }
        
        if (totalCount > 0 && (numericCount / totalCount) > 0.5) {
          fallbackHeader = col;
          break;
        }
      }

      if (fallbackHeader) {
        columnMapping.salary = fallbackHeader;
        employees = rawRows.map((row, index) => parseEmployee(row, columnMapping, index));
        console.warn(`Automatically recovered salary column: "${fallbackHeader}"`);
      } else {
        console.warn("Could not dynamically detect any fallback numeric column for Salary.");
      }
    }

    setDataState({
      rawRows,
      employees,
      columns,
      columnMapping,
      fileName,
      rowCount: rawRows.length,
    });
  }, []);

  const clearData = useCallback(() => setDataState(null), []);

  return (
    <DataContext.Provider value={{ data, isLoaded: !!data, setData, clearData }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
