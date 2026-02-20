import { UserProfile } from "@/sections/Sidebar/components/UserProfile";

export const SidebarFooter = () => {
  return (
    <div className="box-border caret-transparent shrink-0 border-t border-[var(--border)] opacity-85 mt-2">
      <div className="relative text-[12.6px] box-border caret-transparent flex shrink-0 leading-[15.12px]">
        <UserProfile />
      </div>
    </div>
  );
};
