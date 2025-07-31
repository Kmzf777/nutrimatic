'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SetupLayout from '../../components/setup/SetupLayout';
import SetupStep1 from '../../components/setup/SetupStep1';
import SetupStep2 from '../../components/setup/SetupStep2';
import SetupStep3 from '../../components/setup/SetupStep3';
import SetupStep4 from '../../components/setup/SetupStep4';
import { SetupFormData } from '../../types/setup';

const initialFormData: SetupFormData = {
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  especialidade: '',
  registro: '',
  experiencia: '',
  nomeClinica: '',
  endereco: '',
  cidade: '',
  estado: '',
  cep: '',
  idioma: 'pt-BR',
  fusoHorario: 'America/Sao_Paulo',
  notificacoes: true,
};

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SetupFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const totalSteps = 4;

  const updateFormData = (data: Partial<SetupFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Aqui você implementará a lógica para salvar os dados
      console.log('Dados do formulário:', formData);
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirecionar para o dashboard após conclusão
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SetupStep1
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <SetupStep2
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <SetupStep3
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <SetupStep4
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SetupLayout currentStep={currentStep} totalSteps={totalSteps}>
      {renderCurrentStep()}
    </SetupLayout>
  );
} 