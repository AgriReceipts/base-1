import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  className
}) => {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-success-600';
      case 'down': return 'text-error-600';
      case 'neutral': return 'text-neutral-500';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        );
      case 'neutral':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow duration-200', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mb-2">{value}</p>
          
          {change && (
            <div className={cn(
              'flex items-center text-sm font-medium',
              getTrendColor(change.trend)
            )}>
              {getTrendIcon(change.trend)}
              <span className="ml-1">{change.value}</span>
              {change.label && (
                <span className="ml-1 text-neutral-500 font-normal">
                  {change.label}
                </span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
            <div className="text-primary-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;