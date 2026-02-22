import { useState, useMemo } from 'react';
import { EntityThumbnail } from '@/components/EntityThumbnail';
import { useLocationStore } from '@/store/useLocationStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { getDescendantLocationIds } from '@/store/useLocationStore';
import { LocationEditorModal } from './LocationEditorModal';

type LocationDetailProps = {
  locationId: string | null;
};

export const LocationDetail = ({ locationId }: LocationDetailProps) => {
  const { locations, getLocationById, getChildLocations, deleteLocation } = useLocationStore();
  const { assets } = useAssetStore();
  const { workOrders } = useWorkOrderStore();
  const [showEdit, setShowEdit] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { updateLocation } = useLocationStore();

  if (!locationId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
            Select a location to view details
          </div>
        </div>
      </div>
    );
  }

  const location = getLocationById(locationId);

  if (!location) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-red-500 bg-[var(--panel-2)]">
            No location Selected
          </div>
        </div>
      </div>
    );
  }

  const childLocations = getChildLocations(locationId);
  const locationAssets = assets.filter(a => a.locationId === locationId);
  const locationWorkOrders = workOrders.filter(wo => wo.locationId === locationId);


  const handleDelete = () => {
    setDeleteError(null);
    // Check for assets
    if (locationAssets.length > 0) {
      setDeleteError(`Cannot delete: ${locationAssets.length} asset(s) are assigned to this location. Reassign them first.`);
      return;
    }
    // Check for work orders
    if (locationWorkOrders.length > 0) {
      setDeleteError(`Cannot delete: ${locationWorkOrders.length} work order(s) reference this location. Reassign them first.`);
      return;
    }
    // deleteLocation checks for sub-locations internally
    const result = deleteLocation(locationId);
    if (!result.ok) {
      setDeleteError(result.reason || 'Cannot delete this location.');
    }
  };

  const handleCreateSubLocation = () => {
    // Dispatch event for the parent to open create modal with parentLocationId pre-filled
    window.dispatchEvent(new CustomEvent('create-sub-location', {
      detail: { parentLocationId: location.id }
    }));
  };

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full relative">
          {/* Header */}
          <div className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 flex-wrap justify-between gap-y-2 mb-0">
              <div className="items-center box-border caret-transparent gap-x-4 flex gap-y-2">
                <EntityThumbnail
                  imageUrl={location.imageUrl}
                  alt={location.name}
                  fallbackIcon={
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-6 w-6"
                    />
                  }
                  className="h-16 w-16"
                />
                <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                  {location.name}
                </h3>
                <button
                  title="Copy Link"
                  type="button"
                  className="relative text-accent font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-[50%] hover:text-accent-hover transition-colors"
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
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowEdit(true)}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="relative text-accent font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:bg-accent hover:text-white transition-colors"
                  title="Delete Location"
                >
                  <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </span>
                </button>
              </div>
            </div>
            {deleteError && (
              <div className="mt-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                {deleteError}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6 pt-6">
            {/* Description */}
            {location.description && (
              <>
                <div className="box-border caret-transparent shrink-0 mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Description</h2>
                  <div className="box-border caret-transparent text-sm leading-relaxed text-gray-700">
                    {location.description}
                  </div>
                </div>
                <div className="border-b border-[var(--border)] my-3"></div>
              </>
            )}

            {/* Address */}
            {location.address && (
              <>
                <div className="box-border caret-transparent shrink-0 mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Address</h2>
                  <div className="box-border caret-transparent text-sm leading-relaxed text-gray-700">
                    {location.address}
                  </div>
                </div>
                <div className="border-b border-[var(--border)] my-3"></div>
              </>
            )}

            {/* Sub-Locations */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                Sub-Locations ({childLocations.length})
              </h2>
              {childLocations.length === 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-[var(--muted)] italic">
                    Add sub elements inside this Location
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateSubLocation}
                    className="text-accent text-xs font-bold uppercase tracking-wider hover:text-accent-hover text-left"
                  >
                    + Create Sub-Location
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {childLocations.map((child) => (
                    <div
                      key={child.id}
                      className="items-center box-border caret-transparent flex shrink-0 p-2 border border-[var(--border)] rounded hover:bg-gray-50 transition-colors group"
                    >
                      <EntityThumbnail
                        imageUrl={child.imageUrl}
                        alt={child.name}
                        fallbackIcon={
                          <img
                            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                            alt="Location"
                            className="box-border caret-transparent shrink-0 h-3 w-3"
                          />
                        }
                        className="h-7 w-7 mr-3"
                      />
                      <div className="text-sm font-medium group-hover:text-accent transition-colors">{child.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Assets */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                Assets ({locationAssets.length})
              </h2>
              {locationAssets.length === 0 ? (
                <div className="text-[var(--muted)] text-xs italic">No assets at this location</div>
              ) : (
                <div className="space-y-1">
                  {locationAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="items-center box-border caret-transparent flex shrink-0 p-2 border border-[var(--border)] rounded hover:bg-gray-50 transition-colors group"
                    >
                      <EntityThumbnail
                        imageUrl={asset.imageUrl}
                        alt={asset.name}
                        fallbackIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        }
                        className="h-7 w-7 mr-3"
                      />
                      <div className="text-sm font-medium group-hover:text-accent transition-colors">{asset.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Work Orders */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                Work Orders ({locationWorkOrders.length})
              </h2>
              {locationWorkOrders.length === 0 ? (
                <div className="text-[var(--muted)] text-xs italic">No work orders at this location</div>
              ) : (
                <div className="space-y-1">
                  {locationWorkOrders.slice(0, 5).map((wo) => (
                    <div
                      key={wo.id}
                      className="items-center box-border caret-transparent flex shrink-0 p-2 border border-[var(--border)] rounded hover:bg-gray-50 transition-colors group"
                    >
                      <div className="text-sm font-medium group-hover:text-accent transition-colors flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{wo.workOrderNumber}</span>
                        {wo.title}
                      </div>
                      <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${
                        wo.status === 'Done' ? 'bg-green-50 text-green-600' :
                        wo.status === 'In Progress' ? 'bg-accent-muted text-accent' :
                        'bg-gray-50 text-gray-500'
                      }`}>{wo.status}</span>
                    </div>
                  ))}
                  {locationWorkOrders.length > 5 && (
                    <div className="text-xs text-gray-400 italic">
                      and {locationWorkOrders.length - 5} more...
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Metadata */}
            <div className="text-[10px] text-[var(--muted)] space-y-1 mb-4 italic">
              <div>Created on {new Date(location.createdAt).toLocaleString()}</div>
              <div>Last updated on {new Date(location.updatedAt).toLocaleString()}</div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <LocationEditorModal
          initial={location}
          onClose={() => setShowEdit(false)}
          onSubmit={(data) => {
            updateLocation(locationId, data);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
};
