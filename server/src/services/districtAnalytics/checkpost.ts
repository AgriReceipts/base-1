import {PrismaClient, Prisma} from '@prisma/client';
import prisma from '../../utils/database';
// NOTE: The getFinancialYearRange helper is no longer used in this function.

export const topCheckposts = async ({
  fyStart,
  month,
}: {
  fyStart: number;
  month?: number;
}) => {
  let dateFilter: {gte: Date; lte: Date};

  // 1. DETERMINE DATE RANGE
  if (month) {
    // Logic for a single month (remains correct)
    const targetYear = month >= 4 ? fyStart : fyStart + 1;
    const startDate = new Date(targetYear, month - 1, 1);
    const endDate = new Date(targetYear, month, 0, 23, 59, 59); // End of the last day of the month
    dateFilter = {gte: startDate, lte: endDate};
  } else {
    // --- THIS IS THE CORRECTED LOGIC FOR THE FINANCIAL YEAR ---
    // A financial year (e.g., 2024) runs from April 1, 2024 to March 31, 2025.
    const startDate = new Date(fyStart, 3, 1); // April 1st of the starting year
    const endDate = new Date(fyStart + 1, 3, 0, 23, 59, 59); // End of March 31st of the next year
    dateFilter = {gte: startDate, lte: endDate};
  }

  // 2. AGGREGATE DATA IN THE DATABASE
  const aggregatedData = await prisma.receipt.groupBy({
    by: ['checkpostId'],
    where: {
      receiptDate: dateFilter, // Apply the correct date filter here
      checkpostId: {not: null},
      feesPaid: {gt: 0},
    },
    _sum: {
      feesPaid: true,
    },
    orderBy: {
      _sum: {
        feesPaid: 'desc',
      },
    },
  });

  if (aggregatedData.length === 0) {
    return [];
  }

  // 3. FETCH CHECKPOST NAMES
  const checkpostIds = aggregatedData
    .map((item) => item.checkpostId)
    .filter((id): id is string => id !== null);

  const checkposts = await prisma.checkpost.findMany({
    where: {id: {in: checkpostIds}},
    select: {id: true, name: true},
  });

  const checkpostNameMap = new Map(checkposts.map((cp) => [cp.id, cp.name]));

  // 4. COMBINE AND FORMAT THE FINAL RESULT
  const result = aggregatedData.map((item) => ({
    name: checkpostNameMap.get(item.checkpostId!) || 'Unknown Checkpost',
    totalFees: Number(item._sum.feesPaid || 0),
  }));

  return result;
};
