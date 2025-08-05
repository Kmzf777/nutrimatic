CREATE INDEX idx_nutricionistas_email ON nutricionistas(email);
CREATE INDEX idx_prescricoes_identificacao ON prescricoes(identificacao);
CREATE INDEX idx_prescricoes_status ON prescricoes(status);
CREATE INDEX idx_prescricoes_external_ref ON prescricoes(external_ref);