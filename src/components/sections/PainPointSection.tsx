'use client';

import { Clock, Calendar, TrendingDown, X } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimations';

export default function PainPointSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const painPoints = [
    {
      icon: <Clock className="w-12 h-12 text-red-500" />,
      iconOverlay: <X className="w-6 h-6 text-red-600 absolute -top-1 -right-1" />,
      title: "Pacientes desistem enquanto você atende",
      description: "42% dos contatos no WhatsApp não recebem resposta em até 2 horas — e você perde a consulta para o concorrente que respondeu em 5 minutos."
    },
    {
      icon: <Calendar className="w-12 h-12 text-orange-500" />,
      iconOverlay: <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs">!</span>
      </div>,
      title: "Gestão manual = retrabalho constante",
      description: "Confirmar horários, remarcar consultas, enviar lembretes… 3 horas do seu dia vão embora em tarefas administrativas que uma IA faria em segundos."
    },
    {
      icon: <TrendingDown className="w-12 h-12 text-red-500" />,
      iconOverlay: null,
      title: "Faltas não avisadas matam sua receita",
      description: "1 em cada 4 pacientes falta sem avisar. Sem follow-up ativo, você perde R$800-1.500/semana em horários vazios."
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Headline */}
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Ainda Perdendo Pacientes por Responder WhatsApp{' '}
          <span className="text-red-600">Depois das 22h?</span>
        </h2>

        {/* Sub-texto */}
        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
          Você não está sozinho. A maioria dos nutricionistas enfrenta os mesmos problemas:
        </p>

        {/* Grid de dores */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {painPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Ícone com overlay */}
              <div className="relative inline-block mb-6">
                {point.icon}
                {point.iconOverlay}
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {point.title}
              </h3>

              {/* Descrição */}
              <p className="text-gray-600 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline visual - Antes/Depois */}
        <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            O Dia de um Nutricionista
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sem Automação */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-red-600 mb-4">❌ Sem Automação</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-red-500">8h</span>
                  <span>Primeira consulta</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-red-500">10h</span>
                  <span>Responder 15 mensagens no WhatsApp</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-red-500">12h</span>
                  <span>Ligar para confirmar consultas da tarde</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-red-500">18h</span>
                  <span>Atualizar planilha de agendamentos</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-red-500">21h</span>
                  <span>Ainda respondendo WhatsApp...</span>
                </div>
              </div>
            </div>

            {/* Com NutriMatic */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-600 mb-4">✅ Com NutriMatic</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">8h</span>
                  <span>Primeira consulta</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">10h</span>
                  <span>IA já respondeu e agendou 3 pacientes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">12h</span>
                  <span>IA confirmou todas as consultas automaticamente</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">18h</span>
                  <span>Dashboard sempre atualizado em tempo real</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">21h</span>
                  <span>Relaxando em casa 😌</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}