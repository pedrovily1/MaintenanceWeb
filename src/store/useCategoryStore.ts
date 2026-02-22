import { useState, useEffect, useCallback, useMemo } from 'react';
import { Category } from '../types/category';
import { fetchCategories } from '@/services/categoryService';
import { useSiteStore } from './useSiteStore';
import { supabase } from '@/lib/supabase';

let globalCategories: Category[] = [];
let globalSelectedCategoryId: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

export const useCategoryStore = () => {
  const [categories, setCategories] = useState<Category[]>(globalCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(globalSelectedCategoryId);

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

  const createCategory = useCallback((payload: { name: string; icon: string; color: string; description?: string }) => {
    const { activeSiteId, activeUserId } = useSiteStore.getState();
    if (!activeSiteId || !activeUserId) {
      console.error('Missing activeSiteId or activeUserId for createCategory');
      return {} as Category;
    }

    const tempId = crypto.randomUUID();
    const now = new Date().toISOString();
    const tempCat: Category = {
      id: tempId,
      name: payload.name,
      icon: payload.icon,
      color: payload.color,
      description: payload.description,
      isActive: true,
      createdAt: now,
      createdByUserId: activeUserId,
      updatedAt: now,
      updatedByUserId: activeUserId,
    };

    globalCategories = [...globalCategories, tempCat];
    notify();

    (async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert({
            site_id: activeSiteId,
            name: payload.name,
            icon: payload.icon,
            color: payload.color,
            description: payload.description,
            is_active: true,
            created_by_user_id: activeUserId,
            updated_by_user_id: activeUserId,
          })
          .select()
          .single();

        if (error) throw error;

        globalCategories = globalCategories.map(c => c.id === tempId ? data as Category : c);
        notify();
      } catch (error) {
        console.error('Error creating category:', error);
        globalCategories = globalCategories.filter(c => c.id !== tempId);
        notify();
      }
    })();

    return tempCat;
  }, []);

  const updateCategory = useCallback((id: string, patch: Partial<Omit<Category, 'id' | 'createdAt' | 'createdByUserId'>>) => {
    const { activeUserId } = useSiteStore.getState();
    if (!activeUserId) {
      console.error('Missing activeUserId for updateCategory');
      return;
    }

    const original = globalCategories.find(c => c.id === id);
    if (!original) return;

    const now = new Date().toISOString();
    globalCategories = globalCategories.map(c =>
      c.id === id ? { ...c, ...patch, updatedAt: now, updatedByUserId: activeUserId } : c
    );
    notify();

    (async () => {
      try {
        const dbUpdates: Record<string, any> = { updated_at: now, updated_by_user_id: activeUserId };
        if (patch.name !== undefined) dbUpdates.name = patch.name;
        if (patch.icon !== undefined) dbUpdates.icon = patch.icon;
        if (patch.color !== undefined) dbUpdates.color = patch.color;
        if (patch.description !== undefined) dbUpdates.description = patch.description;
        if (patch.isActive !== undefined) dbUpdates.is_active = patch.isActive;

        const { error } = await supabase
          .from('categories')
          .update(dbUpdates)
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating category:', error);
        globalCategories = globalCategories.map(c => c.id === id ? original : c);
        notify();
      }
    })();
  }, []);

  const archiveCategory = useCallback((id: string) => {
    const { activeUserId } = useSiteStore.getState();
    const original = globalCategories.find(c => c.id === id);
    if (!original) return;

    const now = new Date().toISOString();
    globalCategories = globalCategories.map(c =>
      c.id === id ? { ...c, isActive: false, updatedAt: now, updatedByUserId: activeUserId || '' } : c
    );
    notify();

    (async () => {
      try {
        const { error } = await supabase
          .from('categories')
          .update({ is_active: false, updated_at: now, updated_by_user_id: activeUserId })
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error archiving category:', error);
        globalCategories = globalCategories.map(c => c.id === id ? original : c);
        notify();
      }
    })();
  }, []);

  const restoreCategory = useCallback((id: string) => {
    const { activeUserId } = useSiteStore.getState();
    const original = globalCategories.find(c => c.id === id);
    if (!original) return;

    const now = new Date().toISOString();
    globalCategories = globalCategories.map(c =>
      c.id === id ? { ...c, isActive: true, updatedAt: now, updatedByUserId: activeUserId || '' } : c
    );
    notify();

    (async () => {
      try {
        const { error } = await supabase
          .from('categories')
          .update({ is_active: true, updated_at: now, updated_by_user_id: activeUserId })
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error restoring category:', error);
        globalCategories = globalCategories.map(c => c.id === id ? original : c);
        notify();
      }
    })();
  }, []);

  const deleteCategoryHard = useCallback((id: string) => {
    const originalList = [...globalCategories];
    globalCategories = globalCategories.filter(c => c.id !== id);
    if (globalSelectedCategoryId === id) {
      globalSelectedCategoryId = globalCategories[0]?.id || null;
    }
    notify();

    (async () => {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting category:', error);
        globalCategories = originalList;
        notify();
      }
    })();
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
