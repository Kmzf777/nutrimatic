'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimations';

export default function SocialProofSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const testimonials = [
    {
      photo: "JM",
      name: "Dra. Juliana Mendes",
      role: "Nutricionista Clínica",
      quote: "Em 2 meses, passei de 40 para 68 consultas/mês. O NutriMatic virou minha secretária 24/7. Nunca mais perdi um agendamento porque demorei para responder no WhatsApp.",
      metric: "+70% consultas em 60 dias",
      metricColor: "bg-green-100 text-green-800"
    },
    {
      photo: "CA",
      name: "Dr. Carlos Almeida",
      role: "Nutrição Esportiva",
      quote: "O follow-up automático é INSANO. 38% dos meus pacientes inativos voltaram depois que a IA mandou mensagem de reengajamento. É dinheiro que eu estava deixando na mesa.",
      metric: "38% reativação de pacientes",
      metricColor: "bg-blue-100 text-blue-800"
    },
    {
      photo: "AC",
      name: "Dra. Ana Costa",
      role: "Emagrecimento & Saúde",
      quote: "Economizo 12 horas por semana. DOZE. Antes eu ficava até 21h respondendo WhatsApp. Hoje a IA faz tudo e eu só abro o dashboard para ver quantos novos pacientes agendaram.",
      metric: "12h/semana economizadas",
      metricColor: "bg-purple-100 text-purple-800"
    },
    {
      photo: "NV",
      name: "Clínica NutriVida",
      role: "4 nutricionistas",
      quote: "Escalamos de 2 para 4 profissionais sem contratar secretária. O NutriMatic gerencia a agenda de todos, evita conflitos e mantém tudo organizado. ROI absurdo.",
      metric: "R$0 em contratação administrativa",
      metricColor: "bg-orange-100 text-orange-800"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Nutricionistas Reais.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Resultados Reais.
            </span>{' '}
            Comprovados.
          </h2>
        </div>

        {/* Grid de depoimentos */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header com foto e info */}
              <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.photo}
                </div>
                
                {/* Nome e cargo */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Citação */}
              <blockquote className="text-gray-700 leading-relaxed mb-6 text-lg">
                "{testimonial.quote}"
              </blockquote>

              {/* Métrica destacada */}
              <div className={`${testimonial.metricColor} px-4 py-2 rounded-full text-sm font-semibold inline-block`}>
                {testimonial.metric}
              </div>
            </div>
          ))}
        </div>

        {/* Elemento adicional de credibilidade */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">150+</div>
                <p className="text-gray-600">Nutricionistas ativos</p>
              </div>
              <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
                <p className="text-gray-600">Avaliação média</p>
              </div>
              <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <p className="text-gray-600">Taxa de retenção</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}