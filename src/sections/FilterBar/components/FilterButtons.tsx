import { useState } from 'react';
import { useFilterStore } from '@/store/useFilterStore';
import { useUserStore } from '@/store/useUserStore';

export const FilterButtons = () => {
  const { assignedTo, setFilter } = useFilterStore();
  const { allUsers } = useUserStore();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 gap-y-2 relative">
      <div className="items-center box-border caret-transparent flex shrink-0">
        <button
          type="button"
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className={`items-center bg-transparent caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border ${assignedTo ? 'border-[var(--accent)] bg-[var(--panel-2)]' : 'border-zinc-200'} overflow-hidden px-1 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300`}
        >
          <div className="items-center box-border caret-transparent flex shrink-0 justify-center px-1">
            <img
              src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-24.svg"
              alt="Icon"
              className="text-blue-500 text-[8px] box-border caret-transparent shrink-0 h-4 leading-[11.4288px] w-4"
            />
          </div>
          <div
            title="Assigned To"
            className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden px-1"
          >
            {assignedTo ? allUsers.find(u => u.id === assignedTo)?.fullName || 'Assigned To' : 'Assigned To'}
          </div>
        </button>
        {showUserDropdown && (
          <div className="absolute top-10 left-0 z-50 omp-panel shadow-none min-w-[150px] py-1">
            <div 
              className="px-3 py-2 hover:bg-[var(--panel-2)] cursor-pointer text-sm"
              onClick={() => { setFilter('assignedTo', ''); setShowUserDropdown(false); }}
            >
              All Users
            </div>
            {allUsers.map(user => (
              <div 
                key={user.id}
                className="px-3 py-2 hover:bg-[var(--panel-2)] cursor-pointer text-sm border-t border-[var(--border)] flex items-center gap-2"
                onClick={() => { setFilter('assignedTo', user.id); setShowUserDropdown(false); }}
              >
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
                {user.fullName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
