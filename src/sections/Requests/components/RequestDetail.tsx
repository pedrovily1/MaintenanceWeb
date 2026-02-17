import { useQuery } from "@animaapp/playground-react-sdk";

type RequestDetailProps = {
  requestId: string | null;
};

export const RequestDetail = ({ requestId }: RequestDetailProps) => {
  const { data: request, isPending, error } = useQuery("Request", requestId || "");

  if (!requestId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select a request to view details
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Loading request details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-red-500">
            Error loading request
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <header className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4 border-b">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 px-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <div className="box-border caret-transparent">
                  <div className="box-border caret-transparent gap-x-1 flex gap-y-1">
                    <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                      {request.title}
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
                      <span className="text-gray-600 text-xs box-border caret-transparent block">
                        Monthly
                      </span>
                    </div>
                    <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                      <span className="box-border caret-transparent flex mr-px">
                        <span className="text-gray-600 text-xs box-border caret-transparent block">
                          -
                        </span>
                      </span>
                      <span className="text-gray-600 text-xs box-border caret-transparent block">
                        Completed on {new Date(request.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
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
                <button
                  type="button"
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
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
          </header>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 p-6">
            {/* Status Section */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <div className="font-semibold mb-3">Status</div>
              <div className="items-center box-border caret-transparent flex shrink-0">
                <button
                  type="button"
                  className="text-blue-500 text-xs items-center bg-white caret-transparent flex flex-col shrink-0 h-14 justify-center text-center w-20 border border-zinc-200 mr-2 p-2 rounded hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">Open</div>
                </button>
                <button
                  type="button"
                  className="text-blue-500 text-xs items-center bg-white caret-transparent flex flex-col shrink-0 h-14 justify-center text-center w-20 border border-zinc-200 mr-2 p-2 rounded hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">On Hold</div>
                </button>
                <button
                  type="button"
                  className="text-blue-500 text-xs items-center bg-white caret-transparent flex flex-col shrink-0 h-14 justify-center text-center w-24 border border-zinc-200 mr-2 p-2 rounded hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">In Progress</div>
                </button>
                <button
                  type="button"
                  className="text-white text-xs items-center bg-blue-500 caret-transparent flex flex-col shrink-0 h-14 justify-center text-center w-20 border border-blue-500 p-2 rounded hover:bg-blue-400"
                >
                  <div className="text-sm font-medium">Done</div>
                </button>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <h2 className="font-semibold mb-2">Due Date</h2>
                <div>{new Date(request.dueDate).toLocaleDateString()}</div>
              </div>
              <div>
                <h2 className="font-semibold mb-2">Priority</h2>
                <div className="text-xs font-semibold items-center box-border caret-transparent gap-x-1 inline-flex border border-zinc-200 px-1.5 py-0.5 rounded">
                  <span className="items-center box-border caret-transparent flex shrink-0 justify-start">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-34.svg"
                      alt="Icon"
                      className="text-teal-500 box-border caret-transparent shrink-0 h-4 w-4"
                    />
                  </span>
                  {request.priority}
                </div>
              </div>
              <div>
                <h2 className="font-semibold mb-2">Work Order ID</h2>
                <div>{request.workOrderNumber}</div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="font-semibold mb-2">Request ID</h2>
              <div>{request.requestNumber}</div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Assigned To */}
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Assigned To</h2>
              <div className="items-center box-border caret-transparent flex shrink-0">
                <img
                  src="https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png"
                  className="box-border caret-transparent shrink-0 h-5 w-5 mr-2 rounded-full"
                  alt="User"
                />
                <div className="box-border caret-transparent">
                  <div className="box-border caret-transparent">Pedro Modesto</div>
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Description</h2>
              <div className="box-border caret-transparent leading-[21px]">
                {request.description}
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Asset */}
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Asset</h2>
              <div className="items-center box-border caret-transparent flex shrink-0">
                <div className="box-border caret-transparent shrink-0 mr-2">
                  <div className="font-semibold items-center box-border caret-transparent flex shrink-0 h-8 justify-center w-8 border border-zinc-200 overflow-hidden rounded-lg border-solid">
                    <figure className="bg-[url('https://app.getmaintainx.com/img/63288309-1ff2-4ec8-a512-80805e4bee93_processed_image22.png?w=64&h=64&rmode=crop')] bg-cover box-border caret-transparent shrink-0 h-8 w-8 bg-center"></figure>
                  </div>
                </div>
                <div className="box-border caret-transparent flex flex-col grow">
                  <div className="box-border caret-transparent">{request.assetName}</div>
                  <div className="text-xs items-center flex gap-1 mt-1">
                    <div className="bg-teal-500 h-1.5 w-1.5 rounded-full"></div>
                    <span>{request.assetStatus}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="font-semibold mb-2">Manufacturer</h2>
                <div>{request.manufacturer}</div>
              </div>
            </div>

            {/* Location, Estimated Time, Work Type */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <h2 className="font-semibold mb-2">Location</h2>
                <div className="items-center flex">
                  <div className="bg-sky-100 border border-blue-300 h-8 w-8 flex items-center justify-center rounded-lg mr-2">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-49.svg"
                      alt="Icon"
                      className="h-[18px] w-[18px]"
                    />
                  </div>
                  <div className="text-sm">{request.locationName}</div>
                </div>
              </div>
              <div>
                <h2 className="font-semibold mb-2">Estimated Time</h2>
                <div>{request.estimatedTime}</div>
              </div>
              <div>
                <h2 className="font-semibold mb-2">Work Type</h2>
                <div>{request.workType}</div>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Categories */}
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                <span className="items-center bg-gray-50 inline-flex px-2 py-1 rounded border border-gray-50">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/image-1.svg"
                    className="h-2.5 w-2.5 mr-1 rounded-full"
                    alt="Category"
                  />
                  {request.categories}
                </span>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Schedule Conditions */}
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Schedule conditions</h2>
              <p className="mb-3">This Work Order will repeat based on time.</p>
              <div className="items-center flex gap-2 mb-3">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-50.svg"
                  alt="Icon"
                  className="h-5 w-5"
                />
                {request.scheduleConditions}
              </div>
              <div className="text-gray-600 text-sm">
                Created automatically
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Time & Cost Tracking */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Time & Cost Tracking</h2>
              <div className="border-b border-zinc-200 py-3 flex justify-between">
                <h4 className="font-semibold">Time</h4>
                <div className="text-blue-500 font-medium">{request.timeTracked}</div>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2">
              <div>Requested by Jason Degg on 26/02/2025, 08:41</div>
              <div>Created by Pedro Modesto on 04/03/2025, 11:03</div>
              <div>Completed by Pedro Modesto on 05/03/2025, 08:53</div>
              <div>Last updated on {new Date(request.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
