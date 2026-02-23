import { useState, useRef, useEffect } from "react";
import { useSiteStore } from "@/store/useSiteStore";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { useLocationStore } from "@/store/useLocationStore";
import { useAssetStore } from "@/store/useAssetStore";
import { usePartStore } from "@/store/usePartStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useUserStore } from "@/store/useUserStore";
import { useProcedureStore } from "@/store/useProcedureStore";
import { useVendorStore } from "@/store/useVendorStore";
import { useMeterStore } from "@/store/useMeterStore";

export const LocationSelector = () => {
  const { 
    activeSiteId, 
    activeSiteName, 
    userSites, 
    setActiveSiteId, 
    setIsBootstrapping 
  } = useSiteStore();

  const { loadWorkOrders } = useWorkOrderStore();
  const { loadLocations } = useLocationStore();
  const { loadAssets } = useAssetStore();
  const { loadParts } = usePartStore();
  const { loadCategories } = useCategoryStore();
  const { loadUsers } = useUserStore();
  const { loadProcedures } = useProcedureStore();
  const { loadVendors } = useVendorStore();
  const { loadMeters } = useMeterStore();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSiteSwitch = async (siteId: string, siteName: string) => {
    if (siteId === activeSiteId) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    setIsBootstrapping(true);
    setActiveSiteId(siteId, siteName);

    try {
      await Promise.all([
        loadWorkOrders(siteId),
        loadLocations(siteId),
        loadAssets(siteId),
        loadParts(siteId),
        loadCategories(siteId),
        loadUsers(siteId),
        loadProcedures(siteId),
        loadVendors(siteId),
        loadMeters(siteId),
      ]);
    } catch (error) {
      console.error("Failed to switch site data:", error);
    } finally {
      setIsBootstrapping(false);
    }
  };

  const otherSites = userSites.filter(us => us.site_id !== activeSiteId);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="items-center bg-white caret-transparent gap-x-2 flex shrink-0 justify-between gap-y-2 text-left w-full border border-[var(--border)] p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-blue-400 transition-colors"
      >
        <img
          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
          alt="Icon"
          className="box-border caret-transparent shrink-0 h-[15px] w-[15px]"
        />
        <span className="box-border caret-transparent block basis-[0%] grow text-ellipsis text-nowrap overflow-hidden">
          {activeSiteName || "Select Site"}
        </span>
        <div className="self-stretch bg-zinc-200 box-border caret-transparent shrink-0 w-px"></div>
        <div className="items-center box-border caret-transparent flex shrink-0">
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-3.svg"
            alt="Icon"
            className={`text-blue-500 box-border caret-transparent shrink-0 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 w-full bg-white border border-[var(--border)] rounded shadow-lg max-h-60 overflow-y-auto">
          {otherSites.length > 0 ? (
            otherSites.map((us) => (
              <button
                key={us.site_id}
                type="button"
                onClick={() => handleSiteSwitch(us.site_id, us.sites?.name || "Unknown Site")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors border-b last:border-b-0 border-[var(--border)]"
              >
                {us.sites?.name || "Unknown Site"}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400 italic text-center">
              No other sites
            </div>
          )}
        </div>
      )}
    </div>
  );
};
