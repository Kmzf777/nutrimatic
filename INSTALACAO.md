# Guia de Instalação - Nutrimatic

Este guia te ajudará a configurar e executar o projeto Nutrimatic localmente.

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## 1. Clonar e Instalar Dependências

```bash
# Clonar o repositório (se aplicável)
git clone <url-do-repositorio>
cd nutrimatic

# Instalar dependências
npm install
```

## 2. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Development
NODE_ENV=development
```

## 3. Configurar Supabase

Siga o guia completo em `SUPABASE_SETUP.md` para:

1. Criar projeto no Supabase
2. Configurar as tabelas necessárias
3. Configurar autenticação
4. Configurar políticas de segurança

## 4. Executar o Projeto

```bash
# Executar em modo desenvolvimento
npm run dev

# Ou com yarn
yarn dev
```

O projeto estará disponível em `http://localhost:3000`

## 5. Testar o Sistema

1. Acesse `http://localhost:3000/register`
2. Crie uma conta de teste
3. Verifique se foi redirecionado para `/setup`
4. Use o botão "Simular Aprovação" para testar o fluxo
5. Acesse o dashboard e teste as funcionalidades

## 6. Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js 13+
│   ├── register/          # Página de registro
│   ├── login/            # Página de login
│   ├── dashboard/        # Dashboard principal
│   ├── setup/           # Página de configuração
│   └── prescricoes/     # Página de prescrições
├── components/           # Componentes React
│   ├── auth/           # Componentes de autenticação
│   └── dashboard/      # Componentes do dashboard
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks customizados
│   └── usePrescricoes.ts # Hook para prescrições
├── lib/               # Utilitários
│   └── supabase.ts    # Cliente Supabase
└── types/             # Tipos TypeScript
    ├── auth.ts        # Tipos de autenticação
    └── prescricao.ts  # Tipos de prescrição
```

## 7. Funcionalidades Implementadas

### ✅ Autenticação
- Registro de usuários
- Login/logout
- Proteção de rotas
- Redirecionamento baseado no status da conta

### ✅ Dashboard
- Informações do nutricionista
- Estatísticas de prescrições
- Contador de prescrições restantes
- Interface responsiva

### ✅ Prescrições
- Listagem de prescrições
- Aprovação/rejeição
- Filtros por status
- Modal para observações

### ✅ Setup
- Página de configuração inicial
- Status de aprovação da conta
- Informações do usuário

## 8. Próximos Passos

Após a configuração inicial:

1. **Integrar com n8n**: Configure webhooks para gerar prescrições
2. **Personalizar UI**: Ajuste cores, logos e branding
3. **Adicionar funcionalidades**: Chat, relatórios, etc.
4. **Deploy**: Configure para produção
5. **Monitoramento**: Implemente logs e métricas

## 9. Troubleshooting

### Problemas Comuns

**Erro de conexão com Supabase:**
- Verifique as variáveis de ambiente
- Confirme se o projeto está ativo no Supabase

**Erro de autenticação:**
- Verifique as políticas RLS no Supabase
- Confirme as URLs de redirecionamento

**Erro de build:**
- Verifique se todas as dependências estão instaladas
- Confirme se o Node.js está na versão correta

### Comandos Úteis

```bash
# Verificar versão do Node
node --version

# Limpar cache
npm run build
rm -rf .next
npm run dev

# Verificar dependências
npm audit
npm outdated
```

## 10. Suporte

Para dúvidas ou problemas:

1. Verifique a documentação do Supabase
2. Consulte os logs do console
3. Verifique o guia de configuração do Supabase
4. Abra uma issue no repositório

---

**Nota**: Este é um projeto em desenvolvimento. Algumas funcionalidades podem estar em evolução. 