import { useState, useEffect, useCallback } from 'react';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority, WorkType } from '../types/workOrder';
import { DEFAULT_SECTIONS } from '../utils/defaultSections';

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
    dueDate: "2026-06-02",
    assignedTo: "Pedro Modesto",
    assignedUsers: [
      { name: "Pedro Modesto", imageUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png" }
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
    updatedAt: new Date().toISOString()
  }
];

export const useWorkOrderStore = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  // Hydrate state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWorkOrders(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved work orders', e);
        setWorkOrders(SEED_DATA);
      }
    } else {
      setWorkOrders(SEED_DATA);
    }
  }, []);

  // Persist state to localStorage on changes
  useEffect(() => {
    if (workOrders.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workOrders));
    }
  }, [workOrders]);

  const addWorkOrder = useCallback((wo: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber'>) => {
    const newWo: WorkOrder = {
      ...wo,
      id: crypto.randomUUID(),
      workOrderNumber: `#${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setWorkOrders(prev => [...prev, newWo]);
    return newWo;
  }, []);

  const updateWorkOrder = useCallback((id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === id) {
        return {
          ...wo,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return wo;
    }));
  }, []);

  const deleteWorkOrder = useCallback((id: string) => {
    setWorkOrders(prev => prev.filter(wo => wo.id !== id));
  }, []);

  const getWorkOrderById = useCallback((id: string) => {
    return workOrders.find(wo => wo.id === id);
  }, [workOrders]);

  return {
    workOrders,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getWorkOrderById
  };
};
