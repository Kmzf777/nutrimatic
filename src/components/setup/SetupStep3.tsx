'use client';

import { useState } from 'react';
import { SetupFormData } from '../../types/setup';

interface SetupStep3Props {
  formData: SetupFormData;
  updateFormData: (data: Partial<SetupFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function SetupStep3({ formData, updateFormData, onNext, onPrev }: SetupStep3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeClinica.trim()) {
      newErrors.nomeClinica = 'Nome da clínica é obrigatório';
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(formData.cep.replace(/\D/g, ''))) {
      newErrors.cep = 'CEP deve estar no formato 00000-000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configurações da Clínica
        </h2>
        <p className="text-gray-600">
          Informações sobre sua clínica ou local de atendimento.
        </p>
      </div>

      <div className="space-y-6">
        {/* Nome da Clínica */}
        <div>
          <label htmlFor="nomeClinica" className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Clínica/Consultório *
          </label>
          <input
            type="text"
            id="nomeClinica"
            value={formData.nomeClinica}
            onChange={(e) => updateFormData({ nomeClinica: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.nomeClinica ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ex: Clínica NutriVida"
          />
          {errors.nomeClinica && (
            <p className="mt-1 text-sm text-red-600">{errors.nomeClinica}</p>
          )}
        </div>

        {/* Endereço */}
        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
            Endereço Completo *
          </label>
          <input
            type="text"
            id="endereco"
            value={formData.endereco}
            onChange={(e) => updateFormData({ endereco: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.endereco ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Rua, número, complemento"
          />
          {errors.endereco && (
            <p className="mt-1 text-sm text-red-600">{errors.endereco}</p>
          )}
        </div>

        {/* Cidade e Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
              Cidade *
            </label>
            <input
              type="text"
              id="cidade"
              value={formData.cidade}
              onChange={(e) => updateFormData({ cidade: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
                errors.cidade ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nome da cidade"
            />
            {errors.cidade && (
              <p className="mt-1 text-sm text-red-600">{errors.cidade}</p>
            )}
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              id="estado"
              value={formData.estado}
              onChange={(e) => updateFormData({ estado: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
                errors.estado ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione o estado</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
            )}
          </div>
        </div>

        {/* CEP */}
        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
            CEP *
          </label>
          <input
            type="text"
            id="cep"
            value={formData.cep}
            onChange={(e) => {
              const formatted = formatCEP(e.target.value);
              updateFormData({ cep: formatted });
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.cep ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="00000-000"
            maxLength={9}
          />
          {errors.cep && (
            <p className="mt-1 text-sm text-red-600">{errors.cep}</p>
          )}
        </div>

        {/* Informações Adicionais */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-900">
                Quase lá!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Essas informações serão usadas para gerar documentos e relatórios personalizados para sua clínica.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        
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