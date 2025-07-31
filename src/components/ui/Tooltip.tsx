'use client';

import { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({ children, content, position = 'right', delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg
            ${positionClasses[position]}
            animate-scale-in pointer-events-none
            before:absolute before:w-2 before:h-2 before:bg-gray-900 before:transform before:rotate-45
            ${position === 'top' ? 'before:top-full before:left-1/2 before:-translate-x-1/2 before:-translate-y-1' : ''}
            ${position === 'bottom' ? 'before:bottom-full before:left-1/2 before:-translate-x-1/2 before:translate-y-1' : ''}
            ${position === 'left' ? 'before:left-full before:top-1/2 before:-translate-y-1/2 before:translate-x-1' : ''}
            ${position === 'right' ? 'before:right-full before:top-1/2 before:-translate-y-1/2 before:-translate-x-1' : ''}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
} 