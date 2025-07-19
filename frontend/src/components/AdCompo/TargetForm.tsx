import React, {useState, useEffect, useMemo} from 'react';
import {
  Users,
  MapPin,
  Save,
  X,
  DollarSign,
  Target as TargetIcon,
} from 'lucide-react';
import type {Committee, Target} from '@/types/targets';
import {TargetType} from '@/types/targets';

// --- TYPE DEFINITIONS ---

interface TargetFormProps {
  committee: Committee;
  year: number;
  currentUser: string;
  existingTargets: Target[];
  onSave: (targets: Omit<Target, 'id'>[]) => void;
  onCancel: () => void;
  loading: boolean;
}

interface MonthlyTarget {
  month: number;
  marketFeeTarget: number;
}

// --- CONSTANTS ---

const MONTHS = [
  {value: 4, label: 'April'},
  {value: 5, label: 'May'},
  {value: 6, label: 'June'},
  {value: 7, label: 'July'},
  {value: 8, label: 'August'},
  {value: 9, label: 'September'},
  {value: 10, label: 'October'},
  {value: 11, label: 'November'},
  {value: 12, label: 'December'},
  {value: 1, label: 'January'},
  {value: 2, label: 'February'},
  {value: 3, label: 'March'},
];

// --- HELPER FUNCTIONS ---

const formatToShortScale = (num: number): string => {
  if (isNaN(num) || num === 0) return '₹0';
  if (num >= 100_000) return `₹${(num / 100_000).toFixed(2)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
};

const parseFormattedNumber = (str: string): number => {
  return Number(String(str).replace(/,/g, '')) || 0;
};

// Helper function to get the correct calendar year for a given month in a financial year
const getCalendarYear = (financialYear: number, month: number): number => {
  // For months 4-12 (April-December), use the financial year
  // For months 1-3 (January-March), use the financial year + 1
  return month >= 4 ? financialYear : financialYear + 1;
};

// --- HELPER COMPONENTS ---

interface FormattedNumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  value: number;
  onValueChange: (value: number) => void;
}

const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  value,
  onValueChange,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Only update display value when not focused to avoid disrupting user input
    if (!isFocused) {
      setDisplayValue(value > 0 ? value.toLocaleString('en-IN') : '');
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show unformatted value when focused for easier editing
    setDisplayValue(value > 0 ? value.toString() : '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(rawValue)) {
      setDisplayValue(rawValue);
      onValueChange(parseFormattedNumber(rawValue));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const num = parseFormattedNumber(displayValue);
    setDisplayValue(num > 0 ? num.toLocaleString('en-IN') : '');
  };

  return (
    <input
      type='text'
      inputMode='numeric'
      {...props}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

interface MonthlyInputsGridProps {
  targets: MonthlyTarget[];
  onTargetChange: (monthIndex: number, value: number) => void;
  selectedMonth: number | 'all';
}

const MonthlyInputsGrid: React.FC<MonthlyInputsGridProps> = ({
  targets,
  onTargetChange,
  selectedMonth,
}) => {
  const monthsToDisplay =
    selectedMonth === 'all'
      ? MONTHS
      : MONTHS.filter((m) => m.value === selectedMonth);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
      {targets
        .map((target, index) => ({...target, originalIndex: index}))
        .filter((target) =>
          monthsToDisplay.some((m) => m.value === target.month)
        )
        .map((target) => (
          <div
            key={target.month}
            className='p-3 bg-white rounded-lg border border-gray-200'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {MONTHS.find((m) => m.value === target.month)?.label}
            </label>
            <FormattedNumberInput
              value={target.marketFeeTarget}
              onValueChange={(newValue) =>
                onTargetChange(target.originalIndex, newValue)
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              placeholder='0'
            />
          </div>
        ))}
    </div>
  );
};

interface TargetBreakdownSectionProps {
  title: string;
  icon: React.ReactNode;
  distroTotal: number;
  onDistroTotalChange: (value: number) => void;
  calculatedMonthlyTotal: number;
  monthlyTargets: MonthlyTarget[];
  onMonthlyTargetChange: (monthIndex: number, value: number) => void;
  selectedMonth: number | 'all';
}

const TargetBreakdownSection: React.FC<TargetBreakdownSectionProps> = ({
  title,
  icon,
  distroTotal,
  onDistroTotalChange,
  calculatedMonthlyTotal,
  monthlyTargets,
  onMonthlyTargetChange,
  selectedMonth,
}) => {
  const selectedMonthData =
    selectedMonth !== 'all'
      ? monthlyTargets.find((t) => t.month === selectedMonth)
      : null;

  return (
    <div className='mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          {icon}
          <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {selectedMonth === 'all'
              ? 'Set Annual Total (Distributes Evenly)'
              : `Set Target for ${
                  MONTHS.find((m) => m.value === selectedMonth)?.label
                }`}
          </label>
          <FormattedNumberInput
            value={distroTotal}
            onValueChange={onDistroTotalChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            placeholder='Enter target amount'
          />
        </div>
        <div className='flex items-end'>
          <div className='p-3 rounded-lg w-full text-center bg-white border'>
            <p className='text-sm text-gray-600'>
              {selectedMonthData
                ? `Target for ${
                    MONTHS.find((m) => m.value === selectedMonthData.month)
                      ?.label
                  }`
                : 'Sum of All Monthly Targets'}
            </p>
            <p className='text-lg font-bold text-gray-800'>
              {formatToShortScale(
                selectedMonthData
                  ? selectedMonthData.marketFeeTarget
                  : calculatedMonthlyTotal
              )}
            </p>
          </div>
        </div>
      </div>

      <MonthlyInputsGrid
        targets={monthlyTargets}
        onTargetChange={onMonthlyTargetChange}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

// --- MAIN COMPONENT ---

export const TargetForm: React.FC<TargetFormProps> = ({
  committee,
  year,
  currentUser,
  onSave,
  onCancel,
  loading,
}) => {
  const [supervisorTargets, setSupervisorTargets] = useState<MonthlyTarget[]>(
    []
  );
  const [checkpostTargets, setCheckpostTargets] = useState<{
    [key: string]: MonthlyTarget[];
  }>({});
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [supervisorDistroTotal, setSupervisorDistroTotal] = useState<number>(0);
  const [checkpostDistroTotals, setCheckpostDistroTotals] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    // This function initializes the state for the detailed committee target form.
    const initOverallTargets = () => {
      // Initialize with blank values (0) for all months
      setSupervisorTargets(
        MONTHS.map((m) => ({
          month: m.value,
          marketFeeTarget: 0, // Always start with 0 instead of loading existing values
        }))
      );
      const initialCPs: {[key: string]: MonthlyTarget[]} = {};
      committee.checkposts.forEach((cp) => {
        initialCPs[cp.id] = MONTHS.map((m) => ({
          month: m.value,
          marketFeeTarget: 0, // Always start with 0 instead of loading existing values
        }));
      });
      setCheckpostTargets(initialCPs);
    };

    initOverallTargets();
  }, [committee.checkposts]); // Removed existingTargets from dependency array

  // --- DERIVED VALUES (AGGREGATION) ---
  const supervisorCalculatedTotal = useMemo(
    () => supervisorTargets.reduce((sum, t) => sum + t.marketFeeTarget, 0),
    [supervisorTargets]
  );
  const checkpostCalculatedTotal = useMemo(
    () =>
      Object.values(checkpostTargets)
        .flat()
        .reduce((sum, t) => sum + t.marketFeeTarget, 0),
    [checkpostTargets]
  );
  const overallCalculatedTotal = useMemo(
    () => supervisorCalculatedTotal + checkpostCalculatedTotal,
    [supervisorCalculatedTotal, checkpostCalculatedTotal]
  );

  const selectedMonthTotal = useMemo(() => {
    if (selectedMonth === 'all') return overallCalculatedTotal;
    const supervisorMonthTotal =
      supervisorTargets.find((t) => t.month === selectedMonth)
        ?.marketFeeTarget || 0;
    const checkpostMonthTotal = Object.values(checkpostTargets)
      .flat()
      .filter((t) => t.month === selectedMonth)
      .reduce((sum, t) => sum + t.marketFeeTarget, 0);
    return supervisorMonthTotal + checkpostMonthTotal;
  }, [
    selectedMonth,
    supervisorTargets,
    checkpostTargets,
    overallCalculatedTotal,
  ]);

  // --- HANDLERS ---
  const distributeTarget = (total: number, portions: number) =>
    portions > 0 && total > 0 ? total / portions : 0;

  const handleSupervisorDistroChange = (total: number) => {
    setSupervisorDistroTotal(total);
    if (selectedMonth === 'all') {
      // When distributing across all months, divide evenly
      setSupervisorTargets(
        MONTHS.map((m) => ({
          month: m.value,
          marketFeeTarget: distributeTarget(total, 12),
        }))
      );
    } else {
      // When setting for a specific month, only update that month
      setSupervisorTargets((prev) =>
        prev.map((target) =>
          target.month === selectedMonth
            ? {...target, marketFeeTarget: total}
            : target
        )
      );
    }
  };

  const handleIndividualCheckpostDistroChange = (
    checkpostId: string,
    total: number
  ) => {
    setCheckpostDistroTotals((prev) => ({...prev, [checkpostId]: total}));
    if (selectedMonth === 'all') {
      // When distributing across all months, divide evenly
      setCheckpostTargets((prev) => ({
        ...prev,
        [checkpostId]: MONTHS.map((m) => ({
          month: m.value,
          marketFeeTarget: distributeTarget(total, 12),
        })),
      }));
    } else {
      // When setting for a specific month, only update that month
      setCheckpostTargets((prev) => ({
        ...prev,
        [checkpostId]: (prev[checkpostId] || []).map((target) =>
          target.month === selectedMonth
            ? {...target, marketFeeTarget: total}
            : target
        ),
      }));
    }
  };

  const handleSupervisorMonthlyChange = (index: number, value: number) => {
    setSupervisorTargets((prev) => {
      const newTargets = [...prev];
      newTargets[index] = {...newTargets[index], marketFeeTarget: value};
      return newTargets;
    });
  };

  const handleCheckpostMonthlyChange = (
    checkpostId: string,
    index: number,
    value: number
  ) => {
    setCheckpostTargets((prev) => {
      const newTargetsForCheckpost = [...(prev[checkpostId] || [])];
      newTargetsForCheckpost[index] = {
        ...newTargetsForCheckpost[index],
        marketFeeTarget: value,
      };
      return {...prev, [checkpostId]: newTargetsForCheckpost};
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targets: Omit<Target, 'id'>[] = [];

    // Determine which months to process based on selection
    const monthsToProcess =
      selectedMonth === 'all'
        ? MONTHS
        : MONTHS.filter((m) => m.value === selectedMonth);

    // Create overall committee targets for selected month(s)
    monthsToProcess.forEach((month) => {
      const supervisorTarget = supervisorTargets.find(
        (t) => t.month === month.value
      );
      const calendarYear = getCalendarYear(year, month.value);

      // Calculate total for this month across all checkposts
      const monthlyCheckpostTotal = Object.values(checkpostTargets)
        .flat()
        .filter((t) => t.month === month.value)
        .reduce((sum, t) => sum + t.marketFeeTarget, 0);

      // Overall committee target = supervisor target + all checkpost targets for this month
      const overallMonthlyTarget =
        (supervisorTarget?.marketFeeTarget || 0) + monthlyCheckpostTotal;

      // Only create target if there's a non-zero value
      if (overallMonthlyTarget > 0) {
        targets.push({
          year: calendarYear,
          month: month.value,
          committeeId: committee.id,
          marketFeeTarget: overallMonthlyTarget,
          setBy: currentUser,
          type: TargetType.OVERALL_COMMITTEE,
        });
      }
    });

    // Create individual monthly targets for supervisor (committee office)
    monthsToProcess.forEach((month) => {
      const supervisorTarget = supervisorTargets.find(
        (t) => t.month === month.value
      );
      const calendarYear = getCalendarYear(year, month.value);

      // Only create target if there's a non-zero value
      if (supervisorTarget && supervisorTarget.marketFeeTarget > 0) {
        targets.push({
          year: calendarYear,
          month: month.value,
          committeeId: committee.id,
          marketFeeTarget: supervisorTarget.marketFeeTarget,
          setBy: currentUser,
          type: TargetType.COMMITTEE_OFFICE,
        });
      }
    });

    // Add checkpost targets for selected month(s)
    Object.entries(checkpostTargets).forEach(([cpId, checkpost_targets]) => {
      monthsToProcess.forEach((month) => {
        const checkpostTarget = checkpost_targets.find(
          (t) => t.month === month.value
        );
        const calendarYear = getCalendarYear(year, month.value);

        // Only create target if there's a non-zero value
        if (checkpostTarget && checkpostTarget.marketFeeTarget > 0) {
          targets.push({
            year: calendarYear,
            month: month.value,
            committeeId: committee.id,
            checkpostId: cpId,
            marketFeeTarget: checkpostTarget.marketFeeTarget,
            setBy: currentUser,
            type: TargetType.CHECKPOST,
          });
        }
      });
    });

    onSave(targets);
  };

  return (
    <div className='p-6 bg-white rounded-xl shadow-sm border'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='p-2 bg-blue-100 rounded-lg'>
          <TargetIcon className='h-6 w-6 text-blue-600' />
        </div>
        <div>
          <h2 className='text-xl font-bold text-gray-800'>
            Overall Committee Target
          </h2>
          <p className='text-sm text-gray-600'>
            {committee.name} • FY {year}-{year + 1}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/50 text-center'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <DollarSign className='h-5 w-5 text-blue-600' />
            <h3 className='text-lg font-semibold text-gray-800'>
              {selectedMonth === 'all'
                ? `Overall Annual Target`
                : `Monthly Target for ${
                    MONTHS.find((m) => m.value === selectedMonth)?.label
                  }`}
            </h3>
          </div>
          <p className='text-4xl font-bold text-blue-700'>
            {formatToShortScale(selectedMonthTotal)}
          </p>
          <p className='text-sm text-gray-600 mt-1'>
            {selectedMonth === 'all'
              ? `Total calculated from all monthly breakdowns for ${committee.name}.`
              : `Combined target for the selected month.`}
          </p>
        </div>
        <div className='mb-4'>
          <div className='mb-4'>
            <label
              htmlFor='month-filter'
              className='block text-sm font-medium text-gray-700 mb-2'>
              Filter by Month
            </label>
            <select
              id='month-filter'
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value === 'all' ? 'all' : parseInt(e.target.value)
                )
              }
              className='w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
              <option value='all'>All Months</option>
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <TargetBreakdownSection
            title='Supervisor'
            icon={<Users className='h-5 w-5 text-green-600' />}
            distroTotal={supervisorDistroTotal}
            onDistroTotalChange={handleSupervisorDistroChange}
            calculatedMonthlyTotal={supervisorCalculatedTotal}
            monthlyTargets={supervisorTargets}
            onMonthlyTargetChange={handleSupervisorMonthlyChange}
            selectedMonth={selectedMonth}
          />
          {committee.checkposts.map((cp) => (
            <TargetBreakdownSection
              key={cp.id}
              title={cp.name}
              icon={<MapPin className='h-5 w-5 text-purple-600' />}
              distroTotal={checkpostDistroTotals[cp.id] || 0}
              onDistroTotalChange={(value) =>
                handleIndividualCheckpostDistroChange(cp.id, value)
              }
              calculatedMonthlyTotal={(checkpostTargets[cp.id] || []).reduce(
                (sum, t) => sum + t.marketFeeTarget,
                0
              )}
              monthlyTargets={checkpostTargets[cp.id] || []}
              onMonthlyTargetChange={(index, value) =>
                handleCheckpostMonthlyChange(cp.id, index, value)
              }
              selectedMonth={selectedMonth}
            />
          ))}
        </div>
        <div className='flex gap-3 mt-6'>
          <button
            type='submit'
            disabled={loading}
            className='flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400'>
            <Save className='h-4 w-4' />{' '}
            {loading ? 'Saving...' : 'Save Targets'}
          </button>
          <button
            type='button'
            onClick={onCancel}
            className='flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700'>
            <X className='h-4 w-4' /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
