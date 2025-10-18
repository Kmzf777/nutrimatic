'use client';

import { Calendar, Rocket, Zap } from 'lucide-react';
import Image from 'next/image';

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-nutrimatic-600 via-nutrimatic-700 to-nutrimatic-800 text-white relative overflow-hidden">
      {/* Logo marca d'água no background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px]">
          <Image
            src="/Nutrimatic%20Logo%20PNG.png"
            alt="Nutrimatic Background"
            fill
            className="object-contain opacity-[0.12] sm:opacity-[0.08] md:opacity-[0.06] lg:opacity-[0.05]"
            sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 500px, 550px"
          />
          {/* Degradê difuso na parte inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-nutrimatic-800/85 via-nutrimatic-700/25 to-transparent"></div>
        </div>
      </div>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Rocket className="w-6 h-6 text-yellow-400" />
          <span className="text-yellow-400 font-semibold uppercase tracking-wide text-sm">
            PRONTO PARA ESCALAR?
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
          Pare de Perder Consultas.{' '}
          <span className="text-yellow-400">
            Comece a Escalar Hoje.
          </span>
        </h2>

        {/* Sub-headline */}
        <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          Agende uma demonstração de 15 minutos e veja o NutriMatic funcionando 
          ao vivo. Sem compromisso. Sem cartão de crédito. Só resultados.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <button className="group relative bg-white text-blue-600 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 flex items-center justify-center gap-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Calendar className="w-6 h-6 group-hover:animate-bounce relative z-10" />
            <span className="relative z-10">Agende Sua Reunião Agora</span>
          </button>
          
          <button className="group relative border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex items-center justify-center gap-3 overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Rocket className="w-6 h-6 group-hover:animate-bounce relative z-10" />
            <span className="relative z-10">Ou Teste Grátis por 14 Dias</span>
          </button>
        </div>

        {/* Elemento de urgência/escassez */}
        <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold animate-pulse">
          <Zap className="w-5 h-5" />
          Apenas 3 vagas de onboarding esta semana
        </div>

        {/* Garantias adicionais */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-blue-100">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-sm">Setup em 10 minutos</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🔒</span>
            </div>
            <p className="text-sm">Sem compromisso</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">💳</span>
            </div>
            <p className="text-sm">Sem cartão de crédito</p>
          </div>
        </div>
      </div>

      {/* Visual de fundo - Nutricionista com dashboard */}
      <div className="absolute bottom-0 right-0 opacity-10 hidden lg:block">
        <div className="w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}