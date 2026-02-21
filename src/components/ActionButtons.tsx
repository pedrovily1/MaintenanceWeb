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
          className="relative text-white font-bold items-center bg-accent caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-accent px-4 rounded-md border-solid hover:bg-blue-400 hover:border-accent"
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
      </div>
    );
  }

  return (
    <div className="box-border caret-transparent flex shrink-0 items-center gap-x-2 flex-wrap gap-y-2 ml-auto">
      <a
        href={props.primaryButtonHref}
        className="text-accent box-border caret-transparent block shrink-0 break-words"
      >
        <button
          type="button"
          className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-white hover:bg-accent hover:border-accent"
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
          className="text-accent box-border caret-transparent shrink-0 break-words"
        >
          <button
            type="button"
            className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:text-white hover:bg-accent hover:border-accent"
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
          className="relative text-accent font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-bl rounded-br rounded-tl rounded-tr hover:text-white hover:bg-accent hover:border-accent"
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
