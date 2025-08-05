-- Script para inserir prescrições de teste com nomes de clientes
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos verificar se existem prescrições sem nome_cliente
SELECT id, nome_cliente, nome, status, data 
FROM prescricoes 
WHERE nome_cliente IS NULL OR nome_cliente = '';

-- Inserir prescrições de teste com nomes válidos
-- Substitua 'SEU_USER_ID_AQUI' pelo ID do seu usuário

INSERT INTO prescricoes (
  identificacao, 
  nome_cliente, 
  data, 
  json, 
  url, 
  status
) VALUES 
(
  'SEU_USER_ID_AQUI', -- Substitua pelo seu user ID
  'Maria Silva Santos',
  NOW() - INTERVAL '2 days',
  '{"objetivo": "emagrecimento", "restricoes": ["lactose"], "peso": 70, "altura": 1.65}',
  'https://exemplo.com/prescricao-1.pdf',
  'Aprovada'
),
(
  'SEU_USER_ID_AQUI', -- Substitua pelo seu user ID
  'João Carlos Oliveira',
  NOW() - INTERVAL '1 day',
  '{"objetivo": "ganho_massa", "restricoes": ["gluten"], "peso": 65, "altura": 1.75}',
  'https://exemplo.com/prescricao-2.pdf',
  'Pendente'
),
(
  'SEU_USER_ID_AQUI', -- Substitua pelo seu user ID
  'Ana Paula Costa',
  NOW(),
  '{"objetivo": "manutencao", "restricoes": [], "peso": 58, "altura": 1.60}',
  'https://exemplo.com/prescricao-3.pdf',
  'Refazendo'
);

-- Atualizar prescrições existentes que não têm nome_cliente
UPDATE prescricoes 
SET nome_cliente = 'Cliente ' || id::text
WHERE nome_cliente IS NULL OR nome_cliente = '';

-- Verificar o resultado
SELECT id, nome_cliente, status, data 
FROM prescricoes 
ORDER BY data DESC 
LIMIT 10; 