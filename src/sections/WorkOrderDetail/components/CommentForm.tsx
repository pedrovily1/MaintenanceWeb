export const CommentForm = () => {
  return (
    <div className="box-border caret-transparent shrink-0 mx-4 py-2">
      <div className="relative box-border caret-transparent shrink-0">
        <div className="box-border caret-transparent basis-[0%] grow">
          <div
            role="textbox"
            className="relative bg-white box-border caret-transparent shrink-0 leading-5 max-h-[478px] min-h-[78px] break-words overflow-x-hidden overflow-y-auto resize-y w-full border border-[var(--border)] mt-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
          >
            <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px]">
              <span className="box-border caret-transparent shrink-0">
                <span className="box-border caret-transparent shrink-0">
                  <span className="absolute box-border caret-transparent block shrink-0 max-w-full opacity-[0.333] pointer-events-none translate-y-[40.0%] w-full top-0">
                    Write a comment…
                  </span>
                  <span className="box-border caret-transparent shrink-0">
                    ﻿<br className="box-border caret-transparent shrink-0" />
                  </span>
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="box-border caret-transparent flex shrink-0 justify-end mt-2">
        <button
          type="button"
          className="relative text-blue-500 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap px-2 rounded-bl rounded-br rounded-tl rounded-tr hover:text-blue-400 hover:border-blue-400"
        >
          <span className="box-border caret-transparent flex shrink-0 text-nowrap">
            <img
              src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-54.svg"
              alt="Icon"
              className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
            />
          </span>
        </button>
        <input
          type="file"
          className="text-neutral-600 items-baseline bg-transparent box-border caret-transparent hidden shrink-0 text-ellipsis text-nowrap p-0"
        />
        <div className="box-border caret-transparent shrink-0 mr-2"></div>
        <div className="box-border caret-transparent shrink-0 min-w-[50%] md:min-w-[auto]">
          <button
            type="submit"
            className="relative text-slate-400 font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-[var(--border)] px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
          >
            <span className="box-border caret-transparent flex shrink-0 text-nowrap">
              Send
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
