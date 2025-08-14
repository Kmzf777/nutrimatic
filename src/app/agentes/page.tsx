'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { Headset, Megaphone, FileText, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';

export default function AgentesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [instanceInfo, setInstanceInfo] = useState<{ number: string | null; status: string | null } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isCancelled = false;
    const verifyInstance = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      if (!isSupabaseConfigured()) {
        // Em desenvolvimento sem Supabase configurado, não redireciona
        setChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('instancias')
          .select('id, number, status')
          .eq('identificacao', user.id)
          .limit(1);

        if (isCancelled) return;

        if (error) {
          // Em caso de erro, apenas permanece na página
          setChecking(false);
          return;
        }

        const hasInstance = Array.isArray(data) && data.length > 0;
        if (!hasInstance) {
          router.replace('/connectinstance');
          return;
        }
        const row = data![0] as any;
        setInstanceInfo({ number: row.number || null, status: row.status || null });
        setChecking(false);
      } catch {
        if (!isCancelled) setChecking(false);
      }
    };

    verifyInstance();
    return () => {
      isCancelled = true;
    };
  }, [user, supabase, router]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout title="Agentes IA" subtitle="Gerencie seus agentes e acompanhe o status do WhatsApp">
          {checking ? (
            <div className="py-8 text-gray-600">Verificando configuração da sua instância...</div>
          ) : (
            <div className="space-y-8">
              <ContentCard title="WhatsApp Conectado" className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Número</p>
                    <p className="text-base font-semibold text-gray-900">{instanceInfo?.number || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      instanceInfo?.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      instanceInfo?.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {instanceInfo?.status || '—'}
                    </span>
                  </div>
                </div>
              </ContentCard>

              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Agente Secretaria', href: '/agentes/secretaria', color: 'from-purple-500 to-purple-700', desc: 'Agenda, confirmações e atendimento básico.', icon: Headset },
                  { title: 'Agente de Marketing', href: '/agentes/marketing', color: 'from-pink-500 to-rose-600', desc: 'Captação e campanhas automatizadas.', icon: Megaphone },
                  { title: 'Agente de Prescrições', href: '/agentes/prescricoes', color: 'from-emerald-500 to-teal-600', desc: 'Gera e organiza prescrições com IA.', icon: FileText },
                  { title: 'Agente de Pós-Venda', href: '/agentes/pos-venda', color: 'from-blue-500 to-indigo-600', desc: 'Follow-up, lembretes e suporte.', icon: LifeBuoy },
                ].map((card) => {
                  const Icon = card.icon as any;
                  return (
                    <div key={card.title} className="group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300">
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <div className="p-8 relative z-10 h-full flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-4 ring-1 ring-gray-200 group-hover:ring-0">
                          <Icon className="w-7 h-7 text-gray-700" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-600 flex-1">{card.desc}</p>
                        <DashboardButton
                          className="mt-5"
                          variant="primary"
                          size="sm"
                          onClick={() => router.push(card.href)}
                        >
                          Acessar
                        </DashboardButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


