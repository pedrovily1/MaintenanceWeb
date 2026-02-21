import React, { ReactNode } from 'react';

interface EntityThumbnailProps {
  imageUrl?: string;
  fallbackIcon: ReactNode;
  alt: string;
  className?: string;
}

/**
 * A reusable component to display an entity's image or a fallback icon.
 * Maintains a consistent 1:1 aspect ratio and styling.
 */
export const EntityThumbnail: React.FC<EntityThumbnailProps> = ({
  imageUrl,
  fallbackIcon,
  alt,
  className = "h-12 w-12",
}) => {
  return (
    <div 
      className={`relative flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel-2)] flex items-center justify-center ${className} group transition-all hover:ring-2 hover:ring-accent/30`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Optional: handle image load error by clearing the source to show fallback
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.classList.add('show-fallback');
          }}
        />
      ) : null}
      
      <div className={`flex items-center justify-center h-full w-full ${imageUrl ? 'hidden group-[.show-fallback]:flex' : 'flex'}`}>
        {fallbackIcon}
      </div>
    </div>
  );
};
