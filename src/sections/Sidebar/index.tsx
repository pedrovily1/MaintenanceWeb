import { SidebarHeader } from "@/sections/Sidebar/components/SidebarHeader";
import { SidebarNav } from "@/sections/Sidebar/components/SidebarNav";
import { SidebarFooter } from "@/sections/Sidebar/components/SidebarFooter";

type SidebarProps = {
  currentView: string;
};

export const Sidebar = ({ currentView }: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar - Full Width */}
      <div className="hidden lg:flex relative bg-gray-50 box-border caret-transparent flex-col shrink-0 w-[210px] z-[1] pt-6 px-4 h-screen sticky top-0">
        <SidebarHeader />
        <SidebarNav currentView={currentView} />
        <div className="mt-auto pb-2">
          <SidebarFooter />
        </div>
      </div>

      {/* Mobile/Tablet Sidebar - Collapsed (Icons Only) */}
      <div className="flex lg:hidden relative bg-gray-50 box-border caret-transparent flex-col shrink-0 w-[50px] z-[1] pt-6 px-2 h-screen sticky top-0 overflow-hidden">
        <SidebarHeader />
        <SidebarNav currentView={currentView} />
        <div className="mt-auto pb-2">
          <SidebarFooter />
        </div>
      </div>
    </>
  );
};
