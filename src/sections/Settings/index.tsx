export const Settings = () => {
  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
        <h1 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
          General
        </h1>
      </div>

      {/* Content */}
      <div className="box-border caret-transparent flex flex-col grow px-4 pb-8">
        {/* Organization Summary */}
        <section className="bg-white box-border caret-transparent shrink-0 border border-zinc-200 rounded-lg p-6 mb-4">
          <div className="flex items-start gap-6">
            <div className="box-border caret-transparent shrink-0">
              <div
                className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-[104px] justify-center w-[104px] bg-center rounded-lg border border-zinc-200"
                style={{ backgroundImage: "url('https://app.getmaintainx.com/img/93eafef8-3c18-48b5-a95a-2a8d545d9ac5_Chenega-Logo-Simplified-4C.png?w=512&h=512')" }}
              ></div>
            </div>
            <div className="box-border caret-transparent flex flex-col grow">
              <h2 className="text-2xl font-semibold mb-2 text-ellipsis overflow-hidden">
                CWS - Slovakia
              </h2>
              <div className="text-gray-600 mb-1">
                1155 Kelly Johnson Boulevard, Suite 105, Colorado Springs, CO, 80920, US
              </div>
              <div className="text-gray-600 mb-2">Other | 6 Members</div>
              <div className="inline-flex items-center">
                <span className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded">
                  Enterprise Plan
                </span>
              </div>
            </div>
            <div className="box-border caret-transparent shrink-0">
              <button
                type="button"
                className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white box-border caret-transparent shrink-0 border border-zinc-200 rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-semibold mb-6">Preferences</h2>
          
          <div className="space-y-6">
            {/* Organization Language */}
            <div className="flex items-center">
              <label className="text-sm font-medium w-48">Organization Language</label>
              <div className="flex-1 max-w-md">
                <div className="relative items-center bg-white box-border caret-transparent flex shrink-0 h-10 justify-between w-full border border-zinc-200 rounded px-3">
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    English (Default)
                  </div>
                  <div className="text-blue-500 box-border caret-transparent flex shrink-0">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-47.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-center">
              <label className="text-sm font-medium w-48">Currency</label>
              <div className="flex-1 max-w-md">
                <div className="relative items-center bg-white box-border caret-transparent flex shrink-0 h-10 justify-between w-full border border-zinc-200 rounded px-3">
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    USD (US Dollar)
                  </div>
                  <div className="text-blue-500 box-border caret-transparent flex shrink-0">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-47.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date Format */}
            <div className="flex items-center">
              <label className="text-sm font-medium w-48">Date Format</label>
              <div className="flex-1 max-w-md">
                <div className="relative items-center bg-white box-border caret-transparent flex shrink-0 h-10 justify-between w-full border border-zinc-200 rounded px-3">
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    MM/DD/YYYY – 11:59 PM
                  </div>
                  <div className="text-blue-500 box-border caret-transparent flex shrink-0">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-47.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Time Zone */}
            <div className="flex items-center">
              <label className="text-sm font-medium w-48">Time Zone</label>
              <div className="flex-1 max-w-md">
                <div className="relative items-center bg-white box-border caret-transparent flex shrink-0 h-10 justify-between w-full border border-zinc-200 rounded px-3">
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    Europe/Belgrade : +01:00
                  </div>
                  <div className="text-blue-500 box-border caret-transparent flex shrink-0">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-47.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Export Data */}
        <section className="bg-white box-border caret-transparent shrink-0 border border-zinc-200 rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-semibold mb-6">Export Data</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <a
              href="/settings/export/workorders"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-4.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Work Orders</p>
            </a>
            <a
              href="/settings/export/assets"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Assets</p>
            </a>
            <a
              href="/settings/export/assetStatus"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Asset Status</p>
            </a>
            <a
              href="/settings/export/locations"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Locations</p>
            </a>
            <a
              href="/settings/export/parts"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-10.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Parts List</p>
            </a>
            <a
              href="/settings/export/partTransactions"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-10.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Parts Transactions</p>
            </a>
            <a
              href="/settings/export/meters"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-13.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Meters</p>
            </a>
            <a
              href="/settings/export/readings"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-13.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Readings</p>
            </a>
            <a
              href="/settings/export/vendors"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-17.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Vendors</p>
            </a>
            <a
              href="/settings/export/timeAndCost"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-4.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Time & Cost Tracking</p>
            </a>
            <a
              href="/settings/export/laborUtilization"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-4.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Labor Utilization</p>
            </a>
          </div>
        </section>

        {/* Import Data */}
        <section className="bg-white box-border caret-transparent shrink-0 border border-zinc-200 rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-semibold mb-6">Import Data</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <a
              href="/imports/assets"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Assets</p>
            </a>
            <a
              href="/imports/parts"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-10.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Parts</p>
            </a>
            <a
              href="/imports/workorders"
              className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-4.svg"
                alt="Icon"
                className="text-blue-500 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-sm font-medium">Work Orders</p>
            </a>
            <div className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-lg opacity-50 cursor-not-allowed">
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-25.svg"
                alt="Icon"
                className="text-gray-400 box-border caret-transparent shrink-0 h-8 w-8 mb-3"
              />
              <p className="text-xs text-gray-500">Other items soon</p>
            </div>
          </div>
        </section>

        {/* Build Version */}
        <div className="text-xs text-gray-500 mt-4">
          <div title="Version: 26.1.532-310241&#10;Backend Version: 26.1.532-310241">
            Build: 26.1.532-310241
          </div>
        </div>
      </div>
    </div>
  );
};
