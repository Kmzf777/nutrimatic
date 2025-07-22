'use client';

import { motion } from 'framer-motion';
import { Clock, Zap, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function TimeSavingsSection() {
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
            <Clock className="w-4 h-4" />
            <span>Economia de tempo</span>
          </motion.div>
          
          <h2 className="text-gray-900 mb-6">
            O que você <span className="text-gradient">economiza?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ganhe de volta até <span className="text-nutrimatic-600 font-bold text-2xl">10 horas por semana</span>
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20">
          {/* Traditional Method */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="card p-8 lg:p-10 border-2 border-red-200 bg-red-50/50">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-800">Nutricionista tradicional</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Tempo por prescrição:</span>
                  <span className="text-3xl font-bold text-red-600">2 horas</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Atendimento manual:</span>
                  <span className="text-lg text-red-600 font-medium">Sim</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Prospecção:</span>
                  <span className="text-lg text-red-600 font-medium">Manual</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Disponibilidade:</span>
                  <span className="text-lg text-red-600 font-medium">8h/dia</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nutrimatic Method */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="card p-8 lg:p-10 border-2 border-nutrimatic-200 bg-nutrimatic-50/50 relative overflow-hidden">
              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-nutrimatic-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                RECOMENDADO
              </div>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-nutrimatic-100 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-nutrimatic-600" />
                </div>
                <h3 className="text-2xl font-bold text-nutrimatic-800">Com Nutrimatic</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Tempo por prescrição:</span>
                  <span className="text-3xl font-bold text-nutrimatic-600">5 minutos</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Atendimento automático:</span>
                  <span className="text-lg text-nutrimatic-600 font-medium">24/7</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Prospecção:</span>
                  <span className="text-lg text-nutrimatic-600 font-medium">Automática</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Disponibilidade:</span>
                  <span className="text-lg text-nutrimatic-600 font-medium">24h/dia</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Time Savings Calculation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="gradient-primary rounded-3xl p-8 lg:p-12 text-white text-center mb-16 lg:mb-20"
        >
          <div className="flex items-center justify-center space-x-4 mb-8">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-2xl lg:text-3xl font-bold">Economia de tempo real</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-3">96%</div>
              <div className="text-lg text-white/90">Menos tempo por prescrição</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-3">10h</div>
              <div className="text-lg text-white/90">Economizadas por semana</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-3">520h</div>
              <div className="text-lg text-white/90">Por ano (40h/mês)</div>
            </div>
          </div>
          
          <p className="text-xl lg:text-2xl mt-8 text-white/90 font-medium">
            Mais tempo para estudar, atender, viver.
          </p>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="card p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Quer economizar essas horas?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Comece agora mesmo e veja a diferença em sua rotina
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#cta" className="btn btn-primary text-lg px-8 py-4">
                Quero economizar horas por semana
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