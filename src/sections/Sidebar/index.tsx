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
      <div className="hidden lg:flex relative omp-panel-secondary box-border caret-transparent flex-col shrink-0 w-[210px] z-[1] pt-6 h-screen sticky top-0 border-r border-[var(--border)]">
        <SidebarHeader />
        <div className="px-4 flex-col flex grow">
          <SidebarNav currentView={currentView} />
          <div className="mt-auto pb-2">
            <SidebarFooter />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Sidebar - Collapsed (Icons Only) */}
      <div className="flex lg:hidden relative omp-panel-secondary box-border caret-transparent flex-col shrink-0 w-[50px] z-[1] pt-6 px-2 h-screen sticky top-0 overflow-hidden border-r border-[var(--border)]">
        <SidebarHeader />
        <SidebarNav currentView={currentView} />
        <div className="mt-auto pb-2">
          <SidebarFooter />
        </div>
      </div>
    </>
  );
};
