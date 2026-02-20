import React, { useState, useMemo } from 'react';
import { useProcedureStore } from '@/store/useProcedureStore';
import { Search, X, ClipboardList } from 'lucide-react';

interface ProcedureSelectorProps {
  onSelect: (procedureId: string) => void;
  onCancel: () => void;
}

export const ProcedureSelector: React.FC<ProcedureSelectorProps> = ({ onSelect, onCancel }) => {
  const { procedures, search } = useProcedureStore();
  const [query, setQuery] = useState('');

  const filteredProcedures = useMemo(() => {
    return search(query);
  }, [search, query]);

  return (
    <div className="bg-white border border-[var(--border)] rounded-lg shadow-lg flex flex-col h-[500px] w-full max-w-md overflow-hidden">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-800">Attach Procedure</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b border-[var(--border)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search procedures..."
            className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredProcedures.length > 0 ? (
          filteredProcedures.map((proc) => (
            <button
              key={proc.id}
              onClick={() => onSelect(proc.id)}
              className="w-full flex items-center p-3 text-left hover:bg-blue-50 rounded-md transition-colors group"
            >
              <div className="h-10 w-10 bg-sky-100 rounded-lg flex items-center justify-center text-blue-500 mr-3 group-hover:bg-blue-100 transition-colors">
                <ClipboardList size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">{proc.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                  <span>v{proc.meta.version}</span>
                  <span>•</span>
                  <span>{proc.meta.fieldCount} fields</span>
                  <span>•</span>
                  <span>Updated {new Date(proc.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ClipboardList className="mx-auto mb-2 opacity-20" size={48} />
            <p className="text-sm">No procedures found</p>
          </div>
        )}
      </div>
    </div>
  );
};
