// lib/schemas.ts
import {z} from 'zod';
export enum TargetType {
  OVERALL_COMMITTEE = 'OVERALL_COMMITTEE', // The total target for the entire committee
  COMMITTEE_OFFICE = 'COMMITTEE_OFFICE', // The sub-target for office-based supervisors
  CHECKPOST = 'CHECKPOST', // The sub-target for a specific checkpost
}
export const setTargetSchema = z.object({
  year: z.coerce.number().min(2020).max(2050),
  month: z.coerce.number().min(1).max(12),
  committeeId: z.string().min(1, 'Committee ID is required'),
  checkpostId: z.string().optional().nullable(),
  marketFeeTarget: z.coerce.number().min(0),
  type: z.nativeEnum(TargetType),
  setBy: z.string().min(1, "Setter's ID is required"),
  notes: z.string().optional().nullable(),
});

export const getTargetsSchema = z.object({
  year: z.coerce.number().min(2020).max(2050),
  committeeId: z.string().optional(),
  checkPostId: z.string().optional(),
  type: z.nativeEnum(TargetType),
});

export type SetTargetData = z.infer<typeof setTargetSchema>;
export type GetTargetsData = z.infer<typeof getTargetsSchema>;
