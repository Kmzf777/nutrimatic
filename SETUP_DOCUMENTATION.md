# Página de Setup - Nutrimatic

## Visão Geral

A página `/setup` é um formulário dividido em etapas (wizard) para configurar a conta de novos usuários do Nutrimatic. Ela foi projetada para coletar informações essenciais de forma organizada e intuitiva.

## Estrutura

### Páginas e Componentes

```
src/
├── app/setup/
│   └── page.tsx                 # Página principal do setup
├── components/setup/
│   ├── SetupLayout.tsx          # Layout principal com progress bar
│   ├── SetupStep1.tsx           # Dados Pessoais
│   ├── SetupStep2.tsx           # Dados Profissionais
│   ├── SetupStep3.tsx           # Configurações da Clínica
│   └── SetupStep4.tsx           # Preferências e Resumo
└── types/
    └── setup.ts                 # Tipos TypeScript
```

### Etapas do Formulário

1. **Dados Pessoais**
   - Nome completo
   - Email
   - Telefone
   - CPF

2. **Dados Profissionais**
   - Especialidade principal
   - Número de registro profissional
   - Tempo de experiência

3. **Configurações da Clínica**
   - Nome da clínica/consultório
   - Endereço completo
   - Cidade e estado
   - CEP

4. **Preferências**
   - Idioma preferido
   - Fuso horário
   - Notificações por email
   - Resumo da configuração

## Funcionalidades

### Validação
- Validação em tempo real para cada campo
- Formatação automática de CPF, telefone e CEP
- Mensagens de erro contextuais

### Navegação
- Botões "Voltar" e "Próximo" em cada etapa
- Indicador de progresso visual
- Navegação responsiva

### UX/UI
- Design consistente com o tema Nutrimatic
- Feedback visual para estados de loading
- Informações contextuais e dicas
- Layout responsivo

## Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Hooks** - Gerenciamento de estado

## Como Usar

### Acesso
A página está disponível em `/setup` e pode ser acessada após o registro do usuário.

### Fluxo
1. Usuário acessa `/setup`
2. Preenche cada etapa do formulário
3. Validação automática dos campos
4. Navegação entre etapas
5. Finalização e redirecionamento para `/dashboard`

## Personalização

### Adicionar Novos Campos
1. Atualizar a interface `SetupFormData` em `types/setup.ts`
2. Adicionar campos no `initialFormData` em `app/setup/page.tsx`
3. Implementar validação no componente da etapa correspondente

### Modificar Etapas
1. Atualizar o array `steps` em `SetupLayout.tsx`
2. Adicionar/remover componentes de etapa
3. Atualizar a lógica de renderização em `page.tsx`

### Estilização
- Cores: Usar as classes `nutrimatic-*` do Tailwind
- Componentes: Seguir o padrão de design existente
- Responsividade: Usar classes `md:`, `lg:` do Tailwind

## Próximos Passos

- [ ] Integração com API para salvar dados
- [ ] Persistência de dados em localStorage
- [ ] Validação de CPF real
- [ ] Integração com serviço de CEP
- [ ] Testes unitários
- [ ] Testes de integração

## Contribuição

Para contribuir com melhorias na página de setup:

1. Siga os padrões de código existentes
2. Mantenha a consistência visual
3. Adicione validações apropriadas
4. Teste em diferentes dispositivos
5. Documente mudanças significativas 