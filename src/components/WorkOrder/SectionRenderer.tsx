import React, { useState } from 'react';
import { WorkOrderSection, WorkOrderField } from '../../types/workOrder';
import { FieldRenderer } from './FieldRenderer';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SectionRendererProps {
  section: WorkOrderSection;
  onUpdate: (updates: Partial<WorkOrderSection>) => void;
  disabled?: boolean;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, onUpdate, disabled }) => {
  const [isCollapsed, setIsCollapsed] = useState(section.isCollapsed || false);

  const updateField = (fieldId: string, fieldUpdates: Partial<WorkOrderField>) => {
    if (!Array.isArray(section.fields)) return;
    const updatedFields = section.fields.map(f => 
      f.id === fieldId ? { ...f, ...fieldUpdates } : f
    );
    onUpdate({ fields: updatedFields });
  };

  const isCompleted = Array.isArray(section.fields) && section.fields.length > 0 && section.fields.every(f => {
    if (!f.required) return true;
    if (f.type === 'photo') return Array.isArray(f.attachments) && f.attachments.length > 0;
    return !!f.value;
  });

  const hasIncompleteRequired = Array.isArray(section.fields) && section.fields.some(f => 
    f.required && (f.type === 'photo' ? (!Array.isArray(f.attachments) || f.attachments.length === 0) : !f.value)
  );

  return (
    <div className={`border rounded-lg mb-4 overflow-hidden transition-all ${
      hasIncompleteRequired ? 'border-amber-200' : 'border-gray-200'
    }`}>
      <div 
        className={`px-4 py-3 flex items-center justify-between cursor-pointer select-none ${
          hasIncompleteRequired ? 'bg-amber-50' : 'bg-gray-50'
        }`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-3">
          {section.required && (
            isCompleted ? (
              <CheckCircle2 size={18} className="text-teal-500" />
            ) : (
              <AlertCircle size={18} className="text-amber-500" />
            )
          )}
          <h3 className="font-semibold text-sm text-gray-800 uppercase tracking-tight">
            {section.title}
            {section.required && <span className="ml-1 text-red-500">*</span>}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {isCollapsed ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronUp size={18} className="text-gray-400" />}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="px-4 py-2 divide-y divide-gray-100 bg-white">
          {Array.isArray(section.fields) && section.fields.map(field => (
            <FieldRenderer 
              key={field.id} 
              field={field} 
              disabled={disabled}
              onUpdate={(updates) => updateField(field.id, updates)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
