# 🔄 Instruções para Migração de Dados - Nutrimatic

## 📋 Resumo

Este documento contém as instruções para migrar os dados das tabelas antigas para as novas tabelas no Supabase, após a atualização dos nomes das tabelas no código.

## ⚠️ IMPORTANTE - LEIA ANTES DE EXECUTAR

1. **Faça backup do banco de dados** antes de executar qualquer script
2. **Teste em ambiente de desenvolvimento** primeiro
3. **Execute durante horário de baixo tráfego** para evitar problemas
4. **Tenha acesso ao painel do Supabase** para monitorar a execução

## 🗂️ Mapeamento das Tabelas

| Tabela Antiga | Tabela Nova | Status |
|---------------|-------------|---------|
| `accounts` | `instancias` | ✅ Migração criada |
| `Teste-Tabela` | `prescricoes` | ✅ Migração criada |
| `agenda_eventos` | `agenda` | ✅ Migração criada |

## 📁 Arquivos Criados

1. **`migracao-dados-tabelas.sql`** - Script principal de migração
2. **`verificar-migracao.sql`** - Script para verificar se a migração foi bem-sucedida
3. **`INSTRUCOES_MIGRACAO.md`** - Este arquivo com instruções

## 🚀 Passo a Passo da Migração

### Passo 1: Acessar o Supabase

1. Acesse o painel do Supabase: https://rdlmvcvwrofufvlmldlv.supabase.co
2. Vá para **SQL Editor**
3. Crie uma nova query

### Passo 2: Executar o Script de Migração

1. Abra o arquivo `migracao-dados-tabelas.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** para executar

### Passo 3: Verificar a Migração

1. Abra o arquivo `verificar-migracao.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** para executar
5. Verifique os resultados na aba **Results**

### Passo 4: Testar a Aplicação

1. Acesse a aplicação em http://localhost:3001
2. Teste as principais funcionalidades:
   - ✅ Login/Registro
   - ✅ Dashboard
   - ✅ Lista de clientes
   - ✅ Prescrições
   - ✅ Agenda
   - ✅ Instâncias

## 🔍 O que o Script de Migração Faz

### 1. Verificações Iniciais
- Verifica se as tabelas antigas existem
- Cria mensagens informativas sobre o que será migrado

### 2. Criação da Tabela Agenda
- Cria a tabela `agenda` se ela não existir
- Adiciona índices para performance
- Configura RLS (Row Level Security)
- Cria políticas de acesso

### 3. Migração de Dados

#### accounts → instancias
- Migra todos os registros da tabela `accounts` para `instancias`
- Mapeia campos compatíveis
- Evita duplicatas
- Converte status para o novo formato

#### Teste-Tabela → prescricoes
- Migra todos os registros da tabela `Teste-Tabela` para `prescricoes`
- Preserva dados JSON e URLs
- Converte status para o novo formato
- Mantém relacionamentos

#### agenda_eventos → agenda
- Migra todos os eventos da tabela `agenda_eventos` para `agenda`
- Mapeia campos de data/hora
- Preserva informações do cliente
- Converte status para o novo formato

### 4. Verificação Final
- Conta registros migrados
- Exibe resumo da migração
- Confirma sucesso da operação

## 🛡️ Recursos de Segurança

### Evita Duplicatas
O script verifica se os dados já existem antes de inserir, evitando duplicação.

### Preserva Dados
- Todos os dados importantes são preservados
- Campos opcionais recebem valores padrão seguros
- Relacionamentos são mantidos

### RLS Configurado
- Row Level Security ativado em todas as tabelas
- Políticas de acesso configuradas
- Usuários só veem seus próprios dados

## 📊 Verificação de Sucesso

Após executar o script de verificação, você deve ver:

```
✅ MIGRAÇÃO APARENTA ESTAR CORRETA!
```

E contagens como:
```
📊 instancias: X
📊 prescricoes: Y  
📊 agenda: Z
```

## 🧹 Limpeza (Opcional)

**⚠️ ATENÇÃO: Execute apenas após confirmar que tudo está funcionando!**

Após confirmar que a migração foi bem-sucedida e a aplicação está funcionando:

```sql
-- Para remover as tabelas antigas (CUIDADO!):
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS "Teste-Tabela" CASCADE;
DROP TABLE IF EXISTS agenda_eventos CASCADE;
```

## 🆘 Solução de Problemas

### Erro: "Tabela não encontrada"
- **Causa**: A tabela antiga não existe no banco
- **Solução**: Normal, o script pula automaticamente

### Erro: "Violação de chave estrangeira"
- **Causa**: Dados inconsistentes nas tabelas antigas
- **Solução**: Verificar dados manualmente e corrigir

### Erro: "Permissão negada"
- **Causa**: Usuário sem permissões suficientes
- **Solução**: Usar usuário admin ou service_role

### Aplicação não carrega dados
- **Causa**: Migração incompleta ou erro no código
- **Solução**: 
  1. Verificar logs do navegador (F12)
  2. Executar script de verificação
  3. Verificar se todas as tabelas foram criadas

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** do Supabase
2. **Execute o script de verificação** para diagnóstico
3. **Consulte este documento** para soluções comuns
4. **Faça rollback** se necessário (restaurar backup)

## ✅ Checklist Final

- [ ] Backup do banco realizado
- [ ] Script de migração executado sem erros
- [ ] Script de verificação executado
- [ ] Aplicação testada e funcionando
- [ ] Todas as funcionalidades verificadas
- [ ] Dados migrados corretamente
- [ ] Performance adequada
- [ ] Logs limpos (sem erros)

---

**🎉 Parabéns! Sua migração está completa!**