'use client';

import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { addDays, addMonths, endOfMonth, endOfWeek, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, MoreVertical, Trash2, X } from 'lucide-react';
import { useAgenda } from '@/hooks/useAgenda';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string (yyyy-MM-dd)
  time?: string; // e.g. '14:00'
  color?: string; // tailwind color class suffix, e.g. 'green', 'blue'
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function AgendaPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'carousel' | 'month'>('carousel');
  const visibleCount = 7;
  const [carouselStart, setCarouselStart] = useState<number>(0);
  const [menuOpenForId, setMenuOpenForId] = useState<string | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editTime, setEditTime] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();
  const { user, nutricionista } = useAuth();

  const WEBHOOK_URLS = [
    'https://n8n-n8n.0dt1f5.easypanel.host/webhook-test/agenda-alterar',
    'https://n8n-n8n.0dt1f5.easypanel.host/webhook/agenda-alterar',
  ] as const;

  async function sendWebhooks(action: 'update' | 'remove', evento: any) {
    const body = {
      action,
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email } : null,
      nutricionista: nutricionista
        ? { id: nutricionista.id, nome: nutricionista.nome, email: nutricionista.email }
        : null,
      evento,
    };
    await Promise.allSettled(
      WEBHOOK_URLS.map((url) =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
    );
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = useMemo(() => {
    const result: Date[] = [];
    let day = gridStart;
    while (day <= gridEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [gridStart, gridEnd]);

  // Dias do carrossel: mês atual completo
  const carouselDays = useMemo(() => {
    const result: Date[] = [];
    let day = monthStart;
    while (day <= monthEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [monthStart, monthEnd]);

  // Center selected day (or today on first render) within the visible window
  useEffect(() => {
    if (carouselDays.length === 0) return;
    const idx = carouselDays.findIndex(d => toISODate(d) === toISODate(selectedDate));
    const half = Math.floor(visibleCount / 2);
    const maxStartLocal = Math.max(0, carouselDays.length - visibleCount);
    const start = Math.min(maxStartLocal, Math.max(0, (idx === -1 ? 0 : idx) - half));
    setCarouselStart(start);
  }, [carouselDays, selectedDate]);
  const { eventsByDate, loading, error, refetch } = useAgenda(monthStart, monthEnd);

  function formatLongDate(date: Date) {
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'long' });
    const year = date.getFullYear();
    return `${weekday}, ${day} de ${month} de ${year}`;
  }

  function weekdayShort(date: Date) {
    return date
      .toLocaleDateString('pt-BR', { weekday: 'short' })
      .replace('.', '')
      .slice(0, 3);
  }

  const selectedISO = toISODate(selectedDate);
  const selectedEvents = eventsByDate[selectedISO] || [];
  const selectedIndex = useMemo(() => carouselDays.findIndex(d => toISODate(d) === selectedISO), [carouselDays, selectedISO]);
  const maxStart = Math.max(0, carouselDays.length - visibleCount);
  const canPrevDay = selectedIndex > 0;
  const canNextDay = selectedIndex >= 0 && selectedIndex < carouselDays.length - 1;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
          title="Agenda"
          subtitle="Crie, edite e apague seus agendamentos"
          actions={
            <div className="flex items-center space-x-2">
              <DashboardButton
                variant="primary"
                size="sm"
                onClick={() => setViewMode(viewMode === 'month' ? 'carousel' : 'month')}
              >
                {viewMode === 'month' ? 'Voltar' : 'Ver mês completo'}
              </DashboardButton>
              <DashboardButton variant="ghost" size="sm" onClick={refetch}>
                Atualizar
              </DashboardButton>
            </div>
          }
        >
          {viewMode === 'carousel' ? (
            <>
              <ContentCard 
                title={formatMonthYear(currentMonth)} 
                subtitle="Selecione um dia para ver os detalhes"
                actions={
                  <div className="flex items-center space-x-2">
                    <DashboardButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        setCurrentMonth(today);
                        setSelectedDate(today);
                      }}
                    >
                      <CalendarDays className="w-4 h-4 mr-2" />Hoje
                    </DashboardButton>
                    <Link href="/dashboard/criar-agendamento">
                      <DashboardButton variant="primary" size="sm">
                        Novo agendamento
                      </DashboardButton>
                    </Link>
                    <DashboardButton variant="ghost" size="sm" onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}>
                      <ChevronLeft className="w-4 h-4" />
                    </DashboardButton>
                    <DashboardButton variant="ghost" size="sm" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
                      <ChevronRight className="w-4 h-4" />
                    </DashboardButton>
                  </div>
                }
              >
                {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (canPrevDay && selectedIndex >= 0) {
                        setSelectedDate(carouselDays[selectedIndex - 1]);
                      }
                    }}
                    disabled={!canPrevDay}
                    className={`p-2 rounded-lg border transition-colors ${
                      !canPrevDay ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-7 gap-2 flex-1">
                    {carouselDays.slice(carouselStart, carouselStart + visibleCount).map((day) => {
                      const key = toISODate(day);
                      const count = (eventsByDate[key] || []).length;
                      const selected = isSameDay(day, selectedDate);
                      const today = isToday(day);
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedDate(day)}
                          className={`w-full min-w-[90px] rounded-xl border p-2 text-center transition-all ${
                            selected
                              ? 'bg-nutrimatic-600 text-white border-nutrimatic-600 shadow-lg'
                              : 'bg-white/80 border-gray-200 hover:bg-nutrimatic-50'
                          } ${today && !selected ? 'ring-2 ring-nutrimatic-300' : ''}`}
                          title={`${weekdayShort(day)}, ${day.getDate()} ${day.toLocaleDateString('pt-BR', { month: 'short' })}`}
                        >
                          <div className="text-[10px] opacity-80">{weekdayShort(day)}</div>
                          <div className="text-xl font-bold leading-6">{day.getDate()}</div>
                          <div className="text-[10px] opacity-80">{day.toLocaleDateString('pt-BR', { month: 'short' })}</div>
                          <div className={`mt-2 text-[10px] font-medium ${selected ? 'text-white/90' : 'text-nutrimatic-700'}`}>
                            {count > 0 ? `${count} ${count === 1 ? 'evento' : 'eventos'}` : 'Sem eventos'}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      if (canNextDay && selectedIndex >= 0) {
                        setSelectedDate(carouselDays[selectedIndex + 1]);
                      }
                    }}
                    disabled={!canNextDay}
                    className={`p-2 rounded-lg border transition-colors ${
                      !canNextDay ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                    aria-label="Próximo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </ContentCard>

              <ContentCard title={formatLongDate(selectedDate)} subtitle={selectedEvents.length ? undefined : 'Sem eventos para este dia'}>
                <div className="space-y-3">
                  {selectedEvents.map((ev) => {
                    const contactNumber = ev.number ? ev.number.replace(/\D/g, '') : '';
                    const contactUrl = contactNumber ? `https://wa.me/${contactNumber}` : undefined;
                    return (
                    <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white/80">
                      <div
                        className={`w-2 h-2 mt-1.5 rounded-full ${
                          ev.color === 'green' ? 'bg-green-500' :
                          ev.color === 'blue' ? 'bg-blue-500' :
                          ev.color === 'purple' ? 'bg-purple-500' :
                          ev.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {ev.time && <span className="text-sm font-semibold text-gray-900">{ev.time}</span>}
                          <span className="text-sm text-gray-700 truncate">{ev.title}</span>
                          {ev.action && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{ev.action}</span>
                          )}
                        </div>
                      </div>
                      <div className="relative flex items-center gap-2 flex-shrink-0">
                        <DashboardButton
                          variant="outline"
                          size="sm"
                          onClick={() => { if (contactUrl) window.open(contactUrl, '_blank'); }}
                          disabled={!contactUrl}
                          title={contactUrl ? `Abrir contato: ${contactNumber}` : 'Número indisponível'}
                        >
                          Entrar em contato
                        </DashboardButton>
                        <DashboardButton
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditEventId(ev.id);
                            setEditDate(ev.date);
                            setEditTime(ev.time || '09:00');
                          }}
                          title="Editar evento"
                        >
                          Editar
                        </DashboardButton>
                        <button
                          className="p-2 rounded-md hover:bg-gray-100 border border-gray-200"
                          onClick={() => setMenuOpenForId(menuOpenForId === ev.id ? null : ev.id)}
                          aria-haspopup="menu"
                          aria-expanded={menuOpenForId === ev.id}
                          title="Mais ações"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {menuOpenForId === ev.id && (
                          <div className="absolute top-10 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <button
                              className={`flex items-center gap-2 px-3 py-2 w-full ${deletingId === ev.id ? 'text-gray-400' : 'text-red-600 hover:bg-red-50'}`}
                              onClick={async () => {
                                if (deletingId) return;
                                if (!confirm('Confirmar remoção do agendamento?')) return;
                                try {
                                  setDeletingId(ev.id);
                                  // Buscar dados completos do evento para enviar no webhook
                                  const { data: beforeData } = await supabase
                                    .from('agenda_eventos')
                                    .select('*')
                                    .eq('id', ev.id)
                                    .single();
                                  const { error } = await supabase
                                    .from('agenda_eventos')
                                    .delete()
                                    .eq('id', ev.id);
                                  if (error) throw error;
                                  setMenuOpenForId(null);
                                  // Disparar webhooks com o evento removido
                                  await sendWebhooks('remove', beforeData || { id: ev.id, date: ev.date, time: ev.time, action: ev.action, number: ev.number, title: ev.title });
                                  await refetch();
                                } catch (e) {
                                  console.error('Erro ao remover evento', e);
                                  alert('Erro ao remover evento');
                                } finally {
                                  setDeletingId(null);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remover agendamento
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )})}
                  {selectedEvents.length === 0 && (
                    <div className="text-sm text-gray-500">Você não possui agendamentos neste dia.</div>
                  )}
                </div>
              </ContentCard>
            </>
          ) : (
            <>
            <ContentCard 
              title={formatMonthYear(currentMonth)} 
              subtitle="Clique em um dia para selecionar"
              actions={
                <div className="flex items-center space-x-2">
                  <DashboardButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setCurrentMonth(today);
                      setSelectedDate(today);
                    }}
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />Hoje
                  </DashboardButton>
                  <Link href="/dashboard/criar-agendamento">
                    <DashboardButton variant="primary" size="sm">
                      Novo agendamento
                    </DashboardButton>
                  </Link>
                  <DashboardButton variant="ghost" size="sm" onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </DashboardButton>
                  <DashboardButton variant="ghost" size="sm" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </DashboardButton>
                </div>
              }
            >
              <div className="grid grid-cols-7 gap-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                  <div key={d} className="text-xs font-medium text-gray-500 text-center py-2">
                    {d}
                  </div>
                ))}
                {days.map((day) => {
                  const key = toISODate(day);
                  const dayEvents = eventsByDate[key] || [];
                  const outsideMonth = !isSameMonth(day, monthStart);
                  const today = isToday(day);
                  const isSelected = isSameDay(day, selectedDate);
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-[110px] text-left rounded-lg border p-2 transition-all duration-200 hover:shadow-sm ${
                        outsideMonth ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-white/70 border-gray-200'
                      } ${today ? 'ring-2 ring-nutrimatic-400' : ''} ${isSelected ? 'outline outline-2 outline-nutrimatic-500' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${outsideMonth ? 'text-gray-400' : 'text-gray-700'}`}>
                          {day.getDate()}
                        </span>
                        {today && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-nutrimatic-100 text-nutrimatic-700">Hoje</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.length === 0 ? (
                          <div className="text-[11px] text-gray-400 italic">Sem eventos</div>
                        ) : (
                          dayEvents.slice(0, 3).map((ev) => (
                            <div
                              key={ev.id}
                              className={`text-[11px] px-2 py-1 rounded-md border flex items-center gap-1 truncate ${
                                ev.color === 'green' ? 'bg-green-50 border-green-100 text-green-700' :
                                ev.color === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                ev.color === 'purple' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                ev.color === 'yellow' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                                'bg-gray-50 border-gray-100 text-gray-700'
                              }`}
                              title={`${ev.time ? ev.time + ' • ' : ''}${ev.title}`}
                            >
                              {ev.time && <span className="font-semibold">{ev.time}</span>}
                              <span className="truncate">{ev.title}</span>
                            </div>
                          ))
                        )}
                        {dayEvents.length > 3 && (
                          <div className="text-[11px] text-gray-500">+{dayEvents.length - 3} mais</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ContentCard>
            <ContentCard title={formatLongDate(selectedDate)} subtitle={selectedEvents.length ? undefined : 'Sem eventos para este dia'}>
              <div className="space-y-3">
                {selectedEvents.map((ev) => {
                  const contactNumber = ev.number ? ev.number.replace(/\D/g, '') : '';
                  const contactUrl = contactNumber ? `https://wa.me/${contactNumber}` : undefined;
                  return (
                  <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white/80">
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full ${
                        ev.color === 'green' ? 'bg-green-500' :
                        ev.color === 'blue' ? 'bg-blue-500' :
                        ev.color === 'purple' ? 'bg-purple-500' :
                        ev.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {ev.time && <span className="text-sm font-semibold text-gray-900">{ev.time}</span>}
                        <span className="text-sm text-gray-700 truncate">{ev.title}</span>
                      </div>
                    </div>
                    <div className="relative flex items-center gap-2 flex-shrink-0">
                      <DashboardButton
                        variant="outline"
                        size="sm"
                        onClick={() => { if (contactUrl) window.open(contactUrl, '_blank'); }}
                        disabled={!contactUrl}
                        title={contactUrl ? `Abrir contato: ${contactNumber}` : 'Número indisponível'}
                      >
                        Entrar em contato
                      </DashboardButton>
                    </div>
                  </div>
                )})}
                {selectedEvents.length === 0 && (
                  <div className="text-sm text-gray-500">Você não possui agendamentos neste dia.</div>
                )}
              </div>
            </ContentCard>
            </>
          )}
        </DashboardPageLayout>
      </DashboardLayout>

      {/* Modal de edição */}
      {editEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Editar agendamento</h3>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => setEditEventId(null)}
                aria-label="Fechar"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Horário</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <DashboardButton variant="secondary" size="sm" onClick={() => setEditEventId(null)}>Cancelar</DashboardButton>
              <DashboardButton
                variant="primary"
                size="sm"
                disabled={saving || !editDate || !/^\d{4}-\d{2}-\d{2}$/.test(editDate) || !/^\d{2}:\d{2}$/.test(editTime)}
                onClick={async () => {
                  if (!editDate || !/^\d{4}-\d{2}-\d{2}$/.test(editDate)) {
                    alert('Informe uma data válida (YYYY-MM-DD).');
                    return;
                  }
                  if (!editTime || !/^\d{2}:\d{2}$/.test(editTime)) {
                    alert('Informe um horário válido (HH:MM).');
                    return;
                  }
                  try {
                    setSaving(true);
                    if (!isSupabaseConfigured()) throw new Error('Supabase não configurado');
                    
                    // Buscar dados originais antes da edição
                    const { data: originalData } = await supabase
                      .from('agenda_eventos')
                      .select('*')
                      .eq('id', editEventId)
                      .single();
                    
                    // Fazer a atualização
                    const { error } = await supabase
                      .from('agenda_eventos')
                      .update({ dia: editDate, horario: editTime })
                      .eq('id', editEventId);
                    if (error) throw error;
                    
                    // Buscar dados atualizados
                    const { data: updatedData } = await supabase
                      .from('agenda_eventos')
                      .select('*')
                      .eq('id', editEventId)
                      .single();
                    
                    setEditEventId(null);
                    if (editDate && editDate !== toISODate(selectedDate)) {
                      setSelectedDate(new Date(editDate));
                    }
                    
                    // Enviar webhook com dados originais e atualizados
                    await sendWebhooks('update', {
                      original: originalData,
                      updated: updatedData,
                      changes: {
                        dia: { from: originalData?.dia, to: editDate },
                        horario: { from: originalData?.horario, to: editTime }
                      }
                    });
                    
                    await refetch();
                  } catch (e) {
                    console.error('Erro ao salvar edição', e);
                    alert('Erro ao salvar edição');
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                Salvar
              </DashboardButton>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}


