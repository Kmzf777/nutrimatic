import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function PrecosPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Planos e Preços
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Escolha o plano ideal para seu consultório
            </p>
          </div>
          
          <div className="text-center text-gray-600">
            <p>Página em construção...</p>
            <p className="mt-4">
              <Link href="/" className="text-blue-600 hover:underline">
                Voltar para a página inicial
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
} 