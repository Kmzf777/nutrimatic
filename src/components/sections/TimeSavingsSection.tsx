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
            Eficiência em <span className="text-gradient">agendamentos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Aumente sua taxa de comparecimento para <span className="text-nutrimatic-600 font-bold text-2xl font-display">95%</span>
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
                <h3 className="text-2xl font-bold text-red-800">Agendamento tradicional</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Taxa de comparecimento:</span>
                  <span className="text-3xl font-bold text-red-600">65%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Agendamentos perdidos:</span>
                  <span className="text-lg text-red-600 font-medium">35%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Confirmações:</span>
                  <span className="text-lg text-red-600 font-medium">Manual</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Reagendamentos:</span>
                  <span className="text-lg text-red-600 font-medium">Complicados</span>
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
                <h3 className="text-2xl font-bold text-nutrimatic-800">Secretária Nutrimatic</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Taxa de comparecimento:</span>
                  <span className="text-3xl font-bold text-nutrimatic-600">95%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Agendamentos perdidos:</span>
                  <span className="text-lg text-nutrimatic-600 font-medium">0%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Confirmações:</span>
                  <span className="text-lg text-nutrimatic-600 font-medium">Automáticas</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-gray-700 font-medium">Reagendamentos:</span>
                  <span className="text-lg text-nutrimatic-600 font-medium">Instantâneos</span>
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
            <h3 className="text-2xl lg:text-3xl font-bold">Eficiência comprovada</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-3">95%</div>
              <div className="text-lg text-white/90">Taxa de comparecimento</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-3">0</div>
              <div className="text-lg text-white/90">Agendamentos perdidos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-3">24/7</div>
              <div className="text-lg text-white/90">Disponibilidade</div>
            </div>
          </div>
          
          <p className="text-xl lg:text-2xl mt-8 text-white/90 font-medium">
            Agenda sempre organizada, sem falhas.
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
              Quer ter essa eficiência?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Configure sua secretária virtual e nunca mais perca um agendamento
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