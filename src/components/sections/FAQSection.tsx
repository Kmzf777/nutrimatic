'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Quanto custa a Nutrimatic?",
    answer: "A Nutrimatic oferece planos a partir de R$ 97/mês. Todos os planos incluem prescrições automáticas, atendimento automatizado 24/7, prospecção automática e suporte especializado. Não há taxa de setup ou cancelamento."
  },
  {
    question: "É seguro usar IA para prescrições?",
    answer: "Sim! Nossa IA foi treinada com milhares de casos reais e segue rigorosos protocolos de segurança. Todas as prescrições são revisadas por nutricionistas e você mantém controle total sobre o conteúdo."
  },
  {
    question: "Como funciona a integração com redes sociais?",
    answer: "É muito simples! Conectamos diretamente com suas redes sociais. O sistema responde automaticamente 24/7, agenda consultas e tira dúvidas dos pacientes. Você pode personalizar todas as respostas."
  },
  {
    question: "Preciso de conhecimento técnico?",
    answer: "Não! A Nutrimatic foi desenvolvida para ser extremamente fácil de usar. O setup leva apenas 5 minutos e nossa equipe oferece suporte completo para você começar."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Não há fidelidade ou multa por cancelamento. Você pode cancelar sua assinatura a qualquer momento através do painel de controle."
  },
  {
    question: "A Nutrimatic funciona em qualquer cidade?",
    answer: "Sim! A Nutrimatic funciona em todo o Brasil. Nossa plataforma é 100% online e pode ser acessada de qualquer lugar com internet."
  },
  {
    question: "Como funciona o período de teste?",
    answer: "Oferecemos 7 dias de teste gratuito com acesso completo a todas as funcionalidades. Não é necessário cartão de crédito para começar."
  },
  {
    question: "Vocês oferecem suporte técnico?",
    answer: "Sim! Nossa equipe de suporte especializada está disponível de segunda a sexta, das 8h às 18h. Também oferecemos suporte online e base de conhecimento completa."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-32 bg-gray-50">
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
            <HelpCircle className="w-4 h-4" />
            <span>Perguntas frequentes</span>
          </motion.div>
          
          <h2 className="text-gray-900 mb-6">
            Dúvidas <span className="text-gradient">comuns</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tire suas principais dúvidas sobre a Nutrimatic e como ela pode transformar seu consultório
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 lg:p-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-nutrimatic-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                        <div className="border-t border-gray-100 pt-6">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 lg:mt-20"
        >
          <div className="card p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Nossa equipe está pronta para ajudar você a começar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:contato@nutrimatic.com" 
                className="btn btn-primary text-lg px-8 py-4"
              >
                Fale conosco
              </a>
              <a 
                href="/contato" 
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Contato
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 