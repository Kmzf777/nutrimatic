'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton, DashboardInput } from '@/components/dashboard/DashboardPageLayout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { QrCode, Smartphone, CheckCircle2, Info, Shield, HelpCircle, RefreshCw, Phone } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function ConnectInstancePage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, nutricionista } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);
  const [phoneInput, setPhoneInput] = useState('');

  const sanitizePhone = (value: string) => value.replace(/\D+/g, '');
  const phoneDigits = sanitizePhone(phoneInput);
  const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 13; // BR: 10-11, permite c/código do país

  const handleGenerate = async () => {
    setFeedback(null);
    setIsGenerating(true);
    setShowQR(false);
    setQrDataUrl(null);

    try {
      if (!isPhoneValid) {
        setFeedback({ type: 'error', text: 'Informe um número de WhatsApp válido antes de gerar o QR.' });
        return;
      }
      const endpoints = [
        'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/connectinstance',
        'https://n8n-n8n.0dt1f5.easypanel.host/webhook/connectinstance',
      ];

      const payload = {
        timestamp: new Date().toISOString(),
        user: user ? { id: user.id, email: user.email, phone: (user as any).phone || null } : null,
        nutricionista: nutricionista || null,
        number: phoneDigits,
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

      const normalizeDataUrl = (value: string): string => {
        const v = value.trim();
        if (v.startsWith('data:image')) return v;
        if (v.startsWith('dataimage')) return v.replace(/^dataimage/, 'data:image');
        return `data:image/png;base64,${v}`;
      };

      const pickString = (value: any): string | null => {
        if (typeof value === 'string' && value.trim().length > 50) return value.trim();
        return null;
      };

      const extractQr = (data: any): string | null => {
        if (!data) return null;
        // If response is plain string
        const direct = pickString(data);
        if (direct) return direct;

        // If JSON/object, try common fields including nested under `data`
        const tryFields = (obj: any): string | null => {
          if (!obj || typeof obj !== 'object') return null;
          const fields = ['base64', 'qr', 'qrcode', 'qr_base64', 'qrCode', 'image', 'data'];
          for (const f of fields) {
            const val = obj[f as keyof typeof obj];
            const s = pickString(val);
            if (s) return s;
          }
          return null;
        };

        // top-level
        let found = tryFields(data);
        if (found) return found;

        // nested under data
        if (data.data) {
          found = tryFields(data.data);
          if (found) return found;
        }
        return null;
      };

      let qr: string | null = null;
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.ok) {
          const found = extractQr(r.value.data);
          if (found) {
            qr = found;
            break;
          }
        }
      }

      if (!qr) {
        setFeedback({ type: 'error', text: 'Não foi possível obter o QR Code. Tente novamente em instantes.' });
        return;
      }

      const dataUrl = normalizeDataUrl(qr);
      setQrDataUrl(dataUrl);
      setShowQR(true);
      setFeedback({ type: 'info', text: 'QR gerado. Escaneie com o aplicativo para conectar.' });
    } catch (err) {
      setFeedback({ type: 'error', text: 'Falha ao gerar o QR Code. Verifique sua conexão e tente novamente.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setFeedback(null);
    try {
      const endpoints = [
        'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/verifyinstance',
        'https://n8n-n8n.0dt1f5.easypanel.host/webhook/verifyinstance',
      ];

      const payload = {
        timestamp: new Date().toISOString(),
        number: phoneDigits || null,
        user: user ? { id: user.id, email: user.email } : null,
        nutricionista: nutricionista || null,
      };

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

      const normalizeStatus = (value: string): 'conectado' | 'desconectado' | null => {
        const v = value.toLowerCase().trim();
        const compact = v.replace(/[^a-z]/g, '');
        if (compact === 'conectado') return 'conectado';
        if (compact === 'desconectado') return 'desconectado';
        // tolerância para erros de digitação comuns
        if (compact === 'desconctado') return 'desconectado';
        return null;
      };

      const extractStatus = (data: any): 'conectado' | 'desconectado' | null => {
        if (!data) return null;
        if (typeof data === 'string') return normalizeStatus(data);
        const obj = typeof data === 'object' ? data : {};
        const direct = obj.status || obj.Status || (obj.data && obj.data.status);
        if (typeof direct === 'string') return normalizeStatus(direct);
        return null;
      };

      let finalStatus: 'conectado' | 'desconectado' | null = null;
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.ok) {
          const st = extractStatus(r.value.data);
          if (st) {
            finalStatus = st as any;
            if (st === 'conectado') break;
          }
        }
      }

      if (finalStatus === 'conectado') {
        setFeedback({ type: 'success', text: 'Conexão confirmada! Redirecionando...' });
        router.push('/agentes');
        return;
      }

      setFeedback({ type: 'error', text: 'Conexão não estabelecida, escaneie novamente.' });
    } catch (err) {
      setFeedback({ type: 'error', text: 'Erro ao confirmar conexão. Tente novamente.' });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout title="Conectar Instância" subtitle="Conecte um número para ativar os Agentes IA">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stepper */}
            <ContentCard className="lg:col-span-1">
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">1. Informe seu número</p>
                    <p className="text-sm text-gray-600">Digite o número do WhatsApp que será vinculado.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-nutrimatic-50 text-nutrimatic-700 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">2. Gerar QR</p>
                    <p className="text-sm text-gray-600">Clique no botão abaixo para gerar o QR de conexão.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">3. Escanear</p>
                    <p className="text-sm text-gray-600">Abra o aplicativo e escaneie o código QR exibido.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">4. Concluir</p>
                    <p className="text-sm text-gray-600">Após conectar, clique em “Concluí a conexão”.</p>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600">Se usar uma conta empresarial, certifique-se de ter permissão para vincular dispositivos.</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600">Os dados são protegidos e seguem padrões de segurança.</p>
                </div>
              </div>
            </ContentCard>

            {/* QR and actions */}
            <ContentCard className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="min-h-[260px] flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                  {showQR ? (
                    <div className="text-center">
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR Code" className="mx-auto w-44 h-44 bg-white border rounded-xl shadow object-contain transition-opacity duration-300 opacity-100" />
                      ) : (
                        <div className="mx-auto w-40 h-40 bg-white border rounded-xl flex items-center justify-center shadow transition-opacity duration-300 opacity-100">
                          <QrCode className="w-24 h-24 text-gray-700" />
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mt-3">Escaneie o QR exibido no seu aplicativo</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <QrCode className="w-12 h-12 mx-auto mb-2" />
                      O QR será exibido aqui após gerar
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Número do WhatsApp</label>
                      <DashboardInput
                        placeholder="Ex.: +55 11 91234-5678"
                        value={phoneInput}
                        onChange={(e: any) => setPhoneInput(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">Informe com DDD. Ex.: 11912345678 ou +55 11 91234-5678</p>
                      {!isPhoneValid && phoneInput && (
                        <p className="text-xs text-red-600 mt-1">Número inválido. Verifique DDI/DDD e dígitos.</p>
                      )}
                    </div>
                    {(() => {
                      const generateDisabled = isGenerating || !isPhoneValid || showQR;
                      const confirmVariant: 'primary' | 'secondary' = showQR ? 'primary' : 'secondary';
                      return (
                        <>
                          <DashboardButton
                            variant={"primary"}
                            size="lg"
                            onClick={handleGenerate}
                            disabled={generateDisabled}
                            className={`w-full transition-all duration-300 ${showQR ? 'bg-white text-gray-400 border border-gray-200 opacity-70 cursor-not-allowed' : ''}`}
                          >
                            {isGenerating ? (
                              <span className="inline-flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Gerando...</span>
                            ) : (
                              'Gerar QR'
                            )}
                          </DashboardButton>
                          <DashboardButton
                            variant={confirmVariant}
                            size="md"
                            onClick={handleVerify}
                            disabled={isVerifying || !showQR}
                            className={`w-full transition-all duration-300 ${showQR ? 'shadow-lg' : 'opacity-60 cursor-not-allowed'}`}
                          >
                            {isVerifying ? (
                              <span className="inline-flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Verificando...</span>
                            ) : (
                              'Concluí a conexão'
                            )}
                          </DashboardButton>
                        </>
                      );
                    })()}
                    {feedback && (
                      <div className={`text-sm rounded-lg p-3 ${
                        feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                        feedback.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {feedback.text}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 text-sm text-gray-600 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Precisa de ajuda? Veja o tutorial passo a passo ou fale com um especialista.
                  </div>
                </div>
              </div>
            </ContentCard>
          </div>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


