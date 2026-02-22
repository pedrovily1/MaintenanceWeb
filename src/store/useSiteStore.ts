import { create } from 'zustand';

interface SiteState {
  activeSiteId: string | null;
  activeUserId: string | null;
  setActiveSiteId: (siteId: string | null) => void;
  setActiveUserId: (userId: string | null) => void;
}

export const useSiteStore = create<SiteState>((set) => ({
  activeSiteId: null,
  activeUserId: null,
  setActiveSiteId: (siteId) => {
    console.log("Active site set to:", siteId);
    set({ activeSiteId: siteId });
  },
  setActiveUserId: (userId) => {
    set({ activeUserId: userId });
  },
}));
