'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton, DashboardInput, DashboardSelect } from '@/components/dashboard/DashboardPageLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { User, Settings, Bell, Shield, Link, Save, X } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState('perfil');

  const sections = [
    { id: 'perfil', name: 'Perfil', icon: 'user' },
    { id: 'conta', name: 'Conta', icon: 'settings' },
    { id: 'notificacoes', name: 'Notificações', icon: 'bell' },
    { id: 'seguranca', name: 'Segurança', icon: 'shield' },
    { id: 'integracao', name: 'Integração', icon: 'link' },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'perfil':
        return (
          <div className="space-y-6">
            {/* Informações Pessoais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <DashboardInput
                    type="text"
                    defaultValue="João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <DashboardInput
                    type="email"
                    defaultValue="joao.silva@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <DashboardInput
                    type="tel"
                    defaultValue="+55 11 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidade
                  </label>
                  <DashboardSelect>
                    <option>Nutrição Clínica</option>
                    <option>Nutrição Esportiva</option>
                    <option>Nutrição Funcional</option>
                    <option>Nutrição Comportamental</option>
                  </DashboardSelect>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografia
              </label>
              <textarea
                rows={4}
                defaultValue="Nutricionista com 5 anos de experiência em consultório. Especializada em emagrecimento e reeducação alimentar."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-300"
              />
            </div>

            {/* Preferências */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    defaultChecked
                    className="h-4 w-4 text-nutrimatic-600 focus:ring-nutrimatic-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                    Receber notificações por email
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketing"
                    className="h-4 w-4 text-nutrimatic-600 focus:ring-nutrimatic-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketing" className="ml-2 block text-sm text-gray-900">
                    Receber emails de marketing
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="updates"
                    defaultChecked
                    className="h-4 w-4 text-nutrimatic-600 focus:ring-nutrimatic-500 border-gray-300 rounded"
                  />
                  <label htmlFor="updates" className="ml-2 block text-sm text-gray-900">
                    Notificar sobre atualizações do sistema
                  </label>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200/50">
              <DashboardButton variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </DashboardButton>
              <DashboardButton variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </DashboardButton>
            </div>
          </div>
        );

      case 'conta':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações da Conta</h3>
              <p className="text-sm text-gray-500 mb-6">
                Gerencie as configurações básicas da sua conta
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <DashboardSelect>
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </DashboardSelect>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuso Horário
                  </label>
                  <DashboardSelect>
                    <option>America/Sao_Paulo (UTC-3)</option>
                    <option>UTC</option>
                  </DashboardSelect>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notificacoes':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Notificações</h3>
              <p className="text-sm text-gray-500 mb-6">
                Configure como e quando você deseja receber notificações
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gray-50/30">
                  <div>
                    <h4 className="font-medium text-gray-900">Notificações por Email</h4>
                    <p className="text-sm text-gray-500">Receba notificações importantes por email</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-nutrimatic-600 focus:ring-nutrimatic-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gray-50/30">
                  <div>
                    <h4 className="font-medium text-gray-900">Notificações Push</h4>
                    <p className="text-sm text-gray-500">Receba notificações em tempo real no navegador</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-nutrimatic-600 focus:ring-nutrimatic-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gray-50/30">
                  <div>
                    <h4 className="font-medium text-gray-900">Notificações SMS</h4>
                    <p className="text-sm text-gray-500">Receba notificações por SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-nutrimatic-600 focus:ring-nutrimatic-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'seguranca':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança da Conta</h3>
              <p className="text-sm text-gray-500 mb-6">
                Gerencie a segurança da sua conta e dados
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200/50 rounded-xl bg-gray-50/30">
                  <h4 className="font-medium text-gray-900 mb-2">Alterar Senha</h4>
                  <p className="text-sm text-gray-500 mb-3">Atualize sua senha regularmente para manter a conta segura</p>
                  <DashboardButton variant="primary" size="sm">
                    Alterar Senha
                  </DashboardButton>
                </div>
                
                <div className="p-4 border border-gray-200/50 rounded-xl bg-gray-50/30">
                  <h4 className="font-medium text-gray-900 mb-2">Autenticação de Dois Fatores</h4>
                  <p className="text-sm text-gray-500 mb-3">Adicione uma camada extra de segurança à sua conta</p>
                  <DashboardButton variant="outline" size="sm">
                    Configurar 2FA
                  </DashboardButton>
                </div>
                
                <div className="p-4 border border-gray-200/50 rounded-xl bg-gray-50/30">
                  <h4 className="font-medium text-gray-900 mb-2">Sessões Ativas</h4>
                  <p className="text-sm text-gray-500 mb-3">Gerencie dispositivos conectados à sua conta</p>
                  <DashboardButton variant="outline" size="sm">
                    Ver Sessões
                  </DashboardButton>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integracao':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrações</h3>
              <p className="text-sm text-gray-500 mb-6">
                Conecte suas ferramentas favoritas para automatizar seu fluxo de trabalho
              </p>
              
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Google Calendar</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Sincronize seus agendamentos com o Google Calendar
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2 bg-gray-300" />
                      <span className="text-sm text-gray-600">Desconectado</span>
                    </div>
                  </div>
                  <DashboardButton variant="primary" size="sm">
                    Conectar Google Calendar
                  </DashboardButton>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Stripe</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Conecte sua conta Stripe para processar pagamentos
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2 bg-gray-300" />
                      <span className="text-sm text-gray-600">Desconectado</span>
                    </div>
                  </div>
                  <DashboardButton variant="primary" size="sm">
                    Conectar Stripe
                  </DashboardButton>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      case 'bell':
        return <Bell className="w-4 h-4" />;
      case 'shield':
        return <Shield className="w-4 h-4" />;
      case 'link':
        return <Link className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout
        title="Configurações"
        subtitle="Gerencie suas preferências e configurações da conta"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu de Configurações */}
          <div className="lg:col-span-1">
            <ContentCard>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      activeSection === section.id
                        ? 'text-nutrimatic-700 bg-nutrimatic-50 border border-nutrimatic-200'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {getSectionIcon(section.icon)}
                    <span className="ml-3">{section.name}</span>
                  </button>
                ))}
              </nav>
            </ContentCard>
          </div>

          {/* Conteúdo das Configurações */}
          <div className="lg:col-span-2">
            <ContentCard
              title={sections.find(s => s.id === activeSection)?.name}
              subtitle={
                activeSection === 'perfil' && 'Gerencie suas informações pessoais e preferências' ||
                activeSection === 'conta' && 'Configure as opções básicas da sua conta' ||
                activeSection === 'notificacoes' && 'Gerencie suas preferências de notificação' ||
                activeSection === 'seguranca' && 'Configure a segurança da sua conta' ||
                activeSection === 'integracao' && 'Conecte suas ferramentas favoritas' ||
                ''
              }
            >
              {renderSectionContent()}
            </ContentCard>
          </div>
        </div>
      </DashboardPageLayout>
    </DashboardLayout>
    </ProtectedRoute>
  );
} 