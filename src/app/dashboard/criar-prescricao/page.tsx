'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton, DashboardInput } from '@/components/dashboard/DashboardPageLayout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

export default function CriarPrescricaoPage() {
  const router = useRouter();
  const { user, nutricionista } = useAuth();
  const [phoneInput, setPhoneInput] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error'; text: string }>(null);

  const sanitizePhone = (value: string) => value.replace(/\D+/g, '');
  const phoneDigits = sanitizePhone(phoneInput);
  const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 13;

  const handleSubmit = async () => {
    setFeedback(null);
    if (!isPhoneValid) {
      setFeedback({ type: 'error', text: 'Informe um número válido com DDD.' });
      return;
    }
    if (!observacoes || !observacoes.trim()) {
      setFeedback({ type: 'error', text: 'Digite a anamnese no campo de texto.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoints = [
        'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/nutrimatic-presc',
        'https://n8n-n8n.0dt1f5.easypanel.host/webhook/nutrimatic-presc',
      ];

      const payload = {
        timestamp: new Date().toISOString(),
        number: phoneDigits,
        raw_number: phoneInput,
        text: observacoes,
        page: 'dashboard/criar-prescricao',
        user: user ? { id: user.id, email: user.email, phone: (user as any).phone || null } : null,
        nutricionista: nutricionista || null,
      } as any;

      const results = await Promise.allSettled(
        endpoints.map(async (url) => {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const contentType = res.headers.get('content-type') || '';
          const data = contentType.includes('application/json') ? await res.json() : await res.text();
          return { url, ok: res.ok, data };
        })
      );

      const atLeastOneOk = results.some((r) => r.status === 'fulfilled' && r.value.ok);
      if (!atLeastOneOk) {
        setFeedback({ type: 'error', text: 'Falha ao enviar aos webhooks. Tente novamente.' });
        return;
      }

      setFeedback({ type: 'success', text: 'Solicitação enviada. Aguarde a geração da prescrição.' });
    } catch (err) {
      setFeedback({ type: 'error', text: 'Ocorreu um erro ao enviar. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title="Faça a Anamnese"
          actions={
            <DashboardButton variant="secondary" size="sm" onClick={() => router.back()}>
              ← Voltar
            </DashboardButton>
          }
        >
          <ContentCard>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Número do WhatsApp</label>
                <DashboardInput
                  placeholder="Ex.: +55 11 91234-5678"
                  value={phoneInput}
                  onChange={(e: any) => setPhoneInput(e.target.value)}
                  type="tel"
                />
                <p className="text-xs text-gray-500 mt-1">Informe com DDD. Ex.: 11912345678 ou +55 11 91234-5678</p>
                {!isPhoneValid && phoneInput && (
                  <p className="text-xs text-red-600 mt-1">Número inválido. Verifique DDI/DDD e dígitos.</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Anamnese</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-300 min-h-[280px]"
                  placeholder={"Nome: João Batista\nIdade: 69"}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>

              <div className="pt-2 space-y-3">
                <DashboardButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Enviando...</span>
                  ) : (
                    'Gerar Prescrição'
                  )}
                </DashboardButton>
                {feedback && (
                  <div className={`text-sm rounded-lg p-3 ${
                    feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {feedback.text}
                  </div>
                )}
              </div>
            </div>
          </ContentCard>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


