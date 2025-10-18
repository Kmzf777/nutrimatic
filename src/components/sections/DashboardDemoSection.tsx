'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimations';
import { Calendar, Users, Clock, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function DashboardDemoSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const agendamentos = [
    {
      id: 1,
      paciente: 'Ana Silva',
      horario: '09:00',
      tipo: 'Consulta Inicial',
      status: 'confirmado',
      avatar: 'AS',
      telefone: '(11) 99999-1234'
    },
    {
      id: 2,
      paciente: 'Carlos Santos',
      horario: '10:30',
      tipo: 'Retorno',
      status: 'confirmado',
      avatar: 'CS',
      telefone: '(11) 99999-5678'
    },
    {
      id: 3,
      paciente: 'Maria Oliveira',
      horario: '14:00',
      tipo: 'Avaliação',
      status: 'pendente',
      avatar: 'MO',
      telefone: '(11) 99999-9012'
    },
    {
      id: 4,
      paciente: 'João Costa',
      horario: '15:30',
      tipo: 'Consulta',
      status: 'confirmado',
      avatar: 'JC',
      telefone: '(11) 99999-3456'
    }
  ];

  const clientes = [
    {
      id: 1,
      nome: 'Ana Silva',
      telefone: '(11) 99999-1234',
      ultimaMsg: 'Há 2 min',
      status: 'ativo',
      avatar: 'AS'
    },
    {
      id: 2,
      nome: 'Carlos Santos',
      telefone: '(11) 99999-5678',
      ultimaMsg: 'Há 1 hora',
      status: 'ativo',
      avatar: 'CS'
    },
    {
      id: 3,
      nome: 'Maria Oliveira',
      telefone: '(11) 99999-9012',
      ultimaMsg: 'Há 3 horas',
      status: 'pendente',
      avatar: 'MO'
    },
    {
      id: 4,
      nome: 'João Costa',
      telefone: '(11) 99999-3456',
      ultimaMsg: 'Ontem',
      status: 'ativo',
      avatar: 'JC'
    }
  ];

  return (
    <section ref={ref} className="py-12 md:py-20 bg-gradient-to-br from-nutrimatic-50 to-white overflow-hidden relative">
      {/* Logo marca d'água no background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
          <Image
            src="/Nutrimatic%20Logo%20PNG.png"
            alt="Nutrimatic Background"
            fill
            className="object-contain opacity-[0.06] sm:opacity-[0.04] md:opacity-[0.03] lg:opacity-[0.025]"
            sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 450px"
          />
          {/* Degradê difuso na parte inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/25 to-transparent"></div>
        </div>
      </div>

      <div className={`w-full px-4 sm:px-6 lg:px-8 transition-all duration-1000 relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Headline - Mobile Optimized */}
        <div className="text-center mb-8 md:mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-2">
            Veja o{' '}
            <span className="bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 bg-clip-text text-transparent">
              Dashboard Real
            </span>{' '}
            em Ação
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-full md:max-w-3xl mx-auto px-4">
            Interface intuitiva que centraliza toda gestão do seu consultório.{' '}
            <span className="hidden sm:inline">
              Agenda, clientes e automações em um só lugar.
            </span>
          </p>
        </div>

        {/* Dashboard Demo - Mobile First Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-12 max-w-6xl mx-auto">
          {/* Agenda Demo - Mobile Optimized */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-nutrimatic-100">
            {/* Header - Mobile Responsive */}
            <div className="bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 text-white p-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                <h3 className="text-lg md:text-xl font-bold">Agenda de Hoje</h3>
              </div>
              <p className="text-nutrimatic-100 mt-1 md:mt-2 text-sm md:text-base">Quinta-feira, 23 de Janeiro</p>
            </div>

            {/* Agenda Content - Mobile Optimized */}
            <div className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {agendamentos.map((agendamento, index) => (
                  <div 
                    key={agendamento.id}
                    className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-nutrimatic-100 hover:border-nutrimatic-200 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    {/* Avatar - Mobile Responsive */}
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-nutrimatic-400 to-nutrimatic-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                      {agendamento.avatar}
                    </div>

                    {/* Info - Mobile Layout */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{agendamento.paciente}</h4>
                        <span className="text-xs md:text-sm font-medium text-gray-600 flex-shrink-0">{agendamento.horario}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-xs md:text-sm text-gray-600">{agendamento.tipo}</span>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <span className="text-xs md:text-sm text-gray-500 truncate">{agendamento.telefone}</span>
                      </div>
                    </div>

                    {/* Status - Mobile Responsive */}
                    <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      agendamento.status === 'confirmado' 
                        ? 'bg-nutrimatic-100 text-nutrimatic-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {agendamento.status === 'confirmado' ? 'OK' : 'Pend'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-nutrimatic-600">4</div>
                    <div className="text-xs text-gray-600">Consultas hoje</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-nutrimatic-600">94%</div>
                    <div className="text-xs text-gray-600">Taxa presença</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-nutrimatic-600">R$ 1.2k</div>
                    <div className="text-xs text-gray-600">Receita hoje</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clientes Demo */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-nutrimatic-600 to-nutrimatic-700 text-white p-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <h3 className="text-xl font-bold">Clientes Ativos</h3>
              </div>
              <p className="text-nutrimatic-100 mt-2">Últimas interações</p>
            </div>

            {/* Clientes Content */}
            <div className="p-6">
              <div className="space-y-4">
                {clientes.map((cliente, index) => (
                  <div 
                    key={cliente.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border hover:border-nutrimatic-200 transition-all duration-500 cursor-pointer ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-nutrimatic-400 to-nutrimatic-500 rounded-full flex items-center justify-center text-white font-bold">
                      {cliente.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{cliente.nome}</h4>
                        <span className="text-xs text-gray-500">{cliente.ultimaMsg}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{cliente.telefone}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-nutrimatic-600 hover:bg-nutrimatic-50 rounded-lg transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <div className={`w-3 h-3 rounded-full ${
                        cliente.status === 'ativo' ? 'bg-nutrimatic-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mostrando 4 de 127 clientes</span>
                  <button className="text-nutrimatic-600 hover:text-nutrimatic-700 font-medium text-sm transition-colors">
                    Ver todos →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto para ter seu próprio dashboard?
            </h3>
            <p className="text-gray-600 mb-6">
              Configure em 10 minutos e comece a usar hoje mesmo.
            </p>
            <button className="bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 hover:from-nutrimatic-600 hover:to-nutrimatic-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Acessar Dashboard Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}