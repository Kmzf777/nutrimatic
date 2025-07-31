-- Corrigir políticas RLS para permitir acesso aos dados
-- Execute este script no SQL Editor do Supabase

-- 1. Desabilitar RLS temporariamente para teste
ALTER TABLE public."Teste-Tabela" DISABLE ROW LEVEL SECURITY;

-- 2. Ou, se preferir manter RLS, criar políticas mais permissivas
-- ALTER TABLE public."Teste-Tabela" ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view all recipes" ON public."Teste-Tabela";
DROP POLICY IF EXISTS "Users can insert recipes" ON public."Teste-Tabela";
DROP POLICY IF EXISTS "Users can update recipes" ON public."Teste-Tabela";
DROP POLICY IF EXISTS "Users can delete recipes" ON public."Teste-Tabela";

-- 4. Criar política que permite acesso público (para teste)
CREATE POLICY "Allow public access" ON public."Teste-Tabela" 
FOR ALL USING (true);

-- 5. Verificar se os dados estão acessíveis
SELECT COUNT(*) as total_registros FROM public."Teste-Tabela";

-- 6. Mostrar todos os registros
SELECT * FROM public."Teste-Tabela" ORDER BY created_at DESC; 