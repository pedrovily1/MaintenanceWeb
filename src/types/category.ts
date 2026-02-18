export interface Category {
  id: string;
  name: string;
  icon: string; // SVG data URL or icon key
  color: string; // Tailwind color class (e.g., "bg-teal-50")
  description?: string;
  isActive: boolean;
  createdAt: string; // ISO string
  createdByUserId: string;
  updatedAt: string; // ISO string
  updatedByUserId: string;
}
