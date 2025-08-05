-- ========================================
-- PARTE 2: CRIAR TABELAS
-- Execute após a Parte 1
-- ========================================

-- Criar tabela nutricionistas
CREATE TABLE nutricionistas (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  regras TEXT,
  presc_geradas INTEGER DEFAULT 0,
  presc_max INTEGER DEFAULT 100,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  setup_completed BOOLEAN DEFAULT FALSE
);

-- Índices para nutricionistas
CREATE INDEX idx_nutricionistas_email ON nutricionistas(email);
CREATE INDEX idx_nutricionistas_active ON nutricionistas(active);
CREATE INDEX idx_nutricionistas_created_at ON nutricionistas(created_at);

-- Criar tabela prescricoes
CREATE TABLE prescricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificacao UUID NOT NULL REFERENCES nutricionistas(id) ON DELETE CASCADE,
  nome_cliente TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  json JSONB,
  url TEXT,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovada', 'Refazendo')),
  n8n_workflow_id TEXT,
  n8n_execution_id TEXT,
  external_ref TEXT,
  source TEXT DEFAULT 'n8n',
  client_data JSONB,
  observacoes TEXT
);

-- Verificar criação
SELECT 'Tabelas criadas!' as status;