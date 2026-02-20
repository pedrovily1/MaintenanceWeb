export const IssuesSection = () => {
  return (
    <div className="box-border caret-transparent shrink-0 h-[806px]">
      <div className="box-border caret-transparent flex flex-col shrink-0">
        <div className="box-border caret-transparent shrink-0">
          <div className="relative box-border caret-transparent grow border border-[var(--border)] mt-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="box-border caret-transparent flex shrink-0 justify-start">
              <div className="box-border caret-transparent grow-[4] w-full p-4">
                <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                  <div className="box-border caret-transparent w-full">
                    <label className="box-border caret-transparent shrink-0 break-words">
                      Failure Detected During:
                    </label>
                  </div>
                </div>
                <div className="absolute box-border caret-transparent shrink-0 right-2 top-2"></div>
                <div className="box-border caret-transparent shrink-0 mt-4">
                  <ul className="box-border caret-transparent shrink-0 list-none mt-3.5 pl-0">
                    <li className="box-border caret-transparent shrink-0">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Scheduled Maintenance"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Scheduled Maintenance
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Handling"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Handling
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Normal Operation"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Normal Operation
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Test"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Test
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Storage"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Storage
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Inspection"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Inspection
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Other"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Other
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="relative box-border caret-transparent grow border border-[var(--border)] mt-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="box-border caret-transparent flex shrink-0 justify-start">
              <div className="box-border caret-transparent grow-[4] w-full p-4">
                <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                  <div className="box-border caret-transparent w-full">
                    <label className="box-border caret-transparent shrink-0 break-words">
                      First Indication of Trouble:
                    </label>
                  </div>
                </div>
                <div className="absolute box-border caret-transparent shrink-0 right-2 top-2"></div>
                <div className="box-border caret-transparent shrink-0 mt-4">
                  <ul className="box-border caret-transparent shrink-0 list-none mt-3.5 pl-0">
                    <li className="box-border caret-transparent shrink-0">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Inoperative"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Inoperative
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Overheating"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Overheating
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Out of Adjustment"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Out of Adjustment
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Noise"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Noise
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Low Performance"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Low Performance
                        </span>
                      </label>
                    </li>
                    <li className="box-border caret-transparent shrink-0 mt-4">
                      <label className="items-center box-border caret-transparent flex shrink-0">
                        <input
                          type="radio"
                          value="Other"
                          className="relative text-neutral-600 box-border caret-transparent block shrink-0 h-4 w-4 border-[var(--border)] p-0 rounded-[50%] border-solid"
                        />
                        <span className="box-border caret-transparent block grow break-words w-0 ml-2">
                          Other
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="relative box-border caret-transparent grow border border-[var(--border)] mt-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="box-border caret-transparent flex shrink-0 justify-start">
              <div className="box-border caret-transparent grow-[4] w-full p-4">
                <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                  <div className="box-border caret-transparent w-full">
                    <label className="box-border caret-transparent shrink-0 break-words">
                      Describe issue, troubleshooting, current state and next
                      steps
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
                        className="bg-transparent box-border caret-transparent flex shrink-0 h-10 tracking-[-0.2px] leading-[20.0004px] max-h-[220px] min-h-10 w-full border-[var(--border)] px-3 py-[9px] rounded-bl rounded-br rounded-tl rounded-tr"
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
          <div className="relative box-border caret-transparent grow border border-[var(--border)] mt-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid">
            <div className="box-border caret-transparent flex shrink-0 justify-start">
              <div className="box-border caret-transparent grow-[4] w-full p-4">
                <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                  <div className="box-border caret-transparent w-full">
                    <label className="box-border caret-transparent shrink-0 break-words">
                      Comments or Remarks: (Include Date/Time)
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
                        className="bg-transparent box-border caret-transparent flex shrink-0 h-10 tracking-[-0.2px] leading-[20.0004px] max-h-[220px] min-h-10 w-full border-[var(--border)] px-3 py-[9px] rounded-bl rounded-br rounded-tl rounded-tr"
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
