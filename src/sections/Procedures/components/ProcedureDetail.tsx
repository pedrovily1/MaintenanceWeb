import { useState } from "react";

type ProcedureDetailProps = {
  procedureId: string | null;
};

export const ProcedureDetail = ({ procedureId }: ProcedureDetailProps) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'details' | 'history'>('fields');

  if (!procedureId) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select a procedure to view details
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-hidden w-full">
          {/* Header */}
          <header className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <img
                  src="data:image/svg+xml,%3csvg%20width='48'%20height='48'%20fill='none'%20viewBox='0%200%2048%2048'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M47.5%2024c0%2012.979-10.521%2023.5-23.5%2023.5S.5%2036.979.5%2024%2011.021.5%2024%20.5%2047.5%2011.021%2047.5%2024z'%20fill='%23FAFDFF'%20stroke='%23E7F3FE'/%3e%3cpath%20d='M16.25%2019.815c0-4.336%203.617-7.815%208.034-7.815%204.416%200%208.033%203.48%208.033%207.815%200%204.335-3.617%207.814-8.034%207.814-4.416%200-8.033-3.479-8.033-7.814zm8.034-6.426c-3.69%200-6.645%202.896-6.645%206.426%200%203.529%202.955%206.425%206.645%206.425%203.689%200%206.644-2.896%206.644-6.425%200-3.53-2.955-6.426-6.645-6.426zm-9.9%2018.632a.87.87%200%2000.883-.857.87.87%200%2000-.884-.857.87.87%200%2000-.883.857.87.87%200%2000.883.857zm19.96-.148H17.773a.7.7%200%2001-.71-.69.7.7%200%2001.71-.688h16.571a.7.7%200%2001.71.689.7.7%200%2001-.71.689zm-19.077%203.27a.87.87%200%2001-.884.857.87.87%200%2001-.883-.857.87.87%200%2001.883-.857.87.87%200%2001.884.857zm19.077.709H17.773a.7.7%200%2001-.71-.69.7.7%200%2001.71-.688h16.571a.7.7%200%2001.71.689.7.7%200%2001-.71.689zM20.841%2020.088a.568.568%200%2001.804-.02l1.372%201.307%203.845-4.677a.568.568%200%2011.878.722l-4.233%205.15a.568.568%200%2001-.83.05l-1.816-1.728a.569.569%200%2001-.02-.804z'%20fill-rule='evenodd'%20clip-rule='evenodd'%20fill='%23CAE1F8'/%3e%3c/svg%3e"
                  alt="Procedure Icon"
                  className="h-8 w-8"
                />
                <h3 className="text-xl font-medium box-border caret-transparent tracking-[-0.2px]">
                  Annual Fire Extinguisher Inspection
                </h3>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
                >
                  <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                    Edit
                  </span>
                </button>
                <button
                  type="button"
                  className="relative text-blue-500 font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded hover:text-blue-400"
                >
                  <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap hover:text-gray-600">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
                    />
                  </span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent flex shrink-0 flex-wrap border-b">
              <button
                type="button"
                onClick={() => setActiveTab('fields')}
                className={`${
                  activeTab === 'fields'
                    ? 'text-blue-500 font-semibold border-b-blue-500'
                    : 'text-gray-600 border-b-zinc-200'
                } bg-transparent border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50`}
              >
                Fields
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`${
                  activeTab === 'details'
                    ? 'text-blue-500 font-semibold border-b-blue-500'
                    : 'text-gray-600 border-b-zinc-200'
                } bg-transparent border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'text-blue-500 font-semibold border-b-blue-500'
                    : 'text-gray-600 border-b-zinc-200'
                } bg-transparent border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50`}
              >
                History
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4 px-6 py-4">
            {activeTab === 'fields' && (
              <>
                {/* Pre-Inspection Section */}
                <h2 className="text-lg font-semibold mb-4">Pre-Inspection</h2>
                
                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Check that the fire extinguisher is mounted correctly and securely.
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Pass
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Flag
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Fail
                    </button>
                  </div>
                </div>

                {/* Inspection Section */}
                <h2 className="text-lg font-semibold mb-4 mt-6">Inspection</h2>
                
                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Confirm that the fire extinguisher has been inspected by a certified third-party professional.
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      No
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      N/A
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Ensure that the inspection tag is replaced with a new tag showing the current date.
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Pass
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Flag
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Fail
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Upload the photos of the new inspection tags.
                  </label>
                  <div className="bg-gray-50 border border-zinc-200 rounded p-4 text-center text-sm text-gray-500">
                    Assignees will add a Picture/File here
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Check that the pressure gauge is in the operable range (green zone).
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Pass
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Flag
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Fail
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Inspect the extinguisher for any physical damage, corrosion, leakage, or clogged nozzle.
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Pass
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Flag
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Fail
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Ensure the safety pin is intact and the tamper seal is unbroken.
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Pass
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Flag
                    </button>
                    <button
                      type="button"
                      disabled
                      className="border border-zinc-200 px-4 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
                    >
                      Fail
                    </button>
                  </div>
                </div>

                {/* Post-Inspection Section */}
                <h2 className="text-lg font-semibold mb-4 mt-6">Post-Inspection</h2>
                
                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Document any issues found during the inspection.
                  </label>
                  <textarea
                    disabled
                    placeholder="Enter Text"
                    className="bg-transparent box-border caret-transparent flex shrink-0 h-10 tracking-[-0.2px] leading-[20.0004px] max-h-[220px] min-h-10 w-full border border-zinc-200 px-3 py-[9px] rounded-bl rounded-br rounded-tl rounded-tr resize-none"
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Technician Signature
                  </label>
                  <div className="bg-gray-50 border border-zinc-200 rounded p-4 text-center text-sm text-gray-500">
                    Assignees will sign here
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 text-sm">
                    Print Name
                  </label>
                  <textarea
                    disabled
                    placeholder="Enter Text"
                    className="bg-transparent box-border caret-transparent flex shrink-0 h-10 tracking-[-0.2px] leading-[20.0004px] max-h-[220px] min-h-10 w-full border border-zinc-200 px-3 py-[9px] rounded-bl rounded-br rounded-tl rounded-tr resize-none"
                  ></textarea>
                </div>
              </>
            )}

            {activeTab === 'details' && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg font-medium mb-2">Procedure Details</p>
                <p className="text-sm">Details about this procedure will appear here</p>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg font-medium mb-2">Work Order History</p>
                <p className="text-sm">No work order history</p>
              </div>
            )}
          </div>

          {/* Floating Button */}
          <div className="absolute box-border caret-transparent shrink-0 translate-x-[-50.0%] z-[3] left-2/4 bottom-6">
            <button
              type="button"
              className="relative text-blue-500 font-bold items-center bg-white shadow-[rgba(30,36,41,0.16)_0px_4px_12px_0px] caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-3xl border-solid hover:text-blue-400 hover:border-blue-400"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-55.svg"
                alt="Icon"
                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
              />
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                Use in New Work Order
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
