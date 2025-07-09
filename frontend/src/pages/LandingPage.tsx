import React from 'react';
import Nav from '../components/ui/Nav';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import BenefitsSection from '../components/landing/BenefitsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
// import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Navigation Bar */}
      <Nav />
      {/* Hero Section */}
      <HeroSection
        onLogin={() => navigate('/login')}
        onVerifyReceipt={() => navigate('/verify-receipt')}
      />
      {/* Decorative SVG divider */}
      <div className="w-full -mt-4">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
          <path d="M0 40 Q 360 0 720 40 T 1440 40 V60 H0V40Z" fill="#e0f2fe" />
          <path d="M0 50 Q 360 20 720 50 T 1440 50 V60 H0V50Z" fill="#bae6fd" />
        </svg>
      </div>
      {/* Features Grid */}
      <section className="w-full py-16">
        <FeaturesGrid />
      </section>
      {/* Benefits Section */}
      <section className="w-full py-12 bg-blue-50">
        <BenefitsSection />
      </section>
      {/* Call-to-Action Section */}
      <section className="w-full py-12">
        <CTASection />
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;