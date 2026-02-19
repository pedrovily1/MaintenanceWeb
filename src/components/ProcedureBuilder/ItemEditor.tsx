import React from 'react';
import { ProcedureItem, ProcedureItemKind, MultipleChoiceItem, NumberInputItem, TextInputItem, MeterReadingItem } from '@/types/procedure';
import { useMeterStore } from '@/store/useMeterStore';

interface ItemEditorProps {
  item: ProcedureItem;
  onChange: (patch: Partial<ProcedureItem>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

// Inline editor for a single item with basic controls
export const ItemEditor: React.FC<ItemEditorProps> = ({ item, onChange, onRemove, onMoveUp, onMoveDown }) => {
  const commonHeader = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          className="border border-zinc-200 rounded px-2 py-1 text-sm min-w-[200px]"
          placeholder={item.kind === 'Heading' ? 'Heading text' : 'Field label'}
          value={item.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
        />
        {item.kind !== 'Heading' && item.kind !== 'TextBlock' && (
          <label className="flex items-center gap-1 text-xs text-gray-600">
            <input type="checkbox" checked={!!item.required} onChange={(e) => onChange({ required: e.target.checked })} />
            Required
          </label>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onMoveUp} className="text-xs text-gray-500 hover:text-blue-500">↑</button>
        <button type="button" onClick={onMoveDown} className="text-xs text-gray-500 hover:text-blue-500">↓</button>
        <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:text-red-400">Delete</button>
      </div>
    </div>
  );

  const { meters } = useMeterStore();

  const renderBody = () => {
    switch (item.kind as ProcedureItemKind) {
      case 'TextBlock':
        return (
          <textarea
            className="w-full border border-zinc-200 rounded p-2 text-sm min-h-[60px] mt-2"
            placeholder="Instructional text..."
            value={(item as any).text || ''}
            onChange={(e) => onChange({ ...(item as any), text: e.target.value })}
          />
        );
      case 'TextInput': {
        const it = item as TextInputItem;
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              className="border border-zinc-200 rounded px-2 py-1 text-sm"
              placeholder="Placeholder"
              value={it.placeholder || ''}
              onChange={(e) => onChange({ placeholder: e.target.value })}
            />
            <label className="text-xs text-gray-600 flex items-center gap-1">
              <input type="checkbox" checked={!!it.multiline} onChange={(e) => onChange({ multiline: e.target.checked })} /> Multiline
            </label>
          </div>
        );
      }
      case 'NumberInput': {
        const it = item as NumberInputItem;
        return (
          <div className="grid grid-cols-3 gap-2 mt-2">
            <input className="border border-zinc-200 rounded px-2 py-1 text-sm" placeholder="Unit (e.g., hrs, psi)" value={it.unit || ''} onChange={(e) => onChange({ unit: e.target.value })} />
            <input className="border border-zinc-200 rounded px-2 py-1 text-sm" placeholder="Min" type="number" value={it.min ?? ''} onChange={(e) => onChange({ min: e.target.value === '' ? undefined : Number(e.target.value) })} />
            <input className="border border-zinc-200 rounded px-2 py-1 text-sm" placeholder="Max" type="number" value={it.max ?? ''} onChange={(e) => onChange({ max: e.target.value === '' ? undefined : Number(e.target.value) })} />
          </div>
        );
      }
      case 'MultipleChoice': {
        const it = item as MultipleChoiceItem;
        const opts = it.options || [];
        return (
          <div className="mt-2 space-y-2">
            {opts.map((o, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{idx + 1}.</span>
                <input
                  className="border border-zinc-200 rounded px-2 py-1 text-sm grow"
                  value={o}
                  onChange={(e) => {
                    const next = [...opts];
                    next[idx] = e.target.value;
                    onChange({ options: next });
                  }}
                />
                <button type="button" className="text-xs text-red-500" onClick={() => onChange({ options: opts.filter((_, i) => i !== idx) })}>Remove</button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <button type="button" className="text-xs text-blue-500" onClick={() => onChange({ options: [...opts, `Option ${opts.length + 1}`] })}>+ Option</button>
              <label className="text-xs text-gray-600 flex items-center gap-1">
                <input type="checkbox" checked={!!it.otherOption} onChange={(e) => onChange({ otherOption: e.target.checked })} /> Include "Other"
              </label>
            </div>
          </div>
        );
      }
      case 'YesNoNA':
      case 'Inspection':
      case 'Date':
      case 'Photo':
      case 'File':
      case 'Signature':
        return <div className="text-xs text-gray-500 mt-2">No additional options</div>;
      case 'MeterReading': {
        const it = item as MeterReadingItem;
        const activeMeters = (meters || []).filter(m => m?.active !== false);
        return (
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Default Meter</label>
                <select
                  className="w-full border border-zinc-200 rounded px-2 py-1 text-sm"
                  value={it.meterId || ''}
                  onChange={(e) => onChange({ meterId: e.target.value || undefined })}
                >
                  <option value="">None</option>
                  {activeMeters.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Units</label>
                <input className="w-full border border-zinc-200 rounded px-2 py-1 text-sm" placeholder="Units (e.g., kWh)" value={it.unit || ''} onChange={(e) => onChange({ unit: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Allowed Meters (optional)</label>
              <select
                multiple
                className="w-full border border-zinc-200 rounded px-2 py-1 text-sm min-h-[80px]"
                value={it.allowedMeterIds || []}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions).map(o => o.value);
                  onChange({ allowedMeterIds: opts });
                }}
              >
                {activeMeters.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">If empty, all active meters will be available when this procedure is used.</div>
            </div>
          </div>
        );
      }
      case 'Heading':
      default:
        return null;
    }
  };

  return (
    <div className="border border-zinc-200 rounded p-3 bg-white">
      {commonHeader}
      {item.helpText !== undefined && (
        <input
          className="mt-2 w-full border border-zinc-200 rounded px-2 py-1 text-xs text-gray-600"
          placeholder="Help text / notes (optional)"
          value={item.helpText || ''}
          onChange={(e) => onChange({ helpText: e.target.value })}
        />
      )}
      {renderBody()}
    </div>
  );
};
