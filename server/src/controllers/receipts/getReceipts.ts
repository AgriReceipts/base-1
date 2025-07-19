import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {Prisma} from '@prisma/client';
import {ReceiptQueryParams} from '../../types/receipt';
import {handlePrismaError} from '../../utils/helpers';

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
    where.cancelled = false;
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
          feesPaid: true,
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
// @route   GET /api/receipts/getReceipt/:id?view=[summary|edit]
// @access  Private
export const getReceiptById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    // Get the 'view' parameter from the query string (e.g., /?view=edit)
    const {view} = req.query;

    if (!id) {
      return res.status(404).json({message: 'Receipt Id required'});
    }

    // Define a concise select object for viewing/summary
    const summarySelect = {
      receiptNumber: true,
      bookNumber: true,
      receiptDate: true,
      payeeName: true,
      value: true,
      feesPaid: true,
      natureOfReceipt: true,
      quantity: true,
      unit: true,
      vehicleNumber: true,
      receiptSignedBy: true,
      generatedBy: true,
      trader: {select: {name: true}},
      commodity: {select: {name: true}},
      checkpost: {select: {name: true}},
      committee: {select: {name: true}},
    };

    // Define the detailed select object for editing
    const editSelect = {
      id: true,
      receiptDate: true,
      bookNumber: true,
      receiptNumber: true,
      payeeName: true,
      payeeAddress: true,
      quantity: true,
      unit: true,
      weightPerBag: true,
      natureOfReceipt: true,
      natureOtherText: true,
      value: true,
      feesPaid: true,
      vehicleNumber: true,
      invoiceNumber: true,
      collectionLocation: true,
      officeSupervisor: true,
      collectionOtherText: true,
      receiptSignedBy: true,
      designation: true,
      traderId: true,
      commodityId: true,
      checkpostId: true,
      committeeId: true,
      trader: {select: {name: true, address: true}},
      commodity: {select: {name: true}},
      checkpost: {select: {name: true}},
      committee: {select: {name: true}},
      generatedBy: true,
    };

    // Choose the select object based on the 'view' parameter
    // Defaults to 'summarySelect' if view is not 'edit'
    const select = view === 'edit' ? editSelect : summarySelect;

    const receipt = await prisma.receipt.findUnique({
      where: {id, cancelled: false},
      select, // Use the dynamically chosen select object
    });

    if (!receipt) {
      return res.status(404).json({message: 'Receipt not found'});
    }

    res.status(200).json({data: receipt});
  } catch (error) {
    handlePrismaError(res, error);
  }
};
