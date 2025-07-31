'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';

export interface PrescriptionUsage {
  id: string;
  recipe_id: string;
  prescriptions_consumed: number;
  created_at: string;
  recipe_name: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PrescriptionStats {
  totalPrescriptions: number;
  monthlyPrescriptions: number;
  weeklyPrescriptions: number;
  remainingPrescriptions: number;
  usagePercentage: number;
  monthlyLimit: number;
}

// Dados mockados para prescrições
const mockPrescriptionUsage: PrescriptionUsage[] = [
  {
    id: 'prescription-mock-1',
    recipe_id: 'mock-1',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Ana Paula Silva',
    status: 'pending'
  },
  {
    id: 'prescription-mock-2',
    recipe_id: 'mock-2',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Carlos Eduardo Santos',
    status: 'approved'
  },
  {
    id: 'prescription-mock-3',
    recipe_id: 'mock-3',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Mariana Costa Lima',
    status: 'approved'
  },
  {
    id: 'prescription-mock-4',
    recipe_id: 'mock-4',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Roberto Almeida Ferreira',
    status: 'approved'
  },
  {
    id: 'prescription-mock-5',
    recipe_id: 'mock-5',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Fernanda Oliveira Rodrigues',
    status: 'pending'
  },
  {
    id: 'prescription-mock-6',
    recipe_id: 'mock-6',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Lucas Mendes Pereira',
    status: 'approved'
  },
  {
    id: 'prescription-mock-7',
    recipe_id: 'mock-7',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Juliana Souza Barbosa',
    status: 'approved'
  },
  {
    id: 'prescription-mock-8',
    recipe_id: 'mock-8',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Pedro Henrique Nascimento',
    status: 'rejected'
  },
  {
    id: 'prescription-mock-9',
    recipe_id: 'mock-9',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Amanda Costa Santos',
    status: 'approved'
  },
  {
    id: 'prescription-mock-10',
    recipe_id: 'mock-10',
    prescriptions_consumed: 1,
    created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    recipe_name: 'Receita para Rafael Silva Oliveira',
    status: 'approved'
  }
];

// Estatísticas mockadas
const mockPrescriptionStats: PrescriptionStats = {
  totalPrescriptions: 342,
  monthlyPrescriptions: 53,
  weeklyPrescriptions: 18,
  remainingPrescriptions: 47,
  usagePercentage: 53,
  monthlyLimit: 100
};

export function usePrescriptions() {
  const [prescriptionUsage, setPrescriptionUsage] = useState<PrescriptionUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const supabase = createClient();
  const hasInitialized = useRef(false);

  const monthlyPrescriptionLimit = 100; // Limite mensal de prescrições

  const fetchPrescriptionUsage = async () => {
    try {
      setLoading(true);
      setError(null);

      // Por enquanto, vamos simular o uso de prescrições baseado nas receitas
      // Em uma implementação real, você teria uma tabela separada para prescrições
      const { data: recipes, error: recipesError } = await supabase
        .from('Teste-Tabela')
        .select('*')
        .order('created_at', { ascending: false });

      if (recipesError) {
        throw recipesError;
      }

      // Se não há dados reais, usar dados mockados
      if (!recipes || recipes.length === 0) {
        setPrescriptionUsage(mockPrescriptionUsage);
        setUseMockData(true);
      } else {
        // Simular dados de uso de prescrições baseado nas receitas
        const simulatedPrescriptionUsage: PrescriptionUsage[] = recipes.map((recipe, index) => ({
          id: `prescription-${recipe.id}`,
          recipe_id: recipe.id,
          prescriptions_consumed: 1, // 1 prescrição por receita
          created_at: recipe.created_at,
          recipe_name: recipe.nome,
          status: recipe.status || 'pending'
        }));

        setPrescriptionUsage(simulatedPrescriptionUsage);
        setUseMockData(false);
      }

      if (!hasInitialized.current) {
        hasInitialized.current = true;
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Erro ao buscar uso de prescrições:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Em caso de erro, usar dados mockados
      setPrescriptionUsage(mockPrescriptionUsage);
      setUseMockData(true);
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  const getPrescriptionStats = (): PrescriptionStats => {
    // Se estamos usando dados mockados, retornar estatísticas mockadas
    if (useMockData) {
      return mockPrescriptionStats;
    }

    const totalPrescriptions = prescriptionUsage.reduce((sum, usage) => sum + usage.prescriptions_consumed, 0);
    
    // Calcular prescrições do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPrescriptions = prescriptionUsage.filter(usage => 
      new Date(usage.created_at) >= startOfMonth
    ).reduce((sum, usage) => sum + usage.prescriptions_consumed, 0);

    // Calcular prescrições da semana atual
    const startOfWeek = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000));
    const weeklyPrescriptions = prescriptionUsage.filter(usage => 
      new Date(usage.created_at) >= startOfWeek
    ).reduce((sum, usage) => sum + usage.prescriptions_consumed, 0);

    const remainingPrescriptions = Math.max(0, monthlyPrescriptionLimit - monthlyPrescriptions);
    const usagePercentage = (monthlyPrescriptions / monthlyPrescriptionLimit) * 100;

    return {
      totalPrescriptions,
      monthlyPrescriptions,
      weeklyPrescriptions,
      remainingPrescriptions,
      usagePercentage,
      monthlyLimit: monthlyPrescriptionLimit
    };
  };

  const getPrescriptionsByPeriod = (days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return prescriptionUsage.filter(usage => new Date(usage.created_at) >= cutoffDate);
  };

  const addPrescriptionUsage = async (recipeId: string, recipeName: string, prescriptions: number = 1) => {
    try {
      const newUsage: PrescriptionUsage = {
        id: `prescription-${Date.now()}`,
        recipe_id: recipeId,
        prescriptions_consumed: prescriptions,
        created_at: new Date().toISOString(),
        recipe_name: recipeName,
        status: 'pending'
      };

      setPrescriptionUsage(prev => [newUsage, ...prev]);
      
      // Em uma implementação real, você salvaria no banco de dados
      console.log('Prescription usage added:', newUsage);
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao adicionar uso de prescrição:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  // Real-time subscription para mudanças nas receitas (que afetam prescrições)
  useEffect(() => {
    if (!hasInitialized.current) {
      fetchPrescriptionUsage();
    }

    const channel = supabase
      .channel('prescription-usage-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Teste-Tabela'
        },
        (payload) => {
          console.log('Mudança detectada nas receitas (afetando prescrições):', payload);
          
          if (payload.eventType === 'INSERT') {
            const newRecipe = payload.new as any;
            const newPrescriptionUsage: PrescriptionUsage = {
              id: `prescription-${newRecipe.id}`,
              recipe_id: newRecipe.id,
              prescriptions_consumed: 1,
              created_at: newRecipe.created_at,
              recipe_name: newRecipe.nome,
              status: newRecipe.status || 'pending'
            };
            
            setPrescriptionUsage(prev => [newPrescriptionUsage, ...prev]);
            
            // Mostrar notificação de prescrição consumida
            if ((window as any).showNotification) {
              (window as any).showNotification({
                type: 'info',
                title: 'Prescrição consumida!',
                message: `1 prescrição foi consumida para gerar a receita "${newRecipe.nome}".`,
                duration: 4000
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    prescriptionUsage,
    loading,
    error,
    isInitialized,
    refetch: fetchPrescriptionUsage,
    getPrescriptionStats,
    getPrescriptionsByPeriod,
    addPrescriptionUsage,
    monthlyPrescriptionLimit
  };
} 