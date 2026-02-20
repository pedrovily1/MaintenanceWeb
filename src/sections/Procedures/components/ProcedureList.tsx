type Procedure = {
  id: string;
  name: string;
  fieldCount: string;
  category?: string;
  isGlobal?: boolean;
  isFeatured?: boolean;
  isMyTemplate?: boolean;
};

type ProcedureListProps = {
  procedures: Procedure[];
  selectedProcedureId: string | null;
  onSelectProcedure: (id: string) => void;
};

export const ProcedureList = ({ procedures, selectedProcedureId, onSelectProcedure }: ProcedureListProps) => {
  const myTemplates = procedures.filter(p => p.isMyTemplate);
  const allProcedures = procedures.filter(p => !p.isMyTemplate);

  return (
    <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-[var(--border)] mr-4 rounded-tl rounded-tr border-solid">
      {/* Sort Controls */}
      <div className="relative items-center border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent flex shrink-0 h-12 justify-between z-[1] border-b">
        <div className="box-border caret-transparent flex basis-[0%] grow p-3">
          <div className="relative text-[12.6px] box-border caret-transparent flex basis-[0%] grow leading-[15.12px] opacity-[0.85]">
            <div className="box-border caret-transparent basis-[0%] grow">
              <button
                type="button"
                className="text-gray-600 text-sm items-center bg-transparent caret-transparent flex shrink-0 leading-[16.8px] max-w-full text-center font-medium"
              >
                Sort By:
                <div className="text-blue-500 items-center box-border caret-transparent flex basis-[0%] grow stroke-blue-500 font-medium">
                  <span className="box-border caret-transparent block basis-[0%] grow stroke-blue-500 text-ellipsis text-nowrap overflow-hidden ml-1">
                    <span className="font-medium box-border caret-transparent shrink-0 stroke-blue-500 text-nowrap">
                      Name
                    </span>
                    : Ascending Order
                  </span>
                  <div className="box-border caret-transparent shrink-0 stroke-blue-500 ml-1 mb-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-27.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-[5px] w-2 -scale-100"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Procedure List */}
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br">
        {/* My Templates Section */}
        {myTemplates.length > 0 ? (
          <>
            <div className="text-gray-600 text-sm font-medium box-border caret-transparent shrink-0 px-4 py-3 border-b border-[var(--border)] bg-gray-50 opacity-[0.85]">
              My Templates ({myTemplates.length})
            </div>
            {myTemplates.map((procedure) => (
              <div
                key={procedure.id}
                onClick={() => onSelectProcedure(procedure.id)}
                className={`relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-[var(--panel-2)] even:bg-[rgba(255,255,255,0.02)] border-l-2 transition-colors ${
                  selectedProcedureId === procedure.id ? "bg-[var(--panel-2)] border-l-[var(--accent)]" : "border-l-transparent"
                } group`}
              >
                <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3">
                  <div className="items-center bg-sky-100 box-border caret-transparent flex shrink-0 h-12 justify-center w-12 border border-blue-300 rounded-lg">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-12.svg"
                      alt="Icon"
                      className={`text-blue-500 box-border caret-transparent shrink-0 h-[18px] w-[18px] transition-opacity ${selectedProcedureId === procedure.id ? 'opacity-100' : 'group-hover:opacity-100'}`}
                    />
                  </div>
                </div>

                <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3 pr-4">
                  <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                    <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                      <div
                        title={procedure.name}
                        className={`box-border caret-transparent text-ellipsis text-nowrap overflow-hidden ${procedure.isFeatured ? 'font-semibold' : ''}`}
                      >
                        {procedure.name}
                      </div>
                    </div>
                    {procedure.isFeatured && (
                      <div className="bg-blue-500 h-1.5 w-1.5 rounded-full ml-1"></div>
                    )}
                  </div>
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                    <div className="text-[var(--muted)] text-[13px] box-border caret-transparent flex items-center gap-2 opacity-80">
                      {procedure.category && (
                        <span className="items-center bg-gray-50 inline-flex px-2 py-1 rounded border border-[var(--border)] text-[11px] opacity-90">
                          <img
                            src="https://c.animaapp.com/mkof8zon8iICvl/assets/image-1.svg"
                            className="h-2.5 w-2.5 mr-1 rounded-full"
                            alt="Category"
                          />
                          {procedure.category}
                        </span>
                      )}
                    </div>
                    <div className="text-[var(--muted)] text-[13px] box-border caret-transparent shrink-0 opacity-70">
                      {procedure.fieldCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-[var(--muted)] text-[13px] italic px-4 py-3 border-b border-[var(--border)] opacity-70">
            No templates created yet.
          </div>
        )}

        {/* All Procedures Section */}
        {allProcedures.length > 0 && (
          <>
            <div className="text-[var(--muted)] text-[11px] uppercase tracking-[0.04em] font-medium box-border caret-transparent shrink-0 px-4 py-3 border-b border-[var(--border)] mt-4 bg-gray-50 opacity-[0.85]">
              All Procedures ({allProcedures.length})
            </div>
            {allProcedures.map((procedure) => (
              <div
                key={procedure.id}
                onClick={() => onSelectProcedure(procedure.id)}
                className={`relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-[var(--panel-2)] even:bg-[rgba(255,255,255,0.02)] border-l-2 transition-colors ${
                  selectedProcedureId === procedure.id ? "bg-[var(--panel-2)] border-l-[var(--accent)]" : "border-l-transparent"
                } group`}
              >
                <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3">
                  <div className="items-center bg-sky-100 box-border caret-transparent flex shrink-0 h-12 justify-center w-12 border border-blue-300 rounded-lg">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-12.svg"
                      alt="Icon"
                      className={`text-blue-500 box-border caret-transparent shrink-0 h-[18px] w-[18px] transition-opacity ${selectedProcedureId === procedure.id ? 'opacity-100' : 'group-hover:opacity-100'}`}
                    />
                  </div>
                </div>

                <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3 pr-4">
                  <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                    <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                      <div
                        title={procedure.name}
                        className={`box-border caret-transparent text-ellipsis text-nowrap overflow-hidden ${procedure.isFeatured ? 'font-semibold' : ''}`}
                      >
                        {procedure.name}
                      </div>
                    </div>
                    {procedure.isFeatured && (
                      <div className="bg-blue-500 h-1.5 w-1.5 rounded-full ml-1"></div>
                    )}
                  </div>
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-between my-1">
                    <div className="text-[var(--muted)] text-[13px] box-border caret-transparent flex items-center gap-2 opacity-80">
                      {procedure.category && (
                        <span className="items-center bg-gray-50 inline-flex px-2 py-1 rounded border border-[var(--border)] text-[11px] opacity-90">
                          <img
                            src="https://c.animaapp.com/mkof8zon8iICvl/assets/image-1.svg"
                            className="h-2.5 w-2.5 mr-1 rounded-full"
                            alt="Category"
                          />
                          {procedure.category}
                        </span>
                      )}
                    </div>
                    <div className="text-[var(--muted)] text-[13px] box-border caret-transparent shrink-0 opacity-70">
                      {procedure.fieldCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {procedures.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <img
              src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-12.svg"
              alt="No procedures"
              className="h-12 w-12 mb-4 opacity-20"
            />
            <p className="text-sm font-medium">No procedures found</p>
            <p className="text-xs">Create a new template to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};
