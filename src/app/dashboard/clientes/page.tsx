'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton, DashboardInput, DashboardSelect } from '@/components/dashboard/DashboardPageLayout';
import { useClientes } from '@/hooks/useClientes';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import { useState } from 'react';
import { Search, RefreshCw, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function ClientesPage() {
  const { clientes, loading, error, refetch, formatTimeAgo } = useClientes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Filtrar clientes baseado no termo de busca e status
  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || cliente.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Ativo</span>;
      case 'prospecto': return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Prospecto</span>;
      case 'inativo': return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inativo</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Desconhecido</span>;
    }
  };

  return (
    <DashboardLayout>
      <DashboardPageLayout
        title="Clientes"
        subtitle="Gerencie todos os seus clientes e prospectos"
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
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Clientes"
            value={clientes.length}
            icon={<Users className="w-6 h-6" />}
            color="nutrimatic"
          />
          
          <StatsCard
            title="Ativos"
            value={clientes.filter(c => c.status === 'ativo').length}
            icon={<CheckCircle className="w-6 h-6" />}
            color="blue"
          />
          
          <StatsCard
            title="Prospectos"
            value={clientes.filter(c => c.status === 'prospecto').length}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          
          <StatsCard
            title="Inativos"
            value={clientes.filter(c => c.status === 'inativo').length}
            icon={<XCircle className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Lista de Clientes */}
        <ContentCard
          title="Lista de Clientes"
          subtitle="Visualize e gerencie todos os clientes"
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
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DashboardSelect 
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
            >
              <option>Todos</option>
              <option>Ativos</option>
              <option>Prospectos</option>
              <option>Inativos</option>
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
                <p className="text-red-600 mb-4">Erro ao carregar clientes: {error}</p>
                <DashboardButton
                  onClick={refetch}
                  variant="primary"
                >
                  Tentar novamente
                </DashboardButton>
              </div>
            ) : filteredClientes.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  {searchTerm ? 'Nenhum cliente encontrado para sua busca' : 'Nenhum cliente encontrado'}
                </p>
                <p className="text-sm text-gray-500">
                  {searchTerm ? 'Tente ajustar os termos de busca' : 'Os clientes aparecerão aqui quando forem adicionados'}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Atividade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200/50">
                  {filteredClientes.map((cliente) => {
                    const initials = cliente.nome.split(' ').map(n => n[0]).join('').toUpperCase();
                    
                    return (
                      <tr key={cliente.id} className="hover:bg-gray-50/50 transition-all duration-300">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-nutrimatic-100 rounded-xl flex items-center justify-center">
                              <span className="text-nutrimatic-600 font-medium">{initials}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                              <div className="text-sm text-gray-500">Cliente</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(cliente.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimeAgo(cliente.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-nutrimatic-600 hover:text-nutrimatic-900 mr-3 transition-colors duration-300">Ver</button>
                          <button className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Editar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Estatísticas */}
            {filteredClientes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <p className="text-sm text-gray-600">
                  Mostrando {filteredClientes.length} de {clientes.length} clientes
                </p>
              </div>
            )}
          </div>
        </ContentCard>
      </DashboardPageLayout>
    </DashboardLayout>
  );
} 