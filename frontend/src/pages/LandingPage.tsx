import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiUsers, FiBarChart, FiFileText, FiCheckCircle, FiArrowRight, FiMapPin, FiTrendingUp, FiDatabase, FiLock, FiX, FiEye, FiZap, FiGlobe, FiCpu, FiCloud } from 'react-icons/fi';
import logo from '../assets/logo-ap.png';
import LoginForm from '../components/Authcompo/LoginForm';

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    {
      icon: <FiFileText size={32} />,
      title: 'Digital Receipt Revolution',
      description: 'Transform paper-based processes into seamless digital workflows with instant validation and secure storage.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FiBarChart size={32} />,
      title: 'Real-time Intelligence',
      description: 'Advanced analytics and insights powered by AI for smarter decision-making and policy formulation.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Smart Access Control',
      description: 'Multi-layered security with role-based permissions ensuring right access to right people at right time.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Blockchain-Ready Security',
      description: 'Future-proof architecture with end-to-end encryption and immutable audit trails.',
      gradient: 'from-orange-500 to-red-500'
    },
  ];

  const committees = [
    'Karapa', 'Kakinada Rural', 'Pithapuram', 'Tuni', 'Prathipadu',
    'Jaggampeta', 'Peddapuram', 'Samalkota', 'Kakinada'
  ];

  const stats = [
    { number: '9', label: 'Agricultural Market Committees', icon: <FiMapPin />, color: 'text-blue-600' },
    { number: '100%', label: 'Digital Transformation', icon: <FiTrendingUp />, color: 'text-green-600' },
    { number: '24/7', label: 'System Availability', icon: <FiDatabase />, color: 'text-purple-600' },
    { number: '∞', label: 'Scalability Potential', icon: <FiCloud />, color: 'text-orange-600' },
  ];

  const impactAreas = [
    { area: 'Transparency', progress: 95, color: 'bg-green-500' },
    { area: 'Efficiency', progress: 90, color: 'bg-blue-500' },
    { area: 'Accountability', progress: 88, color: 'bg-purple-500' },
    { area: 'Accessibility', progress: 92, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <img src={logo} alt="Andhra Pradesh Government" className="w-8 h-8" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Government of Andhra Pradesh
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Agricultural Market Committee - Digital Innovation Lab
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/verifyReceipt"
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiCheckCircle className="mr-2 group-hover:rotate-12 transition-transform duration-300" size={18} />
                <span className="font-semibold">Verify Receipt</span>
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <button
                onClick={() => setShowLoginModal(true)}
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiZap className="mr-2 group-hover:scale-110 transition-transform duration-300" size={18} />
                <span className="font-semibold">Access System</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-blue-800 text-sm font-semibold mb-6 animate-fade-in">
              <FiCpu className="mr-2" size={16} />
              Next-Generation Agricultural Technology
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-slide-in-up">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                Digital AMC
              </span>
              <br />
              <span className="text-gray-800">Revolution</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in">
              Pioneering the future of agricultural market management through cutting-edge digital transformation, 
              artificial intelligence, and blockchain-ready infrastructure for Andhra Pradesh.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-in-up">
              <Link
                to="/verifyReceipt"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <FiEye className="mr-3 group-hover:scale-110 transition-transform duration-300" size={24} />
                Experience Verification
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <button
                onClick={() => setShowLoginModal(true)}
                className="group relative inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 text-lg font-semibold rounded-2xl hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-white/50"
              >
                <FiGlobe className="mr-3 group-hover:rotate-12 transition-transform duration-300" size={24} />
                Explore Platform
                <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} bg-opacity-10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2 group-hover:scale-105 transition-transform duration-300">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Project Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Transforming Agricultural Markets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A visionary initiative to modernize agricultural market operations through 
              advanced technology, ensuring efficiency, transparency, and sustainable growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 text-lg">Eliminate Paper Dependencies</h4>
                  <p className="text-gray-600">Complete digitization of receipt processes with real-time validation and cloud storage.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 text-lg">Enhance Transparency</h4>
                  <p className="text-gray-600">Public verification system with immutable records and real-time tracking capabilities.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 text-lg">Boost Operational Efficiency</h4>
                  <p className="text-gray-600">Automated workflows reducing processing time and administrative overhead significantly.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 text-lg">Enable Data-Driven Decisions</h4>
                  <p className="text-gray-600">Advanced analytics and AI-powered insights for strategic policy formulation.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Project Impact Metrics</h3>
              <div className="space-y-6">
                {impactAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">{area.area}</span>
                      <span className="text-sm font-bold text-gray-600">{area.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${area.color} transition-all duration-1000 ease-out`}
                        style={{width: `${area.progress}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Revolutionary Features</h2>
            <p className="text-xl text-gray-600">
              Cutting-edge technology stack powering the future of agricultural market management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committees Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Connected Market Ecosystem
            </h2>
            <p className="text-xl text-gray-600">
              Unified platform serving all Agricultural Market Committees across East Godavari District
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {committees.map((committee, index) => (
              <div key={index} className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FiMapPin className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-gray-800 text-center group-hover:text-green-600 transition-colors duration-300">{committee}</h3>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Highlight */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-600 to-teal-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8 animate-pulse-glow">
              <FiCheckCircle className="text-white" size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Instant Public Verification
            </h2>
            <p className="text-xl text-emerald-100 mb-12 leading-relaxed">
              Revolutionary transparency through real-time receipt verification. Any citizen can instantly 
              validate agricultural market receipts, ensuring complete accountability and trust in the system.
            </p>
            <Link
              to="/verifyReceipt"
              className="group inline-flex items-center px-10 py-5 bg-white text-emerald-600 text-xl font-bold rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              <FiEye className="mr-3 group-hover:scale-110 transition-transform duration-300" size={24} />
              Verify Receipt Now
              <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mr-4">
                  <img src={logo} alt="AP Government" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Government of Andhra Pradesh</h3>
                  <p className="text-sm text-gray-400">Agricultural Innovation Department</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Pioneering digital transformation in agricultural market management through 
                innovative technology solutions and sustainable development practices.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Access</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => setShowLoginModal(true)} className="hover:text-white transition-colors">System Access</button></li>
                <li><Link to="/verifyReceipt" className="hover:text-white transition-colors">Verify Receipt</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Project Information</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>Version 1.0.0 (Beta)</li>
                <li>Cloud-Native Architecture</li>
                <li>Enterprise Security Standards</li>
                <li>24/7 System Monitoring</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Government of Andhra Pradesh. All rights reserved. | Digital Agricultural Market Committee Initiative</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slide-in-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
            >
              <FiX size={20} className="text-gray-600" />
            </button>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiLock className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">System Access</h3>
                <p className="text-gray-600 mt-2">Enter your credentials to access the platform</p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;