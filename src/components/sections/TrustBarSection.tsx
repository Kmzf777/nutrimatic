'use client';

import { Calendar, Star, Shield } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimations';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function TrustBarSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const clinicas = [
    { id: 1, nome: 'Clínica NutriVida' },
    { id: 2, nome: 'Dra. Carla Santos' },
    { id: 3, nome: 'Espaço Equilíbrio' },
    { id: 4, nome: 'Instituto NutriSaúde' },
    { id: 5, nome: 'Consultório Bem-Estar' },
    { id: 6, nome: 'NutriCenter' },
    { id: 7, nome: 'Vida Saudável' },
    { id: 8, nome: 'Nutrição & Cia' }
  ];

  // Duplicar array para criar loop infinito
  const duplicatedClinicas = [...clinicas, ...clinicas];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels por frame (velocidade lenta)
    let animationId: number;

    const autoScroll = () => {
      scrollPosition += scrollSpeed;
      
      // Calcular largura de um item (96px + 16px gap = 112px)
      const itemWidth = 112;
      const totalWidth = clinicas.length * itemWidth;
      
      // Reset quando chegar na metade (onde começa a duplicação)
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
      }
      
      carousel.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(autoScroll);
    };

    // Iniciar scroll automático apenas se estiver visível
    if (isVisible) {
      animationId = requestAnimationFrame(autoScroll);
    }

    // Pausar scroll quando mouse estiver sobre o carousel
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      if (isVisible) {
        animationId = requestAnimationFrame(autoScroll);
      }
    };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, clinicas.length]);

  return (
    <section ref={ref} className="py-12 md:py-16 bg-gradient-to-r from-nutrimatic-50/50 to-white border-y border-nutrimatic-100">
      <div className={`w-full px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Texto acima dos logos - Mobile Optimized */}
        <div className="text-center mb-8 md:mb-12 max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-nutrimatic-600 font-bold mb-6 md:mb-8 px-4">
            Nutricionistas que já escalaram seus consultórios com NutriMatic
          </p>

          {/* Mobile: Carousel de logos / Desktop: Grid */}
          <div className="block md:hidden mb-8">
            {/* Mobile Carousel com Auto-scroll */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto gap-4 pb-4 px-4 scrollbar-hide"
              style={{ scrollBehavior: 'auto' }}
            >
              {duplicatedClinicas.map((clinica, index) => (
                <div 
                  key={`${clinica.id}-${index}`}
                  className={`flex-shrink-0 w-24 bg-white rounded-xl p-3 shadow-sm border border-nutrimatic-100 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${(index % clinicas.length) * 100}ms` }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 relative">
                      <Image
                        src={`/logo-clinica-${clinica.id}.png`}
                        alt={clinica.nome}
                        fill
                        className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        sizes="48px"
                      />
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-tight">{clinica.nome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-6 lg:gap-8 items-center mb-12 max-w-6xl mx-auto">
            {clinicas.map((clinica, index) => (
              <div 
                key={clinica.id}
                className={`flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  {/* Logo real da clínica */}
                  <div className="w-16 h-16 mx-auto mb-3 relative">
                    <Image
                      src={`/logo-clinica-${clinica.id}.png`}
                      alt={clinica.nome}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      sizes="64px"
                    />
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-tight">{clinica.nome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas em cards - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg border border-nutrimatic-100 transition-all duration-300 text-center group">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <div className="bg-nutrimatic-100 p-2 md:p-3 rounded-full group-hover:bg-nutrimatic-200 transition-colors">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-nutrimatic-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">+2.500</div>
            <p className="text-sm md:text-base text-gray-600">consultas agendadas/mês</p>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg border border-nutrimatic-100 transition-all duration-300 text-center group">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <div className="bg-yellow-100 p-2 md:p-3 rounded-full group-hover:bg-yellow-200 transition-colors">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">97%</div>
            <p className="text-sm md:text-base text-gray-600">de pacientes satisfeitos</p>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg border border-nutrimatic-100 transition-all duration-300 text-center group sm:col-span-1">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <div className="bg-nutrimatic-100 p-2 md:p-3 rounded-full group-hover:bg-nutrimatic-200 transition-colors">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-nutrimatic-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Zero</div>
            <p className="text-sm md:text-base text-gray-600">agendamentos perdidos</p>
          </div>
        </div>
      </div>
    </section>
  );
}