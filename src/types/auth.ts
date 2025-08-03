export interface Nutricionista {
  id: string; // UUID
  nome: string;
  telefone: string;
  email: string;
  created_at: string;
  active: boolean;
  regras: string | null;
  presc_geradas: number;
  presc_max: number;
}

export interface RegisterFormData {
  nome: string;
  telefone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
} 