-- Script para criar prescrições para o usuário REAL já existente
-- Usuário: matfufofos (gilbertocuriosidades@gmail.com)
-- ID: b5d92af4-edb9-4af0-85aa-1a39f152da23

-- 1. Verificar se o usuário existe
SELECT id, nome, email, telefone FROM nutricionistas 
WHERE id = 'b5d92af4-edb9-4af0-85aa-1a39f152da23';

-- 2. Limpar prescrições de teste anteriores (se houver)
DELETE FROM prescricoes WHERE nome_cliente LIKE '%PRESCRIÇÃO REAL%' OR nome_cliente LIKE '%TESTE REAL%';

-- 3. Inserir prescrições reais para o usuário existente
INSERT INTO prescricoes (identificacao, nome_cliente, status, data, json) VALUES
('b5d92af4-edb9-4af0-85aa-1a39f152da23', 'Ana Paula Silva', 'Pendente', NOW() - INTERVAL '2 hours', '{"refeicoes": ["Café da manhã", "Almoço", "Jantar"], "observacoes": "Dieta rica em fibras e proteínas"}'),
('b5d92af4-edb9-4af0-85aa-1a39f152da23', 'Carlos Eduardo Santos', 'Aprovada', NOW() - INTERVAL '4 hours', '{"refeicoes": ["Café da manhã", "Lanche", "Almoço", "Lanche", "Jantar"], "observacoes": "Dieta para ganho de massa muscular"}'),
('b5d92af4-edb9-4af0-85aa-1a39f152da23', 'Mariana Costa Lima', 'Refazendo', NOW() - INTERVAL '6 hours', '{"refeicoes": ["Café da manhã", "Lanche", "Almoço", "Jantar"], "observacoes": "Dieta para emagrecimento - revisar porções"}'),
('b5d92af4-edb9-4af0-85aa-1a39f152da23', 'Roberto Almeida Ferreira', 'Aprovada', NOW() - INTERVAL '8 hours', '{"refeicoes": ["Café da manhã", "Almoço", "Lanche", "Jantar"], "observacoes": "Dieta balanceada para manutenção"}'),
('b5d92af4-edb9-4af0-85aa-1a39f152da23', 'Fernanda Oliveira Rodrigues', 'Pendente', NOW() - INTERVAL '12 hours', '{"refeicoes": ["Café da manhã", "Lanche", "Almoço", "Jantar"], "observacoes": "Primeira consulta - avaliação nutricional"}');

-- 4. Verificar quantas prescrições foram inseridas
SELECT COUNT(*) as total_prescricoes FROM prescricoes 
WHERE identificacao = 'b5d92af4-edb9-4af0-85aa-1a39f152da23';

-- 5. Listar todas as prescrições do usuário
SELECT 
    id, 
    nome_cliente, 
    status, 
    data,
    json->>'observacoes' as observacoes
FROM prescricoes 
WHERE identificacao = 'b5d92af4-edb9-4af0-85aa-1a39f152da23'
ORDER BY data DESC;