'use client';

import { TrendingUp } from 'lucide-react';
import { useScrollAnimation, useCountUp } from '@/hooks/useScrollAnimations';

export default function ImpactMetricsSection() {
  const { ref, isVisible } = useScrollAnimation(0.3);
  
  const consultationsCount = useCountUp(2847, 2000, isVisible);
  const attendanceCount = useCountUp(94, 2000, isVisible);
  const timeSavedCount = useCountUp(12, 2000, isVisible);
  const responseTimeCount = useCountUp(2, 2000, isVisible);

  const metrics = [
    {
      number: consultationsCount.toLocaleString(),
      label: "Consultas agendadas no último mês",
      color: "text-nutrimatic-600"
    },
    {
      number: `${attendanceCount}%`,
      label: "Taxa média de presença (vs. 75% sem automação)",
      color: "text-nutrimatic-500"
    },
    {
      number: `${timeSavedCount}h`,
      label: "Economizadas por nutricionista/semana",
      color: "text-nutrimatic-700"
    },
    {
      number: `<${responseTimeCount}min`,
      label: "Tempo médio de resposta da IA (vs. 3h+ manual)",
      color: "text-nutrimatic-600"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Os Números Não Mentem.{' '}
            <span className="bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 bg-clip-text text-transparent">
              O NutriMatic Entrega.
            </span>
          </h2>
        </div>

        {/* Grid de métricas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`text-4xl lg:text-5xl font-black mb-4 ${metric.color}`}>
                {metric.number}
              </div>
              <p className="text-gray-600 leading-relaxed">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Gráfico visual complementar */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Crescimento de Consultas Agendadas - Jan a Mar 2025
          </h3>
          
          {/* Gráfico simplificado */}
          <div className="relative h-64 bg-white rounded-xl p-6">
            <div className="flex items-end justify-between h-full">
              {/* Barras do gráfico */}
              {[
                { month: 'Jan', value: 60, consultations: 1200 },
                { month: 'Fev', value: 80, consultations: 1800 },
                { month: 'Mar', value: 100, consultations: 2400 }
              ].map((bar, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full max-w-20 relative">
                    <div 
                      className="bg-gradient-to-t from-blue-500 to-green-500 rounded-t-lg transition-all duration-1000 ease-out"
                      style={{ 
                        height: `${bar.value * 2}px`,
                        animationDelay: `${index * 200}ms`
                      }}
                    ></div>
                    <div className="text-center mt-2">
                      <div className="text-sm font-semibold text-gray-900">{bar.consultations}</div>
                      <div className="text-xs text-gray-600">{bar.month}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ícone de crescimento */}
            <div className="absolute top-4 right-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {/* Insight */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              <span className="font-semibold text-green-600">+100% de crescimento</span> em consultas agendadas via IA nos últimos 3 meses
            </p>
          </div>
        </div>

        {/* Elemento adicional de credibilidade */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-2">99.8%</div>
            <p className="text-gray-600">Uptime da plataforma</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
            <p className="text-gray-600">Suporte técnico</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
            <p className="text-gray-600">Agendamentos perdidos</p>
          </div>
        </div>
      </div>
    </section>
  );
}