import { useState, useEffect, useCallback, useMemo } from 'react';
import { Procedure, ProcedureSection, ProcedureItem, ProcedureItemKind } from '@/types/procedure';
import { procedurePersistence } from '@/services/procedurePersistence';

const SEED: Procedure[] = [];

const newId = () => crypto.randomUUID();

export const useProcedureStore = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);

  // hydrate
  useEffect(() => {
    const loaded = procedurePersistence.load();
    if (loaded && loaded.length) setProcedures(loaded);
    else setProcedures(SEED);
  }, []);

  // persist (debounced)
  useEffect(() => {
    procedurePersistence.saveDebounced(procedures);
  }, [procedures]);

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
          title: 'Section 1',
          orderIndex: 0,
          items: []
        }
      ]
    };
    p.meta.fieldCount = computeFieldCount(p);
    setProcedures(prev => [...prev, p]);
    return p;
  }, []);

  const updateProcedure = useCallback((id: string, patch: Partial<Procedure>) => {
    setProcedures(prev => prev.map(p => {
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
    }));
  }, []);

  const deleteProcedure = useCallback((id: string) => {
    setProcedures(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProcedureById = useCallback((id: string) => procedures.find(p => p.id === id), [procedures]);

  // Section/item helpers
  const addSection = useCallback((procedureId: string, title?: string) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== procedureId) return p;
      const nextIndex = p.sections.length;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: [
          ...p.sections,
          { id: newId(), title: title || `Section ${nextIndex + 1}` , orderIndex: nextIndex, items: [] }
        ]
      };
    }));
  }, []);

  const removeSection = useCallback((procedureId: string, sectionId: string) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== procedureId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: p.sections.filter(s => s.id !== sectionId).map((s, idx) => ({...s, orderIndex: idx}))
      };
    }));
  }, []);

  const reorderSections = useCallback((procedureId: string, fromIndex: number, toIndex: number) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== procedureId) return p;
      const arr = [...p.sections];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: arr.map((s, i) => ({ ...s, orderIndex: i }))
      };
    }));
  }, []);

  const addItem = useCallback((procedureId: string, sectionId: string, item: Omit<ProcedureItem,'id'|'orderIndex'>) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== procedureId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          const idx = s.items.length;
          return { ...s, items: [...s.items, { ...item, id: newId(), orderIndex: idx }] };
        })
      };
    }));
  }, []);

  const updateItem = useCallback((procedureId: string, sectionId: string, itemId: string, patch: Partial<ProcedureItem>) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== procedureId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          return { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...patch } as ProcedureItem : i) };
        })
      };
    }));
  }, []);

  const removeItem = useCallback((procedureId: string, sectionId: string, itemId: string) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== procedureId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          const items = s.items.filter(i => i.id !== itemId).map((i, idx) => ({ ...i, orderIndex: idx }));
          return { ...s, items };
        })
      };
    }));
  }, []);

  const reorderItems = useCallback((procedureId: string, sectionId: string, fromIndex: number, toIndex: number) => {
    setProcedures(prev => prev.map(p => {
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
    }));
  }, []);

  const search = useCallback((q: string) => {
    const term = q.trim().toLowerCase();
    if (!term) return procedures;
    return procedures.filter(p => p.name.toLowerCase().includes(term));
  }, [procedures]);

  const sortedProcedures = useMemo(() => {
    return [...procedures].sort((a,b) => a.name.localeCompare(b.name));
  }, [procedures]);

  return {
    procedures: sortedProcedures,
    addProcedure,
    updateProcedure,
    deleteProcedure,
    getProcedureById,
    addSection,
    removeSection,
    reorderSections,
    addItem,
    updateItem,
    removeItem,
    reorderItems,
    search,
  };
};
