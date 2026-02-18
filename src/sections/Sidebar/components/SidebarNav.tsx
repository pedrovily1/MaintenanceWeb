import { useState } from "react";
import { ProceduresNavBadge } from './ProceduresNavBadge';
import { NavItem } from "@/sections/Sidebar/components/NavItem";
import { CollapsibleNavItem } from "@/sections/Sidebar/components/CollapsibleNavItem";

type SidebarNavProps = {
  currentView: string;
};

export const SidebarNav = ({ currentView }: SidebarNavProps) => {
  const [isProceduresExpanded, setIsProceduresExpanded] = useState(false);
  return (
    <ul className="[mask-image:linear-gradient(rgb(252,252,253)_calc(100%_-_16px),rgba(0,0,0,0)_100%)] relative box-border caret-transparent flex basis-[0%] flex-col grow list-none overflow-x-hidden overflow-y-auto gap-y-2 lg:-mr-3 pl-0 lg:pr-1.5 pb-2">
      <li title="Work Orders" className="box-border caret-transparent shrink-0">
        <a
          href="/workorders"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'workorders' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-4.svg"
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Work Orders
          </span>
        </a>
      </li>
      <li title="Reporting" className="box-border caret-transparent shrink-0">
        <a
          href="/reporting"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'reporting';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'reporting' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-5.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Reporting
          </span>
        </a>
      </li>
      <li title="Requests" className="box-border caret-transparent shrink-0">
        <a
          href="/requests"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'requests';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'requests' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-6.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Requests
          </span>
        </a>
      </li>
      <li title="Assets" className="box-border caret-transparent shrink-0">
        <a
          href="/assets"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'assets';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'assets' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-7.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Assets
          </span>
        </a>
      </li>
      <li title="Messages" className="box-border caret-transparent shrink-0">
        <a
          href="/messages"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'messages';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'messages' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-8.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Messages
          </span>
        </a>
      </li>
      <li className="box-border caret-transparent shrink-0">
        <hr className="text-zinc-500 bg-zinc-200 caret-transparent shrink-0 h-px w-full" />
      </li>
      <li title="Categories" className="box-border caret-transparent shrink-0">
        <a
          href="/categories"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'categories';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'categories' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-9.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Categories
          </span>
        </a>
      </li>
      <li title="Parts" className="box-border caret-transparent shrink-0">
        <a
          href="/parts"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'parts';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'parts' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-10.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Parts
          </span>
        </a>
      </li>
      <li title="Procedures" className="box-border caret-transparent shrink-0">
        <a
          href="/procedures"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'procedures';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'procedures' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <div className="relative">
            <img
              src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-12.svg"
              alt="Icon"
              className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
            />
            <ProceduresNavBadge className="lg:hidden absolute -top-1 -right-1 text-white text-[8px] font-semibold items-center bg-blue-500 box-border caret-transparent flex shrink-0 h-3 w-3 justify-center rounded-full" />
          </div>
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Procedures
          </span>
          <ProceduresNavBadge className="hidden lg:flex text-white text-[10.0002px] font-semibold items-center bg-blue-500 box-border caret-transparent shrink-0 h-4 justify-center leading-[12.0002px] min-w-4 px-1 py-0.5 rounded-bl rounded-br rounded-tl rounded-tr" />
        </a>
      </li>
      <li title="Meters" className="box-border caret-transparent shrink-0">
        <a
          href="/meters"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'meters';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'meters' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-13.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Meters
          </span>
        </a>
      </li>
      <li title="Locations" className="box-border caret-transparent shrink-0">
        <a
          href="/locations"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'locations';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'locations' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-15.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Locations
          </span>
        </a>
      </li>
      <li title="Teams / Users" className="box-border caret-transparent shrink-0">
        <a
          href="/users"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'users';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'users' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-16.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Teams / Users
          </span>
        </a>
      </li>
      <li title="Vendors" className="box-border caret-transparent shrink-0">
        <a
          href="/vendors"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'vendors';
          }}
          className={`relative items-center box-border caret-transparent gap-x-2 flex shrink-0 break-words lg:px-2 py-1.5 rounded-bl rounded-br rounded-tl rounded-tr justify-center lg:justify-start ${
            currentView === 'vendors' ? 'text-blue-500 bg-sky-100' : 'hover:bg-gray-100'
          }`}
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-17.svg"
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-[18px] w-[18px]"
          />
          <span className="hidden lg:block box-border caret-transparent basis-[0%] grow tracking-[-0.3px] leading-[19.6px] break-words text-ellipsis text-nowrap overflow-hidden">
            Vendors
          </span>
        </a>
      </li>
    </ul>
  );
};
