'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { StatsCard, ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { useAgenda } from '@/hooks/useAgenda';
import { useSecretaria } from '@/hooks/useSecretaria';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, FileText, Settings, Save, Bot, ArrowLeft, Clock, MessageCircle } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function SecretariaAgentPage() {
  const [creativity, setCreativity] = useState(0.7);
  const [businessName, setBusinessName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [emojis, setEmojis] = useState(true);
  const [consultationTime, setConsultationTime] = useState('30');
  const [returnTime, setReturnTime] = useState('15');
  
  // Estado para horários de funcionamento
  const [scheduleWindow, setScheduleWindow] = useState({
    segunda: { open: true, morning: '08:00-12:00', afternoon: '14:00-18:00' },
    terca: { open: true, morning: '08:00-12:00', afternoon: '14:00-18:00' },
    quarta: { open: true, morning: '08:00-12:00', afternoon: '14:00-18:00' },
    quinta: { open: true, morning: '08:00-12:00', afternoon: '14:00-18:00' },
    sexta: { open: true, morning: '08:00-12:00', afternoon: '14:00-18:00' },
    sabado: { open: false, morning: '08:00-12:00', afternoon: '14:00-18:00' },
    domingo: { open: false, morning: '08:00-12:00', afternoon: '14:00-18:00' }
  });

  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user, nutricionista } = useAuth();
  const { config, hasStoredConfig, loading: configLoading, error: configError, refetch } = useSecretaria();
  
  console.log('[SecretariaPage] Estado atual:', {
    user: user?.id,
    config,
    hasStoredConfig,
    configLoading,
    configError
  });
  
  // Dados para os últimos 6 meses
  const sixMonthsAgo = subMonths(new Date(), 6);
  const today = new Date();
  const currentMonthStart = startOfMonth(today);
  const currentMonthEnd = endOfMonth(today);
  
  // Hooks para buscar dados
  const { events: agendamentos } = useAgenda(sixMonthsAgo, today);
  
  // Calcular estatísticas
  const agendamentosTotal = agendamentos.length;
  const agendamentosMes = agendamentos.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= currentMonthStart && eventDate <= currentMonthEnd;
  }).length;
  

  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Processar janela de horários para webhook
      const processedScheduleWindow = Object.entries(scheduleWindow).reduce((acc, [day, schedule]) => {
        acc[day] = {
          open: schedule.open,
          morning: schedule.open ? schedule.morning : 'fechado',
          afternoon: schedule.open ? schedule.afternoon : 'fechado'
        };
        return acc;
      }, {} as typeof scheduleWindow);
      
      const configData = {
        creativity,
        businessName,
        agentName,
        emojis,
        consultationTime: parseInt(consultationTime),
        returnTime: parseInt(returnTime),
        scheduleWindow: processedScheduleWindow
      };
      
      // Não salvar no localStorage - apenas enviar webhooks (N8N faz as alterações na tabela)
      
      // Preparar dados para os webhooks
      const webhookData = {
        usuario: nutricionista,
        configuracoes: configData,
        janelaHorarios: processedScheduleWindow
      };
      
      // Disparar webhooks
      const webhookUrls = [
        'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/configsecretaria',
        'https://n8n-n8n.0dt1f5.easypanel.host/webhook/configsecretaria'
      ];
      
      const webhookPromises = webhookUrls.map(url => 
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        }).catch(error => {
          console.error(`Erro ao enviar webhook para ${url}:`, error);
          return null;
        })
      );
      
      await Promise.all(webhookPromises);
      
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Carregar configurações da tabela Supabase
  useEffect(() => {
    console.log('🔄 SecretariaPage - useEffect executado:', { config, configLoading, hasStoredConfig });
    
    if (config && !configLoading) {
      console.log('[SecretariaPage] Carregando dados da configuracao:', config);
      setCreativity(config.creativity || 0.7);
      setBusinessName(config.business_name || '');
      setAgentName(config.agent_name || '');
      setEmojis(config.emojis !== undefined ? config.emojis : true);
      setConsultationTime(config.consultation_time?.toString() || '30');
      setReturnTime(config.return_time?.toString() || '15');
    } else {
      console.log('⏳ SecretariaPage - Aguardando configuração ou ainda carregando');
    }
  }, [config, configLoading, hasStoredConfig]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout 
          title="Agente Secretaria" 
          subtitle="Visualização de dados e configurações do agente"
          actions={
            <DashboardButton
              onClick={() => router.back()}
              variant="secondary"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </DashboardButton>
          }
        >
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Agendamentos Total" 
              value={agendamentosTotal}
              icon={<Calendar className="w-6 h-6" />}
              color="nutrimatic"
            />
            <StatsCard 
              title="Agendamentos no Mês" 
              value={agendamentosMes}
              icon={<Calendar className="w-6 h-6" />}
              color="green"
            />

          </div>
          
          <div className="text-sm text-gray-500 text-center">
            * Dados referentes ao período máximo de 6 meses
          </div>
          
          {/* Configurações */}
          <ContentCard 
            title="Configurações"
            subtitle="Personalize o comportamento do agente secretaria"
          >
            <div className="space-y-8">
              {/* Campo Nome Empresarial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Empresarial
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ex: Dra. Fulana ou Dr. Ciclano"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Qual nome você quer que a secretária referencie</p>
              </div>
              
              {/* Campo Nome do Agente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Agente
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Digite o nome do agente"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors"
                />
              </div>
              
              {/* Campo Emojis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usar Emojis
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="emojis"
                      checked={emojis === true}
                      onChange={() => setEmojis(true)}
                      className="mr-2 text-nutrimatic-600 focus:ring-nutrimatic-500"
                    />
                    <span className="text-sm text-gray-700">Sim</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="emojis"
                      checked={emojis === false}
                      onChange={() => setEmojis(false)}
                      className="mr-2 text-nutrimatic-600 focus:ring-nutrimatic-500"
                    />
                    <span className="text-sm text-gray-700">Não</span>
                  </label>
                </div>
              </div>
              
              {/* Configurações de Tempo */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-nutrimatic-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Configurações de Horários</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo da Consulta
                    </label>
                    <select
                      value={consultationTime}
                      onChange={(e) => setConsultationTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors"
                    >
                      <option value="15">15 minutos</option>
                      <option value="20">20 minutos</option>
                      <option value="25">25 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="35">35 minutos</option>
                      <option value="40">40 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="50">50 minutos</option>
                      <option value="55">55 minutos</option>
                      <option value="60">60 minutos (1 hora)</option>
                      <option value="65">65 minutos</option>
                      <option value="70">70 minutos</option>
                      <option value="75">75 minutos</option>
                      <option value="80">80 minutos</option>
                      <option value="85">85 minutos</option>
                      <option value="90">90 minutos (1h30)</option>
                      <option value="95">95 minutos</option>
                      <option value="100">100 minutos</option>
                      <option value="105">105 minutos</option>
                      <option value="110">110 minutos</option>
                      <option value="115">115 minutos</option>
                      <option value="120">120 minutos (2 horas)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo do Retorno
                    </label>
                    <select
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors"
                    >
                      <option value="15">15 minutos</option>
                      <option value="20">20 minutos</option>
                      <option value="25">25 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="35">35 minutos</option>
                      <option value="40">40 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="50">50 minutos</option>
                      <option value="55">55 minutos</option>
                      <option value="60">60 minutos (1 hora)</option>
                      <option value="65">65 minutos</option>
                      <option value="70">70 minutos</option>
                      <option value="75">75 minutos</option>
                      <option value="80">80 minutos</option>
                      <option value="85">85 minutos</option>
                      <option value="90">90 minutos (1h30)</option>
                      <option value="95">95 minutos</option>
                      <option value="100">100 minutos</option>
                      <option value="105">105 minutos</option>
                      <option value="110">110 minutos</option>
                      <option value="115">115 minutos</option>
                      <option value="120">120 minutos (2 horas)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Janela de Horários */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-nutrimatic-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Janela de Horários</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(scheduleWindow).map(([day, schedule]) => {
                    const dayNames = {
                      segunda: 'Segunda-feira',
                      terca: 'Terça-feira', 
                      quarta: 'Quarta-feira',
                      quinta: 'Quinta-feira',
                      sexta: 'Sexta-feira',
                      sabado: 'Sábado',
                      domingo: 'Domingo'
                    };
                    
                    return (
                      <div key={day} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{dayNames[day as keyof typeof dayNames]}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {schedule.open ? 'Aberto' : 'Fechado'}
                            </span>
                            <button
                              onClick={() => {
                                setScheduleWindow(prev => ({
                                  ...prev,
                                  [day]: { ...prev[day as keyof typeof prev], open: !schedule.open }
                                }));
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:ring-offset-2 ${
                                schedule.open ? 'bg-nutrimatic-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  schedule.open ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        
                        {schedule.open && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Manhã
                              </label>
                              <input
                                type="text"
                                value={schedule.morning}
                                onChange={(e) => {
                                  setScheduleWindow(prev => ({
                                    ...prev,
                                    [day]: { ...prev[day as keyof typeof prev], morning: e.target.value }
                                  }));
                                }}
                                placeholder="08:00-12:00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tarde
                              </label>
                              <input
                                type="text"
                                value={schedule.afternoon}
                                onChange={(e) => {
                                  setScheduleWindow(prev => ({
                                    ...prev,
                                    [day]: { ...prev[day as keyof typeof prev], afternoon: e.target.value }
                                  }));
                                }}
                                placeholder="14:00-18:00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors text-sm"
                              />
                            </div>
                          </div>
                        )}
                        
                        {!schedule.open && (
                          <div className="text-sm text-gray-500 italic">
                            Dia fechado para atendimento
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> Configure os horários de funcionamento para que a secretária IA 
                    saiba quando pode agendar consultas. Use o formato HH:MM-HH:MM (ex: 08:00-12:00).
                  </p>
                </div>
              </div>
              
              {/* Configurações de Criatividade */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Bot className="w-5 h-5 text-nutrimatic-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Configurações do Agente</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Criatividade: {creativity.toFixed(1)}
                  </label>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={creativity}
                      onChange={(e) => setCreativity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.0</span>
                      <span>0.5</span>
                      <span>1.0</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Explicação:</strong> Quanto maior a criatividade, maior será o consumo de tokens, 
                      porém melhor interpretará o seu cliente, aumentando o potencial de atendimento e vendas. 
                      <strong>Recomendado: 0,7</strong>
                    </p>
                  </div>
                </div>
              </div>
              

            </div>
           </ContentCard>
           
           {/* Botão Salvar no final da página */}
           <div className="flex justify-center pt-6">
             <DashboardButton
               onClick={handleSave}
               disabled={isSaving}
               variant="primary"
               size="lg"
               className="px-8"
             >
               <Save className={`w-5 h-5 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
               {isSaving ? 'Salvando...' : 'Salvar Configurações'}
             </DashboardButton>
           </div>
         </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


