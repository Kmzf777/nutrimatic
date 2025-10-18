-- ========================================
-- VERIFICAÇÃO DA MIGRAÇÃO - NUTRIMATIC
-- Script para verificar se a migração foi bem-sucedida
-- ========================================

-- **IMPORTANTE**: Execute este script no SQL Editor do Supabase
-- Project URL: https://rdlmvcvwrofufvlmldlv.supabase.co

-- ========================================
-- 1. VERIFICAR EXISTÊNCIA DAS TABELAS
-- ========================================

SELECT 
    'TABELAS EXISTENTES' as categoria,
    table_name,
    CASE 
        WHEN table_name IN ('instancias', 'prescricoes', 'agenda', 'nutricionistas') THEN '✅ NOVA'
        WHEN table_name IN ('accounts', 'Teste-Tabela', 'agenda_eventos') THEN '⚠️ ANTIGA'
        ELSE '📋 OUTRAS'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('instancias', 'prescricoes', 'agenda', 'nutricionistas', 'accounts', 'Teste-Tabela', 'agenda_eventos')
ORDER BY status, table_name;

-- ========================================
-- 2. CONTAR REGISTROS EM CADA TABELA
-- ========================================

DO $$
DECLARE
    count_nutricionistas INTEGER := 0;
    count_instancias INTEGER := 0;
    count_prescricoes INTEGER := 0;
    count_agenda INTEGER := 0;
    count_accounts INTEGER := 0;
    count_teste_tabela INTEGER := 0;
    count_agenda_eventos INTEGER := 0;
BEGIN
    -- Contar tabelas novas
    SELECT COUNT(*) INTO count_nutricionistas FROM public.nutricionistas;
    SELECT COUNT(*) INTO count_instancias FROM public.instancias;
    SELECT COUNT(*) INTO count_prescricoes FROM public.prescricoes;
    SELECT COUNT(*) INTO count_agenda FROM public.agenda;
    
    -- Contar tabelas antigas (se existirem)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts') THEN
        EXECUTE 'SELECT COUNT(*) FROM accounts' INTO count_accounts;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Teste-Tabela') THEN
        EXECUTE 'SELECT COUNT(*) FROM "Teste-Tabela"' INTO count_teste_tabela;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agenda_eventos') THEN
        EXECUTE 'SELECT COUNT(*) FROM agenda_eventos' INTO count_agenda_eventos;
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CONTAGEM DE REGISTROS:';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TABELAS NOVAS:';
    RAISE NOTICE '  📊 nutricionistas: %', count_nutricionistas;
    RAISE NOTICE '  📊 instancias: %', count_instancias;
    RAISE NOTICE '  📊 prescricoes: %', count_prescricoes;
    RAISE NOTICE '  📊 agenda: %', count_agenda;
    RAISE NOTICE '';
    RAISE NOTICE 'TABELAS ANTIGAS:';
    RAISE NOTICE '  📊 accounts: %', count_accounts;
    RAISE NOTICE '  📊 Teste-Tabela: %', count_teste_tabela;
    RAISE NOTICE '  📊 agenda_eventos: %', count_agenda_eventos;
    RAISE NOTICE '========================================';
    
    -- Verificar se a migração foi bem-sucedida
    IF count_instancias >= count_accounts AND count_prescricoes >= count_teste_tabela AND count_agenda >= count_agenda_eventos THEN
        RAISE NOTICE '✅ MIGRAÇÃO APARENTA ESTAR CORRETA!';
    ELSE
        RAISE NOTICE '⚠️ POSSÍVEL PROBLEMA NA MIGRAÇÃO - VERIFICAR DADOS';
    END IF;
    
    RAISE NOTICE '========================================';
END $$;

-- ========================================
-- 3. VERIFICAR ESTRUTURA DAS TABELAS NOVAS
-- ========================================

SELECT 
    'ESTRUTURA INSTANCIAS' as categoria,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'instancias' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
    'ESTRUTURA PRESCRICOES' as categoria,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'prescricoes' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
    'ESTRUTURA AGENDA' as categoria,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'agenda' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- 4. VERIFICAR POLÍTICAS RLS
-- ========================================

SELECT 
    'POLÍTICAS RLS' as categoria,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('instancias', 'prescricoes', 'agenda')
ORDER BY tablename, policyname;

-- ========================================
-- 5. VERIFICAR ÍNDICES
-- ========================================

SELECT 
    'ÍNDICES' as categoria,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('instancias', 'prescricoes', 'agenda')
ORDER BY tablename, indexname;

-- ========================================
-- 6. TESTE DE CONSULTA SIMPLES
-- ========================================

-- Testar se as consultas básicas funcionam
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TESTANDO CONSULTAS BÁSICAS:';
    RAISE NOTICE '========================================';
    
    -- Teste instancias
    BEGIN
        PERFORM * FROM public.instancias LIMIT 1;
        RAISE NOTICE '✅ Consulta em instancias: OK';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Consulta em instancias: ERRO - %', SQLERRM;
    END;
    
    -- Teste prescricoes
    BEGIN
        PERFORM * FROM public.prescricoes LIMIT 1;
        RAISE NOTICE '✅ Consulta em prescricoes: OK';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Consulta em prescricoes: ERRO - %', SQLERRM;
    END;
    
    -- Teste agenda
    BEGIN
        PERFORM * FROM public.agenda LIMIT 1;
        RAISE NOTICE '✅ Consulta em agenda: OK';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Consulta em agenda: ERRO - %', SQLERRM;
    END;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICAÇÃO CONCLUÍDA!';
    RAISE NOTICE '========================================';
END $$;

-- ========================================
-- 7. RESUMO FINAL
-- ========================================

SELECT 
    '📋 RESUMO FINAL' as categoria,
    'Execute este script após a migração para verificar se tudo está funcionando corretamente.' as instrucoes;