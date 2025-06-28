import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select option...', 
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'w-full px-3 py-2 bg-secondary border border-primary/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const classes = `${baseClasses} ${disabledClasses} ${className}`;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${classes} appearance-none pr-10`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-secondary">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ApperIcon name="ChevronDown" className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};

export default Select;