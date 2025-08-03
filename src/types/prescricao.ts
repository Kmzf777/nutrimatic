export interface Prescricao {
  id: string;
  identificacao: string; // UUID do nutricionista
  nome_cliente: string;
  data: string;
  json: any;
  url: string;
  status: 'Pendente' | 'Aprovada' | 'Refazendo';
}

export interface PrescricaoFormData {
  nome_cliente: string;
  observacoes?: string;
} 