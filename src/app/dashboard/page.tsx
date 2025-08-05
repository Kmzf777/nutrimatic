'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { FileText, Eye, RefreshCw, CheckCircle, XCircle, Clock, User, Phone, Mail } from 'lucide-react';
import { getNomeCliente } from '@/lib/utils';

export default function Dashboard() {
  const { nutricionista } = useAuth();
  const { prescriptions, loading: prescriptionsLoading, createPrescription } = usePrescriptions();
  const [selectedPrescription, setSelectedPrescription] = useState<{ url: string; title: string } | null>(null);

  // Combine loading states
  const loading = prescriptionsLoading;
  


  // Dashboard carregado com dados reais do usuário

  // Categorizar prescrições por status  
  const approvedPrescriptions = prescriptions.filter(p => p.status === 'Aprovada');
  const rejectedPrescriptions = prescriptions.filter(p => p.status === 'Refazendo');
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pendente');

  // Calcular estatísticas de prescrições
  const totalPrescriptions = prescriptions.length;
  const activePrescriptions = prescriptions.filter(p => p.status === 'Aprovada').length;
  const draftPrescriptions = prescriptions.filter(p => p.status === 'Pendente').length;
  
  // Usar dados do nutricionista para limite
  const monthlyLimit = nutricionista?.presc_max || 0;
  const remainingPrescriptions = Math.max(0, monthlyLimit - (nutricionista?.presc_geradas || 0));

  const refetch = () => {
    // Implementar refetch se necessário
  };



  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title="Dashboard"
          subtitle="Visão geral das suas prescrições"
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
              title="Prescrições Geradas"
              value={prescriptions.length}
              icon={<FileText className="w-6 h-6" />}
              color="nutrimatic"
              trend={{ value: prescriptions.length, isPositive: true }}
            />
            
            <StatsCard
              title="Prescrições Aprovadas"
              value={approvedPrescriptions.length}
              icon={<CheckCircle className="w-6 h-6" />}
              color="green"
              trend={{ value: approvedPrescriptions.length, isPositive: true }}
            />
            
            <StatsCard
              title="Prescrições Pendentes"
              value={pendingPrescriptions.length}
              icon={<Clock className="w-6 h-6" />}
              color="yellow"
              trend={{ value: pendingPrescriptions.length, isPositive: pendingPrescriptions.length > 0 }}
            />

            <StatsCard
              title="Prescrições Restantes"
              value={remainingPrescriptions}
              icon={<Clock className="w-6 h-6" />}
              color="purple"
              trend={{ value: remainingPrescriptions, isPositive: remainingPrescriptions > 0 }}
            />
          </div>

          {/* Informações do Nutricionista */}
          {nutricionista && (
            <ContentCard
              title="Suas Informações"
              subtitle="Dados da sua conta"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-medium text-gray-900">{nutricionista.nome}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{nutricionista.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium text-gray-900">{nutricionista.telefone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-green-900">Ativo</p>
                  </div>
                </div>
              </div>
            </ContentCard>
          )}

          {/* Seção de Prescrições */}
          <ContentCard
            title="Prescrições Recentes"
            subtitle="Suas prescrições ativas e rascunhos"
            actions={
              <div className="flex items-center space-x-3">
                <ConnectionStatus />
              </div>
            }
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-nutrimatic-600" />
                <span className="ml-3 text-gray-600">Carregando prescrições...</span>
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg mb-2">Nenhuma prescrição encontrada</p>
                <p className="text-sm text-gray-500">Suas prescrições aparecerão aqui</p>
                <div className="mt-4">
                  <a
                    href="/dashboard/prescricoes"
                    className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                  >
                    Ver página de prescrições →
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.slice(0, 5).map((prescription) => (
                  <div key={prescription.id} className="flex items-center p-4 bg-gray-50/50 rounded-xl border border-gray-200/30">
                    <div className={`w-3 h-3 rounded-full mr-4 ${
                      prescription.status === 'Aprovada' ? 'bg-green-500' : 
                      prescription.status === 'Pendente' ? 'bg-yellow-500' : 
                      prescription.status === 'Refazendo' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {getNomeCliente(prescription)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(prescription.data).toLocaleDateString('pt-BR')} • 
                        {prescription.status === 'Aprovada' ? 'Aprovada' : 
                         prescription.status === 'Pendente' ? 'Pendente' : 
                         prescription.status === 'Refazendo' ? 'Refazendo' : prescription.status}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-nutrimatic-600 rounded-lg hover:bg-white transition-all duration-300">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {prescriptions.length > 5 && (
                  <div className="text-center pt-6 border-t border-gray-200/50">
                    <a
                      href="/dashboard/prescricoes"
                      className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                    >
                      Ver todas as {prescriptions.length} prescrições →
                    </a>
                  </div>
                )}
              </div>
            )}
          </ContentCard>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}