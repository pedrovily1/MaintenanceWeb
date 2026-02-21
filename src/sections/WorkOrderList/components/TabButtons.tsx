import React from 'react';

    type TabButtonsProps = {
      activeTab: 'todo' | 'done';
      onTabChange: (tab: 'todo' | 'done') => void;
    };

    export const TabButtons = ({ activeTab, onTabChange }: TabButtonsProps) => {
      return (
        <div className="flex shrink-0 border-b border-[var(--border)] bg-white">
          <button
            type="button"
            onClick={() => onTabChange('todo')}
            className={`flex-1 text-center py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'todo'
                ? 'text-teal-500 border-teal-500'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            To Do
          </button>
          <button
            type="button"
            onClick={() => onTabChange('done')}
            className={`flex-1 text-center py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'done'
                ? 'text-teal-500 border-teal-500'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Done
          </button>
        </div>
      );
    };
