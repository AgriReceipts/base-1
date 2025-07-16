import { Request, Response } from "express";
import prisma from "../../utils/database";
import { handlePrismaError } from "../../utils/helpers";

export const getOverviewData = async (req: Request, res: Response) => {
  try {
    const committeeId = req.query.committeeId;

    if (!committeeId) {
      res.status(401).json({
        message: "CommitteeId is required",
      });
      const data = await prisma.committeeMonthlyAnalytics.findUnique({
        where: {
          id: committeeId,
        },
        select: {
          marketFees: true,
          totalFeesPaid: true,
          marketFeeTarget: true,
          checkpostMarketFees: true,
          superVisorMarketFees: true,
          uniqueCommodities: true,
          uniqueTraders: true,
          totalReceipts: true,
        },
      });
      return res.status(200).json(data);
    }
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
