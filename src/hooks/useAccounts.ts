import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export interface Account {
  id: string;
  hash_unique: string;
  nome: string;
  email: string;
  telefone?: string;
  created_at: string;
  updated_at: string;
  observacoes?: string;
  is_active: boolean;
  subscription_status: string;
  subscription_expires_at?: string;
}

export interface CreateAccountData {
  nome: string;
  email: string;
  telefone?: string;
  observacoes?: string;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Buscar todas as contas
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*');

      if (error) throw error;
      
      setAccounts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar contas');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova conta
  const createAccount = async (accountData: CreateAccountData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar a função SQL para criar conta com hash único
      const { data, error } = await supabase.rpc('create_account_with_hash', {
        p_nome: accountData.nome,
        p_email: accountData.email,
        p_telefone: accountData.telefone,
        p_observacoes: accountData.observacoes
      });

      if (error) throw error;
      
      // Recarregar lista de contas
      const { data: updatedData } = await supabase
        .from('accounts')
        .select('*');
      setAccounts(updatedData || []);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar conta
  const updateAccount = async (id: string, updates: Partial<Account>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Recarregar lista de contas
      const { data: updatedData } = await supabase
        .from('accounts')
        .select('*');
      setAccounts(updatedData || []);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar conta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar conta por hash
  const getAccountByHash = async (hash: string) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('hash_unique', hash)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar conta');
      return null;
    }
  };

  // Buscar conta atual do usuário
  const getCurrentAccount = async () => {
    try {
      // Retorna a primeira conta disponível para demonstração
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar conta atual');
      return null;
    }
  };

  useEffect(() => {
    // Carregar contas apenas na inicialização do hook
    const loadInitialAccounts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('*');

        if (error) throw error;
        
        setAccounts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar contas');
      } finally {
        setLoading(false);
      }
    };

    loadInitialAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    getAccountByHash,
    getCurrentAccount
  };
} 