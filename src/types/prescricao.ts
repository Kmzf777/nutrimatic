export interface Prescricao {
  id: string;
  identificacao: string; // UUID do nutricionista
  nome_cliente?: string; // Para compatibilidade com código antigo
  nome?: string; // Campo real no banco de dados
  data: string;
  json: any;
  url: string;
  status: 'Pendente' | 'Aprovada' | 'Aprovado' | 'Refazendo';
}

export interface PrescricaoFormData {
  nome_cliente: string;
  observacoes?: string;
} 