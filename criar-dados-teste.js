require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function criarDadosTeste() {
  console.log('📊 Criando dados de teste...\n');
  
  const userId = '0f75582f-e79b-43b2-8f7b-160cdb4e8500';
  
  try {
    // 1. Criar instâncias de teste com status válido
    console.log('1. Criando instâncias...');
    const instancias = [
      {
        identificacao: userId,
        name: 'Consultório Principal',
        number: 1,
        status: 'ativo'
      },
      {
        identificacao: userId,
        name: 'Consultório Filial',
        number: 2,
        status: 'ativo'
      }
    ];
    
    for (const instancia of instancias) {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('instancias')
        .select('id')
        .eq('identificacao', userId)
        .eq('name', instancia.name)
        .single();
      
      if (existing) {
        console.log(`⚠️ Instância já existe: ${instancia.name}`);
        continue;
      }
      
      const { data, error } = await supabase
        .from('instancias')
        .insert(instancia)
        .select();
      
      if (error) {
        console.error(`❌ Erro ao criar instância ${instancia.name}:`, error.message);
      } else {
        console.log(`✅ Instância criada: ${instancia.name}`);
      }
    }
    
    // 2. Criar cliente de teste com colunas corretas
    console.log('\n2. Criando cliente de teste...');
    
    // Verificar se já existe cliente
    const { data: existingCliente } = await supabase
      .from('clientes')
      .select('*')
      .eq('nutricionista_id', userId)
      .eq('nome', 'Cliente Teste')
      .single();
    
    let cliente;
    if (existingCliente) {
      console.log(`⚠️ Cliente já existe: ${existingCliente.nome}`);
      cliente = existingCliente;
    } else {
      const { data: newCliente, error: clienteError } = await supabase
        .from('clientes')
        .insert({
          nome: 'Cliente Teste',
          numero: '001',
          status: 'ativo',
          nutricionista_id: userId
        })
        .select()
        .single();
      
      if (clienteError) {
        console.error('❌ Erro ao criar cliente:', clienteError.message);
        return;
      } else {
        console.log(`✅ Cliente criado: ${newCliente.nome}`);
        cliente = newCliente;
      }
    }
    
    // 3. Criar eventos de agenda com cliente_id
    console.log('\n3. Criando eventos de agenda...');
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    
    const eventos = [
      {
        nutricionista_id: userId,
        cliente_id: cliente.id,
        dia: hoje.toISOString().split('T')[0],
        horario: '09:00',
        acao: 'Consulta inicial',
        tipo: 'consulta',
        status: 'agendado'
      },
      {
        nutricionista_id: userId,
        cliente_id: cliente.id,
        dia: hoje.toISOString().split('T')[0],
        horario: '14:00',
        acao: 'Retorno',
        tipo: 'retorno',
        status: 'agendado'
      },
      {
        nutricionista_id: userId,
        cliente_id: cliente.id,
        dia: amanha.toISOString().split('T')[0],
        horario: '10:30',
        acao: 'Avaliação nutricional',
        tipo: 'avaliacao',
        status: 'agendado'
      }
    ];
    
    for (const evento of eventos) {
      // Verificar se já existe
      const { data: existingEvento } = await supabase
        .from('agenda')
        .select('id')
        .eq('nutricionista_id', userId)
        .eq('dia', evento.dia)
        .eq('horario', evento.horario)
        .single();
      
      if (existingEvento) {
        console.log(`⚠️ Evento já existe: ${evento.acao} - ${evento.dia} ${evento.horario}`);
        continue;
      }
      
      const { data, error } = await supabase
        .from('agenda')
        .insert(evento)
        .select();
      
      if (error) {
        console.error(`❌ Erro ao criar evento ${evento.acao}:`, error.message);
      } else {
        console.log(`✅ Evento criado: ${evento.acao} - ${evento.dia} ${evento.horario}`);
      }
    }
    
    console.log('\n🎉 Dados de teste criados com sucesso!');
    console.log('💡 Agora você pode fazer login e ver os dados carregando');
    console.log('📧 Login: teste@nutrimatic.com');
    console.log('🔑 Senha: 123456789');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

criarDadosTeste();