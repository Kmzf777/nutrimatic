export interface Prescricao {
  id: string;
  identificacao: string; // UUID do nutricionista
  cliente_id?: string; // UUID do cliente
  nome_cliente?: string; // Para compatibilidade com código antigo
  nome?: string; // Campo real no banco de dados
  data: string;
  json: any;
  url: string;
  status: 'Pendente' | 'Aprovada' | 'Aprovado' | 'Refazendo';
  // Dados do cliente relacionado
  cliente?: {
    id: string;
    nome?: string | null;
    numero: string;
    status: string;
  };
}

export interface PrescricaoFormData {
  nome_cliente: string;
  observacoes?: string;
}