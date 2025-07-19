import { Prisma } from "@prisma/client";
import { NatureOfReceipt, CollectionLocation } from "@prisma/client";

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
// Assuming AnalyticsInput is defined in this file or imported correctly
export interface AnalyticsInput {
  committeeId: string;
  traderId: string;
  commodityId: string | null;
  receiptDate: Date;
  value: number; // Using number for simplicity, can be Prisma.Decimal
  feesPaid: number; // Using number for simplicity, can be Prisma.Decimal
  totalWeightKg: number; // Using number for simplicity, can be Prisma.Decimal
  natureOfReceipt: NatureOfReceipt; // e.g., 'mf', 'sf', etc.
  collectionLocation: CollectionLocation; // e.g., 'office', 'checkpost', 'other'
  checkpostId: string | null;
}
