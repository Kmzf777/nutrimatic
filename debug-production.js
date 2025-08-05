// Script para diagnosticar problemas de produção
console.log('🔍 Diagnóstico de Produção - Nutrimatic');
console.log('=====================================');

// Verificar variáveis de ambiente
console.log('\n📋 Variáveis de Ambiente:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ NÃO CONFIGURADA');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ NÃO CONFIGURADA');

// Verificar se as URLs são válidas
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('URL do Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('Chave Anônima (primeiros 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');
}

// Verificar ambiente
console.log('\n🌍 Ambiente:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);

// Verificar se está usando valores placeholder
if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
  console.log('\n⚠️  PROBLEMA DETECTADO:');
  console.log('A URL do Supabase está usando valor placeholder!');
  console.log('Isso indica que as variáveis não estão configuradas corretamente.');
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder')) {
  console.log('\n⚠️  PROBLEMA DETECTADO:');
  console.log('A chave anônima está usando valor placeholder!');
  console.log('Isso indica que as variáveis não estão configuradas corretamente.');
}

console.log('\n🔧 SOLUÇÕES:');
console.log('1. Configure as variáveis de ambiente na Vercel:');
console.log('   - Vá para o dashboard da Vercel');
console.log('   - Selecione seu projeto');
console.log('   - Vá em Settings > Environment Variables');
console.log('   - Adicione:');
console.log('     NEXT_PUBLIC_SUPABASE_URL=https://rdlmvcvwrofufvlmldlv.supabase.co');
console.log('     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbG12Y3Z3cm9mdWZ2bG1sZGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjQzMjQsImV4cCI6MjA2OTkwMDMyNH0.1TpCyIdb4eBHqL2mFCg6MgbGv__zXP67r6euUrrfakE');
console.log('2. Faça um novo deploy após configurar as variáveis');
console.log('3. Verifique se o banco de dados Supabase está ativo');

console.log('\n📞 Para verificar se o Supabase está funcionando:');
console.log('1. Acesse: https://rdlmvcvwrofufvlmldlv.supabase.co');
console.log('2. Verifique se o projeto está ativo');
console.log('3. Teste a conexão no dashboard do Supabase'); 