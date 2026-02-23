import { useState, useEffect, useCallback } from 'react';
import { WorkOrder } from '../types/workOrder';
import { supabase } from '@/lib/supabase';
import { useSiteStore } from './useSiteStore';

let globalWorkOrders: WorkOrder[] = [];
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

const mapRow = (row: any): WorkOrder => ({
  ...row,
  workOrderNumber: row.work_order_number,
  workType: row.work_type,
  startDate: row.start_date,
  dueDate: row.due_date,
  completedAt: row.completed_at,
  assetId: row.asset_id,
  assetName: row.asset_name_snapshot,
  locationId: row.location_id,
  locationName: row.location_name_snapshot,
  categoryId: row.category_id,
  vendorId: row.vendor_id,
  assignedTo: row.assigned_to_text,
  assignedToUserId: row.assigned_to_user_id,
  isRepeating: row.is_repeating,
  createdByUserId: row.created_by_user_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  sections: [],
  attachments: [],
  parts: [],
  procedureInstances: [],
});

export const useWorkOrderStore = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(globalWorkOrders);

  useEffect(() => {
    const l = () => setWorkOrders([...globalWorkOrders]);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const loadWorkOrders = useCallback(async (siteId: string) => {
    if (!siteId) return;
    try {
      console.log("Loading work orders for site:", siteId);
      const { data, error } = await supabase
          .from("work_orders")
          .select("*, work_order_procedure_instances(*)")
          .eq("site_id", siteId)
          .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching work orders:", error);
        globalWorkOrders = [];
      } else {
        console.log('[loadWorkOrders] fetched:', data?.length, 'rows', data);
        globalWorkOrders = (data || []).map(row => {
          const wo = mapRow(row);
          if (row.work_order_procedure_instances) {
            wo.procedureInstances = row.work_order_procedure_instances.map((pi: any) => ({
              id: pi.id,
              procedureId: pi.procedure_id,
              procedureNameSnapshot: pi.procedure_name_snapshot,
              procedureVersionSnapshot: pi.procedure_version_snapshot,
              procedureSchemaSnapshot: pi.procedure_schema_snapshot,
              responses: pi.responses,
              createdAt: pi.created_at,
              updatedAt: pi.updated_at,
            }));
          }
          return wo;
        });
      }
      notify();
    } catch (error) {
      console.error("Failed to load work orders:", error);
      globalWorkOrders = [];
      notify();
    }
  }, []);

  const addWorkOrder = useCallback((wo: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber' | 'createdByUserId'>, onIdAssigned?: (tempId: string, realId: string) => void) => {
    const { activeSiteId, activeUserId } = useSiteStore.getState();
    console.log('[addWorkOrder] getState result:', { activeSiteId, activeUserId });
    if (!activeSiteId || !activeUserId) {
      console.error("Missing activeSiteId or activeUserId for work order creation");
      return {} as WorkOrder;
    }

    const tempId = crypto.randomUUID();
    const tempWO: WorkOrder = {
      ...wo,
      id: tempId,
      workOrderNumber: '...',
      createdByUserId: activeUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: wo.sections || [],
      attachments: wo.attachments || [],
    } as WorkOrder;

    globalWorkOrders = [tempWO, ...globalWorkOrders];
    notify();

    (async () => {
      try {
        const { data: lastWO, error: fetchError } = await supabase
            .from('work_orders')
            .select('work_order_number')
            .eq('site_id', activeSiteId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (fetchError) {
          console.error("Supabase error fetching last work order number:", fetchError);
        }

        let nextNumber = 1;
        if (lastWO && lastWO.work_order_number) {
          const match = lastWO.work_order_number.match(/#(\d+)/);
          if (match) {
            nextNumber = parseInt(match[1], 10) + 1;
          } else {
            const num = parseInt(lastWO.work_order_number.replace('#', ''), 10);
            if (!isNaN(num)) {
              nextNumber = num + 1;
            }
          }
        }

        const workOrderNumber = `#${nextNumber}`;
        console.log("Generated work order number:", workOrderNumber);

        const insertPayload = {
          site_id: activeSiteId,
          title: wo.title,
          description: wo.description || '',
          status: wo.status || 'Open',
          priority: wo.priority || 'Medium',
          due_date: wo.dueDate,
          start_date: wo.startDate || null,
          asset_id: wo.assetId || null,
          location_id: wo.locationId || null,
          work_type: wo.workType,
          work_order_number: workOrderNumber,
          created_by_user_id: activeUserId,
          updated_at: new Date().toISOString()
        };

        console.log('[addWorkOrder] insertPayload:', insertPayload);

        const { data, error } = await supabase
            .from('work_orders')
            .insert(insertPayload)
            .select()
            .single();

        console.log('[addWorkOrder] supabase response:', { data, error });

        if (error) throw error;

        console.log('[addWorkOrder] insert success, real id:', data.id, 'replacing tempId:', tempId);
        globalWorkOrders = globalWorkOrders.map(item => item.id === tempId ? mapRow(data) : item);
        if (onIdAssigned) onIdAssigned(tempId, data.id);
        notify();
      } catch (error) {
        console.error("Supabase error adding work order:", error);
        globalWorkOrders = globalWorkOrders.filter(item => item.id !== tempId);
        notify();
      }
    })();

    return tempWO;
  }, []);

  const updateWorkOrder = useCallback((id: string, updates: Partial<WorkOrder>) => {
    const originalWO = globalWorkOrders.find(wo => wo.id === id);
    if (!originalWO) return;

    globalWorkOrders = globalWorkOrders.map(wo =>
        wo.id === id ? { ...wo, ...updates, updatedAt: new Date().toISOString() } : wo
    );
    notify();

    (async () => {
      try {
        const dbUpdates: Record<string, any> = {
          updated_at: new Date().toISOString()
        };
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
        if (updates.workType !== undefined) dbUpdates.work_type = updates.workType;
        if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate || null;
        if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate || null;
        if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt || null;
        if (updates.assetId !== undefined) dbUpdates.asset_id = updates.assetId || null;
        if (updates.locationId !== undefined) dbUpdates.location_id = updates.locationId || null;
        if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId || null;
        if (updates.vendorId !== undefined) dbUpdates.vendor_id = updates.vendorId || null;
        if (updates.assignedTo !== undefined) dbUpdates.assigned_to_text = updates.assignedTo || null;
        if (updates.assignedToUserId !== undefined) dbUpdates.assigned_to_user_id = updates.assignedToUserId || null;
        if (updates.isRepeating !== undefined) dbUpdates.is_repeating = updates.isRepeating;

        // Persist procedure instances if they were updated
        if (updates.procedureInstances !== undefined) {
          // 1. Delete existing instances for this work order
          await supabase
            .from('work_order_procedure_instances')
            .delete()
            .eq('work_order_id', id);

          // 2. Insert new instances
          if (updates.procedureInstances.length > 0) {
            const inserts = updates.procedureInstances.map(pi => ({
              id: pi.id,
              work_order_id: id,
              procedure_id: pi.procedureId,
              procedure_name_snapshot: pi.procedureNameSnapshot,
              procedure_version_snapshot: pi.procedureVersionSnapshot,
              procedure_schema_snapshot: pi.procedureSchemaSnapshot,
              responses: pi.responses,
              created_at: pi.createdAt,
              updated_at: pi.updatedAt,
            }));

            const { error: insertError } = await supabase
              .from('work_order_procedure_instances')
              .insert(inserts);
            
            if (insertError) throw insertError;
          }
        }

        const { data, error } = await supabase
            .from('work_orders')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // When merging back, we MUST preserve the procedureInstances we just saved,
        // because mapRow(data) will set them to [] (since they are in a different table)
        globalWorkOrders = globalWorkOrders.map(wo => 
          wo.id === id 
            ? { ...mapRow(data), procedureInstances: updates.procedureInstances ?? originalWO.procedureInstances } 
            : wo
        );
        notify();
      } catch (error) {
        console.error("Error updating work order:", error);
        globalWorkOrders = globalWorkOrders.map(wo => wo.id === id ? originalWO : wo);
        notify();
      }
    })();
  }, []);

  const deleteWorkOrder = useCallback((id: string) => {
    const originalList = [...globalWorkOrders];
    console.log('[deleteWorkOrder] deleting id:', id);
    console.log('[deleteWorkOrder] current globalWorkOrders ids:', globalWorkOrders.map(wo => wo.id));

    globalWorkOrders = globalWorkOrders.filter(wo => wo.id !== id);
    notify();

    (async () => {
      try {
        const { error } = await supabase
            .from('work_orders')
            .delete()
            .eq('id', id);

        if (error) throw error;
        console.log('[deleteWorkOrder] delete success for id:', id);
      } catch (error) {
        console.error("Error deleting work order:", error);
        globalWorkOrders = originalList;
        notify();
      }
    })();
  }, []);

  const getWorkOrderById = useCallback((id: string) => {
    return globalWorkOrders.find(wo => wo.id === id);
  }, []);

  const getWorkOrdersByVendor = useCallback((vendorId: string) => {
    return globalWorkOrders.filter(wo => wo.vendorId === vendorId);
  }, []);

  const ensureActiveRecurringInstances = useCallback(() => {
    // No-op for now
  }, []);

  return {
    workOrders,
    loadWorkOrders,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getWorkOrderById,
    getWorkOrdersByVendor,
    ensureActiveRecurringInstances
  };
};