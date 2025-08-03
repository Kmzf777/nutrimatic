'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

interface RegisterFormData {
  nome: string;
  email: string;
  telefone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.email.trim() || !formData.telefone.trim() || !formData.password || !formData.confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const supabase = createClient();

      // Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            telefone: formData.telefone,
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Erro ao criar conta');
      }

      // Redirecionar para login com mensagem de sucesso
      router.push('/login?message=Conta criada com sucesso! Faça login para continuar.');

    } catch (error: any) {
      console.error('Erro no registro:', error);
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrimatic-50 via-white to-nutrimatic-100/30">
      <Header />
      
      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-lg mx-auto">
            
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
                Crie sua conta gratuita
              </h1>
              <p className="text-gray-600">
                Automatize suas prescrições e otimize seu tempo em minutos
              </p>
            </div>

            {/* Register Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-200"
                    placeholder="Dr. Maria Silva"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Profissional
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-200"
                    placeholder="maria@clinica.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-200"
                    placeholder="(11) 99999-9999"
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
                      placeholder="Mínimo 6 caracteres"
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500 focus:border-nutrimatic-500 transition-all duration-200 pr-12"
                      placeholder="Confirme sua senha"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-nutrimatic-600 transition-colors"
                    >
                      {showConfirmPassword ? (
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
                  className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                      Criando sua conta...
                    </>
                  ) : (
                    'Criar Conta Gratuita'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="font-semibold text-nutrimatic-600 hover:text-nutrimatic-700 transition-colors">
                    Fazer login
                  </Link>
                </p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mt-8 bg-gradient-to-r from-nutrimatic-50 to-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                ✨ O que você ganha ao se cadastrar:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-nutrimatic-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Prescrições automáticas com IA</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-nutrimatic-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Gestão completa de pacientes</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-nutrimatic-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Atendimento automatizado</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-nutrimatic-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Relatórios detalhados</span>
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