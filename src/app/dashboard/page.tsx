'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { useRecipes } from '@/hooks/useRecipes';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import PDFModal from '@/components/ui/PDFModal';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import { useState } from 'react';
import { FileText, Eye, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { recipes, loading: recipesLoading, error: recipesError, refetch: refetchRecipes, formatTimeAgo } = useRecipes();
  const { getPrescriptionStats } = usePrescriptions();
  const [selectedRecipe, setSelectedRecipe] = useState<{ url: string; title: string } | null>(null);

  const loading = recipesLoading;
  const error = recipesError;

  const handleViewPDF = (recipe: { url: string; nome: string }) => {
    setSelectedRecipe({ url: recipe.url, title: recipe.nome });
  };

  const handleClosePDF = () => {
    setSelectedRecipe(null);
  };

  // Categorizar receitas por status
  const approvedRecipes = recipes.filter(recipe => recipe.status === 'approved');
  const rejectedRecipes = recipes.filter(recipe => recipe.status === 'rejected');
  const pendingRecipes = recipes.filter(recipe => !recipe.status || recipe.status === 'pending');

  // Obter estatísticas de prescrições
  const prescriptionStats = getPrescriptionStats();
  const { remainingPrescriptions } = prescriptionStats;

  const refetch = () => {
    refetchRecipes();
  };

  return (
    <DashboardLayout>
      <DashboardPageLayout
        title="Dashboard"
        subtitle="Visão geral das suas receitas"
        actions={
          <DashboardButton
            onClick={refetch}
            disabled={loading}
            variant="primary"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </DashboardButton>
        }
      >
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Receitas Geradas"
            value={recipes.length}
            icon={<FileText className="w-6 h-6" />}
            color="nutrimatic"
            trend={{ value: recipes.length, isPositive: true }}
          />
          
          <StatsCard
            title="Receitas Aprovadas"
            value={approvedRecipes.length}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
            trend={{ value: approvedRecipes.length, isPositive: true }}
          />
          
          <StatsCard
            title="Receitas Não Aprovadas"
            value={rejectedRecipes.length}
            icon={<XCircle className="w-6 h-6" />}
            color="red"
            trend={{ value: rejectedRecipes.length, isPositive: false }}
          />

          <StatsCard
            title="Prescrições Restantes"
            value={remainingPrescriptions}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            }
            color="nutrimatic"
            trend={{ value: remainingPrescriptions, isPositive: true }}
          />
        </div>

        {/* Seção de Receitas Pendentes */}
        <ContentCard
          title="Receitas Pendentes"
          subtitle="Receitas aguardando aprovação"
          actions={
            <div className="flex items-center space-x-3">
              <ConnectionStatus />
            </div>
          }
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-nutrimatic-600" />
              <span className="ml-3 text-gray-600">Carregando receitas...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Erro ao carregar receitas: {error}</p>
              <DashboardButton
                onClick={refetch}
                variant="primary"
              >
                Tentar novamente
              </DashboardButton>
            </div>
          ) : pendingRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Nenhuma receita pendente</p>
              <p className="text-sm text-gray-500">As receitas pendentes aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRecipes.slice(0, 5).map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-4 bg-yellow-50/50 rounded-xl hover:bg-yellow-100/50 transition-all duration-300 cursor-pointer border border-yellow-200/30"
                  onClick={() => handleViewPDF(recipe)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">{recipe.nome}</h3>
                      <p className="text-sm text-gray-500">{formatTimeAgo(recipe.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-white transition-all duration-300">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {pendingRecipes.length > 5 && (
                <div className="text-center pt-6 border-t border-gray-200/50">
                  <a
                    href="/dashboard/receitas"
                    className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                  >
                    Ver todas as {pendingRecipes.length} receitas pendentes →
                  </a>
                </div>
              )}
            </div>
          )}
        </ContentCard>

        {/* Seção de Receitas Aprovadas */}
        <ContentCard
          title="Receitas Aprovadas"
          subtitle="Receitas que foram aprovadas"
        >
          {approvedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Nenhuma receita aprovada</p>
              <p className="text-sm text-gray-500">As receitas aprovadas aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvedRecipes.slice(0, 5).map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl hover:bg-green-100/50 transition-all duration-300 cursor-pointer border border-green-200/30"
                  onClick={() => handleViewPDF(recipe)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">{recipe.nome}</h3>
                      <p className="text-sm text-gray-500">{formatTimeAgo(recipe.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-white transition-all duration-300">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {approvedRecipes.length > 5 && (
                <div className="text-center pt-6 border-t border-gray-200/50">
                  <a
                    href="/dashboard/receitas"
                    className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                  >
                    Ver todas as {approvedRecipes.length} receitas aprovadas →
                  </a>
                </div>
              )}
            </div>
          )}
        </ContentCard>

        {/* Seção de Receitas Não Aprovadas */}
        <ContentCard
          title="Receitas Não Aprovadas"
          subtitle="Receitas que foram rejeitadas"
        >
          {rejectedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Nenhuma receita rejeitada</p>
              <p className="text-sm text-gray-500">As receitas rejeitadas aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rejectedRecipes.slice(0, 5).map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl hover:bg-red-100/50 transition-all duration-300 cursor-pointer border border-red-200/30"
                  onClick={() => handleViewPDF(recipe)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">{recipe.nome}</h3>
                      <p className="text-sm text-gray-500">{formatTimeAgo(recipe.created_at)}</p>
                      {recipe.rejection_observation && (
                        <p className="text-xs text-red-600 mt-1">{recipe.rejection_observation}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-all duration-300">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {rejectedRecipes.length > 5 && (
                <div className="text-center pt-6 border-t border-gray-200/50">
                  <a
                    href="/dashboard/receitas"
                    className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                  >
                    Ver todas as {rejectedRecipes.length} receitas rejeitadas →
                  </a>
                </div>
              )}
            </div>
          )}
        </ContentCard>

        {/* Área de atividade recente com prescrições */}
        <ContentCard
          title="Atividade Recente"
          subtitle="Últimas atividades e consumo de prescrições"
        >
          <div className="space-y-4">
            {recipes.slice(0, 5).map((recipe) => (
              <div key={recipe.id} className="flex items-center p-4 bg-gray-50/50 rounded-xl border border-gray-200/30">
                <div className={`w-3 h-3 rounded-full mr-4 ${
                  recipe.status === 'approved' ? 'bg-green-500' : 
                  recipe.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Receita "{recipe.nome}" {recipe.status === 'approved' ? 'aprovada' : 
                    recipe.status === 'rejected' ? 'rejeitada' : 'gerada'}
                  </p>
                  <p className="text-xs text-gray-500">{formatTimeAgo(recipe.created_at)} • 1 prescrição consumida</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-nutrimatic-100 rounded-full">
                    <svg className="w-3 h-3 text-nutrimatic-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-xs font-medium text-nutrimatic-600">1</span>
                  </div>
                </div>
              </div>
            ))}
            
            {recipes.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">Nenhuma atividade recente</p>
                <p className="text-sm text-gray-500">As atividades aparecerão aqui quando receitas forem geradas</p>
              </div>
            )}

            {recipes.length > 5 && (
              <div className="text-center pt-6 border-t border-gray-200/50">
                <a
                  href="/dashboard/uso"
                  className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                >
                  Ver todas as atividades e estatísticas de prescrições →
                </a>
              </div>
            )}
          </div>
        </ContentCard>
      </DashboardPageLayout>

      {/* Modal do PDF */}
      {selectedRecipe && (
        <PDFModal
          isOpen={!!selectedRecipe}
          onClose={handleClosePDF}
          url={selectedRecipe.url}
          title={selectedRecipe.title}
        />
      )}
    </DashboardLayout>
  );
} 