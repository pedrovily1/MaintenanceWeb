export type UserRole = 'Administrator' | 'Technician' | 'Viewer';

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  pin: string; // numeric, 4–6 digits, unique per user
  lastVisit: string; // ISO date string (lastActiveAt equivalent)
  createdAt?: string; // ISO date string
  isActive: boolean;
  avatarUrl?: string;
  // TODO: Future extensions for auth/permissions:
  // - passwordHash: string (for backend auth)
  // - permissions: string[] (for role-based access control)
  // - siteIds: string[] (for multi-site support)
}
