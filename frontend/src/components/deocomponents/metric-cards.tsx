import React from 'react';
import { FiDollarSign, FiUsers, FiTrendingUp, FiActivity } from 'react-icons/fi';
import MetricCard from '../ui/MetricCard';

export function MetricCards() {
  const metrics = [
    { 
      title: 'Total Traders', 
      value: '1,234', 
      icon: <FiUsers size={20} />, 
      change: { value: '+12%', trend: 'up' as const, label: 'from last month' }
    },
    { 
      title: 'Total Committees', 
      value: '56', 
      icon: <FiActivity size={20} />, 
      change: { value: '+5%', trend: 'up' as const, label: 'from last month' }
    },
    { 
      title: 'Monthly Volume', 
      value: '₹2,45,231', 
      icon: <FiDollarSign size={20} />, 
      change: { value: '+8.2%', trend: 'up' as const, label: 'from last month' }
    },
    { 
      title: 'Avg. Compliance', 
      value: '92%', 
      icon: <FiTrendingUp size={20} />, 
      change: { value: '+2.4%', trend: 'up' as const, label: 'from last month' }
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          change={metric.change}
        />
      ))}
    </div>
  );
}