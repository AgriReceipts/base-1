import {PrismaClient, UserRole} from '@prisma/client';
import {faker} from '@faker-js/faker';

export async function seedTargets(
  prisma: PrismaClient,
  config: any,
  users: any[],
  committees: any[]
) {
  console.log('   Creating targets...');

  // Find AD (Assistant Director) users who can set targets
  const adUsers = users.filter((user) => user.role === UserRole.ad);

  if (adUsers.length === 0) {
    console.log('     ⚠️  No AD users found, skipping target creation');
    return;
  }

  const targets = [];
  const startDate = new Date(config.dateRange.startDate);
  const endDate = new Date(config.dateRange.endDate);

  // Generate months in the date range
  const months = [];
  const currentMonth = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );
  const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (currentMonth <= lastMonth) {
    months.push({
      year: currentMonth.getFullYear(),
      month: currentMonth.getMonth() + 1, // 1-based month
    });
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  console.log(
    `     Creating targets for ${months.length} months across ${committees.length} committees`
  );

  // Create targets for each committee and month
  for (const committee of committees) {
    for (const {year, month} of months) {
      // 80% chance of creating a target for this committee/month
      if (faker.datatype.boolean(0.8)) {
        // Pick a random AD user to set the target
        const setByUser = faker.helpers.arrayElement(adUsers);

        // Generate realistic market fee targets based on committee size/importance
        const baseTarget = faker.number.int({min: 50000, max: 500000});
        const marketFeeTarget = Math.round(baseTarget / 1000) * 1000; // Round to nearest 1000

        // Optional total value target (70% chance)
        const totalValueTarget = faker.datatype.boolean(0.7)
          ? marketFeeTarget * faker.number.int({min: 10, max: 50})
          : null;

        // Optional approval (60% chance)
        const approvedBy = faker.datatype.boolean(0.6)
          ? faker.helpers.arrayElement(adUsers).id
          : null;

        // Optional notes (40% chance)
        const notes = faker.datatype.boolean(0.4)
          ? faker.lorem.sentence()
          : null;

        const targetData = {
          year,
          month,
          committeeId: committee.id,
          checkpostId: null, // For now, only committee-level targets
          marketFeeTarget,
          totalValueTarget,
          setBy: setByUser.id,
          approvedBy,
          isActive: true,
          notes,
        };

        targets.push(targetData);
      }
    }
  }

  // Create targets in batches
  const batchSize = config.performance.batchSize;
  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    await prisma.target.createMany({
      data: batch,
      skipDuplicates: true, // Skip if unique constraint is violated
    });
  }

  console.log(`     ✅ Created ${targets.length} targets`);
}
