import { useMemo, useState, useCallback } from 'react';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { expandOccurrencesForRange, CalendarEvent } from '@/utils/scheduleUtils';
import { WorkOrder } from '@/types/workOrder';
import { useFilterStore } from '@/store/useFilterStore';

// Simple date utilities
const toISODate = (d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().split('T')[0];
const startOfMonth = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
const endOfMonth = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
const startOfWeek = (d: Date) => {
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1) - day; // Monday as first day
  const res = new Date(d);
  res.setDate(d.getDate() + diff);
  res.setHours(0,0,0,0);
  return res;
};
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(d.getDate() + n); return x; };
const isSameDay = (a: Date, b: Date) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

export const CalendarView = () => {
  const { workOrders, addWorkOrder, updateWorkOrder } = useWorkOrderStore();
  const { search, assignedTo, location, priority, dueDate } = useFilterStore();
  const [mode, setMode] = useState<'month' | 'week'>('month');
  const [cursor, setCursor] = useState<Date>(new Date());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  // Visible range
  const range = useMemo(() => {
    if (mode === 'month') {
      return { start: startOfMonth(cursor), end: endOfMonth(cursor) };
    }
    const start = startOfWeek(cursor);
    const end = addDays(start, 6);
    return { start, end };
  }, [mode, cursor]);

  // Filter work orders (both recurring and non-recurring) before expansion
  const filteredWorkOrders = useMemo(() => {
    const list = workOrders || [];
    return list.filter(w => {
      if (assignedTo && (!w.assignedTo || w.assignedTo !== assignedTo)) return false;
      if (location && w.location !== location) return false;
      if (priority && w.priority !== (priority as any)) return false;
      if (search) {
        const term = search.toLowerCase();
        const hay = [w.title, w.asset, w.assignedTo, w.location].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [workOrders, assignedTo, location, priority, search]);

  const eventsByDay = useMemo(() => {
    const events: CalendarEvent[] = expandOccurrencesForRange(filteredWorkOrders as WorkOrder[], range.start, range.end);
    // Optional due date filter (apply to occurrence date)
    const filtered = dueDate ? events.filter(e => e.occurrenceDate === dueDate) : events;

    if (import.meta.env.DEV) {
      // Debug aids (dev only)
      // eslint-disable-next-line no-console
      console.debug('[Calendar] filtered WOs:', filteredWorkOrders.length, 'range:', range.start.toISOString(), range.end.toISOString(), 'events:', filtered.length);
    }

    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of filtered) {
      if (!map[ev.occurrenceDate]) map[ev.occurrenceDate] = [];
      map[ev.occurrenceDate].push(ev);
    }
    Object.keys(map).forEach(d => {
      map[d].sort((a,b) => {
        const prio = (x: CalendarEvent) => x.priority === 'High' ? 0 : x.priority === 'Medium' ? 1 : 2;
        const s = prio(a) - prio(b);
        return s !== 0 ? s : a.title.localeCompare(b.title);
      });
    });
    return map;
  }, [filteredWorkOrders, range.start, range.end, dueDate]);

  const days = useMemo(() => {
    if (mode === 'week') {
      const start = startOfWeek(cursor);
      return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }
    // Month grid (Mon-Sun, 5-6 rows)
    const first = startOfMonth(cursor);
    const gridStart = startOfWeek(first);
    const arr: Date[] = [];
    for (let i = 0; i < 42; i++) arr.push(addDays(gridStart, i));
    return arr;
  }, [mode, cursor]);

  const createOrOpenOccurrence = useCallback((template: WorkOrder, dateISO: string) => {
    // If instance exists for this date, open it. Otherwise create from template (Option A preferred).
    const existing = template.occurrenceInstances?.[dateISO];
    if (existing) {
      setSelectedId(existing);
      return;
    }
    // Instantiate a concrete WorkOrder instance from template
    const instance: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber'> = {
      title: template.title,
      description: template.description,
      status: 'Open',
      priority: template.priority,
      dueDate: dateISO,
      assignedTo: template.assignedTo,
      assignedUsers: template.assignedUsers,
      assignedTeams: template.assignedTeams,
      asset: template.asset,
      assetImageUrl: template.assetImageUrl,
      location: template.location,
      categories: template.categories,
      workType: template.workType,
      sections: [], // Start blank; procedures drive content
      procedureInstances: template.procedureInstances ? JSON.parse(JSON.stringify(template.procedureInstances)) : [],
      attachments: [],
      isRepeating: false,
      parentWorkOrderId: template.id,
      occurrenceDate: dateISO,
      totalTimeHours: 0,
      totalCost: 0,
    };
    const created = addWorkOrder(instance) as unknown as WorkOrder; // store returns new WO in our impl
    // Persist mapping on template for future clicks
    const map = { ...(template.occurrenceInstances || {}) };
    map[dateISO] = created.id;
    updateWorkOrder(template.id, { occurrenceInstances: map });
    setSelectedId(created.id);
  }, [addWorkOrder, updateWorkOrder]);

  const prev = () => setCursor(prev => mode === 'month' ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1) : addDays(prev, -7));
  const next = () => setCursor(prev => mode === 'month' ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1) : addDays(prev, 7));
  const today = () => setCursor(new Date());

  const renderDayCell = (d: Date, idx: number) => {
    const dateISO = toISODate(d);
    const items = eventsByDay[dateISO] || [];
    const showCount = 3; // max visible per cell
    const isOtherMonth = mode === 'month' && d.getMonth() !== cursor.getMonth();
    const expanded = !!expandedDays[dateISO];

    return (
      <div key={idx} className={`border border-zinc-200 p-1 min-h-[96px] ${isOtherMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className={`font-medium ${isSameDay(d, new Date()) ? 'text-blue-600' : ''}`}>{d.getDate()}</span>
          {mode === 'week' && <span className="text-gray-400">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>}
        </div>

        {(expanded ? items : items.slice(0, showCount)).map((o, i) => (
          <button
            key={i}
            onClick={() => {
              const wo = (workOrders || []).find(w => w.id === o.workOrderId) as WorkOrder | undefined;
              if (!wo) return;
              // If recurring template, create/open occurrence; else open the existing WO directly
              if (wo.isRepeating && wo.schedule) {
                createOrOpenOccurrence(wo, o.occurrenceDate);
              } else {
                setSelectedId(wo.id);
              }
            }}
            className={`w-full text-left mb-1 px-1.5 py-0.5 rounded text-[11px] border ${o.priority === 'High' ? 'bg-red-50 border-red-200 text-red-600' : o.priority === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-sky-50 border-sky-200 text-sky-700'}`}
            title={o.title}
          >
            <span className="font-semibold mr-1">{o.title}</span>
            <span className="opacity-70">• {o.assignedTo}</span>
          </button>
        ))}

        {items.length > showCount && !expanded && (
          <button
            className="text-[11px] text-blue-600 hover:text-blue-500"
            onClick={() => setExpandedDays(prev => ({ ...prev, [dateISO]: true }))}
          >
            +{items.length - showCount} more
          </button>
        )}
        {expanded && (
          <button
            className="text-[11px] text-blue-600 hover:text-blue-500"
            onClick={() => setExpandedDays(prev => ({ ...prev, [dateISO]: false }))}
          >
            Show less
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mx-2 lg:mx-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">
            {cursor.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
          </div>
          <div className="inline-flex border border-zinc-200 rounded overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${mode === 'month' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setMode('month')}
            >
              Month
            </button>
            <button
              className={`px-3 py-1 text-sm border-l border-zinc-200 ${mode === 'week' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setMode('week')}
            >
              Week
            </button>
          </div>
          <div className="inline-flex border border-zinc-200 rounded overflow-hidden ml-2">
            <button className="px-2 py-1 text-sm" onClick={prev}>Prev</button>
            <button className="px-2 py-1 text-sm border-l border-zinc-200" onClick={today}>Today</button>
            <button className="px-2 py-1 text-sm border-l border-zinc-200" onClick={next}>Next</button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Recurring Work Orders
        </div>
      </div>

      {/* Grid */}
      <div className={mode === 'month' ? 'grid grid-cols-7 gap-0' : 'grid grid-cols-7 gap-0'}>
        {days.map((d, i) => renderDayCell(d, i))}
      </div>

      {/* Modal */}
      {selectedId && (
        <WorkOrderModal workOrderId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
};

// Lazy import to avoid circulars in type analysis
import { WorkOrderModal } from '@/components/WorkOrder/WorkOrderModal';
