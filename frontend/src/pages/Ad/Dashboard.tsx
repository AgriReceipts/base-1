import React from 'react';
import NavBar from '../../components/ui/NavBar';
import LogoutButton from '../../components/ui/LogoutButton';

export default function AdDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="p-8 flex-grow relative">
        
        <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
        <p>Welcome to the AD home page.</p>
      </main>
    </div>
  );
}

