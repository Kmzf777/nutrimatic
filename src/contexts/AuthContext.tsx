'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Pegar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Supabase signUp chamado com:', { email, name });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      console.log('Resposta do Supabase signUp:', { data, error });
      
      if (error) {
        console.error('Erro detalhado do Supabase:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
      }
      
      return { data, error };
    } catch (err) {
      console.error('Erro inesperado no signUp:', err);
      return { 
        data: null, 
        error: { 
          message: 'Erro inesperado ao criar conta',
          status: 500,
          name: 'UnexpectedError'
        } 
      };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Iniciando login com Google...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // TODO: Redirecionar para o site do SaaS quando estiver pronto
          // redirectTo: 'https://app.nutrimatic.com.br',
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      console.log('Resposta do Google OAuth:', { data, error });
      
      if (error) {
        console.error('Erro no login com Google:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Erro inesperado no login com Google:', err);
      return { 
        data: null, 
        error: { 
          message: 'Erro inesperado ao fazer login com Google',
          status: 500,
          name: 'UnexpectedError'
        } 
      };
    }
  };



  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
    }}>
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