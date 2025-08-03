'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export interface Cliente {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  status: 'ativo' | 'inativo' | 'prospecto';
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular dados de clientes (você pode substituir pela sua tabela real)
        const mockClientes: Cliente[] = [
          {
            id: '1',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
            nome: 'Maria Silva',
            email: 'maria@email.com',
            status: 'ativo'
          },
          {
            id: '2',
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
            nome: 'João Santos',
            email: 'joao@email.com',
            status: 'ativo'
          },
          {
            id: '3',
            created_at: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
            nome: 'Ana Costa',
            email: 'ana@email.com',
            status: 'prospecto'
          }
        ];

        setClientes(mockClientes);
      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadClientes();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Agora mesmo';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `Há ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `Há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`;
  };

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular dados de clientes (você pode substituir pela sua tabela real)
      const mockClientes: Cliente[] = [
        {
          id: '1',
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          nome: 'Maria Silva',
          email: 'maria@email.com',
          status: 'ativo'
        },
        {
          id: '2',
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          nome: 'João Santos',
          email: 'joao@email.com',
          status: 'ativo'
        },
        {
          id: '3',
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
          nome: 'Ana Costa',
          email: 'ana@email.com',
          status: 'prospecto'
        }
      ];

      setClientes(mockClientes);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return {
    clientes,
    loading,
    error,
    refetch,
    formatTimeAgo
  };
} 