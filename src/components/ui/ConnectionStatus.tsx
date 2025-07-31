'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
}

export default function ConnectionStatus({ className = '' }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);

  useEffect(() => {
    // Verificar status online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar se o real-time está ativo
    const checkRealTimeStatus = () => {
      // Simular verificação de status (você pode implementar uma verificação real)
      setIsRealTimeActive(true);
    };

    // Verificar após 2 segundos para dar tempo do real-time conectar
    const timer = setTimeout(checkRealTimeStatus, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className={`flex items-center space-x-2 text-red-600 ${className}`}>
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Offline</span>
      </div>
    );
  }



  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isRealTimeActive ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Tempo real</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Conectando...</span>
        </>
      )}
    </div>
  );
} 