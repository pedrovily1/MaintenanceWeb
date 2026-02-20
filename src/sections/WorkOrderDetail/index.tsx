import { DetailHeader } from "@/sections/WorkOrderDetail/components/DetailHeader";
import { DetailContent } from "@/sections/WorkOrderDetail/components/DetailContent";
import { FloatingButton } from "@/components/FloatingButton";

export const WorkOrderDetail = () => {
  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
          <div className="relative box-border caret-transparent flex flex-col grow w-full">
            <div className="box-border caret-transparent shrink-0">
              <DetailHeader />
            </div>
            <DetailContent />
            <FloatingButton />
          </div>
        </div>
      </div>
    </div>
  );
};
