import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';
import PDFDocument from 'pdfkit';

// @desc    Download a single receipt as a PDF
// @route   GET /api/receipts/download/:id
// @access  Private

export const downloadReceipt = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    const user = req.user;

    // 1. Fetch receipt data
    const receipt = await prisma.receipt.findUnique({
      where: {id},
      include: {
        Commodity: true,
        committee: true,
      },
    });

    if (!receipt) {
      return res.status(404).json({message: 'Receipt not found'});
    }

    // Security Check
    // @ts-ignore
    if (user?.role !== 'ad' && receipt.committeeId !== user?.committee.id) {
      return res
        .status(403)
        .json({message: 'Forbidden: You do not have access to this receipt'});
    }

    // 2. Generate a PDF with 'pdfkit'
    const doc = new PDFDocument({size: 'A4', margin: 50});

    // Set response headers
    const filename = `receipt-${receipt.receiptNumber || id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // --- PDF Content Generation ---
    let currentY = 50; // Start position

    // Header
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Agricultural Market Committee', 50, currentY, {align: 'center'});
    currentY += 25;

    doc
      .fontSize(16)
      .font('Helvetica')
      .text(receipt.committee.name, 50, currentY, {align: 'center'});
    currentY += 30;

    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Market Fee Receipt', 50, currentY, {align: 'center'});
    currentY += 30;

    // Improved drawRow function that uses controlled positioning
    const drawRow = (label: string, value: string) => {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(label, 50, currentY, {width: 150});
      doc.font('Helvetica').text(value, 200, currentY, {width: 350});
      currentY += 20; // Fixed spacing between rows
    };

    // Receipt Details
    drawRow('Receipt Number:', receipt.receiptNumber);
    drawRow('Book Number:', receipt.bookNumber);
    drawRow(
      'Receipt Date:',
      new Date(receipt.receiptDate).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );
    currentY += 10; // Add small space

    // Divider Line
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, currentY)
      .lineTo(550, currentY)
      .stroke();
    currentY += 15;

    // Parties Involved
    drawRow('Trader Name:', receipt.traderName);
    drawRow('Payee Name:', receipt.payeeName);
    currentY += 10; // Add small space

    // Transaction Details
    drawRow(
      'Value (INR):',
      `₹ ${new Intl.NumberFormat('en-IN').format(receipt.value.toNumber())}`
    );
    drawRow('Nature of Receipt:', receipt.natureOfReceipt);
    drawRow('Commodity:', receipt.Commodity?.name || 'N/A');
    drawRow(
      'Quantity:',
      new Intl.NumberFormat('en-IN').format(receipt.quantity.toNumber())
    );
    drawRow('Vehicle Number:', receipt.vehicleNumber || 'N/A');

    // Add some space before signatures
    currentY += 30;

    // Divider line before signatures
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, currentY)
      .lineTo(550, currentY)
      .stroke();
    currentY += 20;

    // Signatures
    doc.fontSize(10);
    doc.text('Payee Signature:', 50, currentY);
    doc.text('___________________', 50, currentY + 20);

    doc.text('Authorized Signature:', 350, currentY);
    doc
      .font('Helvetica-Bold')
      .text(receipt.receiptSignedBy, 350, currentY + 20);
    doc.font('Helvetica').text('___________________', 350, currentY + 20);

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('PDF generation failed:', error);
    handlePrismaError(res, error);
  }
};
