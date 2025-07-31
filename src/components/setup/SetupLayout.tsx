'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SetupLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function SetupLayout({ children, currentStep, totalSteps }: SetupLayoutProps) {
  const steps = [
    { id: 1, title: 'Dados Pessoais', description: 'Informações básicas' },
    { id: 2, title: 'Dados Profissionais', description: 'Especialidade e registro' },
    { id: 3, title: 'Configurações', description: 'Dados da clínica' },
    { id: 4, title: 'Preferências', description: 'Configurações finais' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/Nutrimatic Icon Vetor.png"
                alt="Nutrimatic"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-nutrimatic-600">Nutrimatic</span>
            </Link>
            
            <div className="text-sm text-gray-500">
              Configuração da Conta
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Configuração da Conta
            </h1>
            <span className="text-sm text-gray-500">
              Passo {currentStep} de {totalSteps}
            </span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step.id < currentStep
                        ? 'bg-nutrimatic-500 border-nutrimatic-500 text-white'
                        : step.id === currentStep
                        ? 'bg-white border-nutrimatic-500 text-nutrimatic-500'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="ml-3 hidden sm:block">
                    <div
                      className={`text-sm font-medium transition-colors duration-300 ${
                        step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400">{step.description}</div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                      step.id < currentStep ? 'bg-nutrimatic-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Nutrimatic. Todos os direitos reservados.</p>
            <p className="mt-1">
              Precisa de ajuda?{' '}
              <Link href="/contato" className="text-nutrimatic-600 hover:text-nutrimatic-700">
                Entre em contato
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 