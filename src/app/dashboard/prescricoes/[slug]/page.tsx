'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePrescricoes } from '@/hooks/usePrescricoes';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { CheckCircle, XCircle, Clock, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createSlug, getNomeCliente } from '@/lib/utils';
import { triggerApprovalWebhook, triggerRejectionWebhook } from '@/lib/webhooks';

// Função para encontrar prescrição pelo slug
function findPrescricaoBySlug(prescricoes: any[], slug: string) {
  // Primeiro, tentar encontrar pelo slug do nome do cliente
  let prescricao = prescricoes.find(p => {
    const nomeCliente = getNomeCliente(p);
    if (nomeCliente === 'Nome não informado') return false;
    const prescricaoSlug = createSlug(nomeCliente);
    return prescricaoSlug === slug;
  });
  
  // Se não encontrou, tentar encontrar por slug baseado no ID
  if (!prescricao) {
    prescricao = prescricoes.find(p => {
      const idSlug = createSlug(`prescricao-${p.id}`);
      return idSlug === slug;
    });
  }
  
  // Se ainda não encontrou, tentar buscar diretamente pelo ID (caso o slug seja o próprio ID)
  if (!prescricao) {
    prescricao = prescricoes.find(p => p.id === slug);
  }
  
  if (!prescricao) {
    console.warn('Prescrição não encontrada para o slug:', slug);
  }
  
  return prescricao;
}

export default function PrescricaoDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  
  const {
    prescricoes,
    loading,
    error,
    refetch,
    approvePrescricao,
    rejectPrescricao,
  } = usePrescricoes();

  const [selectedPrescricao, setSelectedPrescricao] = useState<any>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const [webhookSending, setWebhookSending] = useState(false);

  // Encontra a prescrição baseada no slug
  useEffect(() => {
    if (prescricoes.length > 0 && slug) {
      const prescricao = findPrescricaoBySlug(prescricoes, slug);
      if (prescricao) {
        setSelectedPrescricao(prescricao);
      } else {
        // Aguardar um pouco antes de redirecionar, caso os dados ainda estejam carregando
        setTimeout(() => {
          router.push('/dashboard/prescricoes');
        }, 2000);
      }
    }
  }, [prescricoes, slug, router]);

  const handleApprove = async (prescricaoId: string) => {
    setProcessing(prescricaoId);
    try {
      // Primeiro dispara o webhook
      console.log('🔔 Disparando webhook de aprovação...');
      setWebhookSending(true);
      await triggerApprovalWebhook(selectedPrescricao);
      setWebhookSending(false);
      
      // Depois atualiza o status no banco
      console.log('💾 Atualizando status no banco...');
      await approvePrescricao(prescricaoId);
      
      console.log('✅ Prescrição aprovada com sucesso!');
      // Volta para a lista após aprovar
      router.push('/dashboard/prescricoes');
    } catch (error) {
      console.error('❌ Erro ao aprovar prescrição:', error);
      setWebhookSending(false);
      alert('Erro ao aprovar prescrição. Tente novamente.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (prescricaoId: string) => {
    if (!observacoes.trim()) {
      alert('Por favor, adicione observações para rejeitar a prescrição.');
      return;
    }

    setProcessing(prescricaoId);
    try {
      // Primeiro dispara o webhook com as observações
      console.log('🔔 Disparando webhook de reprovação...');
      setWebhookSending(true);
      await triggerRejectionWebhook(selectedPrescricao, observacoes);
      setWebhookSending(false);
      
      // Depois atualiza o status no banco
      console.log('💾 Atualizando status no banco...');
      await rejectPrescricao(prescricaoId, observacoes);
      
      console.log('✅ Prescrição reprovada com sucesso!');
      setShowRejectForm(false);
      setObservacoes('');
      // Volta para a lista após rejeitar
      router.push('/dashboard/prescricoes');
    } catch (error) {
      console.error('❌ Erro ao reprovar prescrição:', error);
      setWebhookSending(false);
      alert('Erro ao reprovar prescrição. Tente novamente.');
    } finally {
      setProcessing(null);
    }
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setObservacoes('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendente':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'Aprovada':
      case 'Aprovado':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'Refazendo':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
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

  const handleGoBack = () => {
    router.push('/dashboard/prescricoes');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPageLayout
            title="Carregando..."
            subtitle="Aguarde enquanto carregamos a prescrição"
          >
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mr-3" />
              <span className="text-gray-600">Carregando prescrição...</span>
            </div>
          </DashboardPageLayout>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPageLayout
            title="Erro"
            subtitle="Não foi possível carregar a prescrição"
          >
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Erro: {error}</p>
              <DashboardButton onClick={refetch} variant="primary">
                Tentar novamente
              </DashboardButton>
            </div>
          </DashboardPageLayout>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedPrescricao) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPageLayout
            title="Prescrição não encontrada"
            subtitle="A prescrição solicitada não foi encontrada"
          >
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">Prescrição não encontrada</p>
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
          title={getNomeCliente(selectedPrescricao)}
          subtitle={`Prescrição criada em ${formatDate(selectedPrescricao.data)}`}
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
            {/* Header com Status */}
            <ContentCard>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(selectedPrescricao.status)}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {getNomeCliente(selectedPrescricao)}
                    </h2>
                    <p className="text-gray-600">
                      {formatDate(selectedPrescricao.data)}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getStatusBadgeColor(selectedPrescricao.status)}`}>
                  {selectedPrescricao.status}
                </span>
              </div>
            </ContentCard>

            {/* Visualização do PDF */}
            <ContentCard title="Prescrição" subtitle="Visualize e gerencie a prescrição">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <iframe
                    src={selectedPrescricao.url}
                    className="w-full h-[80vh] border-2 border-gray-200 rounded-lg shadow-lg bg-white"
                    title="Prescrição PDF"
                    loading="lazy"
                  />
                </div>
                
                <div className="text-center">
                  <a
                    href={selectedPrescricao.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Abrir em nova aba
                  </a>
                </div>
              </div>
            </ContentCard>

            {/* Ações para prescrições pendentes */}
            {selectedPrescricao.status === 'Pendente' && (
              <ContentCard title="Ações" subtitle="Aprove ou solicite alterações na prescrição">
                {!showRejectForm ? (
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                      onClick={() => handleApprove(selectedPrescricao.id)}
                      disabled={processing === selectedPrescricao.id || webhookSending}
                      className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-green-600 text-white text-lg font-medium rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      {processing === selectedPrescricao.id || webhookSending ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin mr-3" />
                          {webhookSending ? 'Enviando...' : 'Aprovando...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6 mr-3" />
                          Aprovar Prescrição
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectForm(true);
                        // Scroll suave para o formulário
                        setTimeout(() => {
                          const formElement = document.querySelector('#reject-form');
                          if (formElement) {
                            formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }, 100);
                      }}
                      disabled={processing === selectedPrescricao.id || webhookSending}
                      className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-red-600 text-white text-lg font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <XCircle className="w-6 h-6 mr-3" />
                      Solicitar Refazer
                    </button>
                  </div>
                ) : (
                  <div id="reject-form" className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                        <XCircle className="w-5 h-5 mr-2" />
                        Solicitar Refazer Prescrição
                      </h4>
                      <p className="text-red-700 mb-4">
                        Adicione observações sobre por que esta prescrição precisa ser refeita:
                      </p>
                      <textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                        rows={4}
                        placeholder="Descreva as observações detalhadamente..."
                      />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                      <button
                        onClick={handleCancelReject}
                        className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium transform hover:scale-105 active:scale-95"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleReject(selectedPrescricao.id)}
                        disabled={!observacoes.trim() || processing === selectedPrescricao.id || webhookSending}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none"
                      >
                        {processing === selectedPrescricao.id || webhookSending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            {webhookSending ? 'Enviando...' : 'Processando...'}
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 mr-2" />
                            Solicitar Refazer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </ContentCard>
            )}
          </div>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}