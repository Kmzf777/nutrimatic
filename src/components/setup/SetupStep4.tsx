'use client';

import { useState } from 'react';
import { SetupFormData } from '../../types/setup';

interface SetupStep4Props {
  formData: SetupFormData;
  updateFormData: (data: Partial<SetupFormData>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export default function SetupStep4({ formData, updateFormData, onSubmit, onPrev, isLoading }: SetupStep4Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const idiomas = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' }
  ];

  const fusosHorarios = [
    { value: 'America/Sao_Paulo', label: 'Brasília (UTC-3)' },
    { value: 'America/Manaus', label: 'Manaus (UTC-4)' },
    { value: 'America/Belem', label: 'Belém (UTC-3)' },
    { value: 'America/Fortaleza', label: 'Fortaleza (UTC-3)' },
    { value: 'America/Recife', label: 'Recife (UTC-3)' },
    { value: 'America/Noronha', label: 'Fernando de Noronha (UTC-2)' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.idioma.trim()) {
      newErrors.idioma = 'Idioma é obrigatório';
    }

    if (!formData.fusoHorario.trim()) {
      newErrors.fusoHorario = 'Fuso horário é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Preferências e Configurações Finais
        </h2>
        <p className="text-gray-600">
          Últimas configurações para personalizar sua experiência.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações */}
        <div className="space-y-6">
          {/* Idioma */}
          <div>
            <label htmlFor="idioma" className="block text-sm font-medium text-gray-700 mb-2">
              Idioma Preferido *
            </label>
            <select
              id="idioma"
              value={formData.idioma}
              onChange={(e) => updateFormData({ idioma: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
                errors.idioma ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione o idioma</option>
              {idiomas.map((idioma) => (
                <option key={idioma.value} value={idioma.value}>
                  {idioma.label}
                </option>
              ))}
            </select>
            {errors.idioma && (
              <p className="mt-1 text-sm text-red-600">{errors.idioma}</p>
            )}
          </div>

          {/* Fuso Horário */}
          <div>
            <label htmlFor="fusoHorario" className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário *
            </label>
            <select
              id="fusoHorario"
              value={formData.fusoHorario}
              onChange={(e) => updateFormData({ fusoHorario: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-colors ${
                errors.fusoHorario ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione o fuso horário</option>
              {fusosHorarios.map((fuso) => (
                <option key={fuso.value} value={fuso.value}>
                  {fuso.label}
                </option>
              ))}
            </select>
            {errors.fusoHorario && (
              <p className="mt-1 text-sm text-red-600">{errors.fusoHorario}</p>
            )}
          </div>

          {/* Notificações */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.notificacoes}
                onChange={(e) => updateFormData({ notificacoes: e.target.checked })}
                className="w-4 h-4 text-nutrimatic-600 border-gray-300 rounded focus:ring-nutrimatic-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Receber notificações por email
              </span>
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Receba atualizações sobre novas funcionalidades e dicas de uso.
            </p>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo da Configuração
          </h3>
          
          <div className="space-y-4">
            {/* Dados Pessoais */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Dados Pessoais</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Nome:</strong> {formData.nome || 'Não informado'}</p>
                <p><strong>Email:</strong> {formData.email || 'Não informado'}</p>
                <p><strong>Telefone:</strong> {formData.telefone || 'Não informado'}</p>
              </div>
            </div>

            {/* Dados Profissionais */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Dados Profissionais</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Especialidade:</strong> {formData.especialidade || 'Não informado'}</p>
                <p><strong>Registro:</strong> {formData.registro || 'Não informado'}</p>
                <p><strong>Experiência:</strong> {formData.experiencia || 'Não informado'}</p>
              </div>
            </div>

            {/* Clínica */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Clínica</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Nome:</strong> {formData.nomeClinica || 'Não informado'}</p>
                <p><strong>Localização:</strong> {formData.cidade && formData.estado ? `${formData.cidade}, ${formData.estado}` : 'Não informado'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Finais */}
      <div className="mt-8 bg-nutrimatic-50 border border-nutrimatic-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-nutrimatic-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-nutrimatic-900">
              Configuração Concluída!
            </h3>
            <p className="text-sm text-nutrimatic-700 mt-1">
              Após finalizar, você será redirecionado para o dashboard onde poderá começar a usar todas as funcionalidades do Nutrimatic.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-3 bg-nutrimatic-600 text-white font-medium rounded-lg hover:bg-nutrimatic-700 focus:ring-4 focus:ring-nutrimatic-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finalizando...
            </>
          ) : (
            <>
              Finalizar Configuração
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
} 