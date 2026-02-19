import { useEffect, useMemo, useState } from "react";
import { MeterList } from "./components/MeterList";
import { MeterDetail } from "./components/MeterDetail";
import { useMeterStore } from '@/store/useMeterStore';
import { useAssetStore } from '@/store/useAssetStore';
import { MeterEditorPanel } from './components/MeterEditorPanel';

export const Meters = () => {
  const { meters, addMeter, updateMeter } = useMeterStore();
  const { assets } = useAssetStore();
  const [selectedMeterId, setSelectedMeterId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedMeterId && meters.length > 0) setSelectedMeterId(meters[0].id);
    if (selectedMeterId && !meters.find(m => m.id === selectedMeterId)) setSelectedMeterId(meters[0]?.id || null);
  }, [meters, selectedMeterId]);

  // Cross-view selection from Asset view
  useEffect(() => {
    const handler = (e: any) => {
      const id = e?.detail?.id;
      if (id) setSelectedMeterId(id);
    };
    window.addEventListener('select-meter' as any, handler as any);
    return () => window.removeEventListener('select-meter' as any, handler as any);
  }, []);

  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    const arr = term ? meters.filter(m => m.name.toLowerCase().includes(term)) : meters;
    // map for list UI
    return arr.map(m => ({
      id: m.id,
      name: m.name,
      assetName: assets.find(a => a.id === m.assetId)?.name || '—',
      locationName: m.locationName || '—',
      lastReading: typeof m.lastReading === 'number' ? `${m.lastReading}${m.unit ? ` ${m.unit}` : ''}` : '—',
      unit: m.unit || ''
    }));
  }, [meters, assets, search]);

  const startNew = () => { setEditingId(null); setShowEditor(true); };
  const startEdit = (id: string) => { setEditingId(id); setShowEditor(true); };

  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Meters
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Meters"
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
            >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                Manage Integrations
              </span>
            </button>
            <button
              type="button"
              onClick={startNew}
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                New Meter
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="box-border caret-transparent shrink-0 px-4 py-3">
        <div className="items-center box-border caret-transparent flex shrink-0">
          <div className="box-border caret-transparent flex basis-[0%] grow gap-x-2">
            <button
              type="button"
              className="items-center bg-sky-100 text-blue-500 caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-blue-500 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-sky-200"
            >
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Type
              </div>
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Asset
              </div>
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Location
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <MeterList
          meters={list}
          selectedMeterId={selectedMeterId}
          onSelectMeter={(id) => { setSelectedMeterId(id); /* allow inline edit via detail */ }}
        />
        <MeterDetail meterId={selectedMeterId} onEdit={() => { if (selectedMeterId) startEdit(selectedMeterId); }} />
      </div>

      <MeterEditorPanel
        open={showEditor}
        initial={editingId ? meters.find(m => m.id === editingId) || undefined : undefined}
        onClose={() => setShowEditor(false)}
        onSubmit={(val) => {
          if (editingId) updateMeter(editingId, val);
          else addMeter(val);
          setShowEditor(false);
        }}
      />
    </div>
  );
};
