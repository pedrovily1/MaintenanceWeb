import { useState } from "react";
import { PartList } from "./components/PartList";
import { PartDetail } from "./components/PartDetail";

export const Parts = () => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>("11131762");

  const parts = [
    {
      id: "11131762",
      name: "CANIMEX INC Counterbalance Assembly",
      quantity: "1 unit",
      location: "General Storage",
      assetName: "Overhead Sliding door",
      imageUrl: undefined
    },
    {
      id: "13650391",
      name: "Filter, HVAC",
      quantity: "1 unit",
      location: "General Storage",
      assetName: "HVAC",
      imageUrl: "https://app.getmaintainx.com/img/9f9fdbd5-f2d1-4812-a1dc-3ef3a1a82e64_75198044-FBEF-4161-90A6-76667875E21D.HEIC?w=96&h=96&rmode=crop"
    },
    {
      id: "11131767",
      name: "FSTRONIC IRC-F1-4A Model 074 Control Panel",
      quantity: "1 unit",
      location: "General Storage",
      assetName: "Horizontal Sliding Door",
      imageUrl: undefined
    },
    {
      id: "10078392",
      name: "Generator Annual Service Kit",
      quantity: "1 unit",
      location: "General Storage",
      assetName: "Generator",
      imageUrl: undefined
    },
    {
      id: "11131761",
      name: "GfA ELEKTROMATEN TS 970 Motor",
      quantity: "1 unit",
      location: "General Storage",
      assetName: "Overhead Sliding door",
      imageUrl: undefined
    },
    {
      id: "12901637",
      name: "PSN50W036T2",
      quantity: "1 unit",
      location: "General Storage",
      assetName: "0-GENERAL PURPOSE",
      imageUrl: undefined
    }
  ];

  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Parts
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search Parts"
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-[var(--border)] bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <div className="relative box-border caret-transparent flex shrink-0">
              <button
                type="button"
                className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-md border-solid hover:bg-blue-400 hover:border-blue-400"
              >
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-22.svg"
                  alt="Icon"
                  className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                />
                <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                  New Part
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="box-border caret-transparent shrink-0 mb-4 mx-4">
        <div className="items-center box-border caret-transparent flex shrink-0">
          <div className="box-border caret-transparent flex basis-[0%] grow">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 gap-y-2">
              <div className="items-center box-border caret-transparent flex shrink-0">
                <button
                  type="button"
                  className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] overflow-hidden px-1 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-24.svg"
                      alt="Icon"
                      className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                    />
                  </div>
                  <div
                    title="Needs Restock"
                    className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1"
                  >
                    Needs Restock
                  </div>
                </button>
              </div>
              <div className="items-center box-border caret-transparent flex shrink-0">
                <button
                  type="button"
                  className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] overflow-hidden px-1 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-25.svg"
                      alt="Icon"
                      className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                    />
                  </div>
                  <div
                    title="Part Types"
                    className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1"
                  >
                    Part Types
                  </div>
                </button>
              </div>
              <div className="items-center box-border caret-transparent flex shrink-0">
                <button
                  type="button"
                  className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] overflow-hidden px-1 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-25.svg"
                      alt="Icon"
                      className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                    />
                  </div>
                  <div
                    title="Location"
                    className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1"
                  >
                    Location
                  </div>
                </button>
              </div>
              <div className="items-center box-border caret-transparent flex shrink-0">
                <button
                  type="button"
                  className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] overflow-hidden px-1 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-25.svg"
                      alt="Icon"
                      className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                    />
                  </div>
                  <div
                    title="Add Filter"
                    className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1"
                  >
                    Add Filter
                  </div>
                </button>
              </div>
            </div>
            <div className="items-center box-border caret-transparent flex shrink-0 ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[var(--border)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                <span className="ml-2 text-sm">Show per Location</span>
              </label>
            </div>
          </div>
          <div className="box-border caret-transparent flex shrink-0 max-w-[134px] overflow-hidden ml-2">
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] overflow-hidden px-1 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-26.svg"
                  alt="Icon"
                  className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
                />
              </div>
              <div
                title="My Filters"
                className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1"
              >
                My Filters
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <PartList
          parts={parts}
          selectedPartId={selectedPartId}
          onSelectPart={setSelectedPartId}
        />
        <PartDetail partId={selectedPartId} />
      </div>
    </div>
  );
};
