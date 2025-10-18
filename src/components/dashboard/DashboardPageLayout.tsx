'use client';

import { ReactNode, memo } from 'react';

interface DashboardPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

const DashboardPageLayout = memo(function DashboardPageLayout({ 
  children, 
  title, 
  subtitle, 
  actions,
  className = "" 
}: DashboardPageLayoutProps) {
  return (
    <div className={`space-y-4 lg:space-y-6 ${className}`}>
      {/* Header da Página - Responsivo */}
      <div className="bg-white/80 backdrop-blur-xl rounded-lg lg:rounded-xl shadow-lg border border-gray-200/50 p-4 lg:p-6">
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 font-display truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo da Página - Responsivo */}
      <div className="space-y-4 lg:space-y-6">
        {children}
      </div>
    </div>
  );
});

export default DashboardPageLayout;

// Componente para cards de estatísticas
export const StatsCard = memo(function StatsCard({ 
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
    <div className={`bg-white/80 backdrop-blur-xl rounded-lg lg:rounded-xl shadow-lg border border-gray-200/50 p-4 lg:p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center">
        <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl ${colorClasses[color]} flex-shrink-0`}>
          <div className="w-5 h-5 lg:w-6 lg:h-6">
            {icon}
          </div>
        </div>
        <div className="ml-3 lg:ml-4 flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{title}</p>
          <div className="flex items-center space-x-1 lg:space-x-2">
            <p className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{value}</p>
            {trend && (
              <span className={`text-xs lg:text-sm font-medium flex-shrink-0 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Componente para cards de conteúdo
export const ContentCard = memo(function ContentCard({ 
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
    <div className={`bg-white/80 backdrop-blur-xl rounded-lg lg:rounded-xl shadow-lg border border-gray-200/50 ${className}`}>
      {(title || actions) && (
        <div className="p-4 lg:p-6 border-b border-gray-200/50">
          <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="min-w-0 flex-1">
              {title && <h2 className="text-base lg:text-lg font-semibold text-gray-900 truncate">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {actions && (
              <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-4 lg:p-6">
        {children}
      </div>
    </div>
  );
});

// Componente para botões consistentes
export const DashboardButton = memo(function DashboardButton({ 
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
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 touch-manipulation";
  
  const variants = {
    primary: "bg-nutrimatic-600 text-white hover:bg-nutrimatic-700 focus:ring-nutrimatic-500 shadow-lg hover:shadow-xl active:bg-nutrimatic-800",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 active:bg-gray-100",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200"
  };

  const sizes = {
    sm: "px-2 py-1.5 text-xs lg:px-3 lg:py-2 lg:text-sm",
    md: "px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-sm",
    lg: "px-4 py-2.5 text-sm lg:px-6 lg:py-3 lg:text-base"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

// Componente para inputs consistentes
export const DashboardInput = memo(function DashboardInput({ 
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
});

// Componente para selects consistentes
export const DashboardSelect = memo(function DashboardSelect({ 
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
});

// Componente para badges de status
export const StatusBadge = memo(function StatusBadge({ 
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
});