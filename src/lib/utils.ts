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