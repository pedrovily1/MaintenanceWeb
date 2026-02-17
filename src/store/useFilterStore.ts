import { useState, useEffect, useCallback } from 'react';

interface FilterState {
  search: string;
  assignedTo: string;
  location: string;
  priority: string;
  dueDate: string;
}

let globalFilters: FilterState = {
  search: '',
  assignedTo: '',
  location: '',
  priority: '',
  dueDate: '',
};

const listeners = new Set<() => void>();

const notify = () => listeners.forEach(l => l());

export const useFilterStore = () => {
  const [filters, setFilters] = useState<FilterState>(globalFilters);

  useEffect(() => {
    const l = () => setFilters({ ...globalFilters });
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const setSearch = useCallback((s: string) => {
    globalFilters = { ...globalFilters, search: s };
    notify();
  }, []);

  const setFilter = useCallback((key: keyof Omit<FilterState, 'search'>, value: string) => {
    globalFilters = { ...globalFilters, [key]: value };
    notify();
  }, []);

  const clearFilters = useCallback(() => {
    globalFilters = {
      search: '',
      assignedTo: '',
      location: '',
      priority: '',
      dueDate: '',
    };
    notify();
  }, []);

  return {
    ...filters,
    setSearch,
    setFilter,
    clearFilters,
  };
};
