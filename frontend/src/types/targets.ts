export interface Committee {
  id: string;
  name: string;
  code: string;
  hasCheckposts: boolean;
  checkposts: string[];
}

export interface Target {
  id?: string;
  year: number;
  month: number;
  committeeId: string;
  checkpostId?: string;
  marketFeeTarget: number;
  totalValueTarget?: number;
  setBy: string;
  approvedBy?: string;
  notes?: string;
  commodityId?: string;
  isActive?: boolean;
  committee?: {
    id: string;
    name: string;
  };
  checkpost?: {
    id: string;
    name: string;
  } | null;
}

export interface MonthlyTarget {
  month: number;
  marketFeeTarget: number;
  totalValueTarget: number;
}
