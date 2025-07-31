# Documentação dos Webhooks - Nutrimatic

## Visão Geral

O sistema de webhooks da Nutrimatic foi otimizado para usar um único endpoint para ambos os casos de aprovação e reprovação de receitas, diferenciando pela ação (`action`) enviada no payload. **Os webhooks são disparados de forma assíncrona, sem aguardar resposta, garantindo máxima performance da interface.**

## Endpoints

### Webhook Principal
- **URL de Teste**: `https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-status`
- **URL de Produção**: `https://n8n-n8n.0dt1f5.easypanel.host/webhook/receita-status`

## Estrutura do Payload

### Para Aprovação de Receita
```json
{
  "recipe": {
    "id": "string",
    "nome": "string",
    "url": "string"
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "action": "approve"
}
```

### Para Reprovação de Receita
```json
{
  "recipe": {
    "id": "string",
    "nome": "string",
    "url": "string"
  },
  "observation": "string - motivo da reprovação",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "action": "reject"
}
```

## Campos do Payload

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `recipe` | object | ✅ | Dados da receita (id, nome, url) |
| `action` | string | ✅ | Tipo de ação: `"approve"` ou `"reject"` |
| `timestamp` | string | ✅ | Data/hora do evento em ISO 8601 |
| `observation` | string | ❌ | Motivo da reprovação (apenas para `action: "reject"`) |

## Comportamento Assíncrono

### Características
- **Não bloqueante**: Os webhooks são disparados sem aguardar resposta
- **Execução paralela**: Múltiplos webhooks são enviados simultaneamente
- **Performance otimizada**: Interface permanece responsiva
- **Logs em background**: Status dos webhooks é logado no console

### Vantagens
1. **Interface responsiva**: Usuário não percebe delay
2. **Melhor UX**: Ações são confirmadas imediatamente
3. **Robustez**: Falhas em webhooks não afetam a funcionalidade principal
4. **Escalabilidade**: Sistema funciona mesmo com webhooks lentos

## Implementação no n8n

### Exemplo de Workflow

1. **Trigger**: Webhook recebe o payload
2. **Switch**: Verifica o campo `action`
   - Se `action === "approve"` → Executa lógica de aprovação
   - Se `action === "reject"` → Executa lógica de reprovação

### Código de Exemplo (n8n)

```javascript
// No n8n, você pode usar um Switch node:
const action = $input.first().json.action;

if (action === 'approve') {
  // Lógica para aprovação
  // - Enviar notificação de aprovação
  // - Atualizar status no banco
  // - etc.
} else if (action === 'reject') {
  // Lógica para reprovação
  // - Enviar notificação de reprovação com observação
  // - Atualizar status no banco
  // - etc.
}
```

## Vantagens da Nova Implementação

1. **Simplicidade**: Um único endpoint para gerenciar
2. **Consistência**: Estrutura de dados padronizada
3. **Flexibilidade**: Fácil de estender para novas ações
4. **Manutenibilidade**: Menos código duplicado
5. **Performance**: Menos endpoints para monitorar
6. **Responsividade**: Interface não é bloqueada pelos webhooks

## Compatibilidade

As funções antigas (`sendRecipeApprovalWebhooks` e `sendRecipeRejectionWebhooks`) ainda estão disponíveis para manter compatibilidade com código existente, mas internamente usam o novo sistema unificado.

## Logs e Debug

O sistema registra logs detalhados no console de forma assíncrona:
- ✅ Webhook enviado com sucesso
- ⚠️ Webhook retornou status de erro
- ❌ Erro ao enviar webhook

**Nota**: Os logs aparecem no console do navegador, mas não bloqueiam a interface do usuário.

## Exemplo de Uso no Frontend

```typescript
import { useWebhooks } from '@/hooks/useWebhooks';

const { sendRecipeStatusWebhook } = useWebhooks();

// Aprovar receita (não aguarda resposta do webhook)
sendRecipeStatusWebhook(recipe, 'approve');

// Reprovar receita (não aguarda resposta do webhook)
sendRecipeStatusWebhook(recipe, 'reject', 'Motivo da reprovação');
```

## Considerações de Performance

### Tempo de Resposta
- **Antes**: Interface podia travar aguardando webhooks
- **Agora**: Interface responde imediatamente

### Tratamento de Erros
- Falhas em webhooks não afetam a funcionalidade principal
- Erros são logados mas não interrompem o processo
- Sistema continua funcionando mesmo se webhooks falharem

### Monitoramento
- Webhooks são executados em background
- Logs permitem monitorar status sem impactar UX
- Falhas não são visíveis para o usuário final

## Troubleshooting

### Erro "Failed to fetch"
Este erro pode ocorrer por:
1. **Sem conexão com a internet**
   - Verifique se está conectado à internet
   - O sistema detecta automaticamente e não tenta enviar webhooks

2. **URL do webhook inacessível**
   - Verifique se as URLs estão corretas
   - Confirme se o servidor n8n está online

3. **Problemas de CORS**
   - Verifique se o servidor permite requisições do domínio
   - Configure CORS no servidor se necessário

### Logs de Erro
O sistema registra diferentes tipos de erro:
- `🌐 Erro de conectividade` - Problemas de rede
- `⚠️ Webhook retornou status X` - Servidor retornou erro HTTP
- `❌ Erro ao enviar webhook` - Outros tipos de erro

### Soluções Recomendadas
1. **Verificar conectividade**: Teste se consegue acessar outros sites
2. **Verificar URLs**: Confirme se as URLs dos webhooks estão corretas
3. **Verificar n8n**: Acesse o painel do n8n para verificar se está online
4. **Verificar console**: Abra as ferramentas de desenvolvedor (F12) para ver logs detalhados 