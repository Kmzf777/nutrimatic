'use client';

import { useState, ReactNode } from 'react';
import Notification from './Notification';

interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationProviderProps {
  children?: ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Expor a função globalmente para uso em outros componentes
  if (typeof window !== 'undefined') {
    (window as any).showNotification = showNotification;
  }

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-[60] space-y-2 pointer-events-none">
        {notifications.map((notification, index) => (
          <div 
            key={notification.id} 
            className="pointer-events-auto"
            style={{ 
              transform: `translateY(${index * 80}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <Notification
              type={notification.type}
              title={notification.title}
              message={notification.message}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
} 