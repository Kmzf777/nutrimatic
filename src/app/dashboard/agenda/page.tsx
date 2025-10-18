'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { addDays, addMonths, endOfMonth, endOfWeek, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, MoreVertical, Trash2, X, Plus, Clock, MapPin, User } from 'lucide-react';
import { useAgenda } from '@/hooks/useAgenda';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string (yyyy-MM-dd)
  time?: string; // e.g. '14:00'
  color?: string; // tailwind color class suffix, e.g. 'green', 'blue'
  action?: string;
  tipo?: string;
  status?: string;
  number?: string;
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

function SearchParamsInit({ onDate }: { onDate: (dt: Date) => void }) {
  const params = useSearchParams();
  useEffect(() => {
    const p = params.get('date');
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) {
      const [y, m, d] = p.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      onDate(dt);
    }
  }, [params, onDate]);
  return null;
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
    'https://webhook.canastrainteligencia.com/webhook/agenda-alterar',
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

  // Calculate period that includes both current month and selected date month
  const selectedMonthStart = startOfMonth(selectedDate);
  const selectedMonthEnd = endOfMonth(selectedDate);
  
  // Use the broader period that includes both months
  const dataStart = monthStart < selectedMonthStart ? monthStart : selectedMonthStart;
  const dataEnd = monthEnd > selectedMonthEnd ? monthEnd : selectedMonthEnd;

  const days = useMemo(() => {
    const result: Date[] = [];
    let day = gridStart;
    while (day <= gridEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [gridStart, gridEnd]);

  // Dias do carrossel: mes atual completo
  const carouselDays = useMemo(() => {
    const result: Date[] = [];
    let day = monthStart;
    while (day <= monthEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [monthStart, monthEnd]);

  // Synchronize currentMonth with selectedDate when necessary
  useEffect(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const currentMonthValue = currentMonth.getMonth();
    const currentYear = currentMonth.getFullYear();
    
    // If selected date is in a different month, update currentMonth
    if (selectedMonth !== currentMonthValue || selectedYear !== currentYear) {
      setCurrentMonth(new Date(selectedYear, selectedMonth, 1));
    }
  }, [selectedDate, currentMonth]);

  // Center selected day (or today on first render) within the visible window
  useEffect(() => {
    if (carouselDays.length === 0) return;
    const idx = carouselDays.findIndex(d => toISODate(d) === toISODate(selectedDate));
    const half = Math.floor(visibleCount / 2);
    const maxStartLocal = Math.max(0, carouselDays.length - visibleCount);
    const start = Math.min(maxStartLocal, Math.max(0, (idx === -1 ? 0 : idx) - half));
    setCarouselStart(start);
  }, [carouselDays, selectedDate]);
  
  const { eventsByDate, loading, error, refetch } = useAgenda(dataStart, dataEnd);

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
        <Suspense fallback={null}>
          <SearchParamsInit onDate={(dt) => { setSelectedDate(dt); setCurrentMonth(dt); }} />
        </Suspense>
        <DashboardPageLayout
          title="Agenda"
          subtitle="Crie, edite e apague seus agendamentos"
          actions={
            <div className="hidden md:flex items-center space-x-2">
              <DashboardButton
                variant="primary"
                size="sm"
                onClick={() => setViewMode(viewMode === 'month' ? 'carousel' : 'month')}
              >
                {viewMode === 'month' ? 'Voltar' : 'Ver mes completo'}
              </DashboardButton>
              <DashboardButton variant="ghost" size="sm" onClick={refetch}>
                Atualizar
              </DashboardButton>
            </div>
          }
        >
          {viewMode === 'carousel' ? (
            <div>
              {/* MOBILE DESIGN - Google Agenda Style */}
              <div className="block md:hidden">
                {/* Mobile Header with Month Navigation */}
                <div className="bg-gradient-to-r from-nutrimatic-600 to-nutrimatic-700 rounded-2xl p-6 mb-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{formatMonthYear(currentMonth)}</h2>
                      <p className="text-nutrimatic-100 text-sm">Toque em uma data para ver os agendamentos</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Today Button */}
                  <button
                    onClick={() => {
                      const today = new Date();
                      setCurrentMonth(today);
                      setSelectedDate(today);
                    }}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    <CalendarDays className="w-4 h-4 mr-2 inline" />
                    Hoje
                  </button>
                </div>

                {/* Mobile Calendar Grid */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                  {/* Week Days Header */}
                  <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((d) => (
                      <div key={d} className="text-xs font-semibold text-gray-600 text-center py-3">
                        {d}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {days.map((day) => {
                      const key = toISODate(day);
                      const dayEvents = eventsByDate[key] || [];
                      const outsideMonth = !isSameMonth(day, monthStart);
                      const today = isToday(day);
                      const isSelected = isSameDay(day, selectedDate);
                      const hasEvents = dayEvents.length > 0;
                      
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            relative aspect-square border-r border-b border-gray-100 p-2 transition-all duration-200
                            ${outsideMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900 hover:bg-nutrimatic-50'}
                            ${isSelected ? 'bg-nutrimatic-100 ring-2 ring-nutrimatic-500 ring-inset' : ''}
                            ${today && !isSelected ? 'bg-blue-50 text-blue-700 font-bold' : ''}
                          `}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className={`text-sm ${today && !isSelected ? 'font-bold' : ''}`}>
                              {day.getDate()}
                            </span>
                            {hasEvents && (
                              <div className="flex space-x-1 mt-1">
                                {dayEvents.slice(0, 3).map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isSelected ? 'bg-nutrimatic-600' : 'bg-nutrimatic-400'
                                    }`}
                                  />
                                ))}
                                {dayEvents.length > 3 && (
                                  <div className="text-xs text-gray-500">+</div>
                                )}
                              </div>
                            )}
                          </div>
                          {today && (
                            <div className="absolute top-1 right-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date Events - Mobile */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {selectedDate.toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedEvents.length === 0 
                            ? 'Nenhum agendamento' 
                            : `${selectedEvents.length} ${selectedEvents.length === 1 ? 'agendamento' : 'agendamentos'}`
                          }
                        </p>
                      </div>
                      <Link href="/dashboard/criar-agendamento">
                        <button className="bg-nutrimatic-600 hover:bg-nutrimatic-700 text-white p-3 rounded-full shadow-lg transition-colors">
                          <Plus className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div className="p-6">
                    {selectedEvents.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CalendarDays className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">Nenhum agendamento para este dia</p>
                        <Link href="/dashboard/criar-agendamento">
                          <button className="mt-4 bg-nutrimatic-600 hover:bg-nutrimatic-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                            Criar agendamento
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {selectedEvents.map((ev) => {
                          const contactNumber = ev.number ? ev.number.split('').filter(c => c >= '0' && c <= '9').join('') : '';
                          const contactUrl = contactNumber ? `https://wa.me/${contactNumber}` : undefined;
                          const tipoLabel = ev.tipo ? ev.tipo.charAt(0).toUpperCase() + ev.tipo.slice(1) : undefined;
                          const statusText = (ev.status || 'agendado');
                          const statusLabel = statusText.charAt(0).toUpperCase() + statusText.slice(1);
                          
                          const statusColor = (() => {
                            const s = statusText.toLowerCase();
                            if (s === 'aguardando') return 'bg-amber-500 text-white';
                            if (s === 'agendado') return 'bg-emerald-500 text-white';
                            if (s === 'confirmado') return 'bg-blue-500 text-white';
                            if (s === 'cancelado') return 'bg-red-500 text-white';
                            if (s === 'realizado') return 'bg-gray-500 text-white';
                            return 'bg-gray-500 text-white';
                          })();

                          const eventColor = (() => {
                            if (ev.color === 'green') return 'border-emerald-500 bg-emerald-50';
                            if (ev.color === 'blue') return 'border-blue-500 bg-blue-50';
                            if (ev.color === 'purple') return 'border-purple-500 bg-purple-50';
                            if (ev.color === 'yellow') return 'border-amber-500 bg-amber-50';
                            return 'border-gray-400 bg-gray-50';
                          })();

                          return (
                            <div
                              key={ev.id}
                              className={`border-l-4 ${eventColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white`}
                            >
                              {/* Header com horario e status */}
                              <div className="flex items-center justify-between mb-4">
                                {ev.time && (
                                  <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border">
                                    <Clock className="w-5 h-5 mr-2 text-nutrimatic-600" />
                                    <span className="font-bold text-lg text-gray-900">{ev.time}</span>
                                  </div>
                                )}
                                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${statusColor}`}>
                                  {statusLabel}
                                </span>
                              </div>
                              
                              {/* Nome do cliente */}
                              <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                                  <User className="w-5 h-5 mr-3 text-nutrimatic-600" />
                                  {ev.title}
                                </h3>
                                {ev.action && (
                                  <p className="text-gray-600 ml-8 text-sm leading-relaxed">{ev.action}</p>
                                )}
                              </div>
                              
                              {/* Tipo de consulta */}
                              {tipoLabel && (
                                <div className="mb-6">
                                  <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border">
                                    <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                                    <span className="font-medium text-gray-800">{tipoLabel}</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Botoes de acao */}
                              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                                {contactUrl && (
                                  <button
                                    onClick={() => window.open(contactUrl, '_blank')}
                                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg min-w-[120px]"
                                    title="Contatar via WhatsApp"
                                  >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                    </svg>
                                    WhatsApp
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => {
                                    setEditEventId(ev.id);
                                    setEditDate(ev.date);
                                    setEditTime(ev.time || '09:00');
                                  }}
                                  className="flex items-center justify-center bg-nutrimatic-500 hover:bg-nutrimatic-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg min-w-[100px]"
                                  title="Editar agendamento"
                                >
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Editar
                                </button>
                                
                                <button
                                  onClick={() => setMenuOpenForId(menuOpenForId === ev.id ? null : ev.id)}
                                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg relative min-w-[100px]"
                                >
                                  <Trash2 className="w-5 h-5 mr-2" />
                                  Excluir
                                  {menuOpenForId === ev.id && (
                                    <div className="absolute top-full right-0 mt-2 z-10 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[200px] p-4">
                                      <p className="text-gray-700 text-sm mb-4 font-medium">Confirmar exclusao?</p>
                                      <div className="flex space-x-2">
                                        <button
                                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${deletingId === ev.id ? 'bg-gray-300 text-gray-500' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                                          onClick={async () => {
                                            if (deletingId) return;
                                            try {
                                              setDeletingId(ev.id);
                                              const { data: beforeData } = await supabase
                                                .from('agenda')
                                                .select('*')
                                                .eq('id', ev.id)
                                                .single();
                                              const { error } = await supabase
                                                .from('agenda')
                                                .delete()
                                                .eq('id', ev.id);
                                              if (error) throw error;
                                              setMenuOpenForId(null);
                                              await sendWebhooks('remove', beforeData || { id: ev.id, date: ev.date, time: ev.time, action: ev.action, number: ev.number, title: ev.title });
                                              await refetch();
                                            } catch (e) {
                                              console.error('Erro ao remover evento', e);
                                              alert('Erro ao remover evento');
                                            } finally {
                                              setDeletingId(null);
                                            }
                                          }}
                                          disabled={deletingId === ev.id}
                                        >
                                          {deletingId === ev.id ? 'Excluindo...' : 'Sim, excluir'}
                                        </button>
                                        <button
                                          className="flex-1 px-4 py-2 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                                          onClick={() => setMenuOpenForId(null)}
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <ContentCard
                title="Agenda"
                subtitle="Visualize e gerencie seus agendamentos"
                actions={
                  <div className="flex items-center space-x-2">
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </DashboardButton>
                    <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                      {formatMonthYear(currentMonth)}
                    </span>
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </DashboardButton>
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        setCurrentMonth(today);
                        setSelectedDate(today);
                      }}
                    >
                      Hoje
                    </DashboardButton>
                  </div>
                }
              >
                <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                  {days.map((day) => {
                    const key = toISODate(day);
                    const dayEvents = eventsByDate[key] || [];
                    const outsideMonth = !isSameMonth(day, monthStart);
                    const today = isToday(day);
                    const isSelected = isSameDay(day, selectedDate);
                    
                    return (
                      <div
                        key={key}
                        className={`bg-white p-2 min-h-[80px] cursor-pointer transition-colors ${
                          outsideMonth ? 'text-gray-400' : 'text-gray-900'
                        } ${today ? 'bg-blue-50' : ''} ${isSelected ? 'bg-nutrimatic-50' : ''} hover:bg-gray-50`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm ${today ? 'font-bold text-blue-600' : ''}`}>
                          {day.getDate()}
                        </div>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${
                                event.color === 'green' ? 'bg-green-100 text-green-800' :
                                event.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                event.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                event.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {event.time} {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayEvents.length - 2} mais</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {formatLongDate(selectedDate)}
                  </h3>
                  <div className="space-y-3">
                    {selectedEvents.map((ev) => {
                      const contactNumber = ev.number ? ev.number.split('').filter(c => c >= '0' && c <= '9').join('') : '';
                      const contactUrl = contactNumber ? `https://wa.me/${contactNumber}` : undefined;
                      
                      return (
                        <div
                          key={ev.id}
                          className={`p-4 rounded-lg border-l-4 ${
                            ev.color === 'green' ? 'border-green-500 bg-green-50' :
                            ev.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                            ev.color === 'purple' ? 'border-purple-500 bg-purple-50' :
                            ev.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
                            'border-gray-400 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                {ev.time && (
                                  <span className="text-sm font-medium text-gray-600">{ev.time}</span>
                                )}
                                <h4 className="font-medium text-gray-900">{ev.title}</h4>
                              </div>
                              {ev.action && (
                                <p className="text-sm text-gray-600 mt-1">{ev.action}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {contactUrl && (
                                <button
                                  onClick={() => window.open(contactUrl, '_blank')}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                                  title={contactUrl ? `Abrir contato: ${contactNumber}` : 'Numero indisponivel'}
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => setMenuOpenForId(menuOpenForId === ev.id ? null : ev.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative"
                                title="Mais acoes"
                              >
                                <MoreVertical className="w-4 h-4" />
                                {menuOpenForId === ev.id && (
                                  <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-md shadow-lg min-w-[150px]">
                                    <button
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                      onClick={() => {
                                        if (!confirm('Confirmar remocao do agendamento?')) return;
                                        setMenuOpenForId(null);
                                        // Handle delete
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remover agendamento
                                    </button>
                                  </div>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {selectedEvents.length === 0 && (
                      <div className="text-sm text-gray-500">Voce nao possui agendamentos neste dia.</div>
                    )}
                  </div>
                </div>
              </ContentCard>
            </div>
          )}
        </DashboardPageLayout>
      </DashboardLayout>

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
                <label className="block text-sm text-gray-600 mb-1">Horario</label>
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
                disabled={saving || !editDate || !(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')).test(editDate) || !(new RegExp('^\\d{2}:\\d{2}$')).test(editTime)}
                onClick={async () => {
                  if (!editDate || !(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')).test(editDate)) {
                    alert('Informe uma data valida (YYYY-MM-DD).');
                    return;
                  }
                  if (!editTime || !(new RegExp('^\\d{2}:\\d{2}$')).test(editTime)) {
                    alert('Informe um horario valido (HH:MM).');
                    return;
                  }
                  try {
                    setSaving(true);
                    if (!isSupabaseConfigured()) throw new Error('Supabase nao configurado');
                    
                    // Buscar dados originais antes da edicao
                    const { data: originalData } = await supabase
                      .from('agenda')
                      .select('*')
                      .eq('id', editEventId)
                      .single();
                    
                    // Fazer a atualizacao
                    const { error } = await supabase
                      .from('agenda')
                      .update({ dia: editDate, horario: editTime })
                      .eq('id', editEventId);
                    if (error) throw error;
                    
                    // Buscar dados atualizados
                    const { data: updatedData } = await supabase
                      .from('agenda')
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
                    console.error('Erro ao salvar edicao', e);
                    alert('Erro ao salvar edicao');
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




