import React from 'react';

const benefits = [
  {
    icon: '✅',
    title: 'Transparency & Governance',
    description: 'Ensures transparent operations and strict compliance with government standards.'
  },
  {
    icon: '🌱',
    title: 'Empowering Agriculture',
    description: 'Supports farmers and committees with digital tools for efficiency and growth.'
  },
  {
    icon: '🔒',
    title: 'Data Security',
    description: 'Bank-grade security and privacy for all users and transactions.'
  },
  {
    icon: '⚡',
    title: 'Real-Time Performance',
    description: 'Instant access to analytics and system status for informed decision-making.'
  },
  {
    icon: '🤝',
    title: 'Unified Platform',
    description: 'Centralized data and workflows for all market committees and stakeholders.'
  },
  {
    icon: '📱',
    title: 'Mobile & Accessible',
    description: 'Optimized for all devices and accessible to every user.'
  },
];

const BenefitsSection: React.FC = () => (
  <div className="max-w-6xl mx-auto py-12 px-4">
    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center">Why Choose Our System?</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {benefits.map((benefit) => (
        <div
          key={benefit.title}
          className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <span className="text-3xl mb-3">{benefit.icon}</span>
          <h3 className="text-lg font-semibold text-blue-800 mb-1 text-center">{benefit.title}</h3>
          <p className="text-gray-700 text-center text-sm">{benefit.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default BenefitsSection; 