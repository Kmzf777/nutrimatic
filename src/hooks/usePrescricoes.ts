import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Prescricao } from '@/types/prescricao';
import { useAuth } from '@/contexts/AuthContext';

export function usePrescricoes() {
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();
  
  // Use apenas o ID do usuário como dependência estável
  const userId = user?.id;
  
  // Cache local para evitar perda de dados
  const cacheKey = `prescricoes_${userId}`;
  
  // Carregar dados do cache local quando disponível
  const loadFromCache = useCallback(() => {
    if (typeof window !== 'undefined' && userId) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsedData = JSON.parse(cached);
          // Verificar se o cache não está muito antigo (5 minutos)
          const cacheTime = parsedData.timestamp;
          const now = Date.now();
          if (now - cacheTime < 5 * 60 * 1000) {
            console.log('📦 Carregando prescrições do cache local');
            setPrescricoes(parsedData.data || []);
            return true;
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar cache:', err);
      }
    }
    return false;
  }, [cacheKey, userId]);
  
  // Salvar dados no cache local
  const saveToCache = useCallback((data: Prescricao[]) => {
    if (typeof window !== 'undefined' && userId) {
      try {
        const cacheData = {
          data,
          timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (err) {
        console.warn('Erro ao salvar cache:', err);
      }
    }
  }, [cacheKey, userId]);

  const updatePrescricaoStatus = async (prescricaoId: string, status: 'Aprovada' | 'Refazendo') => {
    if (!userId) return;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('prescricoes')
        .update({ status })
        .eq('id', prescricaoId)
        .eq('identificacao', userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Atualizar estado local
      setPrescricoes(prev => 
        prev.map(p => 
          p.id === prescricaoId ? { ...p, status } : p
        )
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao atualizar prescrição:', err);
    }
  };

  const approvePrescricao = async (prescricaoId: string) => {
    await updatePrescricaoStatus(prescricaoId, 'Aprovada');
  };

  const rejectPrescricao = async (prescricaoId: string, observacoes: string) => {
    if (!userId) return;

    try {
      setError(null);
      
      // Atualizar status da prescrição
      const { error: updateError } = await supabase
        .from('prescricoes')
        .update({ status: 'Refazendo' })
        .eq('id', prescricaoId)
        .eq('identificacao', userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Atualizar regras do nutricionista com as observações
      const { error: nutricionistaError } = await supabase
        .from('nutricionistas')
        .update({ regras: observacoes })
        .eq('id', userId);

      if (nutricionistaError) {
        throw new Error(nutricionistaError.message);
      }

      // Atualizar estado local
      setPrescricoes(prev => 
        prev.map(p => 
          p.id === prescricaoId ? { ...p, status: 'Refazendo' } : p
        )
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao rejeitar prescrição:', err);
    }
  };

  // Filtrar prescrições por status
  const prescricoesPendentes = prescricoes.filter(p => p.status === 'Pendente');
  const prescricoesAprovadas = prescricoes.filter(p => p.status === 'Aprovada' || p.status === 'Aprovado');
  const prescricoesRefazendo = prescricoes.filter(p => p.status === 'Refazendo');

  useEffect(() => {
    const loadPrescricoes = async () => {
      if (!userId) {
        setPrescricoes([]);
        setLoading(false);
        return;
      }

      // Primeiro, tentar carregar do cache para resposta rápida
      const hasCachedData = loadFromCache();
      
      if (!hasCachedData) {
        setLoading(true);
      }

      try {
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('prescricoes')
          .select('*')
          .eq('identificacao', userId)
          .order('data', { ascending: false });

        if (fetchError) {
          console.error('Erro na consulta de prescrições:', fetchError);
          throw new Error(fetchError.message);
        }

        const prescricoesData = data || [];
        console.log('Prescrições carregadas:', prescricoesData.length);
        
        setPrescricoes(prescricoesData);
        saveToCache(prescricoesData);
      } catch (err: any) {
        setError(err.message);
        console.error('Erro ao buscar prescrições:', err);
        
        // Se houve erro e não temos cache, ao menos tentar mostrar dados locais antigos
        if (!hasCachedData) {
          loadFromCache();
        }
      } finally {
        setLoading(false);
      }
    };

    loadPrescricoes();
  }, [userId, loadFromCache, saveToCache]);

  const refetch = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('prescricoes')
        .select('*')
        .eq('identificacao', userId)
        .order('data', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const prescricoesData = data || [];
      setPrescricoes(prescricoesData);
      saveToCache(prescricoesData);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar prescrições:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    prescricoes,
    prescricoesPendentes,
    prescricoesAprovadas,
    prescricoesRefazendo,
    loading,
    error,
    refetch,
    approvePrescricao,
    rejectPrescricao,
  };
} 