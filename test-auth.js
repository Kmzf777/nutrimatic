require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Configuração do Supabase:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'não encontrada'}`);
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

async function testAuth() {
  console.log('🔍 Testando autenticação...\n');
  
  try {
    // 1. Verificar sessão atual
    console.log('1. Verificando sessão atual...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao verificar sessão:', sessionError);
    } else if (session) {
      console.log('✅ Sessão ativa encontrada:', session.user.email);
    } else {
      console.log('❌ Nenhuma sessão ativa');
    }
    
    // 2. Verificar usuário atual
    console.log('\n2. Verificando usuário atual...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Erro ao verificar usuário:', userError);
    } else if (user) {
      console.log('✅ Usuário encontrado:', user.email);
    } else {
      console.log('❌ Nenhum usuário logado');
    }
    
    // 3. Listar todos os nutricionistas
    console.log('\n3. Verificando tabela nutricionistas...');
    const { data: nutricionistas, error: nutError } = await supabase
      .from('nutricionistas')
      .select('*');
    
    if (nutError) {
      console.error('❌ Erro ao buscar nutricionistas:', nutError);
    } else {
      console.log(`✅ Nutricionistas encontrados: ${nutricionistas.length}`);
      nutricionistas.forEach((nut, i) => {
        console.log(`   ${i + 1}. ${nut.nome} (${nut.email}) - ID: ${nut.id}`);
      });
    }
    
    // 4. Teste de login (se não houver sessão)
    if (!session && !user) {
      console.log('\n4. Tentando fazer login de teste...');
      console.log('💡 Para testar, você precisa fazer login manualmente no site');
      console.log('💡 Ou fornecer credenciais de teste aqui');
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testAuth();