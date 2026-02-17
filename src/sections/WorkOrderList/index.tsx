import { useState } from "react";
import { TabButtons } from "@/sections/WorkOrderList/components/TabButtons";
import { SortControls } from "@/sections/WorkOrderList/components/SortControls";
import { WorkOrderCard } from "@/sections/WorkOrderList/components/WorkOrderCard";

export const WorkOrderList = () => {
  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');

  const workOrders = [
    {
      id: "86733636",
      title: "Weekly Maintenance Service",
      workOrderNumber: "#411",
      assetName: "0-GENERAL PURPOSE",
      assetImageUrl: "https://app.getmaintainx.com/img/fbfb6507-4423-4d18-bf98-55359a5e8f7b_processed_image10.png?w=96&h=96&rmode=crop",
      status: "Open",
      priority: "Low",
      dueDate: "06/02/2026",
      isOverdue: true,
      isRecurring: true,
      assignedUsers: [
        { name: "Pedro Modesto", imageUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png" }
      ],
      assignedTeams: [
        { name: "Site Maintenance", initials: "SM", color: "bg-pink-500" }
      ]
    }
  ];

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
                    Assigned to Me ({workOrders.length})
                  </span>
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-29.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-[7px] w-3"
                  />
                </div>
                {workOrders.map((wo) => (
                  <WorkOrderCard key={wo.id} {...wo} />
                ))}
                <div className="text-blue-500 text-[12.6px] font-medium box-border caret-transparent shrink-0 leading-[15.12px] px-4 py-2 mt-4">
                  <span className="text-neutral-800 box-border caret-transparent shrink-0 pr-1">
                    Unassigned (0)
                  </span>
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-29.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-[7px] w-3"
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 box-border caret-transparent shrink-0 py-8 px-4">
                <p className="text-lg font-medium mb-2">No completed work orders</p>
                <p className="text-sm">Work orders marked as done will appear here</p>
              </div>
            )}
          </div>
        </div>
        <div className="box-border caret-transparent flex flex-col grow shrink-0 w-full lg:basis-[375px] lg:min-w-[200px] lg:pt-2 lg:px-2">
          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
              <div className="relative box-border caret-transparent flex flex-col grow w-full">
                <div className="box-border caret-transparent shrink-0">
                  <header className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4 border-b">
                    <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 px-4">
                      <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                        <div className="box-border caret-transparent">
                          <div className="box-border caret-transparent gap-x-1 flex gap-y-1">
                            <h3 className="text-[20.0004px] font-semibold box-border caret-transparent tracking-[-0.2px] leading-[28.0006px]">
                              Weekly Maintenance Service
                            </h3>
                            <button
                              title="Copy Link"
                              type="button"
                              className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-[50%] hover:text-blue-400 hover:border-blue-400"
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
                                Weekly
                              </span>
                            </div>
                            <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                              <span className="box-border caret-transparent flex mr-px">
                                <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                                  -
                                </span>
                              </span>
                              <img
                                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-37.svg"
                                alt="Icon"
                                className="box-border caret-transparent h-3.5 w-3.5"
                              />
                              <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                                Overdue since 06/02/2026
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                        <a
                          href="https://app.getmaintainx.com/workorders/84658821/comments"
                          className="text-blue-500 box-border caret-transparent block shrink-0 break-words"
                        >
                          <button
                            type="button"
                            className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
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
                        </a>
                        <div className="box-border caret-transparent shrink-0">
                          <a
                            href="https://app.getmaintainx.com/workorders/84658821/edit"
                            className="text-blue-500 box-border caret-transparent shrink-0 break-words"
                          >
                            <button
                              type="button"
                              className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
                            >
                              <img
                                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-39.svg"
                                alt="Icon"
                                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                              />
                              <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                                Edit
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="relative box-border caret-transparent shrink-0">
                          <button
                            type="button"
                            className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-bl rounded-br rounded-tl rounded-tr hover:text-blue-400 hover:border-blue-400"
                          >
                            <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                              <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-gray-600 hover:border-gray-600">
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                                  alt="Icon"
                                  className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                                />
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
                              <button
                                type="button"
                                className="text-white text-[11.2px] items-center bg-blue-500 caret-transparent flex fill-white flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[71.25px] border border-blue-500 mr-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-blue-400"
                              >
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-41.svg"
                                  alt="Icon"
                                  className="box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6"
                                />
                                <div className="text-[12.6px] font-medium box-border caret-transparent fill-white shrink-0 leading-[15.12px] text-nowrap mt-1">
                                  Open
                                </div>
                              </button>
                              <button
                                type="button"
                                className="text-blue-500 text-[11.2px] items-center bg-white caret-transparent flex fill-blue-500 flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[71.25px] border border-zinc-200 mr-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-gray-50"
                              >
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-42.svg"
                                  alt="Icon"
                                  className="box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6"
                                />
                                <div className="text-[12.6px] font-medium box-border caret-transparent fill-blue-500 shrink-0 leading-[15.12px] text-nowrap mt-1">
                                  On Hold
                                </div>
                              </button>
                              <button
                                type="button"
                                className="text-blue-500 text-[11.2px] items-center bg-white caret-transparent flex fill-blue-500 flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[71.25px] border border-zinc-200 mr-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-gray-50"
                              >
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-43.svg"
                                  alt="Icon"
                                  className="box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6"
                                />
                                <div className="text-[12.6px] font-medium box-border caret-transparent fill-blue-500 shrink-0 leading-[15.12px] text-nowrap mt-1">
                                  In Progress
                                </div>
                              </button>
                              <button
                                type="button"
                                className="text-blue-500 text-[11.2px] items-center bg-white caret-transparent flex fill-blue-500 flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[71.25px] border border-zinc-200 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-gray-50"
                              >
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-44.svg"
                                  alt="Icon"
                                  className="box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6"
                                />
                                <div className="text-[12.6px] font-medium box-border caret-transparent fill-blue-500 shrink-0 leading-[15.12px] text-nowrap mt-1">
                                  Done
                                </div>
                              </button>
                            </div>
                          </div>
                          <div className="items-center box-border caret-transparent flex shrink-0 ml-auto">
                            <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                              <button
                                title="Share Externally"
                                type="button"
                                className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap px-2 rounded-bl rounded-br rounded-tl rounded-tr hover:text-blue-400 hover:border-blue-400"
                              >
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-45.svg"
                                  alt="Icon"
                                  className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                                />
                                <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                                  Share Externally
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
