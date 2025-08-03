'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Detectar se estamos em páginas que precisam de background sólido
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      // Detecta se passou da hero section (aproximadamente 100vh)
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight * 0.8);
    };

    // Se for página de auth, sempre considerar como "scrolled" para ter background sólido
    if (isAuthPage) {
      setIsScrolled(true);
      return;
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthPage]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'glass border-b border-white/10'
      }`}>
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo - Fixo à esquerda */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <Image
                src="/Nutrimatic Logo PNG.png"
                alt="Nutrimatic"
                width={140}
                height={28}
                className={`h-7 w-auto transition-transform group-hover:scale-110 ${
                  isScrolled ? 'brightness-100' : 'brightness-0 invert'
                }`}
              />
            </Link>

            {/* Desktop Navigation - Centro */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                href="#como-funciona" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
                }`}
              >
                Como Funciona
              </Link>
              <Link 
                href="/precos" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
                }`}
              >
                Preços
              </Link>
              <Link 
                href="#faq" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
                }`}
              >
                Perguntas Frequentes
              </Link>
              <Link 
                href="/politica-privacidade" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
                }`}
              >
                Política de Privacidade
              </Link>
            </nav>

            {/* Desktop Buttons - Direita */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link 
                href="/login" 
                className={`px-6 py-2 font-medium rounded-lg border transition-all duration-200 ${
                  isScrolled 
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400' 
                    : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                }`}
              >
                Entrar
              </Link>
              <Link 
                href="/register" 
                className="btn btn-primary"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Separado do header para evitar conflitos */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        
        {/* Menu Panel */}
        <div className={`absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header do menu */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Image
                src="/Nutrimatic Icon Vetor.png"
                alt="Nutrimatic"
                width={32}
                height={32}
                className="flex-shrink-0"
              />
              <span className="text-lg font-semibold text-nutrimatic-600 font-display">Nutrimatic</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          {/* Conteúdo do menu */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="#como-funciona" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Como Funciona
              </Link>
              <Link 
                href="/precos" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Preços
              </Link>
              <Link 
                href="#faq" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Perguntas Frequentes
              </Link>
              <Link 
                href="/politica-privacidade" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Política de Privacidade
              </Link>
              
              {/* Botões */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link 
                  href="/login" 
                  className="w-full px-6 py-3 font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-center"
                  onClick={closeMenu}
                >
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary w-full justify-center"
                  onClick={closeMenu}
                >
                  Começar Grátis
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
} 