import React from 'react';
import { ProcedureItemKind } from '@/types/procedure';

interface PaletteProps {
  onAddItem: (kind: ProcedureItemKind) => void;
  onAddSection: () => void;
}

// Minimal palette mirroring options from reference; styling reuses Tailwind tokens in project
export const Palette: React.FC<PaletteProps> = ({ onAddItem, onAddSection }) => {
  const addButtons: { label: string; kind: ProcedureItemKind }[] = [
    { label: 'Heading', kind: 'Heading' },
    { label: 'Text Block', kind: 'TextBlock' },
    { label: 'Text / Notes', kind: 'TextInput' },
    { label: 'Number', kind: 'NumberInput' },
    { label: 'Multiple Choice', kind: 'MultipleChoice' },
    { label: 'Yes / No / N/A', kind: 'YesNoNA' },
    { label: 'Inspection (Pass/Flag/Fail)', kind: 'Inspection' },
    { label: 'Date', kind: 'Date' },
    { label: 'Photo Upload', kind: 'Photo' },
    { label: 'File Upload', kind: 'File' },
    { label: 'Signature', kind: 'Signature' },
    { label: 'Meter Reading', kind: 'MeterReading' },
  ];

  return (
    <div className="bg-white border border-[var(--border)] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Add Item</div>
        <button type="button" onClick={onAddSection} className="text-teal-500 text-sm font-medium hover:text-teal-400">+ Section</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {addButtons.map(btn => (
          <button
            key={btn.kind}
            type="button"
            onClick={() => onAddItem(btn.kind)}
            className="border border-[var(--border)] rounded px-2 py-1 text-xs text-gray-700 hover:border-teal-400 hover:text-teal-500 text-left"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
