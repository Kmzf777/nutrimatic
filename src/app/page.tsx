import Header from '@/components/ui/Header';
import NewHeroSection from '@/components/sections/NewHeroSection';
import TrustBarSection from '@/components/sections/TrustBarSection';
import PainPointSection from '@/components/sections/PainPointSection';
import SolutionSection from '@/components/sections/SolutionSection';
import DashboardDemoSection from '@/components/sections/DashboardDemoSection';
import NewHowItWorksSection from '@/components/sections/NewHowItWorksSection';
import DetailedFeaturesSection from '@/components/sections/DetailedFeaturesSection';
import SocialProofSection from '@/components/sections/SocialProofSection';
import BeforeAfterSection from '@/components/sections/BeforeAfterSection';
import NewFAQSection from '@/components/sections/NewFAQSection';
import ImpactMetricsSection from '@/components/sections/ImpactMetricsSection';
import FinalCTASection from '@/components/sections/FinalCTASection';
import NewFooter from '@/components/ui/NewFooter';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      {/* 1. Hero Section - Above the Fold */}
      <NewHeroSection />
      
      {/* 2. Barra de Confiança Instantânea */}
      <TrustBarSection />
      
      {/* 3. Seção "A Dor" - Problema Identificado */}
      <PainPointSection />
      
      {/* 4. Seção "A Solução" - Apresentação do NutriMatic */}
      <SolutionSection />
      
      {/* 4.5. Seção Dashboard Demo - Demonstrativos Reais */}
      <DashboardDemoSection />
      
      {/* 5. Seção "Como Funciona" - Demonstração Visual do Fluxo */}
      <NewHowItWorksSection />
      
      {/* 6. Seção de Funcionalidades - Features Detalhadas */}
      <DetailedFeaturesSection />
      
      {/* 7. Seção de Prova Social - Depoimentos com ROI */}
      <SocialProofSection />
      
      {/* 8. Seção "Antes vs Depois" - Comparação Visual */}
      <BeforeAfterSection />
      
      {/* 9. Seção de Objeções - FAQ Estratégico */}
      <NewFAQSection />
      
      {/* 10. Seção de Métricas de Impacto - Números que Vendem */}
      <ImpactMetricsSection />
      
      {/* 11. Seção CTA Final - Última Chamada para Ação */}
      <FinalCTASection />
      
      {/* 12. Footer - Credibilidade e Navegação */}
      <NewFooter />
    </main>
  );
}
