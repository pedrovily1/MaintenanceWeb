type Meter = {
  id: string;
  name: string;
  assetName: string;
  locationName: string;
  lastReading: string;
  unit: string;
};

type MeterListProps = {
  meters: Meter[];
  selectedMeterId: string | null;
  onSelectMeter: (id: string) => void;
};

export const MeterList = ({ meters, selectedMeterId, onSelectMeter }: MeterListProps) => {
  return (
    <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-zinc-200 mr-4 rounded-tl rounded-tr border-solid">
      {/* Sort Controls */}
      <div className="relative items-center border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent flex shrink-0 h-12 justify-between z-[1] border-b">
        <div className="box-border caret-transparent flex basis-[0%] grow p-3">
          <div className="relative text-[12.6px] box-border caret-transparent flex basis-[0%] grow leading-[15.12px]">
            <div className="box-border caret-transparent basis-[0%] grow">
              <button
                type="button"
                className="text-gray-600 text-sm items-center bg-transparent caret-transparent flex shrink-0 leading-[16.8px] max-w-full text-center"
              >
                Sort By:
                <div className="text-blue-500 items-center box-border caret-transparent flex basis-[0%] grow stroke-blue-500">
                  <span className="box-border caret-transparent block basis-[0%] grow stroke-blue-500 text-ellipsis text-nowrap overflow-hidden ml-1">
                    <span className="font-semibold box-border caret-transparent shrink-0 stroke-blue-500 text-nowrap">
                      Name
                    </span>
                    : Ascending Order
                  </span>
                  <div className="box-border caret-transparent shrink-0 stroke-blue-500 ml-1 mb-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-27.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-[5px] w-2 -scale-100"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meter List */}
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br rounded-tl rounded-tr">
        {meters.map((meter) => (
          <div
            key={meter.id}
            onClick={() => onSelectMeter(meter.id)}
            className={`relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[98px] cursor-pointer hover:bg-gray-50 ${
              selectedMeterId === meter.id ? "bg-slate-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3 rounded-lg">
              <div className="items-center bg-white box-border caret-transparent flex shrink-0 h-12 justify-center w-12 border border-zinc-200 rounded-full">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-13.svg"
                  alt="Icon"
                  className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
                />
              </div>
            </div>

            <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3 pr-4">
              <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                  <div
                    title={meter.name}
                    className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                  >
                    {meter.name}
                  </div>
                </div>
              </div>
              <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                <div className="text-gray-600 text-[12.6px] box-border caret-transparent flex items-center gap-1">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
                    alt="Icon"
                    className="text-slate-500 box-border caret-transparent shrink-0 h-3.5 w-3.5"
                  />
                  {meter.assetName}
                </div>
              </div>
              <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-px">
                <div className="text-gray-600 text-[12.6px] box-border caret-transparent flex items-center gap-1">
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                    alt="Icon"
                    className="text-slate-500 box-border caret-transparent shrink-0 h-3.5 w-3.5"
                  />
                  {meter.locationName}
                </div>
                <div className="text-gray-600 text-[12.6px] box-border caret-transparent shrink-0">
                  Last Reading: {meter.lastReading}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
