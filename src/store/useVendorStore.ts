import { useState, useEffect, useCallback, useMemo } from 'react';
import { Vendor } from '../types/vendor';

const STORAGE_KEY = 'vendors_v1';
const SELECTED_VENDOR_KEY = 'selected_vendor_id_v1';

// Initialize with ZERO vendors by default (per requirements)
const DEFAULT_VENDORS: Vendor[] = [];

let globalVendors: Vendor[] = [];
let globalSelectedVendorId: string | null = null;
const listeners = new Set<() => void>();

// Hydrate from localStorage
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      globalVendors = parsed;
    } else {
      globalVendors = DEFAULT_VENDORS;
    }
  } catch (e) {
    console.error('Failed to parse saved vendors', e);
    globalVendors = DEFAULT_VENDORS;
  }
} else {
  globalVendors = DEFAULT_VENDORS;
}

const savedSelectedId = localStorage.getItem(SELECTED_VENDOR_KEY);
if (savedSelectedId && globalVendors.find(v => v.id === savedSelectedId)) {
  globalSelectedVendorId = savedSelectedId;
} else {
  globalSelectedVendorId = globalVendors[0]?.id || null;
}

const notify = () => {
  listeners.forEach(l => l());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(globalVendors));
  if (globalSelectedVendorId) {
    localStorage.setItem(SELECTED_VENDOR_KEY, globalSelectedVendorId);
  } else {
    localStorage.removeItem(SELECTED_VENDOR_KEY);
  }
};

export const useVendorStore = () => {
  const [vendors, setVendors] = useState<Vendor[]>(globalVendors);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(globalSelectedVendorId);

  useEffect(() => {
    const l = () => {
      setVendors([...globalVendors]);
      setSelectedVendorId(globalSelectedVendorId);
    };
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const createVendor = useCallback((
    payload: {
      name: string;
      trade?: string;
      contactName?: string;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
    },
    userId: string = 'admin-001'
  ) => {
    // Unique name check (case-insensitive)
    if (globalVendors.some(v => v.name.toLowerCase() === payload.name.toLowerCase() && v.isActive)) {
      throw new Error('A vendor with this name already exists.');
    }
    const now = new Date().toISOString();
    const newVendor: Vendor = {
      id: crypto.randomUUID(),
      name: payload.name,
      trade: payload.trade,
      contactName: payload.contactName,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      notes: payload.notes,
      isActive: true,
      createdAt: now,
      createdByUserId: userId,
      updatedAt: now,
      updatedByUserId: userId
    };
    globalVendors = [...globalVendors, newVendor];
    notify();
    return newVendor;
  }, []);

  const updateVendor = useCallback((
    id: string,
    patch: Partial<Omit<Vendor, 'id' | 'createdAt' | 'createdByUserId'>>,
    userId: string = 'admin-001'
  ) => {
    // Check unique name if name is being updated
    if (patch.name) {
      const existing = globalVendors.find(
        v => v.name.toLowerCase() === patch.name!.toLowerCase() && v.id !== id && v.isActive
      );
      if (existing) {
        throw new Error('A vendor with this name already exists.');
      }
    }
    globalVendors = globalVendors.map(v => {
      if (v.id === id) {
        return {
          ...v,
          ...patch,
          updatedAt: new Date().toISOString(),
          updatedByUserId: userId
        };
      }
      return v;
    });
    notify();
  }, []);

  const archiveVendor = useCallback((id: string, userId: string = 'admin-001') => {
    globalVendors = globalVendors.map(v => {
      if (v.id === id) {
        return {
          ...v,
          isActive: false,
          updatedAt: new Date().toISOString(),
          updatedByUserId: userId
        };
      }
      return v;
    });
    // If archived vendor was selected, select first active vendor
    if (globalSelectedVendorId === id) {
      const active = globalVendors.filter(v => v.isActive);
      globalSelectedVendorId = active[0]?.id || null;
    }
    notify();
  }, []);

  const deleteVendorHard = useCallback((id: string) => {
    // Note: Caller must check if vendor is used in work orders before calling
    globalVendors = globalVendors.filter(v => v.id !== id);
    if (globalSelectedVendorId === id) {
      globalSelectedVendorId = globalVendors[0]?.id || null;
    }
    notify();
  }, []);

  const selectVendor = useCallback((id: string | null) => {
    globalSelectedVendorId = id;
    notify();
  }, []);

  const getVendorById = useCallback((id: string) => {
    return globalVendors.find(v => v.id === id);
  }, []);

  const activeVendors = useMemo(() => {
    return vendors
      .filter(v => v.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [vendors]);

  const archivedVendors = useMemo(() => {
    return vendors
      .filter(v => !v.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [vendors]);

  return {
    vendors,
    selectedVendorId,
    activeVendors,
    archivedVendors,
    createVendor,
    updateVendor,
    archiveVendor,
    deleteVendorHard,
    selectVendor,
    getVendorById
  };
};

// TODO: Future enhancements
// - Vendor cost tracking: Add costPerHour, totalSpent fields
// - Vendor performance metrics: Add avgResponseTime, completionRate, rating
// - Vendor compliance documents: Add certifications[], licenses[], insurance[]
