export const StatusButtons = () => {
  return (
    <div className="box-border caret-transparent shrink-0">
      <div className="items-center box-border caret-transparent flex shrink-0 flex-wrap lg:flex-nowrap gap-2 lg:gap-0">
        <button
          type="button"
          className="text-white text-[10px] lg:text-[11.2px] items-center bg-blue-500 caret-transparent flex fill-white flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[60px] border border-blue-500 lg:mr-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-blue-400"
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-41.svg"
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6"
          />
          <div className="text-[12.6px] font-medium box-border caret-transparent fill-white shrink-0 leading-[15.12px] text-nowrap mt-1">
            Open
          </div>
        </button>
        <button
          type="button"
          className="text-blue-500 text-[10px] lg:text-[11.2px] items-center bg-white caret-transparent flex fill-blue-500 flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[60px] border border-zinc-200 lg:mr-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-gray-50"
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-42.svg"
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6"
          />
          <div className="text-[12.6px] font-medium box-border caret-transparent fill-blue-500 shrink-0 leading-[15.12px] text-nowrap mt-1">
            On Hold
          </div>
        </button>
        <button
          type="button"
          className="text-blue-500 text-[10px] lg:text-[11.2px] items-center bg-white caret-transparent flex fill-blue-500 flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[60px] border border-zinc-200 lg:mr-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-gray-50"
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-43.svg"
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6"
          />
          <div className="text-[12.6px] font-medium box-border caret-transparent fill-blue-500 shrink-0 leading-[15.12px] text-nowrap mt-1">
            In Progress
          </div>
        </button>
        <button
          type="button"
          className="text-blue-500 text-[10px] lg:text-[11.2px] items-center bg-white caret-transparent flex fill-blue-500 flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[60px] border border-zinc-200 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-gray-50"
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-44.svg"
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6"
          />
          <div className="text-[12.6px] font-medium box-border caret-transparent fill-blue-500 shrink-0 leading-[15.12px] text-nowrap mt-1">
            Done
          </div>
        </button>
      </div>
    </div>
  );
};
