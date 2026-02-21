import { useMemo, useState } from "react";
import { ProcedureList } from "./components/ProcedureList";
import { ProcedureDetail } from "./components/ProcedureDetail";
import { ProcedureEditor } from "./components/ProcedureEditor";
import { useProcedureStore } from "@/store/useProcedureStore";

export const Procedures = () => {
  const { addProcedure, deleteProcedure, search, procedures } = useProcedureStore();
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => search(query), [search, query]);

  const handleNew = () => {
    const p = addProcedure("Untitled Procedure");
    setSelectedProcedureId(p.id);
  };

  const handleDelete = (id: string) => {
    // Find next selection before deleting
    // We use the same sorting logic as the store to determine "next"
    const sorted = [...procedures].sort((a, b) => a.name.localeCompare(b.name));
    const index = sorted.findIndex(p => p.id === id);
    
    deleteProcedure(id);

    const remaining = sorted.filter(p => p.id !== id);
    if (remaining.length > 0) {
      const nextIndex = Math.min(index, remaining.length - 1);
      setSelectedProcedureId(remaining[nextIndex].id);
    } else {
      setSelectedProcedureId(null);
    }
  };

  const computedList = filtered.map(p => ({
    id: p.id,
    name: p.name,
    fieldCount: `${p.meta.fieldCount} ${p.meta.fieldCount === 1 ? 'field' : 'fields'}`,
    category: "",
    isMyTemplate: true,
    isFeatured: p.meta.fieldCount > 0
  }));

  // BEGIN legacy static list (removed)
  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Procedure Library
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search Procedure Templates"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-[var(--panel-2)] bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-[var(--border)] bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              onClick={handleNew}
              className="relative text-white font-bold items-center bg-teal-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-teal-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-teal-400 hover:border-teal-400"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-22.svg"
                alt="Icon"
                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
              />
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                New Procedure Template
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="box-border caret-transparent shrink-0 px-4 py-3">
        <div className="items-center box-border caret-transparent flex shrink-0">
          <div className="box-border caret-transparent flex basis-[0%] grow gap-x-2">
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <ProcedureList
          procedures={computedList}
          selectedProcedureId={selectedProcedureId}
          onSelectProcedure={setSelectedProcedureId}
        />
        <ProcedureEditor 
          procedureId={selectedProcedureId} 
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
