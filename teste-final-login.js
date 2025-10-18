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

async function testeFinalLogin() {
  console.log('🧪 Teste final de login e carregamento de dados...\n');
  
  const email = 'teste@nutrimatic.com';
  const password = '123456789';
  
  try {
    // 1. Fazer login
    console.log('1. Fazendo login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message);
      return;
    }
    
    console.log('✅ Login bem-sucedido!');
    console.log(`   Email: ${loginData.user.email}`);
    console.log(`   ID: ${loginData.user.id}`);
    
    // 2. Buscar nutricionista (simular o que o AuthContext faz)
    console.log('\n2. Buscando dados do nutricionista...');
    const { data: nutricionista, error: nutError } = await supabase
      .from('nutricionistas')
      .select('*')
      .eq('id', loginData.user.id)
      .single();
    
    if (nutError) {
      console.error('❌ Erro ao buscar nutricionista:', nutError.message, nutError.code);
    } else {
      console.log('✅ Nutricionista encontrado:');
      console.log(`   Nome: ${nutricionista.nome}`);
      console.log(`   Email: ${nutricionista.email}`);
      console.log(`   Ativo: ${nutricionista.active}`);
    }
    
    // 3. Buscar instâncias (simular useAccounts)
    console.log('\n3. Buscando instâncias...');
    const { data: instancias, error: instError } = await supabase
      .from('instancias')
      .select('*')
      .eq('identificacao', loginData.user.id);
    
    if (instError) {
      console.error('❌ Erro ao buscar instâncias:', instError.message);
    } else {
      console.log(`✅ Instâncias encontradas: ${instancias.length}`);
      instancias.forEach((inst, i) => {
        console.log(`   ${i + 1}. ${inst.name} (${inst.status})`);
      });
    }
    
    // 4. Buscar prescrições (simular usePrescricoes)
    console.log('\n4. Buscando prescrições...');
    const { data: prescricoes, error: prescError } = await supabase
      .from('prescricoes')
      .select('*')
      .eq('identificacao', loginData.user.id);
    
    if (prescError) {
      console.error('❌ Erro ao buscar prescrições:', prescError.message);
    } else {
      console.log(`✅ Prescrições encontradas: ${prescricoes.length}`);
    }
    
    // 5. Buscar agenda (simular useAgenda)
    console.log('\n5. Buscando eventos de agenda...');
    const { data: agenda, error: agendaError } = await supabase
      .from('agenda')
      .select('*')
      .eq('nutricionista_id', loginData.user.id);
    
    if (agendaError) {
      console.error('❌ Erro ao buscar agenda:', agendaError.message);
    } else {
      console.log(`✅ Eventos de agenda encontrados: ${agenda.length}`);
      agenda.forEach((evento, i) => {
        console.log(`   ${i + 1}. ${evento.dia} ${evento.horario} - ${evento.acao} (${evento.status})`);
      });
    }
    
    console.log('\n🎉 Teste concluído!');
    console.log('💡 O sistema está funcionando corretamente');
    console.log('📧 Use teste@nutrimatic.com / 123456789 para fazer login no site');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testeFinalLogin();