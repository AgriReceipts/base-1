import {PrismaClient, UserRole} from '@prisma/client';
import {faker} from '@faker-js/faker';
import bcrypt from 'bcryptjs';

export async function seedUsersAndTraders(
  prisma: PrismaClient,
  config: any,
  userPassword: string,
  committees: any[]
) {
  console.log('   Creating users and traders...');

  // // Hash password once
  // const hashedPassword = await bcrypt.hash(userPassword, 10);

  // ==================== CREATE USERS ====================
  const users = [];

  // ----------------- Assistant Directors -----------------
  console.log('     Creating Assistant Directors...');
  for (let i = 1; i <= config.users.assistantDirectors; i++) {
    const username = `ad_user${i}`;

    const user = await prisma.user.create({
      data: {
        username,
        password: userPassword,
        name: `Assistant Director ${i}`,
        role: UserRole.ad,
        designation: 'Assistant Director',
        committeeId: null,
        isActive: true,
      },
    });

    users.push(user);
  }

  // ----------------- Committee-Specific Users -----------------
  console.log('     Creating committee-specific users...');
  for (const committee of committees) {
    const committeeName = committee.name.toLowerCase().replace(/\s+/g, '');

    // 1 DEO
    const deoUsername = `deo_${committeeName}`;
    const deoUser = await prisma.user.create({
      data: {
        username: deoUsername,
        password: userPassword,
        name: `DEO ${committee.name}`,
        role: UserRole.deo,
        designation: 'Data Entry Operator',
        committeeId: committee.id,
        isActive: true,
      },
    });
    users.push(deoUser);

    // 1 Supervisor
    const supervisorUsername = `supervisor_${committeeName}`;
    const supervisorUser = await prisma.user.create({
      data: {
        username: supervisorUsername,
        password: userPassword,
        name: `Supervisor ${committee.name}`,
        role: UserRole.supervisor,
        designation: 'Supervisor',
        committeeId: committee.id,
        isActive: true,
      },
    });
    users.push(supervisorUser);

    // 1 Secretary
    const secretaryUsername = `secretary_${committeeName}`;
    const secretaryUser = await prisma.user.create({
      data: {
        username: secretaryUsername,
        password: userPassword,
        name: `Secretary ${committee.name}`,
        role: UserRole.secretary,
        designation: 'Secretary',
        committeeId: committee.id,
        isActive: true,
      },
    });
    users.push(secretaryUser);
  }

  // ==================== CREATE TRADERS ====================
  console.log('     Creating traders...');
  const traders = [];
  const usedTraderNames = new Set<string>();

  // Helper function to generate unique trader name
  const generateUniqueTraderName = (): string => {
    let traderName: string;
    let attempts = 0;

    do {
      const businessType = faker.helpers.arrayElement([
        'Traders',
        'Enterprises',
        'Trading Co.',
        'Industries',
        'Corp',
        'Ltd',
        'Brothers',
        'Sons',
        'Associates',
        'Exports',
        'Imports',
        'Agency',
      ]);

      const baseName = faker.company.name().replace(/[,\.]/g, '');
      traderName = `${baseName} ${businessType}`;
      attempts++;
    } while (usedTraderNames.has(traderName) && attempts < 100);

    if (usedTraderNames.has(traderName)) {
      // Fallback to UUID-based name if we can't generate unique one
      traderName = `Trader_${faker.string.uuid().substring(0, 8)}`;
    }

    usedTraderNames.add(traderName);
    return traderName;
  };

  const totalTraders = faker.number.int({
    min: config.traders.total.min,
    max: config.traders.total.max,
  });

  // Create traders in batches for better performance
  const batchSize = config.performance.batchSize;
  const traderBatches = [];

  for (let i = 0; i < totalTraders; i++) {
    const traderName = generateUniqueTraderName();
    const hasGST = faker.datatype.boolean(0.7); // 70% chance of having GST
    const hasPAN = faker.datatype.boolean(0.8); // 80% chance of having PAN
    const hasLicense = faker.datatype.boolean(0.6); // 60% chance of having license

    const traderData = {
      name: traderName,
      address: faker.location.streetAddress({useFullAddress: true}),
      isActive: faker.datatype.boolean(0.95), // 95% active
    };

    traderBatches.push(traderData);

    // Create batch when it reaches batchSize or is the last batch
    if (traderBatches.length >= batchSize || i === totalTraders - 1) {
      await prisma.trader.createMany({
        data: traderBatches,
      });
      traderBatches.length = 0; // Clear the batch
    }
  }

  // Fetch all created traders
  const allTraders = await prisma.trader.findMany({
    orderBy: {name: 'asc'},
  });

  traders.push(...allTraders);

  console.log(
    `     ✅ Created ${users.length} users and ${traders.length} traders`
  );

  return {users, traders};
}
