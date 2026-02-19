// Procedure Library data model
// Designed to support builder UI per reference PDF and future backend extension

export type ProcedureId = string;
export type ProcedureItemId = string;
export type ProcedureSectionId = string;

export interface ProcedureMeta {
  version: number; // increment on save
  fieldCount: number; // computed for UI
}

export interface Procedure {
  id: ProcedureId;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  sections: ProcedureSection[];
  meta: ProcedureMeta;
}

export interface ProcedureSection {
  id: ProcedureSectionId;
  title: string;
  items: ProcedureItem[]; // mixed fields/blocks
  orderIndex: number;
}

// Base for all items
export interface ProcedureItemBase {
  id: ProcedureItemId;
  label?: string; // display label or title depending on type
  required?: boolean; // where applicable
  helpText?: string; // helper/notes shown under label
  orderIndex: number;
  kind: ProcedureItemKind;
}

// Supported kinds per PDF
export type ProcedureItemKind =
  | 'Heading'
  | 'TextBlock'
  | 'TextInput'
  | 'NumberInput'
  | 'MultipleChoice'
  | 'YesNoNA'
  | 'Inspection'
  | 'Date'
  | 'Photo'
  | 'File'
  | 'Signature'
  | 'MeterReading';

export interface HeadingItem extends ProcedureItemBase {
  kind: 'Heading';
  level?: 1 | 2 | 3; // for styling if needed
}

export interface TextBlockItem extends ProcedureItemBase {
  kind: 'TextBlock';
  text?: string; // static instructions/paragraph (non-input)
}

export interface TextInputItem extends ProcedureItemBase {
  kind: 'TextInput';
  multiline?: boolean; // text vs notes
  placeholder?: string;
  maxLength?: number;
}

export interface NumberInputItem extends ProcedureItemBase {
  kind: 'NumberInput';
  unit?: string; // optional unit display
  min?: number;
  max?: number;
  step?: number;
}

export interface MultipleChoiceItem extends ProcedureItemBase {
  kind: 'MultipleChoice';
  options: string[];
  otherOption?: boolean; // include "Other"
}

export interface YesNoNAItem extends ProcedureItemBase {
  kind: 'YesNoNA';
}

export interface InspectionItem extends ProcedureItemBase {
  kind: 'Inspection'; // Pass / Flag / Fail
}

export interface DateItem extends ProcedureItemBase {
  kind: 'Date';
}

export interface PhotoItem extends ProcedureItemBase {
  kind: 'Photo'; // images only for now
  multiple?: boolean; // allow multiple
}

export interface FileItem extends ProcedureItemBase {
  kind: 'File'; // generic files (may reuse photo UI later)
  multiple?: boolean;
}

export interface SignatureItem extends ProcedureItemBase {
  kind: 'Signature';
}

export interface MeterReadingItem extends ProcedureItemBase {
  kind: 'MeterReading';
  meterId?: string; // optional selected meter id (for later linking)
  allowedMeterIds?: string[]; // optional restriction list
  unit?: string; // derived from meter typically
}

export type ProcedureItem =
  | HeadingItem
  | TextBlockItem
  | TextInputItem
  | NumberInputItem
  | MultipleChoiceItem
  | YesNoNAItem
  | InspectionItem
  | DateItem
  | PhotoItem
  | FileItem
  | SignatureItem
  | MeterReadingItem;

// Instance values structure to be used when attached to a work order
export type ProcedureFieldValue = any;

export interface ProcedureInstance {
  id: string;
  procedureId: ProcedureId;
  name: string;
  version: number; // snapshot version from meta
  attachedAt: string;
  // capture responses per item id
  responses: Record<ProcedureItemId, ProcedureFieldValue>;
  // optional attachments mapping for photo/file/signature
  attachments?: Record<ProcedureItemId, import('./workOrder').Attachment[]>; // reuse attachment shape
  // snapshot of structure for reference (optional for offline view)
  snapshot?: {
    sections: ProcedureSection[];
  };
}
