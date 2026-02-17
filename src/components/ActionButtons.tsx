export type ActionButtonsProps = {
  variant: string;
  primaryButtonText?: string;
  primaryButtonIcon?: string;
  primaryButtonHref?: string;
  secondaryButtonIcon?: string;
  secondaryButtonAriaLabel?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  tertiaryButtonIcon?: string;
  tertiaryButtonHref?: string;
};

export const ActionButtons = (props: ActionButtonsProps) => {
  if (props.variant === "new-work-order") {
    return (
      <div className="box-border caret-transparent flex shrink-0 relative">
        <button
          type="button"
          className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-tl border-solid hover:bg-blue-400 hover:border-blue-400"
        >
          <img
            src={props.primaryButtonIcon}
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
          />
          <span className="box-border caret-transparent flex shrink-0 text-nowrap">
            {props.primaryButtonText}
          </span>
        </button>
        <button
          aria-label={props.secondaryButtonAriaLabel}
          type="button"
          className="relative text-white font-bold items-center aspect-square bg-blue-500 border-b-blue-500 border-l-zinc-200 border-r-blue-500 border-t-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border overflow-hidden p-2 rounded-br rounded-tr border-solid hover:bg-blue-400 hover:border-b-blue-400 hover:border-r-blue-400 hover:border-t-blue-400"
        >
          <span className="box-border caret-transparent flex shrink-0 text-nowrap">
            <img
              src={props.secondaryButtonIcon}
              alt="Icon"
              className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
            />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="box-border caret-transparent flex shrink-0 items-center gap-x-2 flex-wrap gap-y-2 ml-auto">
      <a
        href={props.primaryButtonHref}
        className="text-blue-500 box-border caret-transparent block shrink-0 break-words"
      >
        <button
          type="button"
          className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
        >
          <img
            src={props.primaryButtonIcon}
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
          />
          <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
            {props.primaryButtonText}
          </span>
        </button>
      </a>
      <div className="box-border caret-transparent shrink-0">
        <a
          href={props.secondaryButtonHref}
          className="text-blue-500 box-border caret-transparent shrink-0 break-words"
        >
          <button
            type="button"
            className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-blue-400 hover:border-blue-400"
          >
            <img
              src={props.secondaryButtonIcon}
              alt="Icon"
              className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
            />
            <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
              {props.secondaryButtonText}
            </span>
          </button>
        </a>
      </div>
      <div className="relative box-border caret-transparent shrink-0">
        <button
          type="button"
          className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-bl rounded-br rounded-tl rounded-tr hover:text-blue-400 hover:border-blue-400"
        >
          <span className="box-border caret-transparent flex shrink-0 text-nowrap">
            <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-gray-600 hover:border-gray-600">
              <img
                src={props.tertiaryButtonIcon}
                alt="Icon"
                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
              />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};
