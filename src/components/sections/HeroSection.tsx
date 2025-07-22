'use client';

import { motion } from 'framer-motion';
import { Play, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 lg:pt-20">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container relative z-10 pt-8 lg:pt-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white mb-6 leading-tight"
            >
              Receitas, atendimento e prospecção no{' '}
              <span className="text-gradient">piloto automático</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed"
            >
              O tempo do nutricionista não se negocia — a{' '}
              <span className="font-semibold text-white">Nutrimatic</span> resolve.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Automatize prescrições, converse com clientes, gere novos atendimentos — 
              tudo em minutos, usando inteligência artificial.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Link href="#cta" className="btn btn-primary text-lg px-8 py-4">
                <span>Teste grátis agora</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="btn btn-ghost text-lg px-8 py-4">
                <Play className="w-5 h-5" />
                <span>Ver demonstração</span>
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-white/80"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-nutrimatic-400" />
                <span className="font-medium">Mais de 1.000 nutricionistas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-nutrimatic-400" />
                <span className="font-medium">Setup em 5 minutos</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main mockup */}
              <div className="glass rounded-3xl p-6 lg:p-8">
                <div className="card p-6">
                  {/* Browser bar */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-nutrimatic-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-sm text-gray-500">nutrimatic.com/chat</span>
                    </div>
                  </div>
                  
                  {/* Chat interface */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">👤</span>
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                        <p className="text-sm text-gray-800">Olá! Preciso de uma dieta para emagrecimento</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="bg-nutrimatic-100 rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                        <p className="text-sm text-gray-800">Claro! Vou criar uma prescrição personalizada para você. Primeiro, me conte sobre seus objetivos...</p>
                      </div>
                      <div className="w-8 h-8 bg-nutrimatic-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">AI</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">👤</span>
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                        <p className="text-sm text-gray-800">Quero perder 10kg em 3 meses</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status bar */}
                  <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-nutrimatic-500 rounded-full animate-pulse"></div>
                      <span>IA Ativa</span>
                    </div>
                    <div>Prescrição gerada em 5 segundos</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 card p-3"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-nutrimatic-500" />
                  <span className="text-sm font-medium text-gray-700">IA Ativa</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 card p-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-nutrimatic-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Online</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
} 