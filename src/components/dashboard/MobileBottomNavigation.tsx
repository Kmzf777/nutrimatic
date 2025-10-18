'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Users, CalendarDays, MessageCircle, LayoutDashboard } from 'lucide-react';

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

export default function MobileBottomNavigation() {
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/dashboard',
    },
    {
      name: 'Clientes',
      icon: <Users className="w-5 h-5" />,
      href: '/dashboard/clientes'
    },
    {
      name: 'Agenda',
      icon: <CalendarDays className="w-5 h-5" />,
      href: '/dashboard/agenda'
    },
    {
      name: 'Conversas',
      icon: <MessageCircle className="w-5 h-5" />,
      href: '/dashboard/conversas'
    },
    {
      name: 'Agentes',
      icon: <Bot className="w-5 h-5" />,
      href: '/agentes',
      badge: 'Novo'
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 relative touch-manipulation ${
                isActive 
                  ? 'text-nutrimatic-600' 
                  : 'text-gray-500 hover:text-gray-700 active:text-nutrimatic-600'
              }`}
            >
              {/* Indicador ativo */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-nutrimatic-600 rounded-full" />
              )}
              
              {/* Ícone com badge */}
              <div className="relative">
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  {item.icon}
                </div>
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-nutrimatic-500 rounded-full" />
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'text-nutrimatic-600' : 'text-gray-500'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area para dispositivos com home indicator */}
      <div className="h-safe-area-inset-bottom bg-white/95" />
    </div>
  );
}