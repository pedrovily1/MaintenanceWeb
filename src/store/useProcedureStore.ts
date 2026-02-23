import { useState, useEffect, useCallback, useMemo } from 'react';
import { Procedure, ProcedureSection, ProcedureItem, ProcedureItemKind } from '../types/procedure';
import { supabase } from '@/lib/supabase';
import { useSiteStore } from './useSiteStore';

const newId = () => crypto.randomUUID();

let globalProcedures: Procedure[] = [];
const listeners = new Set<() => void>();

function useProcedureCount() {
  const [count, setCount] = useState(globalProcedures.length);

  useEffect(() => {
    const l = () => setCount(globalProcedures.length);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  return count;
}

const notify = () => {
  listeners.forEach(l => l());
};

function useProcedureStore() {
  const [procedures, setProcedures] = useState<Procedure[]>(globalProcedures);

  useEffect(() => {
    const l = () => setProcedures([...globalProcedures]);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const computeFieldCount = (p: Procedure) => {
    const inputKinds: ProcedureItemKind[] = ['TextInput','NumberInput','MultipleChoice','YesNoNA','Inspection','Date','Photo','File','Signature','MeterReading','Checklist'];    return p.sections.reduce((acc, s) => acc + s.items.filter(i => inputKinds.includes(i.kind)).length, 0);
  };

  const loadProcedures = useCallback(async (siteId: string) => {
    if (!siteId) return;
    console.log("loadProcedures called for site:", siteId);
    try {
      const { data, error } = await supabase
          .from('procedures')
          .select(`*, procedure_sections(*, procedure_items(*))`)
          .eq('site_id', siteId)
          .order('name', { ascending: true });

      if (error) throw error;

      globalProcedures = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        meta: { version: row.version || 1, fieldCount: row.field_count || 0 },
        sections: (row.procedure_sections || [])
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((s: any) => ({
              id: s.id,
              title: s.title,
              orderIndex: s.order_index,
              items: (s.procedure_items || [])
                  .sort((a: any, b: any) => a.order_index - b.order_index)
                  .map((i: any) => ({
                    id: i.id,
                    kind: i.kind,
                    label: i.label,
                    helpText: i.help_text,
                    required: i.required,
                    orderIndex: i.order_index,
                    config: i.config || {},
                  }))
            }))
      }));
      notify();
    } catch (err) {
      console.error('Failed to load procedures:', err);
    }
  }, []);

  const addProcedure = useCallback((name?: string): Procedure => {
    const { activeSiteId } = useSiteStore.getState();
    const now = new Date().toISOString();
    const p: Procedure = {
      id: newId(),
      name: name || 'Untitled Procedure',
      description: '',
      createdAt: now,
      updatedAt: now,
      meta: { version: 1, fieldCount: 0 },
      sections: [{ id: newId(), title: '', orderIndex: 0, items: [] }]
    };
    p.meta.fieldCount = computeFieldCount(p);
    globalProcedures = [...globalProcedures, p];
    notify();

    if (activeSiteId) {
      (async () => {
        try {
          const { error: pErr } = await supabase.from('procedures').insert({
            id: p.id,
            site_id: activeSiteId,
            name: p.name,
            description: p.description,
            version: 1,
            field_count: 0,
          });
          if (pErr) throw pErr;

          for (const s of p.sections) {
            const { error: sErr } = await supabase.from('procedure_sections').insert({
              id: s.id,
              procedure_id: p.id,
              title: s.title,
              order_index: s.orderIndex,
            });
            if (sErr) throw sErr;
          }
        } catch (err) {
          console.error('Error saving procedure to DB:', err);
        }
      })();
    }
    return p;
  }, []);

  const updateProcedure = useCallback((id: string, patch: Partial<Procedure>) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== id) return p;
      const updated: Procedure = {
        ...p,
        ...patch,
        updatedAt: new Date().toISOString(),
        meta: { ...p.meta, version: (p.meta?.version || 0) + 1 }
      } as Procedure;
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  const saveProcedure = useCallback((procedure: Procedure) => {
    const updated = { ...procedure, updatedAt: new Date().toISOString() };
    globalProcedures = globalProcedures.map(p => p.id === procedure.id ? updated : p);
    notify();

    (async () => {
      try {
        const fc = computeFieldCount(updated);
        const { activeSiteId } = useSiteStore.getState();
        const { error: pErr } = await supabase.from('procedures').upsert({
          id: updated.id,
          site_id: activeSiteId,
          name: updated.name,
          description: updated.description,
          version: updated.meta?.version || 1,
          field_count: fc,
          updated_at: updated.updatedAt,
        });
        if (pErr) { console.error('[saveProcedure] procedure upsert error:', pErr); throw pErr; }
        console.log('[saveProcedure] procedure upserted ok');

        const { error: delErr } = await supabase.from('procedure_sections').delete().eq('procedure_id', updated.id);
        if (delErr) { console.error('[saveProcedure] section delete error:', delErr); throw delErr; }
        console.log('[saveProcedure] sections deleted ok, re-inserting', updated.sections.length, 'sections');

        for (const s of updated.sections) {
          const { error: sErr } = await supabase.from('procedure_sections').insert({
            id: s.id,
            procedure_id: updated.id,
            title: s.title,
            order_index: s.orderIndex,
          });
          if (sErr) { console.error('[saveProcedure] section insert error:', s.id, sErr); throw sErr; }

          for (const i of s.items) {
            const { error: iErr } = await supabase.from('procedure_items').insert({
              id: i.id,
              section_id: s.id,
              kind: i.kind,
              label: i.label || '',
              help_text: i.helpText || null,
              required: i.required || false,
              order_index: i.orderIndex,
              config: i.config || {},
            });
            if (iErr) { console.error('[saveProcedure] item insert error:', i.id, iErr); throw iErr; }
          }
        }
        console.log('[saveProcedure] all done');
      } catch (err) {
        console.error('Error saving procedure to DB:', err);
      }
    })();
  }, []);

  const deleteProcedure = useCallback((id: string) => {
    globalProcedures = globalProcedures.filter(p => p.id !== id);
    notify();
    (async () => {
      try {
        const { error } = await supabase.from('procedures').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Error deleting procedure:', err);
      }
    })();
  }, []);

  const getProcedureById = useCallback((id: string) => globalProcedures.find(p => p.id === id), []);

  const addSection = useCallback((procedureId: string, title?: string) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const nextIndex = p.sections.length;
      const updated: Procedure = {
        ...p,
        updatedAt: new Date().toISOString(),
        sections: [...p.sections, { id: newId(), title: title || "", orderIndex: nextIndex, items: [] }]
      };
      updated.meta.fieldCount = computeFieldCount(updated);
      return updated;
    });
    notify();
  }, []);

  const updateSection = useCallback((procedureId: string, sectionId: string, patch: Partial<ProcedureSection>) => {
    globalProcedures = globalProcedures.map(p => {
      if (p.id !== procedureId) return p;
      const updated: Procedure = {
        ...p,
        updatedAt: new Date().toISOString(),
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
        sections: p.sections.filter(s => s.id !== sectionId).map((s, idx) => ({ ...s, orderIndex: idx }))
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
    return [...procedures].sort((a, b) => a.name.localeCompare(b.name));
  }, [procedures]);

  const clearProcedures = useCallback(() => {
    globalProcedures = [];
    notify();
  }, []);

  const importProcedures = useCallback((newProcedures: Procedure[]) => {
    globalProcedures = [...globalProcedures, ...newProcedures];
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
    loadProcedures,
  };
}

export { useProcedureStore, useProcedureCount };