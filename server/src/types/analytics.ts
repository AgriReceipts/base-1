import {Prisma} from '@prisma/client';
import {NatureOfReceipt, CollectionLocation} from '@prisma/client';

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

export interface AnalyticsInput {
  committeeId: string;
  traderId: string;
  commodityId: string; // Commodity can be optional
  receiptDate: Date;
  value: number; // or Decimal
  feesPaid: number; // or Decimal
  totalWeightKg: number; // or Decimal
  natureOfReceipt: NatureOfReceipt;
  collectionLocation: CollectionLocation;
  checkpostId: string | null; // Can be null if not a checkpost receipt
}
