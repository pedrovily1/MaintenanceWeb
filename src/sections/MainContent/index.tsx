import { useState, useEffect } from "react";
import { Header } from "@/sections/Header";
import { FilterBar } from "@/sections/FilterBar";
import { WorkOrderList } from "@/sections/WorkOrderList";
import { CalendarView } from "@/sections/Calendar/CalendarView";

export const MainContent = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.viewMode) setViewMode(e.detail.viewMode);
    };
    window.addEventListener('change-work-order-view', handler as EventListener);
    return () => window.removeEventListener('change-work-order-view', handler as EventListener);
  }, []);

  return (
    <div className="bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] grow isolate overflow-x-hidden overflow-y-auto">
      <div className="box-border caret-transparent flex basis-[0%] flex-col grow overflow-hidden">
        <Header />
        <div className="box-border caret-transparent shrink-0"></div>
        <FilterBar />
        {viewMode === 'list' ? <WorkOrderList /> : <CalendarView />}
      </div>
    </div>
  );
};
