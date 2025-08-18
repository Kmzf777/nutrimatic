'use client';

import { motion } from 'framer-motion';
import { 
  Settings, 
  Clock, 
  MessageCircle, 
  Calendar, 
  User,
  Palette,
  Volume2,
  Smartphone,
  Mail,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

const workModes = [
  {
    id: 'formal',
    name: 'Formal',
    description: 'Comunicação profissional e protocolar',
    example: 'Prezado(a) Sr(a). Silva, informamos que sua consulta está agendada para amanhã às 14h.',
    color: 'blue'
  },
  {
    id: 'friendly',
    name: 'Amigável',
    description: 'Tom caloroso e acolhedor',
    example: 'Oi Maria! Tudo bem? Sua consulta é amanhã às 14h. Nos vemos lá! 😊',
    color: 'green'
  },
  {
    id: 'casual',
    name: 'Descontraído',
    description: 'Linguagem informal e próxima',
    example: 'E aí João! Beleza? Só lembrando que você tem consulta amanhã às 14h, ok?',
    color: 'purple'
  }
];

const configOptions = [
  {
    icon: Clock,
    title: 'Horários de Funcionamento',
    description: 'Configure quando a IA deve estar ativa',
    options: ['24/7', 'Horário comercial', 'Personalizado']
  },
  {
    icon: MessageCircle,
    title: 'Canais de Comunicação',
    description: 'Escolha como a IA se comunica',
    options: ['WhatsApp', 'SMS', 'Email', 'Todos']
  },
  {
    icon: Calendar,
    title: 'Antecedência de Lembretes',
    description: 'Quando enviar notificações',
    options: ['1 dia antes', '2 horas antes', 'Ambos', 'Personalizado']
  },
  {
    icon: User,
    title: 'Personalidade da IA',
    description: 'Como a IA deve se comportar',
    options: ['Formal', 'Amigável', 'Descontraído']
  }
];

export default function CustomizationSection() {
  const [selectedMode, setSelectedMode] = useState('friendly');
  const [activeConfig, setActiveConfig] = useState(null);

  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Settings className="w-4 h-4" />
            <span>Personalização Total</span>
          </motion.div>
          
          <h2 className="text-gray-900 mb-6">
            Adapte a IA ao <span className="text-gradient">seu modo de trabalho</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Configure a personalidade, horários e comunicação da sua Secretária IA para que ela trabalhe exatamente como você gostaria
          </p>
        </motion.div>

        {/* Work Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Escolha a Personalidade da sua IA</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {workModes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`card p-6 cursor-pointer transition-all duration-300 ${
                  selectedMode === mode.id 
                    ? `ring-2 ring-${mode.color}-500 bg-${mode.color}-50` 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{mode.name}</h4>
                  {selectedMode === mode.id && (
                    <CheckCircle className={`w-5 h-5 text-${mode.color}-600`} />
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{mode.description}</p>
                <div className="bg-white rounded-lg p-3 border-l-4 border-gray-300">
                  <p className="text-sm text-gray-700 italic">"{mode.example}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Configuration Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Configure os Detalhes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {configOptions.map((config, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-nutrimatic-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <config.icon className="w-6 h-6 text-nutrimatic-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h4>
                    <p className="text-gray-600 mb-4">{config.description}</p>
                    <div className="space-y-2">
                      {config.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`config-${index}`} 
                            className="text-nutrimatic-600 focus:ring-nutrimatic-500"
                            defaultChecked={optionIndex === 0}
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="card p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Preview em Tempo Real</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phone Mockup */}
            <div className="bg-gray-900 rounded-3xl p-4 max-w-sm mx-auto">
              <div className="bg-white rounded-2xl p-4 h-96 overflow-y-auto">
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b">
                  <div className="w-8 h-8 bg-nutrimatic-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">N</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Nutrimatic</div>
                    <div className="text-xs text-green-500">online</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                    <p className="text-sm text-gray-800">
                      {workModes.find(mode => mode.id === selectedMode)?.example}
                    </p>
                    <span className="text-xs text-gray-500">Agora</span>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                      <p className="text-sm">Obrigado! Estarei lá 😊</p>
                      <span className="text-xs text-blue-200">Agora</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Configuração Atual</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Personalidade</span>
                  <span className="font-medium text-nutrimatic-600">
                    {workModes.find(mode => mode.id === selectedMode)?.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Horário de Funcionamento</span>
                  <span className="font-medium text-nutrimatic-600">24/7</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Canal Principal</span>
                  <span className="font-medium text-nutrimatic-600">WhatsApp</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Lembretes</span>
                  <span className="font-medium text-nutrimatic-600">1 dia antes</span>
                </div>
              </div>
              
              <button className="w-full btn btn-primary mt-6">
                Salvar Configurações
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}