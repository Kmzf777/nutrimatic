'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Recipe {
  id: string;
  created_at: string;
  nome: string;
  url: string;
  status?: 'pending' | 'approved' | 'rejected';
  rejection_observation?: string;
  identificacao?: string;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();
  
  // Use apenas o ID do usuário como dependência estável
  const userId = user?.id;

  const approveRecipe = async (recipeId: string) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      // Atualizar status da receita para approved
      const { error: updateError } = await supabase
        .from('Teste-Tabela')
        .update({ status: 'approved' })
        .eq('id', recipeId)
        .eq('identificacao', user.id);

      if (updateError) {
        throw updateError;
      }

      // Recarregar receitas após aprovar
      const { data: updatedData } = await supabase
        .from('Teste-Tabela')
        .select('*')
        .eq('identificacao', user.id)
        .order('created_at', { ascending: false });
      
      setRecipes(updatedData || []);

      return { success: true };
    } catch (err) {
      console.error('Erro ao aprovar receita:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  const rejectRecipe = async (recipeId: string, observation: string) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      // Atualizar status da receita para rejected com observação
      const { error: updateError } = await supabase
        .from('Teste-Tabela')
        .update({ 
          status: 'rejected',
          rejection_observation: observation
        })
        .eq('id', recipeId)
        .eq('identificacao', user.id);

      if (updateError) {
        throw updateError;
      }

      // Recarregar receitas após rejeitar
      const { data: updatedData } = await supabase
        .from('Teste-Tabela')
        .select('*')
        .eq('identificacao', user.id)
        .order('created_at', { ascending: false });
      
      setRecipes(updatedData || []);

      return { success: true };
    } catch (err) {
      console.error('Erro ao rejeitar receita:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  useEffect(() => {
    const loadRecipes = async () => {
      if (!userId) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log('🚀 Buscando receitas para usuário:', userId);

        // Buscar receitas da tabela Teste-Tabela filtradas por usuário
        const { data, error: recipesError } = await supabase
          .from('Teste-Tabela')
          .select('*')
          .eq('identificacao', userId)
          .order('created_at', { ascending: false });

        if (recipesError) {
          console.error('❌ Erro ao buscar receitas:', recipesError);
          setError(recipesError.message);
          return;
        }

        console.log('✅ Receitas encontradas:', data?.length || 0);
        setRecipes(data || []);
        setIsInitialized(true);

      } catch (err) {
        console.error('💥 Erro inesperado:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [userId]);

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
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: recipesError } = await supabase
        .from('Teste-Tabela')
        .select('*')
        .eq('identificacao', userId)
        .order('created_at', { ascending: false });

      if (recipesError) {
        setError(recipesError.message);
        return;
      }

      setRecipes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return {
    recipes,
    loading,
    error,
    isInitialized,
    refetch,
    approveRecipe,
    rejectRecipe,
    formatTimeAgo
  };
} 