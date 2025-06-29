import React from 'react';
import Header from '@/components/organisms/Header';

const Layout = ({ children }) => {
return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900 to-background overflow-x-hidden">
      <Header />
      <main className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-4 py-3 sm:py-4 md:py-5 lg:py-6 pb-safe-area-inset-bottom">
        {children}
      </main>
    </div>
  );
};

export default Layout;