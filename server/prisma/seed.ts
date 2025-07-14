import {PrismaClient} from '@prisma/client';
import pLimit from 'p-limit';
import {committeesData, commoditiesData} from './data';
import {seedUsersAndTraders} from './helpers/user-trader-seeder';
import {seedTargets} from './helpers/target-seeder';
import {seedReceiptsAndAllAnalytics} from './helpers/receipt-seeder';
import {generateMonthlyReports} from './helpers/report-generator';

// ==================== CONFIGURABLE PARAMETERS ====================
const SEED_CONFIG = {
  dateRange: {
    startDate: new Date('2024-04-01'),
    endDate: new Date('2025-07-01'),
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
    batchSize: 200,
    concurrencyLimit: 10, // p-limit
  },
};

export const USER_PASSWORD = 'password123';

const prisma = new PrismaClient();
const limit = pLimit(SEED_CONFIG.performance.concurrencyLimit);

async function main() {
  console.log('🌱 Starting database seeding...');
  console.log(
    '📅 Date range:',
    SEED_CONFIG.dateRange.startDate.toISOString().split('T')[0],
    'to',
    SEED_CONFIG.dateRange.endDate.toISOString().split('T')[0]
  );

  // ==================== DATABASE CLEANUP ====================
  console.log('🧹 Cleaning up existing data...');

  // Delete in reverse order to handle foreign key constraints
  await prisma.monthlyReport.deleteMany({});
  await prisma.dailyAnalytics.deleteMany({});
  await prisma.traderMonthlyAnalytics.deleteMany({});
  await prisma.traderOverallAnalytics.deleteMany({});
  await prisma.commodityMonthlyAnalytics.deleteMany({});
  await prisma.commodityOverallAnalytics.deleteMany({});
  await prisma.committeeMonthlyAnalytics.deleteMany({});
  await prisma.target.deleteMany({});
  await prisma.receipt.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.trader.deleteMany({});
  await prisma.commodity.deleteMany({});
  await prisma.checkpost.deleteMany({});
  await prisma.committee.deleteMany({});

  console.log('✅ Database cleanup completed');

  // ==================== SEED STATIC DATA ====================
  console.log('🏢 Seeding committees and static data...');

  // Create committees
  const committees = await prisma.committee.createMany({
    data: committeesData.map((committee) => ({
      name: committee.name,
    })),
  });

  const createdCommittees = await prisma.committee.findMany({
    orderBy: {name: 'asc'},
  });

  // Create checkposts for each committee
  const checkpostsData = [];
  for (const committee of createdCommittees) {
    const committeeData = committeesData.find((c) => c.name === committee.name);
    if (committeeData?.checkposts) {
      for (const checkpostName of committeeData.checkposts) {
        checkpostsData.push({
          name: checkpostName,
          committeeId: committee.id,
        });
      }
    }
  }

  await prisma.checkpost.createMany({
    data: checkpostsData,
  });

  const createdCheckposts = await prisma.checkpost.findMany({
    include: {committee: true},
  });

  // Create commodities
  await prisma.commodity.createMany({
    data: commoditiesData.map((commodity) => ({
      name: commodity.name,
      category: commodity.category,
      subCategory: commodity.subCategory,
      description: commodity.description,
    })),
  });

  const createdCommodities = await prisma.commodity.findMany({
    orderBy: {name: 'asc'},
  });

  console.log(
    `✅ Created ${createdCommittees.length} committees, ${createdCheckposts.length} checkposts, and ${createdCommodities.length} commodities`
  );

  // ==================== SEED USERS AND TRADERS ====================
  console.log('👥 Seeding users and traders...');

  const {users, traders} = await seedUsersAndTraders(
    prisma,
    SEED_CONFIG,
    USER_PASSWORD,
    createdCommittees
  );

  console.log(`✅ Created ${users.length} users and ${traders.length} traders`);

  // ==================== SEED TARGETS ====================
  console.log('🎯 Seeding targets...');

  await seedTargets(prisma, SEED_CONFIG, users, createdCommittees);

  console.log('✅ Targets seeded successfully');

  // ==================== SEED RECEIPTS AND ANALYTICS ====================
  console.log('🧾 Seeding receipts and live analytics...');

  await seedReceiptsAndAllAnalytics(
    prisma,
    SEED_CONFIG,
    users,
    traders,
    createdCommittees,
    createdCommodities,
    createdCheckposts
  );

  console.log('✅ Receipts and analytics seeded successfully');

  // ==================== GENERATE MONTHLY REPORTS ====================
  console.log('📊 Generating monthly reports...');

  await generateMonthlyReports(prisma, SEED_CONFIG);

  console.log('✅ Monthly reports generated successfully');

  // ==================== COMPLETION ====================
  console.log('🎉 Database seeding completed successfully!');

  // Print summary statistics
  const stats = await Promise.all([
    prisma.committee.count(),
    prisma.checkpost.count(),
    prisma.commodity.count(),
    prisma.user.count(),
    prisma.trader.count(),
    prisma.target.count(),
    prisma.receipt.count(),
    prisma.dailyAnalytics.count(),
    prisma.committeeMonthlyAnalytics.count(),
    prisma.monthlyReport.count(),
  ]);

  console.log('\n📈 Final Statistics:');
  console.log(`   Committees: ${stats[0]}`);
  console.log(`   Checkposts: ${stats[1]}`);
  console.log(`   Commodities: ${stats[2]}`);
  console.log(`   Users: ${stats[3]}`);
  console.log(`   Traders: ${stats[4]}`);
  console.log(`   Targets: ${stats[5]}`);
  console.log(`   Receipts: ${stats[6]}`);
  console.log(`   Daily Analytics: ${stats[7]}`);
  console.log(`   Committee Monthly Analytics: ${stats[8]}`);
  console.log(`   Monthly Reports: ${stats[9]}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
