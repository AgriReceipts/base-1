import {
  PrismaClient,
  UserRole,
  Unit,
  NatureOfReceipt,
  CollectionLocation,
  ReportLevel,
} from '@prisma/client';
import pLimit from 'p-limit';
import {faker, ro} from '@faker-js/faker';
import bcrypt from 'bcryptjs';

// Import local data files
import {committeesData} from './data';
import {commoditiesData} from './data';

const prisma = new PrismaClient();
const limit = pLimit(10); // Limit concurrent operations

// Common password for all users
const COMMON_PASSWORD = 'password123';

// Helper function to generate date ranges
const generateDateRange = (start: Date, end: Date, count: number): Date[] => {
  const dates: Date[] = [];
  const timeDiff = end.getTime() - start.getTime();
  const interval = timeDiff / (count - 1);

  for (let i = 0; i < count; i++) {
    const date = new Date(start.getTime() + interval * i);
    // Normalize to start of day
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }

  return dates.sort((a, b) => a.getTime() - b.getTime());
};

// Helper function to get random element from array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to calculate total weight in kg
const calculateTotalWeight = (
  quantity: number,
  unit: Unit,
  weightPerBag?: number
): number => {
  switch (unit) {
    case Unit.kilograms:
      return quantity;
    case Unit.quintals:
      return quantity * 100; // 1 quintal = 100 kg
    case Unit.bags:
      return quantity * (weightPerBag || 50); // Default 50kg per bag
    case Unit.numbers:
      return quantity * 0.5; // Assume 0.5kg per number for calculation
    default:
      return quantity;
  }
};

/**
 * Clear all existing data from the database
 */
async function clearDatabase(): Promise<void> {
  console.log('🧹 Clearing existing data...');

  // Delete in reverse dependency order
  await prisma.monthlyReport.deleteMany();
  await prisma.dailyAnalytics.deleteMany();
  await prisma.commodityAnalytics.deleteMany();
  await prisma.traderAnalytics.deleteMany();
  await prisma.committeeMonthlyAnalytics.deleteMany();
  await prisma.target.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.trader.deleteMany();
  await prisma.commodity.deleteMany();
  await prisma.checkpost.deleteMany();
  await prisma.user.deleteMany();
  await prisma.committee.deleteMany();

  console.log('✅ Database cleared successfully');
}

/**
 * Seed commodities from provided data
 */
async function seedCommodities(): Promise<void> {
  console.log('🌾 Seeding commodities...');

  const commodityPromises = commoditiesData.map((commodity) =>
    limit(() =>
      prisma.commodity.create({
        data: {
          name: commodity.name,
          category: commodity.category,
          subCategory: commodity.subCategory,
          description: commodity.description,
        },
      })
    )
  );

  await Promise.all(commodityPromises);
  console.log(`✅ Created ${commoditiesData.length} commodities`);
}

/**
 * Seed committees and their checkposts
 */
async function seedCommitteesAndCheckposts(): Promise<void> {
  console.log('🏛️ Seeding committees and checkposts...');

  for (const committeeData of committeesData) {
    const committee = await prisma.committee.create({
      data: {
        name: committeeData.name,
      },
    });

    // Create checkposts for this committee
    if (committeeData.checkposts && committeeData.checkposts.length > 0) {
      const checkpostPromises = committeeData.checkposts.map((checkpostName) =>
        limit(() =>
          prisma.checkpost.create({
            data: {
              name: checkpostName,
              committeeId: committee.id,
            },
          })
        )
      );

      await Promise.all(checkpostPromises);
    }
  }

  console.log(
    `✅ Created ${committeesData.length} committees and their checkposts`
  );
}

/**
 * Seed users with proper role distribution
 */
async function seedUsers(): Promise<void> {
  console.log('👥 Seeding users...');

  const hashedPassword = await bcrypt.hash(COMMON_PASSWORD, 10);
  const committees = await prisma.committee.findMany();
  const userPromises: Promise<any>[] = [];

  // Create committee-level users (deo, supervisor, secretary)
  for (const committee of committees) {
    const userCount = faker.number.int({min: 10, max: 15});
    const roles = ['deo', 'supervisor', 'secretary'] as const;

    for (let i = 0; i < userCount; i++) {
      const role = getRandomElement(Array.from(roles));
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      userPromises.push(
        limit(() =>
          prisma.user.create({
            data: {
              username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`,
              passwordHash: hashedPassword,
              name: `${firstName} ${lastName}`,
              role: role,
              committeeId: committee.id,
              designation:
                role === UserRole.deo
                  ? 'Data Entry Operator'
                  : role === UserRole.supervisor
                  ? 'Supervisor'
                  : 'Secretary',
            },
          })
        )
      );
    }
  }

  // Create 3 assistant directors with district-wide access
  for (let i = 0; i < 3; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    userPromises.push(
      limit(() =>
        prisma.user.create({
          data: {
            username: `ad.${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
            passwordHash: hashedPassword,
            name: `${firstName} ${lastName}`,
            role: UserRole.ad,
            committeeId: null, // District-wide access
            designation: 'Assistant Director',
          },
        })
      )
    );
  }

  await Promise.all(userPromises);
  console.log(`✅ Created users for all committees and 3 assistant directors`);
}

/**
 * Seed traders
 */
async function seedTraders(): Promise<void> {
  console.log('🏪 Seeding traders...');

  const traderCount = faker.number.int({min: 200, max: 300});
  const traderPromises: Promise<any>[] = [];

  for (let i = 0; i < traderCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    traderPromises.push(
      limit(() =>
        prisma.trader.create({
          data: {
            name: `${fullName} Traders ${i + 1}`,
            address: faker.location.streetAddress({useFullAddress: true}),
            phone: Math.random() > 0.3 ? faker.phone.number() : null,
            email: Math.random() > 0.7 ? faker.internet.email() : null,
            gstNumber:
              Math.random() > 0.5
                ? faker.string.alphanumeric(15).toUpperCase()
                : null,
            panNumber:
              Math.random() > 0.6
                ? faker.string.alphanumeric(10).toUpperCase()
                : null,
            licenseNumber:
              Math.random() > 0.4
                ? faker.string.alphanumeric(12).toUpperCase()
                : null,
          },
        })
      )
    );
  }

  await Promise.all(traderPromises);
  console.log(`✅ Created ${traderCount} traders`);
}

/**
 * Seed receipts with proper date distribution
 */
async function seedReceipts(): Promise<void> {
  console.log('🧾 Seeding receipts...');

  const committees = await prisma.committee.findMany({
    include: {
      checkposts: true,
      users: {
        where: {role: 'deo'},
      },
    },
  });

  const traders = await prisma.trader.findMany();
  const commodities = await prisma.commodity.findMany();

  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-07-06');

  const receiptPromises: Promise<any>[] = [];

  for (const committee of committees) {
    if (committee.users.length === 0) continue; // Skip if no DEO users

    const receiptCount = faker.number.int({min: 30, max: 50});
    const receiptDates = generateDateRange(startDate, endDate, receiptCount);

    for (let i = 0; i < receiptCount; i++) {
      const trader = getRandomElement(traders);
      const commodity = getRandomElement(commodities);
      const deoUser = getRandomElement(committee.users);
      const receiptDate = receiptDates[i];

      const quantity = faker.number.float({
        min: 1,
        max: 1000,
        fractionDigits: 2,
      });
      const unit = getRandomElement([
        Unit.kilograms,
        Unit.quintals,
        Unit.bags,
        Unit.numbers,
      ]);
      const weightPerBag =
        unit === Unit.bags ? faker.number.int({min: 25, max: 100}) : undefined;
      const totalWeightKg = calculateTotalWeight(quantity, unit, weightPerBag);

      const value = faker.number.float({
        min: 100,
        max: 50000,
        fractionDigits: 2,
      });
      const feesPaid =
        value * faker.number.float({min: 0.01, max: 0.05, fractionDigits: 4});

      const natureOfReceipt = getRandomElement([
        NatureOfReceipt.mf,
        NatureOfReceipt.lc,
        NatureOfReceipt.uc,
        NatureOfReceipt.others,
      ]);
      const collectionLocation = getRandomElement([
        CollectionLocation.office,
        CollectionLocation.checkpost,
        CollectionLocation.other,
      ]);

      let checkpostId: string | null = null;
      if (
        collectionLocation === CollectionLocation.checkpost &&
        committee.checkposts.length > 0
      ) {
        checkpostId = getRandomElement(committee.checkposts).id as string;
      }

      receiptPromises.push(
        limit(() =>
          prisma.receipt.create({
            data: {
              receiptDate,
              bookNumber: faker.string.numeric(4),
              receiptNumber: faker.string.numeric(6),
              traderId: trader.id,
              payeeName: trader.name,
              payeeAddress: trader.address,
              commodityId: commodity.id,
              quantity,
              unit,
              weightPerBag,
              totalWeightKg,
              natureOfReceipt,
              natureOtherText:
                natureOfReceipt === NatureOfReceipt.others
                  ? faker.lorem.words(3)
                  : null,
              value,
              feesPaid,
              vehicleNumber: Math.random() > 0.4 ? faker.vehicle.vrm() : null,
              invoiceNumber:
                Math.random() > 0.3 ? faker.string.alphanumeric(8) : null,
              collectionLocation,
              officeSupervisor:
                collectionLocation === CollectionLocation.office
                  ? faker.person.fullName()
                  : null,
              checkpostId,
              collectionOtherText:
                collectionLocation === CollectionLocation.other
                  ? faker.lorem.words(2)
                  : null,
              receiptSignedBy: faker.person.fullName(),
              generatedBy: deoUser.id,
              designation: deoUser.designation,
              committeeId: committee.id,
            },
          })
        )
      );
    }
  }

  await Promise.all(receiptPromises);
  console.log(`✅ Created receipts for all committees`);
}

/**
 * Seed daily analytics based on receipts
 */
async function seedDailyAnalytics(): Promise<void> {
  console.log('📊 Generating daily analytics...');

  const receipts = await prisma.receipt.findMany({
    include: {
      trader: true,
      commodity: true,
    },
  });

  // Group receipts by date and committee
  const dailyGroups = new Map<string, any[]>();

  receipts.forEach((receipt) => {
    const dateKey = `${receipt.receiptDate.toISOString().split('T')[0]}_${
      receipt.committeeId
    }`;
    if (!dailyGroups.has(dateKey)) {
      dailyGroups.set(dateKey, []);
    }
    dailyGroups.get(dateKey)!.push(receipt);
  });

  const analyticsPromises: Promise<any>[] = [];

  for (const [dateKey, dayReceipts] of dailyGroups) {
    const [dateStr, committeeId] = dateKey.split('_');
    const receiptDate = new Date(dateStr);

    // Calculate aggregations
    const totalReceipts = dayReceipts.length;
    const totalValue = dayReceipts.reduce((sum, r) => sum + Number(r.value), 0);
    const totalFeesPaid = dayReceipts.reduce(
      (sum, r) => sum + Number(r.feesPaid),
      0
    );
    const totalQuantity = dayReceipts.reduce(
      (sum, r) => sum + Number(r.totalWeightKg || 0),
      0
    );

    // Nature breakdowns
    const mf_fees = dayReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.mf)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const lc_fees = dayReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.lc)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const uc_fees = dayReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.uc)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const others_fees = dayReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.others)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);

    // Collection location breakdowns
    const officeFees = dayReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.office)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const checkpostFees = dayReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.checkpost)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const otherFees = dayReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.other)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);

    const uniqueTraders = new Set(dayReceipts.map((r) => r.traderId)).size;
    const uniqueCommodities = new Set(dayReceipts.map((r) => r.commodityId))
      .size;

    analyticsPromises.push(
      limit(() =>
        prisma.dailyAnalytics.create({
          data: {
            receiptDate,
            committeeId,
            totalReceipts,
            totalValue,
            totalFeesPaid,
            totalQuantity,
            mf_fees,
            lc_fees,
            uc_fees,
            others_fees,
            officeFees,
            checkpostFees,
            otherFees,
            uniqueTraders,
            uniqueCommodities,
            monthToDateReceipts: totalReceipts, // Simplified for seeding
            monthToDateValue: totalValue,
            monthToDateFees: totalFeesPaid,
            yearToDateReceipts: totalReceipts, // Simplified for seeding
            yearToDateValue: totalValue,
            yearToDateFees: totalFeesPaid,
          },
        })
      )
    );
  }

  await Promise.all(analyticsPromises);
  console.log(`✅ Created daily analytics for ${dailyGroups.size} days`);
}

/**
 * Seed committee monthly analytics
 */
async function seedCommitteeMonthlyAnalytics(): Promise<void> {
  console.log('📈 Generating committee monthly analytics...');

  const receipts = await prisma.receipt.findMany();

  // Group by committee, year, and month
  const monthlyGroups = new Map<string, any[]>();

  receipts.forEach((receipt) => {
    const date = new Date(receipt.receiptDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${receipt.committeeId}_${year}_${month}`;

    if (!monthlyGroups.has(key)) {
      monthlyGroups.set(key, []);
    }
    monthlyGroups.get(key)!.push(receipt);
  });

  const analyticsPromises: Promise<any>[] = [];

  for (const [key, monthReceipts] of monthlyGroups) {
    const [committeeId, year, month] = key.split('_');

    const totalReceipts = monthReceipts.length;
    const totalValue = monthReceipts.reduce(
      (sum, r) => sum + Number(r.value),
      0
    );
    const totalFeesPaid = monthReceipts.reduce(
      (sum, r) => sum + Number(r.feesPaid),
      0
    );

    const marketFees = monthReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.mf)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const officeFees = monthReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.office)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const checkpostFees = monthReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.checkpost)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const otherFees = monthReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.other)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);

    const uniqueTraders = new Set(monthReceipts.map((r) => r.traderId)).size;
    const uniqueCommodities = new Set(monthReceipts.map((r) => r.commodityId))
      .size;

    analyticsPromises.push(
      limit(() =>
        prisma.committeeMonthlyAnalytics.create({
          data: {
            committeeId,
            year: parseInt(year),
            month: parseInt(month),
            totalReceipts,
            totalValue,
            totalFeesPaid,
            marketFees,
            officeFees,
            checkpostFees,
            otherFees,
            uniqueTraders,
            uniqueCommodities,
          },
        })
      )
    );
  }

  await Promise.all(analyticsPromises);
  console.log(
    `✅ Created committee monthly analytics for ${monthlyGroups.size} committee-months`
  );
}

/**
 * Seed trader analytics
 */
async function seedTraderAnalytics(): Promise<void> {
  console.log('👤 Generating trader analytics...');

  const receipts = await prisma.receipt.findMany();

  // Group by trader, committee, and date
  const traderGroups = new Map<string, any[]>();

  receipts.forEach((receipt) => {
    const dateKey = receipt.receiptDate.toISOString().split('T')[0];
    const key = `${receipt.traderId}_${receipt.committeeId}_${dateKey}`;

    if (!traderGroups.has(key)) {
      traderGroups.set(key, []);
    }
    traderGroups.get(key)!.push(receipt);
  });

  const analyticsPromises: Promise<any>[] = [];

  for (const [key, traderReceipts] of traderGroups) {
    const [traderId, committeeId, dateStr] = key.split('_');
    const receiptDate = new Date(dateStr);

    const totalReceipts = traderReceipts.length;
    const totalValue = traderReceipts.reduce(
      (sum, r) => sum + Number(r.value),
      0
    );
    const totalFeesPaid = traderReceipts.reduce(
      (sum, r) => sum + Number(r.feesPaid),
      0
    );
    const totalQuantity = traderReceipts.reduce(
      (sum, r) => sum + Number(r.totalWeightKg || 0),
      0
    );

    const dates = traderReceipts.map((r) => r.receiptDate).sort();
    const firstTransactionDate = dates[0];
    const lastTransactionDate = dates[dates.length - 1];

    analyticsPromises.push(
      limit(() =>
        prisma.traderAnalytics.create({
          data: {
            traderId,
            receiptDate,
            committeeId,
            totalReceipts,
            totalValue,
            totalFeesPaid,
            totalQuantity,
            firstTransactionDate,
            lastTransactionDate,
          },
        })
      )
    );
  }

  await Promise.all(analyticsPromises);
  console.log(
    `✅ Created trader analytics for ${traderGroups.size} trader-committee-date combinations`
  );
}

/**
 * Seed commodity analytics
 */
async function seedCommodityAnalytics(): Promise<void> {
  console.log('🌾 Generating commodity analytics...');

  const receipts = await prisma.receipt.findMany();

  // Group by commodity, committee, and date
  const commodityGroups = new Map<string, any[]>();

  receipts.forEach((receipt) => {
    if (!receipt.commodityId) return;

    const dateKey = receipt.receiptDate.toISOString().split('T')[0];
    const key = `${receipt.commodityId}_${receipt.committeeId}_${dateKey}`;

    if (!commodityGroups.has(key)) {
      commodityGroups.set(key, []);
    }
    commodityGroups.get(key)!.push(receipt);
  });

  const analyticsPromises: Promise<any>[] = [];

  for (const [key, commodityReceipts] of commodityGroups) {
    const [commodityId, committeeId, dateStr] = key.split('_');
    const receiptDate = new Date(dateStr);

    const totalReceipts = commodityReceipts.length;
    const totalValue = commodityReceipts.reduce(
      (sum, r) => sum + Number(r.value),
      0
    );
    const totalFeesPaid = commodityReceipts.reduce(
      (sum, r) => sum + Number(r.feesPaid),
      0
    );
    const totalQuantity = commodityReceipts.reduce(
      (sum, r) => sum + Number(r.totalWeightKg || 0),
      0
    );

    analyticsPromises.push(
      limit(() =>
        prisma.commodityAnalytics.create({
          data: {
            commodityId,
            receiptDate,
            committeeId,
            totalReceipts,
            totalValue,
            totalFeesPaid,
            totalQuantity,
          },
        })
      )
    );
  }

  await Promise.all(analyticsPromises);
  console.log(
    `✅ Created commodity analytics for ${commodityGroups.size} commodity-committee-date combinations`
  );
}

/**
 * Seed monthly reports
 */
async function seedMonthlyReports(): Promise<void> {
  console.log('📋 Generating monthly reports...');

  const receipts = await prisma.receipt.findMany();
  const committees = await prisma.committee.findMany();

  // Group by committee, year, and month
  const monthlyGroups = new Map<string, any[]>();

  receipts.forEach((receipt) => {
    const date = new Date(receipt.receiptDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${receipt.committeeId}_${year}_${month}`;

    if (!monthlyGroups.has(key)) {
      monthlyGroups.set(key, []);
    }
    monthlyGroups.get(key)!.push(receipt);
  });

  const reportPromises: Promise<any>[] = [];

  for (const [key, monthReceipts] of monthlyGroups) {
    const [committeeId, year, month] = key.split('_');

    const totalReceipts = monthReceipts.length;
    const totalValue = monthReceipts.reduce(
      (sum, r) => sum + Number(r.value),
      0
    );
    const totalFeesPaid = monthReceipts.reduce(
      (sum, r) => sum + Number(r.feesPaid),
      0
    );
    const totalQuantity = monthReceipts.reduce(
      (sum, r) => sum + Number(r.totalWeightKg || 0),
      0
    );

    const mf_fees = monthReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.mf)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const lc_fees = monthReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.lc)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const uc_fees = monthReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.uc)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);
    const others_fees = monthReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.others)
      .reduce((sum, r) => sum + Number(r.feesPaid), 0);

    const uniqueTraders = new Set(monthReceipts.map((r) => r.traderId)).size;
    const uniqueCommodities = new Set(monthReceipts.map((r) => r.commodityId))
      .size;
    const avgReceiptValue = totalReceipts > 0 ? totalValue / totalReceipts : 0;
    const avgFeeRate = totalValue > 0 ? totalFeesPaid / totalValue : 0;

    reportPromises.push(
      limit(() =>
        prisma.monthlyReport.create({
          data: {
            id: `${committeeId}_${year}_${month}`,
            year: parseInt(year),
            month: parseInt(month),
            committeeId,
            reportLevel: ReportLevel.committee,
            totalReceipts,
            totalValue,
            totalFeesPaid,
            totalQuantity,
            monthlyAchievement: mf_fees,
            cumulativeAchievement: mf_fees, // Simplified for seeding
            mf_fees,
            lc_fees,
            uc_fees,
            others_fees,
            uniqueTraders,
            uniqueCommodities,
            avgReceiptValue,
            avgFeeRate,
          },
        })
      )
    );
  }

  await Promise.all(reportPromises);
  console.log(
    `✅ Created monthly reports for ${monthlyGroups.size} committee-months`
  );
}

/**
 * Main seeding function
 */
async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    await clearDatabase();

    // Seed in dependency order
    await seedCommodities();
    await seedCommitteesAndCheckposts();
    await seedUsers();
    await seedTraders();
    await seedReceipts();

    // Generate analytics and reports
    await seedDailyAnalytics();
    await seedCommitteeMonthlyAnalytics();
    await seedTraderAnalytics();
    await seedCommodityAnalytics();
    await seedMonthlyReports();

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the main function
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
