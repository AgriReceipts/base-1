// lib/schemas.ts
import {z} from 'zod';

export const setTargetSchema = z.object({
  year: z.number().min(2020).max(2050),
  month: z.number().min(1).max(12),
  committeeId: z.string().min(1, 'Committee ID is required'),

  //  Correctly handle optional and null values
  checkpostId: z.string().optional().nullable(),

  marketFeeTarget: z.number().min(0),
  totalValueTarget: z.number().optional().nullable(),
  setBy: z.string().min(1, "Setter's ID is required"),
  approvedBy: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  commodityId: z.string().optional().nullable(),
});

export const getTargetsSchema = z.object({
  year: z.coerce.number().min(2020).max(2050),
  committeeId: z.string().optional(),
  checkPostId: z.string().optional(),
});

export type SetTargetData = z.infer<typeof setTargetSchema>;
export type GetTargetsData = z.infer<typeof getTargetsSchema>;
