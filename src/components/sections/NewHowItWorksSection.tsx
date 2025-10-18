import { Smartphone, Brain, Rocket, QrCode, Settings, BarChart3, Clock } from 'lucide-react';

export default function NewHowItWorksSection() {
  const steps = [
    {
      number: "1",
      icon: <Smartphone className="w-8 h-8" />,
      title: "Conecte seu WhatsApp em 2 minutos",
      description: "Sem instalação complicada. Cole um QR Code, autorize a API oficial do WhatsApp e pronto. Sua IA já está viva.",
      visual: {
        type: "qr-code",
        content: "QR Code sendo escaneado + tela de 'Conectado com sucesso ✅'"
      }
    },
    {
      number: "2", 
      icon: <Brain className="w-8 h-8" />,
      title: "Ensine a IA em 5 minutos (ou use nosso template)",
      description: "Defina seus horários disponíveis, mensagens de boas-vindas e regras de agendamento. A IA aprende seu jeito e replica com perfeição.",
      visual: {
        type: "config-interface",
        content: "Interface de configuração com toggles e campos de texto preenchidos"
      }
    },
    {
      number: "3",
      icon: <Rocket className="w-8 h-8" />,
      title: "Deixe a IA trabalhar (e relaxe)",
      description: "A partir de agora, todo contato no WhatsApp é atendido, qualificado e agendado automaticamente. Você só abre o dashboard para ver a mágica acontecendo.",
      visual: {
        type: "notifications",
        content: "Notificações chegando no dashboard"
      }
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Veja Como o NutriMatic Funciona em{' '}
            <span className="bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 bg-clip-text text-transparent">
              3 Passos Simples
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Linha conectora */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-green-200 to-purple-200 hidden lg:block"></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Conteúdo */}
                <div className="flex-1 space-y-6">
                  {/* Badge com número */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.number}
                    </div>
                    <div className="text-nutrimatic-600">
                      {step.icon}
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {step.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {/* Step 1 - QR Code */}
                    {step.visual.type === 'qr-code' && (
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                          <QrCode className="w-20 h-20 text-gray-400" />
                        </div>
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Conectado com sucesso ✅
                        </div>
                        <p className="text-sm text-gray-600">Escaneie o QR Code com seu WhatsApp</p>
                      </div>
                    )}

                    {/* Step 2 - Config Interface */}
                    {step.visual.type === 'config-interface' && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Configuração da IA</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="text-sm text-gray-700">Horário de funcionamento</span>
                            <Settings className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="text-sm text-gray-700">Mensagem de boas-vindas</span>
                            <div className="w-12 h-6 bg-green-500 rounded-full relative">
                              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="text-sm text-gray-700">Regras de agendamento</span>
                            <div className="w-12 h-6 bg-green-500 rounded-full relative">
                              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3 - Notifications */}
                    {step.visual.type === 'notifications' && (
                      <div className="space-y-3">
                        <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Nova consulta agendada</span>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">Ana Silva - Quinta 14:00</p>
                        </div>
                        <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Follow-up enviado</span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">3 pacientes contatados</p>
                        </div>
                        <div className="bg-purple-100 border-l-4 border-purple-500 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Paciente confirmou presença</span>
                          </div>
                          <p className="text-xs text-purple-600 mt-1">João Costa - Amanhã 10:00</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elemento de fechamento */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 inline-block">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">~10 min</div>
                <p className="text-gray-600">Tempo total de setup</p>
              </div>
              <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">12+ horas</div>
                <p className="text-gray-600">Economia semanal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}