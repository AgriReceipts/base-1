import React from 'react';
import PieChartComponent from '../common/analytics/PieChartComponent';
import AreaChartComponent from '../common/analytics/AreaChartComponent';
import {formatMoney} from '@/lib/helpers';

interface CommitteeAnalysisViewProps {
  viewMode: 'overview' | 'targets' | 'trends';
  setViewMode: (mode: 'overview' | 'targets' | 'trends') => void;
  locationTimeFrame: 'month' | 'all';
  setLocationTimeFrame: (frame: 'month' | 'all') => void;
  commodityTimeFrame: 'month' | 'all';
  setCommodityTimeFrame: (frame: 'month' | 'all') => void;
  selectedCommodityId: string | null;
  setSelectedCommodityId: (id: string | null) => void;
  committeeData: any;
  processedCommodityData: any[];
  currentLocationData: any[];
  totalFees: number;
  targetAchievement: number;
  detailedCommodityData: any;
  detailedLoading: boolean;
  detailedError: any;
  commodityLoading: boolean;
}

/**
 * Main Committee Analytics Dashboard component with three views:
 * 1. Overview - Shows market fees by location and commodity directory
 * 2. Targets - Displays target vs achieved with progress
 * 3. Trends - Shows growth metrics and patterns
 */
export default function CommitteeAnalysisView({
  viewMode,
  setViewMode,
  locationTimeFrame,
  setLocationTimeFrame,
  commodityTimeFrame,
  setCommodityTimeFrame,
  selectedCommodityId,
  setSelectedCommodityId,
  committeeData,
  processedCommodityData,
  currentLocationData,
  totalFees,
  targetAchievement,
  detailedCommodityData,
  detailedLoading,
  detailedError,
  commodityLoading,
}: CommitteeAnalysisViewProps) {

  // ==========================================================================
  // LEFT PANEL RENDERERS
  // ==========================================================================
  
  /**
   * Renders the left panel content based on current view mode
   */
  const renderLeftContent = () => {
    switch (viewMode) {
      case 'overview':
        return renderOverviewLeftPanel();
      case 'targets':
        return renderTargetsLeftPanel();
      case 'trends':
        return renderTrendsLeftPanel();
      default:
        return null;
    }
  };

  /**
   * Overview left panel - Shows market fees by location (unchanged as requested)
   */
  const renderOverviewLeftPanel = () => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>Market Fees by Location</h3>
        <TimeFrameToggle 
          currentFrame={locationTimeFrame}
          setFrame={setLocationTimeFrame}
          options={[
            { label: 'This Month', value: 'month' },
            { label: 'All Time', value: 'all' }
          ]}
        />
      </div>

      <SummaryBox 
        label="Total Fees Collected"
        value={formatMoney(totalFees)}
        className="mb-4"
      />

      <div className='h-64 md:h-80'>
        {commodityLoading ? (
          <LoadingSpinner />
        ) : currentLocationData.length > 0 ? (
          <PieChartComponent
            data={currentLocationData.map((d) => ({
              ...d,
              color: getLocationColor(d.name)
            }))}
            onClickData={() => {}}
          />
        ) : (
          <EmptyState message="No location data available" />
        )}
      </div>
    </div>
  );

  /**
   * Targets left panel - Shows target vs achieved with progress bar
   */
  const renderTargetsLeftPanel = () => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>Target Achievement</h3>
        <div className='text-sm text-gray-500'>
          {locationTimeFrame === 'month' ? 'Monthly Target' : 'Annual Target'}
        </div>
      </div>

      {/* Target vs Achieved metrics */}
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <MetricCard 
          value="₹50,000" 
          label="Monthly Target" 
          bgColor="bg-blue-50"
        />
        <MetricCard 
          value={`₹${formatMoney(totalFees)}`} 
          label="Achieved" 
          bgColor="bg-green-50"
        />
      </div>

      {/* Progress bar */}
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>Progress</span>
        <span>{targetAchievement}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{width: `${targetAchievement}%`}}
        ></div>
      </div>

      {/* Static AI suggestion */}
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-1">AI Suggestion</h4>
        <p className="text-sm text-yellow-700">
          Focus on Eastern checkpost - increasing coverage there could help achieve 92% of target.
        </p>
      </div>
    </div>
  );

  /**
   * Trends left panel - Shows three metrics and 6 month growth pattern
   */
  const renderTrendsLeftPanel = () => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>Market Trends</h3>
        <TimeFrameToggle 
          currentFrame={locationTimeFrame}
          setFrame={setLocationTimeFrame}
          options={[
            { label: 'Monthly', value: 'month' },
            { label: 'Annual', value: 'all' }
          ]}
        />
      </div>

      {/* Three metric cards */}
      <div className='grid grid-cols-3 gap-3 mb-6'>
        <MetricCard 
          value="Growing" 
          label="Trend Status" 
          bgColor="bg-green-50"
        />
        <MetricCard 
          value="+8.2%" 
          label="Avg Growth" 
          bgColor="bg-blue-50"
        />
        <MetricCard 
          value="Nov" 
          label="Peak Collection" 
          bgColor="bg-purple-50"
        />
      </div>

      {/* 6 month bar chart */}
      <h4 className="text-md font-medium mb-3">6 Month Growth Pattern</h4>
      <div className="h-48">
        <BarChartPlaceholder />
      </div>

      {/* Static AI suggestion */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-1">AI Trend Insight</h4>
        <p className="text-sm text-blue-700">
          Coffee volumes typically peak in November (+45% from baseline). Prepare additional resources.
        </p>
      </div>
    </div>
  );

  // ==========================================================================
  // RIGHT PANEL RENDERERS (COMMODITY DIRECTORY)
  // ==========================================================================
  
  /**
   * Right panel - Shows commodity directory (unchanged as requested)
   */
  const renderRightContent = () => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col'>
      <PanelHeader 
        title="Commodity Directory"
        subtitle="Click on a commodity to view detailed analytics"
        action={
          <TimeFrameToggle 
            currentFrame={commodityTimeFrame}
            setFrame={setCommodityTimeFrame}
            options={[
              { label: 'This Month', value: 'month' },
              { label: 'All Time', value: 'all' }
            ]}
          />
        }
      />

      <div className='flex-1 flex flex-col gap-3'>
        {commodityLoading ? (
          <LoadingSpinner size="md" />
        ) : processedCommodityData.length > 0 ? (
          processedCommodityData.slice(0, 5).map((c) => (
            <CommodityCard 
              key={c.id}
              commodity={c}
              isSelected={selectedCommodityId === c.id}
              onClick={() => setSelectedCommodityId(c.id)}
            />
          ))
        ) : (
          <EmptyState message="No commodity data available" />
        )}
      </div>
    </div>
  );

  // ==========================================================================
  // SUB-COMPONENTS
  // ==========================================================================
  
  /**
   * Reusable time frame toggle component
   */
  const TimeFrameToggle = ({ currentFrame, setFrame, options }: {
    currentFrame: string;
    setFrame: (frame: string) => void;
    options: { label: string; value: string }[];
  }) => (
    <div className='flex bg-gray-100 rounded-lg p-1'>
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currentFrame === option.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setFrame(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );

  /**
   * Reusable summary box component
   */
  const SummaryBox = ({ label, value, className = '' }: {
    label: string;
    value: string;
    className?: string;
  }) => (
    <div className={className}>
      <div className='text-sm text-gray-500'>{label}</div>
      <div className='text-2xl font-bold text-gray-900'>{value}</div>
    </div>
  );

  /**
   * Reusable loading spinner
   */
  const LoadingSpinner = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
    return (
      <div className='flex items-center justify-center h-full'>
        <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 border-blue-600`}></div>
      </div>
    );
  };

  /**
   * Reusable empty state component
   */
  const EmptyState = ({ message }: { message: string }) => (
    <div className='flex items-center justify-center h-full text-gray-500'>
      {message}
    </div>
  );

  /**
   * Panel header component
   */
  const PanelHeader = ({ title, subtitle, action }: {
    title: string;
    subtitle: string;
    action?: React.ReactNode;
  }) => (
    <div className='flex items-center justify-between mb-4'>
      <div>
        <h3 className='text-xl font-bold mb-1'>{title}</h3>
        <div className='text-gray-500 text-sm'>{subtitle}</div>
      </div>
      {action}
    </div>
  );

  /**
   * Commodity card component
   */
  const CommodityCard = ({ commodity, isSelected, onClick }: {
    commodity: any;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <button
      className={`flex items-center justify-between p-4 rounded-lg border transition bg-white hover:bg-blue-50 ${
        isSelected ? 'ring-2 ring-blue-400' : ''
      }`}
      onClick={onClick}>
      <div>
        <div className='font-semibold text-lg text-left'>
          {commodity.name}
        </div>
        <div className='text-gray-500 text-sm'>
          {commodity.receipts} receipts
        </div>
      </div>
      <div className='text-right'>
        <div className='font-bold text-xl'>{commodity.value}</div>
        <div className='text-xs text-gray-500'>Total Value</div>
      </div>
    </button>
  );

  /**
   * Metric card component for displaying key metrics
   */
  const MetricCard = ({ value, label, bgColor }: {
    value: string;
    label: string;
    bgColor: string;
  }) => (
    <div className={`${bgColor} rounded-lg p-3 text-center`}>
      <div className='font-bold text-lg'>{value}</div>
      <div className='text-xs text-gray-600 mt-1'>{label}</div>
    </div>
  );

  /**
   * Simple bar chart placeholder for trends view
   */
  const BarChartPlaceholder = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const values = [30, 45, 60, 75, 90, 65]; // Sample data
    
    return (
      <div className="flex items-end h-full gap-2 pt-4">
        {months.map((month, index) => (
          <div key={month} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-400 rounded-t-sm"
              style={{ height: `${values[index]}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-1">{month}</div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Helper to get color for location types
   */
  const getLocationColor = (locationName: string) => {
    const colors: Record<string, string> = {
      'Office': '#2563eb',
      'Checkpost': '#22c55e',
      'Other': '#f59e42'
    };
    return colors[locationName] || '#8884d8';
  };

  // ==========================================================================
  // MAIN COMPONENT RENDER
  // ==========================================================================
  
  return (
    <div className='w-full p-4 md:p-6'>
      {/* Top navigation and title */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4'>
        <h2 className='text-2xl font-bold'>Committee Analytics Dashboard</h2>
        <div className='flex bg-gray-100 rounded-lg p-1'>
          <ViewModeButton
            mode="overview"
            currentMode={viewMode}
            onClick={() => setViewMode('overview')}
          />
          <ViewModeButton
            mode="targets"
            currentMode={viewMode}
            onClick={() => setViewMode('targets')}
          />
          <ViewModeButton
            mode="trends"
            currentMode={viewMode}
            onClick={() => setViewMode('trends')}
          />
        </div>
      </div>

      {/* Main chart (consistent across all views) */}
      <div className='mb-8'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-full'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold'>
              {viewMode === 'overview' ? 'Market Fees Overview' :
               viewMode === 'targets' ? 'Target Progress' : 'Market Trends'}
            </h3>
            <div className='text-sm text-gray-500'>
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className='h-64 md:h-80 w-full flex items-center justify-center'>
            {committeeData?.chartData ? (
              <AreaChartComponent data={committeeData.chartData} />
            ) : (
              <div className='text-gray-500'>No chart data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom content (changes based on view mode) */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        {renderLeftContent()}
        {renderRightContent()}
      </div>

      {/* Detailed commodity view (appears when a commodity is selected) */}
      {selectedCommodityId && (
        <DetailedCommodityView
          commodityTimeFrame={commodityTimeFrame}
          setCommodityTimeFrame={setCommodityTimeFrame}
          selectedCommodityId={selectedCommodityId}
          setSelectedCommodityId={setSelectedCommodityId}
          detailedCommodityData={detailedCommodityData}
          detailedLoading={detailedLoading}
          detailedError={detailedError}
        />
      )}
    </div>
  );
}

// ==========================================================================
// ADDITIONAL COMPONENTS
// ==========================================================================

/**
 * View mode button component
 */
const ViewModeButton = ({ mode, currentMode, onClick }: {
  mode: 'overview' | 'targets' | 'trends';
  currentMode: string;
  onClick: () => void;
}) => {
  const labels = {
    overview: 'Overview',
    targets: 'Targets',
    trends: 'Trends'
  };
  
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        currentMode === mode
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-800'
      }`}
      onClick={onClick}>
      {labels[mode]}
    </button>
  );
};

/**
 * Detailed commodity view component (simplified)
 */
const DetailedCommodityView = ({
  commodityTimeFrame,
  setCommodityTimeFrame,
  selectedCommodityId,
  setSelectedCommodityId,
  detailedCommodityData,
  detailedLoading,
  detailedError
}: {
  commodityTimeFrame: 'month' | 'all';
  setCommodityTimeFrame: (frame: 'month' | 'all') => void;
  selectedCommodityId: string | null;
  setSelectedCommodityId: (id: string | null) => void;
  detailedCommodityData: any;
  detailedLoading: boolean;
  detailedError: any;
}) => (
  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6'>
    {detailedLoading ? (
      <div className='flex items-center justify-center h-32'>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ) : detailedError ? (
      <div className='text-center py-8 text-red-500'>
        Error loading detailed data
      </div>
    ) : detailedCommodityData ? (
      <>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-4'>
          <div className='flex-grow'>
            <div className='text-2xl font-bold'>
              {detailedCommodityData.commodity.name} Analytics
            </div>
            <div className='text-gray-500 text-sm mt-1'>
              {detailedCommodityData.commodity.category}
            </div>
          </div>
          <div className='flex items-center gap-4 mt-4 md:mt-0'>
            <button
              className='text-xs text-blue-600 underline'
              onClick={() => setSelectedCommodityId(null)}>
              Close
            </button>
          </div>
        </div>

        {/* Simplified metrics */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-blue-50 rounded-lg p-3 text-center'>
            <div className='font-bold text-lg'>
              {detailedCommodityData.overallAnalytics?.totalReceipts || 0}
            </div>
            <div className='text-xs text-gray-600 mt-1'>Total Receipts</div>
          </div>
          <div className='bg-green-50 rounded-lg p-3 text-center'>
            <div className='font-bold text-lg'>
              {formatMoney(detailedCommodityData.overallAnalytics?.totalValue || 0)}
            </div>
            <div className='text-xs text-gray-600 mt-1'>Total Value</div>
          </div>
          <div className='bg-yellow-50 rounded-lg p-3 text-center'>
            <div className='font-bold text-lg'>
              {formatMoney(detailedCommodityData.overallAnalytics?.totalFeesPaid || 0)}
            </div>
            <div className='text-xs text-gray-600 mt-1'>Total Fees</div>
          </div>
          <div className='bg-purple-50 rounded-lg p-3 text-center'>
            <div className='font-bold text-lg'>
              {(detailedCommodityData.overallAnalytics?.totalQuantity || 0).toFixed(1)}
            </div>
            <div className='text-xs text-gray-600 mt-1'>Quantity</div>
          </div>
        </div>
      </>
    ) : (
      <div className='text-center py-8 text-gray-500'>
        No detailed data available
      </div>
    )}
  </div>
);