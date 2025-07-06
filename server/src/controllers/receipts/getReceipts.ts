import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {Prisma} from '@prisma/client';
import {ReceiptQueryParams} from '../../types/receipt';
import {handlePrismaError} from '../../utils/helpers';

// @desc    Get a single receipt by receiptNumber
// @route   GET /api/receipts/getReceiptByRn/:receiptNumber
// @access  Private
export const getReceiptByReceiptNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const receiptNumber = req.params.receiptNumber;
    const receipt = await prisma.receipt.findMany({
      where: {receiptNumber},
    });

    if (!receipt) {
      return res.status(404).json({message: 'Receipt not found'});
    }

    res.status(200).json(receipt);
  } catch (error) {
    console.error('Error fetching receipt by Receipt Number:', error);
    res.status(500).json({message: 'Server error'});
  }
};
// @desc    Get all receipts with filtering, pagination, and role-based access
// @route   GET /api/receipts/getAllReceipts
// @access  Private
export const getAllReceipts = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      natureOfReceipt,
      committeeId,
      startDate,
      endDate,
    }: ReceiptQueryParams = req.query;

    // @ts-ignore - Assuming user object is attached by auth middleware
    const user = req.user; // e.g., { id: '...', role: 'deo', committee: { id: '...' } }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // 1. Build the dynamic 'where' clause for Prisma
    const where: Prisma.ReceiptWhereInput = {};

    // 2. Role-Based Access Control (RBAC)
    if (user?.role !== 'ad') {
      // If user is not an Admin, restrict to their own committee
      where.committeeId = user?.committee.id;
    } else if (committeeId) {
      // If user is an Admin and a committeeId filter is provided, use it
      where.committeeId = committeeId;
    }
    // If user is 'ad' and no committeeId is provided, they see all committees.

    // 3. Add other filters to the 'where' clause
    if (search) {
      where.OR = [
        {receiptNumber: {contains: search, mode: 'insensitive'}},
        {bookNumber: {contains: search, mode: 'insensitive'}},
      ];
    }

    if (natureOfReceipt) {
      where.natureOfReceipt = natureOfReceipt;
    }

    if (startDate || endDate) {
      where.receiptDate = {};
      if (startDate) {
        where.receiptDate.gte = new Date(startDate);
      }
      if (endDate) {
        // Add 1 day to the end date to include the whole day
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1);
        where.receiptDate.lt = endOfDay;
      }
    }

    // 4. Fetch receipts and total count concurrently
    const [receipts, totalReceipts] = await prisma.$transaction([
      prisma.receipt.findMany({
        skip,
        take: limitNum,
        where,
        // Select only the necessary fields to keep the response lean
        select: {
          id: true,
          receiptNumber: true,
          bookNumber: true,
          trader: {
            select: {
              name: true,
            },
          },
          payeeName: true,
          value: true,
          natureOfReceipt: true,
          receiptSignedBy: true, // Renamed from signedBy for clarity
          receiptDate: true,
          committee: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          receiptDate: 'desc',
        },
      }),
      prisma.receipt.count({where}),
    ]);

    res.status(200).json({
      data: receipts,
      pagination: {
        total: totalReceipts,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalReceipts / limitNum),
      },
    });
  } catch (error) {
    // Make sure to have a proper error handler
    handlePrismaError(res, error);
  }
};

// @desc    Get a single receipt by its ID
// @route   GET /api/receipts/getReceipt/:id
// @access  Private
export const getReceiptById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(404).json({message: 'Receipt Id required'});
    }

    const receipt = await prisma.receipt.findUnique({
      where: {id},
      select: {
        receiptNumber: true,
        bookNumber: true,
        receiptDate: true,
        payeeName: true,
        value: true,
        natureOfReceipt: true,
        quantity: true,
        unit: true,
        vehicleNumber: true,
        receiptSignedBy: true,
        committeeId: true,
        commodity: {
          select: {
            name: true,
          },
        },
        checkpost: {
          select: {
            name: true,
          },
        },
        committee: {
          select: {
            name: true,
          },
        },
        trader: {
          select: {
            name: true,
          },
        },
        generatedBy: true,
      },
    });

    if (!receipt) {
      return res.status(404).json({message: 'Receipt not found'});
    }

    res.status(200).json({data: receipt});
  } catch (error) {
    handlePrismaError(res, error);
  }
};
