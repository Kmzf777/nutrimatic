-- ========================================
-- PARTE 5: CRIAR FUNÇÕES E TRIGGERS
-- Execute após a Parte 4
-- ========================================

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.nutricionistas (
    id, 
    nome, 
    telefone, 
    email,
    created_at
  ) VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'), 
    COALESCE(NEW.raw_user_meta_data->>'telefone', ''), 
    NEW.email,
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Erro ao criar perfil do nutricionista: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criação automática de perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamp
CREATE TRIGGER update_nutricionistas_updated_at
  BEFORE UPDATE ON nutricionistas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescricoes_updated_at
  BEFORE UPDATE ON prescricoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Verificar triggers
SELECT 'Funções e triggers criados!' as status;