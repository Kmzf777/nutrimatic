'use client';

import { motion } from 'framer-motion';
import { Calendar, MessageSquare, CheckCircle2, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Calendar,
    title: "Cliente solicita agendamento",
    description: "Paciente envia mensagem via WhatsApp, Instagram ou site solicitando consulta.",
    color: "nutrimatic",
    step: "01"
  },
  {
    icon: MessageSquare,
    title: "IA agenda automaticamente",
    description: "Sistema verifica disponibilidade, agenda horário e envia confirmação instantânea.",
    color: "nutrimatic",
    step: "02"
  },
  {
    icon: CheckCircle2,
    title: "Gestão completa da agenda",
    description: "Confirmações automáticas, lembretes e reagendamentos sem sua intervenção.",
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
            Agendamento <span className="text-gradient">100% automático</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sua secretária virtual funciona 24/7, sem erros e sem sua intervenção
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
                    'bg-purple-100'
                  }`}
                >
                  <step.icon className={`w-8 h-8 ${
                    step.color === 'nutrimatic' ? 'text-nutrimatic-600' :
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
              Nunca mais perca um agendamento
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Configure uma vez e tenha sua agenda sempre organizada, automaticamente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-4">
                Acessar Dashboard
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