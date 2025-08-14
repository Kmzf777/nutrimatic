'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type ClienteStatus =
  | 'novo'
  | 'aguardando_pagamento'
  | 'anamnese'
  | 'ativo'
  | 'inativo'
  | string;

export interface Cliente {
  id: string;
  created_at: string;
  identificacao?: string | null;
  nome?: string | null;
  numero: string;
  status: ClienteStatus;
  buffer_status?: string | null;
  last_msg?: string | null;
  anamnese?: unknown | null;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, nutricionista } = useAuth();

  const fetchClientes = async () => {
    if (!isSupabaseConfigured()) {
      setClientes([]);
      return;
    }
    const ownerId = nutricionista?.id || user?.id;
    if (!ownerId) {
      // Sem contexto de dono ainda: evita erro de RLS e aguarda auth
      setClientes([]);
      return;
    }

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('identificacao', ownerId)
      .order('created_at', { ascending: false })
      .range(0, 199);
    if (error) throw error;
    console.log('Clientes carregados:', { ownerId, total: data?.length ?? 0 });
    const normalized = (data || []).map((c: any) => {
      const normalizedStatus = c.status === 'pagamento' ? 'aguardando_pagamento' : c.status;
      return {
        ...c,
        nome: c.nome ?? 'Coletando Nome',
        status: normalizedStatus,
      } as Cliente;
    });
    setClientes(normalized);
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchClientes();

        // Realtime desativado temporariamente para evitar erro de WebSocket
        unsub = undefined;
      } catch (e) {
        const msg = (e as any)?.message || (typeof e === 'string' ? e : JSON.stringify(e));
        console.error('Erro ao carregar clientes:', e);
        setError(msg || 'Erro ao carregar clientes');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      if (unsub) unsub();
    };
  }, [user?.id, nutricionista?.id]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchClientes();
    } catch (e) {
      const msg = (e as any)?.message || (typeof e === 'string' ? e : JSON.stringify(e));
      setError(msg || 'Erro ao atualizar');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString?: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Agora mesmo';
    const m = Math.floor(diffInSeconds / 60);
    if (m < 60) return `Há ${m} ${m === 1 ? 'minuto' : 'minutos'}`;
    const h = Math.floor(m / 60);
    if (h < 24) return `Há ${h} ${h === 1 ? 'hora' : 'horas'}`;
    const d = Math.floor(h / 24);
    if (d < 7) return `Há ${d} ${d === 1 ? 'dia' : 'dias'}`;
    const w = Math.floor(d / 7);
    if (w < 4) return `Há ${w} ${w === 1 ? 'semana' : 'semanas'}`;
    const mo = Math.floor(d / 30);
    return `Há ${mo} ${mo === 1 ? 'mês' : 'meses'}`;
  };

  const formatNumero = (jid?: string | null) => {
    if (!jid) return '—';
    const raw = jid.split('@')[0].replace(/\D/g, '');
    const isBR = raw.startsWith('55');
    if (isBR && raw.length >= 12) {
      const pais = raw.slice(0, 2);
      const ddd = raw.slice(2, 4);
      const parte1 = raw.slice(4, 9);
      const parte2 = raw.slice(9);
      return `+${pais} (${ddd}) ${parte1}-${parte2}`;
    }
    return `+${raw}`;
  };

  const waLink = (jid?: string | null) => {
    if (!jid) return undefined;
    const raw = jid.split('@')[0].replace(/\D/g, '');
    return `https://wa.me/${raw}`;
  };

  const inferAgente = (status: ClienteStatus): 'Secretaria' | 'Anamnese' | 'Suporte' => {
    if (status === 'anamnese') return 'Anamnese';
    if (status === 'ativo') return 'Suporte';
    return 'Secretaria';
  };

  const counts = useMemo(() => {
    const by = (s: string) => clientes.filter((c) => c.status === s).length;
    return {
      total: clientes.length,
      novos: by('novo'),
      aguardando_pagamento: by('aguardando_pagamento'),
      anamnese: by('anamnese'),
      ativos: by('ativo'),
      inativos: by('inativo'),
    };
  }, [clientes]);

  return {
    clientes,
    loading,
    error,
    refetch,
    formatTimeAgo,
    formatNumero,
    waLink,
    inferAgente,
    counts,
  };
}