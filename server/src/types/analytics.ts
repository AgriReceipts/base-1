// Analytics response types
export interface CommitteeAnalytics {
  totalReceipts: number;
  totalMarketFees: number;
  totalTraders: number;
  recentReceipts: any[];
  monthlyStats: {
    month: string;
    receipts: number;
    fees: number;
  }[];
}

export interface DistrictAnalytics {
  totalCommittees: number;
  totalReceipts: number;
  totalMarketFees: number;
  averageMarketFees: number;
  committeeStats: {
    committeeName: string;
    receipts: number;
    fees: number;
  }[];
}
