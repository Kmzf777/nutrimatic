'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Users, 
  Clock, 
  BarChart3, 
  Zap, 
  Shield, 
  Star,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: "Prescrições automáticas e personalizadas",
    description: "IA avançada que cria dietas personalizadas baseadas no perfil completo do paciente.",
    color: "nutrimatic",
    highlight: "com IA"
  },
  {
    icon: MessageCircle,
    title: "Atendimento Automatizado",
    description: "Atendimento automático 24/7 via redes sociais mais populares.",
    color: "nutrimatic",
    highlight: "24/7"
  },
  {
    icon: Users,
    title: "Prospecção automática de clientes",
    description: "Encontre e atraia novos pacientes automaticamente.",
    color: "purple",
    highlight: "Automática"
  },
  {
    icon: Clock,
    title: "Agentes de atendimento 24/7",
    description: "Sistema inteligente que nunca dorme e sempre responde.",
    color: "green",
    highlight: "24/7"
  },
  {
    icon: BarChart3,
    title: "Relatórios e gestão de atendimentos",
    description: "Dashboards completos para acompanhar o crescimento do seu consultório.",
    color: "orange",
    highlight: "Completos"
  },
  {
    icon: Zap,
    title: "Integração fácil",
    description: "Conecte com Instagram, site e outras ferramentas em minutos.",
    color: "pink",
    highlight: "Fácil"
  }
];

const benefits = [
  "Setup em 5 minutos",
  "Sem necessidade de conhecimento técnico",
  "Suporte especializado para nutricionistas",
  "Cancelamento a qualquer momento",
  "Atualizações gratuitas",
  "Backup automático dos dados"
];

export default function FeaturesSection() {
  return (
    <section id="recursos" className="py-20 lg:py-32 bg-gray-50">
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
            className="inline-flex items-center space-x-2 bg-nutrimatic-100 text-nutrimatic-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            <span>Recursos e diferenciais</span>
          </motion.div>
          
          <h2 className="text-gray-900 mb-6">
            Nutrimatic faz <span className="text-gradient">MUITO MAIS</span> que IA para prescrições
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Uma plataforma completa que automatiza todo o seu consultório, desde a primeira consulta até o acompanhamento
          </p>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="gradient-primary text-white px-8 py-4 rounded-full flex items-center space-x-3 shadow-lg">
            <Shield className="w-5 h-5" />
            <span className="font-bold text-lg">Exclusivo para Nutricionistas</span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 lg:mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card p-8 h-full relative overflow-hidden hover:scale-105 transition-transform duration-300">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    feature.color === 'nutrimatic' ? 'bg-nutrimatic-100' :
                    feature.color === 'purple' ? 'bg-purple-100' :
                    feature.color === 'green' ? 'bg-green-100' :
                    feature.color === 'orange' ? 'bg-orange-100' :
                    'bg-pink-100'
                  }`}
                >
                  <feature.icon className={`w-8 h-8 ${
                    feature.color === 'nutrimatic' ? 'text-nutrimatic-600' :
                    feature.color === 'purple' ? 'text-purple-600' :
                    feature.color === 'green' ? 'text-green-600' :
                    feature.color === 'orange' ? 'text-orange-600' :
                    'text-pink-600'
                  }`} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-nutrimatic-600 transition-colors">
                  {feature.title}
                  {feature.highlight && (
                    <span className="text-sm font-normal text-nutrimatic-600 ml-2">
                      ({feature.highlight})
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-nutrimatic-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Nutrimatic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Content */}
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              Por que escolher a <span className="text-gradient">Nutrimatic?</span>
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Desenvolvida especificamente para nutricionistas, nossa plataforma entende as necessidades reais do seu dia a dia.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-nutrimatic-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="btn btn-primary text-lg px-8 py-4">
                Começar agora
              </Link>
              <button className="btn btn-secondary text-lg px-8 py-4">
                Ver demonstração
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="text-4xl lg:text-5xl font-bold text-nutrimatic-600 mb-2">1.000+</div>
              <div className="text-lg text-gray-600 mb-4">Nutricionistas já confiam na Nutrimatic</div>
              <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.9/5</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">50.000+</div>
                <div className="text-sm text-gray-600">Prescrições geradas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Atendimento</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">96%</div>
                <div className="text-sm text-gray-600">Economia de tempo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">5min</div>
                <div className="text-sm text-gray-600">Setup inicial</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 