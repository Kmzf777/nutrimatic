-- Script para verificar se os dados existem no Supabase
-- Execute este no SQL Editor para diagnóstico

-- 1. Verificar se o usuário existe
SELECT 'USUÁRIO:' as tipo, id, nome, email 
FROM nutricionistas 
WHERE id = 'b5d92af4-edb9-4af0-85aa-1a39f152da23';

-- 2. Verificar quantas prescrições existem para este usuário
SELECT 'TOTAL PRESCRIÇÕES:' as tipo, COUNT(*) as quantidade
FROM prescricoes 
WHERE identificacao = 'b5d92af4-edb9-4af0-85aa-1a39f152da23';

-- 3. Listar todas as prescrições do usuário
SELECT 'PRESCRIÇÕES:' as tipo, id, nome_cliente, status, data
FROM prescricoes 
WHERE identificacao = 'b5d92af4-edb9-4af0-85aa-1a39f152da23'
ORDER BY data DESC;

-- 4. Se não houver prescrições, inserir algumas agora
INSERT INTO prescricoes (identificacao, nome_cliente, status, data, json) 
SELECT 
    'b5d92af4-edb9-4af0-85aa-1a39f152da23',
    'TESTE - Ana Paula Silva',
    'Pendente',
    NOW() - INTERVAL '2 hours',
    '{"refeicoes": ["Café da manhã", "Almoço", "Jantar"], "observacoes": "Prescrição de teste para debug"}'
WHERE NOT EXISTS (
    SELECT 1 FROM prescricoes 
    WHERE identificacao = 'b5d92af4-edb9-4af0-85aa-1a39f152da23'
);

-- 5. Verificar novamente após inserção
SELECT 'VERIFICAÇÃO FINAL:' as tipo, COUNT(*) as total_prescricoes
FROM prescricoes 
WHERE identificacao = 'b5d92af4-edb9-4af0-85aa-1a39f152da23';