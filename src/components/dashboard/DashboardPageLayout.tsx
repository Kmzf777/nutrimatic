'use client';

import { ReactNode } from 'react';

interface DashboardPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export default function DashboardPageLayout({ 
  children, 
  title, 
  subtitle, 
  actions,
  className = "" 
}: DashboardPageLayoutProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header da Página */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo da Página */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

// Componente para cards de estatísticas
export function StatsCard({ 
  title, 
  value, 
  icon, 
  color = "nutrimatic",
  trend,
  className = "" 
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "nutrimatic" | "yellow" | "red" | "purple" | "green";
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) {
  const colorClasses = {
    nutrimatic: "bg-nutrimatic-100 text-nutrimatic-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600"
  };

  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para cards de conteúdo
export function ContentCard({ 
  children, 
  title,
  subtitle,
  actions,
  className = "" 
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 ${className}`}>
      {(title || actions) && (
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Componente para botões consistentes
export function DashboardButton({ 
  children, 
  variant = "primary",
  size = "md",
  className = "",
  ...props 
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  [key: string]: any;
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-nutrimatic-600 text-white hover:bg-nutrimatic-700 focus:ring-nutrimatic-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Componente para inputs consistentes
export function DashboardInput({ 
  className = "",
  ...props 
}: {
  className?: string;
  [key: string]: any;
}) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-300 ${className}`}
      {...props}
    />
  );
}

// Componente para selects consistentes
export function DashboardSelect({ 
  children,
  className = "",
  ...props 
}: {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <select
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

// Componente para badges de status
export function StatusBadge({ 
  status, 
  className = "" 
}: {
  status: "success" | "warning" | "error" | "info" | "pending";
  className?: string;
}) {
  const statusClasses = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-nutrimatic-100 text-nutrimatic-800",
    pending: "bg-gray-100 text-gray-800"
  };

  const statusText = {
    success: "Aprovado",
    warning: "Pendente",
    error: "Reprovado",
    info: "Informação",
    pending: "Pendente"
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[status]} ${className}`}>
      {statusText[status]}
    </span>
  );
} 