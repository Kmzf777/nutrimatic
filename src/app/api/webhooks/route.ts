import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhookType, data } = body;

    let webhookUrl = '';
    
    if (webhookType === 'test') {
      webhookUrl = 'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/receita-aprovada';
    } else if (webhookType === 'production') {
      webhookUrl = 'https://n8n-n8n.0dt1f5.easypanel.host/webhook/receita-aprovada';
    } else {
      return NextResponse.json({ error: 'Tipo de webhook inválido' }, { status: 400 });
    }

    // Fazer a requisição para o webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        status: response.status,
        message: `Webhook ${webhookType} disparado com sucesso`
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        status: response.status,
        message: `Webhook ${webhookType} retornou status ${response.status}`
      }, { status: response.status });
    }

  } catch (error) {
    console.error('Erro ao disparar webhook:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
} 