export interface Committee {
  id: string;
  name: string;
  checkposts: Checkpost[];
}

type Checkpost = {
  id: string;
  name: string;
};

export enum TargetType {
  OVERALL_COMMITTEE = 'OVERALL_COMMITTEE', // The total target for the entire committee
  COMMITTEE_OFFICE = 'COMMITTEE_OFFICE', // The sub-target for office-based supervisors
  CHECKPOST = 'CHECKPOST', // The sub-target for a specific checkpost
}

export const TargetTypeName = {
  [TargetType.OVERALL_COMMITTEE]: 'Overall Committee',
  [TargetType.COMMITTEE_OFFICE]: 'Super Visor',
  [TargetType.CHECKPOST]: 'Checkpost',
};
export interface Target {
  id: string;
  year: number;
  month: number;
  type: TargetType;
  committeeId: string;
  checkpostId?: string;
  marketFeeTarget: number;
  totalValueTarget?: number;
  setBy: string;
  approvedBy?: string;
  updatedAt?: string;
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
}
