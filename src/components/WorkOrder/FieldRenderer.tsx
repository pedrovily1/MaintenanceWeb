import React from 'react';
import { WorkOrderField, Attachment } from '../../types/workOrder';
import { attachmentService } from '../../services/attachmentService';
import { Trash2, Paperclip, Camera, Clock } from 'lucide-react';
import { useMeterStore } from '@/store/useMeterStore';

interface FieldRendererProps {
  field: WorkOrderField;
  onUpdate: (updates: Partial<WorkOrderField>) => void;
  disabled?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, onUpdate, disabled }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: Attachment[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const attachment = await attachmentService.uploadFile(e.target.files[i]);
        newAttachments.push(attachment);
      }
      onUpdate({ attachments: [...(field.attachments || []), ...newAttachments] });
    }
  };

  const removeAttachment = (id: string) => {
    onUpdate({ attachments: (field.attachments || []).filter(a => a.id !== id) });
  };

  const { getMeterById } = useMeterStore();

  const renderField = () => {
    switch (field.type) {
      case 'checkbox':
        return (
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={(e) => onUpdate({ value: e.target.checked })}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 rounded border-[var(--border)] focus:ring-blue-500"
            />
            <span className={`text-sm ${field.required && !field.value ? 'text-red-500' : 'text-gray-700'}`}>
              {field.label} {field.required && '*'}
            </span>
          </label>
        );

      case 'text':
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type='text'
                value={field.value || ''}
                onChange={(e) => onUpdate({ value: e.target.value })}
                placeholder={field.placeholder}
                disabled={disabled}
                className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-accent"
              />
            </div>
          </div>
        );

      case 'meter': {
        const meter = field.meterId ? getMeterById(field.meterId) : undefined;
        const value = typeof field.value === 'object' ? field.value.value : field.value;
        const unit = field.unit || meter?.unit || '';
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {field.label} {field.required && '*'}
              </label>
              {meter && (
                <div className="text-xs text-gray-500">
                  <span className="font-semibold">{meter.name}</span>
                  {unit ? <span> • {unit}</span> : null}
                </div>
              )}
            </div>
            {meter ? (
              <div className="text-xs text-gray-500">
                Last: {typeof meter.lastReading === 'number' ? `${meter.lastReading}${unit ? ` ${unit}` : ''}` : '—'}
                {meter.lastReadingAt ? ` • ${new Date(meter.lastReadingAt).toLocaleString()}` : ''}
              </div>
            ) : (
              <div className="text-xs text-amber-600">No meter selected</div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type='number'
                value={value ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  const num = v === '' ? '' : Number(v);
                  if (field.meterId) {
                    onUpdate({ value: { meterId: field.meterId, value: num } });
                  } else {
                    onUpdate({ value: num });
                  }
                }}
                placeholder={unit ? `Enter ${unit}` : 'Enter value'}
                disabled={disabled}
                className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-accent"
              />
              {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
            </div>
          </div>
        );
      }

      case 'textarea':
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <textarea
              value={field.value || ''}
              onChange={(e) => onUpdate({ value: e.target.value })}
              placeholder={field.placeholder}
              disabled={disabled}
              className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-accent"
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="flex flex-col gap-1">
              {(field.options || []).map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name={field.id}
                    checked={field.value === opt}
                    onChange={() => onUpdate({ value: opt })}
                    disabled={disabled}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'photo':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="flex flex-wrap gap-2">
              {(field.attachments || []).map((att) => (
                <div key={att.id} className="relative group w-20 h-20">
                  <img src={att.url} alt={att.name} className="w-full h-full object-cover rounded border border-[var(--border)]" />
                  {!disabled && (
                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
              {!disabled && (
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded hover:border-accent hover:bg-blue-50 cursor-pointer transition-colors text-gray-400 hover:text-accent">
                  <Camera size={20} />
                  <span className="text-[10px] mt-1">Add Photo</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            {field.value ? (
              <div className="border border-[var(--border)] rounded p-4 bg-gray-50 italic text-gray-600 text-center relative group">
                Signed by: {field.value}
                {!disabled && (
                   <button onClick={() => onUpdate({ value: '' })} className="absolute top-1 right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 size={14} />
                   </button>
                )}
              </div>
            ) : (
              <button
                disabled={disabled}
                onClick={() => {
                  const name = window.prompt("Type your full name to sign:");
                  if (name) onUpdate({ value: name });
                }}
                className="w-full border-2 border-dashed border-[var(--border)] rounded py-4 text-sm text-gray-400 hover:border-accent hover:text-accent hover:bg-blue-50 transition-all"
              >
                Click to Sign
              </button>
            )}
          </div>
        );

      case 'timestamp':
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border border-[var(--border)]">
              <Clock size={14} className="mr-2" />
              {field.value ? new Date(field.value).toLocaleString() : 'Not recorded'}
              {!field.value && !disabled && (
                <button
                  onClick={() => onUpdate({ value: new Date().toISOString() })}
                  className="ml-auto text-accent font-semibold hover:underline"
                >
                  Record Now
                </button>
              )}
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <input
              type="date"
              disabled={disabled}
              value={field.value ? String(field.value).substring(0,10) : ''}
              onChange={(e) => onUpdate({ value: e.target.value })}
              className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-accent"
            />
          </div>
        );

      case 'yesno_na': {
        const options = ['Yes','No','N/A'];
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled}
                  onClick={() => onUpdate({ value: opt })}
                  className={`border px-3 py-2 rounded text-sm ${field.value === opt ? 'bg-accent text-white border-accent' : 'border-[var(--border)] text-gray-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'inspection': {
        const options = ['Pass','Flag','Fail'];
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled}
                  onClick={() => onUpdate({ value: opt })}
                  className={`border px-3 py-2 rounded text-sm ${field.value === opt ? 'bg-accent text-white border-accent' : 'border-[var(--border)] text-gray-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'checklist':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="space-y-2">
              {(field.options || []).map((opt) => {
                const checked = Array.isArray(field.value) && field.value.includes(opt);
                return (
                  <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const current = Array.isArray(field.value) ? field.value : [];
                        const next = e.target.checked 
                          ? [...current, opt]
                          : current.filter(v => v !== opt);
                        onUpdate({ value: next });
                      }}
                      disabled={disabled}
                      className="h-4 w-4 text-blue-600 rounded border-[var(--border)] focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="flex flex-col gap-2">
              {(field.attachments || []).map((att) => (
                <div key={att.id} className="flex items-center justify-between bg-gray-50 border border-[var(--border)] rounded px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Paperclip size={14} />
                    <span className="truncate max-w-[260px]">{att.name}</span>
                  </div>
                  {!disabled && (
                    <button onClick={() => removeAttachment(att.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                  )}
                </div>
              ))}
              {!disabled && (
                <label className="w-full flex items-center justify-center border-2 border-dashed border-[var(--border)] rounded py-3 text-sm text-gray-400 hover:border-accent hover:text-accent hover:bg-blue-50 cursor-pointer transition-colors">
                  <Paperclip size={16} className="mr-1" /> Add File
                  <input type="file" multiple onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
        );

      default:
        return <div className="text-red-500 text-xs">Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className="field-renderer py-2">
      {renderField()}
    </div>
  );
};
