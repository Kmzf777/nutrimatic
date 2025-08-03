'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Prescription {
  id: string;
  identificacao: string;
  created_at: string;
  nome_cliente: string;
  data: string;
  json: any;
  url?: string;
  status: string;
}

export interface CreatePrescriptionData {
  nome_cliente: string;
  json: any;
  status?: string;
  url?: string;
}

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();
  
  // Use apenas o ID do usuário como dependência estável
  const userId = user?.id;
  
  // Cache local para evitar perda de dados
  const cacheKey = `prescriptions_${userId}`;



  const createPrescription = async (prescriptionData: CreatePrescriptionData) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('prescricoes')
        .insert({
          identificacao: user.id,
          nome_cliente: prescriptionData.nome_cliente,
          json: prescriptionData.json,
          status: prescriptionData.status || 'Pendente',
          url: prescriptionData.url
        })
        .select()
        .single();

      if (error) throw error;
      
      // Recarregar prescrições após criar
      const { data: updatedData } = await supabase
        .from('prescricoes')
        .select('*')
        .eq('identificacao', user.id)
        .order('data', { ascending: false });
      const prescriptionsData = updatedData || [];
      setPrescriptions(prescriptionsData);
      
      // Atualizar cache
      if (typeof window !== 'undefined') {
        try {
          const cacheData = {
            data: prescriptionsData,
            timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (err) {
          console.warn('Erro ao salvar cache:', err);
        }
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar prescrição');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar prescrição
  const updatePrescription = async (id: string, updates: Partial<Prescription>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('prescricoes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Recarregar prescrições após atualizar
      const { data: updatedData } = await supabase
        .from('prescricoes')
        .select('*')
        .eq('identificacao', userId)
        .order('data', { ascending: false });
      const prescriptionsData = updatedData || [];
      setPrescriptions(prescriptionsData);
      
      // Atualizar cache
      if (typeof window !== 'undefined') {
        try {
          const cacheData = {
            data: prescriptionsData,
            timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (err) {
          console.warn('Erro ao salvar cache:', err);
        }
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar prescrição');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Deletar prescrição
  const deletePrescription = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('prescricoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Recarregar prescrições após deletar
      const { data: updatedData } = await supabase
        .from('prescricoes')
        .select('*')
        .eq('identificacao', userId)
        .order('data', { ascending: false });
      const prescriptionsData = updatedData || [];
      setPrescriptions(prescriptionsData);
      
      // Atualizar cache
      if (typeof window !== 'undefined') {
        try {
          const cacheData = {
            data: prescriptionsData,
            timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (err) {
          console.warn('Erro ao salvar cache:', err);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar prescrição');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar prescrição por ID
  const getPrescriptionById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('prescricoes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar prescrição');
      return null;
    }
  };

  // Buscar prescrições por status
  const getPrescriptionsByStatus = async (status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('prescricoes')
        .select('*')
        .eq('status', status)
        .order('data', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar prescrições por status');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setPrescriptions([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const loadPrescriptions = async () => {
      // Primeiro, tentar carregar do cache para resposta rápida
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsedData = JSON.parse(cached);
            // Verificar se o cache não está muito antigo (5 minutos)
            const cacheTime = parsedData.timestamp;
            const now = Date.now();
            if (now - cacheTime < 5 * 60 * 1000) {
              console.log('📦 Carregando prescrições do cache local');
              if (!isCancelled) {
                setPrescriptions(parsedData.data || []);
                setLoading(false);
                return; // Use cache se recente
              }
            }
          }
        } catch (err) {
          console.warn('Erro ao carregar cache:', err);
        }
      }
      
      if (isCancelled) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🚀 Buscando prescrições para usuário:', userId);

        const { data, error: prescriptionsError } = await supabase
          .from('prescricoes')
          .select('*')
          .eq('identificacao', userId)
          .order('data', { ascending: false });

        if (isCancelled) return;

        if (prescriptionsError) {
          console.error('❌ Erro ao buscar prescrições:', prescriptionsError);
          setError(prescriptionsError.message);
          return;
        }

        console.log('✅ Prescrições encontradas:', data?.length || 0);
        const prescriptionsData = data || [];
        setPrescriptions(prescriptionsData);
        
        // Salvar no cache
        if (typeof window !== 'undefined') {
          try {
            const cacheData = {
              data: prescriptionsData,
              timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
          } catch (err) {
            console.warn('Erro ao salvar cache:', err);
          }
        }

      } catch (err) {
        if (isCancelled) return;
        console.error('💥 Erro inesperado:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadPrescriptions();

    return () => {
      isCancelled = true;
    };
  }, [userId, cacheKey]);

  return {
    prescriptions,
    loading,
    error,
    createPrescription,
    updatePrescription,
    deletePrescription,
    getPrescriptionById,
    getPrescriptionsByStatus
  };
} 