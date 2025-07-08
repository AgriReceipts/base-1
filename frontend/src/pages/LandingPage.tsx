import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShield, 
  FiUsers, 
  FiBarChart, 
  FiFileText, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiArrowRight, 
  FiPlay,
  FiStar,
  FiGlobe,
  FiDatabase,
  FiLock,
  FiZap,
  FiSmartphone,
  FiCloud,
  FiAward
} from 'react-icons/fi';
import logo from '../assets/logo-ap.png';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FiFileText size={24} />,
      title: 'Digital Receipt Management',
      description: 'Seamlessly digitize and manage all agricultural market committee trade receipts with instant validation and secure storage.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FiBarChart size={24} />,
      title: 'Advanced Analytics & Insights',
      description: 'Comprehensive analytics dashboard with real-time data visualization, performance tracking, and predictive insights.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FiUsers size={24} />,
      title: 'Role-Based Access Control',
      description: 'Secure multi-tier access system for DEOs, Supervisors, Secretaries, and Assistant Directors with customized permissions.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <FiShield size={24} />,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption, audit trails, and compliance with government data protection standards.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: <FiTrendingUp size={24} />,
      title: 'Performance Monitoring',
      description: 'Track committee performance, trader analytics, commodity trends, and generate automated compliance reports.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <FiDatabase size={24} />,
      title: 'Centralized Data Hub',
      description: 'Unified database for all market transactions with powerful search, filtering, and data export capabilities.',
      color: 'from-yellow-500 to-red-500'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Receipts Processed', icon: <FiFileText /> },
    { number: '150+', label: 'Active Traders', icon: <FiUsers /> },
    { number: '9', label: 'Market Committees', icon: <FiGlobe /> },
    { number: '99.9%', label: 'System Uptime', icon: <FiZap /> }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Assistant Director, East Godavari',
      content: 'This system has revolutionized our receipt management process. The analytics help us make data-driven decisions.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Supervisor, Kakinada Rural',
      content: 'User-friendly interface and powerful features. Our efficiency has increased by 300% since implementation.',
      rating: 5
    },
    {
      name: 'Venkat Reddy',
      role: 'DEO, Tuni Committee',
      content: 'The real-time validation and instant receipt generation has eliminated all manual errors in our workflow.',
      rating: 5
    }
  ];

  const benefits = [
    { icon: <FiZap />, title: 'Lightning Fast', desc: 'Process receipts in seconds' },
    { icon: <FiSmartphone />, title: 'Mobile Ready', desc: 'Access from any device' },
    { icon: <FiCloud />, title: 'Cloud Secure', desc: 'Your data is always safe' },
    { icon: <FiAward />, title: 'Award Winning', desc: 'Recognized excellence' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <img src={logo} alt="AP Logo" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AMC Receipt System</h1>
                <p className="text-xs text-gray-500">Agricultural Market Committee</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/verifyReceipt"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Verify Receipt
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <FiStar className="mr-2" />
                  Trusted by 9 Market Committees
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Digital Receipt
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                    Management
                  </span>
                  <span className="text-gray-700">Revolution</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your agricultural market committee operations with our cutting-edge digital receipt management system. Secure, efficient, and transparent.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Get Started
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/verifyReceipt"
                  className="group px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
                >
                  <FiCheckCircle className="mr-2" />
                  Verify Receipt
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <FiUsers className="text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">System Login</div>
                          <div className="text-sm text-gray-500">Access your dashboard</div>
                        </div>
                      </div>
                      <FiArrowRight className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to="/verifyReceipt"
                      className="w-full p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg hover:from-green-100 hover:to-teal-100 transition-all duration-200 flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <FiCheckCircle className="text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Verify Receipt</div>
                          <div className="text-sm text-gray-500">Instant verification</div>
                        </div>
                      </div>
                      <FiArrowRight className="text-green-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-3">Demo Credentials</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">DEO (Tuni):</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">deo_tuni</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Password:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">password123</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white text-xl">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Agriculture</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our comprehensive suite of tools transforms agricultural market committee operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our System?</h2>
            <p className="text-blue-100 text-lg">Built for efficiency, designed for growth</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors duration-200">
                  <div className="text-white text-xl">{benefit.icon}</div>
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-blue-100 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Trusted by professionals across East Godavari District</p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600 text-sm">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the digital revolution in agricultural market management. Start processing receipts efficiently today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Access System Dashboard
            </Link>
            <Link
              to="/verifyReceipt"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Verify a Receipt Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <img src={logo} alt="AP Logo" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">AMC Receipt System</h3>
                  <p className="text-gray-400 text-sm">Agricultural Market Committee</p>
                </div>
              </div>
              <p className="text-gray-400">
                Digitizing agricultural market operations across East Godavari District with cutting-edge technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">System Login</Link>
                <Link to="/verifyReceipt" className="block text-gray-400 hover:text-white transition-colors">Verify Receipt</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">System Features</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <div>• Digital Receipt Management</div>
                <div>• Real-time Analytics</div>
                <div>• Role-based Access Control</div>
                <div>• Secure Data Storage</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Agricultural Market Committee Receipt System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;