-- Script para debugar prescrições e usuários

-- 1. Verificar usuários cadastrados
SELECT 
  id, 
  email, 
  created_at,
  raw_user_meta_data->>'nome' as nome
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Verificar nutricionistas cadastrados
SELECT 
  id, 
  nome, 
  email, 
  created_at,
  active
FROM nutricionistas 
ORDER BY created_at DESC;

-- 3. Verificar todas as prescrições
SELECT 
  id,
  identificacao,
  nome_cliente,
  data,
  status,
  json,
  url
FROM prescricoes 
ORDER BY data DESC;

-- 4. Verificar se há prescrições órfãs (sem nutricionista correspondente)
SELECT 
  p.id,
  p.identificacao,
  p.nome_cliente,
  p.status,
  n.nome as nutricionista_nome,
  n.email as nutricionista_email
FROM prescricoes p
LEFT JOIN nutricionistas n ON p.identificacao = n.id
ORDER BY p.data DESC;

-- 5. Contar prescrições por usuário
SELECT 
  p.identificacao,
  n.nome,
  n.email,
  COUNT(p.id) as total_prescricoes
FROM prescricoes p
LEFT JOIN nutricionistas n ON p.identificacao = n.id
GROUP BY p.identificacao, n.nome, n.email
ORDER BY total_prescricoes DESC;