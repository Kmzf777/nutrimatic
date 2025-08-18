-- ========================================
-- CRIAR TABELA SECRETARIA - NUTRIMATIC
-- Configurações do agente secretaria por nutricionista
-- ========================================

-- Criar tabela secretaria
CREATE TABLE secretaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificacao UUID NOT NULL REFERENCES nutricionistas(id) ON DELETE CASCADE,
  
  -- Configurações do agente
  agent_name TEXT DEFAULT 'Assistente Virtual',
  business_name TEXT DEFAULT 'Clínica',
  creativity REAL DEFAULT 0.7 CHECK (creativity >= 0 AND creativity <= 1),
  emojis BOOLEAN DEFAULT true,
  
  -- Configurações de horários (em minutos)
  consultation_time INTEGER DEFAULT 30 CHECK (consultation_time >= 15 AND consultation_time <= 120),
  return_time INTEGER DEFAULT 15 CHECK (return_time >= 15 AND return_time <= 120),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para garantir um registro por nutricionista
  UNIQUE(identificacao)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE secretaria ENABLE ROW LEVEL SECURITY;

-- Índices para performance
CREATE INDEX idx_secretaria_identificacao ON secretaria(identificacao);
CREATE INDEX idx_secretaria_created_at ON secretaria(created_at);

-- ========================================
-- POLÍTICAS RLS PARA SECRETARIA
-- ========================================

-- Nutricionistas podem ver apenas suas configurações
CREATE POLICY "Nutricionistas podem ver suas configurações de secretaria" ON secretaria
  FOR SELECT USING (auth.uid() = identificacao);

-- Nutricionistas podem inserir suas configurações
CREATE POLICY "Nutricionistas podem inserir suas configurações de secretaria" ON secretaria
  FOR INSERT WITH CHECK (auth.uid() = identificacao);

-- Nutricionistas podem atualizar suas configurações
CREATE POLICY "Nutricionistas podem atualizar suas configurações de secretaria" ON secretaria
  FOR UPDATE USING (auth.uid() = identificacao);

-- Nutricionistas podem deletar suas configurações
CREATE POLICY "Nutricionistas podem deletar suas configurações de secretaria" ON secretaria
  FOR DELETE USING (auth.uid() = identificacao);

-- ========================================
-- TRIGGER PARA ATUALIZAR TIMESTAMP
-- ========================================

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_secretaria_updated_at
  BEFORE UPDATE ON secretaria
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- VERIFICAÇÃO
-- ========================================

-- Verificar se a tabela foi criada
SELECT 
  'VERIFICAÇÃO: Tabela secretaria criada' as status,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'secretaria';

-- Verificar colunas
SELECT 
  'VERIFICAÇÃO: Colunas da tabela secretaria' as status,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'secretaria'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  'VERIFICAÇÃO: Políticas RLS' as status,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'secretaria'
ORDER BY policyname;

-- ========================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Descomente para inserir dados de exemplo
-- IMPORTANTE: Substitua o UUID pelo ID real de um nutricionista

/*
INSERT INTO secretaria (
  identificacao,
  agent_name,
  business_name,
  creativity,
  emojis,
  consultation_time,
  return_time
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Substitua pelo ID real
  'Assistente da Dra. Maria',
  'Clínica Nutrição & Saúde',
  0.8,
  true,
  45,
  30
);
*/

-- ========================================
-- SETUP COMPLETO!
-- ========================================

-- PRÓXIMOS PASSOS:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Crie o hook useSecretaria no frontend
-- 3. Integre a página secretaria com o Supabase
-- 4. Teste o carregamento e salvamento de configurações