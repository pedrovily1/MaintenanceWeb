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
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select a vendor to view details
          </div>
        </div>
      </div>
    );
  }

  const vendor = getVendorById(vendorId);
  if (!vendor) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
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
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <div className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-medium box-border caret-transparent tracking-[-0.2px]">
                  {vendor.name}
                  {!vendor.isActive && (
                    <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">Archived</span>
                  )}
                </h3>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  onClick={onEdit}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowArchiveModal(true)}
                    className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:text-blue-400"
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
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6">
            {/* Vendor Info */}
            {vendor.trade && (
              <div className="box-border caret-transparent shrink-0 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Trade:</span> {vendor.trade}
                </div>
              </div>
            )}

            {(vendor.contactName || vendor.phone || vendor.email || vendor.address) && (
              <>
                <div className="box-border caret-transparent shrink-0 mb-4">
                  <h2 className="text-base font-semibold mb-3">Contact Information</h2>
                  <div className="space-y-2 text-sm">
                    {vendor.contactName && (
                      <div className="text-gray-700">
                        <span className="font-medium">Contact:</span> {vendor.contactName}
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="text-gray-700">
                        <span className="font-medium">Phone:</span>{' '}
                        <a href={`tel:${vendor.phone}`} className="text-blue-500 hover:text-blue-400">
                          {vendor.phone}
                        </a>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="text-gray-700">
                        <span className="font-medium">Email:</span>{' '}
                        <a href={`mailto:${vendor.email}`} className="text-blue-500 hover:text-blue-400">
                          {vendor.email}
                        </a>
                      </div>
                    )}
                    {vendor.address && (
                      <div className="text-gray-700">
                        <span className="font-medium">Address:</span> {vendor.address}
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-b border-zinc-200 my-4"></div>
              </>
            )}

            {vendor.notes && (
              <>
                <div className="box-border caret-transparent shrink-0 mb-4">
                  <h2 className="text-base font-semibold mb-3">Notes</h2>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {vendor.notes}
                  </div>
                </div>
                <div className="border-b border-zinc-200 my-4"></div>
              </>
            )}

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2 mb-4">
              <div>
                <span className="font-medium">Created by:</span> {createdByUser?.fullName || 'Unknown'} on{' '}
                {new Date(vendor.createdAt).toLocaleDateString()} at {new Date(vendor.createdAt).toLocaleTimeString()}
              </div>
              {vendor.updatedAt !== vendor.createdAt && (
                <div>
                  <span className="font-medium">Last updated by:</span> {updatedByUser?.fullName || 'Unknown'} on{' '}
                  {new Date(vendor.updatedAt).toLocaleDateString()} at {new Date(vendor.updatedAt).toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Work Order History */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-4">Work Order History ({workOrders.length})</h2>

              {workOrders.length === 0 ? (
                <div className="text-center text-gray-500 py-8 bg-gray-50 rounded border border-zinc-200">
                  <p className="text-sm">No work orders for this vendor</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {workOrders.map((wo) => {
                    const category = wo.categoryId ? getCategoryById(wo.categoryId) : null;
                    const statusColor = wo.status === 'Done' ? 'text-teal-500' : wo.status === 'In Progress' ? 'text-blue-500' : 'text-gray-500';
                    const priorityColor = wo.priority === 'High' ? 'text-red-500' : wo.priority === 'Medium' ? 'text-orange-500' : 'text-teal-500';

                    return (
                      <div
                        key={wo.id}
                        className="relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[98px] cursor-pointer hover:bg-gray-50 py-3"
                      >
                        {wo.assetImageUrl && (
                          <div className="relative box-border caret-transparent shrink-0 mr-3 rounded-lg">
                            <div className="text-[16.0006px] font-semibold items-center box-border caret-transparent flex shrink-0 h-12 justify-center tracking-[-0.2px] w-12 border border-zinc-200 overflow-hidden rounded-lg border-solid">
                              <img
                                src={wo.assetImageUrl}
                                alt={wo.asset}
                                className="h-12 w-12 object-cover"
                              />
                            </div>
                          </div>
                        )}

                        <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center">
                          <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                            <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                              <div
                                title={wo.title}
                                className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden font-medium"
                              >
                                {wo.title}
                              </div>
                            </div>
                            {category && (
                              <div className="box-border caret-transparent shrink-0">
                                <span className="text-blue-500 text-xs bg-sky-100 px-2 py-1 rounded">
                                  {category.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                            <div className="text-gray-600 text-[12.6px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
                              {wo.status === 'Done' && wo.completedAt ? `Completed on ${new Date(wo.completedAt).toLocaleDateString()}` : `Requested by ${wo.assignedTo || 'Unknown'}`}
                            </div>
                            <div className="text-gray-600 text-[12.6px] box-border caret-transparent shrink-0">
                              {wo.workOrderNumber}
                            </div>
                          </div>
                          <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-px">
                            <div className="relative box-border caret-transparent shrink-0">
                              <div className="text-[12.6px] items-center box-border caret-transparent gap-x-1 flex shrink-0 leading-[15.12px]">
                                <span className={`${statusColor} box-border caret-transparent text-ellipsis text-nowrap overflow-hidden font-medium`}>
                                  {wo.status}
                                </span>
                              </div>
                            </div>
                            <div className="box-border caret-transparent gap-x-1 flex shrink-0 gap-y-1">
                              <div className={`text-[11.9994px] font-semibold items-center box-border caret-transparent gap-x-1 flex shrink-0 tracking-[-0.2px] leading-[17.9991px] gap-y-1 border border-zinc-200 px-1.5 py-0.5 rounded ${priorityColor}`}>
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
