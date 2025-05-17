import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-space bg-cover bg-center bg-no-repeat z-[-2]"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-space-black/40 to-space-black/90 z-[-1]"></div>
      
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;