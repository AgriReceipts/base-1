// 1. District metadata (totals, averages, etc.)
export interface DistrictMetadataRes {
  totalMarketFees: number;
  totalReceipts: number;
  avgTransaction: number;
  totalTarget: number | null;
  achievementPercent: number | null;
}

// 2. Committee-wise achievement structure (if data is present)
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

// 3. Monthly trend section
export interface MonthlyTrendDataPoint {
  month: string; // e.g., "April"
  monthNumber: number; // 1 to 12
  FY2025_2026: number;
  FY2024_2025: number;
  currentYear: number;
  comparisonYear: number;
}

export interface MonthlyTrendLabels {
  currentYear: string; // e.g., "FY2025-2026"
  comparisonYear: string; // e.g., "FY2024-2025"
}

export interface MonthlyTrendTotals {
  currentYear: number;
  comparisonYear: number;
}

export interface MonthlyTrend {
  data: MonthlyTrendDataPoint[];
  labels: MonthlyTrendLabels;
  totals: MonthlyTrendTotals;
}

// 4. Top commodities
export interface TopCommodity {
  commodityName: string;
  totalFeesPaid: number;
}

export type TopCommodityRes = TopCommodity[];

// 5. Checkpost analytics
export interface TopCheckPost {
  name: string;
  totalFees: number;
}

export type CheckPostsRes = TopCheckPost[];

// 6. Heatmap data for monthly activity across committees
export interface HeatMapRes {
  committeeId: string;
  committeeName: string;
  April: number;
  May: number;
  June: number;
  July: number;
  August: number;
  September: number;
  October: number;
  November: number;
  December: number;
  January: number;
  February: number;
  March: number;
}

// 7. Full API response type
export interface DistrictAnalyticsResponse {
  districtMetadataRes: DistrictMetadataRes;
  committeeWiseAcheivementRes: CommitteeWiseAcheivementRes;
  monthlyTrend: MonthlyTrend;
  topCommodityRes: TopCommodityRes;
  checkPostsRes: CheckPostsRes;
  heatMapRes: HeatMapRes[];
}
