import { Part, getTotalStock, needsRestock } from '@/types/part';
import { EntityThumbnail } from '@/components/EntityThumbnail';

type PartListProps = {
  parts: Part[];
  selectedPartId: string | null;
  onSelectPart: (id: string) => void;
};

export const PartList = ({ parts, selectedPartId, onSelectPart }: PartListProps) => {
  return (
    <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-[var(--border)] mr-4 rounded-tl rounded-tr border-solid">
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
        {parts.length === 0 && (
          <div className="flex items-center justify-center h-32 text-[var(--muted)] text-sm italic">
            No parts found.
          </div>
        )}
        {parts.map((part) => {
          const total = getTotalStock(part);
          const restock = needsRestock(part);
          const primaryLocation = part.inventory[0]?.locationName ?? '—';

          return (
            <div
              key={part.id}
              onClick={() => onSelectPart(part.id)}
              className={`relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[98px] cursor-pointer hover:bg-[var(--panel-2)] even:bg-[rgba(255,255,255,0.02)] border-l-2 transition-colors ${
                selectedPartId === part.id ? "bg-[var(--panel-2)] border-l-[var(--accent)]" : "border-l-transparent"
              } group`}
            >
              <EntityThumbnail
                imageUrl={part.imageUrl}
                alt={part.name}
                fallbackIcon={
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-10.svg"
                    alt="Icon"
                    className={`box-border caret-transparent shrink-0 h-[18px] w-[18px] transition-opacity ${selectedPartId === part.id ? 'opacity-100' : 'group-hover:opacity-100'}`}
                  />
                }
                className="h-12 w-12 ml-4 mr-3"
              />

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
                  <div className="box-border caret-transparent shrink-0 flex items-center gap-1">
                    <span className={`text-sm font-medium ${restock ? 'text-amber-600' : 'text-gray-600'}`}>
                      {total} {part.unit || 'unit'}{total !== 1 ? 's' : ''}
                    </span>
                    {restock && (
                      <span className="bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wide px-1 py-0.5 rounded">
                        Low
                      </span>
                    )}
                  </div>
                </div>
                <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                  <div className="text-gray-600 text-[12.6px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
                    At {primaryLocation}
                    {part.inventory.length > 1 && (
                      <span className="text-blue-500 ml-1">+{part.inventory.length - 1} more</span>
                    )}
                  </div>
                </div>
                <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-px">
                  <div className="text-gray-500 text-[11px] box-border caret-transparent basis-[0%] grow text-ellipsis text-nowrap w-full overflow-hidden">
                    {part.partType}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
