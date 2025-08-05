CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.nutricionistas (id, nome, telefone, email, created_at)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuario'), COALESCE(NEW.raw_user_meta_data->>'telefone', ''), NEW.email, NOW());
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;