export type CollapsibleNavItemProps = {
  iconUrl: string;
  label: string;
  badgeCount?: number;
  chevronIconUrl: string;
  onClick?: () => void;
  isExpanded?: boolean;
  items: Array<{
    title: string;
    href: string;
    label: string;
    badgeCount?: number;
  }>;
};

export const CollapsibleNavItem = (props: CollapsibleNavItemProps) => {
  return (
    <div className="box-border caret-transparent shrink-0">
      <button
        type="button"
        onClick={props.onClick}
        className="relative items-center bg-transparent caret-transparent gap-x-2 flex shrink-0 text-center w-full px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr hover:bg-gray-100"
      >
        <img
          src={props.iconUrl}
          alt="Icon"
          className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
        />
        <label className="box-border caret-transparent block basis-[0%] grow tracking-[-0.3px] leading-[19.6px] text-left text-ellipsis text-nowrap overflow-hidden cursor-pointer">
          {props.label}
        </label>
        {props.badgeCount && (
          <div className="text-white text-[10.0002px] font-semibold items-center bg-teal-500 box-border caret-transparent flex shrink-0 h-4 justify-center leading-[12.0002px] min-w-4 px-1 py-0.5 rounded-bl rounded-br rounded-tl rounded-tr">
            {props.badgeCount}
          </div>
        )}
        <img
          src={props.chevronIconUrl}
          alt="Icon"
          className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
        />
      </button>
      <div className={`box-border caret-transparent shrink-0 overflow-hidden transition-all ${props.isExpanded ? 'h-auto' : 'h-0'}`}>
        <div className="box-border caret-transparent flex shrink-0 gap-y-2 ml-4 pt-2">
          <div className="border-b-neutral-800 border-l-zinc-200 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 border-l"></div>
          <div className="box-border caret-transparent flex basis-[0%] flex-col grow gap-y-2 ml-2">
            {props.items.map((item, index) => (
              <li
                key={index}
                title={item.title}
                className="box-border caret-transparent shrink-0"
              >
                <a
                  href={item.href}
                  className="relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr hover:bg-gray-100"
                >
                  <span className="box-border caret-transparent block basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
                    {item.label}
                  </span>
                  {item.badgeCount && (
                    <div className="text-white text-[10.0002px] font-semibold items-center bg-teal-500 box-border caret-transparent flex shrink-0 h-4 justify-center leading-[12.0002px] min-w-4 break-words px-1 py-0.5 rounded-bl rounded-br rounded-tl rounded-tr">
                      {item.badgeCount}
                    </div>
                  )}
                </a>
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
