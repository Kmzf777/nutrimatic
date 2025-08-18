'use client';

import { motion } from 'framer-motion';
import { Play, ArrowRight, Clock, CheckCircle, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section id="cta" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container relative z-10">
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
            className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Experimente grátis</span>
          </motion.div>
          
          <h2 className="text-white mb-6">
            Configure sua <span className="text-gradient">secretária virtual</span> em 5 minutos
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Ative o agendamento automático e nunca mais perca uma consulta
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center space-x-3 text-white/90">
            <Clock className="w-6 h-6 text-nutrimatic-400" />
            <span className="text-lg font-medium">Disponível 24/7</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-white/90">
            <CheckCircle className="w-6 h-6 text-nutrimatic-400" />
            <span className="text-lg font-medium">Zero falhas</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-white/90">
            <Zap className="w-6 h-6 text-nutrimatic-400" />
            <span className="text-lg font-medium">95% comparecimento</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16 lg:mb-20"
        >
          <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-4">
            <span>Acessar Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <button className="btn btn-ghost text-lg px-8 py-4">
            <Play className="w-5 h-5" />
            <span>Ver demonstração</span>
          </button>
        </motion.div>

        {/* Demo Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 lg:p-8 border border-white/20 max-w-4xl mx-auto mb-16 lg:mb-20"
        >
          <div className="card p-6 lg:p-8">
            {/* Browser bar */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-nutrimatic-500 rounded-full"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-500">nutrimatic.com/demo</span>
              </div>
            </div>
            
            {/* Demo Interface */}
            <div className="space-y-4">
              <div className="bg-nutrimatic-50 rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-nutrimatic-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <span className="font-medium text-gray-800">Secretária Nutrimatic</span>
                </div>
                <p className="text-gray-700 text-sm">Olá! Gostaria de agendar uma consulta? Tenho horários disponíveis para esta semana...</p>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">P</span>
                  </div>
                  <span className="font-medium text-gray-800">Paciente</span>
                </div>
                <p className="text-gray-700 text-sm">Sim, gostaria de agendar para quinta-feira de manhã</p>
              </div>
              
              <div className="bg-nutrimatic-50 rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-nutrimatic-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <span className="font-medium text-gray-800">Secretária Nutrimatic</span>
                </div>
                <p className="text-gray-700 text-sm">Perfeito! Agendei para quinta-feira às 9h. Enviarei lembretes automáticos. Consulta confirmada! ✅</p>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-nutrimatic-500 rounded-full animate-pulse"></div>
                <span>Secretária Ativa 24/7</span>
              </div>
              <div>Agendamento realizado em 3 segundos</div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-white/90 text-lg ml-2">4.9/5</span>
            </div>
            <p className="text-lg text-white/90 mb-4">
              Avaliação média de mais de 1.000 consultórios
            </p>
            <p className="text-sm text-white/70">
              Não é necessário cartão de crédito • Cancelamento a qualquer momento
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}