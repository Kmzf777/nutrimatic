'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton, DashboardInput, DashboardSelect, StatusBadge } from '@/components/dashboard/DashboardPageLayout';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeApprovalModal from '@/components/ui/RecipeApprovalModal';
import ConnectionStatus from '@/components/ui/ConnectionStatus';

import { useState } from 'react';
import { FileText, Eye, Search, RefreshCw } from 'lucide-react';

export default function ReceitasPage() {
  const { recipes, loading, error, refetch, approveRecipe, rejectRecipe, formatTimeAgo } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<{ id: string; url: string; nome: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');

  const handleViewRecipe = (recipe: { id: string; url: string; nome: string }) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const handleApproveRecipe = async (recipeId: string) => {
    const result = await approveRecipe(recipeId);
    if (result.success) {
      // Mostrar notificação de sucesso
      if ((window as any).showNotification) {
        (window as any).showNotification({
          type: 'success',
          title: 'Receita aprovada!',
          message: 'A receita foi aprovada com sucesso.',
          duration: 3000
        });
      }
    } else {
      // Mostrar notificação de erro
      if ((window as any).showNotification) {
        (window as any).showNotification({
          type: 'error',
          title: 'Erro ao aprovar',
          message: result.error || 'Erro desconhecido ao aprovar receita.',
          duration: 5000
        });
      }
    }
  };

  const handleRejectRecipe = async (recipeId: string, observation: string) => {
    const result = await rejectRecipe(recipeId, observation);
    if (result.success) {
      // Mostrar notificação de sucesso
      if ((window as any).showNotification) {
        (window as any).showNotification({
          type: 'success',
          title: 'Receita reprovada!',
          message: 'A receita foi reprovada com sucesso.',
          duration: 3000
        });
      }
    } else {
      // Mostrar notificação de erro
      if ((window as any).showNotification) {
        (window as any).showNotification({
          type: 'error',
          title: 'Erro ao reprovar',
          message: result.error || 'Erro desconhecido ao reprovar receita.',
          duration: 5000
        });
      }
    }
  };

  // Filtrar receitas baseado no termo de busca e status
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'Todas') return matchesSearch;
    if (filterStatus === 'Pendentes') return matchesSearch && (!recipe.status || recipe.status === 'pending');
    if (filterStatus === 'Aprovadas') return matchesSearch && recipe.status === 'approved';
    if (filterStatus === 'Reprovadas') return matchesSearch && recipe.status === 'rejected';
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <StatusBadge status="success" />;
      case 'rejected': return <StatusBadge status="error" />;
      default: return <StatusBadge status="pending" />;
    }
  };

  return (
    <DashboardLayout>
      <DashboardPageLayout
        title="Receitas"
        subtitle="Gerencie e aprove todas as receitas geradas pelo sistema"
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
        <ContentCard
          title="Todas as Receitas"
          subtitle="Visualize e gerencie todas as receitas do sistema"
          actions={
            <div className="flex items-center space-x-3">
              <ConnectionStatus />
            </div>
          }
        >
          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <DashboardInput
                type="text"
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DashboardSelect 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Todas</option>
              <option>Pendentes</option>
              <option>Aprovadas</option>
              <option>Reprovadas</option>
            </DashboardSelect>
          </div>

          {/* Lista de Receitas */}
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
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">
                {searchTerm ? 'Nenhuma receita encontrada para sua busca' : 'Nenhuma receita encontrada'}
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'As receitas aparecerão aqui quando forem criadas via n8n'}
              </p>
              <div className="mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/30">
                <p className="text-sm text-gray-600">
                  <strong>Debug:</strong> Total de receitas carregadas: {recipes.length}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-all duration-300 cursor-pointer border border-gray-200/30"
                  onClick={() => handleViewRecipe(recipe)}
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
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(recipe.status)}
                    <button 
                      className="p-2 text-gray-400 hover:text-nutrimatic-600 rounded-lg hover:bg-white transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRecipe(recipe);
                      }}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Estatísticas */}
          {filteredRecipes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <p className="text-sm text-gray-600">
                Mostrando {filteredRecipes.length} de {recipes.length} receitas
              </p>
            </div>
          )}
        </ContentCard>
      </DashboardPageLayout>

      {/* Modal de Aprovação/Reprovação */}
      {selectedRecipe && (
        <RecipeApprovalModal
          isOpen={!!selectedRecipe}
          onClose={handleCloseModal}
          recipe={selectedRecipe}
          onApprove={handleApproveRecipe}
          onReject={handleRejectRecipe}
        />
      )}
    </DashboardLayout>
  );
} 