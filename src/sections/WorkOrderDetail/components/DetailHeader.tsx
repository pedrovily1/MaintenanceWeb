import { ActionButtons } from "@/components/ActionButtons";

export const DetailHeader = () => {
  return (
    <header className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-3 lg:py-4 border-b">
      <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 px-2 lg:px-4">
        <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
          <div className="box-border caret-transparent">
            <div className="box-border caret-transparent gap-x-1 flex gap-y-1 flex-wrap lg:flex-nowrap">
              <h3 className="text-lg lg:text-[20.0004px] font-semibold box-border caret-transparent tracking-[-0.2px] leading-tight lg:leading-[28.0006px]">
                Weekly Maintenance Service
              </h3>
              <button
                title="Copy Link"
                type="button"
                className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-[50%] hover:text-blue-400 hover:border-blue-400"
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
            <div className="items-center box-border caret-transparent gap-x-1 flex h-[18px] gap-y-1">
              <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-36.svg"
                  alt="Icon"
                  className="text-blue-500 box-border caret-transparent h-3.5 w-3.5"
                />
                <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                  Weekly
                </span>
              </div>
              <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                <span className="box-border caret-transparent flex mr-px">
                  <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                    -
                  </span>
                </span>
                <img
                  src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-37.svg"
                  alt="Icon"
                  className="box-border caret-transparent h-3.5 w-3.5"
                />
                <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                  Overdue since 06/02/2026
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <ActionButtons
            variant=""
            primaryButtonHref="https://app.getmaintainx.com/workorders/84658821/comments"
            primaryButtonIcon="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-38.svg"
            primaryButtonText="Comments"
            secondaryButtonHref="https://app.getmaintainx.com/workorders/84658821/edit"
            secondaryButtonIcon="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-39.svg"
            secondaryButtonText="Edit"
            tertiaryButtonIcon="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
          />
        </div>
      </div>
    </header>
  );
};
