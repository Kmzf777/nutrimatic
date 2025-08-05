CREATE POLICY "users_select" ON nutricionistas FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert" ON nutricionistas FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update" ON nutricionistas FOR UPDATE USING (auth.uid() = id);