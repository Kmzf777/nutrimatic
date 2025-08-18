'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { useClientes } from '@/hooks/useClientes';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useMemo } from 'react';
import { Users, Eye, RefreshCw, CheckCircle, Clock, User, Phone, Mail, UserPlus } from 'lucide-react';
import { createSlug } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { nutricionista } = useAuth();
  const { clientes, loading, error, refetch, counts, formatTimeAgo } = useClientes();
  const router = useRouter();

  // Clientes novos de hoje
  const clientesHoje = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return clientes.filter(cliente => {
      const dataCliente = new Date(cliente.created_at);
      dataCliente.setHours(0, 0, 0, 0);
      return dataCliente.getTime() === hoje.getTime();
    });
  }, [clientes]);

  const handleClienteClick = (cliente: any) => {
    const slug = createSlug(cliente.nome || cliente.numero || cliente.id);
    router.push(`/dashboard/clientes/${slug}`);
  };





  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title="Dashboard"
          subtitle="Visão geral dos seus clientes"
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
              title="Total de Clientes"
              value={counts.total}
              icon={<Users className="w-6 h-6" />}
              color="nutrimatic"
              trend={{ value: counts.total, isPositive: true }}
            />
            
            <StatsCard
              title="Clientes Novos"
              value={counts.novos}
              icon={<UserPlus className="w-6 h-6" />}
              color="yellow"
              trend={{ value: counts.novos, isPositive: true }}
            />
            
            <StatsCard
              title="Clientes Ativos"
              value={counts.ativos}
              icon={<CheckCircle className="w-6 h-6" />}
              color="green"
              trend={{ value: counts.ativos, isPositive: counts.ativos > 0 }}
            />

            <StatsCard
              title="Clientes Inativos"
              value={counts.inativos}
              icon={<Clock className="w-6 h-6" />}
              color="red"
              trend={{ value: counts.inativos, isPositive: false }}
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

          {/* Seção de Clientes Novos de Hoje */}
          <ContentCard
            title="Clientes Novos de Hoje"
            subtitle="Clientes que chegaram hoje"
            actions={
              <div className="flex items-center space-x-3">
                <ConnectionStatus />
              </div>
            }
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-nutrimatic-600" />
                <span className="ml-3 text-gray-600">Carregando clientes...</span>
              </div>
            ) : clientesHoje.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">Nenhum cliente novo hoje</p>
                <p className="text-sm text-gray-500">Novos clientes aparecerão aqui</p>
                <div className="mt-4">
                  <a
                    href="/dashboard/clientes"
                    className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                  >
                    Ver todos os clientes →
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {clientesHoje.slice(0, 5).map((cliente) => {
                  const initials = (cliente.nome || (cliente.numero || '')).split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={cliente.id} className="flex items-center p-4 bg-gray-50/50 rounded-xl border border-gray-200/30 cursor-pointer hover:bg-gray-100/50 transition-all duration-300" onClick={() => handleClienteClick(cliente)}>
                      <div className="w-10 h-10 bg-nutrimatic-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-nutrimatic-600 font-medium">{initials}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {cliente.nome || 'Sem nome'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cliente.numero} • {formatTimeAgo(cliente.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Novo</span>
                        <button className="p-2 text-gray-400 hover:text-nutrimatic-600 rounded-lg hover:bg-white transition-all duration-300">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {clientesHoje.length > 5 && (
                  <div className="text-center pt-6 border-t border-gray-200/50">
                    <a
                      href="/dashboard/clientes"
                      className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium transition-colors duration-300"
                    >
                      Ver todos os {clientesHoje.length} clientes novos de hoje →
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