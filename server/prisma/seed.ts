import {
  PrismaClient,
  UserRole,
  Unit,
  NatureOfReceipt,
  CollectionLocation,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {Decimal} from '@prisma/client/runtime/library';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// --- COMPREHENSIVE COMMODITIES DATA ---

const commoditiesData = [
  // I. Agricultural Group (including forest produce and dairy products)
  {
    name: 'Paddy',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Rice paddy',
  },
  {
    name: 'Rice (Raw)',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Raw rice',
  },
  {
    name: 'Rice (Boiled)',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Boiled rice',
  },
  {
    name: 'Wheat',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Wheat grain',
  },
  {
    name: 'Glumed Wheat',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Glumed wheat variety',
  },
  {
    name: 'Maize',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Corn/Maize',
  },
  {
    name: 'Jowar',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Sorghum',
  },
  {
    name: 'Cumbu',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Pearl millet',
  },
  {
    name: 'Ragi',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Finger millet',
  },
  {
    name: 'Italian Millet',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Italian millet',
  },
  {
    name: 'Sanwa Millet',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Sanwa millet',
  },
  {
    name: 'Common Millet',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Common millet',
  },
  {
    name: 'Kodo Millet',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Kodo millet',
  },
  {
    name: 'Samal',
    category: 'Agricultural Group',
    subCategory: 'Cereals',
    description: 'Samal millet',
  },

  // Pulses
  {
    name: 'Bengal Gram',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Chana dal',
  },
  {
    name: 'Red Gram',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Tur/Pigeon pea',
  },
  {
    name: 'Green Gram',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Moong dal',
  },
  {
    name: 'Black Gram',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Urad dal',
  },
  {
    name: 'Horse Gram',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Horse gram',
  },
  {
    name: 'Masur Dal',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Lentil',
  },
  {
    name: 'Lakh (Long)',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Lakh long variety',
  },
  {
    name: 'Field Bean',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Field bean',
  },
  {
    name: 'Cowpea',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Black-eyed pea',
  },
  {
    name: 'Moth',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Moth bean',
  },
  {
    name: 'Peas (Batana)',
    category: 'Agricultural Group',
    subCategory: 'Pulses',
    description: 'Field peas',
  },

  // Cash Crops and Fibers
  {
    name: 'Cotton Kapas',
    category: 'Agricultural Group',
    subCategory: 'Cash Crops',
    description: 'Raw cotton',
  },
  {
    name: 'Cotton Lint',
    category: 'Agricultural Group',
    subCategory: 'Cash Crops',
    description: 'Cotton lint',
  },
  {
    name: 'Cotton Waste',
    category: 'Agricultural Group',
    subCategory: 'Cash Crops',
    description: 'Cotton waste',
  },
  {
    name: 'Sunnhemp',
    category: 'Agricultural Group',
    subCategory: 'Fibers',
    description: 'Bombay hemp',
  },
  {
    name: 'Deccan Hemp',
    category: 'Agricultural Group',
    subCategory: 'Fibers',
    description: 'Mesta or Bimili Jute',
  },
  {
    name: 'Agave',
    category: 'Agricultural Group',
    subCategory: 'Fibers',
    description: 'Agave fiber',
  },
  {
    name: 'Coconut Fibre',
    category: 'Agricultural Group',
    subCategory: 'Fibers',
    description: 'Coir fiber',
  },

  // Oilseeds
  {
    name: 'Groundnut Pods',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Groundnut pods',
  },
  {
    name: 'Groundnut Kernels',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Groundnut kernels',
  },
  {
    name: 'Castor',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Castor seeds',
  },
  {
    name: 'Gingelly',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Sesame seeds',
  },
  {
    name: 'Nigar Seed',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Niger seeds',
  },
  {
    name: 'Safflower',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Safflower seeds',
  },
  {
    name: 'Linseed',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Flax seeds',
  },
  {
    name: 'Rape and Mustard',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Mustard seeds',
  },
  {
    name: 'Sunflower',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Sunflower seeds',
  },
  {
    name: 'Soyabean',
    category: 'Agricultural Group',
    subCategory: 'Oilseeds',
    description: 'Soybean',
  },

  // Seeds
  {
    name: 'Tobacco Seed',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Tobacco seeds',
  },
  {
    name: 'Cotton Seed',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Cotton seeds',
  },
  {
    name: 'Ambada Seed',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Ambada seeds',
  },
  {
    name: 'Sunnhemp Seed',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Sunnhemp seeds',
  },
  {
    name: 'Pillipesara',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Pillipesara seeds',
  },
  {
    name: 'Mohva Seed',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Mohva seeds',
  },
  {
    name: 'Pungam Seed',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Pungam seeds',
  },
  {
    name: 'Neem Seed',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Neem seeds',
  },
  {
    name: 'Tamarind Seed',
    category: 'Agricultural Group',
    subCategory: 'Seeds',
    description: 'Tamarind seeds',
  },

  // Tree Products
  {
    name: 'Coconut',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Coconut',
  },
  {
    name: 'Copra',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Dried coconut',
  },
  {
    name: 'Arecanut',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Betel nuts',
  },
  {
    name: 'Cashewnut (Shelled)',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Shelled cashew',
  },
  {
    name: 'Cashewnut (Unshelled)',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Unshelled cashew',
  },
  {
    name: 'Soapnuts',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Soap nuts',
  },
  {
    name: 'Chironjee',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Chironjee nuts',
  },
  {
    name: 'Sikakai',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Sikakai',
  },
  {
    name: 'Myrobelons',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Myrobelons',
  },
  {
    name: 'Eucalyptus',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Eucalyptus',
  },
  {
    name: 'Casuarina',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Casuarina',
  },
  {
    name: 'Subabul',
    category: 'Agricultural Group',
    subCategory: 'Tree Products',
    description: 'Subabul',
  },

  // Spices
  {
    name: 'Chillies',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Red chillies',
  },
  {
    name: 'Onions',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Bulb onions',
  },
  {
    name: 'Garlic',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Garlic bulbs',
  },
  {
    name: 'Turmeric',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Turmeric rhizomes',
  },
  {
    name: 'Coriander',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Coriander seeds',
  },
  {
    name: 'Cumin',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Cumin seeds',
  },
  {
    name: 'Vomum',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Vomum seeds',
  },
  {
    name: 'Soanf',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Fennel seeds',
  },
  {
    name: 'Ginger (Raw)',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Fresh ginger',
  },
  {
    name: 'Ginger (Dry)',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Dry ginger',
  },
  {
    name: 'Fenugreek',
    category: 'Agricultural Group',
    subCategory: 'Spices',
    description: 'Fenugreek seeds',
  },

  // Other Agricultural Products
  {
    name: 'Honey',
    category: 'Agricultural Group',
    subCategory: 'Other Products',
    description: 'Natural honey',
  },
  {
    name: 'Wax',
    category: 'Agricultural Group',
    subCategory: 'Other Products',
    description: 'Beeswax',
  },
  {
    name: 'Sugarcane',
    category: 'Agricultural Group',
    subCategory: 'Other Products',
    description: 'Sugarcane',
  },
  {
    name: 'Jaggery',
    category: 'Agricultural Group',
    subCategory: 'Other Products',
    description: 'Jaggery',
  },
  {
    name: 'Betel Leaves',
    category: 'Agricultural Group',
    subCategory: 'Other Products',
    description: 'Betel leaves',
  },
  {
    name: 'Tamarind',
    category: 'Agricultural Group',
    subCategory: 'Other Products',
    description: 'Tamarind',
  },
  {
    name: 'Amchur',
    category: 'Agricultural Group',
    subCategory: 'Other Products',
    description: 'Dry mango powder',
  },
  {
    name: 'Pippala Modi',
    category: 'Agricultural Group',
    subCategory: 'Other Products',
    description: 'Pippala modi',
  },

  // II. Fruit Group
  {name: 'Mango', category: 'Fruit Group', description: 'Mango fruits'},
  {name: 'Mosambi', category: 'Fruit Group', description: 'Sweet lime'},
  {name: 'Santra', category: 'Fruit Group', description: 'Santra orange'},
  {name: 'Orange', category: 'Fruit Group', description: 'Orange fruits'},
  {name: 'Banana', category: 'Fruit Group', description: 'Banana'},
  {name: 'Grapes', category: 'Fruit Group', description: 'Grape bunches'},
  {
    name: 'Pomegranates',
    category: 'Fruit Group',
    description: 'Pomegranate fruits',
  },
  {name: 'Fig', category: 'Fruit Group', description: 'Fig fruits'},
  {name: 'Sapota', category: 'Fruit Group', description: 'Sapota fruits'},
  {name: 'Musk Melon', category: 'Fruit Group', description: 'Musk melon'},
  {name: 'Water Melon', category: 'Fruit Group', description: 'Water melon'},
  {name: 'Pine Apple', category: 'Fruit Group', description: 'Pineapple'},
  {name: 'Jack Fruit', category: 'Fruit Group', description: 'Jackfruit'},
  {name: 'Papaya', category: 'Fruit Group', description: 'Papaya fruits'},
  {name: 'Guava', category: 'Fruit Group', description: 'Guava fruits'},
  {name: 'Ber', category: 'Fruit Group', description: 'Ber fruits'},
  {
    name: 'Custard Apple',
    category: 'Fruit Group',
    description: 'Custard apple',
  },
  {name: 'Wood Apple', category: 'Fruit Group', description: 'Wood apple'},
  {name: 'Jamun', category: 'Fruit Group', description: 'Jamun fruits'},
  {name: 'Falsa', category: 'Fruit Group', description: 'Falsa fruits'},
  {name: 'Pala', category: 'Fruit Group', description: 'Pala fruits'},
  {name: 'Apple', category: 'Fruit Group', description: 'Apple fruits'},

  // III. Vegetable Group
  {name: 'Cabbage', category: 'Vegetable Group', description: 'Cabbage heads'},
  {
    name: 'Cauliflower',
    category: 'Vegetable Group',
    description: 'Cauliflower heads',
  },
  {name: 'Knoolkol', category: 'Vegetable Group', description: 'Kohlrabi'},
  {name: 'Beet Root', category: 'Vegetable Group', description: 'Beetroot'},
  {name: 'Radish', category: 'Vegetable Group', description: 'Radish'},
  {name: 'Carrot', category: 'Vegetable Group', description: 'Carrot'},
  {name: 'Turnip', category: 'Vegetable Group', description: 'Turnip'},
  {name: 'Potato', category: 'Vegetable Group', description: 'Potato'},
  {name: 'Colo Casia', category: 'Vegetable Group', description: 'Colocasia'},
  {
    name: 'Sweet Potato',
    category: 'Vegetable Group',
    description: 'Sweet potato',
  },
  {name: 'Yam', category: 'Vegetable Group', description: 'Yam'},
  {name: 'Tapioca', category: 'Vegetable Group', description: 'Tapioca'},
  {
    name: 'Green Onion',
    category: 'Vegetable Group',
    description: 'Spring onions',
  },
  {name: 'Brinjal', category: 'Vegetable Group', description: 'Eggplant'},
  {name: "Lady's Finger", category: 'Vegetable Group', description: 'Okra'},
  {
    name: 'Green Chillies',
    category: 'Vegetable Group',
    description: 'Green chillies',
  },
  {name: 'Tomato', category: 'Vegetable Group', description: 'Tomatoes'},
  {name: 'Green Peas', category: 'Vegetable Group', description: 'Green peas'},
  {
    name: 'French Bean',
    category: 'Vegetable Group',
    description: 'French beans',
  },
  {
    name: 'Cluster Bean',
    category: 'Vegetable Group',
    description: 'Cluster beans',
  },
  {name: 'Sword Bean', category: 'Vegetable Group', description: 'Sword beans'},
  {
    name: 'Double Bean',
    category: 'Vegetable Group',
    description: 'Double beans',
  },
  {
    name: 'Snake Gourd',
    category: 'Vegetable Group',
    description: 'Snake gourd',
  },
  {
    name: 'Bottle Gourd',
    category: 'Vegetable Group',
    description: 'Bottle gourd',
  },
  {
    name: 'Ribbed Gourd',
    category: 'Vegetable Group',
    description: 'Ribbed gourd',
  },
  {
    name: 'Sponge Gourd',
    category: 'Vegetable Group',
    description: 'Sponge gourd',
  },
  {
    name: 'Bitter Gourd',
    category: 'Vegetable Group',
    description: 'Bitter gourd',
  },
  {name: 'Ash Gourd', category: 'Vegetable Group', description: 'Ash gourd'},
  {name: 'Khira', category: 'Vegetable Group', description: 'Khira cucumber'},
  {name: 'Pumpkin', category: 'Vegetable Group', description: 'Pumpkin'},
  {name: 'Cucumber', category: 'Vegetable Group', description: 'Cucumber'},
  {name: 'Drumstick', category: 'Vegetable Group', description: 'Drumstick'},
  {name: 'Dil Pasand', category: 'Vegetable Group', description: 'Dil pasand'},
  {name: 'Lettuce', category: 'Vegetable Group', description: 'Lettuce'},
  {
    name: 'Curry Leaf',
    category: 'Vegetable Group',
    description: 'Curry leaves',
  },
  {
    name: 'Coriander Leaf',
    category: 'Vegetable Group',
    description: 'Coriander leaves',
  },
  {
    name: 'Menthi Leaf',
    category: 'Vegetable Group',
    description: 'Fenugreek leaves',
  },
  {name: 'Palak', category: 'Vegetable Group', description: 'Spinach'},
  {
    name: 'Bachella',
    category: 'Vegetable Group',
    description: 'Malabar spinach',
  },
  {name: 'Kulfa', category: 'Vegetable Group', description: 'Purslane'},
  {name: 'Koigura', category: 'Vegetable Group', description: 'Koigura'},
  {
    name: 'Ambada Leaf',
    category: 'Vegetable Group',
    description: 'Ambada leaves',
  },
  {name: 'Chukka', category: 'Vegetable Group', description: 'Sorrel leaves'},
  {
    name: 'Ambada Flower',
    category: 'Vegetable Group',
    description: 'Ambada flowers',
  },
  {
    name: 'Amaranthus',
    category: 'Vegetable Group',
    description: 'Amaranth leaves',
  },
  {name: 'Minth', category: 'Vegetable Group', description: 'Mint leaves'},
  {
    name: 'Tamarind Flower',
    category: 'Vegetable Group',
    description: 'Tamarind flowers',
  },
  {
    name: 'Tamarind Sprout',
    category: 'Vegetable Group',
    description: 'Tamarind sprouts',
  },
  {
    name: 'Green Tamarind',
    category: 'Vegetable Group',
    description: 'Green tamarind',
  },
  {
    name: 'Culinery Banana',
    category: 'Vegetable Group',
    description: 'Cooking banana',
  },
  {
    name: 'Ponnaganti Leaf',
    category: 'Vegetable Group',
    description: 'Ponnaganti leaves',
  },
  {
    name: 'Soya Leaf',
    category: 'Vegetable Group',
    description: 'Soybean leaves',
  },
  {name: 'Lime', category: 'Vegetable Group', description: 'Lime'},
  {name: 'Karina', category: 'Vegetable Group', description: 'Karina'},
  {name: 'Koranda', category: 'Vegetable Group', description: 'Koranda'},
  {name: 'Amla', category: 'Vegetable Group', description: 'Indian gooseberry'},
  {
    name: 'Adonda and Donda',
    category: 'Vegetable Group',
    description: 'Adonda and Donda',
  },
  {name: 'Hari Boot', category: 'Vegetable Group', description: 'Hari boot'},

  // IV. Fish Group
  {
    name: 'Live Fish',
    category: 'Fish Group',
    description: 'Live fish including fish with or without life',
  },
  {name: 'Dry Fish', category: 'Fish Group', description: 'Dried fish'},
  {
    name: 'Live Prawn',
    category: 'Fish Group',
    description: 'Live prawn including prawn with or without life',
  },
  {name: 'Dry Prawn', category: 'Fish Group', description: 'Dried prawn'},

  // V. Livestock Group
  {name: 'Bull', category: 'Livestock Group', description: 'Bull cattle'},
  {name: 'Bullock', category: 'Livestock Group', description: 'Bullock'},
  {name: 'Cow', category: 'Livestock Group', description: 'Cow'},
  {name: 'Heifer', category: 'Livestock Group', description: 'Heifer'},
  {
    name: 'Buffalo (Bull)',
    category: 'Livestock Group',
    description: 'Buffalo bull',
  },
  {
    name: 'Buffalo (He)',
    category: 'Livestock Group',
    description: 'Male buffalo',
  },
  {
    name: 'Buffalo (She)',
    category: 'Livestock Group',
    description: 'Female buffalo',
  },
  {
    name: 'Young Buffalo',
    category: 'Livestock Group',
    description: 'Young buffalo stock',
  },
  {name: 'Sheep', category: 'Livestock Group', description: 'Sheep'},
  {name: 'Goats', category: 'Livestock Group', description: 'Goats'},

  // VI. Livestock Product Group
  {
    name: 'Raw Hides',
    category: 'Livestock Product Group',
    description: 'Raw animal hides',
  },
  {
    name: 'Raw Skins',
    category: 'Livestock Product Group',
    description: 'Raw animal skins',
  },
  {
    name: 'Bones',
    category: 'Livestock Product Group',
    description: 'Animal bones',
  },
  {
    name: 'Horn and Hoof',
    category: 'Livestock Product Group',
    description: 'Horn and hoof',
  },
  {
    name: 'Hair and Wool',
    category: 'Livestock Product Group',
    description: 'Animal hair and wool',
  },
  {
    name: 'Ghee',
    category: 'Livestock Product Group',
    description: 'Clarified butter',
  },

  // VII. Poultry Group
  {name: 'Hens', category: 'Poultry Group', description: 'Hens'},
  {name: 'Ducks', category: 'Poultry Group', description: 'Ducks'},
  {name: 'Cocks', category: 'Poultry Group', description: 'Roosters'},

  // VIII. Products of Poultry Group
  {
    name: 'Hen Eggs',
    category: 'Poultry Product Group',
    description: 'Hen eggs',
  },
  {
    name: 'Duck Eggs',
    category: 'Poultry Product Group',
    description: 'Duck eggs',
  },

  // IX. Flower Group
  {
    name: 'Jasmine (Mogra)',
    category: 'Flower Group',
    description: 'Mogra variety jasmine',
  },
  {
    name: 'Jasmine (Mallepuvu)',
    category: 'Flower Group',
    description: 'Mallepuvu jasmine',
  },
  {name: 'Lillies', category: 'Flower Group', description: 'Lily flowers'},
  {name: 'Aster', category: 'Flower Group', description: 'Aster flowers'},
  {name: 'Crossandra', category: 'Flower Group', description: 'Kanakambaram'},
  {
    name: 'Chrysanthemum',
    category: 'Flower Group',
    description: 'Chamanthi flowers',
  },
  {name: 'Marigold', category: 'Flower Group', description: 'Banthi flowers'},
  {name: 'Roses', category: 'Flower Group', description: 'Gulabi roses'},
  {name: 'Oleander', category: 'Flower Group', description: 'Ganneru flowers'},
  {
    name: 'Pandanus',
    category: 'Flower Group',
    description: 'Moggili or Kevada',
  },
  {name: 'Dawanam', category: 'Flower Group', description: 'Dawanam flowers'},
  {name: 'Mavuram', category: 'Flower Group', description: 'Mavuram flowers'},
  {
    name: 'Jasmine (Kakada)',
    category: 'Flower Group',
    description: 'Kakada variety jasmine',
  },
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
