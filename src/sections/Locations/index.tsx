import { useState, useMemo, useEffect } from "react";
import { LocationList } from "./components/LocationList";
import { LocationDetail } from "./components/LocationDetail";
import { useLocationStore } from "@/store/useLocationStore";
import { useAssetStore } from "@/store/useAssetStore";
import { LocationEditorModal } from "./components/LocationEditorModal";

export const Locations = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>("2687779");
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | null>(null);
  const { locations, addLocation } = useLocationStore();
  const { assets } = useAssetStore();

  // Listen for sub-location creation requests from LocationDetail
  useEffect(() => {
    const handler = (e: any) => {
      const parentId = e.detail?.parentLocationId;
      if (parentId) {
        setCreateParentId(parentId);
        setShowCreate(true);
      }
    };
    window.addEventListener('create-sub-location', handler as EventListener);
    return () => window.removeEventListener('create-sub-location', handler as EventListener);
  }, []);

  // Build enriched location list for the list view
  const enrichedLocations = useMemo(() => {
    return locations.map(loc => {
      const subLocationsCount = locations.filter(l => l.parentLocationId === loc.id).length;
      const locAssets = assets.filter(a => a.locationId === loc.id);
      return {
        id: loc.id,
        name: loc.name,
        description: loc.description || '',
        address: loc.address || '',
        parentLocationId: loc.parentLocationId || null,
        subLocationsCount,
        assetsCount: locAssets.length,
        assets: locAssets.map(a => ({
          id: a.id,
          name: a.name,
          imageUrl: '',
        })),
      };
    });
  }, [locations, assets]);

  // Filter by search
  const filteredLocations = useMemo(() => {
    if (!search.trim()) return enrichedLocations;
    const term = search.toLowerCase();
    return enrichedLocations.filter(l => l.name.toLowerCase().includes(term) || (l.address || '').toLowerCase().includes(term));
  }, [enrichedLocations, search]);

  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Locations
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow" onSubmit={e => e.preventDefault()}>
                <input
                  type="search"
                  placeholder="Search Locations"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-[var(--panel-2)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-[var(--border)] pl-3 pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="relative text-white font-bold items-center bg-accent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-accent px-4 rounded-md border-solid hover:bg-accent-hover hover:border-accent-hover"
            >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                New Location
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="box-border caret-transparent shrink-0 px-4 py-3">
        <div className="items-center box-border caret-transparent flex shrink-0">
          <div className="box-border caret-transparent flex basis-[0%] grow gap-x-2">
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <LocationList
          locations={filteredLocations}
          selectedLocationId={selectedLocationId}
          onSelectLocation={setSelectedLocationId}
        />
        <LocationDetail locationId={selectedLocationId} />
      </div>

      {/* Create Modal */}
      {showCreate && (
        <LocationEditorModal
          initial={createParentId ? { parentLocationId: createParentId } : undefined}
          onClose={() => { setShowCreate(false); setCreateParentId(null); }}
          onSubmit={(data) => {
            const created = addLocation(data);
            setShowCreate(false);
            setCreateParentId(null);
            setSelectedLocationId(created.id);
          }}
        />
      )}
    </div>
  );
};
