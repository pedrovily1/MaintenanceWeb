export type NavItemProps = {
  title: string;
  href: string;
  iconSrc: string;
  label: string;
  linkVariant: string;
  iconClassName: string;
};

export const NavItem = (props: NavItemProps) => {
  return (
    <li title={props.title} className="box-border caret-transparent shrink-0">
      <a
        href={props.href}
        className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr ${props.linkVariant}`}
      >
        <img src={props.iconSrc} alt="Icon" className={props.iconClassName} />
        <span className="box-border caret-transparent block basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
          {props.label}
        </span>
      </a>
    </li>
  );
};
