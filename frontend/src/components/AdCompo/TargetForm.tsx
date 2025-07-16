import type { Committee, MonthlyTarget, Target } from "@/types/targets";
import React, { useState, useEffect } from "react";

interface TargetFormProps {
  committee: Committee;
  year: number;
  currentUser: string;
  existingTarget: Target;
  onSave: (targets: Omit<Target, "id">[]) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const MONTHS = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

interface CheckpostTarget {
  checkpostId: string;
  marketFeeTarget: number;
}

export const TargetForm: React.FC<TargetFormProps> = ({
  committee,
  year,
  currentUser,
  onSave,
  onCancel,
  loading,
}) => {
  const [monthlyTargets, setMonthlyTargets] = useState<MonthlyTarget[]>([]);
  const [checkpostTargets, setCheckpostTargets] = useState<CheckpostTarget[]>(
    [],
  );
  const [totalMarketFee, setTotalMarketFee] = useState<number>(0);

  useEffect(() => {
    const zeroTargets = MONTHS.map((month) => ({
      month: month.value,
      marketFeeTarget: 0,
      totalValueTarget: 0, // Keep for internal calculations but won't be used
    }));

    const zeroCheckpostTargets =
      committee.checkposts?.map((checkpost) => ({
        checkpostId: checkpost.id,
        marketFeeTarget: 0,
      })) || [];

    setMonthlyTargets(zeroTargets);
    setCheckpostTargets(zeroCheckpostTargets);
    updateTotals(zeroTargets);
  }, [committee.id]);

  const updateTotals = (targets: MonthlyTarget[]) => {
    const marketFeeSum = targets.reduce(
      (sum, target) => sum + target.marketFeeTarget,
      0,
    );
    setTotalMarketFee(marketFeeSum);
  };

  const updateCheckpostTotals = (targets: CheckpostTarget[]) => {
    const marketFeeSum = targets.reduce(
      (sum, target) => sum + target.marketFeeTarget,
      0,
    );
    setTotalMarketFee(marketFeeSum);
  };

  const handleMonthlyTargetChange = (
    month: number,
    field: keyof MonthlyTarget,
    value: number,
  ) => {
    const updated = monthlyTargets.map((target) =>
      target.month === month ? { ...target, [field]: value } : target,
    );
    setMonthlyTargets(updated);
    updateTotals(updated);
  };

  const handleCheckpostTargetChange = (checkpostId: string, value: number) => {
    const updated = checkpostTargets.map((target) =>
      target.checkpostId === checkpostId
        ? { ...target, marketFeeTarget: value }
        : target,
    );
    setCheckpostTargets(updated);
    updateCheckpostTotals(updated);
  };

  const handleTotalMarketFeeChange = (newTotal: number) => {
    setTotalMarketFee(newTotal);

    const perCheckpost = newTotal / committee.checkposts.length;
    const updatedCheckpostTargets = checkpostTargets.map((target) => ({
      ...target,
      marketFeeTarget: perCheckpost,
    }));
    setCheckpostTargets(updatedCheckpostTargets);
    // Distribute equally among months
    const perMonth = newTotal / 12;
    const updated = monthlyTargets.map((target) => ({
      ...target,
      marketFeeTarget: perMonth,
    }));
    setMonthlyTargets(updated);
  };

  const handleSave = async () => {
    const targets: Omit<Target, "id">[] = [];

    // If committee has checkposts, create targets for each checkpost
    if (committee.checkposts && committee.checkposts.length > 0) {
      committee.checkposts.forEach((checkpost) => {
        const checkpostTarget = checkpostTargets.find(
          (ct) => ct.checkpostId === checkpost.id,
        );
        const checkpostTotal = checkpostTarget?.marketFeeTarget || 0;
        const monthlyAmount = checkpostTotal / 12;

        monthlyTargets.forEach((monthlyTarget) => {
          targets.push({
            year,
            month: monthlyTarget.month,
            committeeId: committee.id,
            checkpostId: checkpost.id,
            marketFeeTarget: monthlyAmount,
            setBy: currentUser,
          });
        });
      });
    } else {
      // If no checkposts, create committee-level targets
      monthlyTargets.forEach((monthlyTarget) => {
        targets.push({
          year,
          month: monthlyTarget.month,
          committeeId: committee.id,
          marketFeeTarget: monthlyTarget.marketFeeTarget,
          setBy: currentUser,
        });
      });
    }

    await onSave(targets);
  };

  // Helper function to format value for display
  const formatInputValue = (value: number): string => {
    return value === 0 ? "" : value.toString();
  };

  // Helper function to handle input focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Set Targets for {committee.name} - {year}-{year + 1}
      </h2>

      {/* Show info about checkpost division if applicable */}
      {committee.checkposts && committee.checkposts.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            Set targets for each checkpost. Monthly targets will be
            automatically divided equally (total ÷ 12 months).
          </p>
        </div>
      )}

      {/* Total Target */}
      <div className="mb-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Market Fee Target
          </label>
          <input
            type="number"
            step="0.01"
            value={formatInputValue(totalMarketFee)}
            onChange={(e) =>
              handleTotalMarketFeeChange(parseFloat(e.target.value) || 0)
            }
            onFocus={handleInputFocus}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Checkpost Targets - Show only if committee has checkposts */}
      {committee.checkposts && committee.checkposts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Checkpost Targets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {committee.checkposts.map((checkpost) => {
              const checkpostTarget = checkpostTargets.find(
                (ct) => ct.checkpostId === checkpost.id,
              );
              return (
                <div
                  key={checkpost.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-800 mb-2">
                    {checkpost.name}
                  </h4>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Market Fee Target
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formatInputValue(
                        checkpostTarget?.marketFeeTarget || 0,
                      )}
                      onChange={(e) =>
                        handleCheckpostTargetChange(
                          checkpost.id,
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      onFocus={handleInputFocus}
                      placeholder="0"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly Targets - Show only if no checkposts */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Monthly Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MONTHS.map((month) => {
            const monthlyTarget = monthlyTargets.find(
              (t) => t.month === month.value,
            );
            return (
              <div
                key={month.value}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-800 mb-2">
                  {month.label}
                </h4>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Market Fee Target
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formatInputValue(
                      monthlyTarget?.marketFeeTarget || 0,
                    )}
                    onChange={(e) =>
                      handleMonthlyTargetChange(
                        month.value,
                        "marketFeeTarget",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    onFocus={handleInputFocus}
                    placeholder="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Targets"}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
