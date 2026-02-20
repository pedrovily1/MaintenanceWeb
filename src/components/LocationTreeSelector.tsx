import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocationStore } from '@/store/useLocationStore';
import type { Location } from '@/types/location';

type Props = {
  value: string | null | undefined;
  onChange: (locationId: string | null, locationName: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

type TreeNode = Location & { depth: number; childCount: number };

export const LocationTreeSelector: React.FC<Props> = ({
  value,
  onChange,
  disabled = false,
  label,
  className = '',
}) => {
  const { locations } = useLocationStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Build flattened tree
  const flatTree = useMemo(() => {
    const result: TreeNode[] = [];
    const buildTree = (parentId: string | null, depth: number) => {
      const children = locations.filter(l =>
        parentId === null ? !l.parentLocationId : l.parentLocationId === parentId
      );
      for (const child of children) {
        const grandChildren = locations.filter(l => l.parentLocationId === child.id);
        result.push({ ...child, depth, childCount: grandChildren.length });
        buildTree(child.id, depth + 1);
      }
    };
    buildTree(null, 0);
    return result;
  }, [locations]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return flatTree;
    const term = search.toLowerCase();
    return flatTree.filter(n => n.name.toLowerCase().includes(term));
  }, [flatTree, search]);

  const selectedLocation = locations.find(l => l.id === value);
  const displayValue = selectedLocation?.name || (value ? 'Unknown' : 'No Location');

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`w-full border rounded px-2 py-1 text-sm text-left flex items-center justify-between gap-1 ${
          disabled
            ? 'bg-gray-100 text-gray-400 border-[var(--border)] cursor-not-allowed'
            : 'border-[var(--border)] hover:border-blue-400 cursor-pointer'
        }`}
      >
        <span className="truncate">{displayValue}</span>
        <svg
          className={`w-3 h-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[var(--border)] rounded shadow-lg max-h-64 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-[var(--border)]">
            <input
              type="text"
              placeholder="Search locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
              autoFocus
            />
          </div>

          {/* Options */}
          <div className="overflow-y-auto flex-1">
            {/* No location option */}
            <button
              type="button"
              onClick={() => {
                onChange(null, '');
                setOpen(false);
                setSearch('');
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                !value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 italic'
              }`}
            >
              No Location
            </button>

            {filtered.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  onChange(node.id, node.name);
                  setOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-1 ${
                  value === node.id ? 'bg-blue-50 text-blue-600 font-medium' : ''
                }`}
                style={{ paddingLeft: `${12 + node.depth * 20}px` }}
              >
                {node.depth > 0 && (
                  <span className="text-gray-300 text-xs mr-1">{'└'}</span>
                )}
                <span className="truncate">{node.name}</span>
                {node.childCount > 0 && (
                  <span className="text-[10px] text-gray-400 ml-auto shrink-0">
                    {node.childCount} sub
                  </span>
                )}
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="px-3 py-4 text-sm text-gray-400 text-center italic">
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
