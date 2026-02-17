export const SortControls = () => {
  return (
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
                    Priority
                  </span>
                  : Highest First
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
      <button
        type="button"
        className="text-slate-500 bg-transparent caret-transparent block shrink-0 text-center mr-3 px-0 hover:text-gray-600"
      >
        <img
          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-28.svg"
          alt="Icon"
          className="box-border caret-transparent shrink-0 h-5 w-5"
        />
      </button>
    </div>
  );
};
