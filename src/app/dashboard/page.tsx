'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { useRecipes } from '@/hooks/useRecipes';
import PDFModal from '@/components/ui/PDFModal';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import { useState } from 'react';
import { FileText, Eye, RefreshCw, Users, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { recipes, loading, error, refetch, formatTimeAgo } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<{ url: string; title: string } | null>(null);

  const handleViewPDF = (recipe: { url: string; nome: string }) => {
    setSelectedRecipe({ url: recipe.url, title: recipe.nome });
  };

  const handleClosePDF = () => {
    setSelectedRecipe(null);
  };

  return (
    <DashboardLayout>
      <DashboardPageLayout
        title="Dashboard"
        subtitle="Visão geral do seu negócio e atividades recentes"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Receitas Geradas"
            value={recipes.length}
            icon={<FileText className="w-6 h-6" />}
            color="nutrimatic"
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatsCard
            title="Clientes Ativos"
            value="567"
            icon={<Users className="w-6 h-6" />}
            color="blue"
            trend={{ value: 8, isPositive: true }}
          />
          
          <StatsCard
            title="Tempo Economizado"
            value="45h"
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Seção de Receitas Recentes */}
        <ContentCard
          title="Receitas Recentes"
          subtitle="Suas receitas mais recentes geradas pelo sistema"
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
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Nenhuma receita encontrada</p>
              <p className="text-sm text-gray-500">As receitas aparecerão aqui quando forem criadas via n8n</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recipes.slice(0, 5).map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-all duration-300 cursor-pointer border border-gray-200/30"
                  onClick={() => handleViewPDF(recipe)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-nutrimatic-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-nutrimatic-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">{recipe.nome}</h3>
                      <p className="text-sm text-gray-500">{formatTimeAgo(recipe.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-nutrimatic-600 rounded-lg hover:bg-white transition-all duration-300">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {recipes.length > 5 && (
                <div className="text-center pt-6 border-t border-gray-200/50">
                  <a
                    href="/dashboard/receitas"
                    className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                  >
                    Ver todas as {recipes.length} receitas →
                  </a>
                </div>
              )}
            </div>
          )}
        </ContentCard>

        {/* Área de atividade recente */}
        <ContentCard
          title="Atividade Recente"
          subtitle="Últimas atividades e interações do sistema"
        >
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50/50 rounded-xl border border-gray-200/30">
              <div className="w-3 h-3 bg-nutrimatic-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nova receita gerada para Maria Silva</p>
                <p className="text-xs text-gray-500">Há 2 minutos</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50/50 rounded-xl border border-gray-200/30">
              <div className="w-3 h-3 bg-nutrimatic-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Consulta agendada com João Santos</p>
                <p className="text-xs text-gray-500">Há 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50/50 rounded-xl border border-gray-200/30">
              <div className="w-3 h-3 bg-nutrimatic-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nova receita aprovada - Carlos Lima</p>
                <p className="text-xs text-gray-500">Há 1 hora</p>
              </div>
            </div>
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