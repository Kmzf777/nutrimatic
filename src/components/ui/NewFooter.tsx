import { Instagram, Linkedin, Youtube, Shield, Lock, Award, Star } from 'lucide-react';

export default function NewFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Coluna 1 - Branding */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold">NutriMatic</span>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 leading-relaxed">
              Inteligência Artificial para Nutricionistas
            </p>

            {/* Redes sociais */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Produto</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Como Funciona</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Funcionalidades</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Preços</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">FAQ</a></li>
            </ul>
          </div>

          {/* Coluna 3 - Recursos */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Recursos</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Estudos de Caso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Central de Ajuda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Agendar Demo</a></li>
            </ul>
          </div>

          {/* Coluna 4 - Confiança */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Segurança</h3>
            <div className="space-y-4">
              {/* Badges de segurança */}
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium">WhatsApp Pessoal</div>
                  <div className="text-xs text-gray-400">Sem API oficial necessária</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Lock className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium">Conformidade LGPD</div>
                  <div className="text-xs text-gray-400">SSL 256-bit Encryption</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm font-medium">Rating 4.9/5</div>
                  <div className="text-xs text-gray-400">G2 & Capterra</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © 2025 NutriMatic. Todos os direitos reservados.
            </p>

            {/* Links legais */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}