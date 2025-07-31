export interface SetupFormData {
  // Dados pessoais
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  
  // Dados profissionais
  especialidade: string;
  registro: string;
  experiencia: string;
  
  // Configurações da conta
  nomeClinica: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  
  // Preferências
  idioma: string;
  fusoHorario: string;
  notificacoes: boolean;
}

export interface SetupStepProps {
  formData: SetupFormData;
  updateFormData: (data: Partial<SetupFormData>) => void;
  onNext: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
} 