'use client';

import { useState } from 'react';
import { Calendar, Play, Clock } from 'lucide-react';
import Image from 'next/image';

export default function NewHeroSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section 
      data-hero-section
      className="relative min-h-screen bg-gradient-to-br from-nutrimatic-50 via-white to-nutrimatic-100 overflow-hidden"
    >
      {/* Logo marca d'água no background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
          <Image
            src="/Nutrimatic%20Logo%20PNG.png"
            alt="Nutrimatic Background"
            fill
            className="object-contain opacity-[0.08] sm:opacity-[0.06] md:opacity-[0.05] lg:opacity-[0.04]"
            sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 500px, 600px"
            priority
          />
          {/* Degradê difuso na parte inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/15 to-transparent"></div>
        </div>
      </div>

      {/* Elementos flutuantes otimizados para mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 w-16 h-16 md:w-20 md:h-20 md:left-10 bg-nutrimatic-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-4 w-24 h-24 md:w-32 md:h-32 md:right-20 bg-nutrimatic-300/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-4 w-20 h-20 md:w-24 md:h-24 md:left-20 bg-nutrimatic-400/30 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-12 md:pb-16">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-12 items-center min-h-[85vh] lg:min-h-[80vh] max-w-7xl mx-auto">
          {/* Copy - Mobile First */}
          <div className="w-full lg:col-span-3 space-y-6 md:space-y-8 animate-fade-in text-center lg:text-left order-2 lg:order-1">
            {/* Headline - Mobile Optimized */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-tight px-2 lg:px-0">
              Sua Secretária de IA que{' '}
              <span className="bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 bg-clip-text text-transparent block sm:inline">
                Agenda Consultas
              </span>{' '}
              <span className="block sm:inline">Enquanto Você Dorme</span>
            </h1>

            {/* Sub-headline - Mobile Optimized */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-full lg:max-w-3xl px-2 lg:px-0">
              Automatize 100% do seu atendimento no WhatsApp com o NutriMatic.{' '}
              <span className="hidden sm:inline">
                Agendamentos, cancelamentos, follow-ups e lembretes — tudo resolvido 
                pela IA, sem você mover um dedo.
              </span>{' '}
              <span className="block sm:inline font-semibold text-nutrimatic-700">
                Mais tempo para cuidar, zero tempo perdido.
              </span>
            </p>

            {/* CTAs - Mobile First Design */}
            <div className="flex flex-col gap-4 pt-4 w-full max-w-sm mx-auto lg:max-w-none lg:mx-0 lg:flex-row">
              <button className="group relative bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 hover:from-nutrimatic-600 hover:to-nutrimatic-700 text-white px-6 py-4 lg:px-8 rounded-2xl text-base lg:text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden w-full lg:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-nutrimatic-400 to-nutrimatic-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 group-hover:animate-bounce relative z-10" />
                <span className="relative z-10">Agende Sua Reunião</span>
              </button>
              
              <button 
                onClick={() => setShowVideo(true)}
                className="group relative border-2 border-nutrimatic-300 hover:border-nutrimatic-500 text-nutrimatic-700 hover:text-nutrimatic-600 px-6 py-4 lg:px-8 rounded-2xl text-base lg:text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden w-full lg:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-nutrimatic-50 to-nutrimatic-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Play className="w-5 h-5 lg:w-6 lg:h-6 group-hover:animate-pulse relative z-10" />
                <span className="relative z-10">Ver Demo</span>
              </button>
            </div>
          </div>

          {/* Visual Mobile First - Responsive */}
          <div className="w-full lg:col-span-2 relative order-1 lg:order-2 flex justify-center">
            {/* Mockup de smartphone - Mobile Optimized */}
            <div className="relative w-64 h-[480px] sm:w-72 sm:h-[540px] lg:w-80 lg:h-[600px] bg-gray-900 rounded-[2.5rem] lg:rounded-[3rem] p-1.5 lg:p-2 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                {/* Header do WhatsApp */}
                <div className="bg-green-500 text-white p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-sm font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold">Ana (Paciente)</div>
                    <div className="text-xs opacity-90">online</div>
                  </div>
                </div>

                {/* Conversa */}
                <div className="p-4 space-y-4 bg-gray-50 h-full">
                  {/* Mensagem da paciente */}
                  <div className="flex justify-end">
                    <div className="bg-green-500 text-white p-3 rounded-lg max-w-xs">
                      Oi, quero marcar consulta
                    </div>
                  </div>

                  {/* Resposta da IA */}
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg max-w-xs shadow-sm">
                      Olá Ana! 😊 Tenho horários disponíveis: Quinta 14h ou Sexta 10h. Qual prefere?
                    </div>
                  </div>

                  {/* Resposta da paciente */}
                  <div className="flex justify-end">
                    <div className="bg-green-500 text-white p-3 rounded-lg max-w-xs">
                      Quinta às 14h
                    </div>
                  </div>

                  {/* Confirmação da IA */}
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg max-w-xs shadow-sm">
                      ✅ Agendado! Quinta 14h com Dra. Juliana. Vou te lembrar 1 dia antes!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos flutuantes - Mobile Optimized */}
            <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-white/90 backdrop-blur-sm rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-lg animate-bounce">
              <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-nutrimatic-600" />
            </div>
            
            <div className="absolute top-16 -left-4 lg:top-20 lg:-left-8 bg-white/90 backdrop-blur-sm rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-lg animate-bounce delay-500">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-nutrimatic-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>

            <div className="absolute bottom-16 -right-4 lg:bottom-20 lg:-right-8 bg-white/90 backdrop-blur-sm rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-lg animate-bounce delay-1000">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔔</span>
              </div>
            </div>

            {/* Badge floating - Mobile Responsive */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-semibold flex items-center gap-1 lg:gap-2 shadow-lg">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Disponível </span>24/7
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vídeo */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Como o NutriMatic Funciona</h3>
              <button 
                onClick={() => setShowVideo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Espaço reservado para vídeo demo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </section>
  );
}