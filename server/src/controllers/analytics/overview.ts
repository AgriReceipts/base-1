import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

export const getOverviewData = async (req: Request, res: Response) => {
  try {
    const {committeeId} = req.params;

    if (!committeeId) {
      return res.status(400).json({
        message: 'CommitteeId is required',
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
        message: 'No analytics data found for this committee and month',
      });
    }

    return res.status(200).json(data._sum);
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
