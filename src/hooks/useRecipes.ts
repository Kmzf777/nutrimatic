'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';

export interface Recipe {
  id: string;
  created_at: string;
  nome: string;
  url: string;
  status?: 'pending' | 'approved' | 'rejected';
  rejection_observation?: string;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const supabase = createClient();
  const hasInitialized = useRef(false);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('Teste-Tabela')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRecipes(data || []);
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Erro ao buscar receitas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const approveRecipe = async (recipeId: string) => {
    let recipeData: any = null;
    
    try {
      // Buscar os dados da receita
      const { data, error: fetchError } = await supabase
        .from('Teste-Tabela')
        .select('id, nome, url')
        .eq('id', recipeId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      recipeData = data;

      // Por enquanto, não atualizar status no banco
      // Apenas retornar sucesso para disparar os webhooks
      return { success: true };
    } catch (err) {
      console.error('Erro ao buscar dados da receita:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    } finally {
      // Disparar os webhooks sempre que possível
      if (recipeData) {
        const webhookData = {
          id: recipeData.id,
          url: recipeData.url,
          nome: recipeData.nome
        };

        // Webhook 1 - Disparado via API route local (evita CORS)
        fetch('/api/webhooks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            webhookType: 'test',
            data: webhookData
          })
        })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            console.log('✅ Webhook 1 disparado com sucesso - Status:', result.status);
          } else {
            console.warn('⚠️ Webhook 1 falhou:', result.message);
          }
        })
        .catch(error => {
          console.error('❌ Erro ao disparar webhook 1:', error);
        });

        // Webhook 2 - Disparado via API route local (evita CORS)
        fetch('/api/webhooks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            webhookType: 'production',
            data: webhookData
          })
        })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            console.log('✅ Webhook 2 disparado com sucesso - Status:', result.status);
          } else {
            console.warn('⚠️ Webhook 2 falhou:', result.message);
          }
        })
        .catch(error => {
          console.error('❌ Erro ao disparar webhook 2:', error);
        });
      }
    }
  };

  const rejectRecipe = async (recipeId: string, observation: string) => {
    try {
      // Por enquanto, não atualizar status no banco
      // Apenas retornar sucesso
      console.log('Reprovando receita:', recipeId, 'com observação:', observation);
      return { success: true };
    } catch (err) {
      console.error('Erro ao reprovar receita:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!hasInitialized.current) {
      fetchRecipes();
    }

    // Configurar subscription para mudanças em tempo real
    const channel = supabase
      .channel('recipes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Teste-Tabela'
        },
        (payload) => {
          console.log('Mudança detectada:', payload);
          
          // Atualizar a lista baseado no tipo de evento
          if (payload.eventType === 'INSERT') {
            const newRecipe = payload.new as Recipe;
            setRecipes(prev => [newRecipe, ...prev]);
            
            // Mostrar notificação
            if ((window as any).showNotification) {
              (window as any).showNotification({
                type: 'success',
                title: 'Nova receita gerada!',
                message: `Receita "${newRecipe.nome}" foi criada automaticamente.`,
                duration: 4000
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            setRecipes(prev => 
              prev.map(recipe => 
                recipe.id === payload.new.id ? payload.new as Recipe : recipe
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRecipes(prev => 
              prev.filter(recipe => recipe.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Status da subscription:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription ativa para receitas');
        }
      });

    // Cleanup function
    return () => {
      console.log('🔌 Desconectando real-time subscription');
      supabase.removeChannel(channel);
    };
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

  return {
    recipes,
    loading,
    error,
    isInitialized,
    refetch: fetchRecipes,
    approveRecipe,
    rejectRecipe,
    formatTimeAgo,
    // Função de teste para webhooks (pode ser chamada no console)
    testWebhooks: (testData = { id: 'test-123', url: 'https://example.com/test.pdf', nome: 'Receita de Teste' }) => {
      console.log('🧪 Testando webhooks com dados:', testData);
      
      // Webhook 1 - Disparado via API route local
      fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookType: 'test',
          data: testData
        })
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log('✅ Webhook 1 - Status:', result.status, 'Message:', result.message);
        } else {
          console.warn('⚠️ Webhook 1 falhou:', result.message);
        }
      })
      .catch(error => {
        console.error('❌ Erro no webhook 1:', error);
      });

      // Webhook 2 - Disparado via API route local
      fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookType: 'production',
          data: testData
        })
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log('✅ Webhook 2 - Status:', result.status, 'Message:', result.message);
        } else {
          console.warn('⚠️ Webhook 2 falhou:', result.message);
        }
      })
      .catch(error => {
        console.error('❌ Erro no webhook 2:', error);
      });
    }
  };
} 