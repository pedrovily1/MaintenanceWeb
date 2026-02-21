import { useEffect, useMemo, useState } from "react";
import { useAssetStore } from "@/store/useAssetStore";
import { AssetList } from "./components/AssetList";
import { AssetDetail } from "./components/AssetDetail";
import { AssetFilters, AssetFiltersState } from "./components/AssetFilters";
import { AssetEditorPanel } from "./components/AssetEditorPanel";
import { getDescendantLocationIds } from "@/store/useLocationStore";

export const Assets = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState<AssetFiltersState>({
    search: '',
    status: 'All',
    location: 'All',
    locationId: 'All',
    category: 'All',
    criticality: 'All',
    sortBy: 'name',
    sortDir: 'asc'
  });
  const { assets, addAsset } = useAssetStore();

  useEffect(() => {
    const onDeleted = (e: any) => {
      if (e?.detail?.id && e.detail.id === selectedAssetId) setSelectedAssetId(null);
    };
    window.addEventListener('asset-deleted', onDeleted as EventListener);
    return () => window.removeEventListener('asset-deleted', onDeleted as EventListener);
  }, [selectedAssetId]);

  const categories = useMemo(() => Array.from(new Set((assets || []).map(a => a.category).filter(Boolean))) as string[], [assets]);

  const filteredAssets = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const byText = (a: any) => !q || [a.name, a.assetTag, a.manufacturer, a.model, a.serialNumber].some((f: any) => (f || '').toLowerCase().includes(q));
    const byStatus = (a: any) => filters.status === 'All' || a.status === filters.status;
    const byLocation = (a: any) => {
      if (filters.locationId === 'All') return true;
      const descendantIds = getDescendantLocationIds(filters.locationId);
      const matchIds = new Set([filters.locationId, ...descendantIds]);
      return a.locationId && matchIds.has(a.locationId);
    };
    const byCategory = (a: any) => filters.category === 'All' || a.category === filters.category;
    const byCriticality = (a: any) => filters.criticality === 'All' || a.criticality === filters.criticality;
    const list = (assets || []).filter(a => byText(a) && byStatus(a) && byLocation(a) && byCategory(a) && byCriticality(a));
    const dir = filters.sortDir === 'asc' ? 1 : -1;
    const mul = (x: number) => x * dir;
    return [...list].sort((a:any,b:any) => {
      if (filters.sortBy === 'name') return mul(a.name.localeCompare(b.name));
      if (filters.sortBy === 'updatedAt') return mul(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      if (filters.sortBy === 'criticality') return mul((a.criticality || '').localeCompare(b.criticality || ''));
      return 0;
    });
  }, [assets, filters]);



  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4 mb-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Assets
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="relative box-border caret-transparent flex shrink-0">
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="relative text-white font-bold items-center bg-accent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-accent px-4 rounded-md border-solid hover:bg-accent-hover hover:border-accent-hover"
              >
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-22.svg"
                  alt="Icon"
                  className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                />
                <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                  New Asset
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <AssetFilters value={filters} onChange={setFilters} categories={categories} />

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <AssetList
          assets={filteredAssets}
          selectedAssetId={selectedAssetId}
          onSelectAsset={setSelectedAssetId}
        />
        <AssetDetail assetId={selectedAssetId} />
      </div>

      {/* Create Panel */}
      <AssetEditorPanel
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(val) => {
          const created = addAsset(val as any);
          setShowCreate(false);
          setSelectedAssetId(created.id);
        }}
      />
    </div>
  );
};
