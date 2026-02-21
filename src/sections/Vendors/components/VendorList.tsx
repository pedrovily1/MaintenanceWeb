import React from 'react';
import { Vendor } from '@/types/vendor';

type VendorListProps = {
  vendors: Vendor[];
  selectedVendorId: string | null;
  onSelectVendor: (id: string) => void;
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const COLORS = [
  'bg-teal-400',
  'bg-orange-400',
  'bg-purple-500',
  'bg-teal-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
];

const getColorForVendor = (id: string): string => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
};

export const VendorList = ({ vendors, selectedVendorId, onSelectVendor }: VendorListProps) => {
  if (vendors.length === 0) {
    return (
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-[var(--border)] mr-4 rounded-tl rounded-tr border-solid">
        <div className="flex items-center justify-center w-full h-64 p-8">
          <div className="text-center text-gray-500">
            <p className="text-sm">No vendors yet</p>
            <p className="text-xs mt-2">Click "New Vendor" to create one</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-[var(--border)] mr-4 rounded-tl rounded-tr border-solid">
      {/* Sort Controls */}
      <div className="relative items-center border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent flex shrink-0 h-12 justify-between z-[1] border-b">
        <div className="box-border caret-transparent flex basis-[0%] grow p-3">
          <div className="relative text-[12.6px] box-border caret-transparent flex basis-[0%] grow leading-[15.12px] opacity-[0.85]">
            <div className="box-border caret-transparent basis-[0%] grow">
              <button
                type="button"
                className="text-gray-600 text-sm items-center bg-transparent caret-transparent flex shrink-0 leading-[16.8px] max-w-full text-center font-medium"
              >
                Sort By:
                <div className="text-teal-500 items-center box-border caret-transparent flex basis-[0%] grow stroke-teal-500 font-medium">
                  <span className="box-border caret-transparent block basis-[0%] grow stroke-teal-500 text-ellipsis text-nowrap overflow-hidden ml-1">
                    <span className="font-medium box-border caret-transparent shrink-0 stroke-teal-500 text-nowrap">
                      Name
                    </span>
                    : Ascending Order
                  </span>
                  <div className="box-border caret-transparent shrink-0 stroke-teal-500 ml-1 mb-1">
                    <img
                      src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-27.svg"
                      alt="Icon"
                      className="box-border caret-transparent shrink-0 h-[5px] w-2 -scale-100"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor List */}
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br">
        {vendors.map((vendor) => {
          const initials = getInitials(vendor.name);
          const color = getColorForVendor(vendor.id);
          return (
            <div
              key={vendor.id}
              onClick={() => onSelectVendor(vendor.id)}
              className={`relative items-center border-b border-[var(--border)] box-border caret-transparent flex shrink-0 min-h-[80px] cursor-pointer hover:bg-[var(--panel-2)] even:bg-[rgba(255,255,255,0.02)] border-l-2 transition-colors ${
                selectedVendorId === vendor.id ? "bg-[var(--panel-2)] border-l-[var(--accent)]" : "border-l-transparent"
              } group`}
            >
              <div className="relative box-border caret-transparent shrink-0 ml-4 mr-3">
                <div className={`${color} text-white text-lg font-semibold items-center box-border caret-transparent flex shrink-0 h-12 justify-center w-12 rounded-full transition-opacity ${selectedVendorId === vendor.id ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                  {initials}
                </div>
              </div>

              <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center py-3 pr-4">
                <div className="items-center box-border caret-transparent flex shrink-0 my-px">
                  <div className="box-border caret-transparent flex basis-[0%] grow overflow-hidden mr-2">
                    <div
                      title={vendor.name}
                      className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                    >
                      {vendor.name}
                    </div>
                  </div>
                  {vendor.trade && (
                    <div className="text-[var(--muted)] text-[13px] box-border caret-transparent shrink-0 opacity-80">
                      {vendor.trade}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
