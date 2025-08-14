# Página Criar Cliente

## Funcionalidades Implementadas

### 📍 Localização
- **URL**: `/dashboard/criar-cliente`
- **Acesso**: Através do botão "Novo Cliente" na página de clientes

### 📝 Campos do Formulário

#### 1. Nome do Cliente
- **Tipo**: Campo de texto obrigatório
- **Validação**: Não pode estar vazio
- **Placeholder**: "Digite o nome completo"

#### 2. Número de Telefone
- **Tipo**: Campo de telefone obrigatório
- **Formato**: Aceita apenas números
- **Validação**: 
  - Deve começar com "55" (código do Brasil)
  - Mínimo de 12 dígitos (55 + DDD + número)
  - Adiciona automaticamente "55" se não fornecido
- **Exemplo**: `5511999999999` → `+55 (11) 99999-9999`

#### 3. Status
- **Tipo**: Select obrigatório
- **Opções**:
  - **Novo**: Cliente sem follow up e suporte
  - **Ativo**: Cliente com follow up e suporte

### 🎨 Interface e UX

#### Design
- Layout responsivo e moderno
- Cards com backdrop blur e sombras
- Cores consistentes com o tema Nutrimatic
- Ícones do Lucide React

#### Validação em Tempo Real
- Feedback visual para campos inválidos
- Formatação automática do número de telefone
- Explicação clara sobre os status
- Botão desabilitado quando formulário inválido

#### Estados de Loading
- Spinner durante o envio
- Mensagens de sucesso/erro específicas
- Redirecionamento automático após sucesso
- Tratamento de cliente duplicado

### 🔗 Webhooks

#### URL Enviada
- `https://n8n-n8n.0dt1f5.easypanel.host/webhook/criar-cliente`

#### Método
- **POST**

#### Comportamento
- **Aguarda resposta** do servidor
- **Valida status** da resposta antes de prosseguir
- **Trata erros** de conectividade e servidor

#### Dados Enviados
```json
{
  "nutricionista": {
    "id": "uuid-do-nutricionista",
    "nome": "Nome do Nutricionista",
    "email": "email@exemplo.com",
    "telefone": "telefone-do-nutricionista"
  },
  "cliente": {
    "nome": "Nome do Cliente",
    "numero": "5511999999999",
    "status": "novo",
    "numero_formatado": "+55 (11) 99999-9999"
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "action": "criar_cliente"
}
```

#### Resposta Esperada
```json
[
  {
    "status": "true"
  }
]
```

#### Status de Resposta
- **`"true"`**: Cliente criado com sucesso
- **`"false"`**: Cliente já existe no sistema

### 🧭 Navegação

#### Entrada
- Botão "Novo Cliente" na página `/dashboard/clientes`
- Navegação via Next.js Router

#### Saída
- Botão "Voltar" para `/dashboard/clientes`
- Redirecionamento automático após sucesso
- Navegação via Next.js Router

### 🔒 Segurança

#### Autenticação
- Página protegida com `ProtectedRoute`
- Requer login de nutricionista
- Acesso apenas para usuários autenticados

#### Validação
- Validação client-side para melhor UX
- Sanitização de dados
- Prevenção de XSS

### 📱 Responsividade

#### Breakpoints
- **Mobile**: Layout em coluna única
- **Tablet**: Layout adaptativo
- **Desktop**: Layout otimizado

#### Componentes
- Inputs responsivos
- Botões adaptáveis
- Cards flexíveis

### 🎯 Melhorias Futuras

#### Sugestões
1. **Validação de número duplicado**
2. **Integração com WhatsApp Business API**
3. **Upload de foto do cliente**
4. **Campos adicionais (CPF, endereço, etc.)**
5. **Histórico de criação**
6. **Notificações push**

#### Funcionalidades Avançadas
1. **Importação em lote**
2. **Sincronização com CRM**
3. **Relatórios de criação**
4. **Templates de mensagem**
5. **Automação de follow-up**

### 🐛 Troubleshooting

#### Problemas Comuns
1. **Webhook não enviado**: Verificar conectividade
2. **Cliente já existe**: Verificar número de telefone
3. **Validação falha**: Verificar formato do número
4. **Erro de autenticação**: Fazer logout e login novamente

#### Logs
- Console do navegador para erros
- Network tab para webhooks
- Supabase logs para dados

### 📋 Checklist de Teste

- [ ] Acesso à página
- [ ] Preenchimento do nome
- [ ] Validação do número
- [ ] Seleção do status
- [ ] Envio do formulário
- [ ] Recebimento da resposta do webhook
- [ ] Validação do status da resposta
- [ ] Tratamento de cliente duplicado
- [ ] Redirecionamento
- [ ] Responsividade
- [ ] Validações de erro
- [ ] Estados de loading
