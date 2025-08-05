-- ========================================
-- PARTE 6: VERIFICAÇÃO FINAL
-- Execute após todas as partes anteriores
-- ========================================

-- Verificar tabelas criadas
SELECT 
  'TABELAS:' as tipo,
  table_name,
  'OK' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('nutricionistas', 'prescricoes')
ORDER BY table_name;

-- Verificar políticas RLS
SELECT 
  'POLÍTICAS RLS:' as tipo,
  tablename, 
  policyname,
  'OK' as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('nutricionistas', 'prescricoes')
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT 
  'TRIGGERS:' as tipo,
  trigger_name, 
  event_object_table,
  'OK' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Verificar índices
SELECT 
  'ÍNDICES:' as tipo,
  indexname,
  tablename,
  'OK' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('nutricionistas', 'prescricoes')
ORDER BY tablename, indexname;

-- Resumo final
SELECT 
  '🎉 SETUP COMPLETO!' as resultado,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
     AND table_name IN ('nutricionistas', 'prescricoes')) as tabelas,
  (SELECT COUNT(*) FROM pg_policies 
   WHERE schemaname = 'public' 
     AND tablename IN ('nutricionistas', 'prescricoes')) as politicas,
  (SELECT COUNT(*) FROM information_schema.triggers 
   WHERE trigger_schema = 'public') as triggers;