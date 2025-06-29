import React from 'react';

const AuthCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 backdrop-blur-sm bg-opacity-90 border border-gray-100">
      {children}
    </div>
  );
};

export default AuthCard;