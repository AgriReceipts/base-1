import React from 'react';
import LoginHeroSection from '../../components/Authcompo/LoginHeroSection';
import LoginForm from '../../components/Authcompo/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        <LoginHeroSection />
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;