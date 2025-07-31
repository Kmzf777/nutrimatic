'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Tooltip from '../ui/Tooltip';
import RippleButton from '../ui/RippleButton';
import { useMenuState } from '../../hooks/useMenuState';

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
  const pathname = usePathname();
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
      name: 'Receitas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '/dashboard/receitas',
      badge: '12'
    },
    {
      name: 'Clientes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      href: '/dashboard/clientes',
      badge: '3'
    },
    {
      name: 'Agente IA',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      href: '/dashboard/agenteia',
    },
    {
      name: 'Configurações',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/dashboard/configuracoes',
    },
  ];

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    if (isMobile) {
      setTimeout(() => setIsMenuExpanded(false), 300);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Overlay for mobile */}
      {isMenuExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-menu fixed lg:relative z-50 h-full bg-white shadow-2xl border-r border-gray-200/50 backdrop-blur-xl
          ${isInitialized ? 'transition-all duration-700 ease-out' : ''}
          ${isMenuVisible ? 'w-72' : 'w-20'} 
          ${isMenuVisible ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full lg:translate-x-0'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header with Logo */}
        <div className="h-20 border-b border-gray-200/50 flex items-center px-5 bg-gradient-to-r from-nutrimatic-50 to-white">
          <div className="flex items-center">
            {/* Logo - sempre fixo à esquerda */}
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/Nutrimatic Icon Vetor.png"
                alt="Nutrimatic"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            
                         {/* Texto Nutrimatic - aparece quando menu abre */}
                           <div
                className={`ml-3 overflow-visible flex items-center ${isInitialized ? 'transition-all duration-700 ease-out' : ''} ${
                  isMenuVisible ? 'max-w-48 opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-4'
                }`}
              >
                               <span className="text-2xl font-bold text-nutrimatic-600 font-display truncate -mb-3.5" title="Nutrimatic">
                  Nutrimatic
                </span>
             </div>
          </div>
          
          {/* Toggle Button - Só visível no mobile */}
          <RippleButton
            onClick={handleMenuToggle}
            className={`absolute right-4 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 
              hover:bg-nutrimatic-50 hover:border-nutrimatic-200 transition-all duration-300 lg:hidden
              ${isMenuExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          >
            <svg 
              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isMenuExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </RippleButton>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-5 py-4 pb-20 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const isVisible = isMenuVisible;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => handleItemClick(item.href)}
                  className={`group relative flex items-center h-12 rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'bg-nutrimatic-50 border border-nutrimatic-200' 
                      : 'hover:bg-nutrimatic-50 hover:text-nutrimatic-700'
                    }
                  `}
                >
                  {/* Ícone - sempre centralizado no seu container */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 flex-shrink-0
                    ${isActive ? 'bg-nutrimatic-500 text-white shadow-lg' : 'text-gray-500 group-hover:text-nutrimatic-600'}
                  `}>
                    {!isVisible ? (
                      <Tooltip content={item.name} position="right" delay={200}>
                        {item.icon}
                      </Tooltip>
                    ) : (
                      item.icon
                    )}
                  </div>
                  
                                     {/* Texto - aparece quando menu abre */}
                   <div
                     className={`ml-3 overflow-hidden flex items-center flex-1 ${isInitialized ? 'transition-all duration-700 ease-out' : ''} ${
                       isVisible ? 'max-w-48 opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-4'
                     }`}
                   >
                                           <div className="flex items-center min-w-0 flex-1">
                        <span className={`font-medium text-base truncate flex-1 ${isActive ? 'text-nutrimatic-700' : 'text-gray-700'}`} title={item.name}>
                          {item.name}
                        </span>
                       
                       {/* Badge */}
                       {item.badge && (
                         <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full flex-shrink-0
                           ${isActive 
                             ? 'bg-nutrimatic-200 text-nutrimatic-800' 
                             : 'bg-nutrimatic-100 text-nutrimatic-700 group-hover:bg-nutrimatic-200'
                           }
                         `}>
                           {item.badge}
                         </span>
                       )}
                     </div>
                   </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center px-5 py-3">
            <div className="w-8 h-8 bg-gradient-to-br from-nutrimatic-500 to-nutrimatic-600 rounded-full flex items-center justify-center flex-shrink-0 shadow">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            
                         <div
               className={`ml-3 overflow-hidden flex flex-col justify-center ${isInitialized ? 'transition-all duration-700 ease-out' : ''} ${
                 isMenuVisible ? 'max-w-48 opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-4'
               }`}
             >
                               <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Usuário</p>
                  <p className="text-xs text-gray-500 truncate">usuario@nutrimatic.com</p>
                </div>
             </div>
            
            {/* Logout button */}
            <button
              className={`ml-auto p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300
                ${isMenuVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile menu button - only visible on mobile */}
        <div className="lg:hidden p-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl flex-shrink-0">
          <button
            onClick={handleMenuToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 dashboard-content">
          <div className="animate-fade-in main-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 