'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function Notification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'bg-green-100',
          title: 'text-green-900',
          message: 'text-green-700'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'bg-red-100',
          title: 'text-red-900',
          message: 'text-red-700'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'bg-yellow-100',
          title: 'text-yellow-900',
          message: 'text-yellow-700'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'bg-blue-100',
          title: 'text-blue-900',
          message: 'text-blue-700'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'bg-gray-100',
          title: 'text-gray-900',
          message: 'text-gray-700'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed top-4 right-4 z-[60] max-w-sm w-full pointer-events-auto">
      <div className={`${styles.container} rounded-xl border shadow-xl p-4 backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 ${styles.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold ${styles.title} mb-1`}>{title}</h4>
            <p className={`text-sm ${styles.message}`}>{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

 