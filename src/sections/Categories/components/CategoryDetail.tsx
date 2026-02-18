import { useState } from 'react';
import { Category } from '@/types/category';
import { WorkOrder } from '@/types/workOrder';
import { useUserStore } from '@/store/useUserStore';

type CategoryDetailProps = {
  category: Category | null;
  workOrders: WorkOrder[];
  onEdit: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onUseInNewWorkOrder: () => void;
};

export const CategoryDetail = ({ category, workOrders, onEdit, onArchive, onRestore, onUseInNewWorkOrder }: CategoryDetailProps) => {
  const { getUserById } = useUserStore();
  const [showMenu, setShowMenu] = useState(false);

  if (!category) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select a category to view details
          </div>
        </div>
      </div>
    );
  }

  const createdByUser = getUserById(category.createdByUserId);
  const updatedByUser = getUserById(category.updatedByUserId);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid relative">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <div className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                  {category.name}
                </h3>
                {!category.isActive && (
                  <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">Archived</span>
                )}
                <button
                  title="Copy Link"
                  type="button"
                  className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-[50%] hover:text-blue-400"
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
                    onClick={() => setShowMenu(!showMenu)}
                    className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:text-blue-400"
                  >
                    <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-gray-600">
                      <img
                        src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                        alt="Icon"
                        className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                      />
                    </span>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 rounded shadow-lg z-10 min-w-[150px]">
                      {category.isActive && (
                        <button
                          type="button"
                          onClick={() => { onArchive(); setShowMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Archive Category
                        </button>
                      )}
                      {!category.isActive && (
                        <button
                          type="button"
                          onClick={() => { onRestore(); setShowMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Restore Category
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6">
            {/* Description */}
            {category.description && (
              <div className="text-sm text-gray-600 mb-4 pb-4 border-b border-zinc-200">
                {category.description}
              </div>
            )}

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2 mb-6 pb-6 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                Created By 
                <div 
                  className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"
                  style={{ backgroundImage: `url('${createdByUser?.avatarUrl || 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png'}')` }}
                ></div>
                <span className="text-blue-500 hover:underline cursor-pointer">{createdByUser?.fullName || 'Admin'}</span>
                <span>on {formatDate(category.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                Last updated By
                <div 
                  className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"
                  style={{ backgroundImage: `url('${updatedByUser?.avatarUrl || 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png'}')` }}
                ></div>
                <span className="text-blue-500 hover:underline cursor-pointer">{updatedByUser?.fullName || 'Admin'}</span>
                <span>on {formatDate(category.updatedAt)}</span>
              </div>
            </div>

            {/* Work Order History */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Work Order History</h3>
              </div>

              {/* Work Order List */}
              <div className="space-y-0">
                {workOrders.length === 0 ? (
                  <div className="text-gray-400 text-sm italic py-8 text-center border-2 border-dashed border-gray-100 rounded-lg">
                    No work orders in this category yet.
                  </div>
                ) : (
                  workOrders.map((workOrder) => (
                    <div
                      key={workOrder.id}
                      className="relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[98px] cursor-pointer hover:bg-gray-50 py-3"
                    >
                      <div className="relative box-border caret-transparent shrink-0 mr-3 rounded-lg">
                        <div
                          title={workOrder.title}
                          className="text-[16.0006px] font-semibold items-center box-border caret-transparent flex shrink-0 h-12 justify-center tracking-[-0.2px] w-12 border border-zinc-200 overflow-hidden rounded-lg border-solid"
                        >
                          <figure
                            className="bg-cover box-border caret-transparent shrink-0 h-12 w-12 bg-center bg-gray-100"
                            style={{ backgroundImage: workOrder.assetImageUrl ? `url('${workOrder.assetImageUrl}')` : undefined }}
                          ></figure>
                        </div>
                      </div>

                      <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center">
                        <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                          <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                            <div
                              title={workOrder.title}
                              className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                            >
                              {workOrder.title}
                            </div>
                          </div>
                          <div className="box-border caret-transparent shrink-0">
                            <span className="text-blue-500 text-xs bg-sky-100 px-2 py-1 rounded">
                              {category.name}
                            </span>
                          </div>
                        </div>
                        <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                          <div className="text-gray-600 text-[12.6px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
                            {workOrder.status === 'Done' ? `Completed` : `Requested`} by {workOrder.assignedTo || 'Admin'}
                          </div>
                          <div className="text-gray-600 text-[12.6px] box-border caret-transparent shrink-0">
                            {workOrder.workOrderNumber}
                          </div>
                        </div>
                        <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-px">
                          <div className="relative box-border caret-transparent shrink-0">
                            <div className="text-[12.6px] items-center box-border caret-transparent gap-x-1 flex shrink-0 leading-[15.12px]">
                              <div className="items-center box-border caret-transparent flex shrink-0">
                                <div className={`${workOrder.status === 'Done' ? 'text-teal-500' : 'text-blue-500'} box-border caret-transparent shrink-0 h-3 w-3 mr-1`}>
                                  {workOrder.status === 'Done' ? '✓' : '○'}
                                </div>
                              </div>
                              <span className={`${workOrder.status === 'Done' ? 'text-teal-500' : 'text-blue-500'} box-border caret-transparent text-ellipsis text-nowrap overflow-hidden`}>
                                {workOrder.status}
                              </span>
                            </div>
                          </div>
                          <div className="box-border caret-transparent gap-x-1 flex shrink-0 gap-y-1">
                            <div className="text-[11.9994px] font-semibold items-center box-border caret-transparent gap-x-1 flex shrink-0 tracking-[-0.2px] leading-[17.9991px] gap-y-1 border border-zinc-200 px-1.5 py-0.5 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
                              <span className="items-center box-border caret-transparent flex shrink-0 justify-start">
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-34.svg"
                                  alt="Icon"
                                  className={`${workOrder.priority === 'Low' ? 'text-teal-500' : 'text-orange-500'} box-border caret-transparent shrink-0 h-4 w-4`}
                                />
                              </span>
                              {workOrder.priority}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Floating Button */}
          <div className="absolute box-border caret-transparent shrink-0 translate-x-[-50.0%] z-[3] left-2/4 bottom-6">
            <button
              type="button"
              onClick={onUseInNewWorkOrder}
              className="relative text-blue-500 font-bold items-center bg-white shadow-[rgba(30,36,41,0.16)_0px_4px_12px_0px] caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-3xl border-solid hover:text-blue-400 hover:border-blue-400"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-55.svg"
                alt="Icon"
                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
              />
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                Use in New Work Order
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
