export interface Vendor {
  id: string;
  name: string;
  trade?: string; // e.g. Electrical, HVAC, Fire Safety, Plumbing
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string; // ISO string
  createdByUserId: string;
  updatedAt: string; // ISO string
  updatedByUserId: string;
}
