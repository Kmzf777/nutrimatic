// Setup via Node.js com Supabase client
// Instale: npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js')

// Configure com sua service_role key (não a anon key)
const supabaseUrl = 'https://rdlmvcvwrofufvlmldlv.supabase.co'
const serviceRoleKey = 'YOUR_SERVICE_ROLE_KEY' // Pegue no dashboard

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🔧 Iniciando setup...')
  
  try {
    // 1. Limpeza
    console.log('🗑️ Removendo tabelas antigas...')
    
    await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS prescricoes CASCADE'
    })
    
    await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS nutricionistas CASCADE'
    })
    
    // 2. Criar nutricionistas
    console.log('👥 Criando tabela nutricionistas...')
    
    const createNutricionistas = `
      CREATE TABLE nutricionistas (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        active BOOLEAN DEFAULT TRUE,
        regras TEXT,
        presc_geradas INTEGER DEFAULT 0,
        presc_max INTEGER DEFAULT 100
      )
    `
    
    await supabase.rpc('exec_sql', { sql: createNutricionistas })
    
    // 3. Criar prescricoes
    console.log('📋 Criando tabela prescricoes...')
    
    const createPrescricoes = `
      CREATE TABLE prescricoes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        identificacao UUID NOT NULL REFERENCES nutricionistas(id) ON DELETE CASCADE,
        nome_cliente TEXT NOT NULL,
        data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        json JSONB,
        url TEXT,
        status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovada', 'Refazendo')),
        external_ref TEXT,
        source TEXT DEFAULT 'n8n',
        client_data JSONB,
        observacoes TEXT
      )
    `
    
    await supabase.rpc('exec_sql', { sql: createPrescricoes })
    
    console.log('✅ Setup concluído!')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

setupDatabase()