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

async function corrigirNutricionistaTeste() {
  console.log('🔧 Corrigindo registro do nutricionista de teste...\n');
  
  const email = 'teste@nutrimatic.com';
  const password = '123456789';
  
  try {
    // 1. Fazer login com o usuário de teste
    console.log('1. Fazendo login com usuário de teste...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message);
      return;
    }
    
    console.log('✅ Login bem-sucedido!');
    console.log(`   ID: ${loginData.user.id}`);
    
    // 2. Verificar se já existe nutricionista
    console.log('\n2. Verificando nutricionista existente...');
    const { data: existingNut, error: checkError } = await supabase
      .from('nutricionistas')
      .select('*')
      .eq('id', loginData.user.id)
      .single();
    
    if (existingNut) {
      console.log('✅ Nutricionista já existe:', existingNut.nome);
    } else if (checkError && checkError.code === 'PGRST116') {
      console.log('🔧 Criando registro de nutricionista...');
      
      // Usar as colunas corretas baseadas no schema
      const { data: newNut, error: createError } = await supabase
        .from('nutricionistas')
        .insert({
          id: loginData.user.id,
          nome: 'Usuário Teste',
          email: email,
          telefone: '(11) 99999-9999',
          active: true,
          regras: null
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Erro ao criar nutricionista:', createError.message);
      } else {
        console.log('✅ Nutricionista criado:', newNut.nome);
      }
    } else {
      console.error('❌ Erro ao verificar nutricionista:', checkError.message);
    }
    
    // 3. Criar instância com colunas corretas
    console.log('\n3. Criando instância...');
    const { data: instancia, error: instError } = await supabase
      .from('instancias')
      .insert({
        identificacao: loginData.user.id,
        name: 'Clínica Teste',
        number: '5511999999999',
        status: 'ativo'
      })
      .select()
      .single();
    
    if (instError) {
      console.log('⚠️ Erro ao criar instância:', instError.message);
    } else {
      console.log('✅ Instância criada:', instancia.name);
    }
    
    // 4. Criar evento de agenda com colunas corretas
    console.log('\n4. Criando evento de agenda...');
    const hoje = new Date();
    const { data: evento, error: eventoError } = await supabase
      .from('agenda')
      .insert({
        nutricionista_id: loginData.user.id,
        dia: hoje.toISOString().split('T')[0],
        horario: '14:00:00',
        acao: 'consulta',
        cliente_id: loginData.user.id, // Usando o próprio ID como cliente de teste
        tipo: 'presencial',
        status: 'agendado'
      })
      .select()
      .single();
    
    if (eventoError) {
      console.log('⚠️ Erro ao criar evento:', eventoError.message);
    } else {
      console.log('✅ Evento criado para:', evento.dia, evento.horario);
    }
    
    console.log('\n✅ Correção concluída!');
    console.log('📧 Email: teste@nutrimatic.com');
    console.log('🔑 Senha: 123456789');
    console.log('💡 Agora você pode fazer login no site e testar');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

corrigirNutricionistaTeste();