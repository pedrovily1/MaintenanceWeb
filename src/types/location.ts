export interface Location {
  id: string;
  name: string;
  description?: string;
  address?: string;
  parentLocationId?: string | null;
  siteId?: string;
  createdAt: string;
  updatedAt: string;
}
