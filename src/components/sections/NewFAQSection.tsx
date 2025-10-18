'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, MessageCircle, Calendar, Shield, DollarSign, Lock } from 'lucide-react';

export default function NewFAQSection() {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      icon: <Settings className="w-5 h-5" />,
      question: "É difícil de configurar? Não sou técnico(a).",
      answer: "Zero. É literalmente escanear um QR Code e preencher 3 campos (seus horários, mensagem de boas-vindas). Se você usa WhatsApp, você sabe usar o NutriMatic. Levou 8 minutos para nossa última cliente configurar tudo."
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      question: "A IA vai falar besteira ou ser robótica?",
      answer: "Não. O NutriMatic foi treinado especificamente para nutricionistas. Ele entende termos como 'avaliação nutricional', 'retorno', 'plano alimentar'. E você pode personalizar o tom (formal, amigável, etc). Teste: ninguém percebe que não é humano."
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      question: "E se o paciente quiser falar comigo diretamente?",
      answer: "A IA identifica e transfere. Se o paciente pedir algo que precise de você (ex: dúvida técnica), a IA avisa: 'Vou transferir para a Dra. Juliana, ela te responde em breve!' Você tem controle total."
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      question: "Funciona com minha agenda no Google Calendar?",
      answer: "Sim. Integração nativa e bidirecional. Você marca um horário no Google, o NutriMatic bloqueia. Paciente agenda no WhatsApp, aparece no Google. Sempre sincronizado."
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      question: "Preciso da API oficial do WhatsApp?",
      answer: "Não! O NutriMatic funciona com seu WhatsApp pessoal mesmo. Não precisa de API oficial, WhatsApp Business API ou qualquer configuração complexa. Basta escanear um QR Code e pronto."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      question: "E a privacidade dos dados dos meus pacientes?",
      answer: "Nível bancário. Usamos criptografia de ponta a ponta, conformidade LGPD e todas as melhores práticas de segurança. Seus dados nunca são vendidos ou compartilhados. Você é dono de 100% das informações."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Perguntas que Todo Nutricionista Faz{' '}
            <span className="text-blue-600">(Respondidas)</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* Pergunta */}
              <button
                onClick={() => setOpenItem(openItem === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="text-blue-600">
                    {faq.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <div className="text-gray-400">
                  {openItem === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Resposta */}
              {openItem === index && (
                <div className="px-6 pb-6">
                  <div className="pl-9 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA adicional */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-600 mb-6">
              Agende uma demonstração de 15 minutos e veja todas as funcionalidades ao vivo.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300">
              Agendar Demonstração Gratuita
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}