-- Script para verificar dados das prescrições
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura da tabela
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'prescricoes' 
ORDER BY ordinal_position;

-- 2. Verificar total de prescrições
SELECT COUNT(*) as total_prescricoes FROM prescricoes;

-- 3. Verificar prescrições por status
SELECT 
  status,
  COUNT(*) as total
FROM prescricoes 
GROUP BY status 
ORDER BY total DESC;

-- 4. Verificar prescrições sem nome_cliente (não deveria existir)
SELECT 
  id, 
  nome_cliente, 
  status, 
  data,
  LENGTH(nome_cliente) as nome_length
FROM prescricoes 
WHERE nome_cliente IS NULL OR nome_cliente = '' OR LENGTH(nome_cliente) < 3
ORDER BY data DESC;

-- 5. Verificar algumas prescrições com nome_cliente válido
SELECT 
  id, 
  nome_cliente, 
  status, 
  data,
  LENGTH(nome_cliente) as nome_length
FROM prescricoes 
WHERE nome_cliente IS NOT NULL AND nome_cliente != '' AND LENGTH(nome_cliente) >= 3
ORDER BY data DESC 
LIMIT 10;

-- 6. Verificar se há dados de teste
SELECT 
  id, 
  nome_cliente, 
  status, 
  data
FROM prescricoes 
WHERE nome_cliente LIKE '%Teste%' OR nome_cliente LIKE '%Cliente%'
ORDER BY data DESC; 