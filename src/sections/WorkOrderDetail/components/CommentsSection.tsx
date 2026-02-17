import { CommentForm } from "@/sections/WorkOrderDetail/components/CommentForm";
import { CommentList } from "@/sections/WorkOrderDetail/components/CommentList";

export const CommentsSection = () => {
  return (
    <div className="box-border caret-transparent shrink-0 mt-5">
      <div className="relative box-border caret-transparent flex basis-[0%] flex-col grow w-full">
        <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent shrink-0 mt-3 mx-6 border-b"></div>
        <div className="items-center box-border caret-transparent flex shrink-0 justify-between leading-8 pt-6 pb-2 px-6">
          <div className="box-border caret-transparent grow">
            <div className="items-center box-border caret-transparent flex shrink-0 min-h-[40.8px]">
              <div className="box-border caret-transparent grow shrink-0 break-words w-0">
                <h1 className="text-[20.0004px] font-medium box-border caret-transparent grow tracking-[-0.2px] break-words">
                  Comments
                </h1>
              </div>
            </div>
          </div>
        </div>
        <form className="box-border caret-transparent shrink-0 px-2">
          <CommentForm />
        </form>
        <div className="relative box-border caret-transparent overflow-x-hidden overflow-y-auto pr-2 pt-2 pb-12 md:pb-0">
          <CommentList />
        </div>
      </div>
    </div>
  );
};
