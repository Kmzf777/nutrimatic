-- =====================================================
-- CRIAÇÃO DA TABELA TESTE-TABELA PARA N8N INTEGRATION
-- =====================================================

-- Habilitar extensão UUID se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar a tabela Teste-Tabela
CREATE TABLE IF NOT EXISTS public."Teste-Tabela" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nome TEXT NOT NULL,
    url TEXT NOT NULL
);

-- Habilitar RLS na tabela
ALTER TABLE public."Teste-Tabela" ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
-- Permitir leitura para usuários autenticados
CREATE POLICY "Users can view all recipes" ON public."Teste-Tabela" 
FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir inserção para usuários autenticados
CREATE POLICY "Users can insert recipes" ON public."Teste-Tabela" 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir atualização para usuários autenticados
CREATE POLICY "Users can update recipes" ON public."Teste-Tabela" 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Permitir exclusão para usuários autenticados
CREATE POLICY "Users can delete recipes" ON public."Teste-Tabela" 
FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE TESTE (OPCIONAL)
-- =====================================================

-- Inserir alguns dados de teste
INSERT INTO public."Teste-Tabela" (nome, url) VALUES
('Prescrição Nutricional - Marina Souza Oliveira', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Plano Alimentar - João Silva', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Dieta Low Carb - Ana Costa', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIM DO SCRIPT
-- ===================================================== 