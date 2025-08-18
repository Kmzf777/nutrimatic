'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton, DashboardInput, DashboardSelect } from '@/components/dashboard/DashboardPageLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useWebhooks } from '@/hooks/useWebhooks';
import { UserPlus, Save, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ClienteFormData {
  nome: string;
  numero: string;
  status: 'novo' | 'ativo';
}

export default function CriarClientePage() {
  const { nutricionista } = useAuth();
  const { sendWebhookWithResponse } = useWebhooks();
  const router = useRouter();
  const [formData, setFormData] = useState<ClienteFormData>({
    nome: '',
    numero: '',
    status: 'novo'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const validateNumero = (numero: string): boolean => {
    // Remove todos os caracteres não numéricos
    const cleanNumero = numero.replace(/\D/g, '');
    // Verifica se começa com 55 e tem pelo menos 10 dígitos (55 + DDD + número)
    return cleanNumero.startsWith('55') && cleanNumero.length >= 12;
  };

  const formatNumero = (numero: string): string => {
    const cleanNumero = numero.replace(/\D/g, '');
    if (cleanNumero.startsWith('55') && cleanNumero.length >= 12) {
      const pais = cleanNumero.slice(0, 2);
      const ddd = cleanNumero.slice(2, 4);
      const parte1 = cleanNumero.slice(4, 9);
      const parte2 = cleanNumero.slice(9);
      return `+${pais} (${ddd}) ${parte1}-${parte2}`;
    }
    return numero;
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove todos os caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // Se não começar com 55, adiciona automaticamente
    let formattedValue = cleanValue;
    if (cleanValue && !cleanValue.startsWith('55')) {
      formattedValue = '55' + cleanValue;
    }
    
    setFormData(prev => ({
      ...prev,
      numero: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!validateNumero(formData.numero)) {
      setError('Número deve começar com 55 e ter pelo menos 12 dígitos');
      return;
    }

    // Verificar se o número já foi usado recentemente (evitar duplicatas)
    const numeroLimpo = formData.numero.replace(/\D/g, '');
    const numerosUsados = JSON.parse(localStorage.getItem('numerosUsados') || '[]');
    
    if (numerosUsados.includes(numeroLimpo)) {
      setError('Este número de telefone foi usado recentemente. Verifique se não é uma duplicata.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar dados para o webhook
      const webhookData = {
        nutricionista: {
          id: nutricionista?.id,
          nome: nutricionista?.nome,
          email: nutricionista?.email,
          telefone: nutricionista?.telefone
        },
        cliente: {
          nome: formData.nome.trim(),
          numero: formData.numero,
          status: formData.status,
          numero_formatado: formatNumero(formData.numero)
        },
        timestamp: new Date().toISOString(),
        action: 'criar_cliente' as const
      };

      // URL do webhook principal (usar apenas o webhook de produção)
      const webhookUrl = 'https://n8n-n8n.0dt1f5.easypanel.host/webhook/criar-cliente';

      // Enviar webhook e aguardar resposta
      const response = await sendWebhookWithResponse(webhookUrl, webhookData);
      
      // Verificar a resposta
      console.log('Resposta completa do webhook:', response);
      console.log('Tipo da resposta:', typeof response);
      console.log('Estrutura da resposta:', Array.isArray(response) ? 'Array' : 'Nao e array');
      
      // Tratar diferentes formatos de resposta
      let result = null;
      
      if (response && Array.isArray(response) && response.length > 0) {
        result = response[0];
      } else if (response && typeof response === 'object' && response.status) {
        result = response;
      }
      
      if (result && result.status !== undefined) {
        console.log('Resultado encontrado:', result);
        console.log('Status recebido:', result.status, '(tipo:', typeof result.status, ')');
        console.log('Mensagem do servidor:', result.message || result.error || result.details);
        
        // Converter status para string e comparar
        const status = String(result.status).toLowerCase();
        
        if (status === 'true') {
          console.log('Cliente criado com sucesso!');
          setSuccess(true);
          setError(null);
          
          // Salvar número no localStorage para evitar duplicatas
          const numeroLimpo = formData.numero.replace(/\D/g, '');
          const numerosUsados = JSON.parse(localStorage.getItem('numerosUsados') || '[]');
          if (!numerosUsados.includes(numeroLimpo)) {
            numerosUsados.push(numeroLimpo);
            localStorage.setItem('numerosUsados', JSON.stringify(numerosUsados));
          }
          
          // Redirecionar para a página de clientes após 2 segundos
          setTimeout(() => {
            router.push('/dashboard/clientes');
          }, 2000);
        } else if (status === 'false') {
          console.log('Cliente ja existe ou erro de validacao');
          
          // Verificar se há uma mensagem específica do servidor
          const serverMessage = result.message || result.error || result.details;
          if (serverMessage) {
            setError(`Erro do servidor: ${serverMessage}`);
          } else {
            // Mensagem mais específica para cliente já existente
            setError('Este número de telefone já está cadastrado no sistema. Verifique se o cliente já existe ou use um número diferente.');
          }
          setSuccess(false);
          
          // Log adicional para debug
          console.warn('Webhook retornou status false:', result);
          console.warn('Numero tentado:', formData.numero);
          console.warn('Nome tentado:', formData.nome);
        } else {
          console.error('Status inesperado:', result.status);
          setError(`Resposta inesperada do servidor: ${result.status}`);
          setSuccess(false);
        }
      } else {
        console.error('Resposta invalida ou sem status');
        setError('Resposta invalida do servidor. Tente novamente.');
        setSuccess(false);
        
        // Log adicional para debug
        console.error('Resposta completa:', response);
        console.error('Tipo da resposta:', typeof response);
        console.error('Estrutura da resposta:', response);
      }

    } catch (err) {
      setError('Erro ao criar cliente. Tente novamente.');
      console.error('Erro ao criar cliente:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.nome.trim() && validateNumero(formData.numero);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title="Criar Cliente"
          subtitle="Adicione um novo cliente ao sistema"
          actions={
            <DashboardButton 
              onClick={() => router.push('/dashboard/clientes')} 
              variant="secondary" 
              size="sm"
            >
              Voltar
            </DashboardButton>
          }
        >
          <div className="max-w-2xl mx-auto">
            <ContentCard
              title="Informações do Cliente"
              subtitle="Preencha os dados do novo cliente"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Cliente *
                  </label>
                  <DashboardInput
                    id="nome"
                    type="text"
                    placeholder="Digite o nome completo"
                    value={formData.nome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>

                {/* Número */}
                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Telefone *
                  </label>
                  <DashboardInput
                    id="numero"
                    type="tel"
                    placeholder="55XXXXXXXXX (apenas números)"
                    value={formData.numero}
                    onChange={handleNumeroChange}
                    required
                    className="w-full"
                  />
                  {formData.numero && (
                    <p className="mt-1 text-sm text-gray-500">
                      Formatado: {formatNumero(formData.numero)}
                    </p>
                  )}
                  {formData.numero && !validateNumero(formData.numero) && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Número deve começar com 55 e ter pelo menos 12 dígitos
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <DashboardSelect
                    id="status"
                    value={formData.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, status: e.target.value as 'novo' | 'ativo' }))}
                    required
                    className="w-full"
                  >
                    <option value="novo">Novo</option>
                    <option value="ativo">Ativo</option>
                  </DashboardSelect>
                </div>

                {/* Explicação do Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Sobre os Status</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          <strong>Novo:</strong> Cliente sem follow up e suporte
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          <strong>Ativo:</strong> Cliente com follow up e suporte
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensagens de erro/sucesso */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-red-800">Número de Telefone já cadastrado</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800">Cliente criado com sucesso!</span>
                    </div>
                  </div>
                )}

                {/* Botão Salvar */}
                <div className="flex justify-end pt-4">
                  <DashboardButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={!isFormValid || loading}
                    className="min-w-[120px]"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Cliente
                      </>
                    )}
                  </DashboardButton>
                </div>
              </form>
            </ContentCard>
          </div>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
