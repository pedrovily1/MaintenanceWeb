import { create } from 'zustand';

interface UserSite {
  site_id: string;
  sites: {
    name: string;
  } | null;
}

interface SiteState {
  activeSiteId: string | null;
  activeSiteName: string | null;
  userSites: UserSite[];
  activeUserId: string | null;
  isBootstrapping: boolean;
  setActiveSiteId: (siteId: string | null, siteName?: string | null) => void;
  setUserSites: (sites: UserSite[]) => void;
  setActiveUserId: (userId: string | null) => void;
  setIsBootstrapping: (v: boolean) => void;
}

export const useSiteStore = create<SiteState>((set) => ({
  activeSiteId: null,
  activeSiteName: null,
  userSites: [],
  activeUserId: null,
  isBootstrapping: true,
  setActiveSiteId: (siteId, siteName = null) => {
    console.log("Active site set to:", siteId, siteName);
    set({ activeSiteId: siteId, activeSiteName: siteName });
  },
  setUserSites: (sites) => {
    set({ userSites: sites });
  },
  setActiveUserId: (userId) => {
    set({ activeUserId: userId });
  },
  setIsBootstrapping: (v) => set({ isBootstrapping: v }),
}));
