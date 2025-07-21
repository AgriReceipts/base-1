import React from 'react';
import {useOverview} from '@/hooks/useOverview';
import {useAuthStore} from '@/stores/authStore';
import {
  TrendingUp,
  Users,
  Receipt,
  Building2,
  MapPin,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {formatMoney} from '@/lib/helpers';
interface ProgressBarProps {
  current: number;
  target: number;
  color?: string;
}

interface FeeCardProps {
  title: string;
  amount: string | number;
  target: number | null;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const OverviewCard: React.FC = () => {
  const {committee} = useAuthStore();
  const committeeId = committee?.id;

  // Always call the hook, but handle the empty case in the hook itself
  const {data, loading, error} = useOverview({
    committeeId: committeeId || '',
  });

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', {month: 'long'});
  const currentYear = currentDate.getFullYear();

  const ProgressBar: React.FC<ProgressBarProps> = ({
    current,
    target,
    color = 'blue',
  }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    const isAchieved = current >= target && target > 0;

    return (
      <div className='mt-3'>
        <div className='flex justify-between items-center mb-1'>
          <span className='text-xs text-gray-500'>{formatMoney(target)}</span>
          <span
            className={`text-xs font-medium ${
              isAchieved ? 'text-green-600' : 'text-gray-500'
            }`}>
            {target > 0 ? `${percentage.toFixed(1)}%` : 'No target set'}
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAchieved
                ? 'bg-gradient-to-r from-green-400 to-green-600'
                : `bg-gradient-to-r from-${color}-400 to-${color}-600`
            }`}
            style={{width: `${percentage}%`}}
          />
        </div>
        {isAchieved && (
          <p className='text-xs text-green-600 mt-1 font-medium'>
            🎉 Target achieved!
          </p>
        )}
      </div>
    );
  };

  const FeeCard: React.FC<FeeCardProps> = ({
    title,
    amount,
    target,
    icon: Icon,
    color,
    bgColor,
  }) => {
    // Handle string values from API
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    const numericTarget = target === null || target === undefined ? 0 : target;

    return (
      <div
        className={`${bgColor} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className={`p-2 rounded-lg bg-${color}-100`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div>
              <h3 className='font-semibold text-gray-800'>{title}</h3>
              <p className='text-xs text-gray-500'>
                {currentMonth} {currentYear}
              </p>
            </div>
          </div>
        </div>
        <div className='mb-2'>
          <p className='text-2xl font-bold text-gray-900'>
            {formatMoney(numericAmount)}
          </p>
          <p className='text-xs text-gray-500 mt-1'>Collected this month</p>
        </div>
        <ProgressBar
          current={numericAmount}
          target={numericTarget}
          color={color}
        />
      </div>
    );
  };

  const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    bgColor,
  }) => (
    <div
      className={`${bgColor} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <Icon className={`w-5 h-5 text-${color}-600`} />
            <h3 className='font-semibold text-gray-800'>{title}</h3>
          </div>
          <p className='text-3xl font-bold text-gray-900'>{value}</p>
          <p className='text-xs text-gray-500 mt-1'>{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (!committeeId) {
    return (
      <div className='h-48 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 text-red-500 mx-auto mb-2' />
          <p className='text-red-700 font-medium'>
            Could not load committee data
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin' />
          <p className='text-blue-700 font-medium'>
            Loading committee overview...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='h-48 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 text-amber-500 mx-auto mb-2' />
          <p className='text-amber-700 font-medium'>Error loading data</p>
          <p className='text-amber-600 text-sm mt-1'>
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='w-8 h-8 text-gray-500 mx-auto mb-2' />
          <p className='text-gray-700 font-medium'>No data available</p>
        </div>
      </div>
    );
  }

  // Check if committee has checkpost (both fees and target should be > 0 or fees > 0)
  const checkpostFees =
    typeof data.checkpostMarketFees === 'string'
      ? parseFloat(data.checkpostMarketFees) || 0
      : data.checkpostMarketFees;
  const checkpostTarget =
    data.checkPostTarget === null || data.checkPostTarget === undefined
      ? 0
      : data.checkPostTarget;
  const hasCheckpost = checkpostFees > 0 || checkpostTarget > 0;
  return (
    <div className='w-full'>
      <div className='mb-4'>
        <h2 className='text-xl font-bold text-gray-800'>Committee Overview</h2>
        <p className='text-sm text-gray-600'>
          {currentMonth} {currentYear} Performance
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8'>
        {/* Market Fees Card */}
        <div className='lg:col-span-2 min-h-40'>
          <FeeCard
            title='Market Fees'
            amount={data.marketFees}
            target={data.marketFeeTarget}
            icon={TrendingUp}
            color='blue'
            bgColor='bg-gradient-to-br from-blue-50 to-blue-100'
          />
        </div>
        {/* Checkpost Card - Only render if committee has checkpost */}
        {hasCheckpost && (
          <div className='lg:col-span-2 min-h-40'>
            <FeeCard
              title='Checkpost Fees'
              amount={data.checkpostMarketFees}
              target={data.checkPostTarget}
              icon={MapPin}
              color='emerald'
              bgColor='bg-gradient-to-br from-emerald-50 to-emerald-100'
            />
          </div>
        )}
        {/* Office Fees Card */}
        <div
          className={`${
            hasCheckpost ? 'lg:col-span-2' : 'lg:col-span-2'
          } min-h-40`}>
          <FeeCard
            title='Supervisor Fees'
            amount={data.officeFees}
            target={data.superVisorTarget}
            icon={Building2}
            color='purple'
            bgColor='bg-gradient-to-br from-purple-50 to-purple-100'
          />
        </div>
        {/* Stats Cards */}
        <div
          className={`${
            hasCheckpost ? 'lg:col-span-3' : 'lg:col-span-2'
          } min-h-40`}>
          <StatsCard
            title='Total Receipts'
            value={data.totalReceipts}
            subtitle={`${currentMonth} ${currentYear}`}
            icon={Receipt}
            color='orange'
            bgColor='bg-gradient-to-br from-orange-50 to-orange-100'
          />
        </div>
        <div
          className={`${
            hasCheckpost ? 'lg:col-span-3' : 'lg:col-span-2'
          } min-h-40`}>
          <StatsCard
            title='Active Traders'
            value={data.uniqueTraders}
            subtitle={`${data.uniqueCommodities} commodities`}
            icon={Users}
            color='teal'
            bgColor='bg-gradient-to-br from-teal-50 to-teal-100'
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
