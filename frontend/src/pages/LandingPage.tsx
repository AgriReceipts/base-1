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
  FiAward,
  FiTarget,
  FiPieChart,
  FiMonitor,
  FiDownload,
  FiSearch,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiActivity
} from 'react-icons/fi';
import logo from '../assets/logo-ap.png';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % detailedFeatures.length);
    }, 4000);

    // Animate stats
    const statsTargets = [50000, 150, 9, 99.9];
    statsTargets.forEach((target, index) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => {
          const newStats = [...prev];
          newStats[index] = current;
          return newStats;
        });
      }, 20);
    });

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
    };
  }, []);

  const features = [
    {
      icon: <FiFileText size={24} />,
      title: 'Digital Receipt Management',
      description: 'Seamlessly digitize and manage all agricultural market committee trade receipts with instant validation and secure storage.',
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Instant Receipt Generation', 'Digital Validation', 'Secure Storage', 'Easy Retrieval']
    },
    {
      icon: <FiBarChart size={24} />,
      title: 'Advanced Analytics & Insights',
      description: 'Comprehensive analytics dashboard with real-time data visualization, performance tracking, and predictive insights.',
      color: 'from-purple-500 to-pink-500',
      benefits: ['Real-time Dashboards', 'Performance Metrics', 'Trend Analysis', 'Custom Reports']
    },
    {
      icon: <FiUsers size={24} />,
      title: 'Role-Based Access Control',
      description: 'Secure multi-tier access system for DEOs, Supervisors, Secretaries, and Assistant Directors with customized permissions.',
      color: 'from-green-500 to-teal-500',
      benefits: ['Multi-tier Access', 'Custom Permissions', 'User Management', 'Audit Trails']
    },
    {
      icon: <FiShield size={24} />,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption, audit trails, and compliance with government data protection standards.',
      color: 'from-red-500 to-orange-500',
      benefits: ['End-to-end Encryption', 'Audit Trails', 'Compliance Ready', 'Data Protection']
    },
    {
      icon: <FiTrendingUp size={24} />,
      title: 'Performance Monitoring',
      description: 'Track committee performance, trader analytics, commodity trends, and generate automated compliance reports.',
      color: 'from-indigo-500 to-purple-500',
      benefits: ['Committee Tracking', 'Trader Analytics', 'Commodity Trends', 'Automated Reports']
    },
    {
      icon: <FiDatabase size={24} />,
      title: 'Centralized Data Hub',
      description: 'Unified database for all market transactions with powerful search, filtering, and data export capabilities.',
      color: 'from-yellow-500 to-red-500',
      benefits: ['Unified Database', 'Advanced Search', 'Data Export', 'Integration Ready']
    }
  ];

  const detailedFeatures = [
    {
      title: 'Receipt Processing',
      description: 'Lightning-fast receipt generation with real-time validation',
      icon: <FiZap />,
      stats: '< 2 seconds',
      color: 'bg-blue-500'
    },
    {
      title: 'Data Analytics',
      description: 'Comprehensive insights into market trends and performance',
      icon: <FiPieChart />,
      stats: '15+ Reports',
      color: 'bg-purple-500'
    },
    {
      title: 'User Management',
      description: 'Secure role-based access for all stakeholders',
      icon: <FiUsers />,
      stats: '4 User Roles',
      color: 'bg-green-500'
    },
    {
      title: 'System Monitoring',
      description: '24/7 system monitoring with real-time alerts',
      icon: <FiMonitor />,
      stats: '99.9% Uptime',
      color: 'bg-red-500'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Receipts Processed', icon: <FiFileText />, animated: 0 },
    { number: '150+', label: 'Active Traders', icon: <FiUsers />, animated: 1 },
    { number: '9', label: 'Market Committees', icon: <FiGlobe />, animated: 2 },
    { number: '99.9%', label: 'System Uptime', icon: <FiZap />, animated: 3 }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Assistant Director, East Godavari',
      content: 'This system has revolutionized our receipt management process. The analytics help us make data-driven decisions for better agricultural market governance.',
      rating: 5,
      avatar: 'RK'
    },
    {
      name: 'Priya Sharma',
      role: 'Supervisor, Kakinada Rural',
      content: 'User-friendly interface and powerful features. Our efficiency has increased by 300% since implementation. The real-time reporting is exceptional.',
      rating: 5,
      avatar: 'PS'
    },
    {
      name: 'Venkat Reddy',
      role: 'DEO, Tuni Committee',
      content: 'The real-time validation and instant receipt generation has eliminated all manual errors in our workflow. Highly recommended for all AMCs.',
      rating: 5,
      avatar: 'VR'
    }
  ];

  const benefits = [
    { icon: <FiZap />, title: 'Lightning Fast', desc: 'Process receipts in seconds', color: 'text-yellow-400' },
    { icon: <FiSmartphone />, title: 'Mobile Ready', desc: 'Access from any device', color: 'text-blue-400' },
    { icon: <FiCloud />, title: 'Cloud Secure', desc: 'Your data is always safe', color: 'text-green-400' },
    { icon: <FiAward />, title: 'Award Winning', desc: 'Recognized excellence', color: 'text-purple-400' }
  ];

  const committees = [
    'Karapa', 'Kakinada Rural', 'Pithapuram', 'Tuni', 'Prathipadu', 
    'Jaggampeta', 'Peddapuram', 'Samalkota', 'Kakinada'
  ];

  const keyMetrics = [
    { icon: <FiDollarSign />, label: 'Total Value Processed', value: '₹12.5 Cr', growth: '+15%' },
    { icon: <FiActivity />, label: 'Daily Transactions', value: '2,500+', growth: '+8%' },
    { icon: <FiTarget />, label: 'Target Achievement', value: '94%', growth: '+12%' },
    { icon: <FiClock />, label: 'Processing Time', value: '< 2 min', growth: '-40%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <img src={logo} alt="AP Logo" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AMC Receipt System</h1>
                <p className="text-xs text-gray-500">Government of Andhra Pradesh</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/verifyReceipt"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center"
              >
                <FiSearch className="mr-2" size={16} />
                Verify Receipt
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                <FiLock className="mr-2" size={16} />
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                  <FiStar className="mr-2" />
                  Trusted by 9 Market Committees across East Godavari
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Agricultural Market
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                    Receipt System
                  </span>
                  <span className="text-gray-700 text-4xl lg:text-5xl">for Andhra Pradesh</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Empowering Agricultural Market Committees with cutting-edge digital receipt management, 
                  real-time analytics, and transparent governance solutions. Built for the Government of Andhra Pradesh.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <FiPlay className="mr-2" />
                  Access Dashboard
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/verifyReceipt"
                  className="group px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <FiCheckCircle className="mr-2" />
                  Verify Receipt
                </Link>
              </div>

              {/* Key Metrics Preview */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {keyMetrics.slice(0, 2).map((metric, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-2">
                      <div className="text-blue-600 mr-2">{metric.icon}</div>
                      <span className="text-sm text-gray-600">{metric.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-green-600 font-medium">{metric.growth} this month</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Main Dashboard Preview */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">System Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-500">Live</span>
                    </div>
                  </div>
                  
                  {/* Feature Showcase */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 ${detailedFeatures[currentFeature].color} rounded-lg flex items-center justify-center mr-3 shadow-lg`}>
                            <div className="text-white">{detailedFeatures[currentFeature].icon}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{detailedFeatures[currentFeature].title}</div>
                            <div className="text-sm text-gray-500">{detailedFeatures[currentFeature].description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{detailedFeatures[currentFeature].stats}</div>
                          <div className="text-xs text-gray-500">Performance</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
                      </div>
                    </div>

                    <Link
                      to="/login"
                      className="w-full p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg hover:from-green-100 hover:to-teal-100 transition-all duration-200 flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                          <FiUsers className="text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Multi-Role Access</div>
                          <div className="text-sm text-gray-500">DEO, Supervisor, Secretary, AD</div>
                        </div>
                      </div>
                      <FiArrowRight className="text-green-500 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to="/verifyReceipt"
                      className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all duration-200 flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                          <FiCheckCircle className="text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Public Verification</div>
                          <div className="text-sm text-gray-500">Instant receipt validation</div>
                        </div>
                      </div>
                      <FiArrowRight className="text-purple-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-3">Demo Access Credentials</div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600 mb-1">DEO (Tuni):</div>
                        <code className="bg-white px-2 py-1 rounded text-blue-600">deo_tuni</code>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600 mb-1">Password:</div>
                        <code className="bg-white px-2 py-1 rounded text-green-600">password123</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/70 backdrop-blur-sm border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">System Performance Metrics</h2>
            <p className="text-gray-600">Real-time statistics from across East Godavari District</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <div className="text-white text-2xl">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {index === 3 ? `${animatedStats[index].toFixed(1)}%` : 
                   index === 2 ? Math.floor(animatedStats[index]) :
                   `${Math.floor(animatedStats[index]).toLocaleString()}${index === 0 ? '+' : index === 1 ? '+' : ''}`}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
                <div className="text-sm text-green-600 mt-1">↗ Active</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Coverage */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Serving All Market Committees
            </h2>
            <p className="text-gray-600 text-lg">Complete coverage across East Godavari District</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {committees.map((committee, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <div>
                    <div className="font-medium text-gray-900">{committee}</div>
                    <div className="text-sm text-gray-500">AMC</div>
                  </div>
                </div>
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
              Comprehensive Digital Solutions for
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Agricultural Markets</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our integrated platform transforms agricultural market committee operations with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" size={16} />
                      {benefit}
                    </div>
                  ))}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Government Agencies Choose Our System</h2>
            <p className="text-blue-100 text-xl">Built for efficiency, designed for transparency, engineered for growth</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-200 shadow-lg">
                  <div className={`text-3xl ${benefit.color}`}>{benefit.icon}</div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{benefit.title}</h3>
                <p className="text-blue-100">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Government Officials</h2>
            <p className="text-xl text-gray-600">Hear from the professionals transforming agricultural markets across East Godavari</p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 fill-current mr-1" size={20} />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {testimonials[currentTestimonial].avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Digitize Your Market Operations?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the digital transformation in agricultural market management. Experience seamless receipt processing, 
            comprehensive analytics, and transparent governance today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/login"
              className="group px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <FiMonitor className="mr-3" />
              Access System Dashboard
              <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/verifyReceipt"
              className="group px-10 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <FiSearch className="mr-3" />
              Verify Receipt Now
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm">System Availability</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">< 2 sec</div>
              <div className="text-sm">Receipt Processing</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm">Data Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <img src={logo} alt="AP Logo" className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AMC Receipt System</h3>
                  <p className="text-gray-400 text-sm">Government of Andhra Pradesh</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Empowering Agricultural Market Committees across East Godavari District with cutting-edge 
                digital receipt management, analytics, and governance solutions.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <FiGlobe className="text-gray-400" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <FiShield className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Quick Access</h4>
              <div className="space-y-3">
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors flex items-center">
                  <FiLock className="mr-2" size={16} />
                  System Login
                </Link>
                <Link to="/verifyReceipt" className="block text-gray-400 hover:text-white transition-colors flex items-center">
                  <FiSearch className="mr-2" size={16} />
                  Verify Receipt
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Key Features</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center">
                  <FiCheckCircle className="mr-2 text-green-500" size={16} />
                  Digital Receipt Management
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className="mr-2 text-green-500" size={16} />
                  Real-time Analytics
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className="mr-2 text-green-500" size={16} />
                  Role-based Access Control
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className="mr-2 text-green-500" size={16} />
                  Secure Data Storage
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className="mr-2 text-green-500" size={16} />
                  Performance Monitoring
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2025 Agricultural Market Committee Receipt System. Government of Andhra Pradesh. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Powered by</span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded"></div>
                  <span className="text-gray-400 text-sm">Digital India Initiative</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;