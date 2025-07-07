// lib/schemas.ts
import {z} from 'zod';

export const targetFormSchema = z.object({
  financialYear: z.string().min(1, 'Financial year is required'),
  committeeId: z.string().min(1, 'Committee is required'),
  marketFeeTarget: z.number().min(0, 'Market fee target must be positive'),
  notes: z.string().optional(),
  monthlyTargets: z.array(
    z.object({
      month: z.number().min(1).max(12),
      monthName: z.string(),
      checkpostTargets: z.array(
        z.object({
          checkpostId: z.string().optional(),
          checkpostName: z.string(),
          marketFeeTarget: z.number().min(0, 'Target must be positive'),
          isEditable: z.boolean(),
        })
      ),
    })
  ),
});

export const setTargetSchema = z.object({
  year: z.number().min(2020).max(2050),
  month: z.number().min(1).max(12),
  committeeId: z.string().min(1),
  checkpostId: z.string().optional(),
  marketFeeTarget: z.number().min(0),
  totalValueTarget: z.number().optional(),
  setBy: z.string().min(1),
  approvedBy: z.string().optional(),
  notes: z.string().optional(),
  commodityId: z.string().optional(),
});

export const getTargetsSchema = z.object({
  year: z.number().min(2020).max(2050),
  committeeId: z.string().optional(),
});

export type TargetFormData = z.infer<typeof targetFormSchema>;
export type SetTargetData = z.infer<typeof setTargetSchema>;
export type GetTargetsData = z.infer<typeof getTargetsSchema>;
