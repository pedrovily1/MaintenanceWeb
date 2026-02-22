import { useState, useEffect, useCallback, useMemo } from 'react';
import { Vendor } from '../types/vendor';
import { useSiteStore } from './useSiteStore';

// Initialize with ZERO vendors by default
const DEFAULT_VENDORS: Vendor[] = [];

let globalVendors: Vendor[] = [];
let globalSelectedVendorId: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

export const useVendorStore = () => {
  const [vendors, setVendors] = useState<Vendor[]>(globalVendors);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(globalSelectedVendorId);
  const { activeUserId, activeSiteId } = useSiteStore();

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

  const loadVendors = useCallback(async (siteId: string) => {
    if (!siteId) return;
    // For now, Phase 1 doesn't have a vendorService but let's keep it site-scoped
    // If there was a fetchVendors(siteId), we'd call it here.
    console.log("loadVendors called for site:", siteId);
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
    userId: string = activeUserId || ''
  ) => {
    // No-op for Phase 1/2 as we are moving to Supabase
    return {} as Vendor;
  }, [activeUserId]);

  const updateVendor = useCallback((
    id: string,
    patch: Partial<Omit<Vendor, 'id' | 'createdAt' | 'createdByUserId'>>,
    userId: string = activeUserId || ''
  ) => {
    // No-op for Phase 1/2 as we are moving to Supabase
  }, [activeUserId]);

  const archiveVendor = useCallback((id: string, userId: string = activeUserId || '') => {
    // No-op for Phase 1/2 as we are moving to Supabase
  }, [activeUserId]);

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
    getVendorById,
    loadVendors,
  };
};

// TODO: Future enhancements
// - Vendor cost tracking: Add costPerHour, totalSpent fields
// - Vendor performance metrics: Add avgResponseTime, completionRate, rating
// - Vendor compliance documents: Add certifications[], licenses[], insurance[]
