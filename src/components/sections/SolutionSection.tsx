'use client';

import { Star, ArrowRight, CheckCircle, Clock, Calendar, Users, BarChart3, Bell } from 'lucide-react';

export default function SolutionSection() {
  const benefits = [
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Atendimento 24/7 no WhatsApp — Responde na hora, mesmo às 3h da manhã"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      text: "Agenda automaticamente — Paciente escolhe horário e pronto, está marcado"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Follow-up inteligente — IA recarga pacientes que não agendam retorno em 30 dias"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: "Dashboard que você realmente usa — Veja tudo: quem agendou, quem cancelou, receita projetada"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      text: "Zero trabalho manual — A IA cancela, remarca e avisa pacientes automaticamente"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Visual à esquerda - 55% */}
          <div className="lg:col-span-3 relative">
            {/* Mockup do dashboard */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Header do dashboard */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
                <h3 className="text-xl font-bold mb-2">Dashboard NutriMatic</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold">28</div>
                    <div className="opacity-90">consultas esta semana</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">94%</div>
                    <div className="opacity-90">taxa de presença</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="opacity-90">novos pacientes</div>
                  </div>
                </div>
              </div>

              {/* Lista de agendamentos */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Próximos Agendamentos</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Ana Silva', time: 'Hoje 14:00', status: 'confirmado', avatar: 'A' },
                    { name: 'Carlos Santos', time: 'Hoje 16:00', status: 'confirmado', avatar: 'C' },
                    { name: 'Maria Oliveira', time: 'Amanhã 09:00', status: 'pendente', avatar: 'M' },
                    { name: 'João Costa', time: 'Amanhã 11:00', status: 'confirmado', avatar: 'J' }
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {appointment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{appointment.name}</div>
                        <div className="text-sm text-gray-600">{appointment.time}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar menu */}
              <div className="bg-gray-50 p-4 border-t">
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                  <div className="text-center">Dashboard</div>
                  <div className="text-center">Pacientes</div>
                  <div className="text-center">Automações</div>
                  <div className="text-center">Relatórios</div>
                </div>
              </div>
            </div>

            {/* Notificação flutuante */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg animate-bounce">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">IA confirmou consulta de João Silva para amanhã 15h</span>
              </div>
            </div>
          </div>

          {/* Copy à direita - 45% */}
          <div className="lg:col-span-2 space-y-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <Star className="w-5 h-5" />
              <span className="uppercase tracking-wide text-sm">A SOLUÇÃO COMPLETA</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Seu Consultório no{' '}
              <span className="bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 bg-clip-text text-transparent">
                Piloto Automático.
              </span>{' '}
              Literalmente.
            </h2>

            {/* Sub-headline */}
            <p className="text-xl text-gray-600 leading-relaxed">
              NutriMatic é o único agente de IA feito SOB MEDIDA para nutricionistas. 
              Não é um chatbot genérico — é uma secretária digital que entende 
              sua rotina e fala a língua dos seus pacientes.
            </p>

            {/* Lista de benefícios */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="text-blue-600">{benefit.icon}</div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="group relative bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 hover:from-nutrimatic-600 hover:to-nutrimatic-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-nutrimatic-400 to-nutrimatic-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="relative z-10">Agende Sua Reunião Agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}