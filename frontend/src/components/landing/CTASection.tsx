import React from 'react';
import Button from '../ui/Button';

const CTASection: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4 flex flex-col items-center bg-gradient-to-r from-blue-100 via-green-100 to-blue-50 rounded-xl shadow-md">
    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 text-center">
      Ready to Experience Seamless Agricultural Management?
    </h2>
    <p className="text-gray-700 mb-8 text-center max-w-xl">
      Secure, transparent, and efficient. Join the Government of Andhra Pradesh’s digital revolution in agricultural marketing today.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Button className="w-48">Login</Button>
      <Button variant="secondary" className="w-48">Verify Receipt</Button>
    </div>
  </div>
);

export default CTASection; 