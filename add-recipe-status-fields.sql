-- Script para adicionar campos de status e observação à tabela de receitas
-- Execute este script no seu banco de dados Supabase

-- 1. Adicionar campo status com valor padrão 'pending'
ALTER TABLE "Teste-Tabela" 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- 2. Adicionar campo para observações de reprovação
ALTER TABLE "Teste-Tabela" 
ADD COLUMN IF NOT EXISTS rejection_observation TEXT;

-- 3. Adicionar campo updated_at para rastrear mudanças
ALTER TABLE "Teste-Tabela" 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Criar função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_teste_tabela_updated_at ON "Teste-Tabela";
CREATE TRIGGER update_teste_tabela_updated_at
    BEFORE UPDATE ON "Teste-Tabela"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Atualizar registros existentes para ter status 'pending'
UPDATE "Teste-Tabela" 
SET status = 'pending' 
WHERE status IS NULL;

-- 7. Verificar se os campos foram adicionados corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'Teste-Tabela' 
AND column_name IN ('status', 'rejection_observation', 'updated_at')
ORDER BY column_name;

-- 8. Exemplo de consulta para testar
SELECT 
    id,
    nome,
    status,
    rejection_observation,
    created_at,
    updated_at
FROM "Teste-Tabela"
ORDER BY created_at DESC
LIMIT 5; 