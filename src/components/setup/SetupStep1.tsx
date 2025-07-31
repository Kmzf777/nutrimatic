'use client';

import { useState } from 'react';
import { SetupFormData } from '../../types/setup';

interface SetupStep1Props {
  formData: SetupFormData;
  updateFormData: (data: Partial<SetupFormData>) => void;
  onNext: () => void;
}

export default function SetupStep1({ formData, updateFormData, onNext }: SetupStep1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dados Pessoais
        </h2>
        <p className="text-gray-600">
          Vamos começar com suas informações pessoais básicas.
        </p>
      </div>

      <div className="space-y-6">
        {/* Nome Completo */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData({ nome: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.nome ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Digite seu nome completo"
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            id="telefone"
            value={formData.telefone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              updateFormData({ telefone: formatted });
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.telefone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          {errors.telefone && (
            <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
            CPF *
          </label>
          <input
            type="text"
            id="cpf"
            value={formData.cpf}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              updateFormData({ cpf: formatted });
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.cpf ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {errors.cpf && (
            <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-nutrimatic-600 text-white font-medium rounded-lg hover:bg-nutrimatic-700 focus:ring-4 focus:ring-nutrimatic-200 transition-all duration-200"
        >
          Próximo Passo
          <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
} 