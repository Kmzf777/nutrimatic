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
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [instanceInfo, setInstanceInfo] = useState<{ number: string | null; status: string | null } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isCancelled = false;
    const verifyInstance = async () => {
      if (loading) {
        // Aguardar autenticação concluir antes de verificar instância
        return;
      }
      if (!user) {
        setChecking(false);
        return;
      }
 
      // Se o Supabase não estiver configurado
      if (!isSupabaseConfigured()) {
        setInstanceInfo({ number: null, status: null });
        setChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('instancias')
          .select('id, number, status')
          .eq('identificacao', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (isCancelled) return;

        // Em caso de erro na consulta
        if (error) {
          console.warn('Erro ao consultar instancias:', error);
          setInstanceInfo({ number: null, status: null });
          setChecking(false);
          return;
        }

        // Se não há instância
        if (!data) {
          setInstanceInfo({ number: null, status: null });
          setChecking(false);
          return;
        }

        const statusValue = String((data as any).status || '').toLowerCase();
        const numberValue = (data as any).number || null;
        setInstanceInfo({ number: numberValue, status: (data as any).status || null });

        // Instância verificada (conectada ou não) - Sem redirecionamento forçado
        setChecking(false);
      } catch (e) {
        if (!isCancelled) {
          console.warn('Falha inesperada ao verificar instância:', e);
          setInstanceInfo({ number: null, status: null });
          setChecking(false);
        }
      }
    };

    verifyInstance();
    return () => {
      isCancelled = true;
    };
  }, [user, loading, supabase]);

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
                      instanceInfo?.status === 'ativo' || instanceInfo?.status === 'conectado' ? 'bg-green-100 text-green-800' :
                      instanceInfo?.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      instanceInfo?.status === 'inativo' || instanceInfo?.status === 'desconectado' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {instanceInfo?.status || 'Não conectado'}
                    </span>
                  </div>
                </div>
              </ContentCard>

              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Agente Secretaria', href: '/agentes/secretaria', color: 'from-purple-500 to-purple-700', desc: 'Agenda, confirmações e atendimento básico.', icon: Headset },
                  { title: 'Agente Prescrição', href: '/agentes/prescricao', color: 'from-blue-500 to-blue-700', desc: 'Desenvolvimento completo da prescrição do paciente', icon: FileText },
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
