import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function seedCommodities() {
  try {
    console.log('Starting commodity seeding...');

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

    // Create commodities
    for (const commodityData of commoditiesData) {
      const existingCommodity = await prisma.commodity.findUnique({
        where: {name: commodityData.name},
      });

      if (!existingCommodity) {
        const commodity = await prisma.commodity.create({
          data: commodityData,
        });
        console.log(
          `Created commodity: ${commodity.name} (${commodity.category})`
        );
      } else {
        console.log(`Commodity already exists: ${commodityData.name}`);
      }
    }

    console.log('Commodity seeding completed successfully!');

    // Display summary
    const totalCommodities = await prisma.commodity.count();
    const categorySummary = await prisma.commodity.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
    });

    console.log(`\nSummary:`);
    console.log(`Total commodities: ${totalCommodities}`);
    console.log(`By category:`);
    categorySummary.forEach((cat) => {
      console.log(`  ${cat.category}: ${cat._count.id} commodities`);
    });
  } catch (error) {
    console.error('Error during commodity seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCommodities().catch((e) => {
  console.error(e);
  process.exit(1);
});
