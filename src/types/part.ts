export type PartType = 'Spare Part' | 'Consumable' | 'Tool' | 'Safety Equipment' | 'Other';

/**
 * Per-location inventory record for a Part.
 * A part can exist in multiple locations; stock is tracked per location.
 */
export interface PartInventory {
  locationId: string;
  locationName: string;
  quantity: number;
  minQuantity: number;
}

/**
 * Core Part entity — first-class CMMS entity.
 */
export interface Part {
  id: string;
  name: string;
  description?: string;
  partType: PartType;
  /** Unit of measure (e.g. "unit", "L", "kg") */
  unit?: string;
  /** Default minimum stock threshold (overridden per location by PartInventory.minQuantity) */
  minStock: number;
  /** Per-location inventory. A part can be stocked at many locations. */
  inventory: PartInventory[];
  /** IDs of assets this part is compatible with / assigned to */
  compatibleAssetIds: string[];
  imageUrl?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Join record linking a Part to a Work Order.
 * Recorded when the WO is created/edited; quantity is deducted on WO completion.
 */
export interface WorkOrderPart {
  partId: string;
  partName: string;
  locationId: string;
  locationName: string;
  quantityUsed: number;
  /** True once the WO was completed and inventory was deducted */
  consumed: boolean;
}

// ── Derived helpers ──────────────────────────────────────────────────────────

/** Total quantity across all locations */
export const getTotalStock = (part: Part): number =>
  part.inventory.reduce((sum, inv) => sum + inv.quantity, 0);

/** True when any location's quantity ≤ its minQuantity */
export const needsRestock = (part: Part): boolean =>
    (part.inventory || []).some(inv => inv.quantity <= inv.minQuantity);
