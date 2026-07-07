import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
import { FilterState, FilterOptions, HREmployee } from '../types/hr';
import { getFilterOptions, createDefaultFilter, applyFilters } from '../utils/dataProcessing';
import { useData } from './DataContext';

interface FilterContextType {
  filterState: FilterState;
  filterOptions: FilterOptions;
  filteredEmployees: HREmployee[];
  activeFilterCount: number;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

const defaultOptions: FilterOptions = {
  departments: [], genders: [], ageMin: 0, ageMax: 100,
  salaryMin: 0, salaryMax: 1000000, hireYears: [],
  performanceMin: 0, performanceMax: 10, engagementMin: 0, engagementMax: 10,
};

const FilterContext = createContext<FilterContextType>({
  filterState: createDefaultFilter(defaultOptions),
  filterOptions: defaultOptions,
  filteredEmployees: [],
  activeFilterCount: 0,
  updateFilter: () => {},
  resetFilters: () => {},
});

export function FilterProvider({ children }: { children: ReactNode }) {
  const { data } = useData();
  const employees = data?.employees || [];

  const filterOptions = useMemo(() => getFilterOptions(employees), [employees]);
  const [filterState, setFilterState] = useState<FilterState>(() => createDefaultFilter(filterOptions));

  useEffect(() => {
    setFilterState(createDefaultFilter(filterOptions));
  }, [filterOptions]);

  const filteredEmployees = useMemo(
    () => applyFilters(employees, filterState),
    [employees, filterState]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.departments.length > 0) count++;
    if (filterState.genders.length > 0) count++;
    if (filterState.ageRange[0] !== filterOptions.ageMin || filterState.ageRange[1] !== filterOptions.ageMax) count++;
    if (filterState.salaryRange[0] !== filterOptions.salaryMin || filterState.salaryRange[1] !== filterOptions.salaryMax) count++;
    if (filterState.hireYears.length > 0) count++;
    if (filterState.performanceRange[0] !== filterOptions.performanceMin || filterState.performanceRange[1] !== filterOptions.performanceMax) count++;
    if (filterState.engagementRange[0] !== filterOptions.engagementMin || filterState.engagementRange[1] !== filterOptions.engagementMax) count++;
    return count;
  }, [filterState, filterOptions]);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilterState(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(createDefaultFilter(filterOptions));
  }, [filterOptions]);

  return (
    <FilterContext.Provider value={{ filterState, filterOptions, filteredEmployees, activeFilterCount, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilter = () => useContext(FilterContext);
