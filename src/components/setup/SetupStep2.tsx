'use client';

import { useState } from 'react';
import { SetupFormData } from '../../types/setup';

interface SetupStep2Props {
  formData: SetupFormData;
  updateFormData: (data: Partial<SetupFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function SetupStep2({ formData, updateFormData, onNext, onPrev }: SetupStep2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const especialidades = [
    'Nutrição Clínica',
    'Nutrição Esportiva',
    'Nutrição Materno-Infantil',
    'Nutrição Funcional',
    'Nutrição Hospitalar',
    'Nutrição Geriátrica',
    'Nutrição Comportamental',
    'Outra'
  ];

  const experiencias = [
    'Menos de 1 ano',
    '1-3 anos',
    '3-5 anos',
    '5-10 anos',
    'Mais de 10 anos'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.especialidade.trim()) {
      newErrors.especialidade = 'Especialidade é obrigatória';
    }

    if (!formData.registro.trim()) {
      newErrors.registro = 'Número de registro é obrigatório';
    }

    if (!formData.experiencia.trim()) {
      newErrors.experiencia = 'Tempo de experiência é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dados Profissionais
        </h2>
        <p className="text-gray-600">
          Conte-nos sobre sua formação e experiência profissional.
        </p>
      </div>

      <div className="space-y-6">
        {/* Especialidade */}
        <div>
          <label htmlFor="especialidade" className="block text-sm font-medium text-gray-700 mb-2">
            Especialidade Principal *
          </label>
          <select
            id="especialidade"
            value={formData.especialidade}
            onChange={(e) => updateFormData({ especialidade: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.especialidade ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione sua especialidade</option>
            {especialidades.map((especialidade) => (
              <option key={especialidade} value={especialidade}>
                {especialidade}
              </option>
            ))}
          </select>
          {errors.especialidade && (
            <p className="mt-1 text-sm text-red-600">{errors.especialidade}</p>
          )}
        </div>

        {/* Número de Registro */}
        <div>
          <label htmlFor="registro" className="block text-sm font-medium text-gray-700 mb-2">
            Número de Registro Profissional *
          </label>
          <input
            type="text"
            id="registro"
            value={formData.registro}
            onChange={(e) => updateFormData({ registro: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.registro ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ex: CRN-3 12345"
          />
          <p className="mt-1 text-sm text-gray-500">
            Digite seu número de registro no Conselho Regional de Nutrição
          </p>
          {errors.registro && (
            <p className="mt-1 text-sm text-red-600">{errors.registro}</p>
          )}
        </div>

        {/* Tempo de Experiência */}
        <div>
          <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-2">
            Tempo de Experiência Profissional *
          </label>
          <select
            id="experiencia"
            value={formData.experiencia}
            onChange={(e) => updateFormData({ experiencia: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
              errors.experiencia ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione o tempo de experiência</option>
            {experiencias.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
          {errors.experiencia && (
            <p className="mt-1 text-sm text-red-600">{errors.experiencia}</p>
          )}
        </div>

        {/* Informações Adicionais */}
        <div className="bg-nutrimatic-50 border border-nutrimatic-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-nutrimatic-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-nutrimatic-900">
                Por que precisamos dessas informações?
              </h3>
              <p className="text-sm text-nutrimatic-700 mt-1">
                Essas informações nos ajudam a personalizar sua experiência e oferecer recursos específicos para sua área de atuação.
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