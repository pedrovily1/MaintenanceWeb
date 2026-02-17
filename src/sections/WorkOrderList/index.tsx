import { useState, useMemo } from "react";
import { TabButtons } from "@/sections/WorkOrderList/components/TabButtons";
import { SortControls } from "@/sections/WorkOrderList/components/SortControls";
import { WorkOrderCard } from "@/sections/WorkOrderList/components/WorkOrderCard";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";

import { attachmentService } from "@/services/attachmentService";
import { DEFAULT_SECTIONS } from "@/utils/defaultSections";
import { SectionRenderer } from "@/components/WorkOrder/SectionRenderer";
import { WorkOrderSection } from "@/types/workOrder";

export const WorkOrderList = () => {
  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const { workOrders, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useWorkOrderStore();

  const filteredWorkOrders = useMemo(() => {
    if (!Array.isArray(workOrders)) return [];
    if (activeTab === 'done') {
      return workOrders.filter(wo => wo && wo.status === 'Done');
    }
    return workOrders.filter(wo => wo && wo.status !== 'Done');
  }, [workOrders, activeTab]);

  const selectedWorkOrder = useMemo(() => {
    try {
      if (!Array.isArray(workOrders) || workOrders.length === 0) return null;
      const found = workOrders.find(wo => wo && wo.id === selectedWorkOrderId);
      if (found) return found;
      // Don't auto-select the first one if the ID was explicitly set but not found (e.g. deleted)
      if (selectedWorkOrderId) return null;
      return (Array.isArray(filteredWorkOrders) && filteredWorkOrders[0]) || null;
    } catch (e) {
      console.error("Error selecting work order", e);
      return null;
    }
  }, [selectedWorkOrderId, workOrders, filteredWorkOrders]);

  const handleUpdateSection = (sectionId: string, updates: Partial<WorkOrderSection>) => {
    if (!selectedWorkOrder || !Array.isArray(selectedWorkOrder.sections)) return;
    const updatedSections = selectedWorkOrder.sections.map(s => 
      s && s.id === sectionId ? { ...s, ...updates } : s
    );
    updateWorkOrder(selectedWorkOrder.id, { sections: updatedSections });
  };

  const isWorkOrderValidForDone = useMemo(() => {
    if (!selectedWorkOrder) return false;
    const sections = selectedWorkOrder.sections;
    if (!Array.isArray(sections)) return true; // If no sections, it's valid?

    try {
      return sections.every(section => {
        if (!section || !section.required) return true;
        const fields = section.fields;
        if (!Array.isArray(fields)) return true;
        return fields.every(field => {
          if (!field || !field.required) return true;
          if (field.type === 'photo') return Array.isArray(field.attachments) && field.attachments.length > 0;
          return !!field.value;
        });
      });
    } catch (e) {
      console.error("Error validating work order", e);
      return false;
    }
  }, [selectedWorkOrder]);

  const handleStatusUpdate = (status: 'Open' | 'On Hold' | 'In Progress' | 'Done') => {
    if (!selectedWorkOrder) return;
    if (status === 'Done' && !isWorkOrderValidForDone) {
      alert("Please complete all required fields before marking as Done.");
      return;
    }
    updateWorkOrder(selectedWorkOrder.id, { status });
  };

  const handleNewWorkOrder = () => {
    const title = window.prompt("Enter Work Order Title:", "New Maintenance Task");
    if (!title) return;

    const newWo = addWorkOrder({
      title,
      description: "Description of the task...",
      status: 'Open',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: 'Pedro Modesto',
      assignedUsers: [
        { name: "Pedro Modesto", imageUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png" }
      ],
      asset: 'GENERAL PURPOSE',
      location: 'Site',
      categories: ['Maintenance'],
      workType: 'Corrective',
      sections: DEFAULT_SECTIONS,
      attachments: []
    });
    setSelectedWorkOrderId(newWo.id);
    setActiveTab('todo');
  };

  // Add listener for a custom event from PageHeader
  useState(() => {
    const handler = () => handleNewWorkOrder();
    window.addEventListener('trigger-new-work-order', handler);
    return () => window.removeEventListener('trigger-new-work-order', handler);
  });

  const todoCount = useMemo(() => {
    if (!Array.isArray(workOrders)) return 0;
    return workOrders.filter(wo => wo && wo.status !== 'Done').length;
  }, [workOrders]);

  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-2 lg:mx-4 flex-col lg:flex-row gap-4 lg:gap-0">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 w-full lg:max-w-[500px] lg:min-w-[300px] lg:w-2/5 border border-zinc-200 lg:mr-4 rounded-tl rounded-tr border-solid">
          <TabButtons activeTab={activeTab} onTabChange={setActiveTab} />
          <SortControls />
          <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br rounded-tl rounded-tr">
            {activeTab === 'todo' ? (
              <>
                <div className="text-blue-500 text-[12.6px] font-medium box-border caret-transparent shrink-0 leading-[15.12px] px-4 py-2">
                  <span className="text-neutral-800 box-border caret-transparent shrink-0 pr-1">
                    Assigned to Me ({todoCount})
                  </span>
                </div>
                {filteredWorkOrders.map((wo) => (
                  <WorkOrderCard 
                    key={wo.id} 
                    {...wo} 
                    assetName={wo.asset} 
                    onClick={() => setSelectedWorkOrderId(wo.id)}
                    isActive={selectedWorkOrder?.id === wo.id}
                  />
                ))}
              </>
            ) : (
              <>
                <div className="text-blue-500 text-[12.6px] font-medium box-border caret-transparent shrink-0 leading-[15.12px] px-4 py-2">
                  <span className="text-neutral-800 box-border caret-transparent shrink-0 pr-1">
                    Completed ({filteredWorkOrders.length})
                  </span>
                </div>
                {filteredWorkOrders.map((wo) => (
                  <WorkOrderCard 
                    key={wo.id} 
                    {...wo} 
                    assetName={wo.asset} 
                    onClick={() => setSelectedWorkOrderId(wo.id)}
                    isActive={selectedWorkOrder?.id === wo.id}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <div className="box-border caret-transparent flex flex-col grow shrink-0 w-full lg:basis-[375px] lg:min-w-[200px] lg:pt-2 lg:px-2">
          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            {!selectedWorkOrder ? (
               <div className="flex items-center justify-center w-full h-full text-gray-500">
                 Select a work order to view details
               </div>
            ) : (
              <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
                <div className="relative box-border caret-transparent flex flex-col grow w-full">
                  <div className="box-border caret-transparent shrink-0">
                    <header className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4 border-b">
                      <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 px-4">
                        <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                          <div className="box-border caret-transparent">
                            <div className="box-border caret-transparent gap-x-1 flex gap-y-1">
                              <h3 className="text-[20.0004px] font-semibold box-border caret-transparent tracking-[-0.2px] leading-[28.0006px]">
                                {selectedWorkOrder.title}
                              </h3>
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
                            <div className="items-center box-border caret-transparent gap-x-1 flex h-[18px] gap-y-1">
                              <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-36.svg"
                                  alt="Icon"
                                  className="text-blue-500 box-border caret-transparent h-3.5 w-3.5"
                                />
                                <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                                  {selectedWorkOrder.workType}
                                </span>
                              </div>
                              <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                                <span className="box-border caret-transparent flex mr-px">
                                  <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                                    - Due {new Date(selectedWorkOrder.dueDate).toLocaleDateString()}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                          <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                            <button
                              type="button"
                              className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
                            >
                              <img
                                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-38.svg"
                                alt="Icon"
                                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                              />
                              <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                                Comments
                              </span>
                            </button>
                          </div>
                          <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                            <label
                              className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400 cursor-pointer"
                            >
                              <img
                                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-39.svg"
                                alt="Icon"
                                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                              />
                              <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                                Photos ({(selectedWorkOrder.attachments || []).length})
                              </span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                multiple
                                onChange={async (e) => {
                                  if (e.target.files) {
                                    const newAtts = [];
                                    for(let i=0; i<e.target.files.length; i++) {
                                      const att = await attachmentService.uploadFile(e.target.files[i]);
                                      newAtts.push(att);
                                    }
                                    updateWorkOrder(selectedWorkOrder.id, { 
                                      attachments: [...(selectedWorkOrder.attachments || []), ...newAtts] 
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <div className="relative box-border caret-transparent flex shrink-0">
                            <button
                              type="button"
                              className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-bl rounded-br rounded-tl rounded-tr hover:text-blue-400 hover:border-blue-400"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this work order?")) {
                                  deleteWorkOrder(selectedWorkOrder.id);
                                  setSelectedWorkOrderId(null);
                                }
                              }}
                            >
                              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                                <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-red-600 hover:border-red-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </header>
                  </div>
                  <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4">
                    <div className="box-border caret-transparent shrink-0 pb-6">
                      <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
                        <div className="box-border caret-transparent basis-[0%] grow ml-6 my-3">
                          <div className="box-border caret-transparent shrink-0 pb-2">
                            <strong className="font-semibold box-border caret-transparent shrink-0">
                              Status
                            </strong>
                          </div>
                          <div className="items-center box-border caret-transparent gap-x-1 flex shrink-0 flex-wrap-reverse gap-y-1">
                            <div className="box-border caret-transparent shrink-0">
                              <div className="items-center box-border caret-transparent flex shrink-0">
                                {(['Open', 'On Hold', 'In Progress', 'Done'] as const).map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusUpdate(status)}
                                    className={`${
                                      selectedWorkOrder.status === status 
                                      ? 'text-white bg-blue-500 border-blue-500' 
                                      : 'text-blue-500 bg-white border-zinc-200'
                                    } text-[11.2px] items-center caret-transparent flex flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[71.25px] border mr-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:opacity-80`}
                                  >
                                    <img
                                      src={
                                        status === 'Open' ? "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-41.svg" :
                                        status === 'On Hold' ? "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-42.svg" :
                                        status === 'In Progress' ? "/src/public/inprogress.svg" :
                                        "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-44.svg"
                                      }
                                      alt={status}
                                      className={`box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6 ${selectedWorkOrder.status === status ? 'invert brightness-0' : ''}`}
                                    />
                                    <div className={`text-[12.6px] font-medium box-border caret-transparent shrink-0 leading-[15.12px] text-nowrap mt-1`}>
                                      {status}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="box-border caret-transparent shrink-0 mt-6 pb-2">
                            <strong className="font-semibold box-border caret-transparent shrink-0">
                              Description
                            </strong>
                          </div>
                          <div className="box-border caret-transparent shrink-0">
                            <textarea
                              className="w-full border border-zinc-200 rounded p-2 text-sm min-h-[100px]"
                              value={selectedWorkOrder.description}
                              onChange={(e) => updateWorkOrder(selectedWorkOrder.id, { description: e.target.value })}
                            />
                          </div>

                          <div className="box-border caret-transparent shrink-0 mt-6 pb-2">
                            <strong className="font-semibold box-border caret-transparent shrink-0">
                              Form Sections
                            </strong>
                          </div>
                          <div className="box-border caret-transparent shrink-0 space-y-4">
                            {Array.isArray(selectedWorkOrder.sections) && selectedWorkOrder.sections.map((section) => (
                              <SectionRenderer
                                key={section.id}
                                section={section}
                                onUpdate={(updates) => handleUpdateSection(section.id, updates)}
                                disabled={selectedWorkOrder.status === 'Done'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
