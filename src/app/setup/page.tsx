'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function SetupPage() {
  const { nutricionista, refreshNutricionista } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCompleteSetup = async () => {
    setIsLoading(true);
    try {
      // Simular conclusão do setup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar dados do nutricionista
      await refreshNutricionista();
      
      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao completar setup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requireActive={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Configuração da Conta
              </h1>
              <p className="text-gray-600">
                Sua conta está sendo configurada. Aguarde a aprovação para acessar o dashboard.
              </p>
            </div>

            <div className="space-y-6">
              {/* Status da conta */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Conta em Análise</h3>
                    <p className="text-sm text-yellow-700">
                      Sua conta está sendo revisada pela nossa equipe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações do usuário */}
              {nutricionista && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Suas Informações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome</label>
                      <p className="text-gray-900">{nutricionista.nome}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{nutricionista.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefone</label>
                      <p className="text-gray-900">{nutricionista.telefone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="text-gray-900">
                        {nutricionista.active ? 'Ativo' : 'Pendente'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Próximos passos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800">Próximos Passos</h3>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Nossa equipe revisará suas informações</li>
                      <li>• Você receberá um email quando sua conta for aprovada</li>
                      <li>• Após a aprovação, você terá acesso completo ao dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botão de teste (apenas para desenvolvimento) */}
              <div className="text-center">
                <button
                  onClick={handleCompleteSetup}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Processando...
                    </>
                  ) : (
                    'Simular Aprovação (Dev)'
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Este botão é apenas para desenvolvimento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 