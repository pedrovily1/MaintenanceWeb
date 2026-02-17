import React from 'react';
import { WorkOrderField, Attachment } from '../../types/workOrder';
import { attachmentService } from '../../services/attachmentService';
import { Trash2, Paperclip, Camera, Clock } from 'lucide-react';

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
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className={`text-sm ${field.required && !field.value ? 'text-red-500' : 'text-gray-700'}`}>
              {field.label} {field.required && '*'}
            </span>
          </label>
        );

      case 'text':
      case 'meter':
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {field.label} {field.required && '*'}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type={field.type === 'meter' ? 'number' : 'text'}
                value={field.value || ''}
                onChange={(e) => onUpdate({ value: e.target.value })}
                placeholder={field.placeholder}
                disabled={disabled}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {field.unit && <span className="text-sm text-gray-500 font-medium">{field.unit}</span>}
            </div>
          </div>
        );

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
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
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
                  <img src={att.url} alt={att.name} className="w-full h-full object-cover rounded border border-gray-200" />
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
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors text-gray-400 hover:text-blue-500">
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
              <div className="border border-gray-200 rounded p-4 bg-gray-50 italic text-gray-600 text-center relative group">
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
                className="w-full border-2 border-dashed border-gray-300 rounded py-4 text-sm text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
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
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200">
              <Clock size={14} className="mr-2" />
              {field.value ? new Date(field.value).toLocaleString() : 'Not recorded'}
              {!field.value && !disabled && (
                <button
                  onClick={() => onUpdate({ value: new Date().toISOString() })}
                  className="ml-auto text-blue-500 font-semibold hover:underline"
                >
                  Record Now
                </button>
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
