import { Request, Response } from "express";
import prisma from "../../utils/database";
import { handlePrismaError } from "../../utils/helpers";
import { TargetType } from "@prisma/client";
export const getOverviewData = async (req: Request, res: Response) => {
  try {
    const { committeeId } = req.params;

    if (!committeeId) {
      return res.status(400).json({
        message: "CommitteeId is required",
      });
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const data = await prisma.committeeMonthlyAnalytics.aggregate({
      where: {
        committeeId,
        year,
        month,
      },
      _sum: {
        marketFees: true,
        marketFeeTarget: true,
        checkpostMarketFees: true,
        officeFees: true,
        totalReceipts: true,
        uniqueCommodities: true,
        uniqueTraders: true,
      },
    });

    if (!data._sum || Object.values(data._sum).every((v) => v === null)) {
      return res.status(404).json({
        message: "No analytics data found for this committee and month",
      });
    }
    const superVisorTarget = await prisma.target.findFirst({
      where: {
        committeeId,
        year,
        month,
        type: TargetType.COMMITTEE_OFFICE,
      },
      select: {
        marketFeeTarget: true,
      },
    });
    const checkPostTarget = await prisma.target.aggregate({
      where: {
        committeeId,
        year,
        month,
        type: TargetType.CHECKPOST,
      },
      _sum: {
        marketFeeTarget: true,
      },
    });

    return res
      .status(200)
      .json({
        ...data._sum,
        superVisorTarget: superVisorTarget?.marketFeeTarget ?? 0,
        checkPostTarget: checkPostTarget._sum.marketFeeTarget ?? 0,
      });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
