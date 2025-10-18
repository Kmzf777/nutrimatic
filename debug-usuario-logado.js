require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUsuarioLogado() {
  console.log('🔍 Verificando dados do usuário logado...\n');
  
  try {
    // 1. Verificar sessão atual
    console.log('1. Verificando sessão atual...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao verificar sessão:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('❌ Nenhuma sessão ativa encontrada');
      console.log('💡 Faça login no site primeiro');
      return;
    }
    
    console.log('✅ Sessão ativa encontrada:');
    console.log(`   - ID: ${session.user.id}`);
    console.log(`   - Email: ${session.user.email}`);
    console.log(`   - Criado em: ${session.user.created_at}`);
    console.log('');
    
    // 2. Verificar dados na tabela nutricionistas
    console.log('2. Verificando dados na tabela nutricionistas...');
    const { data: nutricionista, error: nutError } = await supabase
      .from('nutricionistas')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (nutError) {
      console.error('❌ Erro ao buscar nutricionista:', nutError);
      
      if (nutError.code === 'PGRST116') {
        console.log('💡 Nutricionista não encontrado na tabela');
        console.log('🔧 Criando registro de nutricionista...');
        
        const { data: newNut, error: createError } = await supabase
          .from('nutricionistas')
          .insert({
            id: session.user.id,
            nome: session.user.email?.split('@')[0] || 'Usuário',
            email: session.user.email || '',
            telefone: '',
            active: true,
            presc_max: 50,
            presc_geradas: 0
          })
          .select()
          .single();
        
        if (createError) {
          console.error('❌ Erro ao criar nutricionista:', createError);
        } else {
          console.log('✅ Nutricionista criado com sucesso:', newNut);
        }
      }
      return;
    }
    
    console.log('✅ Nutricionista encontrado:');
    console.log(`   - ID: ${nutricionista.id}`);
    console.log(`   - Nome: ${nutricionista.nome}`);
    console.log(`   - Email: ${nutricionista.email}`);
    console.log(`   - Ativo: ${nutricionista.active}`);
    console.log(`   - Prescrições máx: ${nutricionista.presc_max}`);
    console.log(`   - Prescrições geradas: ${nutricionista.presc_geradas}`);
    console.log('');
    
    // 3. Verificar dados relacionados
    console.log('3. Verificando dados relacionados...');
    
    // Verificar instâncias
    const { data: instancias, error: instError } = await supabase
      .from('instancias')
      .select('*')
      .eq('identificacao', session.user.id);
    
    if (instError) {
      console.error('❌ Erro ao buscar instâncias:', instError);
    } else {
      console.log(`✅ Instâncias encontradas: ${instancias.length}`);
      instancias.forEach((inst, i) => {
        console.log(`   ${i + 1}. ${inst.nome} (${inst.tipo})`);
      });
    }
    
    // Verificar prescrições
    const { data: prescricoes, error: prescError } = await supabase
      .from('prescricoes')
      .select('*')
      .eq('identificacao', session.user.id);
    
    if (prescError) {
      console.error('❌ Erro ao buscar prescrições:', prescError);
    } else {
      console.log(`✅ Prescrições encontradas: ${prescricoes.length}`);
    }
    
    // Verificar agenda
    const { data: agenda, error: agendaError } = await supabase
      .from('agenda')
      .select('*')
      .eq('identificacao', session.user.id);
    
    if (agendaError) {
      console.error('❌ Erro ao buscar agenda:', agendaError);
    } else {
      console.log(`✅ Eventos de agenda encontrados: ${agenda.length}`);
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

debugUsuarioLogado();