import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiUsers, FiBarChart, FiFileText, FiCheckCircle, FiArrowRight, FiMapPin, FiTrendingUp, FiDatabase, FiLock } from 'react-icons/fi';
import logo from '../assets/logo-ap.png';

const LandingPage = () => {
  const features = [
    {
      icon: <FiFileText size={24} />,
      title: 'Digital Receipt Management',
      description: 'Complete digitization of agricultural market committee receipts with instant validation and secure storage.',
    },
    {
      icon: <FiBarChart size={24} />,
      title: 'Real-time Analytics',
      description: 'Comprehensive analytics and insights for better decision-making and policy formulation.',
    },
    {
      icon: <FiUsers size={24} />,
      title: 'Multi-level Access Control',
      description: 'Role-based access for DEOs, Supervisors, Secretaries, and Assistant Directors across all committees.',
    },
    {
      icon: <FiShield size={24} />,
      title: 'Secure & Transparent',
      description: 'End-to-end security with complete audit trails and transparent operations.',
    },
  ];

  const committees = [
    'Karapa', 'Kakinada Rural', 'Pithapuram', 'Tuni', 'Prathipadu',
    'Jaggampeta', 'Peddapuram', 'Samalkota', 'Kakinada'
  ];

  const stats = [
    { number: '9', label: 'Agricultural Market Committees', icon: <FiMapPin /> },
    { number: '100%', label: 'Digital Transformation', icon: <FiTrendingUp /> },
    { number: '24/7', label: 'System Availability', icon: <FiDatabase /> },
    { number: '100%', label: 'Secure Transactions', icon: <FiLock /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <img src={logo} alt="Andhra Pradesh Government" className="w-8 h-8" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-lg font-semibold text-gray-900">
                  Government of Andhra Pradesh
                </h1>
                <p className="text-sm text-gray-600">
                  Agricultural Market Committee - Digital Receipt System
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/verifyReceipt"
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FiCheckCircle className="mr-2" size={16} />
                Verify Receipt
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
                <FiArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Digital Transformation of
              <span className="text-blue-600 block">Agricultural Markets</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Government of Andhra Pradesh's initiative to modernize Agricultural Market Committee operations 
              through digital receipt management, ensuring transparency, efficiency, and accountability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Access System
                <FiArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/verifyReceipt"
                className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 text-lg font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FiCheckCircle className="mr-2" size={20} />
                Verify Receipt
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Project Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why This Digital Initiative?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming traditional paper-based systems to ensure transparency, 
              reduce corruption, and improve efficiency in agricultural market operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Objectives</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FiCheckCircle className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Eliminate Paper-based Processes</h4>
                    <p className="text-gray-600">Complete digitization of receipt generation, storage, and verification processes.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FiCheckCircle className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ensure Transparency</h4>
                    <p className="text-gray-600">Real-time tracking and public verification of all market transactions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FiCheckCircle className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Improve Efficiency</h4>
                    <p className="text-gray-600">Streamlined processes reducing time and administrative burden.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FiCheckCircle className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibent text-gray-900 mb-2">Data-Driven Decisions</h4>
                    <p className="text-gray-600">Real-time analytics for better policy formulation and resource allocation.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Areas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transparency</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Efficiency</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Accountability</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '88%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Accessibility</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">System Features</h2>
            <p className="text-xl text-gray-600">
              Comprehensive digital solution for modern agricultural market management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committees Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Agricultural Market Committees
            </h2>
            <p className="text-xl text-gray-600">
              Serving all major agricultural markets across East Godavari District
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {committees.map((committee, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FiMapPin className="text-green-600" size={16} />
                </div>
                <h3 className="font-medium text-gray-900">{committee}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Highlight */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <FiCheckCircle className="mx-auto text-white mb-6" size={48} />
            <h2 className="text-3xl font-bold text-white mb-6">
              Public Receipt Verification
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Any citizen can verify the authenticity of agricultural market receipts instantly. 
              Simply enter the receipt number or book number to check if a receipt is genuine and view its details.
            </p>
            <Link
              to="/verifyReceipt"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiCheckCircle className="mr-2" size={20} />
              Verify Receipt Now
            </Link>
          </div>
        </div>
      </section>

      {/* Login Instructions */}
      <section className="py-20">
        <div className="max-width-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                System Access for Officials
              </h2>
              <p className="text-xl text-gray-600">
                Role-based access for authorized personnel across all AMC operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">User Roles & Access</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Data Entry Operator (DEO)</h4>
                      <p className="text-sm text-gray-600">Create and manage receipts for assigned committee</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Supervisor</h4>
                      <p className="text-sm text-gray-600">Oversee operations and access analytics for committee</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Secretary</h4>
                      <p className="text-sm text-gray-600">Committee-level administrative access</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Assistant Director</h4>
                      <p className="text-sm text-gray-600">District-wide access and user management</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Demo Login Credentials</h3>
                <p className="text-sm text-gray-600 mb-4">For testing and demonstration purposes:</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">DEO (Tuni):</span>
                    <code className="bg-blue-100 px-2 py-1 rounded">deo_tuni</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Supervisor (Kakinada Rural):</span>
                    <code className="bg-blue-100 px-2 py-1 rounded">supervisor_kakinadarural</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Secretary (Pithapuram):</span>
                    <code className="bg-blue-100 px-2 py-1 rounded">secretary_pithapuram</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Assistant Director:</span>
                    <code className="bg-blue-100 px-2 py-1 rounded">ad_user1</code>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded">
                  <p className="text-xs text-blue-800">
                    <strong>Password for all users:</strong> <code>password123</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Access System Login
                <FiArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <img src={logo} alt="AP Government" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Government of Andhra Pradesh</h3>
                  <p className="text-sm text-gray-400">Agricultural Department</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Digital transformation initiative for Agricultural Market Committees across East Godavari District.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white">System Login</Link></li>
                <li><Link to="/verifyReceipt" className="hover:text-white">Verify Receipt</Link></li>
                <li><a href="#" className="hover:text-white">Help & Support</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">System Information</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Version 1.0.0</li>
                <li>24/7 System Availability</li>
                <li>Secure & Encrypted</li>
                <li>Government Approved</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Government of Andhra Pradesh. All rights reserved. | Developed for Agricultural Market Committee Operations</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;