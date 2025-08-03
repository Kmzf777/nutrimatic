-- Script para inserir uma prescrição de teste
-- Substitua 'SEU_USER_ID_AQUI' pelo ID do seu usuário

-- Para encontrar seu user ID, execute primeiro:
-- SELECT id, email FROM auth.users WHERE email = 'seu_email@exemplo.com';

-- Depois execute o INSERT abaixo com o ID correto:
INSERT INTO prescricoes (
  identificacao, 
  nome_cliente, 
  data, 
  json, 
  url, 
  status
) VALUES (
  'SEU_USER_ID_AQUI', -- Substitua pelo seu user ID
  'Paciente Teste Silva',
  NOW(),
  '{"objetivo": "emagrecimento", "restricoes": ["lactose"], "peso": 70, "altura": 1.65}',
  'https://exemplo.com/prescricao-teste.pdf',
  'Pendente'
);

-- Para ver todas as prescrições:
-- SELECT * FROM prescricoes ORDER BY data DESC;