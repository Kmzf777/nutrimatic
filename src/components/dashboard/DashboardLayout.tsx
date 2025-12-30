'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Bot, Users, CalendarDays, MessageCircle, FileText, LogOut } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import RippleButton from '../ui/RippleButton';
import MobileBottomNavigation from './MobileBottomNavigation';
import { useMenuState } from '../../hooks/useMenuState';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeItem, setActiveItem] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, nutricionista, signOut } = useAuth();
  const {
    isMenuExpanded,
    isHovering,
    isMobile,
    isMenuVisible,
    isInitialized,
    setIsMenuExpanded,
    handleMenuToggle,
    handleMouseEnter,
    handleMouseLeave,
  } = useMenuState();

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      href: '/dashboard',
    },
    {
      name: 'Clientes',
      icon: (<Users className="w-5 h-5" />),
      href: '/dashboard/clientes'
    },
    {
      name: 'Prescrições',
      icon: (<FileText className="w-5 h-5" />),
      href: '/dashboard/prescricoes'
    },
    {
      name: 'Agenda',
      icon: (<CalendarDays className="w-5 h-5" />),
      href: '/dashboard/agenda'
    },
    {
      name: 'Agentes AI',
      icon: (
        <Bot className="w-5 h-5" />
      ),
      href: '/agentes',
    },
  ];

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    if (isMobile) {
      setTimeout(() => setIsMenuExpanded(false), 300);
    }
  };

  // Fechar o menu automaticamente ao mudar de rota no mobile
  useEffect(() => {
    if (isMobile && isMenuExpanded) {
      setIsMenuExpanded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Overlay */}
      {!isMobile && isMenuExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuExpanded(false)}
        />
      )}

      {/* Sidebar - Desktop only */}
      {!isMobile && (
      <div
        className={`sidebar-menu fixed z-50 h-full bg-white shadow-xl border-r border-gray-100 transition-all duration-300 ease-out w-64 translate-x-0`}
      >
        {/* Header with Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50">
          <div className="flex items-center w-full">
            {/* Logo */}
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <Image
                src="/Nutrimatic Icon Vetor.png"
                alt="Nutrimatic"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            
            {/* Texto Nutrimatic */}
            <div className="ml-3 flex items-center h-10">
              <span className="text-xl font-bold text-gray-800 font-display whitespace-nowrap leading-10 tracking-tight">
                Nutrimatic
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => handleItemClick(item.href)}
                  className={`group relative flex items-center h-11 px-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-nutrimatic-50 text-nutrimatic-700 font-medium' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <div className={`flex items-center justify-center w-5 h-5 mr-3 transition-colors duration-200
                    ${isActive ? 'text-nutrimatic-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `}>
                    {item.icon}
                  </div>
                  
                  <span className="text-sm truncate flex-1">
                    {item.name}
                  </span>
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wide
                      ${isActive 
                        ? 'bg-nutrimatic-100 text-nutrimatic-700' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-50 bg-white">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 bg-nutrimatic-100 rounded-full flex items-center justify-center text-nutrimatic-700 font-semibold text-xs flex-shrink-0">
                {nutricionista?.nome?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              
              <div className="ml-2 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                  {nutricionista?.nome || 'Usuário'}
                </p>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLogoutModal(true);
              }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Main Content - Full width */}
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {/* Mobile menu button - only visible on mobile */}
        <div className="lg:hidden p-3 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl flex-shrink-0 relative z-30">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9"></div>
            {/* Logo mobile */}
            <div className="flex items-center space-x-2">
              <Image
                src="/Nutrimatic Icon Vetor.png"
                alt="Nutrimatic"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-lg font-bold text-nutrimatic-600 font-display">
                Nutrimatic
              </span>
            </div>
            <div className="w-9 h-9"></div> {/* Spacer para centralizar o logo */}
          </div>
        </div>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto overflow-x-hidden dashboard-content transition-all duration-300 ease-out ${
          isMobile ? 'pl-0' : 'lg:pl-64'
        }`}>
          <div className="animate-fade-in main-content p-6 lg:p-8 pb-20 lg:pb-8 bg-gray-50 min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Confirmar Logout
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o dashboard.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  try {
                    await signOut();
                    console.log('✅ Logout concluído, redirecionando...');
                    window.location.href = '/login'; // Forçar redirecionamento
                  } catch (error) {
                    console.error('❌ Erro no logout:', error);
                    // Mesmo com erro, redirecionar para login
                    window.location.href = '/login';
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Confirmar Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </div>
  );
}