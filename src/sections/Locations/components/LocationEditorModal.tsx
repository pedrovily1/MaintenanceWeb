import React, { useState } from 'react';
import { useSiteStore } from '@/store/useSiteStore';
import type { Location } from '@/types/location';
import { LocationTreeSelector } from '@/components/LocationTreeSelector';
import { ImageUpload } from '@/components/ImageUpload';

type Props = {
  initial?: Partial<Location>;
  onClose: () => void;
  onSubmit: (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => void;
};

export const LocationEditorModal: React.FC<Props> = ({ initial, onClose, onSubmit }) => {
  const { activeSiteId } = useSiteStore();
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '');
  const [parentLocationId, setParentLocationId] = useState<string | null>(initial?.parentLocationId || null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    const e: { name?: string } = {};
    if (!name.trim()) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      address: address.trim() || undefined,
      imageUrl: imageUrl || undefined,
      parentLocationId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <div className="text-lg font-semibold">{initial?.id ? 'Edit Location' : 'New Location'}</div>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>&#x2715;</button>
        </div>

        <div className="p-4 space-y-4">
          <ImageUpload
            currentImageUrl={imageUrl}
            onImageUploaded={setImageUrl}
            onImageRemoved={() => setImageUrl('')}
            label="Location Photo"
          />
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name<span className="text-red-500">*</span></label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full border rounded px-2 py-1 text-sm ${errors.name ? 'border-red-400' : 'border-[var(--border)]'}`}
            />
            {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address</label>
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <LocationTreeSelector
              label="Parent Location"
              value={parentLocationId}
              onChange={(id) => setParentLocationId(id)}
            />
          </div>
        </div>

        <div className="px-4 py-3 border-t border-[var(--border)] bg-gray-50 flex items-center justify-end gap-2 rounded-b-lg">
          <button className="px-3 py-1 rounded border border-[var(--border)] text-sm" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={!activeSiteId}>Save</button>
        </div>
      </div>
    </div>
  );
};
