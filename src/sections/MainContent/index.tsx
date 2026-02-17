import { Header } from "@/sections/Header";
import { FilterBar } from "@/sections/FilterBar";
import { WorkOrderList } from "@/sections/WorkOrderList";

export const MainContent = () => {
  return (
    <div className="box-border caret-transparent flex basis-[0%] grow isolate overflow-x-hidden overflow-y-auto">
      <div className="box-border caret-transparent flex basis-[0%] flex-col grow overflow-hidden">
        <Header />
        <div className="box-border caret-transparent shrink-0"></div>
        <FilterBar />
        <WorkOrderList />
      </div>
    </div>
  );
};
