import { useState, useMemo, useEffect } from 'react';
import { PartList } from './components/PartList';
import { PartDetail } from './components/PartDetail';
import { PartEditorPanel } from './components/PartEditorPanel';
import { usePartStore } from '@/store/usePartStore';
import { useLocationStore } from '@/store/useLocationStore';
import { needsRestock } from '@/types/part';
import type { PartType } from '@/types/part';

const PART_TYPES: PartType[] = ['Spare Part', 'Consumable', 'Tool', 'Safety Equipment', 'Other'];

export const Parts = () => {
  const { parts, addPart } = usePartStore();
  const { locations } = useLocationStore();

  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [showNewEditor, setShowNewEditor] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRestock, setFilterRestock] = useState(false);
  const [filterPartType, setFilterPartType] = useState<PartType | ''>('');
  const [filterLocationId, setFilterLocationId] = useState('');
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  // Default-select first part on mount / when parts load
  useEffect(() => {
    if (!selectedPartId && parts.length > 0) {
      setSelectedPartId(parts[0].id);
    }
  }, [parts, selectedPartId]);

  // Listen for part-deleted event to deselect
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.id === selectedPartId) setSelectedPartId(null);
    };
    window.addEventListener('part-deleted', handler);
    return () => window.removeEventListener('part-deleted', handler);
  }, [selectedPartId]);

  // Deep-link: select a part from another view (e.g., AssetDetail)
  useEffect(() => {
    const handler = (e: any) => {
      const id = e.detail?.id;
      if (id) setSelectedPartId(id);
    };
    window.addEventListener('select-part', handler);
    return () => window.removeEventListener('select-part', handler);
  }, []);

  const filteredParts = useMemo(() => {
    let list = [...parts];

    if (filterRestock) {
      list = list.filter(p => needsRestock(p));
    }

    if (filterPartType) {
      list = list.filter(p => p.partType === filterPartType);
    }

    if (filterLocationId) {
      list = list.filter(p => p.inventory.some(i => i.locationId === filterLocationId));
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(term));
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [parts, filterRestock, filterPartType, filterLocationId, search]);

  const restockCount = useMemo(() => parts.filter(p => needsRestock(p)).length, [parts]);

  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Parts
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow" onSubmit={e => e.preventDefault()}>
                <input
                  type="search"
                  placeholder="Search Parts"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-[var(--border)] bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <div className="relative box-border caret-transparent flex shrink-0">
              <button
                type="button"
                onClick={() => setShowNewEditor(true)}
                className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-md border-solid hover:bg-blue-400 hover:border-blue-400"
              >
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-22.svg"
                  alt="Icon"
                  className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                />
                <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                  New Part
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="box-border caret-transparent shrink-0 mb-4 mx-4">
        <div className="items-center box-border caret-transparent flex shrink-0">
          <div className="box-border caret-transparent flex basis-[0%] grow">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 gap-y-2">

              {/* Needs Restock toggle */}
              <div className="items-center box-border caret-transparent flex shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterRestock(v => !v)}
                  className={`items-center caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border overflow-hidden px-2 rounded border-solid transition-colors ${
                    filterRestock
                      ? 'bg-amber-50 border-amber-400 text-amber-700'
                      : 'bg-white border-[var(--border)] hover:border-neutral-300'
                  }`}
                >
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-24.svg"
                      alt="Icon"
                      className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                    />
                  </div>
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                    Needs Restock
                    {restockCount > 0 && (
                      <span className="ml-1 bg-amber-100 text-amber-700 text-[9px] font-bold px-1 py-0.5 rounded">
                        {restockCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Part Types dropdown */}
              <div className="relative items-center box-border caret-transparent flex shrink-0">
                <button
                  type="button"
                  onClick={() => { setShowTypeMenu(v => !v); setShowLocationMenu(false); }}
                  className={`items-center caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border overflow-hidden px-2 rounded border-solid transition-colors ${
                    filterPartType
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'bg-white border-[var(--border)] hover:border-neutral-300'
                  }`}
                >
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-25.svg"
                      alt="Icon"
                      className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                    />
                  </div>
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                    {filterPartType || 'Part Types'}
                  </div>
                </button>
                {showTypeMenu && (
                  <div className="absolute top-9 left-0 z-20 bg-white border border-[var(--border)] rounded shadow-lg min-w-[160px]">
                    <button
                      type="button"
                      className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
                      onClick={() => { setFilterPartType(''); setShowTypeMenu(false); }}
                    >
                      All Types
                    </button>
                    {PART_TYPES.map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${filterPartType === t ? 'font-semibold text-blue-600' : ''}`}
                        onClick={() => { setFilterPartType(t); setShowTypeMenu(false); }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location dropdown */}
              <div className="relative items-center box-border caret-transparent flex shrink-0">
                <button
                  type="button"
                  onClick={() => { setShowLocationMenu(v => !v); setShowTypeMenu(false); }}
                  className={`items-center caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border overflow-hidden px-2 rounded border-solid transition-colors ${
                    filterLocationId
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'bg-white border-[var(--border)] hover:border-neutral-300'
                  }`}
                >
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-25.svg"
                      alt="Icon"
                      className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                    />
                  </div>
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                    {filterLocationId ? (locations.find(l => l.id === filterLocationId)?.name ?? 'Location') : 'Location'}
                  </div>
                </button>
                {showLocationMenu && (
                  <div className="absolute top-9 left-0 z-20 bg-white border border-[var(--border)] rounded shadow-lg min-w-[180px] max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
                      onClick={() => { setFilterLocationId(''); setShowLocationMenu(false); }}
                    >
                      All Locations
                    </button>
                    {locations.map(loc => (
                      <button
                        key={loc.id}
                        type="button"
                        className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${filterLocationId === loc.id ? 'font-semibold text-blue-600' : ''}`}
                        onClick={() => { setFilterLocationId(loc.id); setShowLocationMenu(false); }}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {(filterRestock || filterPartType || filterLocationId || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterRestock(false);
                    setFilterPartType('');
                    setFilterLocationId('');
                    setSearch('');
                  }}
                  className="text-xs text-blue-500 hover:text-blue-400 px-1"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4" onClick={() => { setShowTypeMenu(false); setShowLocationMenu(false); }}>
        <PartList
          parts={filteredParts}
          selectedPartId={selectedPartId}
          onSelectPart={setSelectedPartId}
        />
        <PartDetail partId={selectedPartId} />
      </div>

      {/* New Part Editor */}
      <PartEditorPanel
        open={showNewEditor}
        onClose={() => setShowNewEditor(false)}
        onSubmit={(data) => {
          const newPart = addPart(data);
          setSelectedPartId(newPart.id);
          setShowNewEditor(false);
        }}
      />
    </div>
  );
};
