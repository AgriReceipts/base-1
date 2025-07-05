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

// ==================== CONFIGURABLE PARAMETERS ====================
const SEED_CONFIG = {
  dateRange: {
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-07-06'),
  },
  receipts: {
    perCommitteePerDay: {
      min: 5,
      max: 10,
    },
  },
  traders: {
    total: {min: 150, max: 200},
  },
  users: {
    perCommittee: {min: 15, max: 25},
    assistantDirectors: 5,
  },
  performance: {
    batchSize: 1000,
    concurrencyLimit: 20,
  },
};

const prisma = new PrismaClient();
const limit = pLimit(SEED_CONFIG.performance.concurrencyLimit);

// Common password for all users
const COMMON_PASSWORD = 'password123';

// Helper function to generate date ranges
const generateDateRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const date = new Date(currentDate);
    // Normalize to start of day
    date.setHours(0, 0, 0, 0);
    dates.push(date);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Helper function to get random element from array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get random number within range
const getRandomInRange = (min: number, max: number): number => {
  return faker.number.int({min, max});
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

// Helper function to process items in batches
const processBatches = async <T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
): Promise<void> => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processor(batch);
    console.log(
      `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        items.length / batchSize
      )}`
    );
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
    const userCount = getRandomInRange(
      SEED_CONFIG.users.perCommittee.min,
      SEED_CONFIG.users.perCommittee.max
    );
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

  // Create assistant directors with district-wide access
  for (let i = 0; i < SEED_CONFIG.users.assistantDirectors; i++) {
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
  console.log(
    `✅ Created users for all committees and ${SEED_CONFIG.users.assistantDirectors} assistant directors`
  );
}

/**
 * Seed traders
 */
async function seedTraders(): Promise<void> {
  console.log('🏪 Seeding traders...');

  const traderCount = getRandomInRange(
    SEED_CONFIG.traders.total.min,
    SEED_CONFIG.traders.total.max
  );
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

  const allDates = generateDateRange(
    SEED_CONFIG.dateRange.startDate,
    SEED_CONFIG.dateRange.endDate
  );

  console.log(
    `📅 Generating receipts for ${allDates.length} days across ${committees.length} committees`
  );

  // Generate receipt data first, then process in batches
  const receiptData: any[] = [];

  for (const committee of committees) {
    if (committee.users.length === 0) continue; // Skip if no DEO users

    for (const receiptDate of allDates) {
      const receiptsForDay = getRandomInRange(
        SEED_CONFIG.receipts.perCommitteePerDay.min,
        SEED_CONFIG.receipts.perCommitteePerDay.max
      );

      for (let i = 0; i < receiptsForDay; i++) {
        const trader = getRandomElement(traders);
        const commodity = getRandomElement(commodities);
        const deoUser = getRandomElement(committee.users);

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
          unit === Unit.bags
            ? faker.number.int({min: 25, max: 100})
            : undefined;
        const totalWeightKg = calculateTotalWeight(
          quantity,
          unit,
          weightPerBag
        );

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

        receiptData.push({
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
        });
      }
    }
  }

  console.log(
    `📊 Generated ${receiptData.length} receipt records, processing in batches...`
  );

  // Process receipts in batches
  await processBatches(
    receiptData,
    SEED_CONFIG.performance.batchSize,
    async (batch) => {
      const batchPromises = batch.map((receipt) =>
        limit(() => prisma.receipt.create({data: receipt}))
      );
      await Promise.all(batchPromises);
    }
  );

  console.log(
    `✅ Created ${receiptData.length} receipts across all committees`
  );
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

  console.log(`📈 Processing ${dailyGroups.size} daily analytics records...`);

  // Convert to array for batch processing
  const analyticsData = Array.from(dailyGroups.entries()).map(
    ([dateKey, dayReceipts]) => {
      const [dateStr, committeeId] = dateKey.split('_');
      const receiptDate = new Date(dateStr);

      // Calculate aggregations
      const totalReceipts = dayReceipts.length;
      const totalValue = dayReceipts.reduce(
        (sum, r) => sum + Number(r.value),
        0
      );
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

      return {
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
      };
    }
  );

  // Process analytics in batches
  await processBatches(
    analyticsData,
    SEED_CONFIG.performance.batchSize,
    async (batch) => {
      const batchPromises = batch.map((analytics) =>
        limit(() => prisma.dailyAnalytics.create({data: analytics}))
      );
      await Promise.all(batchPromises);
    }
  );

  console.log(`✅ Created daily analytics for ${analyticsData.length} days`);
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

  const analyticsData = Array.from(monthlyGroups.entries()).map(
    ([key, monthReceipts]) => {
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

      return {
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
      };
    }
  );

  const analyticsPromises = analyticsData.map((analytics) =>
    limit(() => prisma.committeeMonthlyAnalytics.create({data: analytics}))
  );

  await Promise.all(analyticsPromises);
  console.log(
    `✅ Created committee monthly analytics for ${analyticsData.length} committee-months`
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

  const analyticsData = Array.from(traderGroups.entries()).map(
    ([key, traderReceipts]) => {
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

      return {
        traderId,
        receiptDate,
        committeeId,
        totalReceipts,
        totalValue,
        totalFeesPaid,
        totalQuantity,
        firstTransactionDate,
        lastTransactionDate,
      };
    }
  );

  // Process trader analytics in batches
  await processBatches(
    analyticsData,
    SEED_CONFIG.performance.batchSize,
    async (batch) => {
      const batchPromises = batch.map((analytics) =>
        limit(() => prisma.traderAnalytics.create({data: analytics}))
      );
      await Promise.all(batchPromises);
    }
  );

  console.log(
    `✅ Created trader analytics for ${analyticsData.length} trader-committee-date combinations`
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

  const analyticsData = Array.from(commodityGroups.entries()).map(
    ([key, commodityReceipts]) => {
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

      return {
        commodityId,
        receiptDate,
        committeeId,
        totalReceipts,
        totalValue,
        totalFeesPaid,
        totalQuantity,
      };
    }
  );

  // Process commodity analytics in batches
  await processBatches(
    analyticsData,
    SEED_CONFIG.performance.batchSize,
    async (batch) => {
      const batchPromises = batch.map((analytics) =>
        limit(() => prisma.commodityAnalytics.create({data: analytics}))
      );
      await Promise.all(batchPromises);
    }
  );

  console.log(
    `✅ Created commodity analytics for ${analyticsData.length} commodity-committee-date combinations`
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

  const reportData = Array.from(monthlyGroups.entries()).map(
    ([key, monthReceipts]) => {
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
      const avgReceiptValue =
        totalReceipts > 0 ? totalValue / totalReceipts : 0;
      const avgFeeRate = totalValue > 0 ? totalFeesPaid / totalValue : 0;

      return {
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
      };
    }
  );

  // Process monthly reports in batches
  await processBatches(
    reportData,
    SEED_CONFIG.performance.batchSize,
    async (batch) => {
      const batchPromises = batch.map((report) =>
        limit(() => prisma.monthlyReport.create({data: report}))
      );
      await Promise.all(batchPromises);
    }
  );

  console.log(
    `✅ Created monthly reports for ${reportData.length} committee-months`
  );
}

/**
 * Seed targets for committees, checkposts, and commodities
 */
async function seedTargets(): Promise<void> {
  console.log('🎯 Generating targets...');

  const committees = await prisma.committee.findMany({
    include: {
      checkposts: true,
    },
  });
  const commodities = await prisma.commodity.findMany();
  const users = await prisma.user.findMany({
    where: {
      role: {in: ['supervisor', 'ad']},
    },
  });

  const currentYear = new Date().getFullYear();
  const targetData: any[] = [];

  // Helper to get random user for setBy and approvedBy
  const getRandomUser = () => getRandomElement(users);
  const getRandomSupervisor = () =>
    getRandomElement(
      users.filter((u) => u.role === 'supervisor' || u.role === 'ad')
    );

  for (const committee of committees) {
    const setByUser = getRandomUser();
    const approvedByUser = Math.random() > 0.3 ? getRandomSupervisor() : null;

    // Committee-level targets
    // 1. Monthly targets
    for (let month = 1; month <= 12; month++) {
      const marketFeeTarget = faker.number.float({
        min: 15000,
        max: 85000,
        fractionDigits: 2,
      });
      const totalValueTarget = faker.number.float({
        min: 200000,
        max: 1500000,
        fractionDigits: 2,
      });
      const quantityTarget = faker.number.float({
        min: 5000,
        max: 50000,
        fractionDigits: 2,
      });

      targetData.push({
        year: currentYear,
        month,
        quarter: null,
        targetType: 'monthly',
        targetLevel: 'committee',
        committeeId: committee.id,
        checkpostId: null,
        commodityId: null,
        marketFeeTarget,
        totalValueTarget,
        quantityTarget,
        setBy: setByUser.id,
        approvedBy: approvedByUser?.id || null,
        isActive: true,
        notes: `Monthly target for ${committee.name} - ${month}/${currentYear}`,
      });
    }

    // 2. Quarterly targets
    for (let quarter = 1; quarter <= 4; quarter++) {
      const marketFeeTarget = faker.number.float({
        min: 45000,
        max: 250000,
        fractionDigits: 2,
      });
      const totalValueTarget = faker.number.float({
        min: 600000,
        max: 4500000,
        fractionDigits: 2,
      });

      targetData.push({
        year: currentYear,
        month: null,
        quarter,
        targetType: 'quarterly',
        targetLevel: 'committee',
        committeeId: committee.id,
        checkpostId: null,
        commodityId: null,
        marketFeeTarget,
        totalValueTarget,
        quantityTarget: null,
        setBy: setByUser.id,
        approvedBy: approvedByUser?.id || null,
        isActive: true,
        notes: `Q${quarter} target for ${committee.name}`,
      });
    }

    // 3. Annual target
    const annualMarketFeeTarget = faker.number.float({
      min: 180000,
      max: 1000000,
      fractionDigits: 2,
    });
    const annualTotalValueTarget = faker.number.float({
      min: 2400000,
      max: 18000000,
      fractionDigits: 2,
    });

    targetData.push({
      year: currentYear,
      month: null,
      quarter: null,
      targetType: 'annual',
      targetLevel: 'committee',
      committeeId: committee.id,
      checkpostId: null,
      commodityId: null,
      marketFeeTarget: annualMarketFeeTarget,
      totalValueTarget: annualTotalValueTarget,
      quantityTarget: null,
      setBy: setByUser.id,
      approvedBy: approvedByUser?.id || null,
      isActive: true,
      notes: `Annual target for ${committee.name} - ${currentYear}`,
    });
  }

  // Process targets in batches
  await processBatches(
    targetData,
    SEED_CONFIG.performance.batchSize,
    async (batch) => {
      const batchPromises = batch.map((target) =>
        limit(() => prisma.target.create({data: target}))
      );
      await Promise.all(batchPromises);
    }
  );

  console.log(`✅ Created ${targetData.length} targets across all levels`);
}

/**
 * Display seeding summary
 */
async function displaySeedingSummary(): Promise<void> {
  console.log('\n📊 SEEDING SUMMARY');
  console.log('==================');

  const summary = await Promise.all([
    prisma.committee.count(),
    prisma.checkpost.count(),
    prisma.user.count(),
    prisma.trader.count(),
    prisma.commodity.count(),
    prisma.receipt.count(),
    prisma.dailyAnalytics.count(),
    prisma.committeeMonthlyAnalytics.count(),
    prisma.traderAnalytics.count(),
    prisma.commodityAnalytics.count(),
    prisma.monthlyReport.count(),
    prisma.target.count(),
  ]);

  const [
    committees,
    checkposts,
    users,
    traders,
    commodities,
    receipts,
    dailyAnalytics,
    committeeMonthlyAnalytics,
    traderAnalytics,
    commodityAnalytics,
    monthlyReports,
    targets,
  ] = summary;

  console.log(`📋 Committees: ${committees.toLocaleString()}`);
  console.log(`🏛️  Checkposts: ${checkposts.toLocaleString()}`);
  console.log(`👥 Users: ${users.toLocaleString()}`);
  console.log(`🏪 Traders: ${traders.toLocaleString()}`);
  console.log(`🌾 Commodities: ${commodities.toLocaleString()}`);
  console.log(`🧾 Receipts: ${receipts.toLocaleString()}`);
  console.log(`📊 Daily Analytics: ${dailyAnalytics.toLocaleString()}`);
  console.log(
    `📈 Committee Monthly Analytics: ${committeeMonthlyAnalytics.toLocaleString()}`
  );
  console.log(`👤 Trader Analytics: ${traderAnalytics.toLocaleString()}`);
  console.log(`🌾 Commodity Analytics: ${commodityAnalytics.toLocaleString()}`);
  console.log(`📋 Monthly Reports: ${monthlyReports.toLocaleString()}`);
  console.log(`🎯 Targets: ${targets.toLocaleString()}`);

  console.log('\n✨ All data seeded successfully!');
}

/**
 * Main seeding function
 */
async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');
  console.log(
    `📅 Date range: ${
      SEED_CONFIG.dateRange.startDate.toISOString().split('T')[0]
    } to ${SEED_CONFIG.dateRange.endDate.toISOString().split('T')[0]}`
  );
  console.log(
    `🔄 Concurrency limit: ${SEED_CONFIG.performance.concurrencyLimit}`
  );
  console.log(`📦 Batch size: ${SEED_CONFIG.performance.batchSize}`);

  const startTime = Date.now();

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

    // Optional: Seed targets
    await seedTargets();

    // Display summary
    await displaySeedingSummary();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Total seeding time: ${duration} seconds`);
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
