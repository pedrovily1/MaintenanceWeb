type LocationType = {
  id: string;
  name: string;
  address: string;
  subLocationsCount: number;
};

type LocationListProps = {
  locations: LocationType[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
};

export const LocationList = ({ locations, selectedLocationId, onSelectLocation }: LocationListProps) => {
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

      {/* Location List */}
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br">
        {locations.map((location) => (
          <div
            key={location.id}
            onClick={() => onSelectLocation(location.id)}
            className={`relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-gray-50 ${
              selectedLocationId === location.id ? "bg-slate-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3">
              <div className="items-center bg-sky-100 box-border caret-transparent flex shrink-0 h-12 justify-center w-12 border border-blue-300 rounded-lg">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                  alt="Icon"
                  className="text-blue-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
                />
              </div>
            </div>

            <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3 pr-4">
              <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                  <div
                    title={location.name}
                    className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                  >
                    {location.name}
                  </div>
                </div>
              </div>
              {location.address && (
                <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                  <div className="text-gray-600 text-[12.6px] box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    {location.address}
                  </div>
                </div>
              )}
              {location.subLocationsCount > 0 && (
                <div className="items-center box-border caret-transparent flex shrink-0 my-1">
                  <a
                    href={`/locations/${location.id}/subs`}
                    className="text-blue-500 text-[12.6px] box-border caret-transparent flex items-center gap-1 hover:text-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {location.subLocationsCount} Sub-Locations
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-51.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-[5px] rotate-90 w-2"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
