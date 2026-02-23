import React from 'react';
import { Procedure, ProcedureSection, ProcedureItem, ProcedureItemKind } from '@/types/procedure';
import { ItemEditor } from './ItemEditor';

interface SectionEditorProps {
  procedure: Procedure;
  section: ProcedureSection;
  index: number;
  onRename: (title: string) => void;
  onRemove: (e?: React.MouseEvent) => void;
  onMoveUp: (e?: React.MouseEvent) => void;
  onMoveDown: (e?: React.MouseEvent) => void;
  onAddItem: (kind: ProcedureItemKind) => void;
  onUpdateItem: (itemId: string, patch: Partial<ProcedureItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onReorderItem: (fromIndex: number, toIndex: number) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  procedure,
  section,
  index,
  onRename,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onReorderItem
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer.getData('text/plain'));
    if (!Number.isNaN(fromIndex) && fromIndex !== index) {
      onReorderItem(fromIndex, index);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden mb-4 bg-white">
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-3 grow">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider whitespace-nowrap bg-slate-200/50 px-1.5 py-0.5 rounded">SECTION {index + 1}</span>
          <input
            className="font-semibold text-sm text-gray-800 uppercase tracking-tight bg-transparent outline-none w-full placeholder:text-gray-300 border-b border-transparent focus:border-blue-500 transition-colors"
            placeholder="UNTITLED SECTION"
            value={section.title}
            onChange={(e) => onRename(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button type="button" onClick={(e) => onMoveUp(e)} className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-blue-500 transition-colors" title="Move Up">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <button type="button" onClick={(e) => onMoveDown(e)} className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-blue-500 transition-colors" title="Move Down">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button type="button" onClick={(e) => onRemove(e)} className="p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors" title="Delete Section">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {section.items.map((item, idx) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragOver={handleDragOver}
            className="rounded border border-transparent hover:border-blue-200"
          >
            <ItemEditor
              item={item}
              onChange={(patch) => onUpdateItem(item.id, patch)}
              onRemove={() => onRemoveItem(item.id)}
              onMoveUp={() => onReorderItem(idx, Math.max(0, idx - 1))}
              onMoveDown={() => onReorderItem(idx, Math.min(section.items.length - 1, idx + 1))}
            />
          </div>
        ))}
        <div className="pt-2">
          <div className="flex flex-wrap gap-2">
            {(['Heading','TextBlock','TextInput','NumberInput','MultipleChoice','YesNoNA','Inspection','Date','Photo','File','Signature','MeterReading', 'Checklist'] as ProcedureItemKind[]).map(kind => (
              <button
                key={kind}
                type="button"
                onClick={() => onAddItem(kind)}
                className="text-xs border border-[var(--border)] rounded px-2 py-1 text-gray-700 hover:border-blue-400 hover:text-blue-500"
              >
                + {kind}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
