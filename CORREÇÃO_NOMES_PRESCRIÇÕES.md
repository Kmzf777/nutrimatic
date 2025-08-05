# Correção: Nomes das Prescrições na Dashboard

## Problema Identificado
Na home page da dashboard, os nomes das prescrições não estavam aparecendo na seção "Prescrições Recentes".

## Causas Identificadas
1. **Inconsistência na estrutura de dados**: O campo `nome_cliente` pode estar vazio ou nulo em algumas prescrições
2. **Falta de fallback**: Não havia uma função robusta para lidar com casos onde o nome não está disponível
3. **Consultas SQL não específicas**: As consultas estavam usando `SELECT *` em vez de campos específicos

## Correções Implementadas

### 1. Melhorada a função `getNomeCliente` em `src/lib/utils.ts`
```typescript
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
```

### 2. Atualizada a exibição na Dashboard (`src/app/dashboard/page.tsx`)
- Importada a função `getNomeCliente`
- Substituída a exibição direta de `prescription.nome_cliente` por `getNomeCliente(prescription)`

### 3. Melhoradas as consultas SQL no hook `usePrescriptions.ts`
- Substituídas todas as consultas `SELECT *` por consultas específicas incluindo `nome_cliente`
- Adicionado campo `nome` como fallback na interface TypeScript

### 4. Scripts SQL criados para correção de dados
- `test-prescription-data.sql`: Para inserir dados de teste
- `fix-prescription-names.sql`: Para corrigir prescrições sem nome_cliente
- `verify-prescription-data.sql`: Para verificar a integridade dos dados

## Como Aplicar as Correções

### 1. Execute os scripts SQL no Supabase:
```sql
-- Primeiro, verifique os dados existentes
-- Execute o script verify-prescription-data.sql

-- Depois, corrija prescrições sem nome_cliente
-- Execute o script fix-prescription-names.sql

-- Por fim, insira dados de teste se necessário
-- Execute o script test-prescription-data.sql (substitua SEU_USER_ID_AQUI)
```

### 2. As correções no código já foram aplicadas:
- ✅ Função `getNomeCliente` melhorada
- ✅ Dashboard atualizada para usar a função
- ✅ Consultas SQL otimizadas
- ✅ Interface TypeScript atualizada

## Resultado Esperado
Agora a seção "Prescrições Recentes" na dashboard deve exibir:
- Nomes dos clientes quando disponíveis
- "Cliente [ID]" quando o nome não está disponível
- "Nome não informado" como último fallback

## Verificação
Para verificar se a correção funcionou:
1. Acesse a dashboard
2. Verifique a seção "Prescrições Recentes"
3. Os nomes dos clientes devem aparecer corretamente
4. Se não houver prescrições, execute os scripts SQL de teste 