// Configuração dos webhooks
const WEBHOOK_URLS = [
  'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/nutrimatic-status',
  'https://n8n-n8n.0dt1f5.easypanel.host/webhook/nutrimatic-status'
];

// Interface para dados do webhook
interface WebhookData {
  action: 'Aprovar' | 'Reprovar';
  prescricao: {
    id: string;
    identificacao: string;
    nome_cliente: string;
    data: string;
    json: any;
    url: string;
    status: string;
  };
  observacoes?: string;
  timestamp?: string;
}

// Função para disparar webhooks
export async function triggerWebhook(data: WebhookData): Promise<void> {
  const payload = {
    ...data,
    timestamp: new Date().toISOString()
  };

  console.log('🔔 Disparando webhook:', payload);

  // Dispara para ambas as URLs em paralelo
  const promises = WEBHOOK_URLS.map(async (url) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(`⚠️ Webhook falhou para ${url}:`, response.status, response.statusText);
      } else {
        console.log(`✅ Webhook enviado com sucesso para ${url}`);
      }

      return { url, success: response.ok, status: response.status };
    } catch (error) {
      console.error(`❌ Erro no webhook para ${url}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { url, success: false, error: errorMessage };
    }
  });

  // Aguarda todas as chamadas
  const results = await Promise.allSettled(promises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const { url, success } = result.value;
      if (!success) {
        console.warn(`Webhook ${index + 1} (${url}) falhou`);
      }
    } else {
      console.error(`Webhook ${index + 1} teve erro:`, result.reason);
    }
  });
}

// Função específica para aprovação
export async function triggerApprovalWebhook(prescricao: any): Promise<void> {
  await triggerWebhook({
    action: 'Aprovar',
    prescricao: {
      id: prescricao.id,
      identificacao: prescricao.identificacao,
      nome_cliente: prescricao.nome_cliente,
      data: prescricao.data,
      json: prescricao.json,
      url: prescricao.url,
      status: prescricao.status,
    }
  });
}

// Função específica para reprovação
export async function triggerRejectionWebhook(prescricao: any, observacoes: string): Promise<void> {
  await triggerWebhook({
    action: 'Reprovar',
    prescricao: {
      id: prescricao.id,
      identificacao: prescricao.identificacao,
      nome_cliente: prescricao.nome_cliente,
      data: prescricao.data,
      json: prescricao.json,
      url: prescricao.url,
      status: prescricao.status,
    },
    observacoes
  });
}