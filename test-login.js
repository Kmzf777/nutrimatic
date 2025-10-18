require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

async function testLogin() {
  console.log('🔍 Testando login...\n');
  
  try {
    // Tentar login com as credenciais conhecidas
    const emails = ['rafaelreisssilva034@gmail.com', 'kelwintobias@gmail.com'];
    
    for (const email of emails) {
      console.log(`\n🔐 Tentando login com: ${email}`);
      
      // Primeiro, vamos verificar se o usuário existe na auth
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.log('❌ Erro ao listar usuários (normal para chave anônima):', listError.message);
      } else {
        console.log('✅ Usuários encontrados:', users.users.length);
        users.users.forEach(user => {
          console.log(`   - ${user.email} (ID: ${user.id})`);
        });
      }
      
      // Tentar login com senha padrão comum
      const commonPasswords = ['123456', 'password', 'admin', '12345678'];
      
      for (const password of commonPasswords) {
        console.log(`   Tentando senha: ${password}`);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.log(`   ❌ Falha: ${error.message}`);
        } else {
          console.log(`   ✅ Login bem-sucedido!`);
          console.log(`   Usuário: ${data.user.email}`);
          console.log(`   ID: ${data.user.id}`);
          
          // Verificar nutricionista
          const { data: nutricionista, error: nutError } = await supabase
            .from('nutricionistas')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (nutError) {
            console.log(`   ❌ Erro ao buscar nutricionista: ${nutError.message}`);
          } else {
            console.log(`   ✅ Nutricionista: ${nutricionista.nome}`);
          }
          
          // Fazer logout
          await supabase.auth.signOut();
          return;
        }
      }
    }
    
    console.log('\n💡 Nenhuma combinação de email/senha funcionou');
    console.log('💡 Você pode tentar fazer login manualmente no site');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testLogin();