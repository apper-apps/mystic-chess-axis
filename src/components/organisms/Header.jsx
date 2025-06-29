import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
return (
    <header className="bg-secondary/80 backdrop-blur-sm border-b border-primary/20 shadow-lg">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-purple-700 rounded-lg flex items-center justify-center magical-glow">
              <ApperIcon name="Crown" className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-display font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Mystic Chess
              </h1>
              <p className="text-xs lg:text-sm text-slate-400">Fantasy Chess Battle</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-300">Immerse yourself in the</p>
              <p className="text-xs text-accent font-medium">Ancient Battle of Kings</p>
            </div>
          </div>

          <div className="sm:hidden">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-700 rounded flex items-center justify-center">
              <ApperIcon name="Sparkles" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;