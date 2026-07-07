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
    const columnMapping = detectColumns(columns);
    const employees = rawRows.map((row, index) => parseEmployee(row, columnMapping, index));
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
