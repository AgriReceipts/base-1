import { formatMoney } from "@/lib/helpers";
import React, { useState, useEffect } from "react";

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
> = ({ data }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 100) return "bg-emerald-400";
    if (percentage >= 80) return "bg-blue-400";
    if (percentage >= 60) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getTargetColor = (percentage: number) => {
    if (percentage >= 100) return "bg-emerald-100";
    if (percentage >= 80) return "bg-blue-100";
    if (percentage >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getBadgeColor = (percentage: number) => {
    if (percentage >= 100)
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (percentage >= 80)
      return "bg-blue-50 text-blue-700 border border-blue-200";
    if (percentage >= 60)
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    return "bg-red-50 text-red-700 border border-red-200";
  };

  // Calculate max value considering both target and market fees
  const maxValue = Math.max(
    ...data.map((item) =>
      Math.max(item.marketFeesTarget || 0, item.marketFees || 0),
    ),
  );

  // Check if there are any targets in the data
  const hasTargets = data.some((item) => item.marketFeesTarget > 0);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Committee Performance Overview
        </h3>
        {hasTargets && (
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div>
              <span>≥100%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <span>80-99%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
              <span>&lt;60%</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {hasTargets && (
        <div className="flex items-center justify-end gap-6 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
            <span>Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-blue-400 rounded-sm"></div>
            <span>Achievement</span>
          </div>
        </div>
      )}

      {data.map((committee, index) => {
        const hasTarget = committee.marketFeesTarget > 0;
        const achievementPercentage = committee.achievementPercentage || 0;

        return (
          <div
            key={committee.committeeId}
            className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Committee Name */}
            <div className="w-40 flex-shrink-0">
              <div
                className="font-medium text-sm text-gray-800 truncate"
                title={committee.committeeName}
              >
                {committee.committeeName}
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="flex-1 relative">
              {hasTarget ? (
                <>
                  {/* Target Background Bar */}
                  <div className="w-full h-7 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-1200 ease-out ${getTargetColor(
                        achievementPercentage,
                      )}`}
                      style={{
                        width: animated
                          ? `${(committee.marketFeesTarget / maxValue) * 100}%`
                          : "0%",
                      }}
                    />
                    <div
                      className={`absolute top-0 left-0 h-full ${getPerformanceColor(
                        achievementPercentage,
                      )} rounded-lg transition-all duration-1200 ease-out`}
                      style={{
                        width: animated
                          ? `${Math.min(
                              (committee.marketFees / maxValue) * 100,
                              (committee.marketFeesTarget / maxValue) * 100,
                            )}%`
                          : "0%",
                      }}
                    />
                    {achievementPercentage > 100 && (
                      <div
                        className="absolute top-0 h-full bg-emerald-500 rounded-r-lg transition-all duration-1200 ease-out"
                        style={{
                          left: `${
                            (committee.marketFeesTarget / maxValue) * 100
                          }%`,
                          width: animated
                            ? `${
                                ((committee.marketFees -
                                  committee.marketFeesTarget) /
                                  maxValue) *
                                100
                              }%`
                            : "0%",
                        }}
                      />
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
                    <span className="text-white drop-shadow-sm">
                      {formatMoney(committee.marketFees)}
                    </span>
                    <span className="text-gray-700 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                      Target: {formatMoney(committee.marketFeesTarget)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-7 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-blue-400 rounded-lg transition-all duration-1200 ease-out"
                      style={{
                        width: animated
                          ? `${(committee.marketFees / maxValue) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center px-3 text-xs font-medium">
                    <span className="text-white drop-shadow-sm">
                      {formatMoney(committee.marketFees)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Badge and Status Indicator */}
            {hasTarget && (
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getBadgeColor(
                  achievementPercentage,
                )} min-w-[60px] text-center transition-all duration-300 hover:scale-105`}
              >
                {achievementPercentage.toFixed(1)}%
              </div>
            )}
            {hasTarget && (
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    achievementPercentage >= 100
                      ? "bg-emerald-400"
                      : achievementPercentage >= 80
                        ? "bg-blue-400"
                        : achievementPercentage >= 60
                          ? "bg-yellow-400"
                          : "bg-red-400"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
