'use client';

import { useMemo, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton, DashboardInput } from '@/components/dashboard/DashboardPageLayout';
import { useClientes } from '@/hooks/useClientes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Search, CheckCircle, Users } from 'lucide-react';

interface ClienteOption {
  id: string;
  nome: string;
  numero: string;
}

export default function CriarAgendamentoPage() {
  const { clientes, loading: loadingClientes, formatNumero } = useClientes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [dia, setDia] = useState<string>('');
  const [horario, setHorario] = useState<string>('');
  const [acao, setAcao] = useState<string>('Consulta');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, nutricionista } = useAuth();
  const router = useRouter();

  const ownerId = nutricionista?.id || user?.id || null;

  const filteredClientes = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return clientes;
    return clientes.filter((c) => {
      const nome = (c.nome || '').toLowerCase();
      const numero = (c.numero || '').toLowerCase();
      return nome.includes(t) || numero.includes(t) || formatNumero(c.numero).toLowerCase().includes(t);
    });
  }, [clientes, searchTerm, formatNumero]);

  const selectedCliente = useMemo(() => clientes.find(c => c.id === selectedClienteId), [clientes, selectedClienteId]);

  function getStatusBadge(status: string) {
    const base = 'px-2 py-1 text-xs rounded-full';
    if (status === 'novo') return <span className={`${base} bg-blue-100 text-blue-800`}>Novo</span>;
    if (status === 'aguardando_pagamento') return <span className={`${base} bg-yellow-100 text-yellow-800`}>Aguard. pagamento</span>;
    if (status === 'anamnese') return <span className={`${base} bg-indigo-100 text-indigo-800`}>Anamnese</span>;
    if (status === 'ativo') return <span className={`${base} bg-green-100 text-green-800`}>Ativo</span>;
    if (status === 'inativo') return <span className={`${base} bg-gray-200 text-gray-700`}>Inativo</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  }

  const canSubmit = !!selectedClienteId && /^\d{4}-\d{2}-\d{2}$/.test(dia) && /^\d{2}:\d{2}$/.test(horario) && !!acao && !!ownerId;

  async function sendCreateWebhooks(evento: any) {
    const WEBHOOK_URLS = [
      'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/agenda-alterar',
      'https://n8n-n8n.0dt1f5.easypanel.host/webhook/agenda-alterar',
    ] as const;
    const body = {
      action: 'create' as const,
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email } : null,
      nutricionista: nutricionista ? { id: nutricionista.id, nome: nutricionista.nome, email: nutricionista.email } : null,
      evento,
    };
    try {
      await Promise.allSettled(
        WEBHOOK_URLS.map(url => 
          fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true })
        )
      );
    } catch (e) {
      try {
        const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
        WEBHOOK_URLS.forEach(url => { try { navigator.sendBeacon(url, blob); } catch (_) {} });
      } catch (_) {}
    }
  }

  async function handleCreate() {
    try {
      setSaving(true);
      setError(null);
      if (!ownerId) throw new Error('Usuário não autenticado');
      const payload = {
        identificacao: ownerId,
        cliente_id: selectedClienteId,
        dia,
        horario,
        acao,
      } as const;
      await sendCreateWebhooks(payload);

      // Redirecionar de volta para agenda (SPA, sem descarregar a página)
      router.push('/dashboard/agenda');
    } catch (e: any) {
      console.error('Erro ao criar agendamento', e);
      setError(e?.message || 'Erro ao criar agendamento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title="Criar agendamento"
          subtitle="Selecione um cliente existente e preencha os dados do agendamento"
          actions={
            <div className="flex items-center gap-2">
              <Link href="/dashboard/criar-cliente">
                <DashboardButton variant="primary" size="sm">Criar Cliente</DashboardButton>
              </Link>
              <Link href="/dashboard/agenda">
                <DashboardButton variant="secondary" size="sm">Voltar</DashboardButton>
              </Link>
            </div>
          }
        >
          <ContentCard title="Selecione o cliente" subtitle="Busque por nome ou número e clique para selecionar">
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <DashboardInput
                  placeholder="Buscar por nome ou número..."
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto border rounded-xl">
                {loadingClientes ? (
                  <div className="p-6 text-sm text-gray-500">Carregando clientes...</div>
                ) : filteredClientes.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    Nenhum cliente encontrado
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50/60">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selecionar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200/50">
                      {filteredClientes.map((c) => {
                        const selected = c.id === selectedClienteId;
                        return (
                          <tr
                            key={c.id}
                            onClick={() => setSelectedClienteId(selected ? '' : c.id)}
                            className={`cursor-pointer hover:bg-gray-50/60 ${selected ? 'bg-nutrimatic-50/60' : ''}`}
                          >
                            <td className="px-4 py-3 w-12">
                              {selected ? (
                                <CheckCircle className="w-5 h-5 text-nutrimatic-600" />
                              ) : (
                                <span className="inline-block w-5 h-5 rounded-full border border-gray-300" />
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">{c.nome || 'Sem nome'}</td>
                            <td className="px-4 py-3 text-sm text-nutrimatic-700">{formatNumero(c.numero)}</td>
                            <td className="px-4 py-3 text-sm">
                              {getStatusBadge(c.status as any)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {selectedCliente && (
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div>
                    Selecionado: <span className="font-medium">{selectedCliente.nome || 'Sem nome'}</span> — {formatNumero(selectedCliente.numero)}
                  </div>
                  <DashboardButton variant="ghost" size="sm" onClick={() => setSelectedClienteId('')}>
                    Desselecionar
                  </DashboardButton>
                </div>
              )}
            </div>
          </ContentCard>

          <ContentCard title="Dados do agendamento" subtitle={!selectedCliente ? 'Selecione um cliente acima para habilitar o envio' : undefined}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Dia</label>
                <DashboardInput type="date" value={dia} onChange={(e: any) => setDia(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Horário</label>
                <DashboardInput type="time" value={horario} onChange={(e: any) => setHorario(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ação</label>
                <DashboardInput placeholder="Ex.: Consulta, Retorno" value={acao} onChange={(e: any) => setAcao(e.target.value)} />
              </div>
            </div>

            <div className="pt-4">
              <DashboardButton variant="primary" onClick={handleCreate} disabled={!canSubmit || saving}>
                {saving ? 'Salvando...' : 'Enviar'}
              </DashboardButton>
            </div>
          </ContentCard>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


