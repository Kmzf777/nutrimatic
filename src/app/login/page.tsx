'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { LoginFormData } from '@/types/auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  // Redirecionar para dashboard quando login for bem-sucedido
  useEffect(() => {
    if (user && !loading && !isLoading) {
      console.log('🚀 Usuário logado detectado, redirecionando para dashboard...');
      router.push('/dashboard');
    }
  }, [user, loading, isLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Limpar erro quando usuário digita
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    if (isLoading) return; // Evitar múltiplos submits

    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error.message || 'Erro ao fazer login');
        setIsLoading(false);
        return;
      }

      // Login bem-sucedido! 
      console.log('✅ Login realizado com sucesso! Aguardando redirecionamento...');
      
      // Aguardar um pouco para o estado ser atualizado
      setTimeout(() => {
        if (!user) {
          setIsLoading(false);
        }
      }, 3000); // Timeout de segurança

    } catch (error: any) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrimatic-50 via-white to-nutrimatic-100/30">
      <Header />
      
      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-md mx-auto">
            
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <Image
                  src="/Nutrimatic Logo PNG.png"
                  alt="Nutrimatic"
                  width={200}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo de volta!
              </h1>
              <p className="text-gray-600">
                Entre na sua conta e continue automatizando suas prescrições
              </p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-200"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-200 pr-12"
                      placeholder="Digite sua senha"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-nutrimatic-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar na Dashboard'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Ainda não tem uma conta?{' '}
                  <Link href="/register" className="font-semibold text-nutrimatic-600 hover:text-nutrimatic-700 transition-colors">
                    Criar conta gratuita
                  </Link>
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">Ao entrar, você terá acesso a:</p>
              <div className="flex flex-col space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-nutrimatic-500 rounded-full"></div>
                  <span>Prescrições automáticas com IA</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-nutrimatic-500 rounded-full"></div>
                  <span>Gestão completa de clientes</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-nutrimatic-500 rounded-full"></div>
                  <span>Relatórios detalhados de uso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 