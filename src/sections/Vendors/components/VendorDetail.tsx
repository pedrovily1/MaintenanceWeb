import React, { useState } from 'react';
import { useVendorStore } from '@/store/useVendorStore';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { useUserStore } from '@/store/useUserStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { ConfirmationModal } from '@/components/Common/ConfirmationModal';

type VendorDetailProps = {
  vendorId: string | null;
  onEdit: () => void;
};

export const VendorDetail = ({ vendorId, onEdit }: VendorDetailProps) => {
  const { getVendorById, archiveVendor, deleteVendorHard } = useVendorStore();
  const { getWorkOrdersByVendor } = useWorkOrderStore();
  const { getUserById } = useUserStore();
  const { getCategoryById } = useCategoryStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!vendorId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
            Select a vendor to view details
          </div>
        </div>
      </div>
    );
  }

  const vendor = getVendorById(vendorId);
  if (!vendor) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
            Vendor not found
          </div>
        </div>
      </div>
    );
  }

  const workOrders = getWorkOrdersByVendor(vendorId);
  const createdByUser = getUserById(vendor.createdByUserId);
  const updatedByUser = getUserById(vendor.updatedByUserId);

  const handleArchive = () => {
    archiveVendor(vendorId);
    setShowArchiveModal(false);
  };

  const handleDelete = () => {
    if (workOrders.length > 0) {
      setDeleteError(`Cannot delete vendor. ${workOrders.length} work order(s) reference this vendor. Please archive instead.`);
      return;
    }
    deleteVendorHard(vendorId);
    setShowDeleteModal(false);
  };

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <div className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-0">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                  {vendor.name}
                  {!vendor.isActive && (
                    <span className="ml-2 text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded tracking-wider">Archived</span>
                  )}
                </h3>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  onClick={onEdit}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-teal-500 px-3 rounded text-teal-500 hover:text-teal-400 hover:border-teal-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowArchiveModal(true)}
                    className="relative text-teal-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:text-teal-400"
                    title="Archive or Delete"
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
            </div>
          </div>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6 pt-6">
            {/* Vendor Info */}
            {vendor.trade && (
              <div className="box-border caret-transparent shrink-0 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mr-2">Trade:</span> 
                  <span className="font-medium text-[var(--text)]">{vendor.trade}</span>
                </div>
              </div>
            )}

            {(vendor.contactName || vendor.phone || vendor.email || vendor.address) && (
              <>
                <div className="box-border caret-transparent shrink-0 mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Contact Information</h2>
                  <div className="space-y-1.5 text-sm">
                    {vendor.contactName && (
                      <div className="text-gray-700">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] mr-2">Contact:</span> 
                        <span className="font-medium">{vendor.contactName}</span>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="text-gray-700">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] mr-2">Phone:</span>{' '}
                        <a href={`tel:${vendor.phone}`} className="text-teal-500 hover:underline font-medium">
                          {vendor.phone}
                        </a>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="text-gray-700">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] mr-2">Email:</span>{' '}
                        <a href={`mailto:${vendor.email}`} className="text-teal-500 hover:underline font-medium">
                          {vendor.email}
                        </a>
                      </div>
                    )}
                    {vendor.address && (
                      <div className="text-gray-700">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] mr-2">Address:</span> 
                        <span className="font-medium">{vendor.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-b border-[var(--border)] my-3"></div>
              </>
            )}

            {vendor.notes && (
              <>
                <div className="box-border caret-transparent shrink-0 mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Notes</h2>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap italic bg-[var(--panel-2)] p-3 rounded border border-[var(--border)]">
                    {vendor.notes}
                  </div>
                </div>
                <div className="border-b border-[var(--border)] my-3"></div>
              </>
            )}

            {/* Metadata */}
            <div className="text-[10px] text-[var(--muted)] space-y-1 mb-4 italic">
              <div>
                <span className="font-medium">Created by:</span> {createdByUser?.fullName || 'Unknown'} on{' '}
                {new Date(vendor.createdAt).toLocaleDateString()}
              </div>
              {vendor.updatedAt !== vendor.createdAt && (
                <div>
                  <span className="font-medium">Last updated by:</span> {updatedByUser?.fullName || 'Unknown'} on{' '}
                  {new Date(vendor.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Work Order History */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-3">Work Order History ({workOrders.length})</h2>

              {workOrders.length === 0 ? (
                <div className="text-center text-[var(--muted)] py-6 bg-[var(--panel-2)] rounded border border-[var(--border)]">
                  <p className="text-xs uppercase tracking-widest">No history</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {workOrders.map((wo) => {
                    const category = wo.categoryId ? getCategoryById(wo.categoryId) : null;
                    const statusColor = wo.status === 'Done' ? 'text-teal-500' : wo.status === 'In Progress' ? 'text-teal-500' : 'text-gray-500';
                    const priorityColor = wo.priority === 'High' ? 'text-red-500' : wo.priority === 'Medium' ? 'text-orange-500' : 'text-teal-500';

                    return (
                      <div
                        key={wo.id}
                        className="relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-gray-50 py-2 group transition-colors"
                      >
                        {wo.assetImageUrl && (
                          <div className="relative box-border caret-transparent shrink-0 mr-3 rounded">
                            <div className="font-semibold items-center box-border caret-transparent flex shrink-0 h-10 justify-center w-10 border border-[var(--border)] overflow-hidden rounded border-solid">
                              <img
                                src={wo.assetImageUrl}
                                alt={wo.asset}
                                className="h-10 w-10 object-cover"
                              />
                            </div>
                          </div>
                        )}

                        <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center">
                          <div className="items-center box-border caret-transparent flex shrink-0 mb-0.5">
                            <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                              <div
                                title={wo.title}
                                className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden font-medium text-sm group-hover:text-teal-500 transition-colors"
                              >
                                {wo.title}
                              </div>
                            </div>
                            {category && (
                              <div className="box-border caret-transparent shrink-0">
                                <span className="text-teal-500 text-[9px] font-bold uppercase tracking-tighter bg-teal-50 px-1 py-0.5 rounded border border-teal-100">
                                  {category.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="items-center box-border caret-transparent flex shrink-0 justify-between mb-1">
                            <div className="text-gray-500 text-[11px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden italic">
                              {wo.status === 'Done' && wo.completedAt ? `Done ${new Date(wo.completedAt).toLocaleDateString()}` : `By ${wo.assignedTo || 'Unknown'}`}
                            </div>
                            <div className="text-gray-400 text-[10px] font-mono box-border caret-transparent shrink-0">
                              #{wo.workOrderNumber}
                            </div>
                          </div>
                          <div className="items-center box-border caret-transparent flex shrink-0 justify-between">
                            <div className="relative box-border caret-transparent shrink-0">
                              <div className="text-[10px] items-center box-border caret-transparent gap-x-1 flex shrink-0 leading-none uppercase font-bold tracking-wider">
                                <span className={`${statusColor} box-border caret-transparent text-ellipsis text-nowrap overflow-hidden`}>
                                  {wo.status}
                                </span>
                              </div>
                            </div>
                            <div className="box-border caret-transparent flex shrink-0">
                              <div className={`text-[9px] font-bold items-center box-border caret-transparent flex shrink-0 tracking-widest uppercase leading-none border border-[var(--border)] px-1.5 py-0.5 rounded ${priorityColor}`}>
                                {wo.priority}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setDeleteError('');
        }}
        onConfirm={handleArchive}
        title="Archive Vendor"
        message={`Are you sure you want to archive "${vendor.name}"? The vendor will be hidden from pickers but will remain visible in historical work orders.`}
        confirmText="Archive"
        confirmStyle="warning"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteError('');
        }}
        onConfirm={handleDelete}
        title="Delete Vendor"
        message={deleteError || `Are you sure you want to permanently delete "${vendor.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
};
