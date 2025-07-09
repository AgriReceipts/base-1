// File: ./seed-main.ts

import {PrismaClient} from '@prisma/client';
import {generateReceiptData} from './seed-receitpt-generator';
import {processDayBatch} from './seed-analytics-updater';
import {faker} from '@faker-js/faker';

export async function seedReceiptsAndAllAnalytics(
  prisma: PrismaClient,
  config: any,
  users: any[],
  traders: any[],
  committees: any[],
  commodities: any[],
  checkposts: any[]
) {
  console.log('🌱 Starting to seed receipts and all analytics tables...');

  const startDate = new Date(config.dateRange.startDate);
  const endDate = new Date(config.dateRange.endDate);

  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  console.log(
    `   Processing ${totalDays} days from ${
      startDate.toISOString().split('T')[0]
    } to ${endDate.toISOString().split('T')[0]}`
  );

  let totalReceipts = 0;
  let processedDays = 0;

  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const receiptsForDay = [];

    // Generate all receipts for the current day across all committees
    for (const committee of committees) {
      const committeeUsers = users.filter(
        (user) => user.committeeId === committee.id || user.role === 'ad'
      );
      if (committeeUsers.length === 0) continue;

      const committeeCheckposts = checkposts.filter(
        (cp) => cp.committeeId === committee.id
      );

      const receiptsPerDay = faker.number.int({
        min: config.receipts.perCommitteePerDay.min,
        max: config.receipts.perCommitteePerDay.max,
      });

      for (let i = 0; i < receiptsPerDay; i++) {
        const receiptData = await generateReceiptData(
          new Date(currentDate), // Use a new date object to avoid mutation
          committee,
          committeeUsers,
          committeeCheckposts,
          traders,
          commodities,
          i + 1 // Sequence number for the day
        );
        receiptsForDay.push(receiptData);
      }
    }

    // Group receipts by committee to process them in batches
    const receiptsByCommittee = new Map<string, any[]>();
    for (const receipt of receiptsForDay) {
      if (!receiptsByCommittee.has(receipt.committeeId)) {
        receiptsByCommittee.set(receipt.committeeId, []);
      }
      receiptsByCommittee.get(receipt.committeeId)!.push(receipt);
    }

    // Process each committee's batch for the day
    for (const [committeeId, committeeReceipts] of receiptsByCommittee) {
      if (committeeReceipts.length > 0) {
        await processDayBatch(
          prisma,
          committeeId,
          new Date(currentDate),
          committeeReceipts
        );
        totalReceipts += committeeReceipts.length;
      }
    }

    processedDays++;
    if (processedDays % 10 === 0 || processedDays === totalDays) {
      console.log(
        `   Processed ${processedDays}/${totalDays} days (${totalReceipts} receipts so far)`
      );
    }
  }

  console.log(
    `✅ Successfully created ${totalReceipts} receipts and updated all analytics tables.`
  );
}
