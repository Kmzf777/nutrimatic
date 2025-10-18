import { X, CheckCircle } from 'lucide-react';

export default function BeforeAfterSection() {
  const beforeItems = [
    "Responder WhatsApp até 22h (e perder agendamentos mesmo assim)",
    "Planilha Excel desatualizada = horários sobrepostos",
    "Ligar para pacientes para confirmar consulta",
    "Perder 3-5h/semana em tarefas administrativas",
    "25% de taxa de faltas sem aviso",
    "Pacientes inativos esquecidos = receita perdida"
  ];

  const afterItems = [
    "IA responde em <2 min, 24/7 (você nem precisa estar online)",
    "Agenda sempre sincronizada e sem conflitos",
    "Confirmações e lembretes 100% automáticos",
    "12+ horas/semana liberadas para atender",
    "Taxa de presença acima de 90% (follow-up ativo)",
    "Reativação automática gera 30-40% mais consultas"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Como Era Sua Rotina{' '}
            <span className="text-red-600">ANTES.</span>{' '}
            Como Será{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              COM o NutriMatic.
            </span>
          </h2>
        </div>

        {/* Split Screen */}
        <div className="grid lg:grid-cols-2 gap-8 relative">
          {/* Divisor central */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-200 via-gray-300 to-green-200 hidden lg:block transform -translate-x-1/2"></div>

          {/* Lado Esquerdo - Sem NutriMatic */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 relative">
            {/* Overlay de frustração */}
            <div className="absolute inset-0 bg-red-500/5 rounded-2xl"></div>
            
            <div className="relative">
              <h3 className="text-2xl font-bold text-red-600 mb-8 flex items-center gap-3">
                <X className="w-8 h-8" />
                SEM NutriMatic
              </h3>

              <div className="space-y-4">
                {beforeItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/70 rounded-lg">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Elemento visual de estresse */}
              <div className="mt-8 p-4 bg-red-100 rounded-lg border-l-4 border-red-500">
                <p className="text-red-800 font-medium text-center">
                  😰 Estresse constante • Trabalho até tarde • Receita limitada
                </p>
              </div>
            </div>
          </div>

          {/* Lado Direito - Com NutriMatic */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 relative">
            {/* Overlay de sucesso */}
            <div className="absolute inset-0 bg-green-500/5 rounded-2xl"></div>
            
            <div className="relative">
              <h3 className="text-2xl font-bold text-green-600 mb-8 flex items-center gap-3">
                <CheckCircle className="w-8 h-8" />
                COM NutriMatic
              </h3>

              <div className="space-y-4">
                {afterItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/70 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Elemento visual de sucesso */}
              <div className="mt-8 p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800 font-medium text-center">
                  😌 Tranquilidade total • Mais tempo livre • Receita escalável
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Elemento de transição */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold mb-4">A Transformação Acontece em 10 Minutos</h3>
            <p className="text-lg opacity-90 mb-6">
              Pare de viver no lado esquerdo. Comece a viver no lado direito.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300">
              Quero Fazer a Transição Agora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}