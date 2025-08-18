'use client';

import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  TrendingUp, 
  Users, 
  Clock, 
  MessageCircle,
  Calendar,
  CheckCircle,
  Zap,
  Bell
} from 'lucide-react';

const stats = [
  {
    icon: Heart,
    value: "98.7%",
    label: "Satisfação dos Pacientes",
    description: "Comunicação humanizada e empática",
    color: "red"
  },
  {
    icon: Clock,
    value: "3.2s",
    label: "Tempo de Resposta",
    description: "Respostas instantâneas 24/7",
    color: "orange"
  },
  {
    icon: Users,
    value: "2.4k+",
    label: "Pacientes Ativos",
    description: "Gerenciados simultaneamente",
    color: "blue"
  },
  {
    icon: TrendingUp,
    value: "+127%",
    label: "Aumento na Eficiência",
    description: "Comparado à secretária tradicional",
    color: "green"
  }
];

const features = [
  {
    icon: Bell,
    title: "Notificações Inteligentes",
    description: "Avisa pacientes sobre consultas com linguagem natural e emojis",
    example: "\"Oi Maria! 😊 Sua consulta é amanhã às 14h. Confirma pra mim?\""
  },
  {
    icon: Calendar,
    title: "Alertas para Nutricionista",
    description: "Notifica sobre novos agendamentos com contexto relevante",
    example: "\"Novo agendamento: João Silva, primeira consulta. Preparei histórico médico.\""
  },
  {
    icon: Brain,
    title: "Adaptação Personalizada",
    description: "Aprende seu estilo de trabalho e se adapta automaticamente",
    example: "\"Bloqueei 15min antes da consulta para revisão, como você prefere.\""
  },
  {
    icon: MessageCircle,
    title: "Comunicação Humanizada",
    description: "Conversa como uma pessoa real, não como um robô",
    example: "\"Entendo que precisa remarcar. Que tal na próxima semana?\""
  }
];

export default function AIStatsSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
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
            className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Heart className="w-4 h-4" />
            <span>Secretária IA Humanizada</span>
          </motion.div>
          
          <h2 className="text-gray-900 mb-6">
            Números que comprovam a <span className="text-gradient">humanização da IA</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Veja como nossa Secretária IA combina eficiência tecnológica com o toque humano que seus pacientes merecem
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="font-semibold text-gray-800 mb-2">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features with Examples */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
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
                  <feature.icon className="w-6 h-6 text-nutrimatic-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-nutrimatic-500">
                    <p className="text-sm text-gray-700 italic">"{feature.example}"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Chart Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="card p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Evolução da Satisfação dos Pacientes</h3>
              <p className="text-gray-600">Comparação: Secretária Tradicional vs. Secretária IA Humanizada</p>
            </div>
            
            <div className="relative h-64 bg-gray-50 rounded-lg p-6">
              {/* Chart mockup */}
              <div className="flex items-end justify-between h-full">
                {/* Traditional Secretary */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-gray-400 w-12 h-24 rounded-t"></div>
                  <div className="text-sm font-medium text-gray-600">Tradicional</div>
                  <div className="text-xs text-gray-500">67%</div>
                </div>
                
                {/* AI Secretary */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-nutrimatic-500 w-12 h-48 rounded-t relative">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <div className="text-sm font-medium text-nutrimatic-600">IA Humanizada</div>
                  <div className="text-xs text-nutrimatic-500">98.7%</div>
                </div>
              </div>
              
              {/* Chart labels */}
              <div className="absolute bottom-2 left-6 text-xs text-gray-500">Satisfação dos Pacientes</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}