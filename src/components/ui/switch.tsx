'use client';

import { useState } from 'react';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Switch({ 
  checked = false, 
  onCheckedChange, 
  disabled = false, 
  size = 'md',
  className = '' 
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(checked);
  
  const isChecked = checked !== undefined ? checked : internalChecked;
  
  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    
    if (checked === undefined) {
      setInternalChecked(newChecked);
    }
    
    onCheckedChange?.(newChecked);
  };
  
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5', 
    lg: 'w-12 h-6'
  };
  
  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const translateClasses = {
    sm: isChecked ? 'translate-x-4' : 'translate-x-0.5',
    md: isChecked ? 'translate-x-5' : 'translate-x-0.5',
    lg: isChecked ? 'translate-x-6' : 'translate-x-0.5'
  };
  
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${sizeClasses[size]}
        ${isChecked ? 'bg-blue-600' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${thumbSizeClasses[size]}
          ${translateClasses[size]}
        `}
      />
    </button>
  );
}