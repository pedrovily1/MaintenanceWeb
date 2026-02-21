export const FloatingButton = () => {
  return (
    <div className="absolute box-border caret-transparent shrink-0 translate-x-[-50.0%] z-[3] left-2/4 bottom-6">
      <button
        type="button"
        className="relative text-teal-500 font-bold items-center bg-[var(--panel)] shadow-[rgba(30,36,41,0.16)_0px_4px_12px_0px] caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-teal-500 px-4 rounded-3xl border-solid hover:text-teal-400 hover:border-teal-400"
      >
        <img
          src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-55.svg"
          alt="Icon"
          className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
        />
        <span className="box-border caret-transparent flex shrink-0 text-nowrap">
          View Procedure
        </span>
      </button>
    </div>
  );
};
