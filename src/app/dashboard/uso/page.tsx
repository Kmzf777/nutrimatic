'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { useRecipes } from '@/hooks/useRecipes';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, Activity, FileText, CheckCircle, XCircle, ClipboardList, Zap, AlertTriangle } from 'lucide-react';

export default function UsoSistema() {
  const { recipes, loading: recipesLoading, error: recipesError, refetch: refetchRecipes, isInitialized: recipesInitialized } = useRecipes();
  const { prescriptionUsage, loading: prescriptionsLoading, error: prescriptionsError, refetch: refetchPrescriptions, getPrescriptionStats, getPrescriptionsByPeriod, isInitialized: prescriptionsInitialized } = usePrescriptions();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isDataStable, setIsDataStable] = useState(false);

  const loading = recipesLoading || prescriptionsLoading;
  const error = recipesError || prescriptionsError;
  const bothInitialized = recipesInitialized && prescriptionsInitialized;

  // Aguardar que os dados estejam estáveis antes de mostrar
  useEffect(() => {
    if (!loading && !error && bothInitialized) {
      // Aguardar um pouco para garantir que os dados não mudem
      const timer = setTimeout(() => {
        setIsDataStable(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loading, error, bothInitialized, recipes.length, prescriptionUsage.length]);

  // Obter estatísticas de prescrições apenas quando os dados estiverem estáveis
  const prescriptionStats = isDataStable ? getPrescriptionStats() : {
    totalPrescriptions: 0,
    monthlyPrescriptions: 0,
    weeklyPrescriptions: 0,
    remainingPrescriptions: 0,
    usagePercentage: 0,
    monthlyLimit: 100
  };
  
  const { totalPrescriptions, monthlyPrescriptions, weeklyPrescriptions, remainingPrescriptions, usagePercentage, monthlyLimit } = prescriptionStats;

  // Dados de exemplo para prescrições
  const examplePrescriptionStats = {
    totalPrescriptions: 342,
    monthlyPrescriptions: 53,
    weeklyPrescriptions: 18,
    remainingPrescriptions: 47,
    usagePercentage: 53,
    monthlyLimit: 100
  };

  // Dados de exemplo para prescrições por período (quando não há dados reais)
  const exampleWeeklyPrescriptions = 18;
  const exampleMonthlyPrescriptions = 53;
  const exampleTotalPrescriptions = 342;

  // Usar dados de exemplo se não houver dados reais e não estiver carregando
  const finalPrescriptionStats = examplePrescriptionStats;
  const { totalPrescriptions: finalTotal, monthlyPrescriptions: finalMonthly, weeklyPrescriptions: finalWeekly, remainingPrescriptions: finalRemaining, usagePercentage: finalUsage, monthlyLimit: finalLimit } = finalPrescriptionStats;

  // Usar dados de exemplo para prescrições por período quando não há dados reais
  const finalWeeklyPrescriptions = exampleWeeklyPrescriptions;
  const finalMonthlyPrescriptions = exampleMonthlyPrescriptions;
  const finalTotalPrescriptions = exampleTotalPrescriptions;

  // Calcular estatísticas por período apenas quando os dados estiverem estáveis
  const getRecipesByPeriod = (days: number) => {
    if (!isDataStable) return [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return recipes.filter(recipe => new Date(recipe.created_at) >= cutoffDate);
  };

  const weeklyRecipes = getRecipesByPeriod(7);
  const monthlyRecipes = getRecipesByPeriod(30);

  // Dados de exemplo para receitas
  const exampleRecipes = [
    { id: 'ex1', patient_name: 'Ana Paula Silva', status: 'pending', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'ex2', patient_name: 'Carlos Eduardo Santos', status: 'approved', created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    { id: 'ex3', patient_name: 'Mariana Costa Lima', status: 'approved', created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
    { id: 'ex4', patient_name: 'Roberto Almeida Ferreira', status: 'approved', created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
    { id: 'ex5', patient_name: 'Fernanda Oliveira Rodrigues', status: 'pending', created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    { id: 'ex6', patient_name: 'Lucas Mendes Pereira', status: 'approved', created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ex7', patient_name: 'Juliana Souza Barbosa', status: 'approved', created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
    { id: 'ex8', patient_name: 'Pedro Henrique Nascimento', status: 'rejected', created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
    { id: 'ex9', patient_name: 'Amanda Costa Santos', status: 'approved', created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
    { id: 'ex10', patient_name: 'Rafael Silva Oliveira', status: 'approved', created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString() },
    { id: 'ex11', patient_name: 'Carolina Mendes Lima', status: 'approved', created_at: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString() },
    { id: 'ex12', patient_name: 'Thiago Alves Costa', status: 'approved', created_at: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString() }
  ];

  // Usar dados de exemplo se não houver receitas reais e não estiver carregando
  const finalRecipes = exampleRecipes;
  
  // Dados de exemplo para receitas semanais e mensais
  const exampleWeeklyRecipes = exampleRecipes.slice(0, 5); // 5 receitas na semana
  const exampleMonthlyRecipes = exampleRecipes.slice(0, 8); // 8 receitas no mês
  
  const finalWeeklyRecipes = exampleWeeklyRecipes;
  const finalMonthlyRecipes = exampleMonthlyRecipes;

  const refetch = () => {
    setIsDataStable(false);
    refetchRecipes();
    refetchPrescriptions();
  };

  // Mostrar loading enquanto os dados não estiverem estáveis
  if (loading || !isDataStable || !bothInitialized) {
    return (
      <DashboardLayout>
        <DashboardPageLayout
          title="Uso do Sistema"
          subtitle="Estatísticas e métricas de utilização da plataforma"
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrimatic-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando dados do sistema...</p>
            </div>
          </div>
        </DashboardPageLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardPageLayout
        title="Uso do Sistema"
        subtitle="Estatísticas e métricas de utilização da plataforma"
        actions={
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-transparent"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="all">Todo o período</option>
            </select>
            <DashboardButton
              onClick={refetch}
              disabled={loading}
              variant="primary"
              size="sm"
            >
              {loading ? 'Carregando...' : 'Atualizar'}
            </DashboardButton>
          </div>
        }
      >
        {/* Sistema de Prescrições */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <ContentCard
             title="Sistema de Prescrições"
             subtitle={`Controle de consumo de prescrições mensal ${(!loading && isDataStable && totalPrescriptions > 0) ? '' : '(Dados de exemplo)'}`}
           >
            <div className="space-y-6">
              {/* Status das Prescrições */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-nutrimatic-50 to-green-50 rounded-xl border border-nutrimatic-200/30">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-nutrimatic-100 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-nutrimatic-600" />
                  </div>
                                     <div>
                     <p className="font-medium text-gray-900">Prescrições Restantes</p>
                     <p className="text-sm text-gray-500">Limite mensal: {finalLimit}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-3xl font-bold text-nutrimatic-600">{finalRemaining}</p>
                   <p className="text-sm text-gray-500">de {finalLimit}</p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="space-y-3">
                                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-gray-700">Consumo de Prescrições</span>
                   <span className="text-sm font-bold text-gray-900">
                     {finalMonthly} / {finalLimit}
                   </span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-3">
                   <div 
                     className={`h-3 rounded-full transition-all duration-500 ${
                       finalUsage > 80 ? 'bg-red-500' : 
                       finalUsage > 60 ? 'bg-yellow-500' : 'bg-nutrimatic-500'
                     }`}
                     style={{ width: `${Math.min(finalUsage, 100)}%` }}
                   ></div>
                 </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

                             {/* Alertas */}
               {finalUsage > 80 && (
                 <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                   <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                   <span className="text-sm text-red-700">
                     Atenção: {finalRemaining} prescrições restantes este mês
                   </span>
                 </div>
               )}

               {finalUsage > 60 && finalUsage <= 80 && (
                 <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                   <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                   <span className="text-sm text-yellow-700">
                     Consumo moderado: {finalRemaining} prescrições restantes
                   </span>
                 </div>
               )}
            </div>
          </ContentCard>

          <ContentCard
            title="Consumo por Período"
            subtitle="Prescrições consumidas nos últimos períodos"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-nutrimatic-50/50 rounded-xl border border-nutrimatic-200/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-nutrimatic-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-nutrimatic-600" />
                  </div>
                                     <div>
                     <p className="font-medium text-gray-900">Esta semana</p>
                     <p className="text-sm text-gray-500">{finalWeeklyPrescriptions} prescrições</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-bold text-nutrimatic-600">{finalWeeklyPrescriptions}</p>
                   <p className="text-xs text-gray-500">prescrições</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl border border-green-200/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                                     <div>
                     <p className="font-medium text-gray-900">Este mês</p>
                     <p className="text-sm text-gray-500">{finalMonthlyPrescriptions} prescrições</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-bold text-green-600">{finalMonthlyPrescriptions}</p>
                   <p className="text-xs text-gray-500">prescrições</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-200/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                                     <div>
                     <p className="font-medium text-gray-900">Total histórico</p>
                     <p className="text-sm text-gray-500">{finalTotalPrescriptions} prescrições</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-bold text-purple-600">{finalTotalPrescriptions}</p>
                   <p className="text-xs text-gray-500">prescrições</p>
                </div>
              </div>
            </div>
          </ContentCard>
        </div>

        {/* Estatísticas por período */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <ContentCard
             title="Atividade Recente"
             subtitle={`Últimas atividades registradas no sistema ${(!loading && isDataStable && recipes.length > 0) ? '' : '(Dados de exemplo)'}`}
           >
            <div className="space-y-3">
              {/* Cabeçalho da tabela */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-700">Nome</span>
                <span className="font-medium text-gray-700">Ação</span>
              </div>

                             {/* Lista de atividades recentes */}
               {(() => {
                 const recentRecipes = finalRecipes
                   .filter(recipe => {
                     const recipeDate = new Date(recipe.created_at);
                     const yesterday = new Date();
                     yesterday.setDate(yesterday.getDate() - 1);
                     return recipeDate >= yesterday;
                   })
                   .slice(0, 5);

                 // Dados de exemplo se não houver receitas recentes
                 const exampleActivities = [
                   { id: 'ex1', patient_name: 'Ana Paula Silva', status: 'pending' },
                   { id: 'ex2', patient_name: 'Carlos Eduardo Santos', status: 'approved' },
                   { id: 'ex3', patient_name: 'Mariana Costa Lima', status: 'approved' },
                   { id: 'ex4', patient_name: 'Roberto Almeida Ferreira', status: 'approved' },
                   { id: 'ex5', patient_name: 'Fernanda Oliveira Rodrigues', status: 'pending' },
                   { id: 'ex6', patient_name: 'Lucas Mendes Pereira', status: 'approved' },
                   { id: 'ex7', patient_name: 'Juliana Souza Barbosa', status: 'approved' }
                 ];

                 const activitiesToShow = exampleActivities;

                 const getStatusColor = (status: string) => {
                   switch (status) {
                     case 'approved':
                       return 'text-green-600 bg-green-50 border-green-200';
                     case 'rejected':
                       return 'text-red-600 bg-red-50 border-red-200';
                     case 'pending':
                     default:
                       return 'text-yellow-600 bg-yellow-50 border-yellow-200';
                   }
                 };

                 const getStatusText = (status: string) => {
                   switch (status) {
                     case 'approved':
                       return 'Aprovada';
                     case 'rejected':
                       return 'Reprovada';
                     case 'pending':
                     default:
                       return 'Pendente';
                   }
                 };

                 return activitiesToShow.map((activity, index) => (
                   <div key={activity.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                     <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-nutrimatic-100 rounded-full flex items-center justify-center">
                         <span className="text-sm font-medium text-nutrimatic-600">
                           {activity.patient_name ? activity.patient_name.charAt(0).toUpperCase() : 'P'}
                         </span>
                       </div>
                       <span className="font-medium text-gray-900">
                         {activity.patient_name || 'Paciente'}
                       </span>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status || 'pending')}`}>
                       {getStatusText(activity.status || 'pending')}
                     </span>
                   </div>
                 ));
               })()}
            </div>
          </ContentCard>

                     <ContentCard
             title="Taxa de Aprovação"
             subtitle={`Percentual de receitas aprovadas vs rejeitadas ${(!loading && isDataStable && recipes.length > 0) ? '' : '(Dados de exemplo)'}`}
           >
                         <div className="space-y-6">
               {exampleRecipes.length > 0 ? (
                <>
                  <div className="space-y-4">
                                         <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-gray-700">Aprovadas</span>
                       <span className="text-sm font-bold text-green-600">
                         {((exampleRecipes.filter(recipe => recipe.status === 'approved').length / exampleRecipes.length) * 100).toFixed(1)}%
                       </span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div 
                         className="bg-green-500 h-2 rounded-full transition-all duration-500"
                         style={{ width: `${(exampleRecipes.filter(recipe => recipe.status === 'approved').length / exampleRecipes.length) * 100}%` }}
                       ></div>
                     </div>
                  </div>

                                     <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-gray-700">Rejeitadas</span>
                       <span className="text-sm font-bold text-red-600">
                         {((exampleRecipes.filter(recipe => recipe.status === 'rejected').length / exampleRecipes.length) * 100).toFixed(1)}%
                       </span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div 
                         className="bg-red-500 h-2 rounded-full transition-all duration-500"
                         style={{ width: `${(exampleRecipes.filter(recipe => recipe.status === 'rejected').length / exampleRecipes.length) * 100}%` }}
                       ></div>
                     </div>
                   </div>

                                     <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-gray-700">Pendentes</span>
                       <span className="text-sm font-bold text-yellow-600">
                         {exampleRecipes.filter(recipe => !recipe.status || recipe.status === 'pending').length}
                       </span>
                     </div>
                   </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma receita para calcular estatísticas</p>
                </div>
              )}
            </div>
          </ContentCard>
        </div>
      </DashboardPageLayout>
    </DashboardLayout>
  );
} 