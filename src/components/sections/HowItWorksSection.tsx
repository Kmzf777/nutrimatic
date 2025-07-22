'use client';

import { motion } from 'framer-motion';
import { ClipboardList, FileText, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: ClipboardList,
    title: "Preencha o perfil do paciente",
    description: "Informações básicas como idade, peso, objetivos e restrições alimentares.",
    color: "nutrimatic",
    step: "01"
  },
  {
    icon: FileText,
    title: "Receba a prescrição pronta",
    description: "Dieta personalizada gerada em segundos com base no perfil do paciente.",
    color: "blue",
    step: "02"
  },
  {
    icon: TrendingUp,
    title: "Acompanhe, automatize e atraia mais clientes",
    description: "Gestão completa com chatbot, prospecção automática e relatórios detalhados.",
    color: "purple",
    step: "03"
  }
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 lg:py-32 bg-gray-50">
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
            <CheckCircle className="w-4 h-4" />
            <span>Como funciona</span>
          </motion.div>
          
          <h2 className="text-gray-900 mb-6">
            Em apenas <span className="text-gradient">3 passos simples</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Você terá seu consultório rodando no piloto automático em menos de 5 minutos
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Step Card */}
              <div className="card p-8 h-full relative overflow-hidden">
                {/* Step Number */}
                <div className="absolute top-6 right-6 w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    step.color === 'nutrimatic' ? 'bg-nutrimatic-100' :
                    step.color === 'blue' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}
                >
                  <step.icon className={`w-8 h-8 ${
                    step.color === 'nutrimatic' ? 'text-nutrimatic-600' :
                    step.color === 'blue' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-nutrimatic-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-nutrimatic-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10"
                >
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 lg:mt-20"
        >
          <div className="card p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Pronto para começar?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              O setup leva apenas 5 minutos e você pode cancelar a qualquer momento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#cta" className="btn btn-primary text-lg px-8 py-4">
                Começar agora
              </Link>
              <button className="btn btn-secondary text-lg px-8 py-4">
                Ver demonstração
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 