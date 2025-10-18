require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarClientesSchema() {
  console.log('🔍 Verificando schema da tabela clientes...\n');
  
  try {
    // Tentar buscar registros existentes
    const { data: clientes, error: selectError } = await supabase
      .from('clientes')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ Erro ao buscar clientes:', selectError.message);
    } else {
      console.log(`✅ Clientes encontrados: ${clientes.length}`);
      if (clientes.length > 0) {
        console.log('📋 Colunas disponíveis:');
        Object.keys(clientes[0]).forEach(col => {
          console.log(`   - ${col}`);
        });
      }
    }
    
    // Se não há registros, tentar um insert vazio para ver as colunas obrigatórias
    if (!clientes || clientes.length === 0) {
      console.log('\n🧪 Testando insert vazio para descobrir colunas...');
      const { data, error: insertError } = await supabase
        .from('clientes')
        .insert({})
        .select();
      
      if (insertError) {
        console.log('📝 Erro esperado (revela colunas obrigatórias):');
        console.log(`   ${insertError.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

verificarClientesSchema();