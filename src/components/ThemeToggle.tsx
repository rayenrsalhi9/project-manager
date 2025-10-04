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
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center',
    'rounded-full transition-all duration-300 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'hover:scale-110 active:scale-95',
    sizeClasses[size],
    className
  );

  const variantClasses = {
    default: cn(
      'bg-background border border-border',
      'text-foreground hover:bg-accent hover:text-accent-foreground',
      'focus:ring-ring'
    ),
    floating: cn(
      'bg-background/80 backdrop-blur-sm border border-border/50',
      'text-foreground hover:bg-accent/80 hover:text-accent-foreground',
      'focus:ring-ring shadow-lg',
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
            'transition-all duration-300 ease-in-out',
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-50'
          )}
        >
          <Sun 
            size={iconSizes[size]} 
            className="text-gray-500"
            strokeWidth={1.5}
          />
        </div>
        
        {/* Moon Icon */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'transition-all duration-300 ease-in-out',
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-50'
          )}
        >
          <Moon 
            size={iconSizes[size]} 
            className="text-gray-400"
            strokeWidth={1.5}
          />
        </div>
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full">
        <div 
          className={cn(
            'absolute inset-0 rounded-full transition-all duration-300',
            'bg-current opacity-0 scale-50',
            'group-hover:opacity-10 group-hover:scale-100'
          )}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;