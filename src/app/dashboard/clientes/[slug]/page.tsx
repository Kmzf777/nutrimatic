'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useClientes } from '@/hooks/useClientes';
import { usePrescricoes } from '@/hooks/usePrescricoes';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ArrowLeft, Loader2, User, Phone, Calendar, FileText, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createSlug } from '@/lib/utils';

// Função para encontrar cliente por slug
function findClienteBySlug(clientes: any[], slug: string) {
  // Primeiro tenta encontrar por slug do nome
  for (const cliente of clientes) {
    if (cliente.nome && createSlug(cliente.nome) === slug) {
      return cliente;
    }
  }
  
  // Depois tenta por slug do número
  for (const cliente of clientes) {
    if (cliente.numero && createSlug(cliente.numero) === slug) {
      return cliente;
    }
  }
  
  // Por último tenta por slug do ID
  for (const cliente of clientes) {
    if (createSlug(cliente.id) === slug) {
      return cliente;
    }
  }
  
  return null;
}

export default function ClienteDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const { clientes, loading: clientesLoading, error: clientesError, refetch: refetchClientes } = useClientes();
  const { prescricoes, loading: prescricoesLoading, error: prescricoesError, refetch: refetchPrescricoes } = usePrescricoes();
  
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [clientePrescricoes, setClientePrescricoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientesLoading && !prescricoesLoading && clientes.length > 0) {
      const cliente = findClienteBySlug(clientes, slug);
      
      if (cliente) {
        setSelectedCliente(cliente);
        
        // Filtrar prescrições do cliente
        const prescricoesDoCliente = prescricoes.filter(p => p.cliente_id === cliente.id);
        setClientePrescricoes(prescricoesDoCliente);
        
        setError(null);
      } else {
        setError('Cliente não encontrado');
      }
      
      setLoading(false);
    }
  }, [clientes, prescricoes, clientesLoading, prescricoesLoading, slug]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const base = 'px-3 py-1 text-sm rounded-full font-medium';
    if (status === 'novo') return <span className={`${base} bg-blue-100 text-blue-800`}>Novo</span>;
    if (status === 'aguardando_pagamento') return <span className={`${base} bg-yellow-100 text-yellow-800`}>Aguardando pagamento</span>;
    if (status === 'anamnese') return <span className={`${base} bg-indigo-100 text-indigo-800`}>Anamnese</span>;
    if (status === 'ativo') return <span className={`${base} bg-green-100 text-green-800`}>Ativo</span>;
    if (status === 'inativo') return <span className={`${base} bg-gray-200 text-gray-700`}>Inativo</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  };

  const getPrescricaoStatusBadge = (status: string) => {
    const base = 'px-2 py-1 text-xs rounded-full font-medium';
    switch (status) {
      case 'Pendente':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pendente</span>;
      case 'Aprovada':
      case 'Aprovado':
        return <span className={`${base} bg-green-100 text-green-800`}>Aprovada</span>;
      case 'Refazendo':
        return <span className={`${base} bg-red-100 text-red-800`}>Refazendo</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/clientes');
  };

  const handlePrescricaoClick = (prescricao: any) => {
    const prescricaoSlug = createSlug(prescricao.nome_cliente || prescricao.nome || prescricao.id);
    router.push(`/dashboard/prescricoes/${prescricaoSlug}`);
  };

  if (loading || clientesLoading || prescricoesLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPageLayout
            title="Carregando..."
            subtitle="Aguarde enquanto carregamos os dados do cliente"
          >
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mr-3" />
              <span className="text-gray-600">Carregando cliente...</span>
            </div>
          </DashboardPageLayout>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || clientesError || prescricoesError) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPageLayout
            title="Erro"
            subtitle="Não foi possível carregar os dados do cliente"
          >
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Erro: {error || clientesError || prescricoesError}</p>
              <DashboardButton onClick={() => { refetchClientes(); refetchPrescricoes(); }} variant="primary">
                Tentar novamente
              </DashboardButton>
            </div>
          </DashboardPageLayout>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedCliente) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPageLayout
            title="Cliente não encontrado"
            subtitle="O cliente solicitado não foi encontrado"
          >
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">Cliente não encontrado</p>
              <DashboardButton onClick={handleGoBack} variant="primary">
                Voltar para lista
              </DashboardButton>
            </div>
          </DashboardPageLayout>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title={selectedCliente.nome || 'Cliente sem nome'}
          subtitle={`Cliente desde ${formatDate(selectedCliente.created_at)}`}
          actions={
            <DashboardButton
              onClick={handleGoBack}
              variant="secondary"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </DashboardButton>
          }
        >
          <div className="space-y-6">
            {/* Informações do Cliente */}
            <ContentCard title="Informações do Cliente" subtitle="Dados pessoais e de contato">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Nome</h4>
                  </div>
                  <p className="text-gray-700">{selectedCliente.nome || 'Não informado'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Phone className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Telefone</h4>
                  </div>
                  <p className="text-gray-700">{selectedCliente.numero || 'Não informado'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Activity className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Status</h4>
                  </div>
                  <div>{getStatusBadge(selectedCliente.status)}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Cadastrado em</h4>
                  </div>
                  <p className="text-gray-700">{formatDate(selectedCliente.created_at)}</p>
                </div>
              </div>
            </ContentCard>

            {/* Prescrições do Cliente */}
            <ContentCard 
              title="Prescrições" 
              subtitle={`${clientePrescricoes.length} prescrição(ões) vinculada(s) a este cliente`}
            >
              {clientePrescricoes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Nenhuma prescrição encontrada para este cliente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientePrescricoes.map((prescricao) => (
                    <div 
                      key={prescricao.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handlePrescricaoClick(prescricao)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Prescrição de {formatDate(prescricao.data)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              ID: {prescricao.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPrescricaoStatusBadge(prescricao.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ContentCard>
          </div>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}