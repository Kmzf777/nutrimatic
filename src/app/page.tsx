import Header from '@/components/ui/Header';
import HeroSection from '@/components/sections/HeroSection';
import AIStatsSection from '@/components/sections/AIStatsSection';
import CustomizationSection from '@/components/sections/CustomizationSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TimeSavingsSection from '@/components/sections/TimeSavingsSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import FAQSection from '@/components/sections/FAQSection';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AIStatsSection />
      <CustomizationSection />
      <HowItWorksSection />
      <TimeSavingsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  );
}
