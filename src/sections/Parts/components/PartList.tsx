type Part = {
  id: string;
  name: string;
  quantity: string;
  location: string;
  assetName: string;
  imageUrl?: string;
};

type PartListProps = {
  parts: Part[];
  selectedPartId: string | null;
  onSelectPart: (id: string) => void;
};

export const PartList = ({ parts, selectedPartId, onSelectPart }: PartListProps) => {
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

      {/* Part List */}
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br rounded-tl rounded-tr">
        {parts.map((part) => (
          <div
            key={part.id}
            onClick={() => onSelectPart(part.id)}
            className={`relative items-center border-b border-zinc-200 box-border caret-transparent flex shrink-0 min-h-[98px] cursor-pointer hover:bg-gray-50 ${
              selectedPartId === part.id ? "bg-slate-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3 rounded-lg">
              <div
                title={part.name}
                className="text-[16.0006px] font-semibold items-center box-border caret-transparent flex shrink-0 h-12 justify-center tracking-[-0.2px] w-12 border border-zinc-200 overflow-hidden rounded-lg border-solid"
              >
                {part.imageUrl ? (
                  <figure
                    className="bg-cover box-border caret-transparent shrink-0 h-12 w-12 bg-center"
                    style={{ backgroundImage: `url('${part.imageUrl}')` }}
                  ></figure>
                ) : (
                  <span className="text-blue-500 box-border caret-transparent flex shrink-0">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-10.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-[18px] w-[18px]"
                    />
                  </span>
                )}
              </div>
            </div>

            <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3">
              <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                  <div
                    title={part.name}
                    className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                  >
                    {part.name}
                  </div>
                </div>
                <div className="box-border caret-transparent shrink-0">
                  <span className="text-gray-600 text-sm">{part.quantity}</span>
                </div>
              </div>
              <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                <div className="text-gray-600 text-[12.6px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
                  At {part.location}
                </div>
              </div>
              <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-px">
                <div className="text-gray-600 text-[12.6px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
                  For {part.assetName}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
