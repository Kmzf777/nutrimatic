'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton, DashboardInput, DashboardSelect } from '@/components/dashboard/DashboardPageLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useClientes } from '@/hooks/useClientes';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, RefreshCw, Users, CheckCircle, Clock, XCircle, ClipboardList, UserPlus } from 'lucide-react';

export default function ClientesPage() {
  const { clientes, loading, error, refetch, formatTimeAgo, formatNumero, waLink, counts } = useClientes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'novo' | 'aguardando_pagamento' | 'anamnese' | 'ativo' | 'inativo'>('Todos');
  const router = useRouter();
  // Agente removido da UI
  

  const filteredClientes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return clientes.filter((c) => {
      const nome = (c.nome || '').toLowerCase();
      const numero = (c.numero || '').toLowerCase();
      const matchesSearch = !term || nome.includes(term) || numero.includes(term);
      const matchesStatus = filterStatus === 'Todos' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [clientes, searchTerm, filterStatus]);

  const getStatusBadge = (status: string) => {
    const base = 'px-2 py-1 text-xs rounded-full';
    if (status === 'novo') return <span className={`${base} bg-blue-100 text-blue-800`}>Novo</span>;
    if (status === 'aguardando_pagamento') return <span className={`${base} bg-yellow-100 text-yellow-800`}>Aguardando pagamento</span>;
    if (status === 'anamnese') return <span className={`${base} bg-indigo-100 text-indigo-800`}>Anamnese</span>;
    if (status === 'ativo') return <span className={`${base} bg-green-100 text-green-800`}>Ativo</span>;
    if (status === 'inativo') return <span className={`${base} bg-gray-200 text-gray-700`}>Inativo</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title="Clientes"
          subtitle="Leads e clientes por status e agente"
          actions={
            <div className="flex items-center space-x-3">
              <DashboardButton onClick={refetch} disabled={loading} variant="secondary" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </DashboardButton>
              <DashboardButton 
                onClick={() => router.push('/dashboard/criar-cliente')} 
                variant="primary" 
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Cliente
              </DashboardButton>
            </div>
          }
        >
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <StatsCard title="Total" value={counts.total} icon={<Users className="w-6 h-6" />} color="nutrimatic" />
            <StatsCard title="Novos" value={counts.novos} icon={<ClipboardList className="w-6 h-6" />} color="purple" />
            <StatsCard title="Aguard. Pgto." value={counts.aguardando_pagamento} icon={<Clock className="w-6 h-6" />} color="yellow" />
            <StatsCard title="Anamnese" value={counts.anamnese} icon={<ClipboardList className="w-6 h-6" />} color="purple" />
            <StatsCard title="Ativos" value={counts.ativos} icon={<CheckCircle className="w-6 h-6" />} color="green" />
            <StatsCard title="Inativos" value={counts.inativos} icon={<XCircle className="w-6 h-6" />} color="red" />
          </div>

          <ContentCard
            title="Lista de Clientes"
            subtitle="Status operacional"
            actions={<div className="flex items-center space-x-3"><ConnectionStatus /></div>}
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <DashboardInput
                  type="text"
                  placeholder="Buscar por nome ou número..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DashboardSelect value={filterStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as any)}>
                <option value="Todos">Todos</option>
                <option value="novo">Novo</option>
                <option value="aguardando_pagamento">Aguardando pagamento</option>
                <option value="anamnese">Anamnese</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </DashboardSelect>
              
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-nutrimatic-600" />
                  <span className="ml-3 text-gray-600">Carregando clientes...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-2">Erro ao carregar clientes: {error}</p>
                  <p className="text-xs text-gray-500 mb-4">Veja o console do navegador para detalhes técnicos do erro.</p>
                  <DashboardButton onClick={refetch} variant="primary">Tentar novamente</DashboardButton>
                </div>
              ) : filteredClientes.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Nenhum cliente encontrado</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última atividade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/50">
                    {filteredClientes.map((c) => {
                      const initials = (c.nome || (c.numero || '')).split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                      return (
                        <tr key={c.id} className="hover:bg-gray-50/50 transition-all duration-300">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-nutrimatic-100 rounded-xl flex items-center justify-center">
                                <span className="text-nutrimatic-600 font-medium">{initials}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{c.nome || 'Sem nome'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-nutrimatic-700">
                            {waLink(c.numero) ? (
                              <a href={waLink(c.numero)} target="_blank" rel="noreferrer" className="hover:underline">
                                {formatNumero(c.numero)}
                              </a>
                            ) : (
                              formatNumero(c.numero)
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(c.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTimeAgo(c.last_msg || c.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {filteredClientes.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <p className="text-sm text-gray-600">Mostrando {filteredClientes.length} de {clientes.length} clientes</p>
                </div>
              )}
            </div>
          </ContentCard>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}