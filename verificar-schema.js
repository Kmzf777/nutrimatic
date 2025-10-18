require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarSchema() {
  console.log('🔍 Verificando schema das tabelas...\n');
  
  const tabelas = ['nutricionistas', 'instancias', 'agenda', 'prescricoes'];
  
  for (const tabela of tabelas) {
    console.log(`📋 Tabela: ${tabela}`);
    
    try {
      // Buscar um registro para ver as colunas
      const { data, error } = await supabase
        .from(tabela)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Erro ao acessar ${tabela}:`, error.message);
      } else if (data && data.length > 0) {
        console.log('✅ Colunas encontradas:');
        Object.keys(data[0]).forEach(coluna => {
          console.log(`   - ${coluna}: ${typeof data[0][coluna]} (${data[0][coluna]})`);
        });
      } else {
        console.log('⚠️ Tabela vazia, tentando inserir registro de teste...');
        
        // Tentar inserir um registro vazio para ver quais colunas são obrigatórias
        const { error: insertError } = await supabase
          .from(tabela)
          .insert({});
        
        if (insertError) {
          console.log('📝 Erro de inserção (mostra colunas obrigatórias):');
          console.log(`   ${insertError.message}`);
        }
      }
    } catch (error) {
      console.error(`❌ Erro inesperado com ${tabela}:`, error.message);
    }
    
    console.log('');
  }
}

verificarSchema();