import { SidebarLogo } from "@/sections/Sidebar/components/SidebarLogo";
import { LocationSelector } from "@/sections/Sidebar/components/LocationSelector";

export const SidebarHeader = () => {
  return (
    <div className="box-border caret-transparent grid shrink-0 gap-y-2 mb-3">
      {/* Logo - Hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <SidebarLogo />
      </div>
      
      {/* Logo Icon Only - Visible on mobile/tablet */}
      <div className="hidden lg:hidden flex items-center justify-center mb-2">
        <img
          alt="CWS - Slovakia"
          src="https://app.getmaintainx.com/img/93eafef8-3c18-48b5-a95a-2a8d545d9ac5_Chenega-Logo-Simplified-4C.png?w=512&h=512"
          className="box-border caret-transparent shrink-0 h-8 w-8 rounded"
        />
      </div>

      <div className="absolute box-border caret-transparent hidden shrink-0 border border-solid border-transparent right-4">
        <button
          type="button"
          className="items-center bg-zinc-200 caret-transparent flex fill-slate-500 shrink-0 h-8 justify-center opacity-50 text-center w-8 z-[1] rounded-bl rounded-br rounded-tl rounded-tr"
        >
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-1.svg"
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-6 w-6"
          />
        </button>
      </div>
      
      {/* Location Selector - Hidden on mobile/tablet */}
      <div className="hidden lg:flex items-center box-border caret-transparent basis-[0%] grow max-w-full -mb-2 py-2">
        <LocationSelector />
      </div>
    </div>
  );
};
