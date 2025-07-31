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

export function usePrescriptions() {
  const [prescriptionUsage, setPrescriptionUsage] = useState<PrescriptionUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
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

      // Simular dados de uso de prescrições baseado nas receitas
      const simulatedPrescriptionUsage: PrescriptionUsage[] = (recipes || []).map((recipe, index) => ({
        id: `prescription-${recipe.id}`,
        recipe_id: recipe.id,
        prescriptions_consumed: 1, // 1 prescrição por receita
        created_at: recipe.created_at,
        recipe_name: recipe.nome,
        status: recipe.status || 'pending'
      }));

      setPrescriptionUsage(simulatedPrescriptionUsage);
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Erro ao buscar uso de prescrições:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getPrescriptionStats = (): PrescriptionStats => {
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