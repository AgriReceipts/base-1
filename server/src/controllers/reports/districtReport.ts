import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';
import {ReportLevel} from '@prisma/client';
import * as ExcelJS from 'exceljs';

/**
 * Converts rupees to lakhs with 2 decimal places
 * @param amount - Amount in rupees
 * @returns Formatted amount in lakhs with 2 decimal places
 */
const toLakhs = (amount: number): number => {
  return amount / 100000; // 1 lakh = 100,000 rupees
};

export const generateDistrictReport = async (req: Request, res: Response) => {
  const {year} = req.query; // Expecting year in "YYYY-YYYY" format, e.g., "2024-2025"

  // Validate the financial year format.
  if (!year || typeof year !== 'string' || !/^\d{4}-\d{4}$/.test(year)) {
    return res
      .status(400)
      .json({message: 'Financial year in "YYYY-YYYY" format is required'});
  }

  const [startYearStr, endYearStr] = year.split('-');
  const financialYearStart = parseInt(startYearStr);
  const financialYearEnd = parseInt(endYearStr);

  if (financialYearEnd !== financialYearStart + 1) {
    return res.status(400).json({message: 'Invalid financial year range.'});
  }

  try {
    // 1. Fetch all structural data: Committees and their associated Checkposts.
    const committees = await prisma.committee.findMany({
      include: {
        checkposts: {
          orderBy: {name: 'asc'},
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const committeeIds = committees.map((c) => c.id);

    // 2. Fetch all relevant financial reports for the year in a single efficient query.
    const reports = await prisma.monthlyReport.findMany({
      where: {
        committeeId: {in: committeeIds},
        reportLevel: {in: [ReportLevel.committee, ReportLevel.checkpost]},
        // The financial year runs from April (month 4) to March (month 3).
        OR: [
          {year: financialYearStart, month: {gte: 4}},
          {year: financialYearEnd, month: {lte: 3}},
        ],
      },
    });

    // 3. Process reports into easy-to-access maps for quick lookups.
    const committeeFees: {[committeeId: string]: {[month: number]: number}} =
      {};
    const checkpostFees: {[checkpostId: string]: {[month: number]: number}} =
      {};

    for (const report of reports) {
      if (report.reportLevel === ReportLevel.committee && report.committeeId) {
        if (!committeeFees[report.committeeId])
          committeeFees[report.committeeId] = {};
        committeeFees[report.committeeId][report.month] =
          report.monthlyAchievement.toNumber();
      } else if (
        report.reportLevel === ReportLevel.checkpost &&
        report.checkpostId
      ) {
        if (!checkpostFees[report.checkpostId])
          checkpostFees[report.checkpostId] = {};
        checkpostFees[report.checkpostId][report.month] =
          report.monthlyAchievement.toNumber();
      }
    }

    // 4. Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('District Report');

    // Set column widths
    worksheet.columns = [
      {width: 8}, // Sl.No
      {width: 20}, // Name of AMC
      {width: 12}, // April
      {width: 12}, // May
      {width: 12}, // June
      {width: 12}, // July
      {width: 12}, // August
      {width: 12}, // September
      {width: 12}, // October
      {width: 12}, // November
      {width: 12}, // December
      {width: 12}, // January
      {width: 12}, // February
      {width: 12}, // March
    ];

    let currentRow = 1;

    // Helper to create a row of 12 months of financial data for an entity.
    const getMonthlyDataRow = (feesMap: {[month: number]: number} = {}) => {
      const row: (number | string)[] = [];
      for (let i = 0; i < 12; i++) {
        // Financial month order: 4, 5, ..., 12, 1, 2, 3
        const monthIndex = ((i + 3) % 12) + 1;
        const amount = feesMap[monthIndex];
        row.push(amount ? toLakhs(amount) : '');
      }
      return row;
    };

    const shortYear = (fullYear: number) => fullYear.toString().slice(-2);

    // --- STATEMENT NO.1: AMC/Committee Report ---

    // Title row - merge across all columns (A to N)
    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'STATEMENT NO.1';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 14};
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // Subtitle row
    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    worksheet.getCell(
      `A${currentRow}`
    ).value = `STATEMENT SHOWING THE MARKET FEE INCOME FROM VARIOUS SOURCES IN RESPECT OF AMCs DURING THE YEAR ${financialYearStart}-${financialYearEnd}`;
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 12};
    worksheet.getRow(currentRow).height = 20;
    currentRow++;

    // Amount denomination row
    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = '(Amount in Lakhs)';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 10};
    currentRow++;

    // District name row
    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value =
      'Name of the District : KAKINADA';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 11};
    currentRow++;

    // Blank row
    currentRow++;

    // Headers
    const headers1 = [
      'Sl. No.',
      'Name of the AMC',
      `April-${shortYear(financialYearStart)}`,
      `May-${shortYear(financialYearStart)}`,
      `June-${shortYear(financialYearStart)}`,
      `July-${shortYear(financialYearStart)}`,
      `August-${shortYear(financialYearStart)}`,
      `September-${shortYear(financialYearStart)}`,
      `October-${shortYear(financialYearStart)}`,
      `November-${shortYear(financialYearStart)}`,
      `December-${shortYear(financialYearStart)}`,
      `January-${shortYear(financialYearEnd)}`,
      `February-${shortYear(financialYearEnd)}`,
      `March-${shortYear(financialYearEnd)}`,
    ];

    worksheet.addRow(headers1);
    const headerRow = worksheet.getRow(currentRow);
    headerRow.font = {bold: true};
    headerRow.alignment = {horizontal: 'center', vertical: 'middle'};
    headerRow.height = 20;

    // Add borders to header row
    headerRow.eachCell((cell) => {
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'},
      };
    });
    currentRow++;

    // Calculate totals for each month
    const monthlyTotals = Array(12).fill(0);

    // Add committee data
    committees.forEach((committee, index) => {
      const monthlyData = getMonthlyDataRow(committeeFees[committee.id]);
      const rowData = [index + 1, committee.name, ...monthlyData];
      worksheet.addRow(rowData);

      const dataRow = worksheet.getRow(currentRow);
      dataRow.alignment = {horizontal: 'center', vertical: 'middle'};

      // Add borders to data row
      dataRow.eachCell((cell) => {
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'},
        };
      });

      // Format number cells to show 2 decimal places
      for (let i = 3; i <= 14; i++) {
        const cell = dataRow.getCell(i);
        if (cell.value && cell.value !== '') {
          cell.numFmt = '0.00';
          monthlyTotals[i - 3] += parseFloat(cell.value.toString());
        }
      }

      currentRow++;
    });

    // Add total row
    const totalRowData = ['Total', '', ...monthlyTotals.map((total) => total)];
    worksheet.addRow(totalRowData);
    const totalRow = worksheet.getRow(currentRow);
    totalRow.font = {bold: true};
    totalRow.alignment = {horizontal: 'center', vertical: 'middle'};

    // Add borders and formatting to total row
    totalRow.eachCell((cell) => {
      cell.border = {
        top: {style: 'thick'},
        left: {style: 'thin'},
        bottom: {style: 'thick'},
        right: {style: 'thin'},
      };
    });

    // Format total number cells
    for (let i = 3; i <= 14; i++) {
      const cell = totalRow.getCell(i);
      if (cell.value !== '') {
        cell.numFmt = '0.00';
      }
    }

    currentRow++;

    // Add spacing rows
    currentRow += 3;

    // --- STATEMENT NO.2: Checkpost Report ---

    // Title row
    worksheet.mergeCells(`A${currentRow}:O${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'STATEMENT NO.2';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 14};
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // Subtitle row
    worksheet.mergeCells(`A${currentRow}:O${currentRow}`);
    worksheet.getCell(
      `A${currentRow}`
    ).value = `CHECK POST WISE PROGRESS REPORT ON MARKET FEE COLLECTION FOR THE YEAR ${financialYearStart}-${financialYearEnd}`;
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 12};
    worksheet.getRow(currentRow).height = 20;
    currentRow++;

    // Amount denomination row
    worksheet.mergeCells(`A${currentRow}:O${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = '(Amount in Lakhs)';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 10};
    currentRow++;

    // District name row
    worksheet.mergeCells(`A${currentRow}:O${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value =
      'Name of the District : KAKINADA';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 11};
    currentRow++;

    // Blank row
    currentRow++;

    // Extend columns for statement 2 (add one more column for checkpost name)
    worksheet.getColumn(15).width = 12; // Add 15th column

    // Headers for statement 2
    const headers2 = [
      'Sl.No.',
      'Name of the AMC',
      'Name of Check Post',
      `April-${shortYear(financialYearStart)}`,
      `May-${shortYear(financialYearStart)}`,
      `June-${shortYear(financialYearStart)}`,
      `July-${shortYear(financialYearStart)}`,
      `August-${shortYear(financialYearStart)}`,
      `September-${shortYear(financialYearStart)}`,
      `October-${shortYear(financialYearStart)}`,
      `November-${shortYear(financialYearStart)}`,
      `December-${shortYear(financialYearStart)}`,
      `January-${shortYear(financialYearEnd)}`,
      `February-${shortYear(financialYearEnd)}`,
      `March-${shortYear(financialYearEnd)}`,
    ];

    worksheet.addRow(headers2);
    const headerRow2 = worksheet.getRow(currentRow);
    headerRow2.font = {bold: true};
    headerRow2.alignment = {horizontal: 'center', vertical: 'middle'};
    headerRow2.height = 20;

    // Add borders to header row
    headerRow2.eachCell((cell) => {
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'},
      };
    });
    currentRow++;

    // Add checkpost data
    committees.forEach((committee, index) => {
      if (committee.checkposts && committee.checkposts.length > 0) {
        committee.checkposts.forEach((checkpost, cpIndex) => {
          const monthlyData = getMonthlyDataRow(checkpostFees[checkpost.id]);
          let rowData;

          if (cpIndex === 0) {
            // For the first checkpost of a committee, include the Sl.No. and AMC name.
            rowData = [
              index + 1,
              committee.name,
              checkpost.name,
              ...monthlyData,
            ];
          } else {
            // For subsequent checkposts, leave the first two columns blank.
            rowData = ['', '', checkpost.name, ...monthlyData];
          }

          worksheet.addRow(rowData);
          const dataRow = worksheet.getRow(currentRow);
          dataRow.alignment = {horizontal: 'center', vertical: 'middle'};

          // Add borders to data row
          dataRow.eachCell((cell) => {
            cell.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'},
            };
          });

          // Format number cells to show 2 decimal places
          for (let i = 4; i <= 15; i++) {
            const cell = dataRow.getCell(i);
            if (cell.value && cell.value !== '') {
              cell.numFmt = '0.00';
            }
          }

          currentRow++;
        });
      } else {
        // If no checkposts, still show the committee
        const rowData = [
          index + 1,
          committee.name,
          'No checkposts',
          ...Array(12).fill(''),
        ];
        worksheet.addRow(rowData);

        const dataRow = worksheet.getRow(currentRow);
        dataRow.alignment = {horizontal: 'center', vertical: 'middle'};

        // Add borders to data row
        dataRow.eachCell((cell) => {
          cell.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'},
          };
        });

        currentRow++;
      }
    });

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(arrayBuffer); // Convert to Node.js Buffer

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="MarketFee-Report-${year}.xlsx"`
    );
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  } catch (error) {
    console.error('Error generating district report:', error);
    return handlePrismaError(res, error);
  }
};
