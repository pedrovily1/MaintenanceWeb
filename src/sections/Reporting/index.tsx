export const Reporting = () => {
  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Reporting
            </h2>
            <div className="box-border caret-transparent shrink-0">
              <button
                type="button"
                className="items-start bg-transparent caret-transparent gap-x-1 flex shrink-0 justify-between gap-y-1 text-center p-2 rounded-bl rounded-br rounded-tl rounded-tr"
              >
                <span className="box-border caret-transparent flex text-nowrap">
                  03/12/2025 - 21/01/2026
                </span>
              </button>
            </div>
            <button
              type="button"
              className="text-blue-500 font-medium items-center bg-transparent caret-transparent flex shrink-0 justify-center text-center px-2 py-1 rounded-bl rounded-br rounded-tl rounded-tr hover:bg-gray-100"
            >
              Date Presets
            </button>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              Organizations
            </button>
            <button
              type="button"
              className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
            >
              Export
            </button>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              Build report
            </button>
          </div>
        </div>
      </div>

      <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent flex shrink-0 flex-wrap border-b px-4">
        <button
          type="button"
          className="text-blue-500 font-semibold bg-transparent border-b-blue-500 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b"
        >
          Work Orders
        </button>
        <button
          type="button"
          className="text-gray-600 bg-transparent border-b-zinc-200 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50"
        >
          Asset Health
        </button>
        <button
          type="button"
          className="text-gray-600 bg-transparent border-b-zinc-200 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50"
        >
          Reporting Details
        </button>
        <button
          type="button"
          className="text-gray-600 bg-transparent border-b-zinc-200 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50"
        >
          Recent Activity
        </button>
        <button
          type="button"
          className="text-gray-600 bg-transparent border-b-zinc-200 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50"
        >
          Export Data
        </button>
        <button
          type="button"
          className="text-gray-600 bg-transparent border-b-zinc-200 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50"
        >
          Custom Dashboards
        </button>
      </div>

      <div className="box-border caret-transparent shrink-0 px-4 py-3">
        <div className="items-center box-border caret-transparent flex shrink-0">
          <div className="box-border caret-transparent flex basis-[0%] grow gap-x-2">
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              Assigned To
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              Due Date
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              Location
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              Priority
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              Add Filter
            </button>
          </div>
          <button
            type="button"
            className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300 ml-2"
          >
            My Filters
          </button>
        </div>
      </div>

      <div className="box-border caret-transparent flex basis-[0%] grow overflow-auto px-4 pb-8">
        <div className="box-border caret-transparent w-full">
          <h2 className="text-[20.0004px] font-semibold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[28.0006px] mb-4">
            Work Orders
          </h2>

          <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-zinc-200 rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                className="text-blue-500 font-medium text-lg hover:text-blue-400"
              >
                Created vs. Completed
              </button>
              <button
                type="button"
                className="text-blue-500 font-medium text-sm hover:text-blue-400"
              >
                Add to Dashboard
              </button>
            </div>
            <div className="flex items-start gap-8 mb-6">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">51</div>
                  <div className="text-blue-500 border border-blue-500 px-3 py-1 rounded text-sm">
                    Created
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">52</div>
                  <div className="text-teal-500 border border-teal-500 px-3 py-1 rounded text-sm">
                    Completed
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-5xl font-bold">
                  102.0<span className="text-2xl">%</span>
                </div>
                <div className="text-gray-600 mt-2">Percent Completed</div>
                <div className="text-gray-500 text-xs mt-1">
                  *More Work Orders were completed than created during this time period
                </div>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
              Chart visualization area
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-zinc-200 rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  className="text-blue-500 font-medium text-lg hover:text-blue-400"
                >
                  Work Orders by Type
                </button>
                <button
                  type="button"
                  className="text-blue-500 font-medium text-sm hover:text-blue-400"
                >
                  Add to Dashboard
                </button>
              </div>
              <div className="flex items-start gap-8 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">48</div>
                    <div className="text-teal-500 border border-teal-500 px-2 py-1 rounded text-xs">
                      Preventive
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-blue-500 border border-blue-500 px-2 py-1 rounded text-xs">
                      Reactive
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-400">0</div>
                    <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                      Cycle Count
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-400">0</div>
                    <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                      Other
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-4xl font-bold">
                    94.1<span className="text-xl">%</span>
                  </div>
                  <div className="text-gray-600 mt-2 text-sm">Total Preventive Ratio</div>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                Chart area
              </div>
            </div>

            <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-zinc-200 rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  className="text-blue-500 font-medium text-lg hover:text-blue-400"
                >
                  Non-Repeating vs. Repeating
                </button>
                <button
                  type="button"
                  className="text-blue-500 font-medium text-sm hover:text-blue-400"
                >
                  Add to Dashboard
                </button>
              </div>
              <div className="flex items-start gap-8 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-400">-</div>
                    <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                      Non-Repeating
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-400">-</div>
                    <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                      Repeating
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-4xl font-bold text-gray-400">
                    <span className="text-xl">%</span>
                  </div>
                  <div className="text-gray-600 mt-2 text-sm">Repeating Ratio</div>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                No data
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-zinc-200 rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-lg">Status</h4>
                <button
                  type="button"
                  className="text-blue-500 font-medium text-sm hover:text-blue-400"
                >
                  Add to Dashboard
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  Open: -
                </div>
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  On Hold: -
                </div>
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  In Progress: -
                </div>
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  Done: -
                </div>
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  Skipped/Canceled: -
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                No data
              </div>
            </div>

            <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent border border-zinc-200 rounded-bl rounded-br rounded-tl rounded-tr border-solid p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-lg">Priority</h4>
                <button
                  type="button"
                  className="text-blue-500 font-medium text-sm hover:text-blue-400"
                >
                  Add to Dashboard
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  None: -
                </div>
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  Low: -
                </div>
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  Medium: -
                </div>
                <div className="text-gray-400 border border-gray-400 px-2 py-1 rounded text-xs">
                  High: -
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                No data
              </div>
            </div>
          </div>

          <div className="bg-sky-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold mb-2">Looking for something else?</p>
            <p className="text-gray-600 mb-4">
              We would love to hear from you, share all your needs and suggestions for Reporting Dashboard.
            </p>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 inline-flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              Send Suggestions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
