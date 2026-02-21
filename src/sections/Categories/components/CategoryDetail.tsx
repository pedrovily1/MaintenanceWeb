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
};

export const CategoryDetail = ({ category, workOrders, onEdit, onArchive, onRestore }: CategoryDetailProps) => {
  const { getUserById } = useUserStore();
  const [showMenu, setShowMenu] = useState(false);

  if (!category) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
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
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid relative">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <div className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                  {category.name}
                </h3>
                {!category.isActive && (
                  <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded tracking-wider">Archived</span>
                )}
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
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  onClick={onEdit}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
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
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--border)] rounded shadow-lg z-10 min-w-[150px]">
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
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6 pt-6">
            {/* Description */}
            {category.description && (
              <div className="text-sm text-gray-700 mb-4 pb-4 border-b border-[var(--border)] leading-relaxed italic">
                {category.description}
              </div>
            )}

            {/* Metadata */}
            <div className="text-[10px] text-[var(--muted)] space-y-1 mb-4 pb-4 border-b border-[var(--border)] italic">
              <div className="flex items-center gap-2">
                Created By 
                <div 
                  className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-3 justify-center w-3 bg-center rounded-[50%]"
                  style={{ backgroundImage: `url('${createdByUser?.avatarUrl || 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png'}')` }}
                ></div>
                <span className="text-blue-500 hover:underline cursor-pointer">{createdByUser?.fullName || 'Admin'}</span>
                <span>on {formatDate(category.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                Last updated By
                <div 
                  className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-3 justify-center w-3 bg-center rounded-[50%]"
                  style={{ backgroundImage: `url('${updatedByUser?.avatarUrl || 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png'}')` }}
                ></div>
                <span className="text-blue-500 hover:underline cursor-pointer">{updatedByUser?.fullName || 'Admin'}</span>
                <span>on {formatDate(category.updatedAt)}</span>
              </div>
            </div>

            {/* Work Order History */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold">Work Order History</h3>
              </div>

              {/* Work Order List */}
              <div className="space-y-1">
                {workOrders.length === 0 ? (
                  <div className="text-[var(--muted)] text-xs italic py-6 text-center border border-dashed border-[var(--border)] rounded">
                    No history.
                  </div>
                ) : (
                  workOrders.map((workOrder) => (
                    <div
                      key={workOrder.id}
                      className="relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-gray-50 py-2 group transition-colors"
                    >
                      <div className="relative box-border caret-transparent shrink-0 mr-3 rounded">
                        <div
                          title={workOrder.title}
                          className="font-semibold items-center box-border caret-transparent flex shrink-0 h-10 justify-center w-10 border border-[var(--border)] overflow-hidden rounded border-solid"
                        >
                          <figure
                            className="bg-cover box-border caret-transparent shrink-0 h-full w-full bg-center bg-gray-50"
                            style={{ backgroundImage: workOrder.assetImageUrl ? `url('${workOrder.assetImageUrl}')` : undefined }}
                          ></figure>
                        </div>
                      </div>

                      <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center">
                        <div className="items-center box-border caret-transparent flex shrink-0 mb-0.5">
                          <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                            <div
                              title={workOrder.title}
                              className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden font-medium text-sm group-hover:text-blue-500 transition-colors"
                            >
                              {workOrder.title}
                            </div>
                          </div>
                          <div className="box-border caret-transparent shrink-0">
                            <span className="text-blue-500 text-[9px] font-bold uppercase tracking-tighter bg-sky-50 px-1 py-0.5 rounded border border-sky-100">
                              {category.name}
                            </span>
                          </div>
                        </div>
                        <div className="items-center box-border caret-transparent flex shrink-0 justify-between mb-1">
                          <div className="text-gray-500 text-[11px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden italic">
                            {workOrder.status === 'Done' ? `Done` : `By`} {workOrder.assignedTo || 'Admin'}
                          </div>
                          <div className="text-gray-400 text-[10px] font-mono box-border caret-transparent shrink-0">
                            #{workOrder.workOrderNumber}
                          </div>
                        </div>
                        <div className="items-center box-border caret-transparent flex shrink-0 justify-between">
                          <div className="relative box-border caret-transparent shrink-0">
                            <div className="text-[10px] items-center box-border caret-transparent gap-x-1 flex shrink-0 leading-none uppercase font-bold tracking-wider">
                              <div className="items-center box-border caret-transparent flex shrink-0">
                                <div className={`${workOrder.status === 'Done' ? 'text-teal-500' : 'text-blue-500'} box-border caret-transparent shrink-0 h-2.5 w-2.5 mr-1`}>
                                  {workOrder.status === 'Done' ? '✓' : '○'}
                                </div>
                              </div>
                              <span className={`${workOrder.status === 'Done' ? 'text-teal-500' : 'text-blue-500'} box-border caret-transparent text-ellipsis text-nowrap overflow-hidden`}>
                                {workOrder.status}
                              </span>
                            </div>
                          </div>
                          <div className="box-border caret-transparent flex shrink-0">
                            <div className={`text-[9px] font-bold items-center box-border caret-transparent flex shrink-0 tracking-widest uppercase leading-none border border-[var(--border)] px-1.5 py-0.5 rounded ${workOrder.priority === 'High' ? 'text-red-500' : workOrder.priority === 'Medium' ? 'text-orange-500' : 'text-teal-500'}`}>
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

        </div>
      </div>
    </div>
  );
};
