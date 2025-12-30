'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useClientes } from '@/hooks/useClientes';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useMemo } from 'react';
import { Users, Eye, RefreshCw, CheckCircle, Clock, User, Phone, Mail, UserPlus, ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter, Download, Calendar } from 'lucide-react';
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

  // Simulated chart data (mock based on real counts for visual structure)
  const chartData = [
    { label: 'Out', value: 30, height: '40%' },
    { label: 'Nov', value: 45, height: '60%' },
    { label: 'Dez', value: 25, height: '35%' },
    { label: 'Jan', value: 60, height: '80%' },
    { label: 'Fev', value: 40, height: '55%' },
    { label: 'Mar', value: 75, height: '90%' },
  ];

  const weeklyData = [
    { day: 'Dom', height: '20%' },
    { day: 'Seg', height: '40%' },
    { day: 'Ter', height: '100%', active: true },
    { day: 'Qua', height: '50%' },
    { day: 'Qui', height: '30%' },
    { day: 'Sex', height: '60%' },
    { day: 'Sab', height: '40%' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            
            <div className="flex items-center gap-2">
              <button className="hidden sm:flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Este Mês</span>
              </button>
              <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4 mr-2" />
                <span>Filtrar</span>
              </button>
              <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Clientes */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                  <div className="p-1.5 bg-gray-50 rounded-md">
                    <Users className="w-4 h-4" />
                  </div>
                  Total de Clientes
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500" />
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">{counts.total}</span>
                <span className="flex items-center text-xs font-bold text-nutrimatic-600 bg-nutrimatic-50 px-2 py-1 rounded-full mb-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  12.5%
                </span>
              </div>
            </div>

            {/* Clientes Novos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                   <div className="p-1.5 bg-gray-50 rounded-md">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  Novos Clientes
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500" />
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">{counts.novos}</span>
                 <span className="flex items-center text-xs font-bold text-nutrimatic-600 bg-nutrimatic-50 px-2 py-1 rounded-full mb-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  8.2%
                </span>
              </div>
            </div>

            {/* Clientes Ativos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                   <div className="p-1.5 bg-gray-50 rounded-md">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  Taxa de Atividade
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500" />
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {counts.total > 0 ? Math.round((counts.ativos / counts.total) * 100) : 0}%
                </span>
                 <span className="flex items-center text-xs font-bold text-nutrimatic-600 bg-nutrimatic-50 px-2 py-1 rounded-full mb-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  2.4%
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart - Evolução */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Evolução de Atendimentos</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-nutrimatic-600 bg-nutrimatic-50 text-xs font-bold px-2 py-0.5 rounded-full flex items-center w-fit">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +15.8%
                    </span>
                    <span className="text-sm text-gray-500">vs mês anterior</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* CSS Bar Chart Simulation */}
              <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                    <div className="relative w-full max-w-[60px] bg-gray-50 rounded-t-lg overflow-hidden h-full flex items-end hover:bg-gray-100 transition-colors">
                      <div 
                        style={{ height: item.height }} 
                        className="w-full bg-gradient-to-t from-nutrimatic-600 to-nutrimatic-400 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all duration-300 relative"
                      >
                         {/* Tooltip on hover */}
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {item.value} atendimentos
                         </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Chart - Agendamentos Semanais */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                 <div>
                  <h3 className="text-lg font-bold text-gray-900">Novos Clientes</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-nutrimatic-600 bg-nutrimatic-50 text-xs font-bold px-2 py-0.5 rounded-full flex items-center w-fit">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +3.2%
                    </span>
                  </div>
                </div>
                <select className="bg-gray-50 border-none text-xs font-medium text-gray-600 rounded-lg py-1 px-2 focus:ring-0 cursor-pointer hover:bg-gray-100">
                  <option>Semanal</option>
                  <option>Mensal</option>
                </select>
              </div>

              {/* Weekly Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-2">
                 {weeklyData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="relative w-full bg-transparent h-48 flex items-end justify-center">
                      <div 
                        style={{ height: item.height }} 
                        className={`w-full max-w-[24px] rounded-lg transition-all duration-300 ${item.active ? 'bg-nutrimatic-600 shadow-lg shadow-nutrimatic-200' : 'bg-gray-100 group-hover:bg-gray-200'}`}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${item.active ? 'text-gray-900' : 'text-gray-400'}`}>{item.day[0]}</span>
                  </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Distribution Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Status dos Clientes</h3>
                 <select className="bg-gray-50 border-none text-xs font-medium text-gray-600 rounded-lg py-1 px-2 focus:ring-0 cursor-pointer hover:bg-gray-100">
                  <option>Mensal</option>
                </select>
              </div>
              
              <div className="flex items-center justify-center relative py-4">
                {/* CSS Donut Chart */}
                <div 
                  className="w-48 h-48 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #16a34a 0% 65%, 
                      #e5e7eb 65% 85%, 
                      #fca5a5 85% 100%
                    )`
                  }}
                >
                  <div className="w-32 h-32 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
                     <span className="text-2xl font-bold text-gray-900">{counts.total}</span>
                     <span className="text-xs text-gray-500 font-medium">Total</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-nutrimatic-600"></div>
                  <span className="text-xs text-gray-500 font-medium">Ativos</span>
                </div>
                 <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span className="text-xs text-gray-500 font-medium">Novos</span>
                </div>
                 <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-300"></div>
                  <span className="text-xs text-gray-500 font-medium">Inativos</span>
                </div>
              </div>
            </div>

            {/* List / Table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Últimos Clientes</h3>
                <a href="/dashboard/clientes" className="text-sm font-semibold text-nutrimatic-600 hover:text-nutrimatic-700">Ver Todos</a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pl-2">Cliente</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Data</th>
                      <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-2">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                       <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">Carregando...</td>
                       </tr>
                    ) : clientes.slice(0, 5).map((cliente) => (
                      <tr key={cliente.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-nutrimatic-100 flex items-center justify-center text-nutrimatic-700 text-xs font-bold">
                              {(cliente.nome?.[0] || 'C').toUpperCase()}
                            </div>
                            <div className="font-medium text-sm text-gray-900">{cliente.nome || 'Cliente sem nome'}</div>
                          </div>
                        </td>
                        <td className="py-3">
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                            Ativo
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-500">{new Date(cliente.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          <button 
                            onClick={() => handleClienteClick(cliente)}
                            className="p-1.5 text-gray-400 hover:text-nutrimatic-600 rounded-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
