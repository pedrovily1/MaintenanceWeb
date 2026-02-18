import { useState, useEffect, useCallback } from 'react';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority, WorkType } from '../types/workOrder';
import { DEFAULT_SECTIONS } from '../utils/defaultSections';
import { useUserStore } from './useUserStore';
import { expandOccurrences, instantiateFromTemplate } from '../utils/scheduleUtils';

const STORAGE_KEY = 'workorders_v3';

const SEED_DATA: WorkOrder[] = [
  {
    id: "86733636",
    title: "Weekly Maintenance Service",
    description: "Perform routine weekly maintenance on HVAC system.",
    workOrderNumber: "#411",
    asset: "0-GENERAL PURPOSE",
    assetImageUrl: "https://app.getmaintainx.com/img/fbfb6507-4423-4d18-bf98-55359a5e8f7b_processed_image10.png?w=96&h=96&rmode=crop",
    status: "Open",
    priority: "Low",
    startDate: "2026-06-01",
    dueDate: "2026-06-02",
    assignedTo: "Admin",
    assignedUsers: [
      { name: "Admin", imageUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png" }
    ],
    assignedTeams: [
      { name: "Site Maintenance", initials: "SM", color: "bg-pink-500" }
    ],
    location: "Main Building",
    categories: ["Maintenance"],
    workType: "Preventive",
    sections: DEFAULT_SECTIONS,
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRepeating: true,
    createdByUserId: "admin-001",
    assignedToUserId: "admin-001",
    schedule: {
      frequency: 'weekly',
      startDate: "2026-02-01",
    }
  },
  {
    id: "86733637",
    title: "Monthly Fire Extinguisher Inspection",
    description: "Check all fire extinguishers on floor 1.",
    workOrderNumber: "#412",
    asset: "Fire Safety Equipment",
    status: "Open",
    priority: "Medium",
    startDate: "2026-02-14",
    dueDate: "2026-02-15",
    assignedTo: "Admin",
    location: "Floor 1",
    categories: ["Safety"],
    workType: "Inspection",
    sections: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRepeating: true,
    createdByUserId: "admin-001",
    assignedToUserId: "admin-001",
    schedule: {
      frequency: 'monthly',
      startDate: "2026-01-15",
    }
  }
];

let globalWorkOrders: WorkOrder[] = [];
const listeners = new Set<() => void>();

// Hydrate from localStorage once
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    globalWorkOrders = JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved work orders', e);
    globalWorkOrders = SEED_DATA;
  }
} else {
  globalWorkOrders = SEED_DATA;
}

const notify = () => {
  listeners.forEach(l => l());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(globalWorkOrders));
};

export const useWorkOrderStore = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(globalWorkOrders);
  const { activeUserId } = useUserStore();

  useEffect(() => {
    const l = () => setWorkOrders([...globalWorkOrders]);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const addWorkOrder = useCallback((wo: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber' | 'createdByUserId'>) => {
    const newWo: WorkOrder = {
      ...wo,
      id: crypto.randomUUID(),
      workOrderNumber: `#${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByUserId: activeUserId || 'admin-001'
    };
    globalWorkOrders = [...globalWorkOrders, newWo];
    notify();
    return newWo;
  }, [activeUserId]);

  const updateWorkOrder = useCallback((id: string, updates: Partial<WorkOrder>) => {
    let nextWoToCreate: any = null;
    globalWorkOrders = globalWorkOrders.map(wo => {
      if (wo.id === id) {
        const updated = {
          ...wo,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        // PART 1 logic: Generate next instance after completion
        if (updates.status === 'Done' && wo.status !== 'Done' && wo.parentWorkOrderId && wo.occurrenceDate) {
          const template = globalWorkOrders.find(t => t.id === wo.parentWorkOrderId && t.isRepeating);
          if (template && template.schedule) {
            // Calculate next date after wo.occurrenceDate
            const currentOcc = new Date(wo.occurrenceDate + 'T00:00:00Z');
            const nextOcc = new Date(currentOcc.getTime());
            const freq = template.schedule.frequency;
            if (freq === 'weekly') nextOcc.setUTCDate(nextOcc.getUTCDate() + 7);
            else if (freq === 'monthly') nextOcc.setUTCMonth(nextOcc.getUTCMonth() + 1);
            else if (freq === 'quarterly') nextOcc.setUTCMonth(nextOcc.getUTCMonth() + 3);

            const nextDateStr = nextOcc.toISOString().split('T')[0];
            
            // Check if next already exists (safety)
            const alreadyExists = globalWorkOrders.some(w => w.parentWorkOrderId === template.id && w.occurrenceDate === nextDateStr);
            if (!alreadyExists) {
              nextWoToCreate = instantiateFromTemplate(template, nextDateStr);
            }
          }
        }
        return updated;
      }
      return wo;
    });

    if (nextWoToCreate) {
      const newWo: WorkOrder = {
        ...nextWoToCreate,
        id: crypto.randomUUID(),
        workOrderNumber: `#${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByUserId: activeUserId || 'admin-001'
      };
      globalWorkOrders = [...globalWorkOrders, newWo];
    }

    notify();
  }, [activeUserId]);

  const deleteWorkOrder = useCallback((id: string) => {
    globalWorkOrders = globalWorkOrders.filter(wo => wo.id !== id);
    notify();
  }, []);

  const getWorkOrderById = useCallback((id: string) => {
    return globalWorkOrders.find(wo => wo.id === id);
  }, []);

  const getWorkOrdersByVendor = useCallback((vendorId: string) => {
    return globalWorkOrders.filter(wo => wo.vendorId === vendorId);
  }, []);

  const ensureActiveRecurringInstances = useCallback(() => {
    let modified = false;
    const templates = globalWorkOrders.filter(wo => !!(wo.isRepeating && wo.schedule));
    
    templates.forEach(template => {
      // Check if there is an active (not 'Done') instance for this template
      const activeInstance = globalWorkOrders.find(wo => wo.parentWorkOrderId === template.id && wo.status !== 'Done');
      
      if (!activeInstance) {
        // Find the most recent completed instance to determine next date
        const instances = globalWorkOrders
          .filter(wo => wo.parentWorkOrderId === template.id && wo.occurrenceDate)
          .sort((a, b) => (b.occurrenceDate || '').localeCompare(a.occurrenceDate || ''));
        
        let nextDateStr: string;
        if (instances.length > 0 && instances[0].occurrenceDate) {
          const lastOcc = new Date(instances[0].occurrenceDate + 'T00:00:00Z');
          const nextOcc = new Date(lastOcc.getTime());
          const freq = template.schedule!.frequency;
          if (freq === 'weekly') nextOcc.setUTCDate(nextOcc.getUTCDate() + 7);
          else if (freq === 'monthly') nextOcc.setUTCMonth(nextOcc.getUTCMonth() + 1);
          else if (freq === 'quarterly') nextOcc.setUTCMonth(nextOcc.getUTCMonth() + 3);
          nextDateStr = nextOcc.toISOString().split('T')[0];
        } else {
          // No instances yet, use template start date
          nextDateStr = template.schedule!.startDate;
        }

        // Only create if it doesn't exist
        const alreadyExists = globalWorkOrders.some(w => w.parentWorkOrderId === template.id && w.occurrenceDate === nextDateStr);
        if (!alreadyExists) {
          const draft = instantiateFromTemplate(template, nextDateStr);
          const newWo: WorkOrder = {
            ...draft,
            id: crypto.randomUUID(),
            workOrderNumber: `#${Math.floor(Math.random() * 10000)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdByUserId: template.createdByUserId || 'admin-001'
          };
          globalWorkOrders = [...globalWorkOrders, newWo];
          modified = true;
        }
      }
    });

    if (modified) {
      notify();
    }
  }, []);

  return {
    workOrders,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getWorkOrderById,
    getWorkOrdersByVendor,
    ensureActiveRecurringInstances
  };
};
