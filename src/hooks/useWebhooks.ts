'use client';

interface WebhookData {
  recipe: any;
  observation?: string;
  timestamp: string;
  action: 'approve' | 'reject';
  [key: string]: any;
}

interface WebhookConfig {
  urls: string[];
  data: WebhookData;
}

export const useWebhooks = () => {
  const sendWebhooks = async (config: WebhookConfig): Promise<void> => {
    const { urls, data } = config;

    // Verificar conectividade básica antes de tentar enviar webhooks
    if (!navigator.onLine) {
      console.warn('🌐 Sem conexão com a internet - webhooks não serão enviados');
      return;
    }

    // Disparar webhooks em paralelo SEM aguardar resposta
    urls.forEach((url) => {
      // Usar fetch sem await para não bloquear
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then((response) => {
        if (response.ok) {
          console.log(`✅ Webhook enviado com sucesso para: ${url}`);
        } else {
          console.warn(`⚠️ Webhook retornou status ${response.status} para: ${url}`);
        }
      })
      .catch((error) => {
        // Tratar diferentes tipos de erro de forma mais simples
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          console.warn(`🌐 Erro de conectividade ao enviar webhook para ${url} - verifique sua conexão`);
        } else {
          console.error(`❌ Erro ao enviar webhook para ${url}:`, error);
        }
      });
    });
  };

  const sendRecipeStatusWebhook = async (recipe: any, action: 'approve' | 'reject', observation?: string): Promise<void> => {
    const webhookData: WebhookData = {
      recipe,
      timestamp: new Date().toISOString(),
      action
    };

    // Adicionar observação apenas para reprovação
    if (action === 'reject' && observation) {
      webhookData.observation = observation;
    }

    const webhookUrls = [
      'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-status',
      'https://n8n-n8n.0dt1f5.easypanel.host/webhook/receita-status'
    ];

    // Disparar webhooks sem aguardar resposta
    sendWebhooks({
      urls: webhookUrls,
      data: webhookData
    });
  };

  // Funções mantidas para compatibilidade, mas agora usam o webhook unificado
  const sendRecipeRejectionWebhooks = async (recipe: any, observation: string): Promise<void> => {
    sendRecipeStatusWebhook(recipe, 'reject', observation);
  };

  const sendRecipeApprovalWebhooks = async (recipe: any): Promise<void> => {
    sendRecipeStatusWebhook(recipe, 'approve');
  };

  return {
    sendWebhooks,
    sendRecipeStatusWebhook,
    sendRecipeRejectionWebhooks,
    sendRecipeApprovalWebhooks
  };
}; 