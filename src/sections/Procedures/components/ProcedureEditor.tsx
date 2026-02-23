import { useEffect, useMemo, useState } from 'react';
import { useProcedureStore } from '@/store/useProcedureStore';
import { Palette } from '@/components/ProcedureBuilder/Palette';
import { SectionEditor } from '@/components/ProcedureBuilder/SectionEditor';
import { Procedure, ProcedureItemKind, ProcedureSection } from '@/types/procedure';
import { ConfirmationModal } from '@/components/Common/ConfirmationModal';

interface ProcedureEditorProps {
  procedureId: string | null;
  onDelete?: (id: string) => void;
}

export const ProcedureEditor = ({ procedureId, onDelete }: ProcedureEditorProps) => {
  const {
    procedures,
    getProcedureById,
    saveProcedure,
  } = useProcedureStore();

  const storeProcedure = useMemo(
    () => (procedureId ? procedures.find(p => p.id === procedureId) ?? getProcedureById(procedureId) : undefined),
    [procedureId, procedures, getProcedureById]
  );

  const [draft, setDraft] = useState<Procedure | undefined>(undefined);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveSuccessModalOpen, setIsSaveSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (storeProcedure) {
      setDraft(JSON.parse(JSON.stringify(storeProcedure)));
    } else {
      setDraft(undefined);
    }
  }, [storeProcedure]);

  if (!procedureId || !draft) {
    return (
      <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
        <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Select or create a procedure to start building
          </div>
        </div>
      </div>
    );
  }

  const computeFieldCount = (p: Procedure) => {
    return p.sections.reduce((acc, s) => acc + s.items.filter(i => !['Heading', 'TextBlock'].includes(i.kind)).length, 0);
  };

  const updateDraft = (patch: Partial<Procedure> | ((prev: Procedure) => Procedure)) => {
    setDraft(prev => {
      if (!prev) return prev;
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      next.meta.fieldCount = computeFieldCount(next);
      return next;
    });
  };

  const onAddItem = (kind: ProcedureItemKind, sectionId?: string) => {
    const targetSectionId = sectionId || activeSectionId || draft.sections[0]?.id;
    if (!targetSectionId) return;

    updateDraft(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== targetSectionId) return s;
        const newItem = {
          id: crypto.randomUUID(),
          kind,
          label: kind,
          required: false,
          orderIndex: s.items.length,
          ...(kind === 'MultipleChoice' ? { options: ['Option 1', 'Option 2'] } : {}),
          ...(kind === 'Checklist' ? { options: ['Check 1', 'Check 2'] } : {}),
          ...(kind === 'TextInput' ? { placeholder: 'Enter text' } : {}),
        };
        return { ...s, items: [...s.items, newItem as any] };
      })
    }));

    if (targetSectionId !== activeSectionId) setActiveSectionId(targetSectionId);
  };

  const onAddSection = () => {
    updateDraft(prev => ({
      ...prev,
      sections: [...prev.sections, {
        id: crypto.randomUUID(),
        title: `Section ${prev.sections.length + 1}`,
        items: [],
        orderIndex: prev.sections.length
      }]
    }));
  };

  const onSave = () => {
    if (draft) {
      saveProcedure(draft);
      setIsSaveSuccessModalOpen(true);
    }
  };

  const fieldCount = draft.meta?.fieldCount ?? 0;

  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-hidden w-full">
          {/* Header */}
          <header className="box-border caret-transparent shrink-0 px-4 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 mb-4">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2 w-full">
                <input
                  className="text-xl font-medium box-border caret-transparent tracking-[-0.2px] w-full border-b border-transparent focus:border-accent outline-none"
                  placeholder="Enter Procedure Name"
                  value={draft.name}
                  onChange={(e) => updateDraft({ name: e.target.value })}
                />
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <div className="text-xs text-gray-500 mr-2">Fields count: {fieldCount}/350</div>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-red-500 px-3 rounded text-red-500 hover:text-red-400 hover:border-red-400 mr-2"
                >
                  Delete Procedure
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  className="relative font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded text-accent hover:text-accent-hover hover:border-accent-hover"
                >
                  Save to Procedure Library
                </button>
              </div>
            </div>
            <textarea
              className="w-full border border-[var(--border)] rounded p-2 text-sm min-h-[60px]"
              placeholder="Description (optional)"
              value={draft.description || ''}
              onChange={(e) => updateDraft({ description: e.target.value })}
            />
          </header>

          {/* Canvas */}
          <div className="relative box-border caret-transparent flex flex-row grow scroll-smooth overflow-auto scroll-pt-4 px-6 py-4 gap-4">
            <div className="basis-[70%] max-w-[816px] mr-4">
              {draft.sections.map((section, index) => (
                <div
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`transition-colors duration-200 rounded-lg mb-4 ${
                    activeSectionId === section.id ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  <SectionEditor
                    procedure={draft}
                    section={section}
                    index={index}
                    onRename={(title) => updateDraft(prev => ({
                      ...prev,
                      sections: prev.sections.map(s => s.id === section.id ? { ...s, title } : s)
                    }))}
                    onRemove={(e) => {
                      e?.stopPropagation();
                      updateDraft(prev => ({
                        ...prev,
                        sections: prev.sections.filter(s => s.id !== section.id).map((s, idx) => ({ ...s, orderIndex: idx }))
                      }));

                      if (activeSectionId === section.id) {
                        const remaining = draft.sections.filter(s => s.id !== section.id);
                        setActiveSectionId(remaining[0]?.id ?? null);
                      }
                    }}
                    onMoveUp={(e) => {
                      e?.stopPropagation();
                      updateDraft(prev => {
                        const sections = [...prev.sections];
                        const toIndex = Math.max(0, index - 1);
                        const [moved] = sections.splice(index, 1);
                        sections.splice(toIndex, 0, moved);
                        return { ...prev, sections: sections.map((s, i) => ({ ...s, orderIndex: i })) };
                      });
                    }}
                    onMoveDown={(e) => {
                      e?.stopPropagation();
                      updateDraft(prev => {
                        const sections = [...prev.sections];
                        const toIndex = Math.min(sections.length - 1, index + 1);
                        const [moved] = sections.splice(index, 1);
                        sections.splice(toIndex, 0, moved);
                        return { ...prev, sections: sections.map((s, i) => ({ ...s, orderIndex: i })) };
                      });
                    }}
                    onAddItem={(kind) => onAddItem(kind, section.id)}
                    onUpdateItem={(itemId, patch) => updateDraft(prev => ({
                      ...prev,
                      sections: prev.sections.map(s => {
                        if (s.id !== section.id) return s;
                        return { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...patch } as any : i) };
                      })
                    }))}
                    onRemoveItem={(itemId) => updateDraft(prev => ({
                      ...prev,
                      sections: prev.sections.map(s => {
                        if (s.id !== section.id) return s;
                        return { ...s, items: s.items.filter(i => i.id !== itemId).map((i, idx) => ({ ...i, orderIndex: idx })) };
                      })
                    }))}
                    onReorderItem={(from, to) => updateDraft(prev => ({
                      ...prev,
                      sections: prev.sections.map(s => {
                        if (s.id !== section.id) return s;
                        const arr = [...s.items];
                        const [moved] = arr.splice(from, 1);
                        arr.splice(to, 0, moved);
                        return { ...s, items: arr.map((i, idx) => ({ ...i, orderIndex: idx })) };
                      })
                    }))}
                  />
                </div>
              ))}
            </div>
            <div className="basis-[30%] min-w-[260px]">
              <Palette
                onAddItem={onAddItem}
                onAddSection={onAddSection}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Procedure"
        message={`Are you sure you want to delete "${draft.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          onDelete?.(draft.id);
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <ConfirmationModal
        isOpen={isSaveSuccessModalOpen}
        title="Procedure Saved"
        message={`"${draft.name}" has been saved successfully to the library.`}
        confirmLabel="OK"
        showCancel={false}
        onConfirm={() => setIsSaveSuccessModalOpen(false)}
        onCancel={() => setIsSaveSuccessModalOpen(false)}
      />
    </div>
  );
};
