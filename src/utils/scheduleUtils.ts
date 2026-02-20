import { WorkOrder } from '../types/workOrder';

// Calendar event type consumed by the CalendarView
export interface CalendarEvent {
  id: string; // `${workOrderId}:${occurrenceDate}`
  workOrderId: string;
  occurrenceDate: string; // ISO date (YYYY-MM-DD), normalized to UTC start-of-day
  title: string;
  status: WorkOrder['status'];
  priority: WorkOrder['priority'];
  assignedTo: string;
}

// Helper: identify recurring work order templates in this codebase
// We treat a WO as recurring when it has isRepeating true and a schedule with a frequency
export const isRecurring = (wo: WorkOrder): boolean => !!(wo.isRepeating && wo.schedule && wo.schedule.frequency);

// Helper: robustly get YYYY-MM-DD from a Date object (either UTC or local)
export const toDateStr = (d: Date, useUTC = true): string => {
  if (useUTC) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Expand a single recurring template into its occurrence dates for a range
export const expandOccurrences = (
  workOrder: WorkOrder,
  startDate: Date, // Expected: normalized to start of day (UTC)
  endDate: Date    // Expected: normalized to end of day (UTC)
): CalendarEvent[] => {
  if (!isRecurring(workOrder)) return [];

  const events: CalendarEvent[] = [];
  const schedule = workOrder.schedule!;
  
  // Parse startDate as UTC to avoid TZ issues
  const seed = new Date(schedule.startDate + (schedule.startDate.includes('T') ? '' : 'T00:00:00Z'));
  const rangeEnd = schedule.endDate ? new Date(schedule.endDate + (schedule.endDate.includes('T') ? '' : 'T00:00:00Z')) : endDate;

  // Clamp the scan window
  const actualStart = seed > startDate ? seed : startDate;
  const actualEnd = rangeEnd < endDate ? rangeEnd : endDate;
  
  if (actualStart > actualEnd) return [];

  // Step through occurrences starting from seed
  let current = new Date(seed.getTime());
  while (current.getTime() <= actualEnd.getTime()) {
    if (current.getTime() >= actualStart.getTime()) {
      const dateStr = toDateStr(current, true);
      events.push({
        id: `${workOrder.id}:${dateStr}`,
        workOrderId: workOrder.id,
        occurrenceDate: dateStr,
        title: workOrder.title,
        status: workOrder.status,
        priority: workOrder.priority,
        assignedTo: workOrder.assignedTo,
      });
    }

    // Step by frequency
    const freq = schedule.frequency;
    if (freq === 'weekly') current.setUTCDate(current.getUTCDate() + 7);
    else if (freq === 'monthly') current.setUTCMonth(current.getUTCMonth() + 1);
    else if (freq === 'quarterly') current.setUTCMonth(current.getUTCMonth() + 3);
    else break;
  }

  return events;
};

// Expand all work orders for a given range into calendar events
export const expandOccurrencesForRange = (
  workOrders: WorkOrder[],
  startDate: Date,
  endDate: Date
): CalendarEvent[] => {
  const out: CalendarEvent[] = [];
  const startStr = toDateStr(startDate, true);
  const endStr = toDateStr(endDate, true);

  for (const wo of workOrders) {
    if (isRecurring(wo)) {
      out.push(...expandOccurrences(wo, startDate, endDate));
    } else if (wo.dueDate) {
      // Non-recurring work orders: show on dueDate if within range
      const dStr = wo.dueDate.split('T')[0];
      if (dStr >= startStr && dStr <= endStr) {
        out.push({
          id: wo.id,
          workOrderId: wo.id,
          occurrenceDate: dStr,
          title: wo.title,
          status: wo.status,
          priority: wo.priority,
          assignedTo: wo.assignedTo,
        });
      }
    }
  }
  return out;
};

/**
 * Creates a concrete WorkOrder instance from a recurring template for a specific date.
 * Does NOT persist to store; returns the Omit-style draft used by addWorkOrder.
 */
export const instantiateFromTemplate = (
  template: WorkOrder,
  dateISO: string
): Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber' | 'createdByUserId'> => {
  return {
    title: template.title,
    description: template.description,
    status: 'Open',
    priority: template.priority,
    startDate: dateISO, // Use the occurrence date as start date
    dueDate: dateISO,   // Use the occurrence date as due date (can be refined if needed)
    assignedTo: template.assignedTo,
    assignedUsers: template.assignedUsers ? JSON.parse(JSON.stringify(template.assignedUsers)) : [],
    assetId: template.assetId,
    assetImageUrl: template.assetImageUrl,
    location: template.location,
    categories: template.categories ? [...template.categories] : [],
    categoryId: template.categoryId,
    vendorId: template.vendorId,
    workType: template.workType,
    sections: [], // Start blank; procedures drive content
    procedureInstances: template.procedureInstances ? JSON.parse(JSON.stringify(template.procedureInstances)) : [],
    attachments: [],
    isRepeating: false, // Instances are not repeating
    parentWorkOrderId: template.id,
    occurrenceDate: dateISO,
    totalTimeHours: 0,
    totalCost: 0,
  };
};
