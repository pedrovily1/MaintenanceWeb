type PartDetailProps = {
  partId: string | null;
};

export const PartDetail = ({ partId }: PartDetailProps) => {
  if (!partId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
            Select a part to view details
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          {/* Header */}
          <header className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4 border-b">
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
                    <span className="text-gray-600 text-sm box-border caret-transparent block italic">
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
            <div className="bg-[var(--panel-2)] border-b-[var(--border)] border-l-transparent border-r-transparent border-t-transparent box-border caret-transparent flex shrink-0 flex-wrap border-b px-4">
              <button
                type="button"
                className="text-[var(--accent)] border-b-[var(--accent)] border-l-transparent border-r-transparent border-t-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all"
              >
                Details
              </button>
              <button
                type="button"
                className="text-[var(--muted)] border-b-transparent border-l-transparent border-r-transparent border-t-transparent caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b-2 hover:bg-[var(--panel)] transition-all"
              >
                History
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 p-6 pt-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Minimum in Stock */}
              <div className="box-border caret-transparent shrink-0">
                <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Minimum in Stock</h2>
                <span className="text-sm font-medium">1 unit</span>
              </div>

              {/* Available Quantity */}
              <div className="box-border caret-transparent shrink-0">
                <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-1">Available Quantity</h2>
                <span className="text-sm font-medium">1 unit</span>
              </div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Location Table */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Location</h2>
              <div className="border border-[var(--border)] rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--panel-2)] border-b border-[var(--border)]">
                    <tr>
                      <th className="text-left font-medium text-[var(--muted)] px-3 py-2 uppercase tracking-tight opacity-[0.85]">Location</th>
                      <th className="text-left font-medium text-[var(--muted)] px-3 py-2 uppercase tracking-tight opacity-[0.85]">Area</th>
                      <th className="text-center font-medium text-[var(--muted)] px-3 py-2 uppercase tracking-tight opacity-[0.85]">In Stock</th>
                      <th className="text-center font-medium text-[var(--muted)] px-3 py-2 uppercase tracking-tight opacity-[0.85]">Min</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--border)] hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                            alt="Icon"
                            className="h-3 w-3"
                          />
                          <a href="#" className="text-blue-500 hover:underline font-medium">
                            General Storage
                          </a>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-500">—</td>
                      <td className="px-3 py-2 text-center font-medium">1</td>
                      <td className="px-3 py-2 text-center text-gray-500">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* QR Code/Barcode */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">QR Code/Barcode</h2>
              <div className="bg-[var(--panel-2)] border border-dashed border-[var(--border)] rounded p-4 text-center">
                <p className="text-xs text-[var(--muted)] mb-2 italic">
                  Attach a code to this Part so you can scan and find it easily
                </p>
                <a href="#" className="text-blue-500 text-xs font-bold hover:text-blue-400 uppercase tracking-widest">
                  + Add QR Code/Barcode
                </a>
              </div>
            </div>

            {/* Assets */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Assets (1)</h2>
              <div className="border border-[var(--border)] rounded p-2 hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 border border-blue-300 h-7 w-7 flex items-center justify-center rounded-lg">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
                      alt="Icon"
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex-1">
                    <a href="#" className="text-sm font-medium group-hover:text-blue-500 transition-colors">
                      Overhead Sliding door
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Metadata */}
            <div className="text-[10px] text-[var(--muted)] space-y-1 mb-4 italic">
              <div className="flex items-center gap-2">
                Created By 
                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-3 justify-center w-3 bg-center rounded-[50%]"></div>
                <a href="#" className="text-blue-500 hover:underline">Pedro Modesto</a>
                <span>on 01/08/2025, 09:22</span>
              </div>
              <div className="flex items-center gap-2">
                Last updated By
                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png')] bg-cover box-border caret-transparent flex shrink-0 h-3 justify-center w-3 bg-center rounded-[50%]"></div>
                <a href="#" className="text-blue-500 hover:underline">Pedro Modesto</a>
                <span>on 09/12/2025, 11:52</span>
              </div>
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Work Order History */}
            <div className="box-border caret-transparent shrink-0">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Work Order History</h2>
              <div className="text-[var(--muted)] text-xs italic">No work order history</div>
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
