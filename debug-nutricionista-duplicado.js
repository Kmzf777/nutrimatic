require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugNutricionistaDuplicado() {
  console.log('🔍 Verificando registros duplicados...\n');
  
  const userId = '0f75582f-e79b-43b2-8f7b-160cdb4e8500';
  
  try {
    // 1. Buscar TODOS os registros com esse ID
    console.log('1. Buscando todos os registros do nutricionista...');
    const { data: todos, error: todosError } = await supabase
      .from('nutricionistas')
      .select('*')
      .eq('id', userId);
    
    if (todosError) {
      console.error('❌ Erro ao buscar todos:', todosError.message);
    } else {
      console.log(`✅ Registros encontrados: ${todos.length}`);
      todos.forEach((nut, i) => {
        console.log(`   ${i + 1}. ID: ${nut.id}`);
        console.log(`      Nome: ${nut.nome}`);
        console.log(`      Email: ${nut.email}`);
        console.log(`      Created: ${nut.created_at}`);
        console.log('');
      });
    }
    
    // 2. Se há duplicados, remover os extras
    if (todos && todos.length > 1) {
      console.log('🧹 Removendo registros duplicados...');
      
      // Manter apenas o primeiro registro
      const paraRemover = todos.slice(1);
      
      for (const registro of paraRemover) {
        const { error: deleteError } = await supabase
          .from('nutricionistas')
          .delete()
          .eq('id', registro.id)
          .eq('created_at', registro.created_at);
        
        if (deleteError) {
          console.error('❌ Erro ao remover duplicado:', deleteError.message);
        } else {
          console.log(`✅ Removido duplicado criado em: ${registro.created_at}`);
        }
      }
    }
    
    // 3. Se não há registros, criar um
    if (!todos || todos.length === 0) {
      console.log('🔧 Criando registro de nutricionista...');
      
      const { data: newNut, error: createError } = await supabase
        .from('nutricionistas')
        .insert({
          id: userId,
          nome: 'Usuário Teste',
          email: 'teste@nutrimatic.com',
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
    }
    
    // 4. Verificar resultado final
    console.log('\n4. Verificação final...');
    const { data: final, error: finalError } = await supabase
      .from('nutricionistas')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (finalError) {
      console.error('❌ Erro na verificação final:', finalError.message);
    } else {
      console.log('✅ Nutricionista final:');
      console.log(`   Nome: ${final.nome}`);
      console.log(`   Email: ${final.email}`);
      console.log(`   Ativo: ${final.active}`);
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

debugNutricionistaDuplicado();