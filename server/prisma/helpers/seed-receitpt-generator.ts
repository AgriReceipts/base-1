// File: ./seed-data-generator.ts
import {Unit, NatureOfReceipt, CollectionLocation} from '@prisma/client';
import {faker} from '@faker-js/faker';

// Helper function to select commodity with weighted distribution
function selectCommodityWeighted(commodities: any[]): any {
  if (commodities.length === 0) {
    throw new Error('Commodities array cannot be empty');
  }

  // Create weighted distribution: top 5 commodities get 40% (8% each), rest get 60%
  const topCommoditiesCount = Math.min(5, commodities.length);
  const remainingCommoditiesCount = commodities.length - topCommoditiesCount;

  const random = Math.random();

  // 40% chance for top 5 commodities (8% each)
  if (random < 0.4) {
    const topIndex = Math.floor(random / 0.08); // 0.08 = 8% each
    return commodities[Math.min(topIndex, topCommoditiesCount - 1)];
  }

  // 60% chance for remaining commodities
  if (remainingCommoditiesCount > 0) {
    const remainingIndex = Math.floor(
      Math.random() * remainingCommoditiesCount
    );
    return commodities[topCommoditiesCount + remainingIndex];
  }

  // Fallback to top commodities if no remaining ones
  return commodities[Math.floor(Math.random() * topCommoditiesCount)];
}

export async function generateReceiptData(
  receiptDate: Date,
  committee: any,
  committeeUsers: any[],
  committeeCheckposts: any[],
  traders: any[],
  commodities: any[],
  sequenceNumber: number
): Promise<any> {
  const generatedBy = faker.helpers.arrayElement(committeeUsers);
  const trader = faker.helpers.arrayElement(traders);

  // Commodity is now mandatory - use weighted selection
  const commodity = selectCommodityWeighted(commodities);

  // Generate deterministic and unique book/receipt numbers
  const dateStr = receiptDate.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const bookNumber = `${committee.id.slice(-4)}${dateStr}`;
  const receiptNumber = `${bookNumber}-${sequenceNumber
    .toString()
    .padStart(4, '0')}`;

  const unit = faker.helpers.arrayElement(Object.values(Unit));
  let quantity = faker.number.float({min: 1, max: 1000, fractionDigits: 2});
  let weightPerBag = null;
  let totalWeightKg = null;

  switch (unit) {
    case Unit.bags:
      weightPerBag = faker.number.float({min: 25, max: 100, fractionDigits: 2});
      totalWeightKg = quantity * weightPerBag;
      break;
    case Unit.quintals:
      totalWeightKg = quantity * 100;
      break;
    case Unit.kilograms:
      totalWeightKg = quantity;
      break;
    case Unit.numbers:
      totalWeightKg = quantity * faker.number.float({min: 0.1, max: 10});
      break;
  }

  // Value in lakhs (3-10 lakhs or more)
  const value = faker.number.float({
    min: 300000,
    max: 1500000,
    fractionDigits: 2,
  }); // 3-15 lakhs

  // 90% market fees (1% of value), 10% other fees (0.5-2% of value)
  const isMarketFee = Math.random() < 0.9;
  const feesPaid = isMarketFee
    ? value * 0.01 // 1% for market fees
    : value * faker.number.float({min: 0.005, max: 0.02, fractionDigits: 4}); // 0.5-2% for other fees

  const natureOfReceipt = faker.helpers.arrayElement(
    Object.values(NatureOfReceipt)
  );
  const natureOtherText =
    natureOfReceipt === NatureOfReceipt.others ? faker.lorem.words(3) : null;

  const collectionLocation = faker.helpers.arrayElement(
    Object.values(CollectionLocation)
  );
  let checkpostId = null;
  let officeSupervisor = null;
  let collectionOtherText = null;

  switch (collectionLocation) {
    case CollectionLocation.office:
      officeSupervisor = faker.person.fullName();
      break;
    case CollectionLocation.checkpost:
      if (committeeCheckposts.length > 0) {
        checkpostId = faker.helpers.arrayElement(committeeCheckposts).id;
      }
      break;
    case CollectionLocation.other:
      collectionOtherText = faker.lorem.words(3);
      break;
  }

  // Use a more standardized format for vehicle numbers
  const vehicleNumber = faker.datatype.boolean({probability: 0.7})
    ? faker.string.alphanumeric(10).toUpperCase()
    : null;
  const invoiceNumber = faker.datatype.boolean({probability: 0.8})
    ? faker.string.alphanumeric(8).toUpperCase()
    : null;

  return {
    receiptDate,
    bookNumber,
    receiptNumber,
    traderId: trader.id,
    payeeName: faker.datatype.boolean({probability: 0.8})
      ? trader.name
      : faker.person.fullName(),
    payeeAddress: faker.datatype.boolean({probability: 0.8})
      ? trader.address
      : faker.location.streetAddress(),
    commodityId: commodity.id, // Now always present
    quantity,
    unit,
    weightPerBag,
    totalWeightKg,
    natureOfReceipt,
    natureOtherText,
    value,
    feesPaid,
    vehicleNumber,
    invoiceNumber,
    collectionLocation,
    officeSupervisor,
    checkpostId,
    collectionOtherText,
    receiptSignedBy: faker.person.fullName(),
    generatedBy: generatedBy.id,
    designation: generatedBy.designation,
    committeeId: committee.id,
    cancelled: false,
    deletedAt: null,
  };
}
