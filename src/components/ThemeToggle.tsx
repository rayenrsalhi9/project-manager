import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'floating';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = 'default',
  size = 'md',
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center',
    'rounded-full transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizeClasses[size],
    className
  );

  const variantClasses = {
    default: cn(
      'bg-background border border-border',
      'hover:bg-accent',
      'dark:bg-gray-800 dark:border-gray-600',
      'dark:hover:bg-gray-700'
    ),
    floating: cn(
      'bg-background border border-border',
      'hover:bg-accent',
      'dark:bg-gray-800 dark:border-gray-600',
      'dark:hover:bg-gray-700',
      'fixed bottom-6 right-6 z-50'
    ),
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(baseClasses, variantClasses[variant])}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'transition-opacity duration-200',
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Sun size={iconSizes[size]} className="text-orange-500" />
        </div>
        
        {/* Moon Icon */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'transition-opacity duration-200',
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Moon size={iconSizes[size]} className="text-blue-500" />
        </div>
      </div>

    </button>
  );
};

export default ThemeToggle;