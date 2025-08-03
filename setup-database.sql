-- Script completo para configurar o banco de dados Nutrimatic

-- 1. Criar/recriar tabela nutricionistas
DROP TABLE IF EXISTS nutricionistas CASCADE;

CREATE TABLE nutricionistas (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT FALSE,
  regras TEXT,
  presc_geradas INTEGER DEFAULT 0,
  presc_max INTEGER DEFAULT 0
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE nutricionistas ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON nutricionistas;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON nutricionistas;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON nutricionistas;

-- 4. Criar políticas RLS
CREATE POLICY "Usuários podem ver seus próprios dados" ON nutricionistas
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios dados" ON nutricionistas
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados" ON nutricionistas
  FOR UPDATE USING (auth.uid() = id);

-- 5. Remover trigger e função existentes (se houver)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 6. Criar função para criar automaticamente o perfil do nutricionista
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.nutricionistas (id, nome, telefone, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Nome não informado'),
    COALESCE(NEW.raw_user_meta_data->>'telefone', 'Telefone não informado'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Criar trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Criar/recriar tabela prescricoes
DROP TABLE IF EXISTS prescricoes CASCADE;

CREATE TABLE prescricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificacao UUID NOT NULL REFERENCES nutricionistas(id) ON DELETE CASCADE,
  nome_cliente TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  json JSONB,
  url TEXT,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovada', 'Refazendo'))
);

-- 9. Habilitar RLS para prescricoes
ALTER TABLE prescricoes ENABLE ROW LEVEL SECURITY;

-- 10. Remover políticas existentes para prescricoes
DROP POLICY IF EXISTS "Nutricionistas podem ver suas prescrições" ON prescricoes;
DROP POLICY IF EXISTS "Nutricionistas podem atualizar suas prescrições" ON prescricoes;
DROP POLICY IF EXISTS "Permitir inserção de prescrições" ON prescricoes;

-- 11. Criar políticas para prescricoes
CREATE POLICY "Nutricionistas podem ver suas prescrições" ON prescricoes
  FOR SELECT USING (auth.uid() = identificacao);

CREATE POLICY "Nutricionistas podem atualizar suas prescrições" ON prescricoes
  FOR UPDATE USING (auth.uid() = identificacao);

CREATE POLICY "Permitir inserção de prescrições" ON prescricoes
  FOR INSERT WITH CHECK (true);

-- 12. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_prescricoes_identificacao ON prescricoes(identificacao);
CREATE INDEX IF NOT EXISTS idx_prescricoes_status ON prescricoes(status);
CREATE INDEX IF NOT EXISTS idx_prescricoes_data ON prescricoes(data);

-- 13. Inserir dados de exemplo (opcional)
-- Descomente as linhas abaixo se quiser dados de teste

-- INSERT INTO prescricoes (identificacao, nome_cliente, status, data) VALUES
-- (uuid_generate_v4(), 'Ana Paula Silva', 'Pendente', NOW() - INTERVAL '2 hours'),
-- (uuid_generate_v4(), 'Carlos Eduardo Santos', 'Aprovada', NOW() - INTERVAL '4 hours'),
-- (uuid_generate_v4(), 'Mariana Costa Lima', 'Aprovada', NOW() - INTERVAL '6 hours'),
-- (uuid_generate_v4(), 'Roberto Almeida Ferreira', 'Refazendo', NOW() - INTERVAL '8 hours');

-- Script concluído!
-- Agora você pode testar criando um usuário no sistema