CREATE TABLE prescricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificacao UUID NOT NULL REFERENCES nutricionistas(id) ON DELETE CASCADE,
  nome_cliente TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  json JSONB,
  url TEXT,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovada', 'Refazendo')),
  external_ref TEXT,
  source TEXT DEFAULT 'n8n',
  client_data JSONB,
  observacoes TEXT
);