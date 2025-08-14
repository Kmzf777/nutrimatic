'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';
import { Nutricionista } from '@/types/auth';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  nutricionista: Nutricionista | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  refreshNutricionista: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [nutricionista, setNutricionista] = useState<Nutricionista | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const supabase = createClient();
  const isInitializing = useRef(false);

  const fetchNutricionista = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('nutricionistas')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar nutricionista:', error);
        // Se não encontrar nutricionista, criar um registro básico
        if (error.code === 'PGRST116') {
          console.log('🔧 Criando registro básico de nutricionista...');
          setNutricionista({
            id: userId,
            nome: 'Usuário',
            email: '',
            telefone: '',
            active: true,
            presc_max: 50,
            presc_geradas: 0
          } as any);
        } else {
          // Para outros erros, definir como null mas não bloquear
          setNutricionista(null);
        }
        return;
      }

      setNutricionista(data);
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar nutricionista:', error);
      // Em caso de erro, não bloquear o usuário
      setNutricionista({
        id: userId,
        nome: 'Usuário',
        email: '',
        telefone: '',
        active: true,
        presc_max: 50,
        presc_geradas: 0
      } as any);
    }
  };

  const refreshNutricionista = async () => {
    if (user) {
      await fetchNutricionista(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        return { error };
      }

      console.log('✅ Login bem-sucedido no Supabase:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('❌ Erro inesperado no login:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 Fazendo logout...');
      
      // Forçar logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout do Supabase:', error);
      }
      
      // Limpar estado local sempre
      setUser(null);
      setNutricionista(null);
      
      // Limpar localStorage se existir
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-localhost-auth-token');
      }
      
      console.log('✅ Logout concluído');
    } catch (error) {
      console.error('❌ Erro inesperado ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Evitar inicialização múltipla
    if (isInitializing.current) {
      return;
    }
    
    isInitializing.current = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticação...');
        
        // Verificar se Supabase está configurado
        if (!isSupabaseConfigured()) {
          console.warn('⚠️ Supabase não configurado - usando dados mockados');
          setUser(null);
          setNutricionista(null);
          setLoading(false);
          setInitialized(true);
          return;
        }

        // Verificar sessão atual com timeout de segurança
        const sessionResult = await Promise.race([
          supabase.auth.getSession(),
          new Promise<{ data: { session: Session | null }, error: any }>((resolve) =>
            setTimeout(() => resolve({ data: { session: null }, error: null }), 5000)
          )
        ]);
        const { data: { session }, error } = sessionResult as { data: { session: Session | null }, error: any };
        
        if (error) {
          console.error('❌ Erro ao verificar sessão:', error.message);
          setUser(null);
          setNutricionista(null);
          setLoading(false);
          setInitialized(true);
          return;
        } 
        
        if (session?.user) {
          console.log('✅ Sessão ativa encontrada:', session.user.email);
          setUser(session.user);
          
          console.log('🔄 Buscando dados do nutricionista...');
          // Buscar nutricionista com timeout de segurança
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout na busca do nutricionista')), 5000)
          );
          
          try {
            await Promise.race([fetchNutricionista(session.user.id), timeoutPromise]);
            console.log('✅ Dados do nutricionista carregados');
          } catch (timeoutError) {
            console.warn('⚠️ Timeout na busca do nutricionista, criando dados básicos');
            setNutricionista({
              id: session.user.id,
              nome: session.user.email?.split('@')[0] || 'Usuário',
              email: session.user.email || '',
              telefone: '',
              active: true,
              presc_max: 50,
              presc_geradas: 0
            } as any);
          }
        } else {
          console.log('👤 Nenhuma sessão ativa');
          setUser(null);
          setNutricionista(null);
        }

      } catch (err) {
        console.error('❌ Erro na inicialização:', err);
        setUser(null);
        setNutricionista(null);
      } finally {
        console.log('✅ Inicialização completa - definindo loading = false');
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    // Escutar mudanças de autenticação APENAS após inicialização
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        // **CRÍTICO**: Ignorar eventos durante inicialização
        if (!initialized) {
          console.log('🔄 Auth event durante inicialização, ignorando:', event);
          return;
        }
        
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ Login detectado:', session.user.email);
          
          // **CORREÇÃO CRÍTICA**: Só ativar loading se for um login REAL
          // Se o usuário já existe com o mesmo ID, é apenas mudança de visibilidade da aba
          const isNewLogin = !user || user.id !== session.user.id;
          const needsNutricionista = !nutricionista || nutricionista.id !== session.user.id;
          
          if (isNewLogin) {
            console.log('🔄 Novo login detectado, ativando loading');
            setLoading(true);
          } else {
            console.log('📱 Mudança de visibilidade da aba detectada, mantendo estado atual');
          }
          
          setUser(session.user);
          
          // Só buscar nutricionista se necessário
          if (needsNutricionista) {
            console.log('🔄 Buscando dados do nutricionista...');
            try {
              await fetchNutricionista(session.user.id);
            } catch (error) {
              console.error('❌ Erro ao buscar nutricionista após login:', error);
              // Criar nutricionista básico em caso de erro
              setNutricionista({
                id: session.user.id,
                nome: session.user.email?.split('@')[0] || 'Usuário',
                email: session.user.email || '',
                telefone: '',
                active: true,
                presc_max: 50,
                presc_geradas: 0
              } as any);
            }
          } else {
            console.log('✅ Dados do nutricionista já disponíveis');
          }
          
          // Só desativar loading se foi ativado
          if (isNewLogin) {
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          console.log('👋 Logout detectado');
          setUser(null);
          setNutricionista(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token renovado:', session.user.email);
          setUser(session.user);
          // Não recarregar nutricionista no refresh se já existe
          if (!nutricionista || nutricionista.id !== session.user.id) {
            console.log('🔄 Buscando dados do nutricionista após refresh...');
            try {
              await fetchNutricionista(session.user.id);
            } catch (error) {
              console.error('❌ Erro ao buscar nutricionista após refresh:', error);
            }
          } else {
            console.log('✅ Dados do nutricionista já disponíveis após refresh');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      isInitializing.current = false;
    };
  }, [initialized]); // Dependência no initialized para controlar onAuthStateChange

  const value = {
    user,
    nutricionista,
    loading,
    signIn,
    signOut,
    refreshNutricionista,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 