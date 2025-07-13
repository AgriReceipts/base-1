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
  // CHANGED: Also destructure committeeId from the query
  const {year, committeeId} = req.query;

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
    // ADDED: Create a dynamic query options object for committees
    const committeeQueryOptions: {
      include: {
        checkposts: {
          orderBy: {name: 'asc'};
        };
      };
      orderBy: {name: 'asc'};
      where?: {id: string};
    } = {
      include: {
        checkposts: {
          orderBy: {name: 'asc'},
        },
      },
      orderBy: {
        name: 'asc',
      },
    };

    // ADDED: If a committeeId is provided, add a 'where' clause to the query
    if (committeeId && typeof committeeId === 'string') {
      committeeQueryOptions.where = {
        id: committeeId,
      };
    }

    // 1. Fetch structural data: All committees or a specific one.
    const committees = await prisma.committee.findMany(committeeQueryOptions);

    // ADDED: If a committeeId was specified but not found, return a 404 error.
    if (committeeId && committees.length === 0) {
      return res.status(404).json({message: 'Committee not found'});
    }

    const committeeIds = committees.map((c) => c.id);

    // 2. Fetch all relevant financial reports for the year.
    // This part requires no changes, as it correctly uses the 'committeeIds' array,
    // which will contain either all IDs or just the one requested.
    const reports = await prisma.monthlyReport.findMany({
      where: {
        committeeId: {in: committeeIds},
        reportLevel: {in: [ReportLevel.committee, ReportLevel.checkpost]},
        OR: [
          {year: financialYearStart, month: {gte: 4}},
          {year: financialYearEnd, month: {lte: 3}},
        ],
      },
    });

    // 3. Process reports into maps. No changes needed here.
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

    // 4. Create Excel workbook and worksheet. The rest of the Excel generation
    // logic will now work correctly with the filtered 'committees' array.
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('District Report');

    // ... (The entire Excel generation code from your original snippet remains IDENTICAL from here)
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
    // (This section remains unchanged)
    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'STATEMENT NO.1';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 14};
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

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

    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = '(Amount in Lakhs)';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 10};
    currentRow++;

    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value =
      'Name of the District : KAKINADA';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 11};
    currentRow++;

    currentRow++;

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
    headerRow.eachCell((cell) => {
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'},
      };
    });
    currentRow++;

    const monthlyTotals = Array(12).fill(0);
    committees.forEach((committee, index) => {
      const monthlyData = getMonthlyDataRow(committeeFees[committee.id]);
      const rowData = [index + 1, committee.name, ...monthlyData];
      worksheet.addRow(rowData);
      const dataRow = worksheet.getRow(currentRow);
      dataRow.alignment = {horizontal: 'center', vertical: 'middle'};
      dataRow.eachCell((cell) => {
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'},
        };
      });
      for (let i = 3; i <= 14; i++) {
        const cell = dataRow.getCell(i);
        if (cell.value && cell.value !== '') {
          cell.numFmt = '0.00';
          monthlyTotals[i - 3] += parseFloat(cell.value.toString());
        }
      }
      currentRow++;
    });

    const totalRowData = ['Total', '', ...monthlyTotals.map((total) => total)];
    worksheet.addRow(totalRowData);
    const totalRow = worksheet.getRow(currentRow);
    totalRow.font = {bold: true};
    totalRow.alignment = {horizontal: 'center', vertical: 'middle'};
    totalRow.eachCell((cell) => {
      cell.border = {
        top: {style: 'thick'},
        left: {style: 'thin'},
        bottom: {style: 'thick'},
        right: {style: 'thin'},
      };
    });
    for (let i = 3; i <= 14; i++) {
      const cell = totalRow.getCell(i);
      if (cell.value !== '') {
        cell.numFmt = '0.00';
      }
    }
    currentRow++;
    currentRow += 3;

    // --- STATEMENT NO.2: Checkpost Report ---
    // (This section remains unchanged)
    worksheet.mergeCells(`A${currentRow}:O${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'STATEMENT NO.2';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 14};
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

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

    worksheet.mergeCells(`A${currentRow}:O${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = '(Amount in Lakhs)';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 10};
    currentRow++;

    worksheet.mergeCells(`A${currentRow}:O${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value =
      'Name of the District : KAKINADA';
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${currentRow}`).font = {bold: true, size: 11};
    currentRow++;

    currentRow++;

    worksheet.getColumn(15).width = 12;

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
    headerRow2.eachCell((cell) => {
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'},
      };
    });
    currentRow++;

    committees.forEach((committee, index) => {
      if (committee.checkposts && committee.checkposts.length > 0) {
        committee.checkposts.forEach((checkpost, cpIndex) => {
          const monthlyData = getMonthlyDataRow(checkpostFees[checkpost.id]);
          let rowData;
          if (cpIndex === 0) {
            rowData = [
              index + 1,
              committee.name,
              checkpost.name,
              ...monthlyData,
            ];
          } else {
            rowData = ['', '', checkpost.name, ...monthlyData];
          }
          worksheet.addRow(rowData);
          const dataRow = worksheet.getRow(currentRow);
          dataRow.alignment = {horizontal: 'center', vertical: 'middle'};
          dataRow.eachCell((cell) => {
            cell.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'},
            };
          });
          for (let i = 4; i <= 15; i++) {
            const cell = dataRow.getCell(i);
            if (cell.value && cell.value !== '') {
              cell.numFmt = '0.00';
            }
          }
          currentRow++;
        });
      } else {
        const rowData = [
          index + 1,
          committee.name,
          'No checkposts',
          ...Array(12).fill(''),
        ];
        worksheet.addRow(rowData);
        const dataRow = worksheet.getRow(currentRow);
        dataRow.alignment = {horizontal: 'center', vertical: 'middle'};
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

    // ADDED: Dynamic filename based on whether it's a district or committee report
    const committeeName =
      committees.length === 1
        ? committees[0].name.replace(/\s+/g, '-')
        : 'District';
    const fileName = `MarketFee-Report-${committeeName}-${year}.xlsx`;

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating district report:', error);
    return handlePrismaError(res, error);
  }
};
