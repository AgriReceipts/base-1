import React from 'react';
import Button from '../ui/Button';

const floatingIcons = [
  { icon: '🌾', style: 'top-8 left-8 w-12 h-12' },
  { icon: '🚜', style: 'top-20 right-16 w-14 h-14' },
  { icon: '🏛️', style: 'bottom-10 left-1/4 w-12 h-12' },
  { icon: '🌱', style: 'bottom-8 right-10 w-10 h-10' },
];

interface HeroSectionProps {
  onLogin?: () => void;
  onVerifyReceipt?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLogin, onVerifyReceipt }) => {
  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-[60vh] py-16 overflow-hidden bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 animate-gradient-move">
      {/* Floating agricultural icons */}
      {floatingIcons.map((item, idx) => (
        <span
          key={idx}
          className={`absolute ${item.style} flex items-center justify-center text-3xl md:text-4xl opacity-70 animate-float-slow pointer-events-none select-none`}
          aria-hidden="true"
        >
          {item.icon}
        </span>
      ))}
      {/* Government badge */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="inline-block bg-blue-800 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wide shadow mb-4 animate-fade-in">
          Government of Andhra Pradesh
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 text-center mb-3 animate-fade-in">
          Agricultural Marketing Committee<br className="hidden md:block" /> Receipt Management System
        </h1>
        <h2 className="text-lg md:text-2xl text-green-800 font-medium text-center mb-8 animate-fade-in">
          Empowering transparency, efficiency, and growth in Andhra Pradesh agriculture
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-fade-in">
          <Button className="w-40" onClick={onLogin} aria-label="Login to the system">Login</Button>
          <Button variant="secondary" className="w-40" onClick={onVerifyReceipt} aria-label="Verify a receipt">Verify Receipt</Button>
        </div>
        {/* Demo credentials */}
        <div className="text-xs text-gray-600 animate-fade-in">
          Demo Credentials: <span className="font-mono bg-gray-100 px-2 py-1 rounded">user/demo123</span>
        </div>
      </div>
      {/* Visual motif at the bottom: stylized field/committee icons */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none select-none z-0">
        <svg width="100%" height="60" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40 Q 360 0 720 40 T 1440 40 V60 H0V40Z" fill="#bbf7d0" />
          <path d="M0 50 Q 360 20 720 50 T 1440 50 V60 H0V50Z" fill="#a7f3d0" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection; 