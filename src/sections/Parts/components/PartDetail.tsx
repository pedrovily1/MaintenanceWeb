type PartDetailProps = {
  partId: string | null;
};

export const PartDetail = ({ partId }: PartDetailProps) => {
  if (!partId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select a part to view details
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
                      CANIMEX INC Counterbalance Assembly
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
                    <span className="text-gray-600 text-sm box-border caret-transparent block">
                      1 unit in stock
                    </span>
                  </div>
                </div>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Restock
                  </span>
                </button>
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

            {/* Tabs */}
            <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent flex shrink-0 flex-wrap border-b px-4">
              <button
                type="button"
                className="text-blue-500 font-semibold bg-transparent border-b-blue-500 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b"
              >
                Details
              </button>
              <button
                type="button"
                className="text-gray-600 bg-transparent border-b-zinc-200 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50"
              >
                History
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 p-6">
            {/* Minimum in Stock */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Minimum in Stock</h2>
              <span>1 unit</span>
            </div>

            {/* Available Quantity */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Available Quantity</h2>
              <span>1 unit</span>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Location Table */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Location</h2>
              <div className="border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-zinc-200">
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">Location</th>
                      <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">Area</th>
                      <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">Units in Stock</th>
                      <th className="text-left text-sm font-medium text-gray-600 px-4 py-3">Minimum in Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                            alt="Icon"
                            className="h-4 w-4 text-blue-500"
                          />
                          <a href="#" className="text-blue-500 hover:text-blue-400">
                            General Storage
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600"></td>
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* QR Code/Barcode */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">QR Code/Barcode</h2>
              <div className="bg-gray-50 border border-zinc-200 rounded p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Attach a code to this Part so you can scan and find it easily
                </p>
                <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-400">
                  Add QR Code/Barcode
                </a>
              </div>
            </div>

            {/* Assets */}
            <div className="box-border caret-transparent shrink-0 mb-6">
              <h2 className="text-base font-semibold mb-3">Assets (1)</h2>
              <div className="border border-zinc-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 border border-blue-300 h-8 w-8 flex items-center justify-center rounded-lg">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
                      alt="Icon"
                      className="h-[18px] w-[18px]"
                    />
                  </div>
                  <div className="flex-1">
                    <a href="#" className="text-blue-500 hover:text-blue-400">
                      Overhead Sliding door
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <div className="flex items-center gap-2">
                Created By 
                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"></div>
                <a href="#" className="text-blue-500 hover:underline">Pedro Modesto</a>
                <span>on 01/08/2025, 09:22</span>
              </div>
              <div className="flex items-center gap-2">
                Last updated By
                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-4 justify-center w-4 bg-center rounded-[50%]"></div>
                <a href="#" className="text-blue-500 hover:underline">Pedro Modesto</a>
                <span>on 09/12/2025, 11:52</span>
              </div>
            </div>

            <div className="border-b border-zinc-200 my-4"></div>

            {/* Work Order History */}
            <div className="box-border caret-transparent shrink-0">
              <h2 className="text-base font-medium mb-3">Work Order History</h2>
              <div className="text-gray-500 text-sm">No work order history</div>
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
