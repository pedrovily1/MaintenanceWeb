import React from 'react';
import type { AssetStatus, AssetCriticality } from '@/types/asset';

export type AssetFiltersState = {
  search: string;
  status: AssetStatus | 'All';
  location: string | 'All';
  category: string | 'All';
  criticality: AssetCriticality | 'All';
  sortBy: 'name' | 'updatedAt' | 'criticality';
  sortDir: 'asc' | 'desc';
};

type Props = {
  value: AssetFiltersState;
  onChange: (next: AssetFiltersState) => void;
  // optional data sets to build filter dropdowns
  locations?: string[];
  categories?: string[];
};

export const AssetFilters: React.FC<Props> = ({ value, onChange, locations = [], categories = [] }) => {
  const set = (patch: Partial<AssetFiltersState>) => onChange({ ...value, ...patch });

  return (
    <div className="box-border caret-transparent shrink-0 mb-4 mx-4">
      <div className="omp-panel shadow-none box-border caret-transparent flex basis-[0%] grow items-center justify-between p-3 rounded-lg overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="box-border caret-transparent flex w-[300px]">
            <input
              type="search"
              placeholder="Search..."
              value={value.search}
              onChange={(e) => set({ search: e.target.value })}
              className="bg-gray-50 box-border caret-transparent leading-5 h-10 -outline-offset-2 w-full border border-[var(--border)] px-3 rounded-md text-sm"
            />
          </div>

          {/* Status */}
          <select
            value={value.status}
            onChange={(e) => set({ status: e.target.value as any })}
            className="border border-[var(--border)] rounded px-2 h-10 text-sm bg-white min-w-[120px]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Out of Service">Out of Service</option>
          </select>

          {/* Location */}
          <select
            value={value.location}
            onChange={(e) => set({ location: e.target.value as any })}
            className="border border-[var(--border)] rounded px-2 h-10 text-sm bg-white min-w-[120px]"
          >
            <option value="All">All Locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={value.category}
            onChange={(e) => set({ category: e.target.value as any })}
            className="border border-[var(--border)] rounded px-2 h-10 text-sm bg-white min-w-[120px]"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Criticality */}
          <select
            value={value.criticality}
            onChange={(e) => set({ criticality: e.target.value as any })}
            className="border border-[var(--border)] rounded px-2 h-10 text-sm bg-white min-w-[120px]"
          >
            <option value="All">All Criticalities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <label className="text-xs text-gray-500 font-medium">Sort:</label>
          <select
            value={value.sortBy}
            onChange={(e) => set({ sortBy: e.target.value as any })}
            className="border border-[var(--border)] rounded px-2 h-10 text-sm bg-white"
          >
            <option value="name">Name</option>
            <option value="updatedAt">Updated</option>
            <option value="criticality">Criticality</option>
          </select>
          <select
            value={value.sortDir}
            onChange={(e) => set({ sortDir: e.target.value as any })}
            className="border border-[var(--border)] rounded px-2 h-10 text-sm bg-white"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
    </div>
  );
};
