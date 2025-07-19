import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';
import PDFDocument from 'pdfkit';

// Helper function to convert number to words (Indian format)
const numberToWords = (num: number): string => {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const convertHundreds = (n: number): string => {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result.trim();
  };

  if (num === 0) return 'Zero';

  let result = '';
  let crores = Math.floor(num / 10000000);
  num %= 10000000;
  let lakhs = Math.floor(num / 100000);
  num %= 100000;
  let thousands = Math.floor(num / 1000);
  num %= 1000;
  let hundreds = num;

  if (crores > 0) {
    result += convertHundreds(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    result += convertHundreds(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    result += convertHundreds(thousands) + ' Thousand ';
  }
  if (hundreds > 0) {
    result += convertHundreds(hundreds);
  }

  return result.trim();
};

// @desc    Download a single receipt as a PDF
// @route   GET /api/receipts/download/:id
// @access  Private

export const downloadReceipt = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const user = req.user;

    // 1. Fetch receipt data with all relations
    const receipt = await prisma.receipt.findUnique({
      where: {id},
      include: {
        commodity: true,
        committee: true,
        trader: true,
        checkpost: true,
        user: true,
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
    // Helper function to get receipt title based on nature
    const getReceiptTitle = (nature: string): string => {
      switch (nature) {
        case 'MF':
          return 'Market Fee Receipt';
        case 'LC':
          return 'License Charge Receipt';
        case 'UC':
          return 'User Charge Receipt';
        default:
          return 'Receipt';
      }
    };
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
      .text(getReceiptTitle(receipt.natureOfReceipt), 50, currentY, {
        align: 'center',
      });
    currentY += 25;

    // Improved drawRow function
    const drawRow = (label: string, value: string) => {
      doc

        .fontSize(11)
        .font('Helvetica')
        .text(label, 50, currentY, {width: 150});
      doc.font('Helvetica').text(value, 200, currentY, {width: 350});
      currentY += 16;
    };

    // Function to draw two columns in one row
    const drawDoubleRow = (
      label1: string,
      value1: string,
      label2: string,
      value2: string
    ) => {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(label1, 50, currentY, {width: 100});
      doc.font('Helvetica').text(value1, 150, currentY, {width: 150});
      doc.font('Helvetica-Bold').text(label2, 300, currentY, {width: 100});
      doc.font('Helvetica').text(value2, 400, currentY, {width: 150});
      currentY += 16;
    };

    // Helper function to add section separator
    const addSectionSeparator = () => {
      currentY += 8;
      doc
        .strokeColor('#cccccc')
        .lineWidth(0.5)
        .moveTo(50, currentY)
        .lineTo(550, currentY)
        .stroke();
      currentY += 8;
    };

    // Helper function to format currency with words
    const formatCurrency = (amount: number): string => {
      const formattedNumber = new Intl.NumberFormat('en-IN').format(
        Math.floor(amount)
      );
      const amountInWords = numberToWords(Math.floor(amount));

      return `Rs. ${formattedNumber} (${amountInWords} Rupees Only)`;
    };

    // Helper function to format dates
    const formatDate = (date: Date): string => {
      return new Date(date)
        .toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        .trim();
    };

    // Receipt Basic Details - Date, Book Number and Receipt Number in same row
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('Receipt Date:', 50, currentY, {width: 100});
    doc
      .font('Helvetica')
      .text(formatDate(receipt.receiptDate), 150, currentY, {width: 350});
    currentY += 16;

    drawDoubleRow(
      'Book Number:',
      receipt.bookNumber || 'N/A',
      'Receipt Number:',
      receipt.receiptNumber || 'N/A'
    );

    addSectionSeparator();

    // Trader Information
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Payee Information', 50, currentY);
    currentY += 25;

    drawRow('Payee Name:', receipt.trader?.name || 'N/A');

    drawRow('Address:', receipt.trader?.address || 'N/A');

    addSectionSeparator();

    // Payee Information
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Farmer/Trader Information', 50, currentY);
    currentY += 25;

    drawRow('Name:', receipt.payeeName || 'N/A');
    drawRow('Address:', receipt.payeeAddress || 'N/A');

    addSectionSeparator();

    // Commodity Details
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Commodity Details', 50, currentY);
    currentY += 25;

    drawRow('Commodity:', receipt.commodity?.name || 'N/A');
    drawRow(
      'Quantity:',
      `${new Intl.NumberFormat('en-IN').format(receipt.quantity.toNumber())} ${
        receipt.unit
      }`
    );
    drawRow(
      'Weight per Bag:',
      receipt.weightPerBag ? `${receipt.weightPerBag.toNumber()} kg` : 'N/A'
    );
    drawRow(
      'Total Weight:',
      receipt.totalWeightKg ? `${receipt.totalWeightKg.toNumber()} kg` : 'N/A'
    );

    addSectionSeparator();

    // Transaction Details
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Transaction Details', 50, currentY);
    currentY += 25;

    drawRow('Nature of Receipt:', receipt.natureOfReceipt || 'N/A');
    currentY += 8;
    // Value and fees with words - more compact
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('Transaction Value:', 50, currentY);
    currentY += 20;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(formatCurrency(receipt.value.toNumber()), 50, currentY, {
        width: 500,
      });
    currentY += 16;

    doc.fontSize(11).font('Helvetica-Bold').text('Fees Paid:', 50, currentY);
    currentY += 20;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(formatCurrency(receipt.feesPaid.toNumber()), 50, currentY, {
        width: 500,
      });
    currentY += 16;

    addSectionSeparator();

    // Additional Details
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Additional Details', 50, currentY);
    currentY += 25;

    drawRow('Vehicle Number:', receipt.vehicleNumber || 'N/A');
    drawRow('WayBill Number:', receipt.invoiceNumber || 'N/A');

    addSectionSeparator();

    // Collection Details
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Collection Details', 50, currentY);
    currentY += 25;

    drawRow('Collection Location:', receipt.collectionLocation || 'N/A');
    drawRow('Collection Details:', receipt.collectionOtherText || 'N/A');
    drawRow('Checkpost:', receipt.checkpost?.name || 'N/A');
    drawRow('Office Supervisor:', receipt.officeSupervisor || 'N/A');

    // Add space before signature
    currentY += 25;

    // Signature - only signed by on the right
    doc.fontSize(10).font('Helvetica').text('Signed By:', 400, currentY);
    doc
      .font('Helvetica-Bold')
      .text(receipt.receiptSignedBy, 400, currentY + 15);
    doc.font('Helvetica').text('_________________________', 400, currentY + 20);

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('PDF generation failed:', error);
    handlePrismaError(res, error);
  }
};
