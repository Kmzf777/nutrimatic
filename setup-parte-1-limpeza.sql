-- ========================================
-- PARTE 1: LIMPEZA COMPLETA 
-- Execute esta parte primeiro
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
DROP POLICY IF EXISTS "Nutricionistas podem deletar suas prescrições" ON prescricoes;

-- Remover triggers e funções
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_nutricionistas_updated_at ON nutricionistas;
DROP TRIGGER IF EXISTS update_prescricoes_updated_at ON prescricoes;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Verificar limpeza
SELECT 'Limpeza concluída!' as status;