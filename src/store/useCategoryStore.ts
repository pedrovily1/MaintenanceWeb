import { useState, useEffect, useCallback, useMemo } from 'react';
import { Category } from '../types/category';

const STORAGE_KEY = 'categories_v1';
const SELECTED_CATEGORY_KEY = 'selected_category_id_v1';

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "3993435",
    name: "Annual Service",
    icon: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23D9F5F1'/%3e%3cpath%20d='M29.552%2010.121a1.21%201.21%200%2000-1.017-.242%209.689%209.689%200%2001-7.532-1.538%201.21%201.21%200%2000-1.38%200%209.688%209.688%200%2001-7.533%201.538%201.21%201.21%200%2000-1.465%201.187v9.021a10.9%2010.9%200%20004.565%208.876l4.42%203.149a1.21%201.21%200%20001.405%200l4.42-3.149A10.9%2010.9%200%200030%2020.087v-9.021a1.21%201.21%200%2000-.448-.945zm-1.974%209.966a8.476%208.476%200%2001-3.548%206.902l-3.718%202.652-3.717-2.652a8.476%208.476%200%2001-3.548-6.902v-7.629a12.11%2012.11%200%20007.265-1.683%2012.11%2012.11%200%20007.266%201.683v7.63zm-5.4-2.773l-3.258%203.27-1.078-1.09a1.216%201.216%200%2000-1.72%201.72l1.938%201.937a1.211%201.211%200%20001.72%200l4.165-4.13a1.216%201.216%200%2000-1.72-1.72l-.048.013z'%20fill='%233FCBBB'/%3e%3c/svg%3e",
    color: "bg-teal-50",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdByUserId: "admin-001",
    updatedAt: new Date().toISOString(),
    updatedByUserId: "admin-001"
  },
  {
    id: "3399962",
    name: "Corrective Action",
    icon: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23FFE4D0'/%3e%3cpath%20d='M29.585%2024.71l-2.42-2.42a1.002%201.002%200%2000-1.42%200l-3.58%203.58a1%201%200%2000-.29.71V29a1%201%200%20001%201h2.42a1.002%201.002%200%2000.71-.29l3.58-3.58a1.002%201.002%200%20000-1.42zM24.875%2028h-1v-1l2.58-2.58%201%201-2.58%202.58zm-6%200h-4a1%201%200%2001-1-1V13a1%201%200%20011-1h5v3a3%203%200%20003%203h3v1a1%201%200%20102%200v-2-.06a1.306%201.306%200%2000-.06-.27v-.09a1.071%201.071%200%2000-.19-.28l-6-6a1.071%201.071%200%2000-.28-.19.323.323%200%2000-.09%200l-.32-.11h-6.06a3%203%200%2000-3%203v14a3%203%200%20003%203h4a1%201%200%20000-2zm3-14.59l2.59%202.59h-1.59a1%201%200%2001-1-1v-1.59zm-5%208.59h6a1%201%200%20000-2h-6a1%201%200%20100%202zm0-4h1a1%201%200%20000-2h-1a1%201%200%20000%202zm2%206h-2a1%201%200%20100%202h2a1%201%200%20000-2z'%20fill='%23FF7439'/%3e%3c/svg%3e",
    color: "bg-orange-50",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdByUserId: "admin-001",
    updatedAt: new Date().toISOString(),
    updatedByUserId: "admin-001"
  },
  {
    id: "3399963",
    name: "Damage",
    icon: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23FFE5DF'/%3e%3cpath%20d='M19.977%2023.34a.904.904%200%20100%201.807.904.904%200%20000-1.807zm9.644%201.329l-7.276-12.653a2.71%202.71%200%2000-4.735%200l-7.23%2012.653a2.712%202.712%200%20002.313%204.094h14.569a2.711%202.711%200%20002.359-4.094zm-1.564%201.807a.902.902%200%2001-.795.461h-14.57a.903.903%200%2001-.794-.46.904.904%200%20010-.905l7.23-12.653a.904.904%200%20011.609%200l7.275%2012.653a.904.904%200%2001.045.922v-.018zm-8.08-10.366a.904.904%200%2000-.903.904v3.615a.904.904%200%20101.807%200v-3.616a.904.904%200%2000-.904-.903z'%20fill='%23FF7C60'/%3e%3c/svg%3e",
    color: "bg-red-50",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdByUserId: "admin-001",
    updatedAt: new Date().toISOString(),
    updatedByUserId: "admin-001"
  },
  {
    id: "3399964",
    name: "Electrical",
    icon: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20viewBox='0%200%2064%2064'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M32%2064a32%2032%200%201%200%200-64%2032%2032%200%200%200%200%2064Z'%20fill='%23FFF5CC'/%3e%3cpath%20d='M45.36%2026.56a1.6%201.6%200%200%200-1.39-.96h-7.32l2.03-7.58A1.6%201.6%200%200%200%2037.14%2016h-11.2a1.6%201.6%200%200%200-1.6%201.18l-4.28%2016a1.6%201.6%200%200%200%201.55%202.02h6.19l-2.9%2010.78a1.6%201.6%200%200%200%202.74%201.49l17.44-19.2a1.6%201.6%200%200%200%20.28-1.71ZM29.7%2040.44l1.71-6.4a1.6%201.6%200%200%200-1.53-2.01h-6.14l3.42-12.83h7.89L33%2026.78a1.6%201.6%200%200%200%201.6%202.02h5.71L29.7%2040.44Z'%20fill='%23FC0'/%3e%3c/svg%3e",
    color: "bg-yellow-50",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdByUserId: "admin-001",
    updatedAt: new Date().toISOString(),
    updatedByUserId: "admin-001"
  },
  {
    id: "3399966",
    name: "Mechanical",
    icon: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23FCEBFF'/%3e%3cpath%20d='M29.667%2023.55l-4.51-4.501c.093-.46.14-.928.139-1.397a7.652%207.652%200%2000-10.887-6.936.998.998%200%2000-.29%201.617l4.341%204.33-1.796%201.797-4.33-4.34a.998.998%200%2000-.88-.27%201%201%200%2000-.738.559%207.653%207.653%200%20006.986%2010.887c.469.001.937-.046%201.397-.14l4.5%204.51a.997.997%200%20001.417%200%20.996.996%200%20000-1.416l-4.89-4.89a.997.997%200%2000-.947-.26%205.865%205.865%200%2001-1.477.2%205.657%205.657%200%2001-5.708-5.648%205.988%205.988%200%2001.08-.998l3.911%203.922a1%201%200%20001.417%200l3.174-3.204a.998.998%200%20000-1.387l-3.882-3.911c.33-.054.664-.081.998-.08a5.658%205.658%200%20015.648%205.658c-.004.499-.07.995-.2%201.477a.998.998%200%2000.26.948l4.89%204.89a1.002%201.002%200%20001.416-1.418h-.04z'%20fill='%23EA7BFF'/%3e%3c/svg%3e",
    color: "bg-purple-50",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdByUserId: "admin-001",
    updatedAt: new Date().toISOString(),
    updatedByUserId: "admin-001"
  },
  {
    id: "3399970",
    name: "Safety",
    icon: "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20%2040c11.046%200%2020-8.954%2020-20S31.046%200%2020%200%200%208.954%200%2020s8.954%2020%2020%2020z'%20fill='%23D9F5F1'/%3e%3cpath%20d='M29.552%2010.121a1.21%201.21%200%2000-1.017-.242%209.689%209.689%200%2001-7.532-1.538%201.21%201.21%200%2000-1.38%200%209.688%209.688%200%2001-7.533%201.538%201.21%201.21%200%2000-1.465%201.187v9.021a10.9%2010.9%200%20004.565%208.876l4.42%203.149a1.21%201.21%200%20001.405%200l4.42-3.149A10.9%2010.9%200%200030%2020.087v-9.021a1.21%201.21%200%2000-.448-.945zm-1.974%209.966a8.476%208.476%200%2001-3.548%206.902l-3.718%202.652-3.717-2.652a8.476%208.476%200%2001-3.548-6.902v-7.629a12.11%2012.11%200%20007.265-1.683%2012.11%2012.11%200%20007.266%201.683v7.63zm-5.4-2.773l-3.258%203.27-1.078-1.09a1.216%201.216%200%2000-1.72%201.72l1.938%201.937a1.211%201.211%200%20001.72%200l4.165-4.13a1.216%201.216%200%2000-1.72-1.72l-.048.013z'%20fill='%233FCBBB'/%3e%3c/svg%3e",
    color: "bg-teal-50",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdByUserId: "admin-001",
    updatedAt: new Date().toISOString(),
    updatedByUserId: "admin-001"
  }
];

let globalCategories: Category[] = [];
let globalSelectedCategoryId: string | null = null;
const listeners = new Set<() => void>();

// Hydrate from localStorage
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalCategories = parsed;
    } else {
      globalCategories = DEFAULT_CATEGORIES;
    }
  } catch (e) {
    console.error('Failed to parse saved categories', e);
    globalCategories = DEFAULT_CATEGORIES;
  }
} else {
  globalCategories = DEFAULT_CATEGORIES;
}

const savedSelectedId = localStorage.getItem(SELECTED_CATEGORY_KEY);
if (savedSelectedId && globalCategories.find(c => c.id === savedSelectedId)) {
  globalSelectedCategoryId = savedSelectedId;
} else {
  globalSelectedCategoryId = globalCategories[0]?.id || null;
}

const notify = () => {
  listeners.forEach(l => l());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(globalCategories));
  if (globalSelectedCategoryId) {
    localStorage.setItem(SELECTED_CATEGORY_KEY, globalSelectedCategoryId);
  } else {
    localStorage.removeItem(SELECTED_CATEGORY_KEY);
  }
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

  const createCategory = useCallback((payload: { name: string; icon: string; color: string; description?: string }, userId: string = 'admin-001') => {
    // Unique name check (case-insensitive)
    if (globalCategories.some(c => c.name.toLowerCase() === payload.name.toLowerCase() && c.isActive)) {
      throw new Error('A category with this name already exists.');
    }
    const now = new Date().toISOString();
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: payload.name,
      icon: payload.icon,
      color: payload.color,
      description: payload.description,
      isActive: true,
      createdAt: now,
      createdByUserId: userId,
      updatedAt: now,
      updatedByUserId: userId
    };
    globalCategories = [...globalCategories, newCategory];
    notify();
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, patch: Partial<Omit<Category, 'id' | 'createdAt' | 'createdByUserId'>>, userId: string = 'admin-001') => {
    // Check unique name if name is being updated
    if (patch.name) {
      const existing = globalCategories.find(c => c.name.toLowerCase() === patch.name!.toLowerCase() && c.id !== id && c.isActive);
      if (existing) {
        throw new Error('A category with this name already exists.');
      }
    }
    globalCategories = globalCategories.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...patch,
          updatedAt: new Date().toISOString(),
          updatedByUserId: userId
        };
      }
      return c;
    });
    notify();
  }, []);

  const archiveCategory = useCallback((id: string, userId: string = 'admin-001') => {
    globalCategories = globalCategories.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isActive: false,
          updatedAt: new Date().toISOString(),
          updatedByUserId: userId
        };
      }
      return c;
    });
    if (globalSelectedCategoryId === id) {
      const active = globalCategories.filter(c => c.isActive);
      globalSelectedCategoryId = active[0]?.id || null;
    }
    notify();
  }, []);

  const restoreCategory = useCallback((id: string, userId: string = 'admin-001') => {
    globalCategories = globalCategories.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isActive: true,
          updatedAt: new Date().toISOString(),
          updatedByUserId: userId
        };
      }
      return c;
    });
    notify();
  }, []);

  const deleteCategoryHard = useCallback((id: string) => {
    globalCategories = globalCategories.filter(c => c.id !== id);
    if (globalSelectedCategoryId === id) {
      globalSelectedCategoryId = globalCategories[0]?.id || null;
    }
    notify();
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
