import { useState, useEffect, useCallback, useMemo } from 'react';
import { Procedure, ProcedureSection, ProcedureItem, ProcedureItemKind } from '../types/procedure';
import { procedurePersistence } from '../services/procedurePersistence';

const SEED: Procedure[] = [];

const newId = () => crypto.randomUUID();

let globalProcedures: Procedure[] = procedurePersistence.load();
const listeners = new Set<() => void>();

function useProcedureCount() {
  const [count, setCount] = useState(globalProcedures.length);

  useEffect(() => {
    const l = () => setCount(globalProcedures.length);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return count;
}

const notify = () => {
  listeners.forEach(l => l());
  procedurePersistence.saveDebounced(globalProcedures);
};

function useProcedureStore() {
  const [procedures, setProcedures] = useState<Procedure[]>(globalProcedures);

  useEffect(() => {
    const l = () => setProcedures([...globalProcedures]);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const computeFieldCount = (p: Procedure) => {
    // Count only input-capable items (exclude Heading/TextBlock)
    const inputKinds: ProcedureItemKind[] = ['TextInput','NumberInput','MultipleChoice','YesNoNA','Inspection','Date','Photo','File','Signature','MeterReading'];
    return p.sections.reduce((acc, s) => acc + s.items.filter(i => inputKinds.includes(i.kind)).length, 0);
  };

  const addProcedure = useCallback((name?: string): Procedure => {
    const now = new Date().toISOString();
    const p: Procedure = {
      id: newId(),
      name: name || 'Untitled Procedure',
      description: '',
      createdAt: now,
      updatedAt: now,
      meta: { version: 1, fieldCount: 0 },
      sections: [
        {
          id: newId(),
          title: '',
          orderIndex: 0,
          items: []
        }
      ]
    };
    p.meta.fieldCount = computeFieldCount(p);
    globalProcedures = [...globalProcedures, p];
    notify();
    return p;
  }, []);

  const updateProcedure = useCallback((id: string, patch: Partial<Procedure>) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== id) return p;
      const updated: Procedure = {
        ...p,
        ...patch,
        updatedAt: new Date().toISOString(),
        meta: {
          ...p.meta,
          version: (p.meta?.version || 0) + 1
        }
      } as Procedure;
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  const deleteProcedure = useCallback((id: string) => {
    // Delete by stable ID to ensure precision
    globalProcedures = globalProcedures.filter(p => p.id !== id);
    notify();
  }, []);

  const getProcedureById = useCallback((id: string) => globalProcedures.find(p => p.id === id), []);

  // Section/item helpers
  const addSection = useCallback((procedureId: string, title?: string) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const nextIndex = p.sections.length;
      const updated: Procedure = {
        ...p,
        updatedAt: new Date().toISOString(),
        // Derived from order: we store the title only if custom, or empty by default
        sections: [
          ...p.sections,
          { id: newId(), title: title || "" , orderIndex: nextIndex, items: [] }
        ]
      };
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  // Precise section update helper to avoid full array manipulation in components
  const updateSection = useCallback((procedureId: string, sectionId: string, patch: Partial<ProcedureSection>) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const updated: Procedure = {
        ...p,
        updatedAt: new Date().toISOString(),
        // Update only the target section by stable ID
        sections: p.sections.map(s => s.id === sectionId ? { ...s, ...patch } : s)
      };
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  const removeSection = useCallback((procedureId: string, sectionId: string) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const updated: Procedure = {
        ...p,
        updatedAt: new Date().toISOString(),
        // BUG FIX: Filter out by stable ID (not index) and re-index to maintain deterministic order.
        // This prevents the "wrong section deleted" issue and ensures UI titles (Section 1, 2...) stay correct.
        sections: p.sections.filter(s => s.id !== sectionId).map((s, idx) => ({...s, orderIndex: idx}))
      };
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  const reorderSections = useCallback((procedureId: string, fromIndex: number, toIndex: number) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const arr = [...p.sections];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        // Always re-map orderIndex to avoid corruption during reordering
        sections: arr.map((s, i) => ({ ...s, orderIndex: i }))
      };
    });
    notify();
  }, []);

  const addItem = useCallback((procedureId: string, sectionId: string, item: Omit<ProcedureItem,'id'|'orderIndex'>) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const updated: Procedure = {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: p.sections.map(s => {
          // Explicitly target section by ID to ensure items attach correctly
          if (s.id !== sectionId) return s;
          const idx = s.items.length;
          return { ...s, items: [...s.items, { ...item, id: newId(), orderIndex: idx }] };
        })
      };
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  const updateItem = useCallback((procedureId: string, sectionId: string, itemId: string, patch: Partial<ProcedureItem>) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const updated: Procedure = {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          // Use stable itemId for precision
          return { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...patch } as ProcedureItem : i) };
        })
      };
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  const removeItem = useCallback((procedureId: string, sectionId: string, itemId: string) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const updated: Procedure = {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          // Filter out by ID and re-index for stable ordering
          const items = s.items.filter(i => i.id !== itemId).map((i, idx) => ({ ...i, orderIndex: idx }));
          return { ...s, items };
        })
      };
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  const reorderItems = useCallback((procedureId: string, sectionId: string, fromIndex: number, toIndex: number) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          const arr = [...s.items];
          const [moved] = arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, moved);
          return { ...s, items: arr.map((i, idx) => ({ ...i, orderIndex: idx })) };
        })
      };
    });
    notify();
  }, []);

  const search = useCallback((q: string) => {
    const term = q.trim().toLowerCase();
    if (!term) return procedures;
    return procedures.filter(p => p.name.toLowerCase().includes(term));
  }, [procedures]);

  const sortedProcedures = useMemo(() => {
    return [...procedures].sort((a,b) => a.name.localeCompare(b.name));
  }, [procedures]);

  const clearProcedures = useCallback(() => {
    globalProcedures = [];
    notify();
  }, []);

  const importProcedures = useCallback((newProcedures: Procedure[]) => {
    globalProcedures = [...globalProcedures, ...newProcedures];
    notify();
  }, []);

  const saveProcedure = useCallback((procedure: Procedure) => {
    globalProcedures = globalProcedures.map(p => p.id === procedure.id ? { ...procedure, updatedAt: new Date().toISOString() } : p);
    notify();
  }, []);

  return {
    procedures: sortedProcedures,
    addProcedure,
    updateProcedure,
    saveProcedure,
    deleteProcedure,
    getProcedureById,
    addSection,
    removeSection,
    reorderSections,
    updateSection,
    addItem,
    updateItem,
    removeItem,
    reorderItems,
    search,
    clearProcedures,
    importProcedures,
  };
}

export { useProcedureStore, useProcedureCount };
