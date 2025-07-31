'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Users, TrendingUp, Clock, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const testimonials = [
  {
    name: "Dra. Ana Silva",
    role: "Nutricionista Esportiva",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    content: "Hoje, meu consultório roda no automático. Nunca mais perdi tempo com ficha! A Nutrimatic revolucionou minha forma de trabalhar.",
    rating: 5,
    clinic: "Clínica NutriSport"
  },
  {
    name: "Dr. Carlos Mendes",
    role: "Nutricionista Clínico",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    content: "Aumentei minha base de clientes em 300% em apenas 3 meses. O sistema funciona perfeitamente e os pacientes adoram!",
    rating: 5,
    clinic: "NutriClinic"
  },
  {
    name: "Dra. Fernanda Costa",
    role: "Nutricionista Funcional",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
    content: "As prescrições são incrivelmente personalizadas. Meus pacientes ficam impressionados com a qualidade e rapidez.",
    rating: 5,
    clinic: "NutriFuncional"
  },
  {
    name: "Dr. Roberto Alves",
    role: "Nutricionista Esportivo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "Economizo 15 horas por semana. Agora posso focar no que realmente importa: meus pacientes.",
    rating: 5,
    clinic: "NutriPerformance"
  },
  {
    name: "Dra. Juliana Santos",
    role: "Nutricionista Materno-Infantil",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    content: "O atendimento 24/7 é fantástico. Meus pacientes conseguem tirar dúvidas a qualquer momento.",
    rating: 5,
    clinic: "NutriMaterno"
  },
  {
    name: "Dr. Marcos Oliveira",
    role: "Nutricionista Comportamental",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "A prospecção automática trouxe muitos clientes novos. O ROI foi incrível no primeiro mês.",
    rating: 5,
    clinic: "NutriComportamental"
  }
];

const stats = [
  { icon: Users, value: "1.000+", label: "Nutricionistas ativos" },
  { icon: TrendingUp, value: "50.000+", label: "Prescrições geradas" },
  { icon: Clock, value: "24/7", label: "Atendimento automático" },
  { icon: Award, value: "4.9/5", label: "Avaliação média" }
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-20 lg:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-nutrimatic-100 text-nutrimatic-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Quote className="w-4 h-4" />
            <span>Depoimentos</span>
          </motion.div>
          
          <h2 className="text-gray-900 mb-6">
            O que nossos <span className="text-gradient">nutricionistas</span> dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mais de 1.000 profissionais já transformaram seus consultórios com a Nutrimatic
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 lg:mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card p-8 h-full relative overflow-hidden hover:scale-105 transition-transform duration-300">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-nutrimatic-200 mb-6" />
                
                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-nutrimatic-600 font-medium">{testimonial.clinic}</p>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-nutrimatic-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="gradient-primary rounded-3xl p-8 lg:p-12 text-white text-center"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-white/80" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20 text-center"
        >
          <div className="card p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Junte-se aos nutricionistas que já transformaram seus consultórios
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Comece hoje mesmo e veja a diferença em sua rotina profissional
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn btn-primary text-lg px-8 py-4">
                Começar agora
              </Link>
              <button className="btn btn-secondary text-lg px-8 py-4">
                Ver demonstração
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 