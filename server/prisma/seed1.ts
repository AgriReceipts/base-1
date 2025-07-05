import {
  PrismaClient,
  UserRole,
  Unit,
  NatureOfReceipt,
  CollectionLocation,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {Decimal} from '@prisma/client/runtime/library';
import {committeesData, commoditiesData} from './data';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// --- COMPREHENSIVE COMMODITIES DATA ---

// Sample trader data
const tradersData = [
  {
    name: 'Ravi Kumar Traders',
    address: '123 Market Street, Kakinada',
    phone: '9876543210',
    email: 'ravi.kumar@email.com',
    gstNumber: '37ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    licenseNumber: 'LIC123456',
  },
  {
    name: 'Sita Enterprises',
    address: '456 Commercial Road, Pithapuram',
    phone: '9876543211',
    email: 'sita.enterprises@email.com',
    gstNumber: '37FGHIJ5678K2Z5',
    panNumber: 'FGHIJ5678K',
    licenseNumber: 'LIC234567',
  },
  {
    name: 'Arjun Agro Products',
    address: '789 Agriculture Lane, Tuni',
    phone: '9876543212',
    email: 'arjun.agro@email.com',
    gstNumber: '37KLMNO9012L3Z5',
    panNumber: 'KLMNO9012L',
    licenseNumber: 'LIC345678',
  },
  {
    name: 'Priya Trading Co.',
    address: '101 Wholesale Market, Samalkota',
    phone: '9876543213',
    email: 'priya.trading@email.com',
    gstNumber: '37PQRST3456M4Z5',
    panNumber: 'PQRST3456M',
    licenseNumber: 'LIC456789',
  },
  {
    name: 'Vikram Commodities',
    address: '202 Grain Market, Prathipadu',
    phone: '9876543214',
    email: 'vikram.commodities@email.com',
    gstNumber: '37UVWXY7890N5Z5',
    panNumber: 'UVWXY7890N',
    licenseNumber: 'LIC567890',
  },
  {
    name: 'Anjali Spices',
    address: '303 Spice Bazaar, Jaggampeta',
    phone: '9876543215',
    email: 'anjali.spices@email.com',
    gstNumber: '37ZABCD1234O6Z5',
    panNumber: 'ZABCD1234O',
    licenseNumber: 'LIC678901',
  },
  {
    name: 'Ramesh Vegetables',
    address: '404 Vegetable Market, Peddapuram',
    phone: '9876543216',
    email: 'ramesh.vegetables@email.com',
    gstNumber: '37BEFGH5678P7Z5',
    panNumber: 'BEFGH5678P',
    licenseNumber: 'LIC789012',
  },
  {
    name: 'Lakshmi Fruits',
    address: '505 Fruit Market, Karapa',
    phone: '9876543217',
    email: 'lakshmi.fruits@email.com',
    gstNumber: '37CIJKL9012Q8Z5',
    panNumber: 'CIJKL9012Q',
    licenseNumber: 'LIC890123',
  },
];

// --- HELPER FUNCTIONS ---

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Continuation of the seeding script

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = Math.random() * (end - start) + start;
  return new Date(randomTime);
}

function generateCommitteeUsernames(committeeName: string): string[] {
  const cleanName = committeeName.toLowerCase().replace(/\s+/g, '');
  return [
    `deo_${cleanName}`,
    `supervisor_${cleanName}`,
    `secretary_${cleanName}`,
  ];
}

// --- SEEDING FUNCTIONS ---

async function seedCommodities() {
  console.log('🌱 Seeding commodities...');

  for (const commodity of commoditiesData) {
    await prisma.commodity.upsert({
      where: {name: commodity.name},
      update: {
        category: commodity.category,
        subCategory: commodity.subCategory,
        description: commodity.description,
      },
      create: {
        name: commodity.name,
        category: commodity.category,
        subCategory: commodity.subCategory,
        description: commodity.description,
      },
    });
  }

  console.log(`✅ Seeded ${commoditiesData.length} commodities`);
}

async function seedCommitteesAndCheckposts() {
  console.log('🌱 Seeding committees and checkposts...');

  for (const committeeData of committeesData) {
    const committee = await prisma.committee.upsert({
      where: {name: committeeData.name},
      update: {},
      create: {
        name: committeeData.name,
      },
    });

    // Seed checkposts for this committee
    for (const checkpostName of committeeData.checkposts) {
      await prisma.checkpost.upsert({
        where: {
          id: `${committee.id}_${checkpostName}`, // Composite key simulation
        },
        update: {},
        create: {
          name: checkpostName,
          committeeId: committee.id,
        },
      });
    }
  }

  console.log(
    `✅ Seeded ${committeesData.length} committees and their checkposts`
  );
}

async function seedTraders() {
  console.log('🌱 Seeding traders...');

  for (const traderData of tradersData) {
    await prisma.trader.upsert({
      where: {
        name: traderData.name,
      },
      update: {},
      create: {
        name: traderData.name,
        address: traderData.address,
        phone: traderData.phone,
        email: traderData.email,
        gstNumber: traderData.gstNumber,
        panNumber: traderData.panNumber,
        licenseNumber: traderData.licenseNumber,
        isActive: true,
      },
    });
  }

  console.log(`✅ Seeded ${tradersData.length} traders`);
}

async function seedUsers() {
  console.log('🌱 Seeding users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Get all committees
  const committees = await prisma.committee.findMany();

  // Create committee users (DEO, Supervisor, Secretary)
  for (const committee of committees) {
    const usernames = generateCommitteeUsernames(committee.name);
    const roles: UserRole[] = ['deo', 'supervisor', 'secretary'];

    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];
      const role = roles[i];

      await prisma.user.upsert({
        where: {username},
        update: {},
        create: {
          username,
          passwordHash: hashedPassword,
          name: `${role.charAt(0).toUpperCase() + role.slice(1)} - ${
            committee.name
          }`,
          role,
          committeeId: committee.id,
          designation: role.charAt(0).toUpperCase() + role.slice(1),
          isActive: true,
        },
      });
    }
  }

  // Create Assistant Director users (no committee association)
  const adUsernames = ['ad_user1', 'ad_user2', 'ad_user3'];

  for (const username of adUsernames) {
    await prisma.user.upsert({
      where: {username},
      update: {},
      create: {
        username,
        passwordHash: hashedPassword,
        name: `Assistant Director - ${username.split('_')[1]}`,
        role: 'ad',
        committeeId: null,
        designation: 'Assistant Director',
        isActive: true,
      },
    });
  }

  const totalUsers = committees.length * 3 + adUsernames.length;
  console.log(`✅ Seeded ${totalUsers} users`);
}

async function seedSampleReceipts() {
  console.log('🌱 Seeding sample receipts...');

  // Get all necessary data
  const committees = await prisma.committee.findMany({
    include: {
      checkposts: true,
      users: true,
    },
  });

  const commodities = await prisma.commodity.findMany();
  const traders = await prisma.trader.findMany();

  const units: Unit[] = ['kilograms', 'quintals', 'numbers', 'bags'];
  const natures: NatureOfReceipt[] = ['mf', 'lc', 'uc', 'others'];
  const locations: CollectionLocation[] = ['office', 'checkpost', 'other'];

  // Generate sample receipts for each committee
  for (const committee of committees) {
    const receiptCount = getRandomNumber(10, 25);

    for (let i = 0; i < receiptCount; i++) {
      const commodity = getRandomElement(commodities);
      const trader = getRandomElement(traders);
      const unit = getRandomElement(units);
      const nature = getRandomElement(natures);
      const location = getRandomElement(locations);
      const user = getRandomElement(committee.users);

      // Generate quantities based on unit
      let quantity: number;
      let weightPerBag: number | null = null;
      let totalWeightKg: number | null = null;

      switch (unit) {
        case 'kilograms':
          quantity = getRandomNumber(10, 1000);
          totalWeightKg = quantity;
          break;
        case 'quintals':
          quantity = getRandomNumber(1, 100);
          totalWeightKg = quantity * 100;
          break;
        case 'numbers':
          quantity = getRandomNumber(1, 1000);
          break;
        case 'bags':
          quantity = getRandomNumber(1, 200);
          weightPerBag = getRandomNumber(25, 50);
          totalWeightKg = quantity * weightPerBag;
          break;
      }

      const value = getRandomNumber(1000, 50000);
      const feesPaid = Math.floor(value * 0.01 * getRandomNumber(1, 5)); // 1-5% of value

      const receiptDate = getRandomDate(
        new Date('2024-01-01'),
        new Date('2024-12-31')
      );

      const bookNumber = `BK${getRandomNumber(1, 10)}`;
      const receiptNumber = `${i + 1}`.padStart(4, '0');

      try {
        await prisma.receipt.create({
          data: {
            receiptDate,
            bookNumber,
            receiptNumber,
            traderId: trader.id,
            payeeName: trader.name,
            payeeAddress: trader.address,
            commodityId: commodity.id,
            quantity: new Decimal(quantity),
            unit,
            weightPerBag: weightPerBag ? new Decimal(weightPerBag) : null,
            totalWeightKg: totalWeightKg ? new Decimal(totalWeightKg) : null,
            natureOfReceipt: nature,
            natureOtherText: nature === 'others' ? 'Other charges' : null,
            value: new Decimal(value),
            feesPaid: new Decimal(feesPaid),
            vehicleNumber:
              Math.random() > 0.5
                ? `AP${getRandomNumber(10, 99)}${String.fromCharCode(
                    65 + getRandomNumber(0, 25)
                  )}${String.fromCharCode(
                    65 + getRandomNumber(0, 25)
                  )}${getRandomNumber(1000, 9999)}`
                : null,
            invoiceNumber:
              Math.random() > 0.3 ? `INV${getRandomNumber(1000, 9999)}` : null,
            collectionLocation: location,
            officeSupervisor:
              location === 'office' ? 'Office Supervisor' : null,
            checkpostId:
              location === 'checkpost' && committee.checkposts.length > 0
                ? getRandomElement(committee.checkposts).id
                : null,
            collectionOtherText:
              location === 'other' ? 'Other collection point' : null,
            receiptSignedBy: user.name,
            generatedBy: user.id,
            designation: user.designation,
            committeeId: committee.id,
          },
        });
      } catch (error) {
        // Skip duplicates (unique constraint on book + receipt number)
        if (typeof error === 'object' && error !== null && 'code' in error) {
          const err = error as {code: string};

          if (err.code !== 'P2002') {
            console.error('Unhandled error:', err);
          }
        } else {
          console.error('Unknown error:', error);
        }
      }
    }
  }

  console.log('✅ Seeded sample receipts');
}

// --- MAIN SEEDING FUNCTION ---

async function main() {
  console.log('🚀 Starting database seeding...');

  try {
    // Seed in order of dependencies
    await seedCommodities();
    await seedCommitteesAndCheckposts();
    await seedTraders();
    await seedUsers();
    await seedSampleReceipts();

    console.log('✅ Database seeding completed successfully!');

    // Print summary
    const counts = await Promise.all([
      prisma.commodity.count(),
      prisma.committee.count(),
      prisma.checkpost.count(),
      prisma.trader.count(),
      prisma.user.count(),
      prisma.receipt.count(),
    ]);

    console.log('\n📊 Database Summary:');
    console.log(`- Commodities: ${counts[0]}`);
    console.log(`- Committees: ${counts[1]}`);
    console.log(`- Checkposts: ${counts[2]}`);
    console.log(`- Traders: ${counts[3]}`);
    console.log(`- Users: ${counts[4]}`);
    console.log(`- Receipts: ${counts[5]}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Execute the seeding
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
