import { useState, useEffect, useCallback, useMemo } from 'react';
import { Category } from '../types/category';
import { fetchCategories } from '@/services/categoryService';
import { useSiteStore } from './useSiteStore';

let globalCategories: Category[] = [];
let globalSelectedCategoryId: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

export const useCategoryStore = () => {
  const [categories, setCategories] = useState<Category[]>(globalCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(globalSelectedCategoryId);
  const { activeUserId } = useSiteStore();

  useEffect(() => {
    const l = () => {
      setCategories([...globalCategories]);
      setSelectedCategoryId(globalSelectedCategoryId);
    };
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const loadCategories = useCallback(async (siteId: string) => {
    if (!siteId) return;
    try {
      const data = await fetchCategories(siteId);
      globalCategories = data;
      if (!globalSelectedCategoryId && data.length > 0) {
        globalSelectedCategoryId = data[0].id;
      }
      notify();
    } catch (error) {
      console.error("Failed to load categories:", error);
      globalCategories = [];
      notify();
    }
  }, []);

  const createCategory = useCallback((payload: { name: string; icon: string; color: string; description?: string }, userId: string = activeUserId || '') => {
    // No-op for Phase 1
    return {} as Category;
  }, [activeUserId]);

  const updateCategory = useCallback((id: string, patch: Partial<Omit<Category, 'id' | 'createdAt' | 'createdByUserId'>>, userId: string = activeUserId || '') => {
    // No-op for Phase 1
  }, [activeUserId]);

  const archiveCategory = useCallback((id: string, userId: string = activeUserId || '') => {
    // No-op for Phase 1
  }, [activeUserId]);

  const restoreCategory = useCallback((id: string, userId: string = activeUserId || '') => {
    // No-op for Phase 1
  }, [activeUserId]);

  const deleteCategoryHard = useCallback((id: string) => {
    // No-op for Phase 1
  }, []);

  const selectCategory = useCallback((id: string | null) => {
    globalSelectedCategoryId = id;
    notify();
  }, []);

  const getCategoryById = useCallback((id: string) => {
    return globalCategories.find(c => c.id === id);
  }, []);

  const activeCategories = useMemo(() => {
    return categories
      .filter(c => c.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const archivedCategories = useMemo(() => {
    return categories
      .filter(c => !c.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  return {
    categories,
    selectedCategoryId,
    loadCategories,
    activeCategories,
    archivedCategories,
    createCategory,
    updateCategory,
    archiveCategory,
    restoreCategory,
    deleteCategoryHard,
    selectCategory,
    getCategoryById
  };
};
