CREATE POLICY "prescricoes_select" ON prescricoes FOR SELECT USING (auth.uid() = identificacao);
CREATE POLICY "prescricoes_update" ON prescricoes FOR UPDATE USING (auth.uid() = identificacao);
CREATE POLICY "prescricoes_insert" ON prescricoes FOR INSERT WITH CHECK (true);
CREATE POLICY "prescricoes_delete" ON prescricoes FOR DELETE USING (auth.uid() = identificacao);