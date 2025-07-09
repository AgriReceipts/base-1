import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full py-8 bg-blue-900 text-white text-center mt-auto">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
        <span className="font-bold text-lg">Government of Andhra Pradesh</span>
        <span className="hidden md:inline">|</span>
        <span className="text-sm">Agricultural Marketing Committee</span>
      </div>
      <nav className="flex flex-wrap gap-4 justify-center text-sm mt-2 md:mt-0">
        <a href="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded">Home</a>
        <a href="/login" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded">Login</a>
        <a href="/verify-receipt" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded">Verify Receipt</a>
        <a href="/privacy" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded">Privacy Policy</a>
        <a href="/contact" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded">Contact</a>
      </nav>
    </div>
    <div className="mt-4 text-xs text-blue-100">© {new Date().getFullYear()} Government of Andhra Pradesh. All rights reserved.</div>
  </footer>
);

export default Footer; 