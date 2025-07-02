import React from 'react';
import { FiPlus, FiEye } from 'react-icons/fi';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';

interface OverviewProps {
  onNavigate: (nav: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const quickActions = [
    {
      id: 'addReceipt',
      title: 'Add New Receipt',
      description: 'Create a new agricultural transaction receipt for market fees, licenses, or other charges.',
      icon: <FiPlus size={24} />,
      buttonText: 'Create Receipt',
      buttonVariant: 'primary' as const,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      id: 'viewReceipts',
      title: 'View Receipts',
      description: 'Access and manage all existing agricultural transaction receipts in one place.',
      icon: <FiEye size={24} />,
      buttonText: 'View All Receipts',
      buttonVariant: 'secondary' as const,
      bgColor: 'bg-neutral-50',
      iconColor: 'text-neutral-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-neutral-900">
          Agricultural Receipts Management
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          Efficiently manage all your agricultural transaction receipts. Keep track of market fees, 
          licenses, and other charges for farming operations in your district.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {quickActions.map((action) => (
          <Card key={action.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardContent className="text-center space-y-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${action.bgColor} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <div className={action.iconColor}>
                  {action.icon}
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {action.title}
                </h2>
                <p className="text-neutral-600 leading-relaxed">
                  {action.description}
                </p>
              </div>
              
              <Button
                variant={action.buttonVariant}
                size="lg"
                onClick={() => onNavigate(action.id)}
                className="w-full sm:w-auto"
              >
                {action.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Summary */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">System Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-neutral-500">Database</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-success-600 font-medium">Online</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-neutral-500">Last Sync</p>
              <p className="text-neutral-900 font-medium">2 min ago</p>
            </div>
            <div className="space-y-1">
              <p className="text-neutral-500">Active Users</p>
              <p className="text-neutral-900 font-medium">12</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;