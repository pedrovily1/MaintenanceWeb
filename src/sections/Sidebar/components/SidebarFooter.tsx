import { SupportButton } from "@/sections/Sidebar/components/SupportButton";
import { UserProfile } from "@/sections/Sidebar/components/UserProfile";

export const SidebarFooter = () => {
  return (
    <div className="box-border caret-transparent shrink-0">
      {/* Support Button - Hidden on mobile/tablet */}
      <div className="hidden lg:block relative text-[12.6px] box-border caret-transparent shrink-0 leading-[15.12px]">
        <SupportButton />
      </div>
      
      <hr className="text-zinc-500 bg-zinc-200 caret-transparent shrink-0 h-px w-full my-2" />
      
      <div className="relative text-[12.6px] box-border caret-transparent flex shrink-0 leading-[15.12px]">
        <UserProfile />
      </div>
    </div>
  );
};
