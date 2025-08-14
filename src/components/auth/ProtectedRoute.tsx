'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireActive?: boolean;
}

export default function ProtectedRoute({ children, requireActive = true }: ProtectedRouteProps) {
  const { user, nutricionista, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Aguardar até que o loading termine
    if (loading) {
      console.log('⏳ Aguardando autenticação...');
      return;
    }

    // Se não há usuário, redirecionar para login
    if (!user) {
      console.log('👋 Usuário não autenticado, redirecionando para login');
      router.replace('/login');
      return;
    }

    // **CORREÇÃO**: Se tem usuário mas nutricionista é null, renderizar mesmo assim
    // O AuthContext agora garante que isso não será um estado inconsistente
    if (user && nutricionista === null) {
      console.log('⚠️ Usuário sem dados de nutricionista - renderizando mesmo assim');
      return;
    }

    // Se requer usuário ativo mas o nutricionista não está ativo
    if (requireActive && nutricionista && !nutricionista.active) {
      console.log('🔄 Nutricionista inativo, redirecionando para setup');
      router.replace('/setup');
      return;
    }

    // Se não requer usuário ativo mas o nutricionista está ativo, redirecionar para dashboard
    if (!requireActive && nutricionista && nutricionista.active) {
      console.log('✅ Nutricionista ativo, redirecionando para dashboard');
      router.replace('/dashboard');
      return;
    }

    console.log('✅ Proteção de rota OK - usuário:', user.email, 'nutricionista:', nutricionista?.nome || 'sem dados');
  }, [user, nutricionista, loading, requireActive, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-nutrimatic-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário, não renderizar nada (será redirecionado)
  if (!user) {
    return null;
  }

  // **CORREÇÃO**: Permitir renderização mesmo sem nutricionista
  // O AuthContext agora garante consistência dos dados
  
  // Se requer usuário ativo mas não está ativo, não renderizar nada (será redirecionado)
  if (requireActive && nutricionista && !nutricionista.active) {
    return null;
  }

  // Se não requer usuário ativo mas está ativo, não renderizar nada (será redirecionado)
  if (!requireActive && nutricionista && nutricionista.active) {
    return null;
  }

  return <>{children}</>;
} 