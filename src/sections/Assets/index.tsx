import { useEffect, useMemo, useState } from "react";
import { useAssetStore } from "@/store/useAssetStore";
import { AssetList } from "./components/AssetList";
import { AssetDetail } from "./components/AssetDetail";
import { AssetFilters, AssetFiltersState } from "./components/AssetFilters";
import { AssetEditorPanel } from "./components/AssetEditorPanel";

export const Assets = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState<AssetFiltersState>({
    search: '',
    status: 'All',
    location: 'All',
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

  const locations = useMemo(() => Array.from(new Set((assets || []).map(a => a.locationName).filter(Boolean))) as string[], [assets]);
  const categories = useMemo(() => Array.from(new Set((assets || []).map(a => a.category).filter(Boolean))) as string[], [assets]);

  const filteredAssets = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const byText = (a: any) => !q || [a.name, a.assetTag, a.manufacturer, a.model, a.serialNumber].some((f: any) => (f || '').toLowerCase().includes(q));
    const byStatus = (a: any) => filters.status === 'All' || a.status === filters.status;
    const byLocation = (a: any) => filters.location === 'All' || a.locationName === filters.location;
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
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Assets
            </h2>
            <div className="box-border caret-transparent shrink-0 pt-2">
              <button
                type="button"
                className="items-start bg-transparent caret-transparent gap-x-1 flex shrink-0 justify-between gap-y-1 text-center p-2 rounded-bl rounded-br rounded-tl rounded-tr"
              >
                <div className="items-center box-border caret-transparent flex h-full text-ellipsis text-nowrap overflow-hidden">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-20.svg"
                    alt="Icon"
                    className="text-slate-500 box-border caret-transparent shrink-0 h-5 text-nowrap w-5 mr-1.5"
                  />
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px] text-nowrap">
                      Panel View
                    </p>
                  </div>
                </div>
                <div className="box-border caret-transparent shrink-0">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-21.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-[7px] w-3 -scale-100"
                  />
                </div>
              </button>
            </div>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <div className="relative box-border caret-transparent flex shrink-0">
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-tl border-solid hover:bg-blue-400 hover:border-blue-400"
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
              <button
                aria-label="New Asset menu"
                type="button"
                className="relative text-white font-bold items-center aspect-square bg-blue-500 border-b-blue-500 border-l-zinc-200 border-r-blue-500 border-t-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border overflow-hidden p-2 rounded-br rounded-tr border-solid hover:bg-blue-400 hover:border-b-blue-400 hover:border-r-blue-400 hover:border-t-blue-400"
              >
                <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-23.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <AssetFilters value={filters} onChange={setFilters} locations={locations} categories={categories} />

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
