import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função para combinar classes CSS com Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função utilitária para criar slug a partir de texto
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-'); // Substitui espaços por hífens
}

// Função para reverter slug em texto legível (se necessário)
export function slugToText(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Função para validar se um slug é válido
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

// Função para obter o nome do cliente de uma prescrição (compatibilidade com diferentes schemas)
export function getNomeCliente(prescricao: any): string {
  if (!prescricao) return 'Nome não informado';
  
  // Prioridade 1: Dados do cliente relacionado (novo sistema com JOIN)
  if (prescricao.cliente && prescricao.cliente.nome && prescricao.cliente.nome.trim() !== '') {
    return prescricao.cliente.nome;
  }
  
  // Prioridade 2: Campo nome_cliente (compatibilidade)
  if (prescricao.nome_cliente && prescricao.nome_cliente.trim() !== '') {
    return prescricao.nome_cliente;
  }
  
  // Prioridade 3: Campo nome (compatibilidade)
  if (prescricao.nome && prescricao.nome.trim() !== '') {
    return prescricao.nome;
  }
  
  // Fallback: usar o ID da prescrição
  if (prescricao.id) {
    return `Cliente ${prescricao.id.slice(0, 8)}`;
  }
  
  return 'Nome não informado';
}

// Função para obter informações completas do cliente
export function getClienteInfo(prescricao: any) {
  if (!prescricao) return null;
  
  // Se temos dados do cliente relacionado
  if (prescricao.cliente) {
    return {
      id: prescricao.cliente.id,
      nome: prescricao.cliente.nome || 'Nome não informado',
      numero: prescricao.cliente.numero || '',
      status: prescricao.cliente.status || 'Desconhecido'
    };
  }
  
  // Fallback para compatibilidade
  return {
    id: prescricao.cliente_id || null,
    nome: getNomeCliente(prescricao),
    numero: '',
    status: 'Desconhecido'
  };
}