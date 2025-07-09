import React from 'react';

const features = [
  {
    icon: (
      <span className="inline-block w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-3xl border border-green-300 shadow-sm">
        📄
      </span>
    ),
    title: 'Digital Receipt Management',
    benefits: [
      'Seamless digitization and validation',
      'Instant access to receipts',
      'Paperless workflow',
    ],
  },
  {
    icon: (
      <span className="inline-block w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl border border-blue-300 shadow-sm">
        📊
      </span>
    ),
    title: 'Advanced Analytics',
    benefits: [
      'Real-time dashboards',
      'Actionable insights',
      'Performance tracking',
    ],
  },
  {
    icon: (
      <span className="inline-block w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-3xl border border-teal-300 shadow-sm">
        🔐
      </span>
    ),
    title: 'Role-Based Access',
    benefits: [
      'Multi-tier security',
      'Custom permissions',
      'User management',
    ],
  },
  {
    icon: (
      <span className="inline-block w-12 h-12 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-3xl border border-yellow-300 shadow-sm">
        🏦
      </span>
    ),
    title: 'Enterprise Security',
    benefits: [
      'Bank-grade protection',
      'Data encryption',
      'Compliance ready',
    ],
  },
  {
    icon: (
      <span className="inline-block w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-3xl border border-green-300 shadow-sm">
        📈
      </span>
    ),
    title: 'Performance Monitoring',
    benefits: [
      'Committee & trader analytics',
      'Live status indicators',
      'Continuous improvement',
    ],
  },
  {
    icon: (
      <span className="inline-block w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl border border-blue-300 shadow-sm">
        🗄️
      </span>
    ),
    title: 'Centralized Data Hub',
    benefits: [
      'Unified database',
      'Easy data management',
      'Reliable backups',
    ],
  },
];

const FeaturesGrid: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="relative rounded-xl p-8 bg-white border border-blue-100 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 duration-200 flex flex-col items-center"
        >
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-2 text-blue-900 text-center">{feature.title}</h3>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700 opacity-90 text-left">
            {feature.benefits.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FeaturesGrid; 