'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usePrescricoes } from '@/hooks/usePrescricoes';
import { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, Activity, FileText, CheckCircle, XCircle, ClipboardList, Zap, AlertTriangle } from 'lucide-react';

export default function UsoSistema() {
  const { nutricionista, loading: authLoading } = useAuth();
  const { prescricoes, loading: prescricoesLoading, error: prescricoesError, refetch: refetchPrescricoes } = usePrescricoes();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const loading = authLoading || prescricoesLoading;
  const error = prescricoesError;

  // Dados do usuário logado
  const prescricoesGeradas = nutricionista?.presc_geradas || 0;
  const prescricoesMax = nutricionista?.presc_max || 0;
  const totalPrescriptions = prescricoes.length;
  
  // Calcular prescrições do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPrescriptions = prescricoes.filter(prescricao => {
    const prescricaoDate = new Date(prescricao.data);
    return prescricaoDate.getMonth() === currentMonth && prescricaoDate.getFullYear() === currentYear;
  }).length;

  // Calcular prescrições da semana atual
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyPrescriptions = prescricoes.filter(prescricao => {
    const prescricaoDate = new Date(prescricao.data);
    return prescricaoDate >= oneWeekAgo;
  }).length;

  const remainingPrescriptions = Math.max(0, prescricoesMax - prescricoesGeradas);
  const usagePercentage = prescricoesMax > 0 ? (prescricoesGeradas / prescricoesMax) * 100 : 0;

  const refetch = () => {
    refetchPrescricoes();
  };

  return (
    <ProtectedRoute>
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
            subtitle="Controle de consumo de prescrições mensal"
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
                    <p className="text-sm text-gray-500">Limite mensal: {prescricoesMax}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-nutrimatic-600">{remainingPrescriptions}</p>
                  <p className="text-sm text-gray-500">de {prescricoesMax}</p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Consumo de Prescrições</span>
                  <span className="text-sm font-bold text-gray-900">
                    {prescricoesGeradas} / {prescricoesMax}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      usagePercentage > 80 ? 'bg-red-500' : 
                      usagePercentage > 60 ? 'bg-yellow-500' : 'bg-nutrimatic-500'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Alertas */}
              {usagePercentage > 80 && (
                <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-sm text-red-700">
                    Atenção: {remainingPrescriptions} prescrições restantes este mês
                  </span>
                </div>
              )}

              {usagePercentage > 60 && usagePercentage <= 80 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-sm text-yellow-700">
                    Consumo moderado: {remainingPrescriptions} prescrições restantes
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
                    <p className="text-sm text-gray-500">{weeklyPrescriptions} prescrições</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-nutrimatic-600">{weeklyPrescriptions}</p>
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
                    <p className="text-sm text-gray-500">{monthlyPrescriptions} prescrições</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{monthlyPrescriptions}</p>
                  <p className="text-xs text-gray-500">prescrições</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-200/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Total gerado</p>
                    <p className="text-sm text-gray-500">{totalPrescriptions} prescrições</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{totalPrescriptions}</p>
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
            subtitle="Últimas prescrições registradas no sistema"
          >
            <div className="space-y-3">
              {/* Cabeçalho da tabela */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-700">Cliente</span>
                <span className="font-medium text-gray-700">Status</span>
              </div>

              {/* Lista de atividades recentes */}
              {(() => {
                const recentPrescricoes = prescricoes
                  .filter(prescricao => {
                    const prescricaoDate = new Date(prescricao.data);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return prescricaoDate >= oneWeekAgo;
                  })
                  .slice(0, 7)
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

                const getStatusColor = (status: string) => {
                  switch (status.toLowerCase()) {
                    case 'aprovada':
                      return 'text-green-600 bg-green-50 border-green-200';
                    case 'refazendo':
                      return 'text-red-600 bg-red-50 border-red-200';
                    case 'pendente':
                    default:
                      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
                  }
                };

                if (recentPrescricoes.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma prescrição recente encontrada</p>
                      <p className="text-sm text-gray-500 mt-2">Prescrições aparecerão aqui conforme forem criadas</p>
                    </div>
                  );
                }

                return recentPrescricoes.map((prescricao) => (
                  <div key={prescricao.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-nutrimatic-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-nutrimatic-600">
                          {prescricao.nome_cliente ? prescricao.nome_cliente.charAt(0).toUpperCase() : 'P'}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {prescricao.nome_cliente || 'Cliente'}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescricao.status || 'Pendente')}`}>
                      {prescricao.status || 'Pendente'}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </ContentCard>

          <ContentCard
            title="Taxa de Aprovação"
            subtitle="Percentual de prescrições aprovadas vs rejeitadas"
          >
            <div className="space-y-6">
              {prescricoes.length > 0 ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Aprovadas</span>
                      <span className="text-sm font-bold text-green-600">
                        {((prescricoes.filter(prescricao => prescricao.status?.toLowerCase() === 'aprovada').length / prescricoes.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(prescricoes.filter(prescricao => prescricao.status?.toLowerCase() === 'aprovada').length / prescricoes.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Refazendo</span>
                      <span className="text-sm font-bold text-red-600">
                        {((prescricoes.filter(prescricao => prescricao.status?.toLowerCase() === 'refazendo').length / prescricoes.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(prescricoes.filter(prescricao => prescricao.status?.toLowerCase() === 'refazendo').length / prescricoes.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Pendentes</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {prescricoes.filter(prescricao => !prescricao.status || prescricao.status.toLowerCase() === 'pendente').length}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma prescrição para calcular estatísticas</p>
                  <p className="text-sm text-gray-500 mt-2">Estatísticas aparecerão aqui conforme prescrições forem criadas</p>
                </div>
              )}
            </div>
          </ContentCard>
        </div>
      </DashboardPageLayout>
    </DashboardLayout>
    </ProtectedRoute>
  );
} 