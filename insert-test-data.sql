-- Inserir dados de teste na tabela Teste-Tabela
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos limpar a tabela (opcional)
-- DELETE FROM public."Teste-Tabela";

-- Inserir dados de teste
INSERT INTO public."Teste-Tabela" (nome, url) VALUES
('Prescrição Nutricional - Marina Souza Oliveira', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Plano Alimentar - João Silva', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Dieta Low Carb - Ana Costa', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Plano Vegetariano - Maria Santos', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Dieta para Hipertensão - Pedro Lima', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Plano para Diabéticos - Carla Ferreira', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Dieta Detox - Roberto Almeida', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf'),
('Plano para Gestantes - Juliana Costa', 'https://storage.pdfendpoint.com/6656ee54-98e5-4dd2-918c-03f7c05ca9ed/loose-jade-hawk-c9a7a3.pdf');

-- Verificar se os dados foram inseridos
SELECT COUNT(*) as total_registros FROM public."Teste-Tabela";

-- Mostrar todos os registros
SELECT * FROM public."Teste-Tabela" ORDER BY created_at DESC; 