import { create } from 'zustand';

interface SiteState {
  activeSiteId: string | null;
  activeUserId: string | null;
  isBootstrapping: boolean;
  setActiveSiteId: (siteId: string | null) => void;
  setActiveUserId: (userId: string | null) => void;
  setIsBootstrapping: (v: boolean) => void;
}

export const useSiteStore = create<SiteState>((set) => ({
  activeSiteId: null,
  activeUserId: null,
  isBootstrapping: true,
  setActiveSiteId: (siteId) => {
    console.log("Active site set to:", siteId);
    set({ activeSiteId: siteId });
  },
  setActiveUserId: (userId) => {
    set({ activeUserId: userId });
  },
  setIsBootstrapping: (v) => set({ isBootstrapping: v }),
}));
