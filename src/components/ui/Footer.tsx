'use client';

import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Twitter, MessageCircle, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const quickLinks = [
  { name: "Como funciona", href: "#como-funciona" },
  { name: "Recursos", href: "#recursos" },
  { name: "Depoimentos", href: "#depoimentos" },
  { name: "FAQ", href: "#faq" },
  { name: "Preços", href: "/precos" },
  { name: "Contato", href: "/contato" }
];

const supportLinks = [
  { name: "Central de Ajuda", href: "#" },
  { name: "Documentação", href: "#" },
  { name: "Status do Sistema", href: "#" },
  { name: "Suporte Técnico", href: "#" }
];

const legalLinks = [
  { name: "Termos de Uso", href: "#" },
  { name: "Política de Privacidade", href: "#" },
  { name: "LGPD", href: "#" },
  { name: "Cookies", href: "#" }
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/nutrimatic", icon: Instagram },
  { name: "Facebook", href: "https://facebook.com/nutrimatic", icon: Facebook },
  { name: "LinkedIn", href: "https://linkedin.com/company/nutrimatic", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com/nutrimatic", icon: Twitter }
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              {/* Mobile Icon */}
              <div className="relative w-12 h-12 lg:hidden">
                <Image
                  src="/Nutrimatic Icon Vetor.png"
                  alt="Nutrimatic"
                  fill
                  className="object-contain"
                />
              </div>
              {/* Desktop Logo */}
              <div className="hidden lg:block">
                <Image
                  src="/Nutrimatic Logo PNG.png"
                  alt="Nutrimatic"
                  width={160}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Transformando consultórios de nutrição com inteligência artificial. 
              Automatize prescrições, atendimento e prospecção em uma única plataforma.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-nutrimatic-400" />
                <span>contato@nutrimatic.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-nutrimatic-400" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-nutrimatic-400" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-nutrimatic-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-nutrimatic-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Suporte</h3>
            <ul className="space-y-3 mb-8">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-nutrimatic-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-nutrimatic-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 Nutrimatic. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Contact CTA */}
              <a
                href="/contato"
                className="flex items-center space-x-2 bg-nutrimatic-600 hover:bg-nutrimatic-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Fale conosco</span>
              </a>
              
              {/* Back to top */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-nutrimatic-600 transition-colors"
                aria-label="Voltar ao topo"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 