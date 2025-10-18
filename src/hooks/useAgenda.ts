'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  title: string;
  description?: string;
  clienteId?: string | null;
  clienteNome?: string;
  clienteTelefone?: string;
  status?: string;
  type?: string;
  action?: string;
  number?: string;
  color?: string;
  tipo?: string;
}

function firstDefined<T>(...vals: (T | null | undefined)[]): T | undefined {
  for (const v of vals) if (v !== null && v !== undefined) return v as T;
  return undefined;
}

function normalizeHorario(h: any): string {
  if (h == null) return '00:00:00';
  const s = String(h);
  if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
  // Supabase pode retornar com frações (HH:MM:SS.mmmmmm)
  const m = s.match(/^(\d{2}:\d{2}:\d{2})/);
  return m ? m[1] : '00:00:00';
}

function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseStart(item: any, fallbackDate: Date): Date {
  const dia = firstDefined<string>(item.dia);
  const horario = normalizeHorario(firstDefined<string>(item.horario));
  const raw = firstDefined<string>(
    item.data_inicio,
    item.start_date,
    item.data,
    item.start,
    item.date,
    dia && `${dia}T${horario}`
  );
  const d = raw ? new Date(raw) : fallbackDate;
  // Para strings sem timezone, new Date usa local time (é o que queremos)
  return isNaN(d.getTime()) ? fallbackDate : d;
}

export function useAgenda(monthStart: Date, monthEnd: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, nutricionista } = useAuth();
  const ownerId = nutricionista?.id || user?.id || null;

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      if (!isSupabaseConfigured()) { setLoading(false); setError('Supabase não configurado'); return; }
      if (!ownerId) { setLoading(false); setError('Usuário não autenticado'); return; }

      try {
        setLoading(true);
        setError(null);

        const startISO = monthStart.toISOString();
        const endISO = monthEnd.toISOString();

        let items: any[] = [];

        // 1) agenda com identificacao + período
        const r1 = await supabase
          .from('agenda')
          .select('*')
          .eq('identificacao', ownerId)
          .gte('data_inicio', startISO)
          .lte('data_inicio', endISO)
          .order('data_inicio', { ascending: true });
        if (!r1.error && Array.isArray(r1.data)) items = r1.data;

        // 2) agenda sem identificacao, mesmo período (apenas quem tem data_inicio)
        if (!items.length) {
          const r2 = await supabase
            .from('agenda')
            .select('*')
            .gte('data_inicio', startISO)
            .lte('data_inicio', endISO)
            .order('data_inicio', { ascending: true });
          if (!r2.error && Array.isArray(r2.data)) items = r2.data;
        }

        // 3) agenda sem filtros; filtra client-side por período (suporta colunas dia/horario)
        if (!items.length) {
          const r2b = await supabase.from('agenda').select('*');
          if (!r2b.error && Array.isArray(r2b.data)) {
            items = r2b.data.filter((it: any) => {
              const di = parseStart(it, monthStart);
              return di >= monthStart && di <= monthEnd;
            });
          }
        }

        // 4) legado agenda_eventos
        if (!items.length) {
          const r3 = await supabase.from('agenda_eventos').select('*');
          if (!r3.error && Array.isArray(r3.data)) {
            items = r3.data.filter((it: any) => {
              const di = parseStart(it, monthStart);
              return di >= monthStart && di <= monthEnd;
            });
          }
        }

        // Mapear nomes dos clientes via cliente_id quando não vierem no item
        const clientIds = Array.from(new Set(items
          .map((it: any) => firstDefined<string>(it.cliente_id))
          .filter(Boolean) as string[]));
        let clientsMap: Record<string, { nome?: string; numero?: string }> = {};
        if (clientIds.length) {
          const { data: clients } = await supabase
            .from('clientes')
            .select('id,nome,numero')
            .in('id', clientIds);
          if (Array.isArray(clients)) {
            clientsMap = Object.fromEntries(clients.map((c: any) => [c.id, { nome: c.nome, numero: c.numero }]));
          }
        }

        const agendaEvents: CalendarEvent[] = items.map((item: any) => {
          const di = parseStart(item, monthStart);
          const cid = firstDefined<string>(item.cliente_id);
          const fromMap = cid ? clientsMap[cid] : undefined;
          return {
            id: item.id || crypto.randomUUID?.() || Math.random().toString(36).slice(2),
            title: firstDefined<string>(item.descricao, item.titulo, item.title, item.acao) || 'Agendamento',
            action: firstDefined<string>(item.acao, item.titulo, item.descricao, item.title),
            date: toLocalISODate(di),
            time: `${String(di.getHours()).padStart(2,'0')}:${String(di.getMinutes()).padStart(2,'0')}`,
            description: firstDefined<string>(item.observacoes, item.notes) || '',
            clienteId: cid,
            clienteNome: firstDefined<string>(item.cliente_nome, item.client_name, item.nome_cliente, item.nome, fromMap?.nome) || 'Cliente',
            clienteTelefone: firstDefined<string>(item.cliente_telefone, item.client_phone, item.numero, item.telefone, fromMap?.numero) || '',
            status: item.status || 'agendado',
            type: 'agenda',
          };
        });

        if (!cancelled) setEvents(agendaEvents);
      } catch (e) {
        if (!cancelled) setError((e as any)?.message || 'Erro ao carregar agenda');
      } finally { if (!cancelled) setLoading(false); }
    }

    loadEvents();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId, monthStart.getFullYear(), monthStart.getMonth(), monthEnd.getFullYear(), monthEnd.getMonth()]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) { if (!map[ev.date]) map[ev.date] = []; map[ev.date].push(ev); }
    return map;
  }, [events]);

  const refetch = async () => {
    if (!isSupabaseConfigured()) { setError('Supabase não configurado'); setLoading(false); return; }
    if (!ownerId) { setError('Usuário não autenticado'); setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const startISO = monthStart.toISOString();
      const endISO = monthEnd.toISOString();
      let items: any[] = [];

      const r1 = await supabase
        .from('agenda')
        .select('*')
        .eq('identificacao', ownerId)
        .gte('data_inicio', startISO)
        .lte('data_inicio', endISO)
        .order('data_inicio', { ascending: true });
      if (!r1.error && Array.isArray(r1.data)) items = r1.data;

      if (!items.length) {
        const r2 = await supabase
          .from('agenda')
          .select('*')
          .gte('data_inicio', startISO)
          .lte('data_inicio', endISO)
          .order('data_inicio', { ascending: true });
        if (!r2.error && Array.isArray(r2.data)) items = r2.data;
      }

      if (!items.length) {
        const r2b = await supabase.from('agenda').select('*');
        if (!r2b.error && Array.isArray(r2b.data)) {
          items = r2b.data.filter((it: any) => {
            const di = parseStart(it, monthStart);
            return di >= monthStart && di <= monthEnd;
          });
        }
      }

      if (!items.length) {
        const r3 = await supabase.from('agenda_eventos').select('*');
        if (!r3.error && Array.isArray(r3.data)) {
          items = r3.data.filter((it: any) => {
            const di = parseStart(it, monthStart);
            return di >= monthStart && di <= monthEnd;
          });
        }
      }

      // Mapear nomes dos clientes via cliente_id quando não vierem no item
      const clientIds = Array.from(new Set(items
        .map((it: any) => firstDefined<string>(it.cliente_id))
        .filter(Boolean) as string[]));
      let clientsMap: Record<string, { nome?: string; numero?: string }> = {};
      if (clientIds.length) {
        const { data: clients } = await supabase
          .from('clientes')
          .select('id,nome,numero')
          .in('id', clientIds);
        if (Array.isArray(clients)) {
          clientsMap = Object.fromEntries(clients.map((c: any) => [c.id, { nome: c.nome, numero: c.numero }]));
        }
      }

      const agendaEvents: CalendarEvent[] = items.map((item: any) => {
        const di = parseStart(item, monthStart);
        const cid = firstDefined<string>(item.cliente_id);
        const fromMap = cid ? clientsMap[cid] : undefined;
        return {
          id: item.id || crypto.randomUUID?.() || Math.random().toString(36).slice(2),
          title: firstDefined<string>(item.descricao, item.titulo, item.title, item.acao) || 'Agendamento',
          action: firstDefined<string>(item.acao, item.titulo, item.descricao, item.title),
          date: toLocalISODate(di),
          time: `${String(di.getHours()).padStart(2,'0')}:${String(di.getMinutes()).padStart(2,'0')}`,
          description: firstDefined<string>(item.observacoes, item.notes) || '',
          clienteId: cid,
          clienteNome: firstDefined<string>(item.cliente_nome, item.client_name, item.nome_cliente, item.nome, fromMap?.nome) || 'Cliente',
          clienteTelefone: firstDefined<string>(item.cliente_telefone, item.client_phone, item.numero, item.telefone, fromMap?.numero) || '',
          status: item.status || 'agendado',
          type: 'agenda',
        };
      });

      setEvents(agendaEvents);
    } catch (e) { setError((e as any)?.message || 'Erro ao atualizar agenda'); }
    finally { setLoading(false); }
  };

  return { events, eventsByDate, loading, error, refetch };
}


