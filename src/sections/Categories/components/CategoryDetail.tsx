type CategoryDetailProps = {
  categoryId: string | null;
};

export const CategoryDetail = ({ categoryId }: CategoryDetailProps) => {
  if (!categoryId) {
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

  const mockWorkOrders = [
    {
      id: "76705125",
      title: "HVAC filter replacement",
      imageUrl: "https://app.getmaintainx.com/img/27efc3b8-3cee-41bb-9d47-6922b790cdfe_F2FF6C63-1478-49E5-8663-DAC6C613A866.HEIC?w=64&h=64&rmode=crop",
      completedBy: "Jason Degg",
      workOrderNumber: "#333",
      status: "Done",
      priority: "Low",
      categoryName: "Annual Service"
    },
    {
      id: "62225993",
      title: "Annual Torus Key Management Support Renewal",
      imageUrl: "https://app.getmaintainx.com/img/c69555f7-0ca2-4bd6-875a-fcc60c9a56f5_25769-removebg-preview.png?w=64&h=64&rmode=crop",
      requestedBy: "Jason Degg",
      workOrderNumber: "#189",
      status: "Open",
      priority: "Medium",
      categoryName: "Annual Service"
    },
    {
      id: "58897311",
      title: "Annual Fire Extinguisher Inspection",
      imageUrl: "https://app.getmaintainx.com/img/d278dc2a-666d-4d20-9f23-738ed3fb07aa_processed_image8.png?w=64&h=64&rmode=crop",
      completedBy: "Pedro Modesto",
      workOrderNumber: "#150",
      status: "Done",
      priority: "Medium",
      categoryName: "Annual Service"
    },
    {
      id: "58489567",
      title: "Generator Annual Service Due",
      imageUrl: "https://app.getmaintainx.com/img/d3aa2224-50b2-4252-b11a-a3095827e9ef_processed_image13.png?w=64&h=64&rmode=crop",
      completedBy: "Pedro Modesto",
      workOrderNumber: "#143",
      status: "Done",
      priority: "Medium",
      categoryName: "Annual Service"
    }
  ];

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <div className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                  Annual Service
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
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <button
                  type="button"
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
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6">
            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2 mb-6 pb-6 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                Created By 
                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"></div>
                <span className="text-blue-500 hover:underline cursor-pointer">Jason Degg</span>
                <span>on 29/05/2025, 14:42</span>
              </div>
              <div className="flex items-center gap-2">
                Last updated By
                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"></div>
                <span className="text-blue-500 hover:underline cursor-pointer">Pedro Modesto</span>
                <span>on 09/12/2025, 11:51</span>
              </div>
            </div>

            {/* Work Order History */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Work Order History</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Dec 3 2025 - Jan 21</span>
                  <button
                    type="button"
                    className="text-slate-500 hover:text-gray-600"
                  >
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-28.svg"
                      alt="Icon"
                      className="h-5 w-5"
                    />
                  </button>
                  <button
                    type="button"
                    className="text-slate-500 hover:text-gray-600"
                  >
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                      alt="Icon"
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400 mb-6 border border-zinc-200">
                <div className="text-sm">Work Order History Chart</div>
              </div>

              {/* Work Order List */}
              <div className="space-y-0">
                {mockWorkOrders.map((workOrder) => (
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
                          className="bg-cover box-border caret-transparent shrink-0 h-12 w-12 bg-center"
                          style={{ backgroundImage: `url('${workOrder.imageUrl}')` }}
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
                            {workOrder.categoryName}
                          </span>
                        </div>
                        <div className="box-border caret-transparent shrink-0 ml-2">
                          <span className="items-center box-border caret-transparent flex shrink-0">
                            <div className="box-border caret-transparent shrink-0 h-4">
                              <div className="items-center box-border caret-transparent flex shrink-0">
                                <img
                                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-31.svg"
                                  alt="Icon"
                                  className="box-border caret-transparent shrink-0 h-4 w-4"
                                />
                              </div>
                            </div>
                            {workOrder.completedBy && (
                              <div className="box-border caret-transparent shrink-0 h-4 -ml-0.5">
                                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"></div>
                              </div>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                        <div className="text-gray-600 text-[12.6px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
                          {workOrder.completedBy ? `Completed by ${workOrder.completedBy}` : `Requested by ${workOrder.requestedBy}`}
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
                ))}
              </div>
            </div>
          </div>

          {/* Floating Button */}
          <div className="absolute box-border caret-transparent shrink-0 translate-x-[-50.0%] z-[3] left-2/4 bottom-6">
            <button
              type="button"
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
