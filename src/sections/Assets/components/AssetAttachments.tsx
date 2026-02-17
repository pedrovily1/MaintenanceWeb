import React from 'react';
import { Attachment } from '@/types/workOrder';
import { attachmentService } from '@/services/attachmentService';

const isImage = (att: Attachment) => typeof att.type === 'string' && att.type.startsWith('image/');

type Props = {
  attachments: Attachment[];
  onChange: (next: Attachment[]) => void;
  disabled?: boolean;
};

export const AssetAttachments: React.FC<Props> = ({ attachments, onChange, disabled }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newOnes: Attachment[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const a = await attachmentService.uploadFile(e.target.files[i]);
      newOnes.push(a);
    }
    onChange([...(attachments || []), ...newOnes]);
  };

  const remove = (id: string) => onChange((attachments || []).filter(a => a.id !== id));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(attachments || []).map((att) => (
          <div key={att.id} className="relative group">
            {isImage(att) ? (
              <img src={att.url} alt={att.name} className="w-20 h-20 object-cover rounded border border-gray-200" />
            ) : (
              <div className="w-40 border border-gray-200 rounded px-2 py-1 text-xs flex items-center gap-2">
                <span>📎</span>
                <span className="truncate" title={att.name}>{att.name}</span>
              </div>
            )}
            {!disabled && (
              <button
                onClick={() => remove(att.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                title="Remove"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {!disabled && (
          <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors text-gray-400 hover:text-blue-500">
            <span className="text-lg">＋</span>
            <span className="text-[10px] mt-1">Add</span>
            <input type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};
