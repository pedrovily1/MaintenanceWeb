import React from 'react';
import { Procedure, ProcedureSection, ProcedureItem, ProcedureItemKind } from '@/types/procedure';
import { ItemEditor } from './ItemEditor';

interface SectionEditorProps {
  procedure: Procedure;
  section: ProcedureSection;
  onRename: (title: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddItem: (kind: ProcedureItemKind) => void;
  onUpdateItem: (itemId: string, patch: Partial<ProcedureItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onReorderItem: (fromIndex: number, toIndex: number) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  procedure,
  section,
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
    <div className="border border-zinc-200 rounded-lg overflow-hidden mb-4 bg-white">
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <input
          className="font-semibold text-sm text-gray-800 uppercase tracking-tight bg-transparent outline-none"
          value={section.title}
          onChange={(e) => onRename(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button type="button" onClick={onMoveUp} className="text-xs text-gray-500 hover:text-blue-500">↑</button>
          <button type="button" onClick={onMoveDown} className="text-xs text-gray-500 hover:text-blue-500">↓</button>
          <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:text-red-400">Delete</button>
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
            {(['Heading','TextBlock','TextInput','NumberInput','MultipleChoice','YesNoNA','Inspection','Date','Photo','File','Signature','MeterReading'] as ProcedureItemKind[]).map(kind => (
              <button
                key={kind}
                type="button"
                onClick={() => onAddItem(kind)}
                className="text-xs border border-zinc-200 rounded px-2 py-1 text-gray-700 hover:border-blue-400 hover:text-blue-500"
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
