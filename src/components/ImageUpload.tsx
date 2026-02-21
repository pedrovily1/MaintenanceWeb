import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
  label?: string;
}

/**
 * A reusable image upload component.
 * Simulates uploading by using a local object URL.
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  label = "Entity Image",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this to a server/S3
      // Here we simulate it with a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageUploaded(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold">
        {label}
      </label>
      
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--panel-2)] flex items-center justify-center overflow-hidden group">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              <button
                onClick={handleRemove}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X size={12} />
              </button>
            </>
          ) : (
            <div 
              className="flex flex-col items-center justify-center text-[var(--muted)] cursor-pointer hover:text-accent transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={20} className="mb-1" />
              <span className="text-[10px]">Upload</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-xs text-[var(--muted)] mb-2">
            Add a photo to help identify this entity. JPG, PNG or WebP. Max 5MB.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {previewUrl ? 'Change Image' : 'Select Image'}
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
