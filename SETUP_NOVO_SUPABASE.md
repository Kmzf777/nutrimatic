# 🔧 Setup Novo Supabase - Nutrimatic

## ✅ Projeto Recriado do Zero para Resolver Bugs do N8N

### 📋 Resumo da Mudança
O projeto Supabase foi completamente recriado para resolver os problemas de integração com N8N:
- ❌ **Problema anterior**: `get_row` retornava valores desconexos ou null
- ✅ **Solução**: Nova estrutura otimizada com bypass de RLS para N8N

---

## 🚀 Setup Rápido (5 minutos)

### 1️⃣ Configurar Variáveis de Ambiente
Crie o arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration - NOVO PROJETO
NEXT_PUBLIC_SUPABASE_URL=https://rdlmvcvwrofufvlmldlv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbG12Y3Z3cm9mdWZ2bG1sZGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjQzMjQsImV4cCI6MjA2OTkwMDMyNH0.1TpCyIdb4eBHqL2mFCg6MgbGv__zXP67r6euUrrfakE

NODE_ENV=development
```

### 2️⃣ Executar Script SQL
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo do arquivo `setup-supabase-completo.sql`
4. Execute também o `teste-integracao.sql` para verificar se tudo funcionou

### 3️⃣ Testar o Frontend
```bash
npm run dev
```

### 4️⃣ Configurar N8N
Consulte o arquivo `CONFIGURACAO_N8N.md` para configuração completa do N8N.

---

## 📂 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `setup-supabase-completo.sql` | Script principal - execute no Supabase |
| `teste-integracao.sql` | Testes para verificar se funcionou |
| `CONFIGURACAO_N8N.md` | Guia completo para configurar N8N |
| `.env.local` | Variáveis de ambiente (criar manualmente) |

---

## 🎯 Principais Melhorias

### ✅ Para o N8N:
- **Service Role bypass**: N8N usa service_role key que bypassa RLS
- **Índices otimizados**: Consultas muito mais rápidas
- **Campos específicos**: `external_ref`, `source`, `client_data`
- **Estrutura padronizada**: JSON bem definido para prescrições

### ✅ Para o Frontend:
- **Compatibilidade total**: Funciona com a estrutura anterior
- **Performance melhorada**: Novos índices aceleram consultas
- **Novos campos**: Mais dados disponíveis para relatórios

### ✅ Geral:
- **RLS otimizado**: Segurança mantida sem impactar N8N
- **Triggers robustos**: Criação automática de perfis
- **Timestamps automáticos**: `updated_at` atualizado automaticamente

---

## 🔍 Verificação do Setup

### ✅ Frontend funcionando?
1. Acesse `http://localhost:3000/register`
2. Crie uma conta de teste
3. Verifique se aparece no dashboard

### ✅ N8N funcionando?
1. Use os exemplos do `CONFIGURACAO_N8N.md`
2. Teste com cURL primeiro
3. Implemente no N8N depois

### ✅ Tudo conectado?
1. Crie prescrição via N8N
2. Verifique se aparece no frontend
3. Aprove/rejeite no frontend
4. Verifique mudança de status

---

## 🆘 Troubleshooting

### ❌ Erro "Row Level Security"
- **Solução**: No N8N, use service_role key (não anon key)

### ❌ Frontend não carrega dados
- **Solução**: Verifique se as variáveis `.env.local` estão corretas

### ❌ N8N retorna null
- **Solução**: Use filtros corretos com `eq.` prefix

### ❌ Script SQL falhou
- **Solução**: Execute cada seção separadamente

---

## 📞 Próximos Passos

1. **Execute o setup** seguindo este guia
2. **Teste o frontend** criando uma conta
3. **Configure o N8N** usando o guia específico
4. **Teste integração completa** frontend ↔ N8N
5. **Monitore logs** do Supabase para identificar problemas

---

## 🎉 Resultado Final

Com este setup você terá:
- ✅ Frontend funcionando normalmente
- ✅ N8N inserindo prescrições sem erros
- ✅ Consultas rápidas e confiáveis
- ✅ Estrutura escalável e robusta

**O problema do `get_row` retornando null está resolvido!** 🚀