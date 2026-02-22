import { useState } from 'react';
import { usePartStore } from '@/store/usePartStore';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useLocationStore } from '@/store/useLocationStore';
import { getTotalStock, needsRestock } from '@/types/part';
import { PartEditorPanel } from './PartEditorPanel';
import { Part } from '@/types/part';
import { EntityThumbnail } from '@/components/EntityThumbnail';

type PartDetailProps = {
  partId: string | null;
};

export const PartDetail = ({ partId }: PartDetailProps) => {
  const { parts, getPartById, updatePart, deletePart, restock: restockPart } = usePartStore();
  const { workOrders } = useWorkOrderStore();
  const { assets } = useAssetStore();
  const { locations } = useLocationStore();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [showEditor, setShowEditor] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockLocId, setRestockLocId] = useState('');
  const [restockQty, setRestockQty] = useState(1);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const part = partId ? getPartById(partId) : undefined;

  if (!partId) {
    return (
        <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
              Select a part to view details
            </div>
          </div>
        </div>
    );
  }

  if (!part) {
    return (
        <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
              Part not found.
            </div>
          </div>
        </div>
    );
  }

  const totalStock = getTotalStock(part);
  const isLowStock = needsRestock(part);

  const relatedWOs = workOrders.filter(wo =>
      (wo.parts || []).some(p => p.partId === part.id)
  );

  const compatibleAssets = assets.filter(a => part.compatibleAssetIds.includes(a.id));

  const consumedWOs = relatedWOs.filter(wo =>
      (wo.parts || []).some(p => p.partId === part.id && p.consumed)
  );

  const handleDelete = () => {
    if (relatedWOs.length > 0) {
      setDeleteError(`Cannot delete: this part is used in ${relatedWOs.length} work order(s).`);
      return;
    }
    deletePart(part.id);
    setConfirmDelete(false);
    window.dispatchEvent(new CustomEvent('part-deleted', { detail: { id: part.id } }));
  };

  const handleRestock = () => {
    if (!restockLocId || restockQty <= 0) return;
    const loc = locations.find(l => l.id === restockLocId);
    const locationName = loc?.name ?? restockLocId;
    restockPart(part.id, restockLocId, locationName, restockQty);
    setShowRestockModal(false);
    setRestockQty(1);
    setRestockLocId('');
  };

  return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
            {/* Header */}
            <header className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4 border-b">
              <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 flex-wrap justify-between gap-y-2 px-4">
                <div className="items-center box-border caret-transparent gap-x-4 flex gap-y-2">
                  <EntityThumbnail
                      imageUrl={part.imageUrl}
                      alt={part.name}
                      fallbackIcon={
                        <img
                            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-10.svg"
                            alt="Icon"
                            className="box-border caret-transparent shrink-0 h-6 w-6"
                        />
                      }
                      className="h-16 w-16"
                  />
                  <div className="box-border caret-transparent">
                    <div className="box-border caret-transparent gap-x-1 flex gap-y-1">
                      <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                        {part.name}
                      </h3>
                    </div>
                    <div className="items-center box-border caret-transparent gap-x-1 flex h-[18px] gap-y-1">
                    <span className={`text-sm box-border caret-transparent block italic ${isLowStock ? 'text-amber-600 font-semibold' : 'text-gray-600'}`}>
                      {totalStock} {part.unit || 'unit'}{totalStock !== 1 ? 's' : ''} in stock
                      {isLowStock && ' — Needs Restock'}
                    </span>
                    </div>
                  </div>
                </div>
                <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                  <button
                      type="button"
                      onClick={() => setShowRestockModal(true)}
                      className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded text-accent hover:bg-accent hover:text-white transition-colors"
                  >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Restock
                  </span>
                  </button>
                  <button
                      type="button"
                      onClick={() => setShowEditor(true)}
                      className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded text-accent hover:bg-accent hover:text-white transition-colors"
                  >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                  </button>
                  <button
                      type="button"
                      onClick={() => { setConfirmDelete(true); setDeleteError(null); }}
                      className="relative text-accent font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:bg-accent hover:text-white transition-colors"
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
                    onClick={() => setActiveTab('details')}
                    className={`${activeTab === 'details' ? 'text-[var(--accent)] border-b-[var(--accent)]' : 'text-[var(--muted)] border-b-transparent'} border-l-transparent border-r-transparent border-t-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all`}
                >
                  Details
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`${activeTab === 'history' ? 'text-[var(--accent)] border-b-[var(--accent)]' : 'text-[var(--muted)] border-b-transparent'} border-l-transparent border-r-transparent border-t-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all`}
                >
                  History
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 p-6 pt-6">
              {activeTab === 'details' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="box-border caret-transparent shrink-0">
                        <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Minimum in Stock</h2>
                        <span className="text-sm font-medium">{part.minStock} {part.unit || 'unit'}{part.minStock !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="box-border caret-transparent shrink-0">
                        <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Available Quantity</h2>
                        <span className={`text-sm font-medium ${isLowStock ? 'text-amber-600' : ''}`}>
                      {totalStock} {part.unit || 'unit'}{totalStock !== 1 ? 's' : ''}
                    </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="box-border caret-transparent shrink-0">
                        <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Part Type</h2>
                        <span className="text-sm">{part.partType}</span>
                      </div>
                      {part.description && (
                          <div className="box-border caret-transparent shrink-0">
                            <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Description</h2>
                            <span className="text-sm">{part.description}</span>
                          </div>
                      )}
                    </div>

                    <div className="border-b border-[var(--border)] my-3"></div>

                    <div className="box-border caret-transparent shrink-0 mb-4">
                      <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                        Location ({part.inventory.length})
                      </h2>
                      {part.inventory.length === 0 ? (
                          <div className="text-xs text-[var(--muted)] italic">No inventory locations configured.</div>
                      ) : (
                          <div className="border border-[var(--border)] rounded overflow-hidden">
                            <table className="w-full text-xs">
                              <thead className="bg-[var(--panel-2)] border-b border-[var(--border)]">
                              <tr>
                                <th className="text-left font-medium text-[var(--muted)] px-3 py-2 uppercase tracking-tight opacity-[0.85]">Location</th>
                                <th className="text-center font-medium text-[var(--muted)] px-3 py-2 uppercase tracking-tight opacity-[0.85]">In Stock</th>
                                <th className="text-center font-medium text-[var(--muted)] px-3 py-2 uppercase tracking-tight opacity-[0.85]">Min</th>
                                <th className="text-center font-medium text-[var(--muted)] px-3 py-2 uppercase tracking-tight opacity-[0.85]">Status</th>
                              </tr>
                              </thead>
                              <tbody>
                              {part.inventory.map(inv => {
                                const low = inv.quantity <= inv.minQuantity;
                                return (
                                    <tr key={inv.locationId} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                                      <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                          <img src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg" alt="Icon" className="h-3 w-3" />
                                          <span className="text-accent font-medium">{inv.locationName}</span>
                                        </div>
                                      </td>
                                      <td className={`px-3 py-2 text-center font-medium ${low ? 'text-amber-600' : ''}`}>{inv.quantity}</td>
                                      <td className="px-3 py-2 text-center text-gray-500">{inv.minQuantity}</td>
                                      <td className="px-3 py-2 text-center">
                                        {low ? (
                                            <span className="bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">Low</span>
                                        ) : (
                                            <span className="bg-green-50 text-green-700 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">OK</span>
                                        )}
                                      </td>
                                    </tr>
                                );
                              })}
                              </tbody>
                            </table>
                          </div>
                      )}
                    </div>

                    <div className="border-b border-[var(--border)] my-3"></div>

                    <div className="box-border caret-transparent shrink-0 mb-4">
                      <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                        Compatible Assets ({compatibleAssets.length})
                      </h2>
                      {compatibleAssets.length === 0 ? (
                          <div className="text-xs text-[var(--muted)] italic">No assets linked.</div>
                      ) : (
                          <div className="space-y-1">
                            {compatibleAssets.map(asset => (
                                <button
                                    key={asset.id}
                                    type="button"
                                    onClick={() => {
                                      window.location.hash = '#assets';
                                      setTimeout(() => {
                                        window.dispatchEvent(new CustomEvent('select-asset', { detail: { id: asset.id } }));
                                      }, 100);
                                    }}
                                    className="w-full border border-[var(--border)] rounded p-2 hover:bg-gray-50 cursor-pointer transition-colors group text-left flex items-center gap-3"
                                >
                                  <div className="bg-sky-100 border border-blue-300 h-7 w-7 flex items-center justify-center rounded-lg">
                                    <img src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg" alt="Icon" className="h-4 w-4" />
                                  </div>
                                  <span className="text-sm font-medium group-hover:text-accent transition-colors">{asset.name}</span>
                                </button>
                            ))}
                          </div>
                      )}
                    </div>

                    <div className="border-b border-[var(--border)] my-3"></div>

                    <div className="text-[10px] text-[var(--muted)] space-y-1 mb-4 italic">
                      <div>Created on {new Date(part.createdAt).toLocaleString()}</div>
                      <div>Last updated on {new Date(part.updatedAt).toLocaleString()}</div>
                    </div>

                    <div className="border-b border-[var(--border)] my-3"></div>

                    <div className="box-border caret-transparent shrink-0">
                      <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                        Work Order History ({relatedWOs.length})
                      </h2>
                      {relatedWOs.length === 0 ? (
                          <div className="text-[var(--muted)] text-xs italic">No work order history</div>
                      ) : (
                          <div className="space-y-1">
                            {relatedWOs.slice(0, 5).map(wo => {
                              const wop = (wo.parts || []).find(p => p.partId === part.id);
                              return (
                                  <button
                                      key={wo.id}
                                      type="button"
                                      onClick={() => {
                                        window.location.hash = '#workorders';
                                        setTimeout(() => {
                                          window.dispatchEvent(new CustomEvent('select-work-order', { detail: { id: wo.id } }));
                                        }, 100);
                                      }}
                                      className="w-full text-left p-2 border border-[var(--border)] rounded hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="text-xs font-medium">{wo.workOrderNumber} — {wo.title}</div>
                                    <div className="text-[10px] text-[var(--muted)]">
                                      {wop?.quantityUsed} {part.unit} used
                                      {wop?.consumed ? ' • Consumed' : ' • Pending'}
                                      {' • '}{wo.status}
                                    </div>
                                  </button>
                              );
                            })}
                          </div>
                      )}
                    </div>
                  </>
              ) : (
                  <>
                    <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-3">
                      Consumption History ({consumedWOs.length} work orders)
                    </h2>
                    {consumedWOs.length === 0 ? (
                        <div className="text-[var(--muted)] text-xs italic">No consumption history.</div>
                    ) : (
                        <div className="space-y-2">
                          {consumedWOs.map(wo => {
                            const wop = (wo.parts || []).find(p => p.partId === part.id);
                            return (
                                <button
                                    key={wo.id}
                                    type="button"
                                    onClick={() => {
                                      window.location.hash = '#workorders';
                                      setTimeout(() => {
                                        window.dispatchEvent(new CustomEvent('select-work-order', { detail: { id: wo.id } }));
                                      }, 100);
                                    }}
                                    className="w-full text-left p-3 border border-[var(--border)] rounded hover:bg-gray-50 transition-colors"
                                >
                                  <div className="text-sm font-medium">{wo.workOrderNumber} — {wo.title}</div>
                                  <div className="text-xs text-[var(--muted)] mt-0.5">
                                    {wop?.quantityUsed} {part.unit} consumed from {wop?.locationName}
                                  </div>
                                  <div className="text-[10px] text-[var(--muted)] mt-0.5">
                                    Completed {wo.completedAt ? new Date(wo.completedAt).toLocaleDateString() : '—'}
                                  </div>
                                </button>
                            );
                          })}
                        </div>
                    )}
                  </>
              )}
            </div>
          </div>
        </div>

        <PartEditorPanel
            open={showEditor}
            initial={part}
            onClose={() => setShowEditor(false)}
            onSubmit={(data) => {
              updatePart(part.id, data);
              setShowEditor(false);
            }}
        />

        {confirmDelete && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setConfirmDelete(false)}>
              <div className="bg-white w-full max-w-sm rounded-lg shadow-lg border border-[var(--border)] p-4" onClick={e => e.stopPropagation()}>
                <div className="text-lg font-semibold mb-2">Delete Part</div>
                {deleteError ? (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">{deleteError}</div>
                ) : (
                    <div className="text-sm text-gray-600 mb-4">
                      Are you sure you want to delete "{part.name}"? This cannot be undone.
                    </div>
                )}
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 rounded border border-[var(--border)] text-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  {!deleteError && (
                      <button className="px-3 py-1 rounded bg-red-600 text-white text-sm" onClick={handleDelete}>Delete</button>
                  )}
                </div>
              </div>
            </div>
        )}

        {showRestockModal && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setShowRestockModal(false)}>
              <div className="bg-white w-full max-w-sm rounded-lg shadow-lg border border-[var(--border)] p-4" onClick={e => e.stopPropagation()}>
                <div className="text-lg font-semibold mb-3">Restock — {part.name}</div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-1">Location</label>
                    <select
                        className="w-full border border-[var(--border)] rounded p-2 text-sm"
                        value={restockLocId}
                        onChange={e => setRestockLocId(e.target.value)}
                    >
                      <option value="">Select location…</option>
                      {locations.map(loc => {
                        const inv = part.inventory.find(i => i.locationId === loc.id);
                        return (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}{inv ? ` (current: ${inv.quantity})` : ' (new)'}
                            </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-1">Quantity to Add</label>
                    <input
                        type="number"
                        min={1}
                        className="w-full border border-[var(--border)] rounded p-2 text-sm"
                        value={restockQty}
                        onChange={e => setRestockQty(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="px-3 py-1 rounded border border-[var(--border)] text-sm" onClick={() => setShowRestockModal(false)}>Cancel</button>
                  <button
                      className="px-3 py-1 rounded bg-accent text-white text-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={handleRestock}
                      disabled={!restockLocId || restockQty <= 0}
                  >
                    Restock
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};