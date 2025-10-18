const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
    console.log('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarTabelas() {
    console.log('🔍 Verificando tabelas existentes no Supabase...\n');
    
    const tabelasParaVerificar = [
        'accounts',
        'instancias', 
        'Teste-Tabela',
        'prescricoes',
        'agenda_eventos',
        'agenda',
        'nutricionistas'
    ];
    
    const resultados = {};
    
    for (const tabela of tabelasParaVerificar) {
        try {
            console.log(`📋 Verificando tabela: ${tabela}`);
            
            // Tentar fazer uma query simples para verificar se a tabela existe
            const { data, error, count } = await supabase
                .from(tabela)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                console.log(`   ❌ Erro: ${error.message}`);
                resultados[tabela] = { existe: false, erro: error.message };
            } else {
                console.log(`   ✅ Existe - ${count || 0} registros`);
                resultados[tabela] = { existe: true, registros: count || 0 };
                
                // Se a tabela existe, vamos verificar sua estrutura
                const { data: estrutura } = await supabase
                    .from(tabela)
                    .select('*')
                    .limit(1);
                    
                if (estrutura && estrutura.length > 0) {
                    const colunas = Object.keys(estrutura[0]);
                    console.log(`   📊 Colunas: ${colunas.join(', ')}`);
                    resultados[tabela].colunas = colunas;
                }
            }
        } catch (err) {
            console.log(`   ❌ Erro inesperado: ${err.message}`);
            resultados[tabela] = { existe: false, erro: err.message };
        }
        
        console.log(''); // Linha em branco
    }
    
    // Resumo final
    console.log('📊 RESUMO DAS TABELAS:');
    console.log('='.repeat(50));
    
    const existentes = [];
    const inexistentes = [];
    
    for (const [tabela, info] of Object.entries(resultados)) {
        if (info.existe) {
            existentes.push(`${tabela} (${info.registros} registros)`);
        } else {
            inexistentes.push(tabela);
        }
    }
    
    if (existentes.length > 0) {
        console.log('\n✅ TABELAS EXISTENTES:');
        existentes.forEach(tabela => console.log(`   - ${tabela}`));
    }
    
    if (inexistentes.length > 0) {
        console.log('\n❌ TABELAS NÃO ENCONTRADAS:');
        inexistentes.forEach(tabela => console.log(`   - ${tabela}`));
    }
    
    // Verificar se temos as tabelas principais
    const tabelasPrincipais = ['nutricionistas', 'prescricoes', 'instancias'];
    const principaisExistem = tabelasPrincipais.every(t => resultados[t]?.existe);
    
    console.log('\n🎯 STATUS DO SISTEMA:');
    if (principaisExistem) {
        console.log('✅ Tabelas principais existem - Sistema pode funcionar');
    } else {
        console.log('❌ Algumas tabelas principais estão faltando');
    }
    
    return resultados;
}

// Executar verificação
verificarTabelas()
    .then(() => {
        console.log('\n✅ Verificação concluída!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Erro durante verificação:', error);
        process.exit(1);
    });