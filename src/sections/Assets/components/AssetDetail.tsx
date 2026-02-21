import React, { useMemo, useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import { AssetAttachments } from './AssetAttachments';
import { AssetEditorPanel } from './AssetEditorPanel';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { useMeterStore } from '@/store/useMeterStore';
import { usePartStore } from '@/store/usePartStore';
import type { Asset } from '@/types/asset';
import { EntityThumbnail } from '@/components/EntityThumbnail';

type AssetDetailProps = {
  assetId: string | null;
};

export const AssetDetail = ({ assetId }: AssetDetailProps) => {
  const { assets, getAssetById, updateAsset, deleteAsset } = useAssetStore();
  const { workOrders } = useWorkOrderStore();
  const { meters } = useMeterStore();
  const { parts } = usePartStore();
  const [showEditor, setShowEditor] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const asset = assetId ? getAssetById(assetId) : undefined;

  const linkedMeters = useMemo(() => {
    if (!asset) return [];
    return (meters || []).filter(m => m.assetId === asset.id);
  }, [meters, asset]);

  const relatedWOs = useMemo(() => {
    if (!asset) return [] as any[];
    const list = workOrders.filter((wo: any) => (wo.assetId && wo.assetId === asset.id) || (!wo.assetId && wo.asset === asset.name));
    return list.sort((a: any,b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()).slice(0,10);
  }, [workOrders, asset]);

  /** Parts compatible with this asset (linked via compatibleAssetIds or asset.compatiblePartIds) */
  const compatibleParts = useMemo(() => {
    if (!asset) return [];
    return parts.filter(p => p.compatibleAssetIds.includes(asset.id));
  }, [parts, asset]);

  /** Parts historically used on this asset (consumed in any completed WO tied to this asset) */
  const partsUsed = useMemo(() => {
    if (!asset) return [] as { partId: string; partName: string; count: number }[];
    const usageMap = new Map<string, { partId: string; partName: string; count: number }>();
    relatedWOs.forEach((wo: any) => {
      (wo.parts || []).filter((p: any) => p.consumed).forEach((p: any) => {
        const existing = usageMap.get(p.partId);
        if (existing) {
          existing.count += p.quantityUsed;
        } else {
          usageMap.set(p.partId, { partId: p.partId, partName: p.partName, count: p.quantityUsed });
        }
      });
    });
    return Array.from(usageMap.values());
  }, [relatedWOs]);

  if (!assetId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="omp-panel shadow-none box-border caret-transparent flex grow w-full overflow-hidden border-solid">
          <div className="flex items-center justify-center w-full h-full text-[var(--muted)] bg-[var(--panel-2)]">
            Select an asset to view details
          </div>
        </div>
      </div>
    );
  }


  if (!asset) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="omp-panel shadow-none box-border caret-transparent flex grow w-full overflow-hidden border-solid">
          <div className="flex items-center justify-center w-full h-full text-[var(--status-offline)] bg-[var(--panel-2)]">
            Error loading asset
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
      <div className="omp-panel shadow-none box-border caret-transparent flex grow w-full overflow-hidden border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <header className="bg-[var(--panel-2)] border-b-[var(--border)] border-l-transparent border-r-transparent border-t-transparent box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4 border-b">
            <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 flex-wrap justify-between gap-y-2 px-4">
              <div className="items-center box-border caret-transparent gap-x-4 flex gap-y-2">
                <EntityThumbnail
                  imageUrl={asset.imageUrl}
                  alt={asset.name}
                  fallbackIcon={
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-6 w-6"
                    />
                  }
                  className="h-16 w-16"
                />
                <div className="box-border caret-transparent">
                  <div className="box-border caret-transparent gap-x-1 flex gap-y-1">
                    <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7 text-[var(--text)]">
                      {asset.name}
                    </h3>
                    <button
                      title="Copy Link"
                      type="button"
                      className="relative text-accent font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-[50%] hover:text-accent-hover"
                    >
                      <span className="box-border caret-transparent flex text-nowrap">
                        <img
                          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-35.svg"
                          alt="Icon"
                          className="box-border caret-transparent h-5 text-nowrap w-5"
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowEditor(true)}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded text-accent hover:text-accent-hover hover:border-accent-hover"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="relative text-accent font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:text-accent-hover"
                >
                  <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-gray-600">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                    />
                  </span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-[var(--panel-2)] border-b-[var(--border)] border-l-transparent border-r-transparent border-t-transparent box-border caret-transparent flex shrink-0 flex-wrap border-b px-4">
              <button
                type="button"
                className="text-[var(--accent)] border-b-[var(--accent)] border-l-transparent border-r-transparent border-t-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all"
              >
                Details
              </button>
              <button
                type="button"
                className="text-[var(--muted)] border-b-transparent border-l-transparent border-r-transparent border-t-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all"
              >
                History
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 p-6">
            {/* Status Section */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold">Status</h2>
                <button
                  type="button"
                  className="text-accent text-[10px] font-medium hover:text-accent-hover uppercase tracking-wider"
                >
                  See More
                </button>
              </div>
              <div className="relative items-center bg-[var(--panel-2)] box-border caret-transparent flex shrink-0 flex-wrap h-10 justify-between min-h-[22px] w-full border border-[var(--border)] rounded-bl rounded-br rounded-tl rounded-tr border-solid">
                <div className="relative items-center box-border caret-transparent flex basis-[0%] grow flex-wrap overflow-hidden px-2 py-0.5">
                  <div className="text-[13px] content-start items-center box-border caret-transparent flex shrink-0 justify-start leading-[15.12px] text-nowrap">
                    <div className="box-border caret-transparent shrink-0 text-nowrap mr-2">
                      <div className="bg-teal-500 box-border caret-transparent shrink-0 h-1.5 text-nowrap w-1.5 rounded-[50%]"></div>
                    </div>
                    <div
                      title={asset.status}
                      className="box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap overflow-hidden opacity-90"
                    >
                      {asset.status}
                    </div>
                  </div>
                </div>
                <div className="items-center box-border caret-transparent flex shrink-0 overflow-hidden">
                  <div className="text-accent box-border caret-transparent flex shrink-0 pr-1 pb-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-47.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 leading-[14px] w-5 opacity-80"
                    />
                  </div>
                </div>
              </div>
              <div className="text-[var(--muted)] text-[11px] mt-1 italic opacity-70">
                Last updated: MaintainX, 31/12/2024, 21:36
              </div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Attachments Section */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Attachments</h2>
              <AssetAttachments attachments={asset.attachments || []} onChange={(next) => updateAsset(asset.id, { attachments: next })} />
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Asset Types & QR Code */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Asset Types</h2>
                <div className="text-sm">Equipment</div>
              </div>
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">QR Code/Barcode</h2>
                <div className="text-sm mb-1 font-mono tracking-tighter">1D0UCME97QHDX</div>
                <div className="bg-gray-100 h-24 w-24 rounded flex items-center justify-center">
                  <div className="text-gray-400 text-[10px]">QR Code</div>
                </div>
              </div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Location */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Location</h2>
              <div className="items-center box-border caret-transparent flex shrink-0">
                <div className="bg-sky-100 border border-blue-300 h-7 w-7 flex items-center justify-center rounded-lg mr-2">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-49.svg"
                    alt="Icon"
                    className="h-4 w-4"
                  />
                </div>
                <div className="text-sm font-medium">{asset.locationName || '-'}</div>
              </div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Linked Meters */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Meters ({linkedMeters.length})</h2>
              {linkedMeters.length === 0 ? (
                <div className="text-[var(--muted)] text-xs italic">No meters linked.</div>
              ) : (
                <div className="space-y-1">
                  {linkedMeters.map(m => (
                    <button key={m.id} onClick={() => { window.location.hash = '#meters'; setTimeout(() => window.dispatchEvent(new CustomEvent('select-meter', { detail: { id: m.id } })), 0); }} className="w-full text-left p-2 border border-[var(--border)] rounded hover:bg-gray-50 flex justify-between items-center group transition-colors">
                      <div className="text-sm font-medium text-accent group-hover:underline">{m.name}</div>
                      <div className="text-xs text-[var(--muted)]">{typeof m.lastReading === 'number' ? `${m.lastReading}${m.unit ? ` ${m.unit}` : ''}` : 'No readings'}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Criticality */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Criticality</h2>
              <div className="text-sm font-medium">{asset.criticality || 'None'}</div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Manufacturer */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Manufacturer</h2>
              <div className="text-sm">{asset.manufacturer}</div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Model */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Model</h2>
              <div className="text-sm">{asset.model || 'None'}</div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Sub-Assets */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Sub-Assets (0)</h2>
              <p className="text-xs text-[var(--muted)] mb-2">
                Add sub elements inside this Asset
              </p>
              <button className="text-accent text-xs font-semibold hover:text-accent-hover uppercase tracking-wider">
                + Create Sub-Asset
              </button>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Parts */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                Compatible Parts ({compatibleParts.length})
              </h2>
              {compatibleParts.length === 0 ? (
                <div className="text-xs text-[var(--muted)] italic">No compatible parts linked.</div>
              ) : (
                <div className="space-y-1">
                  {compatibleParts.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        window.location.hash = '#parts';
                        setTimeout(() => window.dispatchEvent(new CustomEvent('select-part', { detail: { id: p.id } })), 100);
                      }}
                      className="w-full items-center box-border caret-transparent flex shrink-0 p-2 border border-[var(--border)] rounded hover:bg-gray-50 cursor-pointer transition-colors group text-left"
                    >
                      <EntityThumbnail
                        imageUrl={p.imageUrl}
                        alt={p.name}
                        fallbackIcon={
                          <img src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg" alt="Icon" className="h-4 w-4" />
                        }
                        className="h-7 w-7 mr-3"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium group-hover:text-accent transition-colors">{p.name}</div>
                        <div className="text-xs text-[var(--muted)]">{p.inventory.reduce((s, i) => s + i.quantity, 0)} in stock</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {partsUsed.length > 0 && (
                <div className="mt-3">
                  <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                    Parts Used ({partsUsed.length})
                  </h2>
                  <div className="space-y-1">
                    {partsUsed.map(pu => (
                      <div key={pu.partId} className="text-xs border border-[var(--border)] rounded p-2 flex justify-between items-center">
                        <span className="font-medium">{pu.partName}</span>
                        <span className="text-[var(--muted)]">{pu.count} consumed</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Procedures */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Procedures (4)</h2>
              <div className="space-y-1">
                <div className="items-center box-border caret-transparent flex shrink-0 p-2 border border-[var(--border)] rounded hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="bg-sky-100 border border-blue-300 h-7 w-7 flex items-center justify-center rounded-lg mr-3">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-12.svg"
                      alt="Icon"
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="text-sm font-medium group-hover:text-accent transition-colors">Door Delay Troubleshooting</div>
                </div>
                <div className="items-center box-border caret-transparent flex shrink-0 p-2 border border-[var(--border)] rounded hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="bg-sky-100 border border-blue-300 h-7 w-7 flex items-center justify-center rounded-lg mr-3">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-12.svg"
                      alt="Icon"
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="text-sm">Quarterly Door inspections</div>
                </div>
              </div>
              <button className="text-accent text-sm font-medium mt-3 hover:text-accent-hover">
                See all →
              </button>
            </div>

            <div className="border-b border-[var(--border)] my-4"></div>

            {/* Automations */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Automations (0)</h2>
              <div className="bg-sky-50 border border-blue-200 rounded p-4 mb-3">
                <p className="text-sm font-semibold text-blue-600">
                  Add a Meter to this Asset to enable Automations.
                </p>
              </div>
              <button className="text-blue-500 text-sm font-medium hover:text-blue-400">
                Create Meter
              </button>
            </div>

            <div className="border-b border-[var(--border)] my-4"></div>

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <div>Created By Admin on 31/12/2024, 21:36</div>
              <div>Last updated By Admin on 17/12/2025, 09:27</div>
            </div>

            <div className="border-b border-[var(--border)] my-4"></div>

            {/* MTBF */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">
                Mean time between failures (MTBF)
              </h2>
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded">
                <div className="text-gray-400 text-sm">No data available</div>
              </div>
            </div>

            <div className="border-b border-[var(--border)] my-4"></div>

            {/* Related Work Orders */}
            <div className="box-border caret-transparent shrink-0">
              <h2 className="text-base font-medium mb-3">Related Work Orders</h2>
              {relatedWOs.length === 0 ? (
                <div className="text-gray-500 text-sm">No related work orders</div>
              ) : (
                <div className="space-y-2">
                  {relatedWOs.map((wo: any) => (
                    <button key={wo.id} onClick={() => { window.location.hash = '#workorders'; setTimeout(() => window.dispatchEvent(new CustomEvent('select-work-order', { detail: { id: wo.id } })), 0); }} className="w-full text-left p-3 border border-[var(--border)] rounded hover:bg-gray-50">
                      <div className="text-sm font-medium">#{wo.workOrderNumber || wo.id} — {wo.title}</div>
                      <div className="text-xs text-gray-500">{wo.status} • {new Date(wo.updatedAt || wo.createdAt).toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Editor Panel */}
          <AssetEditorPanel open={showEditor} initial={asset} onClose={() => setShowEditor(false)} onSubmit={(val) => { updateAsset(asset.id, val); setShowEditor(false); }} />

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setConfirmDelete(false)}>
              <div className="bg-white w-full max-w-sm rounded-lg shadow-lg border border-[var(--border)] p-4" onClick={(e) => e.stopPropagation()}>
                <div className="text-lg font-semibold mb-2">Delete Asset</div>
                <div className="text-sm text-gray-600 mb-4">Are you sure you want to delete \"{asset.name}\"? This cannot be undone.</div>
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 rounded border border-[var(--border)] text-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  <button className="px-3 py-1 rounded bg-red-600 text-white text-sm" onClick={() => { deleteAsset(asset.id); setConfirmDelete(false); window.dispatchEvent(new CustomEvent('asset-deleted', { detail: { id: asset.id } })); }}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
