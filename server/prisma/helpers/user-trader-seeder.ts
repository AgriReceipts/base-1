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

  // Hash password once
  const hashedPassword = await bcrypt.hash(userPassword, 10);

  // ==================== CREATE USERS ====================
  const users = [];
  const usedUsernames = new Set<string>();

  // Helper function to generate unique username
  const generateUniqueUsername = (baseName: string, role: UserRole): string => {
    let username: string;
    let attempts = 0;

    do {
      const suffix = attempts > 0 ? `_${attempts}` : '';
      username = `${baseName
        .toLowerCase()
        .replace(/\s+/g, '_')}_${role}${suffix}`;
      attempts++;
    } while (usedUsernames.has(username) && attempts < 100);

    if (usedUsernames.has(username)) {
      // Fallback to UUID-based username if we can't generate unique one
      username = `${role}_${faker.string.uuid().substring(0, 8)}`;
    }

    usedUsernames.add(username);
    return username;
  };

  // Create Assistant Directors (district-wide access)
  console.log('     Creating Assistant Directors...');
  for (let i = 0; i < config.users.assistantDirectors; i++) {
    const name = faker.person.fullName();
    const username = generateUniqueUsername(name, UserRole.ad);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
        name,
        role: UserRole.ad,
        designation: 'Assistant Director',
        committeeId: null, // AD has district-wide access
        isActive: true,
      },
    });

    users.push(user);
  }

  // Create committee-specific users
  console.log('     Creating committee-specific users...');
  for (const committee of committees) {
    const usersPerCommittee = faker.number.int({
      min: config.users.perCommittee.min,
      max: config.users.perCommittee.max,
    });

    // Define role distribution for each committee
    const roleDistribution = [
      {role: UserRole.deo, count: Math.ceil(usersPerCommittee * 0.6)}, // 60% DEO
      {role: UserRole.supervisor, count: Math.ceil(usersPerCommittee * 0.3)}, // 30% Supervisor
      {role: UserRole.secretary, count: Math.ceil(usersPerCommittee * 0.1)}, // 10% Secretary
    ];

    for (const {role, count} of roleDistribution) {
      for (let i = 0; i < count; i++) {
        const name = faker.person.fullName();
        const username = generateUniqueUsername(
          `${committee.name}_${name}`,
          role
        );

        let designation: string;
        switch (role) {
          case UserRole.deo:
            designation = 'Data Entry Operator';
            break;
          case UserRole.supervisor:
            designation = 'Supervisor';
            break;
          case UserRole.secretary:
            designation = 'Secretary';
            break;
          default:
            designation = 'Staff';
        }

        const user = await prisma.user.create({
          data: {
            username,
            passwordHash: hashedPassword,
            name,
            role,
            designation,
            committeeId: committee.id,
            isActive: true,
          },
        });

        users.push(user);
      }
    }
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
      phone: faker.datatype.boolean(0.9) ? faker.phone.number() : null,
      email: faker.datatype.boolean(0.4) ? faker.internet.email() : null,
      gstNumber: hasGST ? faker.string.alphanumeric(15).toUpperCase() : null,
      panNumber: hasPAN ? faker.string.alphanumeric(10).toUpperCase() : null,
      licenseNumber: hasLicense
        ? faker.string.alphanumeric(12).toUpperCase()
        : null,
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
