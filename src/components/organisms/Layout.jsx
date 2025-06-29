import React from 'react';
import Header from '@/components/organisms/Header';

const Layout = ({ children }) => {
return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900 to-background">
      <Header />
      <main className="container mx-auto px-1 sm:px-2 lg:px-4 py-3 sm:py-4 lg:py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;