'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './supabase';

export interface DiagnosticoClientes {
  env: { isConfigured: boolean };
  auth: { userId: string | null; email: string | null; error: string | null };
  table: { ok: boolean; count: number | null; error: string | null };
  filtered: { ok: boolean; count: number | null; error: string | null; sample: any[] };
}

export async function diagnoseClientes(supabase: SupabaseClient, ownerId?: string): Promise<DiagnosticoClientes> {
  const result: DiagnosticoClientes = {
    env: { isConfigured: isSupabaseConfigured() },
    auth: { userId: null, email: null, error: null },
    table: { ok: false, count: null, error: null },
    filtered: { ok: false, count: null, error: null, sample: [] },
  };

  try {
    // Sessão atual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      result.auth.error = sessionError.message;
    }
    result.auth.userId = sessionData?.session?.user?.id ?? null;
    result.auth.email = sessionData?.session?.user?.email ?? null;

    // Tabela acessível e contagem total
    const tableCheck = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: false })
      .limit(1);
    result.table.ok = !tableCheck.error;
    result.table.error = tableCheck.error?.message ?? null;
    result.table.count = tableCheck.count ?? (tableCheck.data ? tableCheck.data.length : null);

    // Filtro por identificacao (ownerId ou userId da sessão)
    const id = ownerId || result.auth.userId || undefined;
    if (id) {
      const filtered = await supabase
        .from('clientes')
        .select('id,identificacao,nome,numero,status,created_at', { count: 'exact' })
        .eq('identificacao', id)
        .order('created_at', { ascending: false })
        .limit(5);
      result.filtered.ok = !filtered.error;
      result.filtered.error = filtered.error?.message ?? null;
      result.filtered.count = filtered.count ?? (filtered.data ? filtered.data.length : null);
      result.filtered.sample = filtered.data || [];
    }
  } catch (e: any) {
    const msg = e?.message || String(e);
    if (!result.table.ok) result.table.error = msg;
    if (!result.filtered.ok) result.filtered.error = msg;
  }

  return result;
}


