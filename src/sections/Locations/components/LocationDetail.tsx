type LocationAsset = {
  id: string;
  name: string;
  imageUrl: string;
};

type LocationType = {
  id: string;
  name: string;
  description: string;
  address: string;
  subLocationsCount: number;
  assetsCount: number;
  assets: LocationAsset[];
};

type LocationDetailProps = {
  locationId: string | null;
  locations: LocationType[];
};

export const LocationDetail = ({ locationId, locations }: LocationDetailProps) => {
  if (!locationId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
            Select a location to view details
          </div>
        </div>
      </div>
    );
  }

  const location = locations.find(l => l.id === locationId);

  if (!location) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2 border-l border-[var(--border)]">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-red-500 bg-[var(--panel-2)]">
            Location not found
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
          <div className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-0">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <h3 className="text-xl font-semibold box-border caret-transparent tracking-[-0.2px] leading-7">
                  {location.name}
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
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
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
          </div>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6 pt-6">
            {/* Description */}
            {location.description && (
              <>
                <div className="box-border caret-transparent shrink-0 mb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">Description</h2>
                  <div className="box-border caret-transparent text-sm leading-relaxed text-gray-700">
                    {location.description}
                  </div>
                </div>
                <div className="border-b border-[var(--border)] my-3"></div>
              </>
            )}

            {/* Sub-Locations */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                Sub-Locations ({location.subLocationsCount})
              </h2>
              {location.subLocationsCount === 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-[var(--muted)] italic">
                    Add sub elements inside this Location
                  </p>
                  <a
                    href={`/locations/${location.id}/create`}
                    className="text-blue-500 text-xs font-bold uppercase tracking-wider hover:text-blue-400"
                  >
                    + Create Sub-Location
                  </a>
                </div>
              ) : (
                <a
                  href={`/locations/${location.id}/subs`}
                  className="text-blue-500 text-sm font-medium hover:underline"
                >
                  View {location.subLocationsCount} Sub-Locations →
                </a>
              )}
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Assets */}
            <div className="box-border caret-transparent shrink-0 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold mb-2">
                Assets ({location.assetsCount})
              </h2>
              {(!location.assets || location.assets.length === 0) ? (
                <div className="text-[var(--muted)] text-xs italic">No assets at this location</div>
              ) : (
                <div className="space-y-1">
                  {location.assets.map((asset) => (
                    <a
                      key={asset.id}
                      href={`/assets/${asset.id}`}
                      className="items-center box-border caret-transparent flex shrink-0 p-2 border border-[var(--border)] rounded hover:bg-gray-50 transition-colors group"
                    >
                      <div className="box-border caret-transparent shrink-0 mr-3">
                        <div className="items-center box-border caret-transparent flex shrink-0 h-7 justify-center w-7 border border-[var(--border)] overflow-hidden rounded border-solid">
                          <figure
                            className="bg-cover box-border caret-transparent shrink-0 h-full w-full bg-center"
                            style={{ backgroundImage: `url('${asset.imageUrl}')` }}
                          ></figure>
                        </div>
                      </div>
                      <div className="text-sm font-medium group-hover:text-blue-500 transition-colors">{asset.name}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-[var(--border)] my-3"></div>

            {/* Metadata */}
            <div className="text-[10px] text-[var(--muted)] space-y-1 mb-4 italic">
              <div className="flex items-center gap-2">
                Created By 
                <div className="items-center bg-white bg-[url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture15.png')] bg-cover box-border caret-transparent flex shrink-0 h-3 justify-center w-3 bg-center rounded-[50%]"></div>
                <a href="#" className="text-blue-500 hover:underline">Victor Garcia</a>
                <span>on 24/12/2024, 00:56</span>
              </div>
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
