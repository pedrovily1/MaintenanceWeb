export const LocationSelector = () => {
  return (
    <button
      type="button"
      className="items-center bg-white caret-transparent gap-x-2 flex shrink-0 justify-between gap-y-2 text-left w-full border border-zinc-200 mb-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
    >
      <img
        src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg"
        alt="Icon"
        className="box-border caret-transparent shrink-0 h-[15px] w-[15px]"
      />
      <span className="box-border caret-transparent block basis-[0%] grow text-ellipsis text-nowrap overflow-hidden">
        CWS - Slovakia
      </span>
      <div className="self-stretch bg-zinc-200 box-border caret-transparent shrink-0 w-px"></div>
      <div className="items-center box-border caret-transparent flex shrink-0">
        <img
          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-3.svg"
          alt="Icon"
          className="text-blue-500 box-border caret-transparent shrink-0 h-5 w-5"
        />
      </div>
    </button>
  );
};
