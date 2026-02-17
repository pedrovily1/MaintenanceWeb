export const OutstandingSection = () => {
  return (
    <div className="box-border caret-transparent shrink-0 h-[246px]">
      <div className="box-border caret-transparent flex flex-col shrink-0">
        <div className="box-border caret-transparent shrink-0">
          <div className="relative box-border caret-transparent grow border border-zinc-200 mt-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="box-border caret-transparent flex shrink-0 justify-start">
              <div className="box-border caret-transparent grow-[4] w-full p-4">
                <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                  <div className="box-border caret-transparent w-full">
                    <label className="box-border caret-transparent shrink-0 break-words">
                      Outstanding Items:
                    </label>
                  </div>
                </div>
                <div className="absolute box-border caret-transparent shrink-0 right-2 top-2"></div>
                <div className="box-border caret-transparent shrink-0 mt-4">
                  <div className="box-border caret-transparent flex flex-col shrink-0 gap-y-0">
                    <div className="self-start box-border caret-transparent shrink-0"></div>
                    <div className="box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2">
                      <textarea
                        placeholder="Enter Text"
                        className="bg-transparent box-border caret-transparent flex shrink-0 h-10 tracking-[-0.2px] leading-[20.0004px] max-h-[220px] min-h-10 w-full border-zinc-200 px-3 py-[9px] rounded-bl rounded-br rounded-tl rounded-tr"
                      >
                        None
                      </textarea>
                    </div>
                  </div>
                  <div className="items-center box-border caret-transparent flex shrink-0"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative box-border caret-transparent grow border border-zinc-200 mt-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="box-border caret-transparent flex shrink-0 justify-start">
              <div className="box-border caret-transparent grow-[4] w-full p-4">
                <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                  <div className="box-border caret-transparent w-full">
                    <label className="box-border caret-transparent shrink-0 break-words">
                      Customer Comments:
                    </label>
                  </div>
                </div>
                <div className="absolute box-border caret-transparent shrink-0 right-2 top-2"></div>
                <div className="box-border caret-transparent shrink-0 mt-4">
                  <div className="box-border caret-transparent flex flex-col shrink-0 gap-y-0">
                    <div className="self-start box-border caret-transparent shrink-0"></div>
                    <div className="box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2">
                      <textarea
                        placeholder="Enter Text"
                        className="bg-transparent box-border caret-transparent flex shrink-0 h-10 tracking-[-0.2px] leading-[20.0004px] max-h-[220px] min-h-10 w-full border-zinc-200 px-3 py-[9px] rounded-bl rounded-br rounded-tl rounded-tr"
                      >
                        None
                      </textarea>
                    </div>
                  </div>
                  <div className="items-center box-border caret-transparent flex shrink-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
