# 🧪 Como Testar os Webhooks Implementados

## 🎯 **Teste Rápido**

### **1. Acessar Página de Prescrição Individual**
1. Vá para `/dashboard/prescricoes`
2. Clique em qualquer prescrição com status **"Pendente"**
3. Você será redirecionado para `/dashboard/prescricoes/nome-do-cliente`

### **2. Teste de Aprovação**
1. Na página individual, clique em **"Aprovar Prescrição"**
2. **Observe no Console (F12)**:
   ```
   🔔 Disparando webhook de aprovação...
   🔔 Disparando webhook: {action: "Aprovar", prescricao: {...}}
   ✅ Webhook enviado com sucesso para https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/nutrimatic-status
   ✅ Webhook enviado com sucesso para https://n8n-n8n.0dt1f5.easypanel.host/webhook/nutrimatic-status
   💾 Atualizando status no banco...
   ✅ Prescrição aprovada com sucesso!
   ```
3. **Verifique na aba Network**: Dois requests POST para os endpoints

### **3. Teste de Reprovação**
1. Na página individual, clique em **"Solicitar Refazer"**
2. Preencha as **observações** (obrigatório)
3. Clique em **"Solicitar Refazer"** (botão vermelho)
4. **Observe no Console**:
   ```
   🔔 Disparando webhook de reprovação...
   🔔 Disparando webhook: {action: "Reprovar", prescricao: {...}, observacoes: "..."}
   ✅ Webhook enviado com sucesso para https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/nutrimatic-status
   ✅ Webhook enviado com sucesso para https://n8n-n8n.0dt1f5.easypanel.host/webhook/nutrimatic-status
   💾 Atualizando status no banco...
   ✅ Prescrição reprovada com sucesso!
   ```

## 🔍 **Como Monitorar**

### **Browser DevTools**
```javascript
// Abra Console (F12) e execute:
console.log('Monitorando webhooks...');

// Os logs aparecerão automaticamente quando você aprovar/reprovar
```

### **Network Tab**
1. Abra **DevTools (F12)** → **Network**
2. Filtre por **"nutrimatic-status"**
3. Execute ação de aprovar/reprovar
4. Veja os 2 requests POST sendo feitos

### **cURL para Testar Endpoints**
```bash
# Teste manual dos endpoints
curl -X POST https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/nutrimatic-status \
  -H "Content-Type: application/json" \
  -d '{
    "action": "Aprovar",
    "prescricao": {
      "id": "test-123",
      "nome_cliente": "João Teste",
      "status": "Pendente"
    },
    "timestamp": "2025-01-08T15:00:00.000Z"
  }'

curl -X POST https://n8n-n8n.0dt1f5.easypanel.host/webhook/nutrimatic-status \
  -H "Content-Type: application/json" \
  -d '{
    "action": "Reprovar", 
    "prescricao": {
      "id": "test-456",
      "nome_cliente": "Maria Teste",
      "status": "Pendente"
    },
    "observacoes": "Teste de webhook",
    "timestamp": "2025-01-08T15:00:00.000Z"
  }'
```

## 📊 **Payload de Exemplo**

### **Aprovação**
```json
{
  "action": "Aprovar",
  "prescricao": {
    "id": "abcd-1234-efgh-5678",
    "identificacao": "nutricionista-uuid-9999",
    "nome_cliente": "João da Silva",
    "data": "2025-01-08T14:30:22.123Z",
    "json": {
      "cliente": "João da Silva",
      "alimentos": ["Arroz integral", "Frango grelhado"],
      "observacoes_nutricionista": "Dieta equilibrada"
    },
    "url": "https://storage.supabase.co/prescricao-joao.pdf",
    "status": "Pendente"
  },
  "timestamp": "2025-01-08T15:45:30.456Z"
}
```

### **Reprovação**
```json
{
  "action": "Reprovar",
  "prescricao": {
    "id": "abcd-1234-efgh-5678",
    "identificacao": "nutricionista-uuid-9999", 
    "nome_cliente": "Maria Santos",
    "data": "2025-01-08T14:30:22.123Z",
    "json": {
      "cliente": "Maria Santos",
      "alimentos": ["Salada verde", "Peixe assado"],
      "observacoes_nutricionista": "Foco em vegetais"
    },
    "url": "https://storage.supabase.co/prescricao-maria.pdf",
    "status": "Pendente"
  },
  "observacoes": "Faltam informações sobre restrições alimentares. Por favor, detalhe melhor as porções recomendadas.",
  "timestamp": "2025-01-08T15:45:30.456Z"
}
```

## ⚡ **Estados Visuais Durante Teste**

### **Botão de Aprovar**
- **Normal**: "Aprovar Prescrição"
- **Webhook**: "Enviando..." (spinner)
- **Processando**: "Aprovando..." (spinner)

### **Botão de Reprovar**
- **Normal**: "Solicitar Refazer"
- **Webhook**: "Enviando..." (spinner) 
- **Processando**: "Processando..." (spinner)

## 🔧 **Troubleshooting**

### **Webhook não dispara**
```javascript
// Verifique se as URLs estão corretas:
console.log(WEBHOOK_URLS);
// Deve mostrar os 2 endpoints N8N
```

### **Erro de CORS**
- Verifique se N8N aceita requests do domínio
- Console mostrará erro CORS se houver problema

### **Timeout**
- Webhooks com timeout mostrarão erro no console
- Banco será atualizado mesmo se webhook falhar

### **Dados inválidos**
```javascript
// Verifique estrutura da prescrição:
console.log('Prescrição selecionada:', selectedPrescricao);
// Deve ter todos os campos obrigatórios
```

## ✅ **Checklist de Teste**

- [ ] Console logs aparecem corretamente
- [ ] 2 requests POST são feitos (Network tab)
- [ ] Payloads contém dados completos
- [ ] Estados visuais funcionam (loading)
- [ ] Erro handling funciona se endpoint estiver offline
- [ ] Redirecionamento após sucesso
- [ ] Observações são incluídas na reprovação

## 🎯 **Teste de Integração com N8N**

### **Configurar N8N Workflow**
1. Criar workflow que escuta os webhooks
2. Configurar ação baseada no campo `action`
3. Usar dados da `prescricao` para processamento
4. Verificar campo `observacoes` para reprovações

### **Monitorar N8N**
- Logs do N8N mostrarão requests recebidos
- Verificar se estrutura de dados está correta
- Testar diferentes cenários (aprovação/reprovação)

Os webhooks estão **100% funcionais** e prontos para integração! 🚀