import {PrismaClient, UserRole} from '@prisma/client';
import {faker} from '@faker-js/faker';

export async function seedTargets(
  prisma: PrismaClient,
  config: any,
  users: any[],
  committees: any[]
) {
  console.log('🎯 Creating targets...');

  const adUsers = users.filter((user) => user.role === UserRole.ad);
  if (adUsers.length === 0) {
    console.log('     ⚠️  No AD users found, skipping target creation');
    return;
  }

  // --- 💡 CONTEXT-BASED CONFIGURATION (ADJUST THESE VALUES) ---
  const BASELINE_COMMITTEE_TOTAL_VALUE = 250_000_000; // Avg. monthly total value for a committee
  const MARKET_FEE_PERCENTAGE = 0.01; // e.g., 1% of total value
  const VARIANCE = 0.3; // Allows values to fluctuate by +/- 30%
  // ---

  const targets = [];
  const startDate = new Date(config.dateRange.startDate);
  const endDate = new Date(config.dateRange.endDate);

  const months = [];
  let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  while (currentMonth <= lastMonth) {
    months.push({
      year: currentMonth.getFullYear(),
      month: currentMonth.getMonth() + 1,
    });
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  console.log(
    `     Creating targets for ${months.length} months across ${committees.length} committees`
  );

  const checkposts = await prisma.checkpost.findMany({
    where: {committeeId: {in: committees.map((c) => c.id)}},
    select: {id: true, name: true, committeeId: true},
  });

  type CheckpostType = (typeof checkposts)[0];
  const checkpostsByCommittee = new Map<string, CheckpostType[]>();
  checkposts.forEach((checkpost) => {
    if (!checkpostsByCommittee.has(checkpost.committeeId)) {
      checkpostsByCommittee.set(checkpost.committeeId, []);
    }
    checkpostsByCommittee.get(checkpost.committeeId)!.push(checkpost);
  });

  for (const committee of committees) {
    const committeeCheckposts = checkpostsByCommittee.get(committee.id) || [];

    for (const {year, month} of months) {
      const setByUser = faker.helpers.arrayElement(adUsers);

      // 1. Generate a realistic base target for the committee for the month
      const committeeTotalValueTarget = faker.number.int({
        min: BASELINE_COMMITTEE_TOTAL_VALUE * (1 - VARIANCE),
        max: BASELINE_COMMITTEE_TOTAL_VALUE * (1 + VARIANCE),
      });

      // 2. Derive the market fee target from the total value target
      const committeeMarketFeeTarget = Math.round(
        committeeTotalValueTarget *
          faker.number.float({
            min: MARKET_FEE_PERCENTAGE * 0.9, // Add slight variance to the fee %
            max: MARKET_FEE_PERCENTAGE * 1.1,
          })
      );

      // Create the committee-level target
      targets.push({
        year,
        month,
        committeeId: committee.id,
        checkpostId: null,
        marketFeeTarget: committeeMarketFeeTarget,
        totalValueTarget: committeeTotalValueTarget,
        setBy: setByUser.id,
        isActive: true,
        notes: 'Committee level target',
      });

      // 3. Distribute a portion of the committee target to checkposts
      if (committeeCheckposts.length > 0 && faker.datatype.boolean(0.8)) {
        // Decide what portion of the committee's target is covered by checkposts
        const portionToDistribute = faker.number.float({min: 0.5, max: 0.9});
        let remainingFeeToAssign =
          committeeMarketFeeTarget * portionToDistribute;

        // Shuffle checkposts to assign targets randomly
        const shuffledCheckposts = faker.helpers.shuffle(committeeCheckposts);

        for (const checkpost of shuffledCheckposts) {
          if (remainingFeeToAssign <= 0) break;

          // Assign a random fraction of the remaining target to this checkpost
          const fraction = faker.number.float({min: 0.2, max: 0.8});
          const checkpostFeeTarget = Math.min(
            remainingFeeToAssign,
            Math.round(remainingFeeToAssign * fraction)
          );
          remainingFeeToAssign -= checkpostFeeTarget;

          // Derive the checkpost's total value from its fee target
          const checkpostTotalValueTarget = Math.round(
            checkpostFeeTarget / MARKET_FEE_PERCENTAGE
          );

          targets.push({
            year,
            month,
            committeeId: committee.id,
            checkpostId: checkpost.id,
            marketFeeTarget: checkpostFeeTarget,
            totalValueTarget: checkpostTotalValueTarget,
            setBy: setByUser.id,
            isActive: true,
            notes: `Target for ${checkpost.name}`,
          });
        }
      }
    }
  }

  console.log(`     Generated ${targets.length} targets`);

  // Batch creation remains the same
  const batchSize = 100;
  let createdCount = 0;
  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    try {
      const result = await prisma.target.createMany({
        data: batch,
        skipDuplicates: true,
      });
      createdCount += result.count;
    } catch (error) {
      console.error(`Error creating targets:`, error);
    }
  }

  console.log(`     ✅ Created ${createdCount} targets`);
  const committeeTargets = targets.filter((t) => !t.checkpostId).length;
  const checkpostTargets = targets.filter((t) => t.checkpostId).length;
  console.log(
    `     📊 Committee: ${committeeTargets}, Checkpost: ${checkpostTargets}`
  );
}
