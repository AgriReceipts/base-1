import React, {useState, useEffect} from 'react';

// Your existing interfaces
export interface CommitteeWiseAchievement {
  committeeId: string;
  committeeName: string;
  marketFees: number;
  marketFeesTarget: number;
  achievementPercentage: number;
  status: string;
  totalReceipts: number;
}

export type CommitteeWiseAcheivementRes = CommitteeWiseAchievement[];

interface CommitteeHorizontalBarsProps {
  data: CommitteeWiseAcheivementRes;
}

export const CommitteeHorizontalBars: React.FC<
  CommitteeHorizontalBarsProps
> = ({data}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-emerald-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getBadgeColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-emerald-500 text-white';
    if (percentage >= 80) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };

  const maxValue = Math.max(...data.map((item) => item.marketFeesTarget));

  return (
    <div className='space-y-3'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>
          Committee Performance
        </h3>
        <div className='flex items-center gap-3 text-xs text-gray-600'>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
            <span>100%+</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-amber-500 rounded-full'></div>
            <span>80-99%</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-red-500 rounded-full'></div>
            <span>&lt;80%</span>
          </div>
        </div>
      </div>

      {data.map((committee, index) => (
        <div
          key={committee.committeeId}
          className='flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200'
          style={{animationDelay: `${index * 100}ms`}}>
          {/* Committee Name */}
          <div className='w-32 flex-shrink-0'>
            <div
              className='font-medium text-sm text-gray-800 truncate'
              title={committee.committeeName}>
              {committee.committeeName}
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className='flex-1 relative'>
            {/* Background Bar */}
            <div className='w-full h-6 bg-gray-200 rounded-full overflow-hidden'>
              {/* Target Bar (light gray) */}
              <div
                className='h-full bg-gray-300 rounded-full transition-all duration-1000 ease-out'
                style={{
                  width: animated
                    ? `${(committee.marketFeesTarget / maxValue) * 100}%`
                    : '0%',
                }}
              />

              {/* Achievement Bar */}
              <div
                className={`absolute top-0 left-0 h-full ${getPerformanceColor(
                  committee.achievementPercentage
                )} rounded-full transition-all duration-1200 ease-out`}
                style={{
                  width: animated
                    ? `${(committee.marketFees / maxValue) * 100}%`
                    : '0%',
                }}
              />
            </div>

            {/* Values on bar */}
            <div className='absolute inset-0 flex items-center justify-between px-2 text-xs font-medium'>
              <span className='text-white drop-shadow-sm'>
                ₹{(committee.marketFees / 1000).toFixed(0)}K
              </span>
              <span className='text-gray-600 text-xs'>
                /₹{(committee.marketFeesTarget / 1000).toFixed(0)}K
              </span>
            </div>
          </div>

          {/* Achievement Badge */}
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
              committee.achievementPercentage
            )} min-w-[50px] text-center transition-all duration-300 hover:scale-105`}>
            {committee.achievementPercentage}%
          </div>
        </div>
      ))}
    </div>
  );
};
