-- ========================================
-- MIGRAÇÃO DE DADOS - NUTRIMATIC
-- Script para migrar dados das tabelas antigas para as novas
-- ========================================

-- **IMPORTANTE**: Execute este script no SQL Editor do Supabase
-- Project URL: https://rdlmvcvwrofufvlmldlv.supabase.co

-- ========================================
-- 1. VERIFICAR SE AS TABELAS EXISTEM
-- ========================================

-- Verificar se as tabelas antigas existem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts') THEN
        RAISE NOTICE 'Tabela "accounts" não encontrada. Pulando migração.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Teste-Tabela') THEN
        RAISE NOTICE 'Tabela "Teste-Tabela" não encontrada. Pulando migração.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agenda_eventos') THEN
        RAISE NOTICE 'Tabela "agenda_eventos" não encontrada. Pulando migração.';
    END IF;
END $$;

-- ========================================
-- 2. CRIAR TABELA AGENDA SE NÃO EXISTIR
-- ========================================

CREATE TABLE IF NOT EXISTS public.agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  identificacao UUID NOT NULL REFERENCES public.nutricionistas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  cliente_nome TEXT,
  cliente_telefone TEXT,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'realizado')),
  observacoes TEXT
);

-- Índices para a tabela agenda
CREATE INDEX IF NOT EXISTS agenda_identificacao_idx ON public.agenda (identificacao);
CREATE INDEX IF NOT EXISTS agenda_data_inicio_idx ON public.agenda (data_inicio);
CREATE INDEX IF NOT EXISTS agenda_status_idx ON public.agenda (status);

-- Trigger para updated_at na agenda
DROP TRIGGER IF EXISTS agenda_set_updated_at ON public.agenda;
CREATE TRIGGER agenda_set_updated_at
BEFORE UPDATE ON public.agenda
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS para agenda
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;

-- Políticas para agenda
DROP POLICY IF EXISTS "agenda_select_own" ON public.agenda;
CREATE POLICY "agenda_select_own" ON public.agenda
  FOR SELECT
  TO authenticated
  USING (identificacao = auth.uid());

DROP POLICY IF EXISTS "agenda_insert_own" ON public.agenda;
CREATE POLICY "agenda_insert_own" ON public.agenda
  FOR INSERT
  TO authenticated
  WITH CHECK (identificacao = auth.uid());

DROP POLICY IF EXISTS "agenda_update_own" ON public.agenda;
CREATE POLICY "agenda_update_own" ON public.agenda
  FOR UPDATE
  TO authenticated
  USING (identificacao = auth.uid())
  WITH CHECK (identificacao = auth.uid());

DROP POLICY IF EXISTS "agenda_delete_own" ON public.agenda;
CREATE POLICY "agenda_delete_own" ON public.agenda
  FOR DELETE
  TO authenticated
  USING (identificacao = auth.uid());

-- ========================================
-- 3. MIGRAÇÃO: accounts → instancias
-- ========================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts') THEN
        RAISE NOTICE 'Iniciando migração: accounts → instancias';
        
        -- Inserir dados de accounts em instancias (evitando duplicatas)
        INSERT INTO public.instancias (id, created_at, updated_at, identificacao, name, number, status)
        SELECT 
            COALESCE(a.id, gen_random_uuid()) as id,
            COALESCE(a.created_at, NOW()) as created_at,
            COALESCE(a.updated_at, NOW()) as updated_at,
            a.identificacao,
            COALESCE(a.name, 'Instância Migrada') as name,
            COALESCE(a.number, 'N/A') as number,
            CASE 
                WHEN a.status IS NULL THEN 'ativo'
                WHEN a.status = 'active' THEN 'ativo'
                WHEN a.status = 'inactive' THEN 'inativo'
                ELSE 'ativo'
            END as status
        FROM accounts a
        WHERE NOT EXISTS (
            SELECT 1 FROM public.instancias i 
            WHERE i.identificacao = a.identificacao 
            AND i.name = COALESCE(a.name, 'Instância Migrada')
        );
        
        RAISE NOTICE 'Migração accounts → instancias concluída';
    ELSE
        RAISE NOTICE 'Tabela "accounts" não encontrada. Pulando migração.';
    END IF;
END $$;

-- ========================================
-- 4. MIGRAÇÃO: Teste-Tabela → prescricoes
-- ========================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Teste-Tabela') THEN
        RAISE NOTICE 'Iniciando migração: Teste-Tabela → prescricoes';
        
        -- Inserir dados de Teste-Tabela em prescricoes (evitando duplicatas)
        INSERT INTO public.prescricoes (id, identificacao, nome_cliente, data, updated_at, json, url, status, observacoes)
        SELECT 
            COALESCE(t.id, gen_random_uuid()) as id,
            t.identificacao,
            COALESCE(t.nome_cliente, 'Cliente Migrado') as nome_cliente,
            COALESCE(t.data, NOW()) as data,
            COALESCE(t.updated_at, NOW()) as updated_at,
            t.json,
            t.url,
            CASE 
                WHEN t.status IS NULL THEN 'Pendente'
                WHEN t.status = 'approved' THEN 'Aprovada'
                WHEN t.status = 'pending' THEN 'Pendente'
                WHEN t.status = 'rejected' THEN 'Refazendo'
                ELSE t.status
            END as status,
            t.observacoes
        FROM "Teste-Tabela" t
        WHERE NOT EXISTS (
            SELECT 1 FROM public.prescricoes p 
            WHERE p.identificacao = t.identificacao 
            AND p.nome_cliente = COALESCE(t.nome_cliente, 'Cliente Migrado')
            AND p.data = COALESCE(t.data, NOW())
        );
        
        RAISE NOTICE 'Migração Teste-Tabela → prescricoes concluída';
    ELSE
        RAISE NOTICE 'Tabela "Teste-Tabela" não encontrada. Pulando migração.';
    END IF;
END $$;

-- ========================================
-- 5. MIGRAÇÃO: agenda_eventos → agenda
-- ========================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agenda_eventos') THEN
        RAISE NOTICE 'Iniciando migração: agenda_eventos → agenda';
        
        -- Inserir dados de agenda_eventos em agenda (evitando duplicatas)
        INSERT INTO public.agenda (id, created_at, updated_at, identificacao, titulo, descricao, data_inicio, data_fim, cliente_nome, cliente_telefone, status, observacoes)
        SELECT 
            COALESCE(ae.id, gen_random_uuid()) as id,
            COALESCE(ae.created_at, NOW()) as created_at,
            COALESCE(ae.updated_at, NOW()) as updated_at,
            ae.identificacao,
            COALESCE(ae.titulo, ae.title, 'Evento Migrado') as titulo,
            COALESCE(ae.descricao, ae.description) as descricao,
            COALESCE(ae.data_inicio, ae.start_date, ae.data, NOW()) as data_inicio,
            COALESCE(ae.data_fim, ae.end_date, ae.data + INTERVAL '1 hour', NOW() + INTERVAL '1 hour') as data_fim,
            COALESCE(ae.cliente_nome, ae.client_name) as cliente_nome,
            COALESCE(ae.cliente_telefone, ae.client_phone) as cliente_telefone,
            CASE 
                WHEN ae.status IS NULL THEN 'agendado'
                WHEN ae.status = 'scheduled' THEN 'agendado'
                WHEN ae.status = 'confirmed' THEN 'confirmado'
                WHEN ae.status = 'cancelled' THEN 'cancelado'
                WHEN ae.status = 'completed' THEN 'realizado'
                ELSE 'agendado'
            END as status,
            COALESCE(ae.observacoes, ae.notes) as observacoes
        FROM agenda_eventos ae
        WHERE NOT EXISTS (
            SELECT 1 FROM public.agenda a 
            WHERE a.identificacao = ae.identificacao 
            AND a.titulo = COALESCE(ae.titulo, ae.title, 'Evento Migrado')
            AND a.data_inicio = COALESCE(ae.data_inicio, ae.start_date, ae.data, NOW())
        );
        
        RAISE NOTICE 'Migração agenda_eventos → agenda concluída';
    ELSE
        RAISE NOTICE 'Tabela "agenda_eventos" não encontrada. Pulando migração.';
    END IF;
END $$;

-- ========================================
-- 6. VERIFICAÇÃO FINAL
-- ========================================

-- Contar registros migrados
DO $$
DECLARE
    count_instancias INTEGER;
    count_prescricoes INTEGER;
    count_agenda INTEGER;
BEGIN
    SELECT COUNT(*) INTO count_instancias FROM public.instancias;
    SELECT COUNT(*) INTO count_prescricoes FROM public.prescricoes;
    SELECT COUNT(*) INTO count_agenda FROM public.agenda;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RESUMO DA MIGRAÇÃO:';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Instâncias migradas: %', count_instancias;
    RAISE NOTICE 'Prescrições migradas: %', count_prescricoes;
    RAISE NOTICE 'Eventos de agenda migrados: %', count_agenda;
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migração concluída com sucesso!';
    RAISE NOTICE '========================================';
END $$;

-- ========================================
-- 7. INSTRUÇÕES PARA LIMPEZA (OPCIONAL)
-- ========================================

-- ATENÇÃO: Execute apenas após confirmar que a migração foi bem-sucedida
-- e que a aplicação está funcionando corretamente com as novas tabelas

/*
-- Para remover as tabelas antigas (CUIDADO!):
-- DROP TABLE IF EXISTS accounts CASCADE;
-- DROP TABLE IF EXISTS "Teste-Tabela" CASCADE;
-- DROP TABLE IF EXISTS agenda_eventos CASCADE;
*/

-- Fim do script de migração