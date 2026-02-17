import { useMemo, useState } from 'react';
import { useProcedureStore } from '@/store/useProcedureStore';
import { Palette } from '@/components/ProcedureBuilder/Palette';
import { SectionEditor } from '@/components/ProcedureBuilder/SectionEditor';
import { ProcedureItemKind } from '@/types/procedure';

interface ProcedureEditorProps {
  procedureId: string | null;
}

export const ProcedureEditor = ({ procedureId }: ProcedureEditorProps) => {
  const {
    getProcedureById,
    updateProcedure,
    addSection,
    removeSection,
    reorderSections,
    addItem,
    updateItem,
    removeItem,
    reorderItems,
  } = useProcedureStore();

  const procedure = useMemo(() => (procedureId ? getProcedureById(procedureId) : undefined), [procedureId, getProcedureById]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  if (!procedureId || !procedure) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select or create a procedure to start building
          </div>
        </div>
      </div>
    );
  }

  const onAddItem = (kind: ProcedureItemKind) => {
    const targetSectionId = activeSectionId || procedure.sections[0]?.id;
    if (!targetSectionId) return;
    // Initialize sensible defaults per kind
    const base: any = { kind, label: kind, required: false };
    if (kind === 'MultipleChoice') base.options = ['Option 1', 'Option 2'];
    if (kind === 'TextInput') base.placeholder = 'Enter text';
    addItem(procedure.id, targetSectionId, base);
  };

  const onAddSection = () => {
    addSection(procedure.id, `Section ${procedure.sections.length + 1}`);
  };

  const onSave = () => {
    // Bump version; data already persisted reactively
    updateProcedure(procedure.id, { name: procedure.name });
  };

  const fieldCount = procedure.meta.fieldCount;

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-hidden w-full">
          {/* Header */}
          <header className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2 w-full">
                <input
                  className="text-xl font-medium box-border caret-transparent tracking-[-0.2px] w-full border-b border-transparent focus:border-blue-500 outline-none"
                  placeholder="Enter Procedure Name"
                  value={procedure.name}
                  onChange={(e) => updateProcedure(procedure.id, { name: e.target.value })}
                />
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <div className="text-xs text-gray-500 mr-2">Fields count: {fieldCount}/350</div>
                <button
                  type="button"
                  onClick={onSave}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-blue-500 px-3 rounded text-blue-500 hover:text-blue-400 hover:border-blue-400"
                >
                  Save to Procedure Library
                </button>
              </div>
            </div>
            <textarea
              className="w-full border border-zinc-200 rounded p-2 text-sm min-h-[60px]"
              placeholder="Description (optional)"
              value={procedure.description || ''}
              onChange={(e) => updateProcedure(procedure.id, { description: e.target.value })}
            />
          </header>

          {/* Canvas */}
          <div className="relative box-border caret-transparent flex flex-row grow scroll-smooth overflow-auto scroll-pt-4 px-6 py-4 gap-4">
            <div className="basis-[70%] max-w-[816px] mr-4">
              {procedure.sections.map((section, index) => (
                <div key={section.id} onClick={() => setActiveSectionId(section.id)}>
                  <SectionEditor
                    procedure={procedure}
                    section={section}
                    onRename={(title) => updateProcedure(procedure.id, {
                      sections: procedure.sections.map(s => s.id === section.id ? { ...s, title } : s)
                    })}
                    onRemove={() => removeSection(procedure.id, section.id)}
                    onMoveUp={() => reorderSections(procedure.id, index, Math.max(0, index - 1))}
                    onMoveDown={() => reorderSections(procedure.id, index, Math.min(procedure.sections.length - 1, index + 1))}
                    onAddItem={(kind) => addItem(procedure.id, section.id, { kind, label: kind } as any)}
                    onUpdateItem={(itemId, patch) => updateItem(procedure.id, section.id, itemId, patch as any)}
                    onRemoveItem={(itemId) => removeItem(procedure.id, section.id, itemId)}
                    onReorderItem={(from, to) => reorderItems(procedure.id, section.id, from, to)}
                  />
                </div>
              ))}
            </div>
            <div className="basis-[30%] min-w-[260px]">
              <Palette
                onAddItem={onAddItem}
                onAddSection={onAddSection}
              />
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('use-procedure-in-new-work-order', { detail: { procedureId: procedure.id } }));
                  }}
                  className="w-full relative text-blue-500 font-bold items-center bg-white shadow-[rgba(30,36,41,0.16)_0px_4px_12px_0px] caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-3xl border-solid hover:text-blue-400 hover:border-blue-400"
                >
                  Use in New Work Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
