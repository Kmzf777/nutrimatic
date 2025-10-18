'use client';

import { useEffect, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

interface DesktopOnlyProps {
  children: React.ReactNode;
  title?: string;
  message?: string;
}

export default function DesktopOnly({ 
  children, 
  title = "Acesso Restrito ao Desktop",
  message = "Esta funcionalidade está disponível apenas em dispositivos desktop para uma melhor experiência."
}: DesktopOnlyProps) {
  const [isMobile, setIsMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsLoading(false);
    };

    // Verificar imediatamente
    checkScreenSize();
    
    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mostrar loading enquanto verifica o tamanho da tela
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nutrimatic-600"></div>
      </div>
    );
  }

  // Se for mobile, mostrar mensagem de restrição
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-nutrimatic-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Monitor className="w-10 h-10 text-nutrimatic-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-red-500" />
              <span>Mobile</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-green-500" />
              <span>Desktop</span>
            </div>
          </div>
          
          <div className="bg-nutrimatic-50 rounded-lg p-4">
            <p className="text-sm text-nutrimatic-700">
              💡 <strong>Dica:</strong> Acesse esta página em um computador ou tablet em modo paisagem para continuar.
            </p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="mt-6 w-full bg-nutrimatic-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-nutrimatic-700 transition-colors duration-200"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Se for desktop, renderizar o conteúdo normalmente
  return <>{children}</>;
}