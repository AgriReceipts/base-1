import {PrismaClient} from '@prisma/client';
import {
  UserRole,
  Unit,
  NatureOfReceipt,
  CollectionLocation,
} from '@prisma/client';

const prisma = new PrismaClient();

// Sample data arrays - More realistic Indian agricultural data
const traderNames = [
  'Raj Kumar Singh',
  'Priya Sharma',
  'Amit Patel',
  'Sunita Devi',
  'Manoj Gupta',
  'Kavita Joshi',
  'Rahul Verma',
  'Geeta Kumari',
  'Suresh Yadav',
  'Pooja Agarwal',
  'Vikram Singh',
  'Neeta Mishra',
  'Ravi Kumar',
  'Sita Devi',
  'Ashok Pandey',
  'Meera Rani',
  'Deepak Jain',
  'Rekha Sharma',
  'Ramesh Chandra',
  'Lakshmi Bai',
  'Govind Prasad',
  'Kamla Devi',
  'Shyam Lal',
  'Radha Kumari',
  'Babu Lal Yadav',
];

const addresses = [
  'Main Market, Sector 15',
  'Gandhi Nagar, Block A',
  'Civil Lines, Ward 12',
  'Sadar Bazaar, Shop 45',
  'Railway Station Road',
  'Bus Stand Area',
  'New Colony, House 23',
  'Old City, Gali 7',
  'Industrial Area, Plot 12',
  'Kisan Mandi, Stall 8',
  'Vegetable Market',
  'Grain Market, Shop 15',
  'Farmers Colony, Plot 34',
  'Krishi Upaj Mandi',
  'Wholesale Market, Section B',
];

const commodities = [
  'Wheat',
  'Rice',
  'Maize',
  'Barley',
  'Millet',
  'Soybean',
  'Mustard',
  'Groundnut',
  'Cotton',
  'Sugarcane',
  'Onion',
  'Potato',
  'Tomato',
  'Chili',
  'Turmeric',
  'Coriander',
  'Cumin',
  'Garlic',
  'Ginger',
  'Jute',
  'Bajra',
  'Jowar',
  'Arhar',
  'Moong',
  'Urad',
  'Sesame',
  'Sunflower',
];

const vehicleNumbers = [
  'UP32AB1234',
  'DL8CAB5678',
  'MH12CD9876',
  'RJ14EF3456',
  'GJ05GH7890',
  'PB03IJ2345',
  'HR26KL6789',
  'KA09MN1234',
  'TN43OP5678',
  'AP28QR9012',
  'MP09CD5678',
  'UP14GH2345',
  'RJ27KL8901',
  'PB65MN4567',
  'HR51PQ7890',
];

const officeSupervisors = ['Supervisor 1', 'Supervisor 2'];

// Helper function to generate random date within a range
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Helper function to get random element from array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate random decimal between min and max
function randomDecimal(min: number, max: number, decimals: number = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.receipt.deleteMany();
  await prisma.checkpost.deleteMany();
  await prisma.user.deleteMany();
  await prisma.committee.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create Committees with more realistic names
  const committees = await Promise.all([
    prisma.committee.create({
      data: {
        name: 'Central Agricultural Produce Market Committee',
      },
    }),
    prisma.committee.create({
      data: {
        name: 'North District APMC',
      },
    }),
    prisma.committee.create({
      data: {
        name: 'South District APMC',
      },
    }),
    prisma.committee.create({
      data: {
        name: 'East District APMC',
      },
    }),
    prisma.committee.create({
      data: {
        name: 'West District APMC',
      },
    }),
  ]);

  console.log('✅ Created committees');

  // Create Users for each committee with proper designations
  const users = [];
  for (const committee of committees) {
    const shortName = committee.name.split(' ')[0].toLowerCase();
    const committeeUsers = await Promise.all([
      prisma.user.create({
        data: {
          username: `deo_${shortName}`,
          passwordHash: '$2b$10$example.hash.for.deo', // In real app, hash properly
          name: `${committee.name} - DEO`,
          role: UserRole.deo,
          committeeId: committee.id,
          designation: 'Data Entry Operator',
        },
      }),
      prisma.user.create({
        data: {
          username: `supervisor_${shortName}`,
          passwordHash: '$2b$10$example.hash.for.supervisor',
          name: `${committee.name} - Supervisor`,
          role: UserRole.supervisor,
          committeeId: committee.id,
          designation: 'Supervisor',
        },
      }),
      prisma.user.create({
        data: {
          username: `secretary_${shortName}`,
          passwordHash: '$2b$10$example.hash.for.secretary',
          name: `${committee.name} - Secretary`,
          role: UserRole.secretary,
          committeeId: committee.id,
          designation: 'Secretary',
        },
      }),
    ]);
    users.push(...committeeUsers);
  }

  // Create district-level ADs (not assigned to specific committees)
  const districtADs = await Promise.all([
    prisma.user.create({
      data: {
        username: 'ad_north',
        passwordHash: '$2b$10$example.hash.for.ad',
        name: 'Assistant Director - North Region',
        role: UserRole.ad,
        committeeId: null, // ADs are not assigned to specific committees
        designation: 'Assistant Director',
      },
    }),
    prisma.user.create({
      data: {
        username: 'ad_south',
        passwordHash: '$2b$10$example.hash.for.ad',
        name: 'Assistant Director - South Region',
        role: UserRole.ad,
        committeeId: null,
        designation: 'Assistant Director',
      },
    }),
  ]);
  users.push(...districtADs);

  console.log('✅ Created users');

  // Create Checkposts
  const checkposts = [];
  for (const committee of committees) {
    const committeeCheckposts = await Promise.all([
      prisma.checkpost.create({
        data: {
          name: `${committee.name} - Main Gate`,
          committeeId: committee.id,
        },
      }),
      prisma.checkpost.create({
        data: {
          name: `${committee.name} - Entry Point A`,
          committeeId: committee.id,
        },
      }),
      prisma.checkpost.create({
        data: {
          name: `${committee.name} - Entry Point B`,
          committeeId: committee.id,
        },
      }),
    ]);
    checkposts.push(...committeeCheckposts);
  }

  console.log('✅ Created checkposts');

  // Create Receipts with varying timelines (150 receipts) - More realistic distribution
  const receipts = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2024-12-31');

  // Generate receipts with realistic market fee distribution (60% market fees, 40% other types)
  for (let i = 1; i <= 150; i++) {
    const committee = randomElement(committees);
    const committeeUsers = users.filter(
      (u) => u.committeeId === committee.id && u.role !== UserRole.ad
    );
    const committeeCheckposts = checkposts.filter(
      (c) => c.committeeId === committee.id
    );
    const user = randomElement(committeeUsers); // Only DEO, Supervisor, Secretary can create receipts

    const receiptDate = randomDate(startDate, endDate);
    const quantity = randomDecimal(1, 1000);
    const unitRate = randomDecimal(15, 800); // More realistic price range
    const value = Number((quantity * unitRate).toFixed(2));

    // Nature of receipt distribution: 60% market fees, 15% license, 15% user charge, 10% others
    let natureOfReceipt: NatureOfReceipt;
    const rand = Math.random();
    if (rand < 0.6) {
      natureOfReceipt = NatureOfReceipt.mf; // Market fees - most common
    } else if (rand < 0.75) {
      natureOfReceipt = NatureOfReceipt.lc; // License
    } else if (rand < 0.9) {
      natureOfReceipt = NatureOfReceipt.uc; // User charge
    } else {
      natureOfReceipt = NatureOfReceipt.others;
    }

    // Realistic fee calculation based on nature
    let feesPaid: number;
    if (natureOfReceipt === NatureOfReceipt.mf) {
      feesPaid = Number((value * randomDecimal(0.01, 0.03)).toFixed(2)); // 1-3% for market fees
    } else if (natureOfReceipt === NatureOfReceipt.lc) {
      feesPaid = randomDecimal(100, 500); // Fixed license fees
    } else if (natureOfReceipt === NatureOfReceipt.uc) {
      feesPaid = randomDecimal(50, 200); // Fixed user charges
    } else {
      feesPaid = randomDecimal(25, 300); // Variable other fees
    }

    const collectionLocation = randomElement(Object.values(CollectionLocation));

    const receiptData = {
      receiptDate,
      bookNumber: `BK${Math.floor(Math.random() * 999) + 1}`,
      receiptNumber: `${committee.name.substring(0, 3).toUpperCase()}${String(
        i
      ).padStart(4, '0')}`,
      traderName: randomElement(traderNames),
      traderAddress: randomElement(addresses),
      payeeName: randomElement(traderNames),
      payeeAddress: randomElement(addresses),
      commodity: randomElement(commodities),
      quantity,
      unit: randomElement(Object.values(Unit)),
      natureOfReceipt,
      natureOtherText:
        natureOfReceipt === NatureOfReceipt.others
          ? randomElement([
              'Processing Fee',
              'Storage Fee',
              'Cleaning Charges',
              'Weighing Charges',
            ])
          : null,
      value,
      feesPaid,
      vehicleNumber: Math.random() > 0.4 ? randomElement(vehicleNumbers) : null,
      invoiceNumber:
        Math.random() > 0.3
          ? `INV${Math.floor(Math.random() * 9999) + 1000}`
          : null,
      collectionLocation,
      officeSupervisor:
        collectionLocation === CollectionLocation.office
          ? randomElement(officeSupervisors)
          : null,
      checkpostId:
        collectionLocation === CollectionLocation.checkpost
          ? randomElement(committeeCheckposts).id
          : null,
      collectionOtherText:
        collectionLocation === CollectionLocation.other
          ? randomElement([
              'Mobile Collection Unit',
              'Field Collection Point',
              'Temporary Booth',
            ])
          : null,
      generatedBy: user.id,
      designation: user.designation,
      committeeId: committee.id,
    };

    try {
      const receipt = await prisma.receipt.create({
        data: receiptData,
      });
      receipts.push(receipt);
    } catch (error) {
      // If duplicate book+receipt number, try with different numbers
      console.log(`Retrying receipt ${i} due to duplicate constraint`);
      const uniqueReceiptData = {
        ...receiptData,
        bookNumber: `BK${Math.floor(Math.random() * 9999) + 1000}`,
        receiptNumber: `${committee.name.substring(0, 3).toUpperCase()}${String(
          i + 10000
        ).padStart(6, '0')}`,
      };
      const receipt = await prisma.receipt.create({
        data: uniqueReceiptData,
      });
      receipts.push(receipt);
    }
  }

  console.log('✅ Created receipts');

  // Create additional receipts for recent months (2024) for better analytics
  const currentYearStart = new Date('2024-01-01');
  const currentYearEnd = new Date('2024-12-31');

  for (let i = 151; i <= 200; i++) {
    const committee = randomElement(committees);
    const committeeUsers = users.filter(
      (u) => u.committeeId === committee.id && u.role !== UserRole.ad
    );
    const committeeCheckposts = checkposts.filter(
      (c) => c.committeeId === committee.id
    );
    const user = randomElement(committeeUsers);

    const receiptDate = randomDate(currentYearStart, currentYearEnd);
    const quantity = randomDecimal(1, 1000);
    const unitRate = randomDecimal(15, 800);
    const value = Number((quantity * unitRate).toFixed(2));

    // Higher percentage of market fees for recent data
    let natureOfReceipt: NatureOfReceipt;
    const rand = Math.random();
    if (rand < 0.7) {
      natureOfReceipt = NatureOfReceipt.mf; // 70% market fees
    } else if (rand < 0.85) {
      natureOfReceipt = NatureOfReceipt.lc;
    } else if (rand < 0.95) {
      natureOfReceipt = NatureOfReceipt.uc;
    } else {
      natureOfReceipt = NatureOfReceipt.others;
    }

    let feesPaid: number;
    if (natureOfReceipt === NatureOfReceipt.mf) {
      feesPaid = Number((value * randomDecimal(0.015, 0.025)).toFixed(2));
    } else if (natureOfReceipt === NatureOfReceipt.lc) {
      feesPaid = randomDecimal(150, 600);
    } else if (natureOfReceipt === NatureOfReceipt.uc) {
      feesPaid = randomDecimal(75, 250);
    } else {
      feesPaid = randomDecimal(50, 400);
    }

    const collectionLocation = randomElement(Object.values(CollectionLocation));

    const receiptData = {
      receiptDate,
      bookNumber: `BK${Math.floor(Math.random() * 9999) + 2000}`,
      receiptNumber: `${committee.name.substring(0, 3).toUpperCase()}${String(
        i
      ).padStart(4, '0')}`,
      traderName: randomElement(traderNames),
      traderAddress: randomElement(addresses),
      payeeName: randomElement(traderNames),
      payeeAddress: randomElement(addresses),
      commodity: randomElement(commodities),
      quantity,
      unit: randomElement(Object.values(Unit)),
      natureOfReceipt,
      natureOtherText:
        natureOfReceipt === NatureOfReceipt.others
          ? randomElement([
              'Documentation Fee',
              'Certification Charges',
              'Quality Testing Fee',
            ])
          : null,
      value,
      feesPaid,
      vehicleNumber: Math.random() > 0.3 ? randomElement(vehicleNumbers) : null,
      invoiceNumber:
        Math.random() > 0.25
          ? `INV${Math.floor(Math.random() * 9999) + 2000}`
          : null,
      collectionLocation,
      officeSupervisor:
        collectionLocation === CollectionLocation.office
          ? randomElement(officeSupervisors)
          : null,
      checkpostId:
        collectionLocation === CollectionLocation.checkpost
          ? randomElement(committeeCheckposts).id
          : null,
      collectionOtherText:
        collectionLocation === CollectionLocation.other
          ? randomElement([
              'Online Collection',
              'Door-to-Door Service',
              'Market Extension Counter',
            ])
          : null,
      generatedBy: user.id,
      designation: user.designation,
      committeeId: committee.id,
    };

    try {
      await prisma.receipt.create({
        data: receiptData,
      });
    } catch (error) {
      // If duplicate, try with different numbers
      const uniqueReceiptData = {
        ...receiptData,
        bookNumber: `BK${Math.floor(Math.random() * 9999) + 5000}`,
        receiptNumber: `${committee.name.substring(0, 3).toUpperCase()}${String(
          i + 20000
        ).padStart(6, '0')}`,
      };
      await prisma.receipt.create({
        data: uniqueReceiptData,
      });
    }
  }

  console.log('✅ Created additional current year receipts');

  // Print summary
  const totalCommittees = await prisma.committee.count();
  const totalUsers = await prisma.user.count();
  const totalCheckposts = await prisma.checkpost.count();
  const totalReceipts = await prisma.receipt.count();

  console.log('\n📊 Seed Summary:');
  console.log(`- Committees: ${totalCommittees}`);
  console.log(`- Users: ${totalUsers}`);
  console.log(`- Checkposts: ${totalCheckposts}`);
  console.log(`- Receipts: ${totalReceipts}`);

  console.log('\n🎯 Data Distribution:');
  console.log('- Receipt dates: 2023-2024 (varying timeline)');
  console.log('- 5 committees with 3 users each (DEO, Supervisor, Secretary)');
  console.log(
    '- 2 district-level Assistant Directors (not committee-specific)'
  );
  console.log(
    '- 60% market fees, 40% other receipt types (realistic distribution)'
  );
  console.log('- Various commodities, units, and collection locations');
  console.log(
    '- Office supervisors: "Supervisor 1" or "Supervisor 2" as per business rules'
  );
  console.log('- Realistic Indian agricultural data and fee structures');
  console.log(
    '- Role-based receipt creation (only DEO, Supervisor, Secretary create receipts)'
  );

  console.log('\n📋 Role Responsibilities Implemented:');
  console.log('- DEO: Can create & edit receipts (committee-level)');
  console.log('- Supervisor/Secretary: Can create receipts (committee-level)');
  console.log('- AD: District-wide access, cannot create receipts');
  console.log('- Market fees properly calculated for analytics');

  console.log('\n🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
