'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardInput, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  Plus,
  Filter,
  Archive
} from 'lucide-react';

interface Conversa {
  id: string;
  nome: string;
  ultimaMensagem: string;
  horario: string;
  avatar: string;
  naoLidas: number;
  online: boolean;
  tipo: 'cliente' | 'nutricionista' | 'equipe';
}

interface Mensagem {
  id: string;
  texto: string;
  horario: string;
  enviada: boolean;
  lida: boolean;
  tipo?: 'texto' | 'imagem' | 'arquivo';
}

const conversasExemplo: Conversa[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    ultimaMensagem: 'Obrigada pelas orientações nutricionais! Estou me sentindo muito melhor.',
    horario: '14:30',
    avatar: 'MS',
    naoLidas: 2,
    online: true,
    tipo: 'cliente'
  },
  {
    id: '2',
    nome: 'João Santos',
    ultimaMensagem: 'Quando é minha próxima consulta? Preciso reagendar.',
    horario: '13:45',
    avatar: 'JS',
    naoLidas: 0,
    online: false,
    tipo: 'cliente'
  },
  {
    id: '3',
    nome: 'Ana Costa',
    ultimaMensagem: 'Posso substituir o frango por peixe na dieta?',
    horario: '12:20',
    avatar: 'AC',
    naoLidas: 1,
    online: true,
    tipo: 'cliente'
  },
  {
    id: '4',
    nome: 'Dr. Pedro Oliveira',
    ultimaMensagem: 'Reunião de equipe amanhã às 9h.',
    horario: 'Ontem',
    avatar: 'PO',
    naoLidas: 0,
    online: false,
    tipo: 'nutricionista'
  },
  {
    id: '5',
    nome: 'Carla Mendes',
    ultimaMensagem: 'Recebi os exames, vou analisar hoje.',
    horario: 'Ontem',
    avatar: 'CM',
    naoLidas: 3,
    online: true,
    tipo: 'cliente'
  }
];

const mensagensExemplo: { [key: string]: Mensagem[] } = {
  '1': [
    {
      id: '1',
      texto: 'Olá Maria! Como está se sentindo com a nova dieta?',
      horario: '14:25',
      enviada: true,
      lida: true
    },
    {
      id: '2',
      texto: 'Estou me sentindo muito bem! Já perdi 2kg.',
      horario: '14:28',
      enviada: false,
      lida: true
    },
    {
      id: '3',
      texto: 'Obrigada pelas orientações nutricionais! Estou me sentindo muito melhor.',
      horario: '14:30',
      enviada: false,
      lida: false
    }
  ],
  '2': [
    {
      id: '1',
      texto: 'Oi João! Sua próxima consulta está marcada para sexta-feira às 15h.',
      horario: '13:40',
      enviada: true,
      lida: true
    },
    {
      id: '2',
      texto: 'Quando é minha próxima consulta? Preciso reagendar.',
      horario: '13:45',
      enviada: false,
      lida: true
    }
  ]
};

export default function ConversasPage() {
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'cliente' | 'nutricionista' | 'equipe'>('todos');

  const conversaAtual = conversaSelecionada ? conversasExemplo.find(c => c.id === conversaSelecionada) : null;
  const mensagensAtuais = conversaSelecionada ? mensagensExemplo[conversaSelecionada] || [] : [];

  const conversasFiltradas = conversasExemplo.filter(conversa => {
    const matchBusca = conversa.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      conversa.ultimaMensagem.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || conversa.tipo === filtroTipo;
    return matchBusca && matchTipo;
  });

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaSelecionada) return;
    
    // Aqui seria implementada a lógica de envio real
    console.log('Enviando mensagem:', novaMensagem);
    setNovaMensagem('');
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'cliente': return 'bg-blue-100 text-blue-800';
      case 'nutricionista': return 'bg-green-100 text-green-800';
      case 'equipe': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvatarColor = (nome: string) => {
    const colors = [
      'bg-nutrimatic-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    const index = nome.length % colors.length;
    return colors[index];
  };

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conversas</h1>
              <p className="text-gray-600 mt-1">Central de mensagens e comunicação</p>
            </div>
            <div className="flex items-center space-x-3">
              <DashboardButton variant="secondary" size="sm">
                <Archive className="w-4 h-4 mr-2" />
                Arquivadas
              </DashboardButton>
              <DashboardButton variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Conversa
              </DashboardButton>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex overflow-hidden">
          <div className="grid grid-cols-12 gap-6 w-full h-full p-6">
          {/* Lista de Conversas */}
          <div className="col-span-12 lg:col-span-4 h-full">
            <ContentCard className="h-full flex flex-col">
              {/* Header da Lista - Fixo */}
              <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <DashboardInput
                      type="text"
                      placeholder="Buscar conversas..."
                      value={busca}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex space-x-2 overflow-x-auto">
                    {['todos', 'cliente', 'nutricionista', 'equipe'].map((tipo) => (
                      <button
                        key={tipo}
                        onClick={() => setFiltroTipo(tipo as any)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                          filtroTipo === tipo
                            ? 'bg-nutrimatic-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lista de Conversas - Scrollável */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {conversasFiltradas.map((conversa) => (
                  <div
                    key={conversa.id}
                    onClick={() => setConversaSelecionada(conversa.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                      conversaSelecionada === conversa.id ? 'bg-nutrimatic-50 border-l-4 border-l-nutrimatic-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full ${getAvatarColor(conversa.nome)} flex items-center justify-center text-white font-semibold text-sm`}>
                          {conversa.avatar}
                        </div>
                        {conversa.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{conversa.nome}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{conversa.horario}</span>
                            {conversa.naoLidas > 0 && (
                              <span className="bg-nutrimatic-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversa.naoLidas}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                            {conversa.ultimaMensagem}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTipoColor(conversa.tipo)}`}>
                            {conversa.tipo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>
          </div>

          {/* Área de Chat */}
          <div className="col-span-12 lg:col-span-8 h-full">
            <ContentCard className="h-full flex flex-col">
              {conversaAtual ? (
                <>
                  {/* Header do Chat - Fixo */}
                  <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full ${getAvatarColor(conversaAtual.nome)} flex items-center justify-center text-white font-semibold text-sm`}>
                            {conversaAtual.avatar}
                          </div>
                          {conversaAtual.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{conversaAtual.nome}</h3>
                          <p className="text-sm text-gray-500">
                            {conversaAtual.online ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-nutrimatic-600 hover:bg-nutrimatic-50 rounded-lg transition-colors">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-nutrimatic-600 hover:bg-nutrimatic-50 rounded-lg transition-colors">
                          <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-nutrimatic-600 hover:bg-nutrimatic-50 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mensagens - Scrollável */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
                    {mensagensAtuais.map((mensagem) => (
                      <div
                        key={mensagem.id}
                        className={`flex ${mensagem.enviada ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            mensagem.enviada
                              ? 'bg-nutrimatic-500 text-white'
                              : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{mensagem.texto}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            mensagem.enviada ? 'text-nutrimatic-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{mensagem.horario}</span>
                            {mensagem.enviada && (
                              mensagem.lida ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de Mensagem - Fixo */}
                  <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-gray-500 hover:text-nutrimatic-600 hover:bg-nutrimatic-50 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Digite uma mensagem..."
                          value={novaMensagem}
                          onChange={(e) => setNovaMensagem(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nutrimatic-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <button className="p-2 text-gray-500 hover:text-nutrimatic-600 hover:bg-nutrimatic-50 rounded-lg transition-colors">
                        <Smile className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={enviarMensagem}
                        disabled={!novaMensagem.trim()}
                        className="p-3 bg-nutrimatic-500 text-white rounded-xl hover:bg-nutrimatic-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Estado Inicial - Nenhuma Conversa Selecionada */
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-nutrimatic-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="w-12 h-12 text-nutrimatic-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecione uma conversa</h3>
                    <p className="text-gray-500 max-w-sm">
                      Escolha uma conversa da lista ao lado para começar a conversar com seus clientes e equipe.
                    </p>
                  </div>
                </div>
              )}
            </ContentCard>
          </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}