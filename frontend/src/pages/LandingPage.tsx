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
                Agri Receipts
              </span>
              <br />
              <span className="text-gray-800">Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in">
              Empowering Andhra Pradesh’s agricultural markets with Agri Receipts: a secure, digital, and innovative platform for managing, verifying, and analyzing agricultural trade receipts—where tradition meets technology and every harvest is valued.
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
              Why Agri Receipts?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Agri Receipts is a visionary initiative to modernize agricultural market operations through advanced technology, ensuring efficiency, transparency, and sustainable growth for all stakeholders.
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
              Cutting-edge technology stack powering the future of agricultural market management with Agri Receipts
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
              Instant Public Verification with Agri Receipts
            </h2>
            <p className="text-xl text-emerald-100 mb-12 leading-relaxed">
              Revolutionary transparency through real-time receipt verification. Any citizen can instantly validate agricultural market receipts using Agri Receipts, ensuring complete accountability and trust in the system.
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

      {/* Contributors Section - Creative 3D Morphing Cards */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-6">
              <span className="text-purple-300 text-sm font-semibold">🚀 Meet the Innovation Team</span>
            </div>
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Digital Architects
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The visionary minds behind Andhra Pradesh's agricultural digital transformation
            </p>
          </div>

          {/* 3D Morphing Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Contributor 1 - Lead Developer */}
            <div className="group relative">
              <div className="relative perspective-1000">
                <div className="relative w-full h-96 transform-style-preserve-3d transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6">
                  {/* Main Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl shadow-2xl transform transition-all duration-700 group-hover:scale-105">
                    <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
                    <div className="relative p-8 h-full flex flex-col justify-between">
                      {/* Avatar with Glitch Effect */}
                      <div className="relative mx-auto mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:animate-pulse">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            AD
                          </div>
                        </div>
                        {/* Floating Particles */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-bounce opacity-80"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60"></div>
                      </div>

                      {/* Content */}
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                          Alex Developer
                        </h3>
                        <p className="text-purple-200 text-sm mb-4 opacity-90">
                          Lead Full-Stack Engineer
                        </p>
                        <p className="text-white/80 text-xs leading-relaxed mb-6">
                          Architecting scalable solutions for agricultural digital transformation with cutting-edge technology
                        </p>

                        {/* Social Links with Morphing Effect */}
                        <div className="flex justify-center space-x-4">
                          <a
                            href="https://github.com/alexdev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12"
                          >
                            <svg className="w-6 h-6 text-white group-hover/link:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-cyan-500/20 to-purple-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                          </a>
                          <a
                            href="https://linkedin.com/in/alexdev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12"
                          >
                            <svg className="w-6 h-6 text-white group-hover/link:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/20 to-blue-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-500/20 rounded-3xl blur-xl transform translate-y-8 group-hover:translate-y-12 transition-transform duration-700"></div>
                </div>
              </div>
            </div>

            {/* Contributor 2 - UI/UX Designer */}
            <div className="group relative">
              <div className="relative perspective-1000">
                <div className="relative w-full h-96 transform-style-preserve-3d transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6">
                  {/* Main Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-3xl shadow-2xl transform transition-all duration-700 group-hover:scale-105">
                    <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
                    <div className="relative p-8 h-full flex flex-col justify-between">
                      {/* Avatar with Pulse Effect */}
                      <div className="relative mx-auto mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:animate-pulse">
                          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            SD
                          </div>
                        </div>
                        {/* Orbiting Elements */}
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-orange-400 rounded-full animate-spin origin-bottom transform -translate-x-1/2" style={{transformOrigin: '50% 48px'}}></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
                      </div>

                      {/* Content */}
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
                          Sarah Designer
                        </h3>
                        <p className="text-pink-200 text-sm mb-4 opacity-90">
                          Creative UI/UX Architect
                        </p>
                        <p className="text-white/80 text-xs leading-relaxed mb-6">
                          Crafting intuitive user experiences that bridge technology and human-centered design principles
                        </p>

                        {/* Social Links */}
                        <div className="flex justify-center space-x-4">
                          <a
                            href="https://github.com/sarahdesigner"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12"
                          >
                            <svg className="w-6 h-6 text-white group-hover/link:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-orange-500/20 to-pink-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                          </a>
                          <a
                            href="https://linkedin.com/in/sarahdesigner"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12"
                          >
                            <svg className="w-6 h-6 text-white group-hover/link:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-orange-500/20 to-pink-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-orange-500/20 rounded-3xl blur-xl transform translate-y-8 group-hover:translate-y-12 transition-transform duration-700"></div>
                </div>
              </div>
            </div>

            {/* Contributor 3 - Data Scientist */}
            <div className="group relative">
              <div className="relative perspective-1000">
                <div className="relative w-full h-96 transform-style-preserve-3d transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6">
                  {/* Main Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-2xl transform transition-all duration-700 group-hover:scale-105">
                    <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
                    <div className="relative p-8 h-full flex flex-col justify-between">
                      {/* Avatar with Matrix Effect */}
                      <div className="relative mx-auto mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:animate-pulse">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            MS
                          </div>
                        </div>
                        {/* Data Flow Animation */}
                        <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-0 w-1 h-1 bg-teal-400 rounded-full animate-bounce"></div>
                      </div>

                      {/* Content */}
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                          Mike Scientist
                        </h3>
                        <p className="text-emerald-200 text-sm mb-4 opacity-90">
                          Senior Data Analytics Expert
                        </p>
                        <p className="text-white/80 text-xs leading-relaxed mb-6">
                          Transforming agricultural data into actionable insights through advanced machine learning and predictive analytics
                        </p>

                        {/* Social Links */}
                        <div className="flex justify-center space-x-4">
                          <a
                            href="https://github.com/mikescientist"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12"
                          >
                            <svg className="w-6 h-6 text-white group-hover/link:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-cyan-500/20 to-emerald-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                          </a>
                          <a
                            href="https://linkedin.com/in/mikescientist"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12"
                          >
                            <svg className="w-6 h-6 text-white group-hover/link:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-cyan-500/20 to-emerald-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl transform translate-y-8 group-hover:translate-y-12 transition-transform duration-700"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
              <div className="text-purple-300">Years Combined Experience</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-purple-300">Government Project Focus</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-purple-300">Innovation Commitment</div>
            </div>
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
                <li>Agri Receipts &mdash; Version 1.0.0 (Beta)</li>
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