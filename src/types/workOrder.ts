export type WorkOrderStatus = 'Open' | 'On Hold' | 'In Progress' | 'Done';
export type WorkOrderPriority = 'Low' | 'Medium' | 'High';
export type WorkType = 'Preventive' | 'Corrective' | 'Inspection' | 'Other';

export interface AssignedUser {
  name: string;
  imageUrl?: string;
}

export interface AssignedTeam {
  name: string;
  initials: string;
  color: string;
}

export type FieldType = 
  | 'checkbox' 
  | 'multi-checkbox' 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'photo' 
  | 'meter' 
  | 'signature' 
  | 'timestamp';

export interface FieldValue {
  value?: any;
  attachments?: Attachment[];
  timestamp?: string;
}

export interface WorkOrderField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // For select or multi-checkbox
  unit?: string;      // For meter
  placeholder?: string;
  value?: any;        // Current value
  attachments?: Attachment[];
}

export interface WorkOrderSection {
  id: string;
  title: string;
  type: 'checklist' | 'text' | 'photos' | 'meters' | 'mixed';
  required?: boolean;
  fields: WorkOrderField[];
  isCollapsed?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // mime type
  url: string;  // base64 or blob url
  size: number;
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  dueDate: string;
  assignedTo: string; // user or role string
  assignedUsers?: AssignedUser[];
  assignedTeams?: AssignedTeam[];
  asset: string;
  assetImageUrl?: string;
  location: string;
  categories: string[];
  workType: WorkType;
  workOrderNumber: string;
  sections: WorkOrderSection[];
  attachments: Attachment[]; // Global attachments
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderStore {
  workOrders: WorkOrder[];
  addWorkOrder: (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber'>) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  getWorkOrderById: (id: string) => WorkOrder | undefined;
}
