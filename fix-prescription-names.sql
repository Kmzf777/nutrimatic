-- Script para corrigir prescrições sem nome_cliente
-- Execute este script no Supabase SQL Editor

-- 1. Verificar prescrições sem nome_cliente
SELECT 
  id, 
  nome_cliente, 
  nome, 
  status, 
  data,
  CASE 
    WHEN nome_cliente IS NULL OR nome_cliente = '' THEN 'SEM_NOME'
    ELSE 'COM_NOME'
  END as status_nome
FROM prescricoes 
ORDER BY data DESC;

-- 2. Atualizar prescrições que não têm nome_cliente
-- Usar o ID da prescrição como nome temporário
UPDATE prescricoes 
SET nome_cliente = 'Cliente ' || SUBSTRING(id::text, 1, 8)
WHERE nome_cliente IS NULL OR nome_cliente = '';

-- 3. Verificar o resultado após a correção
SELECT 
  id, 
  nome_cliente, 
  status, 
  data
FROM prescricoes 
ORDER BY data DESC 
LIMIT 10;

-- 4. Contar prescrições por status
SELECT 
  status,
  COUNT(*) as total
FROM prescricoes 
GROUP BY status 
ORDER BY total DESC; 