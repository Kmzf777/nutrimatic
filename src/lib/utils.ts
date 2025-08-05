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
  
  // Verificar se o campo nome_cliente existe e não está vazio
  if (prescricao.nome_cliente && prescricao.nome_cliente.trim() !== '') {
    return prescricao.nome_cliente;
  }
  
  // Verificar se o campo nome existe e não está vazio
  if (prescricao.nome && prescricao.nome.trim() !== '') {
    return prescricao.nome;
  }
  
  // Se não houver nome, usar o ID da prescrição
  if (prescricao.id) {
    return `Cliente ${prescricao.id.slice(0, 8)}`;
  }
  
  return 'Nome não informado';
}