-- ========================================
-- PARTE 4: CONFIGURAR RLS E POLÍTICAS
-- Execute após a Parte 3
-- ========================================

-- Habilitar RLS
ALTER TABLE nutricionistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescricoes ENABLE ROW LEVEL SECURITY;

-- Políticas para nutricionistas
CREATE POLICY "Usuários podem ver seus próprios dados" ON nutricionistas
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios dados" ON nutricionistas
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados" ON nutricionistas
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para prescricoes
CREATE POLICY "Nutricionistas podem ver suas prescrições" ON prescricoes
  FOR SELECT USING (auth.uid() = identificacao);

CREATE POLICY "Nutricionistas podem atualizar suas prescrições" ON prescricoes
  FOR UPDATE USING (auth.uid() = identificacao);

CREATE POLICY "Permitir inserção de prescrições" ON prescricoes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Nutricionistas podem deletar suas prescrições" ON prescricoes
  FOR DELETE USING (auth.uid() = identificacao);

-- Verificar RLS
SELECT 'RLS e políticas configuradas!' as status;