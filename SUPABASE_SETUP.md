# Configuração do Supabase - Nutrimatic

Este guia te ajudará a configurar o Supabase para o projeto Nutrimatic.

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite um nome para o projeto (ex: "nutrimatic")
6. Escolha uma senha forte para o banco de dados
7. Escolha uma região próxima (ex: São Paulo)
8. Clique em "Create new project"

## 2. Configurar Variáveis de Ambiente

Após criar o projeto, você precisará das credenciais do Supabase:

1. No dashboard do Supabase, vá em "Settings" > "API"
2. Copie as seguintes informações:
   - Project URL
   - anon/public key

3. Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 3. Criar Tabelas

### Tabela: nutricionistas

Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- Criar tabela nutricionistas
CREATE TABLE nutricionistas (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  regras TEXT,
  presc_geradas INTEGER DEFAULT 0,
  presc_max INTEGER DEFAULT 0
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE nutricionistas ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados" ON nutricionistas
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários inserirem seus próprios dados
CREATE POLICY "Usuários podem inserir seus próprios dados" ON nutricionistas
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para usuários atualizarem seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON nutricionistas
  FOR UPDATE USING (auth.uid() = id);

-- Função para criar automaticamente o perfil do nutricionista
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.nutricionistas (id, nome, telefone, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'telefone', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Tabela: prescricoes

Execute o seguinte SQL:

```sql
-- Criar tabela prescricoes
CREATE TABLE prescricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificacao UUID NOT NULL REFERENCES nutricionistas(id) ON DELETE CASCADE,
  nome_cliente TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  json JSONB,
  url TEXT,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovada', 'Refazendo'))
);

-- Habilitar RLS
ALTER TABLE prescricoes ENABLE ROW LEVEL SECURITY;

-- Política para nutricionistas verem apenas suas prescrições
CREATE POLICY "Nutricionistas podem ver suas prescrições" ON prescricoes
  FOR SELECT USING (auth.uid() = identificacao);

-- Política para nutricionistas atualizarem suas prescrições
CREATE POLICY "Nutricionistas podem atualizar suas prescrições" ON prescricoes
  FOR UPDATE USING (auth.uid() = identificacao);

-- Política para inserção (será usado pelo n8n)
CREATE POLICY "Permitir inserção de prescrições" ON prescricoes
  FOR INSERT WITH CHECK (true);

-- Índices para melhor performance
CREATE INDEX idx_prescricoes_identificacao ON prescricoes(identificacao);
CREATE INDEX idx_prescricoes_status ON prescricoes(status);
CREATE INDEX idx_prescricoes_data ON prescricoes(data);
```

## 4. Configurar Autenticação

1. No dashboard do Supabase, vá em "Authentication" > "Settings"
2. Configure as seguintes opções:
   - **Site URL**: `http://localhost:3000` (para desenvolvimento)
   - **Redirect URLs**: 
     - `http://localhost:3000/dashboard`
     - `http://localhost:3000/setup`
     - `http://localhost:3000/login`

3. Em "Email Templates", personalize os templates de email se desejar

## 5. Configurar Storage (Opcional)

Se você quiser armazenar PDFs das prescrições:

1. Vá em "Storage" no dashboard
2. Crie um bucket chamado "prescricoes"
3. Configure as políticas de acesso conforme necessário

## 6. Testar a Configuração

1. Execute o projeto localmente:
```bash
npm run dev
```

2. Acesse `http://localhost:3000/register`
3. Crie uma conta de teste
4. Verifique se o usuário foi criado na tabela `nutricionistas`
5. Teste o login e redirecionamento

## 7. Configuração para Produção

Quando for fazer deploy:

1. Atualize as variáveis de ambiente com as URLs de produção
2. Configure as URLs de redirecionamento no Supabase para seu domínio
3. Configure o CORS se necessário

## 8. Integração com n8n

Para integrar com o n8n, você precisará:

1. Criar um webhook no n8n que receba dados de prescrições
2. Configurar o n8n para inserir dados na tabela `prescricoes`
3. Configurar webhooks para atualizar o status das prescrições

### Exemplo de payload para inserir prescrição via n8n:

```json
{
  "identificacao": "uuid-do-nutricionista",
  "nome_cliente": "Nome do Cliente",
  "json": {
    "dados_da_prescricao": "..."
  },
  "url": "https://url-do-pdf.com/prescricao.pdf"
}
```

## 9. Troubleshooting

### Problemas Comuns:

1. **Erro de RLS**: Verifique se as políticas estão corretas
2. **Erro de autenticação**: Verifique as variáveis de ambiente
3. **Erro de CORS**: Configure as URLs permitidas no Supabase
4. **Trigger não funciona**: Verifique se a função `handle_new_user` foi criada corretamente

### Comandos Úteis:

```sql
-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'nutricionistas';

-- Verificar triggers
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

## 10. Próximos Passos

Após configurar o Supabase:

1. Teste o fluxo completo de registro e login
2. Configure o n8n para gerar prescrições
3. Teste a aprovação/rejeição de prescrições
4. Configure monitoramento e logs
5. Implemente backup e recuperação de dados