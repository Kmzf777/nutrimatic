# Configuração N8N - Nutrimatic
## Setup completo para integração com Supabase

### 🎯 Objetivo
Este guia garante que o N8N funcione perfeitamente com o novo projeto Supabase, sem os problemas de `get_row` que estavam ocorrendo.

---

## 📋 1. Credenciais do Supabase

### Project Info:
- **Project URL**: `https://rdlmvcvwrofufvlmldlv.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbG12Y3Z3cm9mdWZ2bG1sZGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjQzMjQsImV4cCI6MjA2OTkwMDMyNH0.1TpCyIdb4eBHqL2mFCg6MgbGv__zXP67r6euUrrfakE`

### ⚠️ Para N8N - USE A SERVICE_ROLE KEY
```
Para operações de inserção e consulta no N8N, você DEVE usar a SERVICE_ROLE KEY, 
não a anon key. A service_role bypassa RLS automaticamente.

A service_role key você encontra em:
Supabase Dashboard > Settings > API > service_role key
```

---

## 🔧 2. Configuração no N8N

### Base URL para todas as operações:
```
https://rdlmvcvwrofufvlmldlv.supabase.co/rest/v1/
```

### Headers obrigatórios:
```json
{
  "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY",
  "apikey": "YOUR_SERVICE_ROLE_KEY",
  "Content-Type": "application/json",
  "Prefer": "return=representation"
}
```

---

## 📝 3. Operações Principais

### 3.1 Inserir Nova Prescrição
```http
POST /rest/v1/prescricoes
Content-Type: application/json
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
apikey: YOUR_SERVICE_ROLE_KEY

{
  "identificacao": "uuid-do-nutricionista",
  "nome_cliente": "Nome do Cliente",
  "json": {
    "refeicoes": ["Café da manhã", "Almoço", "Jantar"],
    "objetivo": "Emagrecimento",
    "restricoes": ["Lactose"],
    "observacoes": "Cliente vegetariano"
  },
  "external_ref": "whatsapp_123456",
  "source": "n8n",
  "client_data": {
    "idade": 32,
    "peso": 68,
    "altura": 165,
    "objetivo": "perder 5kg",
    "telefone": "+5511999999999"
  },
  "observacoes": "Primeira consulta - cliente motivado"
}
```

### 3.2 Buscar Prescrições por Nutricionista
```http
GET /rest/v1/prescricoes?identificacao=eq.UUID_DO_NUTRICIONISTA&order=data.desc
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
apikey: YOUR_SERVICE_ROLE_KEY
```

### 3.3 Buscar Prescrição por ID
```http
GET /rest/v1/prescricoes?id=eq.UUID_DA_PRESCRICAO
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
apikey: YOUR_SERVICE_ROLE_KEY
```

### 3.4 Buscar por Referência Externa (ex: WhatsApp)
```http
GET /rest/v1/prescricoes?external_ref=eq.whatsapp_123456
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
apikey: YOUR_SERVICE_ROLE_KEY
```

### 3.5 Atualizar Status da Prescrição
```http
PATCH /rest/v1/prescricoes?id=eq.UUID_DA_PRESCRICAO
Content-Type: application/json
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
apikey: YOUR_SERVICE_ROLE_KEY

{
  "status": "Aprovada"
}
```

### 3.6 Buscar Nutricionista por Email
```http
GET /rest/v1/nutricionistas?email=eq.email@exemplo.com
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
apikey: YOUR_SERVICE_ROLE_KEY
```

---

## 🎯 4. Workflow Recomendado no N8N

### Fluxo Típico:
1. **Receber dados do cliente** (webhook, WhatsApp, etc)
2. **Buscar nutricionista** pelo email ou outro identificador
3. **Criar prescrição** com os dados do cliente
4. **Notificar nutricionista** (email, WhatsApp, etc)
5. **Aguardar aprovação** via webhook ou polling
6. **Entregar prescrição** ao cliente

### Exemplo de Node Setup:

#### Node 1: HTTP Request - Buscar Nutricionista
```json
{
  "method": "GET",
  "url": "https://rdlmvcvwrofufvlmldlv.supabase.co/rest/v1/nutricionistas",
  "qs": {
    "email": "eq.{{ $json.nutricionista_email }}"
  },
  "headers": {
    "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY",
    "apikey": "YOUR_SERVICE_ROLE_KEY"
  }
}
```

#### Node 2: HTTP Request - Criar Prescrição
```json
{
  "method": "POST",
  "url": "https://rdlmvcvwrofufvlmldlv.supabase.co/rest/v1/prescricoes",
  "headers": {
    "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY",
    "apikey": "YOUR_SERVICE_ROLE_KEY",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  "body": {
    "identificacao": "{{ $('Buscar Nutricionista').first().json[0].id }}",
    "nome_cliente": "{{ $json.nome_cliente }}",
    "external_ref": "{{ $json.chat_id }}",
    "source": "n8n",
    "client_data": {
      "idade": "{{ $json.idade }}",
      "peso": "{{ $json.peso }}",
      "altura": "{{ $json.altura }}",
      "objetivo": "{{ $json.objetivo }}"
    },
    "json": {
      "objetivo": "{{ $json.objetivo }}",
      "restricoes": "{{ $json.restricoes }}",
      "observacoes": "{{ $json.observacoes }}"
    }
  }
}
```

---

## 🔍 5. Debugging e Troubleshooting

### 5.1 Verificar se a prescrição foi criada:
```http
GET /rest/v1/prescricoes?external_ref=eq.SEU_EXTERNAL_REF
```

### 5.2 Listar todas as prescrições (para debug):
```http
GET /rest/v1/prescricoes?order=data.desc&limit=10
```

### 5.3 Verificar estrutura da tabela:
```http
OPTIONS /rest/v1/prescricoes
```

### 5.4 Problemas Comuns:

**❌ Erro: Row Level Security**
- **Solução**: Use a SERVICE_ROLE key, não a anon key

**❌ Erro: "null value in column"**
- **Solução**: Verifique se todos os campos obrigatórios estão sendo enviados

**❌ Erro: "foreign key constraint"**
- **Solução**: Verifique se o UUID do nutricionista existe e está correto

**❌ get_row retorna null**
- **Solução**: Use filtros corretos com `eq.` prefix e service_role key

---

## 📊 6. Campos Importantes

### Tabela `nutricionistas`:
- `id` (UUID) - Primary Key, linked to auth.users
- `email` (TEXT) - Unique, use for lookups
- `nome` (TEXT) - Nome do nutricionista
- `active` (BOOLEAN) - Se está ativo

### Tabela `prescricoes`:
- `id` (UUID) - Primary Key auto-generated
- `identificacao` (UUID) - Foreign Key to nutricionistas.id
- `nome_cliente` (TEXT) - Nome do cliente
- `status` (TEXT) - 'Pendente', 'Aprovada', 'Refazendo'
- `external_ref` (TEXT) - Para referência externa (WhatsApp ID, etc)
- `json` (JSONB) - Dados da prescrição
- `client_data` (JSONB) - Dados do cliente
- `data` (TIMESTAMP) - Data de criação
- `source` (TEXT) - Origem ('n8n', 'manual', etc)

---

## ✅ 7. Checklist de Configuração

- [ ] Executar o script `setup-supabase-completo.sql` no Supabase
- [ ] Obter a SERVICE_ROLE key do Supabase Dashboard
- [ ] Configurar headers corretos no N8N
- [ ] Testar inserção de prescrição
- [ ] Testar busca de prescrição
- [ ] Testar workflow completo
- [ ] Verificar se RLS não está bloqueando operações

---

## 🚀 8. Exemplo Completo de Teste

### Teste manual via cURL:

```bash
# 1. Buscar nutricionista
curl -X GET \
  "https://rdlmvcvwrofufvlmldlv.supabase.co/rest/v1/nutricionistas?email=eq.SEU_EMAIL" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY"

# 2. Criar prescrição (substitua o UUID)
curl -X POST \
  "https://rdlmvcvwrofufvlmldlv.supabase.co/rest/v1/prescricoes" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "identificacao": "UUID_DO_NUTRICIONISTA",
    "nome_cliente": "Teste N8N",
    "external_ref": "test_123",
    "source": "n8n",
    "json": {"objetivo": "teste"}
  }'

# 3. Buscar prescrição criada
curl -X GET \
  "https://rdlmvcvwrofufvlmldlv.supabase.co/rest/v1/prescricoes?external_ref=eq.test_123" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY"
```

---

## 📞 Suporte

Se ainda houver problemas:
1. Verifique os logs do Supabase Dashboard
2. Confirme que está usando SERVICE_ROLE key
3. Verifique se o script SQL foi executado completamente
4. Teste as operações manualmente antes do N8N

**Estrutura otimizada para N8N com bypass de RLS e índices otimizados! 🎉**