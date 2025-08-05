-- ========================================
-- PARTE 3: CRIAR ÍNDICES PARA PERFORMANCE
-- Execute após a Parte 2
-- ========================================

-- Índices para prescricoes
CREATE INDEX idx_prescricoes_identificacao ON prescricoes(identificacao);
CREATE INDEX idx_prescricoes_status ON prescricoes(status);
CREATE INDEX idx_prescricoes_data ON prescricoes(data DESC);
CREATE INDEX idx_prescricoes_external_ref ON prescricoes(external_ref);
CREATE INDEX idx_prescricoes_n8n_workflow ON prescricoes(n8n_workflow_id);
CREATE INDEX idx_prescricoes_source ON prescricoes(source);

-- Índices compostos para consultas comuns do N8N
CREATE INDEX idx_prescricoes_identificacao_status ON prescricoes(identificacao, status);
CREATE INDEX idx_prescricoes_status_data ON prescricoes(status, data DESC);

-- Verificar índices
SELECT 'Índices criados!' as status;