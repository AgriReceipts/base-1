import {PrismaClient, UserRole, TargetType} from '@prisma/client';
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
    console.log('     ⚠️  No AD users found, skipping target creation.');
    return;
  }

  // --- 💡 CONFIGURATION ---
  const BASELINE_COMMITTEE_TOTAL_VALUE = 250_000_000; // 25 Crore
  const MARKET_FEE_PERCENTAGE = 0.01; // 1%
  const VARIANCE = 0.3; // +/- 30%
  // ---

  const targets = [];
  const startDate = new Date(config.dateRange.startDate);
  const endDate = new Date(config.dateRange.endDate);

  // Generate a list of all months in the date range
  const months = [];
  let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  while (currentMonth <= lastMonth) {
    months.push({
      year: currentMonth.getFullYear(),
      month: currentMonth.getMonth() + 1, // Prisma uses 1-12 for month
    });
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  console.log(
    `     Creating targets for ${months.length} months across ${committees.length} committees...`
  );

  // Fetch all checkposts at once for efficiency
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

      // 1. Generate the OVERALL target for the entire committee
      const committeeTotalValueTarget = faker.number.int({
        min: BASELINE_COMMITTEE_TOTAL_VALUE * (1 - VARIANCE),
        max: BASELINE_COMMITTEE_TOTAL_VALUE * (1 + VARIANCE),
      });

      const committeeMarketFeeTarget = Math.round(
        committeeTotalValueTarget *
          faker.number.float({
            min: MARKET_FEE_PERCENTAGE * 0.9,
            max: MARKET_FEE_PERCENTAGE * 1.1,
          })
      );

      targets.push({
        year,
        month,
        type: TargetType.OVERALL_COMMITTEE,
        committeeId: committee.id,
        checkpostId: null,
        marketFeeTarget: committeeMarketFeeTarget,
        setBy: setByUser.id,
        isActive: true,
        notes: 'Overall target for the entire committee',
      });

      // 2. Distribute a portion of the committee target to its sub-entities
      let totalCheckpostFeesAssigned = 0;
      if (committeeCheckposts.length > 0) {
        const portionToDistribute = faker.number.float({min: 0.4, max: 0.8});
        let remainingFeeToAssign =
          committeeMarketFeeTarget * portionToDistribute;
        const shuffledCheckposts = faker.helpers.shuffle(committeeCheckposts);

        for (const checkpost of shuffledCheckposts) {
          if (remainingFeeToAssign <= 1000) break; // Stop if remaining amount is negligible

          const fraction = faker.number.float({min: 0.2, max: 0.8});
          const checkpostFeeTarget = Math.min(
            remainingFeeToAssign,
            Math.round(remainingFeeToAssign * fraction)
          );

          if (checkpostFeeTarget > 0) {
            targets.push({
              year,
              month,
              type: TargetType.CHECKPOST,
              committeeId: committee.id,
              checkpostId: checkpost.id,
              marketFeeTarget: checkpostFeeTarget,
              setBy: setByUser.id,
              isActive: true,
              notes: `Sub-target for checkpost: ${checkpost.name}`,
            });
            totalCheckpostFeesAssigned += checkpostFeeTarget;
            remainingFeeToAssign -= checkpostFeeTarget;
          }
        }
      }

      // 3. Assign the rest of the target to the COMMITTEE_OFFICE
      const officeFeeTarget =
        committeeMarketFeeTarget - totalCheckpostFeesAssigned;

      if (officeFeeTarget > 0) {
        targets.push({
          year,
          month,
          type: TargetType.COMMITTEE_OFFICE,
          committeeId: committee.id,
          checkpostId: null,
          marketFeeTarget: officeFeeTarget,
          setBy: setByUser.id,
          isActive: true,
          notes: 'Sub-target for the committee main office',
        });
      }
    }
  }

  console.log(`     Generated ${targets.length} target records.`);

  // Batch creation for performance
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
      console.error(`Error creating targets batch:`, error);
    }
  }

  console.log(`     ✅ Created ${createdCount} new targets in the database.`);
  // Log the breakdown of created targets
  const overall = targets.filter(
    (t) => t.type === TargetType.OVERALL_COMMITTEE
  ).length;
  const office = targets.filter(
    (t) => t.type === TargetType.COMMITTEE_OFFICE
  ).length;
  const checkpost = targets.filter(
    (t) => t.type === TargetType.CHECKPOST
  ).length;
  console.log(
    `     📊 Breakdown -> Overall: ${overall}, Office: ${office}, Checkpost: ${checkpost}`
  );
}
