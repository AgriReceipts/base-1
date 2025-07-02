import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseClasses = cn(
    // Base styles
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Size variants
    {
      'px-3 py-1.5 text-sm rounded-md': size === 'sm',
      'px-4 py-2 text-sm rounded-lg': size === 'md',
      'px-6 py-3 text-base rounded-lg': size === 'lg',
    },
    
    // Color variants
    {
      'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm': variant === 'primary',
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500 border border-neutral-300': variant === 'secondary',
      'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500': variant === 'outline',
      'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-500': variant === 'ghost',
      'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-sm': variant === 'danger',
    },
    
    // Full width
    { 'w-full': fullWidth },
    
    className
  );

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;