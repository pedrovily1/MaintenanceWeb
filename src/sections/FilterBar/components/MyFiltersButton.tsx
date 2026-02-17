export const MyFiltersButton = () => {
  return (
    <div className="box-border caret-transparent flex shrink-0 max-w-[134px] overflow-hidden ml-2">
      <button
        type="button"
        className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 overflow-hidden px-1 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
      >
        <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-26.svg"
            alt="Icon"
            className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
          />
        </div>
        <div
          title="My Filters"
          className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1"
        >
          My Filters
        </div>
      </button>
    </div>
  );
};
