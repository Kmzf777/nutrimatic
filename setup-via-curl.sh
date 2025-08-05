#!/bin/bash

# ALTERNATIVA: Setup via API REST do Supabase
# Substitua YOUR_SERVICE_ROLE_KEY pela service_role key do seu projeto

SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
PROJECT_URL="https://rdlmvcvwrofufvlmldlv.supabase.co"

echo "🔧 Executando setup via API REST..."

# 1. Limpeza
curl -X POST "${PROJECT_URL}/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"sql": "DROP TABLE IF EXISTS prescricoes CASCADE; DROP TABLE IF EXISTS nutricionistas CASCADE;"}'

echo "✅ Limpeza concluída"

# 2. Criar nutricionistas
curl -X POST "${PROJECT_URL}/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"sql": "CREATE TABLE nutricionistas (id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, nome TEXT NOT NULL, telefone TEXT NOT NULL, email TEXT NOT NULL UNIQUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), active BOOLEAN DEFAULT TRUE, regras TEXT, presc_geradas INTEGER DEFAULT 0, presc_max INTEGER DEFAULT 100);"}'

echo "✅ Tabela nutricionistas criada"

# Continue com os outros comandos...
echo "📋 Execute os comandos restantes manualmente ou continue este script"