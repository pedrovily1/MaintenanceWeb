import { Procedure, ProcedureItem, ProcedureSection } from '@/types/procedure';
import { WorkOrderSection, WorkOrderField } from '@/types/workOrder';

// Map a Procedure definition to WorkOrder sections/fields for execution.
export const procedureToWorkOrderSections = (proc: Procedure): WorkOrderSection[] => {
  const sections: WorkOrderSection[] = [];

  for (const s of proc.sections) {
    const fields: WorkOrderField[] = [];

    for (const item of s.items) {
      const f = mapItemToField(item);
      if (f) fields.push(f);
    }

    if (fields.length > 0) {
      sections.push({
        id: `proc-${proc.id}-${s.id}`,
        title: s.title,
        type: 'mixed',
        required: false,
        fields,
        isCollapsed: false,
      });
    }
  }

  return sections;
};

const mapItemToField = (item: ProcedureItem): WorkOrderField | null => {
  switch (item.kind) {
    case 'TextInput':
      return {
        id: item.id,
        label: item.label || 'Text',
        type: item.multiline ? 'textarea' : 'text',
        required: item.required,
        placeholder: (item as any).placeholder,
      };
    case 'NumberInput':
      return {
        id: item.id,
        label: item.label || 'Number',
        type: 'meter',
        required: item.required,
        unit: (item as any).unit,
      };
    case 'MultipleChoice':
      return {
        id: item.id,
        label: item.label || 'Multiple Choice',
        type: 'select',
        required: item.required,
        options: [...((item as any).options || []), ((item as any).otherOption ? 'Other' : undefined)].filter(Boolean) as string[],
      };
    case 'YesNoNA':
      return {
        id: item.id,
        label: item.label || 'Yes / No / N/A',
        type: 'yesno_na',
        required: item.required,
      };
    case 'Inspection':
      return {
        id: item.id,
        label: item.label || 'Inspection',
        type: 'inspection',
        required: item.required,
      };
    case 'Date':
      return {
        id: item.id,
        label: item.label || 'Date',
        type: 'date',
        required: item.required,
      };
    case 'Photo':
      return {
        id: item.id,
        label: item.label || 'Photos',
        type: 'photo',
        required: item.required,
      };
    case 'File':
      return {
        id: item.id,
        label: item.label || 'Files',
        type: 'file',
        required: item.required,
      };
    case 'Signature':
      return {
        id: item.id,
        label: item.label || 'Signature',
        type: 'signature',
        required: item.required,
      };
    case 'MeterReading':
      return {
        id: item.id,
        label: item.label || 'Meter Reading',
        type: 'meter',
        required: item.required,
        unit: (item as any).unit,
        meterId: (item as any).meterId,
        allowedMeterIds: (item as any).allowedMeterIds,
        value: (item as any).meterId ? { meterId: (item as any).meterId } : undefined,
      };
    case 'Heading':
    case 'TextBlock':
    default:
      return null; // non-inputs are ignored in WO section fields
  }
};
