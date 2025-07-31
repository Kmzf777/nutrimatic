'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, CheckCircle, Star } from 'lucide-react';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const plans = [
  {
    name: 'Standard',
    description: 'Para consultórios em crescimento',
    price: 'R$ 97',
    period: '/mês',
    cta: 'Começar agora',
    popular: false,
    features: [
      'Até 100 prescrições por mês',
              'Atendimento automatizado com IA',
      'Templates personalizáveis',
      'Suporte prioritário',
      'Relatórios básicos',
              'Integração com redes sociais'
    ]
  },
  {
    name: 'Pro',
    description: 'Para profissionais estabelecidos',
    price: 'R$ 197',
    period: '/mês',
    cta: 'Escolher Pro',
    popular: true,
    features: [
      'Prescrições ilimitadas',
      'IA personalizada para seu estilo',
      'Prospecção automática',
      'CRM integrado',
      'Relatórios avançados',
      'Suporte 24/7',
      'Treinamento personalizado',
      'API para integrações'
    ]
  },
  {
    name: 'Enterprise',
    description: 'Para clínicas e redes',
    price: 'Sob consulta',
    period: '',
    cta: 'Falar com vendas',
    popular: false,
    features: [
      'Tudo do plano Pro',
      'Múltiplos usuários',
      'Dashboard administrativo',
      'Integração com sistemas',
      'Suporte dedicado',
      'Treinamento in-loco',
      'SLA garantido',
      'Customizações exclusivas'
    ]
  }
];

export default function PrecosPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
      }`}>
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <Image
                src="/Nutrimatic Logo PNG.png"
                alt="Nutrimatic"
                width={140}
                height={28}
                className="h-7 w-auto transition-transform group-hover:scale-110"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/" 
                className="font-medium text-gray-700 hover:text-nutrimatic-600 transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                href="/precos" 
                className="font-medium text-nutrimatic-600 hover:text-nutrimatic-700 transition-colors duration-200"
              >
                Preços
              </Link>
              <Link 
                href="/contato" 
                className="font-medium text-gray-700 hover:text-nutrimatic-600 transition-colors duration-200"
              >
                Contato
              </Link>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link 
                href="/login" 
                className="font-medium text-gray-700 hover:text-nutrimatic-600 transition-colors duration-200"
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="btn btn-primary"
              >
                Comece Já
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        
        {/* Menu Panel */}
        <div className={`absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header do menu */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Image
                src="/Nutrimatic Icon Vetor.png"
                alt="Nutrimatic"
                width={32}
                height={32}
                className="flex-shrink-0"
              />
              <span className="text-lg font-semibold text-nutrimatic-600 font-display">Nutrimatic</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          {/* Conteúdo do menu */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                href="/precos" 
                className="text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Preços
              </Link>
              <Link 
                href="/contato" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Contato
              </Link>
              
              {/* Botões */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors block"
                  onClick={closeMenu}
                >
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary w-full justify-center"
                  onClick={closeMenu}
                >
                  Comece Já
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Escolha o plano ideal para{' '}
              <span className="text-gradient">seu consultório</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-600 mb-8"
            >
              Teste nossos planos gratuitamente por 30 dias. Troque de plano ou cancele a qualquer momento.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-nutrimatic-500" />
                <span className="font-medium">Sem compromisso</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-nutrimatic-500" />
                <span className="font-medium">Cancele quando quiser</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-nutrimatic-500" />
                <span className="font-medium">Setup em 5 minutos</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                <div className={`relative h-full rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-nutrimatic-500 bg-gradient-to-br from-nutrimatic-50 to-white shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-nutrimatic-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>Mais Vendido</span>
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                    
                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="text-4xl font-bold text-gray-900 mb-1">{plan.price}</div>
                      <div className="text-gray-600">{plan.period}</div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-nutrimatic-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={plan.name === 'Enterprise' ? '/contato' : '/register'}
                      className={`btn w-full ${
                        plan.popular 
                          ? 'btn-primary' 
                          : plan.name === 'Enterprise' 
                            ? 'btn-secondary' 
                            : 'btn-outline'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-xl text-gray-600">
                Tire suas dúvidas sobre nossos planos
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-gray-600">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Como funciona o período de teste?
                </h3>
                <p className="text-gray-600">
                  Você tem 30 dias para testar todos os recursos gratuitamente. Não é necessário cartão de crédito.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Posso trocar de plano?
                </h3>
                <p className="text-gray-600">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  O que está incluído no suporte?
                </h3>
                <p className="text-gray-600">
                  Oferecemos suporte por email e telefone, dependendo do seu plano.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pronto para transformar seu consultório?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Junte-se a mais de 1.000 nutricionistas que já automatizaram seus processos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn btn-primary text-lg px-8 py-4">
                <span>Começar teste grátis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contato" className="btn btn-outline text-lg px-8 py-4">
                <span>Falar com vendas</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 