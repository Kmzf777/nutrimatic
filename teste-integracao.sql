-- ========================================
-- TESTE DE INTEGRAÇÃO - NUTRIMATIC
-- Verificar se tudo está funcionando
-- ========================================

-- **EXECUTE ESTE SCRIPT APÓS** setup-supabase-completo.sql

-- ========================================
-- 1. VERIFICAR ESTRUTURA DAS TABELAS
-- ========================================

SELECT 
  'VERIFICAÇÃO: Tabelas criadas' as teste,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('nutricionistas', 'prescricoes')
ORDER BY table_name;

-- ========================================
-- 2. VERIFICAR COLUNAS DAS TABELAS
-- ========================================

SELECT 
  'VERIFICAÇÃO: Colunas nutricionistas' as teste,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'nutricionistas'
ORDER BY ordinal_position;

SELECT 
  'VERIFICAÇÃO: Colunas prescricoes' as teste,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'prescricoes'
ORDER BY ordinal_position;

-- ========================================
-- 3. VERIFICAR ÍNDICES
-- ========================================

SELECT 
  'VERIFICAÇÃO: Índices criados' as teste,
  schemaname,
  tablename,
  indexname
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('nutricionistas', 'prescricoes')
ORDER BY tablename, indexname;

-- ========================================
-- 4. VERIFICAR POLÍTICAS RLS
-- ========================================

SELECT 
  'VERIFICAÇÃO: Políticas RLS' as teste,
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('nutricionistas', 'prescricoes')
ORDER BY tablename, policyname;

-- ========================================
-- 5. VERIFICAR TRIGGERS
-- ========================================

SELECT 
  'VERIFICAÇÃO: Triggers' as teste,
  trigger_schema,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ========================================
-- 6. VERIFICAR FUNÇÕES
-- ========================================

SELECT 
  'VERIFICAÇÃO: Funções criadas' as teste,
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'update_updated_at_column')
ORDER BY routine_name;

-- ========================================
-- 7. SIMULAR CRIAÇÃO DE USUÁRIO (TESTE)
-- ========================================

-- ATENÇÃO: Este é apenas um teste de estrutura
-- Para criar usuários reais, use o sistema de auth do Supabase

DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'teste@nutrimatic.com';
BEGIN
    RAISE NOTICE 'TESTE: Simulando criação de usuário %', test_email;
    
    -- Simular inserção na tabela nutricionistas
    -- (normalmente seria feito pelo trigger)
    INSERT INTO nutricionistas (
        id, 
        nome, 
        telefone, 
        email
    ) VALUES (
        test_user_id,
        'Nutricionista Teste',
        '11999999999',
        test_email
    );
    
    RAISE NOTICE 'SUCESSO: Nutricionista criado com ID %', test_user_id;
    
    -- Testar criação de prescrição
    INSERT INTO prescricoes (
        identificacao,
        nome_cliente,
        json,
        external_ref,
        source,
        client_data,
        observacoes
    ) VALUES (
        test_user_id,
        'Cliente Teste N8N',
        '{"objetivo": "teste", "refeicoes": ["Café", "Almoço", "Jantar"]}',
        'test_n8n_123',
        'n8n',
        '{"idade": 30, "peso": 70, "altura": 170}',
        'Prescrição de teste criada automaticamente'
    );
    
    RAISE NOTICE 'SUCESSO: Prescrição de teste criada';
    
    -- Verificar se foi criada corretamente
    PERFORM * FROM prescricoes 
    WHERE identificacao = test_user_id 
      AND external_ref = 'test_n8n_123';
    
    IF FOUND THEN
        RAISE NOTICE 'SUCESSO: Prescrição encontrada na consulta';
    ELSE
        RAISE NOTICE 'ERRO: Prescrição não encontrada';
    END IF;
    
    -- Limpar dados de teste
    DELETE FROM prescricoes WHERE identificacao = test_user_id;
    DELETE FROM nutricionistas WHERE id = test_user_id;
    
    RAISE NOTICE 'LIMPEZA: Dados de teste removidos';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERRO NO TESTE: %', SQLERRM;
        -- Tentar limpeza mesmo com erro
        DELETE FROM prescricoes WHERE identificacao = test_user_id;
        DELETE FROM nutricionistas WHERE id = test_user_id;
END $$;

-- ========================================
-- 8. TESTE DE PERFORMANCE (ÍNDICES)
-- ========================================

-- Verificar se consultas comuns do N8N serão eficientes
EXPLAIN (FORMAT TEXT) 
SELECT * FROM prescricoes 
WHERE identificacao = gen_random_uuid() 
  AND status = 'Pendente'
ORDER BY data DESC
LIMIT 10;

-- ========================================
-- 9. VERIFICAR CONFIGURAÇÕES RLS
-- ========================================

SELECT 
  'CONFIGURAÇÃO RLS' as teste,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('nutricionistas', 'prescricoes');

-- ========================================
-- 10. RESUMO FINAL
-- ========================================

SELECT 
  'RESUMO DO SETUP' as status,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
     AND table_name IN ('nutricionistas', 'prescricoes')) as tabelas_criadas,
  (SELECT COUNT(*) FROM pg_policies 
   WHERE schemaname = 'public' 
     AND tablename IN ('nutricionistas', 'prescricoes')) as politicas_rls,
  (SELECT COUNT(*) FROM information_schema.triggers 
   WHERE trigger_schema = 'public') as triggers_criados,
  (SELECT COUNT(*) FROM pg_indexes 
   WHERE schemaname = 'public' 
     AND tablename IN ('nutricionistas', 'prescricoes')) as indices_criados;

-- ========================================
-- RESULTADOS ESPERADOS:
-- ========================================
-- - 2 tabelas criadas (nutricionistas, prescricoes)
-- - 6+ políticas RLS ativas
-- - 3+ triggers criados
-- - 10+ índices criados
-- - Função handle_new_user funcionando
-- - Teste de inserção bem-sucedido

RAISE NOTICE '========================================';
RAISE NOTICE 'TESTE DE INTEGRAÇÃO CONCLUÍDO!';
RAISE NOTICE 'Verifique os resultados acima.';
RAISE NOTICE 'Se tudo estiver OK, o N8N deve funcionar perfeitamente.';
RAISE NOTICE '========================================';