import { Bot, Calendar, RotateCcw, BarChart3, Target, Smartphone, Brain, CheckCircle, Users, Clock, TrendingUp } from 'lucide-react';

export default function DetailedFeaturesSection() {
  const features = [
    {
      id: 1,
      eyebrow: "🤖 AGENTE DE IA CONVERSACIONAL",
      title: "Mais Inteligente que 90% das Secretárias Humanas",
      description: "O NutriMatic não segue scripts robóticos. Ele entende contexto, responde perguntas sobre sua metodologia, horários, valores — e fecha o agendamento sem precisar de você. É como ter uma secretária que nunca dorme, nunca erra e sempre fala com empatia.",
      bullets: [
        "Responde perguntas frequentes (ex: \"Quanto custa?\", \"Atende plano X?\")",
        "Qualifica pacientes automaticamente (descobre objetivos e urgência)",
        "Fala naturalmente (nada de \"Opção 1, Opção 2\")"
      ],
      visual: "whatsapp-conversation",
      layout: "left"
    },
    {
      id: 2,
      eyebrow: "📅 AGENDAMENTO AUTOMÁTICO",
      title: "Paciente Escolhe, IA Agenda. Sem Você no Meio.",
      description: "Sua agenda sempre atualizada em tempo real. Paciente vê horários disponíveis, escolhe o melhor, e BOOM — está na agenda. O NutriMatic integra com Google Calendar e envia lembretes automáticos 24h antes. Zero conflitos, zero retrabalho.",
      bullets: [
        "Sincronização bidirecional com Google Calendar/Outlook",
        "Detecta e bloqueia horários já ocupados",
        "Envia confirmação automática por WhatsApp + e-mail"
      ],
      visual: "calendar-sync",
      layout: "right"
    },
    {
      id: 3,
      eyebrow: "🔄 GESTÃO DE CANCELAMENTOS E REMARCAÇÕES",
      title: "Paciente Cancelou? A IA Já Encontrou Outro.",
      description: "Cancelamentos acontecem. Mas com NutriMatic, eles não viram prejuízo. A IA avisa você, oferece remarcação ao paciente, e automaticamente dispara mensagens para a lista de espera. Seu horário vago vira receita em minutos.",
      bullets: [
        "Confirmação automática de cancelamento/remarcação",
        "Lista de espera inteligente (IA oferece horário vago para outros pacientes)",
        "Dashboard mostra taxa de ocupação em tempo real"
      ],
      visual: "cancellation-flow",
      layout: "left"
    },
    {
      id: 4,
      eyebrow: "📊 DASHBOARD DE CONTROLE TOTAL",
      title: "Você Gerencia. A IA Executa.",
      description: "Um painel limpo, visual e completo. Veja todos os agendamentos da semana, histórico de cada paciente, taxa de presença, receita projetada e até pacientes que precisam de follow-up. Cancele consultas com 1 clique — a IA avisa o paciente automaticamente.",
      bullets: [
        "Visão semanal/mensal de agenda com filtros",
        "Perfil completo de cada paciente (histórico, notas, próxima consulta)",
        "Métricas de performance (taxa de presença, receita mensal, tempo economizado)"
      ],
      visual: "dashboard-overview",
      layout: "right"
    },
    {
      id: 5,
      eyebrow: "🎯 FOLLOW-UP PROATIVO",
      title: "Pacientes Nunca Mais Esquecem de Você.",
      description: "A IA monitora automaticamente quem não agenda retorno há 30/60/90 dias e envia mensagens personalizadas de reengajamento. \"Oi Ana! Faz tempo que não nos vemos. Que tal agendar um check-in?\" — resultado: até 40% mais consultas recorrentes.",
      bullets: [
        "Campanhas de reativação automáticas e personalizadas",
        "Lembretes de consultas de manutenção (ex: \"Sua avaliação trimestral chegou!\")",
        "Mensagens de aniversário e datas especiais (opcional)"
      ],
      visual: "follow-up-message",
      layout: "left"
    }
  ];

  const renderVisual = (visual: string, feature: any) => {
    switch (visual) {
      case 'whatsapp-conversation':
        return (
          <div className="bg-gray-100 rounded-2xl p-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">P</div>
                <div>
                  <div className="font-semibold">Paciente</div>
                  <div className="text-xs text-gray-500">online</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Vocês atendem perto do shopping?</p>
                </div>
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs ml-auto">
                  <p className="text-sm">Sim! O consultório fica a 5 min do Shopping Center. Quer agendar uma avaliação?</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'calendar-sync':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold mb-3 text-sm">WhatsApp</h4>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs">Paciente escolhe: "Terça 10h"</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold mb-3 text-sm">Dashboard</h4>
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-xs">Horário preenchido instantaneamente</p>
              </div>
            </div>
          </div>
        );
      
      case 'cancellation-flow':
        return (
          <div className="space-y-3">
            <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded">
              <p className="text-sm font-medium">1. Paciente cancela no WhatsApp</p>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
              <p className="text-sm font-medium">2. IA marca horário como "disponível"</p>
            </div>
            <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded">
              <p className="text-sm font-medium">3. IA oferece para lista de espera</p>
            </div>
          </div>
        );
      
      case 'dashboard-overview':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4">
              <h4 className="font-bold">Dashboard NutriMatic</h4>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold">28</div>
                  <div>Consultas</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold">94%</div>
                  <div>Presença</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold">R$8.4k</div>
                  <div>Receita</div>
                </div>
              </div>
              <div className="h-20 bg-gradient-to-r from-blue-100 to-green-100 rounded flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        );
      
      case 'follow-up-message':
        return (
          <div className="bg-gray-100 rounded-2xl p-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">IA</div>
                <div>
                  <div className="font-semibold">NutriMatic</div>
                  <div className="text-xs text-gray-500">Agente IA</div>
                </div>
              </div>
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <p className="text-sm">Olá Mariana! 😊 Passou um tempinho desde sua última consulta. Vamos agendar um check-in para ver sua evolução?</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
            <p className="text-gray-500">Espaço reservado para visual</p>
          </div>
        );
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline Geral */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Tudo que Você Precisa para Escalar Seu Consultório.{' '}
            <span className="text-gray-500">Nada que Você Não Precisa.</span>
          </h2>
        </div>

        {/* Features */}
        <div className="space-y-20">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} py-16 rounded-3xl`}
            >
              <div className="max-w-6xl mx-auto px-8">
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                  feature.layout === 'right' ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  {/* Conteúdo */}
                  <div className={`space-y-6 ${feature.layout === 'right' ? 'lg:col-start-2' : ''}`}>
                    {/* Eyebrow */}
                    <div className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                      {feature.eyebrow}
                    </div>

                    {/* Título */}
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Descrição */}
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Bullets */}
                    <ul className="space-y-3">
                      {feature.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={`${feature.layout === 'right' ? 'lg:col-start-1' : ''}`}>
                    {renderVisual(feature.visual, feature)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}