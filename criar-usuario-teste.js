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

async function criarUsuarioTeste() {
  console.log('🔧 Criando usuário de teste...\n');
  
  const email = 'teste@nutrimatic.com';
  const password = '123456789';
  const nome = 'Usuário Teste';
  
  try {
    // 1. Tentar criar usuário
    console.log('1. Criando usuário na autenticação...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: nome
        }
      }
    });
    
    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError.message);
      
      // Se o usuário já existe, tentar fazer login
      if (authError.message.includes('already registered')) {
        console.log('👤 Usuário já existe, tentando fazer login...');
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (loginError) {
          console.error('❌ Erro no login:', loginError.message);
          console.log('💡 Tente usar a senha correta ou resetar a senha');
          return;
        }
        
        console.log('✅ Login bem-sucedido!');
        console.log(`   Email: ${loginData.user.email}`);
        console.log(`   ID: ${loginData.user.id}`);
        
        // Verificar se já existe nutricionista
        const { data: existingNut, error: checkError } = await supabase
          .from('nutricionistas')
          .select('*')
          .eq('id', loginData.user.id)
          .single();
        
        if (checkError && checkError.code === 'PGRST116') {
          console.log('🔧 Criando registro de nutricionista...');
          await criarNutricionista(loginData.user.id, loginData.user.email, nome);
        } else if (existingNut) {
          console.log('✅ Nutricionista já existe:', existingNut.nome);
        }
        
        return;
      }
      return;
    }
    
    if (!authData.user) {
      console.error('❌ Usuário não foi criado');
      return;
    }
    
    console.log('✅ Usuário criado com sucesso!');
    console.log(`   Email: ${authData.user.email}`);
    console.log(`   ID: ${authData.user.id}`);
    console.log(`   Confirmação necessária: ${!authData.user.email_confirmed_at}`);
    
    // 2. Criar registro na tabela nutricionistas
    console.log('\n2. Criando registro de nutricionista...');
    await criarNutricionista(authData.user.id, email, nome);
    
    // 3. Criar alguns dados de teste
    console.log('\n3. Criando dados de teste...');
    await criarDadosTeste(authData.user.id);
    
    console.log('\n✅ Usuário de teste criado com sucesso!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Senha: ${password}`);
    console.log('💡 Use essas credenciais para fazer login no site');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

async function criarNutricionista(userId, email, nome) {
  const { data, error } = await supabase
    .from('nutricionistas')
    .insert({
      id: userId,
      nome: nome,
      email: email,
      telefone: '(11) 99999-9999',
      active: true,
      presc_max: 100,
      presc_geradas: 0
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Erro ao criar nutricionista:', error.message);
  } else {
    console.log('✅ Nutricionista criado:', data.nome);
  }
}

async function criarDadosTeste(userId) {
  // Criar uma instância de teste
  const { data: instancia, error: instError } = await supabase
    .from('instancias')
    .insert({
      identificacao: userId,
      nome: 'Clínica Teste',
      tipo: 'clinica',
      status: 'ativo'
    })
    .select()
    .single();
  
  if (instError) {
    console.log('⚠️ Erro ao criar instância:', instError.message);
  } else {
    console.log('✅ Instância criada:', instancia.nome);
  }
  
  // Criar um evento de agenda de teste
  const hoje = new Date();
  const { data: evento, error: eventoError } = await supabase
    .from('agenda')
    .insert({
      identificacao: userId,
      dia: hoje.toISOString().split('T')[0],
      horario: '14:00',
      cliente: 'Cliente Teste',
      acao: 'consulta',
      observacoes: 'Consulta de teste'
    })
    .select()
    .single();
  
  if (eventoError) {
    console.log('⚠️ Erro ao criar evento:', eventoError.message);
  } else {
    console.log('✅ Evento criado para:', evento.cliente);
  }
}

criarUsuarioTeste();