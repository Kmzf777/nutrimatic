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
    <div className={`space-y-6 ${className}`}>
      {/* Header da Página */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 font-display truncate tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-3 flex-shrink-0">
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
    nutrimatic: "bg-nutrimatic-50 text-nutrimatic-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600"
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-4">
          <div className={`p-1.5 rounded-md ${colorClasses[color]}`}>
            {icon}
          </div>
          {title}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full mb-1 flex items-center ${trend.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
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
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {(title || actions) && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="min-w-0 flex-1">
              {title && <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {actions && (
              <div className="flex items-center space-x-3 flex-shrink-0">
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
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 touch-manipulation";
  
  const variants = {
    primary: "bg-nutrimatic-600 text-white hover:bg-nutrimatic-700 shadow-sm hover:shadow active:bg-nutrimatic-800",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs lg:text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base"
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
      className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500/20 focus:border-nutrimatic-500 transition-all duration-200 ${className}`}
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
      className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500/20 focus:border-nutrimatic-500 transition-all duration-200 ${className}`}
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
    success: "bg-green-50 text-green-700 border border-green-100",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    error: "bg-red-50 text-red-700 border border-red-100",
    info: "bg-nutrimatic-50 text-nutrimatic-700 border border-nutrimatic-100",
    pending: "bg-gray-50 text-gray-700 border border-gray-100"
  };

  const statusText = {
    success: "Aprovado",
    warning: "Pendente",
    error: "Reprovado",
    info: "Informação",
    pending: "Pendente"
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusClasses[status]} ${className}`}>
      {statusText[status]}
    </span>
  );
});
