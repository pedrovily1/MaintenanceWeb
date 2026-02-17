import { useState, useEffect } from "react";

export const ViewSelector = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.viewMode) setViewMode(e.detail.viewMode);
    };
    window.addEventListener('change-work-order-view', handler as EventListener);
    return () => window.removeEventListener('change-work-order-view', handler as EventListener);
  }, []);

  const switchView = (mode: 'list' | 'calendar') => {
    setViewMode(mode);
    window.dispatchEvent(new CustomEvent('change-work-order-view', { detail: { viewMode: mode } }));
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="items-start bg-transparent caret-transparent gap-x-1 flex shrink-0 justify-between gap-y-1 text-center p-2 rounded hover:bg-gray-100"
      >
        <div className="items-center box-border caret-transparent flex h-full text-ellipsis text-nowrap overflow-hidden">
          <img
            src={viewMode === 'list' 
              ? "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-20.svg"
              : "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-20.svg" // Placeholder for calendar icon if needed
            }
            alt="Icon"
            className="text-slate-500 box-border caret-transparent shrink-0 h-5 text-nowrap w-5 mr-1.5"
          />
          <div className="box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
            <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px] text-nowrap font-medium">
              {viewMode === 'list' ? 'To Do View' : 'Calendar View'}
            </p>
          </div>
        </div>
        <div className="box-border caret-transparent shrink-0">
          <img
            src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-21.svg"
            alt="Icon"
            className={`box-border caret-transparent shrink-0 h-[7px] w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-zinc-200 shadow-lg rounded-md z-50 min-w-[160px] py-1">
          <button
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${viewMode === 'list' ? 'text-blue-500 font-semibold' : 'text-gray-700'}`}
            onClick={() => { switchView('list'); setIsOpen(false); }}
          >
            To Do View
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${viewMode === 'calendar' ? 'text-blue-500 font-semibold' : 'text-gray-700'}`}
            onClick={() => { switchView('calendar'); setIsOpen(false); }}
          >
            Calendar View
          </button>
        </div>
      )}
    </div>
  );
};
