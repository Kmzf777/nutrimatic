'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {/* Mobile Icon */}
            <div className="relative w-10 h-10 lg:hidden">
              <Image
                src="/Nutrimatic Icon Vetor.png"
                alt="Nutrimatic"
                fill
                className="object-contain transition-transform group-hover:scale-110"
              />
            </div>
            {/* Desktop Logo */}
            <div className="hidden lg:block">
              <Image
                src="/Nutrimatic Logo PNG.png"
                alt="Nutrimatic"
                width={140}
                height={28}
                className="h-7 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="#como-funciona" 
              className={`font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
              }`}
            >
              Como funciona
            </Link>
            <Link 
              href="#recursos" 
              className={`font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
              }`}
            >
              Recursos
            </Link>
            <Link 
              href="#depoimentos" 
              className={`font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
              }`}
            >
              Depoimentos
            </Link>
            <Link 
              href="#faq" 
              className={`font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
              }`}
            >
              FAQ
            </Link>
            <Link 
              href="/precos" 
              className={`font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
              }`}
            >
              Preços
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="/contato" 
              className={`font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-700 hover:text-nutrimatic-600' : 'text-white hover:text-nutrimatic-300'
              }`}
            >
              Contato
            </Link>
            <Link href="#cta" className="btn btn-primary">
              Teste grátis
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

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}>
          <div className="py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="#como-funciona" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Como funciona
              </Link>
              <Link 
                href="#recursos" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Recursos
              </Link>
              <Link 
                href="#depoimentos" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Depoimentos
              </Link>
              <Link 
                href="#faq" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <Link 
                href="/precos" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Preços
              </Link>
              <Link 
                href="/contato" 
                className="text-gray-700 hover:text-nutrimatic-600 font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                Contato
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  href="#cta" 
                  className="btn btn-primary w-full justify-center"
                  onClick={closeMenu}
                >
                  Teste grátis
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
} 