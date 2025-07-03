import {
  PrismaClient,
  UserRole,
  Unit,
  NatureOfReceipt,
  CollectionLocation,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// --- DATA TO BE SEEDED ---

// Common agricultural commodities in Andhra Pradesh
const commoditiesData = [
  // Grains & Cereals
  {name: 'Rice', category: 'Grains', description: 'Paddy rice'},
  {name: 'Wheat', category: 'Grains', description: 'Wheat grain'},
  {name: 'Maize', category: 'Grains', description: 'Corn/Maize'},
  {name: 'Jowar', category: 'Grains', description: 'Sorghum'},
  {name: 'Bajra', category: 'Grains', description: 'Pearl millet'},

  // Pulses
  {name: 'Redgram', category: 'Pulses', description: 'Tur/Pigeon pea'},
  {name: 'Blackgram', category: 'Pulses', description: 'Urad dal'},
  {name: 'Greengram', category: 'Pulses', description: 'Moong dal'},
  {name: 'Bengalgram', category: 'Pulses', description: 'Chana dal'},
  {name: 'Fieldpea', category: 'Pulses', description: 'Field pea'},

  // Vegetables
  {name: 'Tomato', category: 'Vegetables', description: 'Fresh tomatoes'},
  {name: 'Onion', category: 'Vegetables', description: 'Bulb onions'},
  {name: 'Potato', category: 'Vegetables', description: 'Potato tubers'},
  {name: 'Brinjal', category: 'Vegetables', description: 'Eggplant'},
  {name: 'Okra', category: 'Vegetables', description: 'Lady finger'},
  {name: 'Cabbage', category: 'Vegetables', description: 'Cabbage heads'},
  {
    name: 'Cauliflower',
    category: 'Vegetables',
    description: 'Cauliflower heads',
  },
  {name: 'Carrot', category: 'Vegetables', description: 'Carrot roots'},
  {name: 'Beetroot', category: 'Vegetables', description: 'Beetroot'},
  {name: 'Radish', category: 'Vegetables', description: 'White radish'},

  // Fruits
  {name: 'Mango', category: 'Fruits', description: 'Mango fruits'},
  {name: 'Banana', category: 'Fruits', description: 'Banana bunches'},
  {name: 'Orange', category: 'Fruits', description: 'Orange fruits'},
  {name: 'Grapes', category: 'Fruits', description: 'Grape bunches'},
  {name: 'Apple', category: 'Fruits', description: 'Apple fruits'},
  {
    name: 'Pomegranate',
    category: 'Fruits',
    description: 'Pomegranate fruits',
  },
  {name: 'Watermelon', category: 'Fruits', description: 'Watermelon'},
  {name: 'Papaya', category: 'Fruits', description: 'Papaya fruits'},

  // Spices
  {name: 'Chilli', category: 'Spices', description: 'Red chilli'},
  {name: 'Turmeric', category: 'Spices', description: 'Turmeric rhizomes'},
  {name: 'Coriander', category: 'Spices', description: 'Coriander seeds'},
  {name: 'Cumin', category: 'Spices', description: 'Cumin seeds'},
  {name: 'Fenugreek', category: 'Spices', description: 'Fenugreek seeds'},

  // Cash Crops
  {name: 'Cotton', category: 'Cash Crops', description: 'Cotton bolls'},
  {
    name: 'Sugarcane',
    category: 'Cash Crops',
    description: 'Sugarcane stalks',
  },
  {name: 'Tobacco', category: 'Cash Crops', description: 'Tobacco leaves'},
  {name: 'Groundnut', category: 'Cash Crops', description: 'Peanuts'},
  {
    name: 'Sunflower',
    category: 'Cash Crops',
    description: 'Sunflower seeds',
  },
  {name: 'Castor', category: 'Cash Crops', description: 'Castor seeds'},

  // Coconut & Tree Products
  {
    name: 'Coconut',
    category: 'Tree Products',
    description: 'Coconut fruits',
  },
  {name: 'Arecanut', category: 'Tree Products', description: 'Betel nuts'},
  {name: 'Cashew', category: 'Tree Products', description: 'Cashew nuts'},

  // Fodder
  {name: 'Fodder', category: 'Fodder', description: 'Animal feed'},
  {name: 'Hay', category: 'Fodder', description: 'Dried grass'},
];

const committeesData = [
  {
    name: 'Karapa',
    checkposts: ['Penuguduru'],
  },
  {
    name: 'Kakinada Rural',
    checkposts: ['Atchempeta', 'Turangi Bypass'],
  },
  {
    name: 'Pithapuram',
    checkposts: ['Pithapuram', 'Chebrolu'],
  },
  {
    name: 'Tuni',
    checkposts: ['Tuni', 'K/P/Puram', 'Rekavanipalem'],
  },
  {
    name: 'Prathipadu',
    checkposts: ['Kathipudi', 'Prathipadu', 'Yerravaram'],
  },
  {
    name: 'Jaggampeta',
    checkposts: ['Jaggampeta', 'Rajupalem'],
  },
  {
    name: 'Peddapuram',
    checkposts: ['Peddapuram'],
  },
  {
    name: 'Samalkota',
    checkposts: [],
  },
  {
    name: 'Kakinada',
    checkposts: [],
  },
];

// --- HELPER FUNCTIONS ---

/**
 * Returns a random element from an array.
 * @param arr The array to pick from.
 */
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a random number between min and max (inclusive).
 * @param min The minimum value.
 * @param max The maximum value.
 */
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random date within the last year.
 */
function getRandomDate(): Date {
  const now = new Date();
  const pastDate = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );
  const randomTimestamp =
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  return new Date(randomTimestamp);
}

// Mock data for receipt generation
const firstNames = ['Ravi', 'Sita', 'Arjun', 'Priya', 'Vikram', 'Anjali'];
const lastNames = ['Kumar', 'Reddy', 'Rao', 'Gupta', 'Sharma', 'Patel'];
const cities = ['Kakinada', 'Vijayawada', 'Guntur', 'Tirupati', 'Vizag'];

// --- MAIN SEEDING FUNCTION ---

async function main() {
  console.log('Start seeding...');

  // 1. CLEAN UP DATABASE
  // Delete in reverse order of creation to avoid foreign key constraint violations
  console.log('Cleaning up existing data...');
  await prisma.receipt.deleteMany();
  await prisma.checkpost.deleteMany();
  await prisma.user.deleteMany();
  await prisma.commodity.deleteMany();
  await prisma.committee.deleteMany();
  console.log('Cleanup complete.');

  // 2. SEED COMMODITIES
  console.log('Seeding commodities...');
  await prisma.commodity.createMany({
    data: commoditiesData,
  });
  console.log(`${commoditiesData.length} commodities seeded.`);

  // 3. SEED COMMITTEES, CHECKPOSTS, AND COMMITTEE-SPECIFIC USERS
  console.log('Seeding committees, checkposts, and users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  for (const committee of committeesData) {
    // Create the committee
    const newCommittee = await prisma.committee.create({
      data: {
        name: committee.name,
        // Create associated checkposts
        checkposts: {
          create: committee.checkposts.map((cpName) => ({name: cpName})),
        },
      },
    });

    // Create users for this committee
    const usersToCreate = [
      {
        role: UserRole.deo,
        name: `DEO ${committee.name}`,
        designation: 'Data Entry Operator',
      },
      {
        role: UserRole.supervisor,
        name: `Supervisor ${committee.name}`,
        designation: 'Supervisor',
      },
      {
        role: UserRole.secretary,
        name: `Secretary ${committee.name}`,
        designation: 'Secretary',
      },
    ];

    for (const user of usersToCreate) {
      await prisma.user.create({
        data: {
          username: `${user.role.toLowerCase()}_${committee.name
            .toLowerCase()
            .replace(/\s+/g, '')}`,
          passwordHash,
          name: user.name,
          role: user.role,
          designation: user.designation,
          committeeId: newCommittee.id,
        },
      });
    }
    console.log(
      `Seeded committee: ${committee.name} with users and checkposts.`
    );
  }

  // 4. SEED ASSISTANT DIRECTOR (AD) USERS
  console.log('Seeding Assistant Director (AD) users...');
  const adUsers = [
    {username: 'ad_user1', name: 'AD Krishna'},
    {username: 'ad_user2', name: 'AD Godavari'},
    {username: 'ad_user3', name: 'AD Rayalaseema'},
  ];

  for (const ad of adUsers) {
    await prisma.user.create({
      data: {
        username: ad.username,
        passwordHash,
        name: ad.name,
        role: UserRole.ad,
        designation: 'Assistant Director',
        committeeId: null, // ADs are not tied to a specific committee
      },
    });
  }
  console.log(`${adUsers.length} AD users seeded.`);

  // 5. SEED RECEIPTS
  console.log('Generating and seeding receipts...');

  // Fetch all necessary data to avoid querying in a loop
  const allCommodities = await prisma.commodity.findMany();
  const allCommittees = await prisma.committee.findMany({
    include: {
      users: true,
      checkposts: true,
    },
  });

  const receiptsToCreate = [];
  const receiptUniquenessTracker = new Set<string>(); // To ensure [book, receipt, committee] is unique

  const TOTAL_RECEIPTS = 500;

  for (let i = 0; i < TOTAL_RECEIPTS; i++) {
    const committee = getRandomElement(allCommittees);
    const generatedByUser = getRandomElement(committee.users);
    const commodity = getRandomElement(allCommodities);

    // Generate a unique book and receipt number for the committee
    let bookNumber, receiptNumber, uniqueKey;
    do {
      bookNumber = `B${getRandomNumber(100, 200)}`;
      receiptNumber = `R${getRandomNumber(1000, 9999)}`;
      uniqueKey = `${bookNumber}-${receiptNumber}-${committee.id}`;
    } while (receiptUniquenessTracker.has(uniqueKey));
    receiptUniquenessTracker.add(uniqueKey);

    const collectionLocation = getRandomElement(
      Object.values(CollectionLocation)
    );
    let checkpostId = null;
    let collectionOtherText = null;

    if (collectionLocation === 'checkpost' && committee.checkposts.length > 0) {
      checkpostId = getRandomElement(committee.checkposts).id;
    } else if (collectionLocation === 'other') {
      collectionOtherText = 'Market Yard Survey';
    }

    const natureOfReceipt = getRandomElement(Object.values(NatureOfReceipt));
    let natureOtherText = null;
    if (natureOfReceipt === 'others') {
      natureOtherText = 'Special Fee';
    }

    const value = getRandomNumber(1000, 50000);

    const receiptData = {
      receiptDate: getRandomDate(),
      bookNumber,
      receiptNumber,
      traderName: `${getRandomElement(firstNames)} ${getRandomElement(
        lastNames
      )}`,
      traderAddress: `${getRandomNumber(1, 100)} Main St, ${getRandomElement(
        cities
      )}`,
      payeeName: `${getRandomElement(firstNames)} Enterprises`,
      payeeAddress: `Industrial Area, ${getRandomElement(cities)}`,
      commodityId: commodity.id,
      quantity: getRandomNumber(10, 500),
      unit: getRandomElement(Object.values(Unit)),
      natureOfReceipt,
      natureOtherText,
      value,
      feesPaid: value * 0.01, // Assuming 1% fee
      vehicleNumber: `AP${getRandomNumber(10, 39)}T${getRandomNumber(
        1000,
        9999
      )}`,
      invoiceNumber: `INV-${getRandomNumber(10000, 99999)}`,
      collectionLocation,
      checkpostId,
      collectionOtherText,
      officeSupervisor:
        collectionLocation === 'office'
          ? getRandomElement(
              committee.users.filter((u) => u.role === 'supervisor')
            ).name
          : null,
      receiptSignedBy: generatedByUser.name,
      generatedBy: generatedByUser.id,
      designation: generatedByUser.designation,
      committeeId: committee.id,
    };
    receiptsToCreate.push(receiptData);
  }

  // Use createMany for bulk insertion
  await prisma.receipt.createMany({
    data: receiptsToCreate,
  });

  console.log(`${TOTAL_RECEIPTS} receipts seeded successfully.`);
  console.log('Seeding finished.');
}

// --- EXECUTE SEED SCRIPT ---

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client connection
    await prisma.$disconnect();
  });
