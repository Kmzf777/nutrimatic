'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  title: string;
  action?: string;
  number?: string;
  color?: string;
  tipo?: string;
  status?: string;
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function hhmm(h: string | null | undefined): string | undefined {
  if (!h) return undefined;
  const parts = h.split(':');
  if (parts.length >= 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  return h;
}

function colorForAction(acao?: string): string | undefined {
  if (!acao) return undefined;
  const a = acao.toLowerCase();
  if (a.includes('consulta')) return 'green';
  if (a.includes('retorno')) return 'blue';
  if (a.includes('avali')) return 'purple';
  if (a.includes('cancel')) return 'red';
  return undefined;
}

export function useAgenda(monthStart: Date, monthEnd: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, nutricionista } = useAuth();

  const ownerId = nutricionista?.id || user?.id || null;

  const fetchMonth = async () => {
    if (!isSupabaseConfigured() || !ownerId) {
      setEvents([]);
      return;
    }
    const startISO = toISODate(monthStart);
    const endISO = toISODate(monthEnd);
    // 1) Buscar eventos da agenda do nutricionista
    const { data, error } = await supabase
      .from('agenda')
      .select('id, dia, horario, acao, cliente_id, tipo, status')
      .eq('nutricionista_id', ownerId)
      .gte('dia', startISO)
      .lte('dia', endISO)
      .order('dia', { ascending: true })
      .order('horario', { ascending: true })
      .range(0, 999);
    if (error) throw error;

    const eventos = data || [];

    // 2) Carregar clientes separadamente para evitar ambiguidade de relacionamento
    const clienteIds = Array.from(new Set(eventos.map((r: any) => r.cliente_id).filter((id: any) => !!id)));
    let clienteMap: Record<string, { id: string; nome: string | null; numero: string | null }> = {};
    if (clienteIds.length > 0) {
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('id, nome, numero')
        .in('id', clienteIds);
      if (clientesError) throw clientesError;
      (clientesData || []).forEach((c: any) => {
        clienteMap[c.id] = { id: c.id, nome: c.nome || null, numero: c.numero || null };
      });
    }

    // 3) Mapear eventos com dados do cliente
    const mapped: CalendarEvent[] = eventos.map((r: any) => {
      const cliente = r.cliente_id ? clienteMap[r.cliente_id] : undefined;
      return {
        id: r.id,
        date: r.dia,
        time: hhmm(r.horario),
        title: (cliente?.nome || r.acao || 'Evento'),
        action: r.acao || undefined,
        number: cliente?.numero || undefined,
        color: colorForAction(r.acao),
        tipo: r.tipo || undefined,
        status: r.status || undefined
      };
    });
    setEvents(mapped);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchMonth();
      } catch (e) {
        if (!cancelled) setError((e as any)?.message || 'Erro ao carregar agenda');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId, monthStart.getFullYear(), monthStart.getMonth()]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [events]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchMonth();
    } catch (e) {
      setError((e as any)?.message || 'Erro ao atualizar agenda');
    } finally {
      setLoading(false);
    }
  };

  return { events, eventsByDate, loading, error, refetch };
}


