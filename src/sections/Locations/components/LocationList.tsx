import { useMemo } from 'react';
import { EntityThumbnail } from '@/components/EntityThumbnail';

type LocationType = {
  id: string;
  name: string;
  address: string;
  parentLocationId: string | null;
  subLocationsCount: number;
  imageUrl?: string;
};

type LocationListProps = {
  locations: LocationType[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
};

type FlatNode = LocationType & { depth: number };

export const LocationList = ({ locations, selectedLocationId, onSelectLocation }: LocationListProps) => {
  // Build tree-ordered flat list for rendering with indentation
  const flatTree = useMemo(() => {
    const result: FlatNode[] = [];
    const buildTree = (parentId: string | null, depth: number) => {
      const children = locations.filter(l =>
        parentId === null ? !l.parentLocationId : l.parentLocationId === parentId
      );
      for (const child of children) {
        result.push({ ...child, depth });
        buildTree(child.id, depth + 1);
      }
    };
    buildTree(null, 0);
    // If search filtered breaks tree structure, show flat with depth 0
    if (result.length === 0 && locations.length > 0) {
      return locations.map(l => ({ ...l, depth: 0 }));
    }
    return result;
  }, [locations]);

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

      {/* Location List */}
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br">
        {flatTree.map((location) => (
          <div
            key={location.id}
            onClick={() => onSelectLocation(location.id)}
            className={`relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-[var(--panel-2)] even:bg-[rgba(255,255,255,0.02)] border-l-2 transition-colors ${
              selectedLocationId === location.id ? "bg-[var(--panel-2)] border-l-[var(--accent)]" : "border-l-transparent"
            } group`}
            style={{ paddingLeft: `${location.depth * 24}px` }}
          >
            <EntityThumbnail
              imageUrl={location.imageUrl}
              alt={location.name}
              fallbackIcon={
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
                  alt="Icon"
                  className={`box-border caret-transparent shrink-0 h-[18px] w-[18px] transition-opacity ${selectedLocationId === location.id ? 'opacity-100' : 'group-hover:opacity-100'}`}
                />
              }
              className={`h-12 w-12 ml-4 mr-3 ${location.depth > 0 ? 'scale-90' : ''}`}
            />

            <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3 pr-4">
              <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                  <div
                    title={location.name}
                    className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                  >
                    {location.depth > 0 && <span className="text-gray-300 mr-1">{'└'}</span>}
                    {location.name}
                  </div>
                </div>
              </div>
              {location.address && (
                <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                  <div className="text-[var(--muted)] text-[13px] box-border caret-transparent text-ellipsis text-nowrap overflow-hidden opacity-80">
                    {location.address}
                  </div>
                </div>
              )}
              {location.subLocationsCount > 0 && (
                <div className="items-center box-border caret-transparent flex shrink-0 my-1">
                  <span className="text-blue-500 text-[13px] box-border caret-transparent flex items-center gap-1 opacity-90">
                    {location.subLocationsCount} Sub-Locations
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
