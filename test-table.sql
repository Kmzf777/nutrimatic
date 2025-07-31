-- Script simples para testar a criação da tabela Teste-Tabela

-- 1. Criar a tabela
CREATE TABLE IF NOT EXISTS public."Teste-Tabela" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nome TEXT NOT NULL,
    url TEXT NOT NULL
);

-- 2. Inserir dados de teste
INSERT INTO public."Teste-Tabela" (nome, url) VALUES
('Prescrição Nutricional - Marina Souza Oliveira', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Plano Alimentar - João Silva', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Dieta Low Carb - Ana Costa', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf');

-- 3. Verificar se os dados foram inseridos
SELECT * FROM public."Teste-Tabela" ORDER BY created_at DESC; 