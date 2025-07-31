# Guia de Teste dos Webhooks - Nutrimatic

## Como Testar o Novo Sistema de Webhooks

### 1. Configuração do n8n

#### Criar o Webhook no n8n
1. Acesse seu n8n
2. Crie um novo workflow
3. Adicione um **Webhook** node como trigger
4. Configure a URL: `/receita-status`
5. Método: `POST`
6. Salve o workflow

#### Configurar o Switch Node
1. Adicione um **Switch** node após o Webhook
2. Configure para verificar o campo `action`
3. Crie duas rotas:
   - `approve` → Para aprovação
   - `reject` → Para reprovação

### 2. Testando no Frontend

#### Teste de Aprovação
1. Abra o modal de aprovação de receita
2. Clique em "Aprovar"
3. Verifique no console do navegador:
   ```
   ✅ Webhook enviado com sucesso para: https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-status
   ✅ Webhook enviado com sucesso para: https://n8n-n8n.0dt1f5.easypanel.host/webhook/receita-status
   ```

#### Teste de Reprovação
1. Abra o modal de aprovação de receita
2. Clique em "Reprovar"
3. Digite uma observação
4. Clique em "Confirmar Reprovação"
5. Verifique no console do navegador os mesmos logs

### 3. Verificando o Payload

#### Payload de Aprovação (action: "approve")
```json
{
  "recipe": {
    "id": "123",
    "nome": "Receita de Teste",
    "url": "https://exemplo.com/receita.pdf"
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "action": "approve"
}
```

#### Payload de Reprovação (action: "reject")
```json
{
  "recipe": {
    "id": "123",
    "nome": "Receita de Teste",
    "url": "https://exemplo.com/receita.pdf"
  },
  "observation": "Receita não atende aos critérios nutricionais",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "action": "reject"
}
```

### 4. Debug e Troubleshooting

#### Verificar se os Webhooks estão sendo disparados
1. Abra as ferramentas de desenvolvedor (F12)
2. Vá para a aba "Network"
3. Filtre por "Fetch/XHR"
4. Execute uma ação de aprovação/reprovação
5. Verifique se aparecem as requisições para os webhooks

#### Logs esperados no Console
```
✅ Webhook enviado com sucesso para: https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-status
✅ Webhook enviado com sucesso para: https://n8n-n8n.0dt1f5.easypanel.host/webhook/receita-status
```

#### Se houver erros
```
❌ Erro ao enviar webhook para https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-status: Error: Failed to fetch
```

### 5. Testando no n8n

#### Configurar Logs no n8n
1. Adicione um **Set** node após o Switch
2. Configure para logar os dados recebidos
3. Adicione um **NoOp** node para visualizar os dados

#### Exemplo de código no n8n
```javascript
// No Set node, configure:
const action = $input.first().json.action;
const recipe = $input.first().json.recipe;
const observation = $input.first().json.observation;

// Para aprovação
if (action === 'approve') {
  console.log('Receita aprovada:', recipe);
  // Sua lógica aqui
}

// Para reprovação
if (action === 'reject') {
  console.log('Receita reprovada:', recipe, 'Motivo:', observation);
  // Sua lógica aqui
}
```

### 6. Validação Final

#### Checklist de Teste
- [ ] Webhook de aprovação dispara com `action: "approve"`
- [ ] Webhook de reprovação dispara com `action: "reject"`
- [ ] Campo `observation` aparece apenas na reprovação
- [ ] Ambos os endpoints (teste e produção) recebem os dados
- [ ] Logs aparecem no console do navegador
- [ ] n8n recebe e processa os dados corretamente

### 7. Migração do Sistema Antigo

#### URLs Antigas (Descontinuadas)
- `https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-aprovada`
- `https://n8n-n8n.0dt1f5.easypanel.host/webhook/receita-aprovada`
- `https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-reprovada`
- `https://n8n-n8n.0dt1f5.easypanel.host/webhook/receita-reprovada`

#### Nova URL Unificada
- `https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-status`
- `https://n8n-n8n.0dt1f5.easypanel.host/webhook/receita-status`

### 8. Benefícios da Nova Implementação

1. **Menos Configuração**: Apenas um webhook para configurar no n8n
2. **Mais Simples**: Lógica unificada baseada no campo `action`
3. **Mais Flexível**: Fácil adicionar novas ações no futuro
4. **Melhor Manutenção**: Menos código duplicado
5. **Mais Confiável**: Menos pontos de falha 