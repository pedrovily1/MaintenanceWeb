import { useState } from "react";
import { MeterList } from "./components/MeterList";
import { MeterDetail } from "./components/MeterDetail";

export const Meters = () => {
  const [selectedMeterId, setSelectedMeterId] = useState<string | null>("294355");

  const meters = [
    {
      id: "294355",
      name: "Generator Hours",
      assetName: "Generator",
      locationName: "SSF - Slovakia",
      lastReading: "69.1 Hours",
      unit: "Hours"
    }
  ];

  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Meters
            </h2>
            <div className="box-border caret-transparent shrink-0 pt-2">
              <button
                type="button"
                className="items-start bg-transparent caret-transparent gap-x-1 flex shrink-0 justify-between gap-y-1 text-center p-2 rounded-bl rounded-br rounded-tl rounded-tr"
              >
                <div className="items-center box-border caret-transparent flex h-full text-ellipsis text-nowrap overflow-hidden">
                  <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px] text-nowrap">
                      Panel View
                    </p>
                  </div>
                </div>
                <div className="box-border caret-transparent shrink-0">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-21.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-[7px] w-3 -scale-100"
                  />
                </div>
              </button>
            </div>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search Meters"
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
            >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                Manage Integrations
              </span>
            </button>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
            >
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                New Meter
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="box-border caret-transparent shrink-0 px-4 py-3">
        <div className="items-center box-border caret-transparent flex shrink-0">
          <div className="box-border caret-transparent flex basis-[0%] grow gap-x-2">
            <button
              type="button"
              className="items-center bg-sky-100 text-blue-500 caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-blue-500 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-sky-200"
            >
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Type
              </div>
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Asset
              </div>
            </button>
            <button
              type="button"
              className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
            >
              <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1">
                Location
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <MeterList
          meters={meters}
          selectedMeterId={selectedMeterId}
          onSelectMeter={setSelectedMeterId}
        />
        <MeterDetail meterId={selectedMeterId} />
      </div>
    </div>
  );
};
