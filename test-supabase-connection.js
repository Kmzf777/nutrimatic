// Script para testar conexão com Supabase
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  // Configurações do Supabase
  const supabaseUrl = 'https://rdlmvcvwrofufvlmldlv.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbG12Y3Z3cm9mdWZ2bG1sZGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjQzMjQsImV4cCI6MjA2OTkwMDMyNH0.1TpCyIdb4eBHqL2mFCg6MgbGv__zXP67r6euUrrfakE';
  
  try {
    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('✅ Cliente Supabase criado com sucesso');
    
    // Testar conexão básica
    console.log('🔄 Testando conexão básica...');
    const { data, error } = await supabase.from('nutricionistas').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message);
      console.log('Código do erro:', error.code);
      
      if (error.code === 'PGRST116') {
        console.log('ℹ️  Tabela nutricionistas não encontrada - isso é normal se o banco não foi configurado');
      }
    } else {
      console.log('✅ Conexão com Supabase funcionando perfeitamente!');
      console.log('Dados recebidos:', data);
    }
    
    // Testar autenticação
    console.log('🔄 Testando autenticação...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Erro na autenticação:', authError.message);
    } else {
      console.log('✅ Autenticação funcionando!');
      console.log('Sessão atual:', authData.session ? 'Ativa' : 'Nenhuma sessão');
    }
    
  } catch (error) {
    console.log('❌ Erro inesperado:', error.message);
    console.log('Stack trace:', error.stack);
  }
}

// Executar teste
testSupabaseConnection().then(() => {
  console.log('\n🏁 Teste concluído!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Se todos os testes passaram, o Supabase está funcionando');
  console.log('2. Configure as variáveis de ambiente na Vercel');
  console.log('3. Faça um novo deploy');
  console.log('4. Teste o login em produção');
}).catch(error => {
  console.log('❌ Erro fatal:', error);
}); 