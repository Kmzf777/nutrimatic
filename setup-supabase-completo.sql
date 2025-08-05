-- ========================================
-- SETUP COMPLETO SUPABASE - NUTRIMATIC
-- Script otimizado para funcionar com n8n
-- ========================================

-- **IMPORTANTE**: Execute este script no SQL Editor do Supabase
-- Project URL: https://rdlmvcvwrofufvlmldlv.supabase.co

-- ========================================
-- 1. LIMPEZA COMPLETA (REMOVER TUDO)
-- ========================================

-- Remover tabelas se existirem
DROP TABLE IF EXISTS prescricoes CASCADE;
DROP TABLE IF EXISTS nutricionistas CASCADE;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON nutricionistas;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON nutricionistas;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON nutricionistas;
DROP POLICY IF EXISTS "Nutricionistas podem ver suas prescrições" ON prescricoes;
DROP POLICY IF EXISTS "Nutricionistas podem atualizar suas prescrições" ON prescricoes;
DROP POLICY IF EXISTS "Permitir inserção de prescrições" ON prescricoes;
DROP POLICY IF EXISTS "Permitir leitura via service_role" ON prescricoes;
DROP POLICY IF EXISTS "Permitir escrita via service_role" ON prescricoes;

-- Remover triggers e funções
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ========================================
-- 2. CRIAR TABELA NUTRICIONISTAS
-- ========================================

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
  
  -- Campos adicionais para melhor controle
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  setup_completed BOOLEAN DEFAULT FALSE
);

-- Índices para performance
CREATE INDEX idx_nutricionistas_email ON nutricionistas(email);
CREATE INDEX idx_nutricionistas_active ON nutricionistas(active);
CREATE INDEX idx_nutricionistas_created_at ON nutricionistas(created_at);

-- ========================================
-- 3. CRIAR TABELA PRESCRICOES (OTIMIZADA PARA N8N)
-- ========================================

CREATE TABLE prescricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificacao UUID NOT NULL REFERENCES nutricionistas(id) ON DELETE CASCADE,
  nome_cliente TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Dados da prescrição
  json JSONB,
  url TEXT,
  
  -- Status controlado
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovada', 'Refazendo')),
  
  -- Campos para integração N8N
  n8n_workflow_id TEXT,
  n8n_execution_id TEXT,
  external_ref TEXT, -- Para referência externa (ex: ID do WhatsApp, etc)
  
  -- Metadados úteis
  source TEXT DEFAULT 'n8n', -- origem da prescrição
  client_data JSONB, -- dados do cliente (idade, peso, etc)
  observacoes TEXT -- observações do nutricionista
);

-- Índices críticos para N8N performance
CREATE INDEX idx_prescricoes_identificacao ON prescricoes(identificacao);
CREATE INDEX idx_prescricoes_status ON prescricoes(status);
CREATE INDEX idx_prescricoes_data ON prescricoes(data DESC);
CREATE INDEX idx_prescricoes_external_ref ON prescricoes(external_ref);
CREATE INDEX idx_prescricoes_n8n_workflow ON prescricoes(n8n_workflow_id);
CREATE INDEX idx_prescricoes_source ON prescricoes(source);

-- Índice composto para consultas comuns do N8N
CREATE INDEX idx_prescricoes_identificacao_status ON prescricoes(identificacao, status);
CREATE INDEX idx_prescricoes_status_data ON prescricoes(status, data DESC);

-- ========================================
-- 4. HABILITAR RLS (ROW LEVEL SECURITY)
-- ========================================

ALTER TABLE nutricionistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescricoes ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. POLÍTICAS RLS PARA NUTRICIONISTAS
-- ========================================

-- Usuários autenticados podem ver seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados" ON nutricionistas
  FOR SELECT USING (auth.uid() = id);

-- Usuários autenticados podem inserir seus próprios dados
CREATE POLICY "Usuários podem inserir seus próprios dados" ON nutricionistas
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Usuários autenticados podem atualizar seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON nutricionistas
  FOR UPDATE USING (auth.uid() = id);

-- ========================================
-- 6. POLÍTICAS RLS PARA PRESCRICOES (OTIMIZADAS PARA N8N)
-- ========================================

-- Nutricionistas podem ver apenas suas prescrições
CREATE POLICY "Nutricionistas podem ver suas prescrições" ON prescricoes
  FOR SELECT USING (auth.uid() = identificacao);

-- Nutricionistas podem atualizar apenas suas prescrições
CREATE POLICY "Nutricionistas podem atualizar suas prescrições" ON prescricoes
  FOR UPDATE USING (auth.uid() = identificacao);

-- CRÍTICO: Política ampla para inserção (para N8N)
-- N8N usará service_role que bypassa RLS, mas mantemos esta política como fallback
CREATE POLICY "Permitir inserção de prescrições" ON prescricoes
  FOR INSERT WITH CHECK (true);

-- Política para deletar (apenas o dono)
CREATE POLICY "Nutricionistas podem deletar suas prescrições" ON prescricoes
  FOR DELETE USING (auth.uid() = identificacao);

-- ========================================
-- 7. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Extrair dados dos metadados ou usar defaults
  INSERT INTO public.nutricionistas (
    id, 
    nome, 
    telefone, 
    email,
    created_at
  ) VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'), 
    COALESCE(NEW.raw_user_meta_data->>'telefone', ''), 
    NEW.email,
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro (aparecerá nos logs do Supabase)
    RAISE LOG 'Erro ao criar perfil do nutricionista: %', SQLERRM;
    -- Retornar NEW mesmo com erro para não quebrar o cadastro do auth
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 8. TRIGGER PARA CRIAÇÃO AUTOMÁTICA DE PERFIL
-- ========================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 9. FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- ========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para nutricionistas
CREATE TRIGGER update_nutricionistas_updated_at
  BEFORE UPDATE ON nutricionistas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para prescricoes
CREATE TRIGGER update_prescricoes_updated_at
  BEFORE UPDATE ON prescricoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 10. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Descomente as linhas abaixo se quiser dados de teste
-- IMPORTANTE: Só funciona se você já tiver usuários criados

/*
-- Exemplo de prescrições de teste
INSERT INTO prescricoes (identificacao, nome_cliente, status, json, external_ref, source, client_data, observacoes) VALUES
(
  '00000000-0000-0000-0000-000000000000', -- Substitua pelo ID real de um usuário
  'Ana Paula Silva', 
  'Pendente', 
  '{"refeicoes": ["Café da manhã", "Almoço", "Jantar"], "objetivo": "Emagrecimento"}',
  'whatsapp_123456',
  'n8n',
  '{"idade": 32, "peso": 68, "altura": 165, "objetivo": "perder 5kg"}',
  'Primeira consulta'
),
(
  '00000000-0000-0000-0000-000000000000', -- Substitua pelo ID real de um usuário
  'Carlos Eduardo Santos', 
  'Aprovada', 
  '{"refeicoes": ["Café da manhã", "Lanche", "Almoço", "Lanche", "Jantar"], "objetivo": "Ganho de massa"}',
  'whatsapp_789012',
  'n8n',
  '{"idade": 28, "peso": 75, "altura": 180, "objetivo": "ganhar 3kg de massa"}',
  'Cliente dedicado'
);
*/

-- ========================================
-- 11. VERIFICAÇÕES FINAIS
-- ========================================

-- Verificar se as tabelas foram criadas
SELECT 
  'Tabelas criadas:' as status,
  COUNT(*) as total 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('nutricionistas', 'prescricoes');

-- Verificar políticas RLS
SELECT 
  'Políticas RLS:' as status,
  tablename, 
  policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('nutricionistas', 'prescricoes')
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT 
  'Triggers:' as status,
  trigger_name, 
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ========================================
-- SETUP COMPLETO! 
-- ========================================

-- PRÓXIMOS PASSOS:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Configure as variáveis de ambiente no projeto (.env.local)
-- 3. Teste o registro de um usuário
-- 4. Configure N8N para usar a service_role key para inserir prescrições
-- 5. Teste a integração completa

-- PARA N8N:
-- Use a service_role key (não a anon key) para operações de inserção/atualização
-- A service_role bypassa RLS automaticamente
-- Endpoint: https://rdlmvcvwrofufvlmldlv.supabase.co/rest/v1/

-- ESTRUTURA RECOMENDADA PARA N8N:
-- POST /rest/v1/prescricoes
-- Headers:
--   Authorization: Bearer YOUR_SERVICE_ROLE_KEY
--   apikey: YOUR_SERVICE_ROLE_KEY
--   Content-Type: application/json
-- Body: {
--   "identificacao": "uuid-do-nutricionista",
--   "nome_cliente": "Nome do Cliente",
--   "json": {...dados da prescrição...},
--   "external_ref": "id-referencia-externa",
--   "client_data": {...dados do cliente...}
-- }