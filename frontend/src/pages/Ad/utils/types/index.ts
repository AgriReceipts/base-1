export interface Receipt {
  id: string;
  bookNumber: string;
  receiptNumber: string;
  date: string;
  traderName: string;
  payeeName: string;
  commodity: string;
  transactionValue: number;
  marketFee: number;
  natureOfReceipt: 'mf' | 'others';
  natureOfReceiptOther?: string;
  collectionLocation: 'office' | 'checkpost' | 'supervisor';
  collectionLocationOther?: string;
  checkpostName?: string;
  supervisorName?: string;
  committeeId: string;
  financialYear: '2024-25' | '2025-26';
  createdAt: string;
}

export interface Committee {
  id: string;
  name: string;
  code: string;
  hasCheckposts: boolean;
  checkposts: string[];
}

export interface Target {
  id: string;
  committeeId: string;
  financialYear: '2024-25' | '2025-26';
  yearlyTarget: number;
  monthlyTargets: {
    [month: string]: number;
  };
  checkpostTargets?: {
    [checkpost: string]: {
      [month: string]: number;
    };
  };
}

export interface MarketFeeData {
  committeeId: string;
  committeeName: string;
  target2024: number;
  collected2024: number;
  target2025: number;
  collected2025: number;
  difference: number;
  percentage: number;
}

// Explicitly export Committee for module resolution
