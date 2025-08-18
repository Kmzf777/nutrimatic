import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SecretariaConfig {
  id?: string;
  identificacao: string;
  agent_name: string;
  business_name: string;
  creativity: number;
  emojis: boolean;
  consultation_time: number;
  return_time: number;
  created_at?: string;
  updated_at?: string;
}

export function useSecretaria() {
  const [config, setConfig] = useState<SecretariaConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();
  
  // Use apenas o ID do usuário como dependência estável
  const userId = user?.id;
  
  // Cache local para evitar perda de dados
  const cacheKey = `secretaria_config_${userId}`;
  
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
            console.log('[useSecretaria] Carregando configuracao da secretaria do cache local');
            setConfig(parsedData.data || null);
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
  const saveToCache = useCallback((data: SecretariaConfig | null) => {
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

  // Função para recarregar dados
  const refetch = useCallback(async () => {
    if (!userId) {
      setConfig(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('secretaria')
        .select('*')
        .eq('identificacao', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(fetchError.message);
      }

      const configData = data || null;
      setConfig(configData);
      saveToCache(configData);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar configuração da secretaria:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase, saveToCache]);

  useEffect(() => {
    const loadConfig = async () => {
      console.log('[useSecretaria] Iniciando carregamento, userId:', userId);
      
      if (!userId) {
        console.log('[useSecretaria] Sem userId, definindo config como null');
        setConfig(null);
        setLoading(false);
        return;
      }

      // Primeiro, tentar carregar do cache para resposta rápida
      const hasCachedData = loadFromCache();
      console.log('[useSecretaria] Cache carregado:', hasCachedData);
      
      if (!hasCachedData) {
        setLoading(true);
      }

      try {
        setError(null);
        console.log('[useSecretaria] Fazendo consulta ao Supabase para userId:', userId);

        const { data, error: fetchError } = await supabase
          .from('secretaria')
          .select('*')
          .eq('identificacao', userId)
          .single();

        console.log('[useSecretaria] Resultado da consulta:', { data, fetchError });
 
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('[useSecretaria] Erro na consulta:', fetchError);
          throw new Error(fetchError.message);
        }

        const configData = data || null;
        console.log('[useSecretaria] Configuracao carregada:', configData);
        setConfig(configData);
        saveToCache(configData);
      } catch (err: any) {
        console.error('[useSecretaria] Erro geral:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [userId, supabase, loadFromCache, saveToCache]);

  // Dados placeholder quando não há configuração salva
  const getPlaceholderConfig = useCallback((): SecretariaConfig => {
    return {
      identificacao: userId || '',
      agent_name: 'Assistente Virtual',
      business_name: 'Minha Clínica',
      creativity: 0.7,
      emojis: true,
      consultation_time: 60,
      return_time: 30
    };
  }, [userId]);

  // Retorna a configuração atual ou placeholder
  const currentConfig = config || getPlaceholderConfig();

  return {
    config: currentConfig,
    hasStoredConfig: !!config,
    loading,
    error,
    refetch
  };
}

export type { SecretariaConfig };