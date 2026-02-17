export const ViewSelector = () => {
  return (
    <button
      type="button"
      className="items-start bg-transparent caret-transparent gap-x-1 flex shrink-0 justify-between gap-y-1 text-center p-2 rounded-bl rounded-br rounded-tl rounded-tr"
    >
      <div className="items-center box-border caret-transparent flex h-full text-ellipsis text-nowrap overflow-hidden">
        <img
          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-20.svg"
          alt="Icon"
          className="text-slate-500 box-border caret-transparent shrink-0 h-5 text-nowrap w-5 mr-1.5"
        />
        <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
          <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px] text-nowrap">
            To Do View
          </p>
        </div>
      </div>
      <div className="box-border caret-transparent shrink-0">
        <img
          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-21.svg"
          alt="Icon"
          className="box-border caret-transparent shrink-0 h-[7px] w-3 -scale-100"
        />
      </div>
    </button>
  );
};
