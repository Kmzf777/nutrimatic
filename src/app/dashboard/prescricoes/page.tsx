'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrescricoes } from '@/hooks/usePrescricoes';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { CheckCircle, XCircle, Clock, Eye, RefreshCw, Loader2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createSlug, getNomeCliente } from '@/lib/utils';

export default function PrescricoesPage() {
  const router = useRouter();
  const {
    prescricoes,
    prescricoesPendentes,
    prescricoesAprovadas,
    prescricoesRefazendo,
    loading,
    error,
    refetch,
  } = usePrescricoes();

  const [filtroStatus, setFiltroStatus] = useState<string>('Todas');

  // Função para navegar para página individual da prescrição
  const handlePrescricaoClick = (prescricao: any) => {
    // Validar se temos dados válidos para navegação
    if (!prescricao || !prescricao.id) {
      console.error('Prescrição inválida:', prescricao);
      alert('Erro: Dados da prescrição estão inválidos');
      return;
    }

    // Usar função utilitária para obter o nome
    const nomeCliente = getNomeCliente(prescricao);
    const slug = createSlug(nomeCliente === 'Nome não informado' ? `prescricao-${prescricao.id}` : nomeCliente);
    
    router.push(`/dashboard/prescricoes/${slug}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Aprovada':
      case 'Aprovado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Refazendo':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-50 border-yellow-200';
      case 'Aprovada':
      case 'Aprovado':
        return 'bg-green-50 border-green-200';
      case 'Refazendo':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprovada':
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Refazendo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  // Filtrar e ordenar prescrições
  const prescricoesFiltradas = (filtroStatus === 'Todas' 
    ? prescricoes 
    : filtroStatus === 'Aprovada' 
      ? prescricoes.filter(prescricao => prescricao.status === 'Aprovada' || prescricao.status === 'Aprovado')
      : prescricoes.filter(prescricao => prescricao.status === filtroStatus)
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title="Prescrições"
          subtitle="Gerencie suas prescrições geradas"
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mr-3" />
              <span className="text-gray-600">Carregando prescrições...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Erro ao carregar prescrições: {error}</p>
              <DashboardButton onClick={refetch} variant="primary">
                Tentar novamente
              </DashboardButton>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">{prescricoesPendentes.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Aprovadas</p>
                      <p className="text-2xl font-bold text-gray-900">{prescricoesAprovadas.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center">
                    <XCircle className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Refazendo</p>
                      <p className="text-2xl font-bold text-gray-900">{prescricoesRefazendo.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center">
                    <Eye className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{prescricoes.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Todas', 'Pendente', 'Aprovada', 'Refazendo'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFiltroStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filtroStatus === status
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                        {status !== 'Todas' && (
                          <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                            {status === 'Pendente' && prescricoesPendentes.length}
                            {status === 'Aprovada' && prescricoesAprovadas.length}
                            {status === 'Refazendo' && prescricoesRefazendo.length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lista de Prescrições */}
              <ContentCard title={`${filtroStatus === 'Todas' ? 'Todas as' : filtroStatus === 'Pendente' ? 'Prescrições Pendentes' : filtroStatus === 'Aprovada' ? 'Prescrições Aprovadas' : 'Prescrições para Refazer'} Prescrições`} subtitle={`${prescricoesFiltradas.length} prescrições encontradas`}>
                {prescricoesFiltradas.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-2">
                      {prescricoes.length === 0 
                        ? 'Nenhuma prescrição encontrada' 
                        : `Nenhuma prescrição ${filtroStatus.toLowerCase()} encontrada`
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {prescricoes.length === 0 
                        ? 'As prescrições geradas aparecerão aqui' 
                        : 'Tente outro filtro ou aguarde novas prescrições'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescricoesFiltradas.map((prescricao) => (
                      <div
                        key={prescricao.id}
                        onClick={() => handlePrescricaoClick(prescricao)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${getStatusColor(prescricao.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex-shrink-0">
                              {getStatusIcon(prescricao.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                                                  <h3 className="font-semibold text-gray-900 text-xl">
                                    {getNomeCliente(prescricao)}
                                  </h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(prescricao.status)}`}>
                                  {prescricao.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <p className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {formatDate(prescricao.data)}
                                </p>
                                <p className="flex items-center text-gray-500">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Clique para abrir
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ContentCard>
            </div>
          )}
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 