import { useState, useEffect, useCallback } from 'react';
import { Part, PartInventory, WorkOrderPart, getTotalStock } from '@/types/part';

const STORAGE_KEY = 'parts_v1';

// ── Seed data matching the existing hardcoded UI data ────────────────────────

const SEED_DATA: Part[] = [
  {
    id: '11131762',
    name: 'CANIMEX INC Counterbalance Assembly',
    description: 'Counterbalance spring assembly for overhead sliding door',
    partType: 'Spare Part',
    unit: 'unit',
    minStock: 1,
    inventory: [
      { locationId: '3368477', locationName: 'General Storage', quantity: 1, minQuantity: 1 },
    ],
    compatibleAssetIds: [],
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-09-12').toISOString(),
  },
  {
    id: '13650391',
    name: 'Filter, HVAC',
    description: 'Replacement HVAC air filter',
    partType: 'Consumable',
    unit: 'unit',
    minStock: 2,
    inventory: [
      { locationId: '3368477', locationName: 'General Storage', quantity: 1, minQuantity: 2 },
    ],
    compatibleAssetIds: ['1'],
    imageUrl: 'https://app.getmaintainx.com/img/9f9fdbd5-f2d1-4812-a1dc-3ef3a1a82e64_75198044-FBEF-4161-90A6-76667875E21D.HEIC?w=96&h=96&rmode=crop',
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-09-12').toISOString(),
  },
  {
    id: '11131767',
    name: 'FSTRONIC IRC-F1-4A Model 074 Control Panel',
    description: 'Replacement control panel for horizontal sliding door',
    partType: 'Spare Part',
    unit: 'unit',
    minStock: 1,
    inventory: [
      { locationId: '3368477', locationName: 'General Storage', quantity: 1, minQuantity: 1 },
    ],
    compatibleAssetIds: [],
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-09-12').toISOString(),
  },
  {
    id: '10078392',
    name: 'Generator Annual Service Kit',
    description: 'Complete annual service kit for generator',
    partType: 'Consumable',
    unit: 'unit',
    minStock: 1,
    inventory: [
      { locationId: '3368477', locationName: 'General Storage', quantity: 1, minQuantity: 1 },
    ],
    compatibleAssetIds: ['2'],
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-09-12').toISOString(),
  },
  {
    id: '11131761',
    name: 'GfA ELEKTROMATEN TS 970 Motor',
    description: 'Replacement motor for overhead sliding door',
    partType: 'Spare Part',
    unit: 'unit',
    minStock: 1,
    inventory: [
      { locationId: '3368477', locationName: 'General Storage', quantity: 1, minQuantity: 1 },
    ],
    compatibleAssetIds: [],
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-09-12').toISOString(),
  },
  {
    id: '12901637',
    name: 'PSN50W036T2',
    description: 'General purpose power supply unit',
    partType: 'Spare Part',
    unit: 'unit',
    minStock: 1,
    inventory: [
      { locationId: '3368477', locationName: 'General Storage', quantity: 3, minQuantity: 1 },
    ],
    compatibleAssetIds: [],
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-09-12').toISOString(),
  },
];

// ── Global store (module-level singleton, same pattern as other stores) ───────

let globalParts: Part[] = [];
const listeners = new Set<() => void>();

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    globalParts = JSON.parse(saved);
  } catch {
    globalParts = SEED_DATA;
  }
} else {
  globalParts = SEED_DATA;
}

const notify = () => {
  listeners.forEach(l => l());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(globalParts));
};

// ── Helpers exported for cross-store use (e.g. WorkOrderStore) ───────────────

/**
 * Deduct inventory for a list of WorkOrderParts.
 * Returns { ok: boolean; reason?: string } — caller must check before committing.
 */
export const consumePartsFromInventory = (
  woParts: WorkOrderPart[]
): { ok: boolean; reason?: string } => {
  // Validate all quantities FIRST
  for (const wop of woParts) {
    if (wop.consumed) continue; // already deducted
    const part = globalParts.find(p => p.id === wop.partId);
    if (!part) continue; // part deleted — skip silently
    const inv = part.inventory.find(i => i.locationId === wop.locationId);
    if (!inv) {
      return {
        ok: false,
        reason: `Part "${wop.partName}" is not stocked at location "${wop.locationName}".`,
      };
    }
    if (inv.quantity < wop.quantityUsed) {
      return {
        ok: false,
        reason: `Insufficient stock: "${wop.partName}" at ${wop.locationName} has ${inv.quantity} ${
          part.unit || 'unit(s)'
        } but ${wop.quantityUsed} required.`,
      };
    }
  }

  // All checks passed — commit deductions
  globalParts = globalParts.map(part => {
    const matchingWops = woParts.filter(w => !w.consumed && w.partId === part.id);
    if (matchingWops.length === 0) return part;
    const updatedInventory = part.inventory.map(inv => {
      const wop = matchingWops.find(w => w.locationId === inv.locationId);
      if (!wop) return inv;
      return { ...inv, quantity: Math.max(0, inv.quantity - wop.quantityUsed) };
    });
    return { ...part, inventory: updatedInventory, updatedAt: new Date().toISOString() };
  });

  notify();
  return { ok: true };
};

/** Get a part by ID without a hook (for cross-store lookups) */
export const getPartSync = (id: string): Part | undefined =>
  globalParts.find(p => p.id === id);

/** Get all parts without a hook */
export const getPartsSync = (): Part[] => [...globalParts];

// ── React hook ───────────────────────────────────────────────────────────────

export const usePartStore = () => {
  const [parts, setParts] = useState<Part[]>(globalParts);

  useEffect(() => {
    const l = () => setParts([...globalParts]);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  // ── CRUD ────────────────────────────────────────────────────────────────────

  const addPart = useCallback((part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPart: Part = {
      ...part,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    globalParts = [...globalParts, newPart];
    notify();
    return newPart;
  }, []);

  const updatePart = useCallback((id: string, updates: Partial<Part>) => {
    globalParts = globalParts.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    notify();
  }, []);

  const deletePart = useCallback(
    (id: string): { ok: boolean; reason?: string } => {
      // Safety: block deletion if part is referenced by any work order
      // (checked by caller via isPartUsedInWorkOrders helper)
      globalParts = globalParts.filter(p => p.id !== id);
      notify();
      return { ok: true };
    },
    []
  );

  const getPartById = useCallback((id: string) => globalParts.find(p => p.id === id), []);

  // ── Inventory management ────────────────────────────────────────────────────

  /**
   * Add or update inventory for a specific location.
   */
  const setInventoryAtLocation = useCallback(
    (partId: string, inv: PartInventory) => {
      globalParts = globalParts.map(p => {
        if (p.id !== partId) return p;
        const existing = p.inventory.findIndex(i => i.locationId === inv.locationId);
        const updated =
          existing >= 0
            ? p.inventory.map((i, idx) => (idx === existing ? inv : i))
            : [...p.inventory, inv];
        return { ...p, inventory: updated, updatedAt: new Date().toISOString() };
      });
      notify();
    },
    []
  );

  /**
   * Remove inventory for a location.
   * Blocked if the location still has quantity > 0.
   */
  const removeInventoryAtLocation = useCallback(
    (partId: string, locationId: string): { ok: boolean; reason?: string } => {
      const part = globalParts.find(p => p.id === partId);
      if (!part) return { ok: false, reason: 'Part not found.' };
      const inv = part.inventory.find(i => i.locationId === locationId);
      if (inv && inv.quantity > 0) {
        return {
          ok: false,
          reason: `Cannot remove location: ${inv.quantity} unit(s) still in stock. Set quantity to 0 first.`,
        };
      }
      globalParts = globalParts.map(p => {
        if (p.id !== partId) return p;
        return {
          ...p,
          inventory: p.inventory.filter(i => i.locationId !== locationId),
          updatedAt: new Date().toISOString(),
        };
      });
      notify();
      return { ok: true };
    },
    []
  );

  /**
   * Restock: add quantity to a specific location's inventory.
   */
  const restock = useCallback(
    (partId: string, locationId: string, locationName: string, quantity: number) => {
      globalParts = globalParts.map(p => {
        if (p.id !== partId) return p;
        const existing = p.inventory.find(i => i.locationId === locationId);
        const updatedInventory = existing
          ? p.inventory.map(i =>
              i.locationId === locationId ? { ...i, quantity: i.quantity + quantity } : i
            )
          : [
              ...p.inventory,
              { locationId, locationName, quantity, minQuantity: p.minStock },
            ];
        return { ...p, inventory: updatedInventory, updatedAt: new Date().toISOString() };
      });
      notify();
    },
    []
  );

  // ── Derived state ───────────────────────────────────────────────────────────

  const getPartsNeedingRestock = useCallback(() => {
    return globalParts.filter(p =>
      p.inventory.some(inv => inv.quantity <= inv.minQuantity)
    );
  }, []);

  const getPartsByAsset = useCallback((assetId: string) => {
    return globalParts.filter(p => p.compatibleAssetIds.includes(assetId));
  }, []);

  const getPartsByLocation = useCallback((locationId: string) => {
    return globalParts.filter(p => p.inventory.some(i => i.locationId === locationId));
  }, []);

  return {
    parts,
    addPart,
    updatePart,
    deletePart,
    getPartById,
    setInventoryAtLocation,
    removeInventoryAtLocation,
    restock,
    getPartsNeedingRestock,
    getPartsByAsset,
    getPartsByLocation,
    getTotalStock,
  };
};
