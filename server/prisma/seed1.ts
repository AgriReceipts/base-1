import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // Committee and checkpost data from CSV
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

    // Create committees and their checkposts
    for (const committeeData of committeesData) {
      console.log(`Processing committee: ${committeeData.name}`);

      // Check if committee already exists
      let committee = await prisma.committee.findUnique({
        where: {name: committeeData.name},
      });

      if (!committee) {
        // Create committee if it doesn't exist
        committee = await prisma.committee.create({
          data: {
            name: committeeData.name,
          },
        });
        console.log(`Created committee: ${committee.name}`);
      } else {
        console.log(`Committee already exists: ${committee.name}`);
      }

      // Create checkposts for this committee
      for (const checkpostName of committeeData.checkposts) {
        const existingCheckpost = await prisma.checkpost.findFirst({
          where: {
            name: checkpostName,
            committeeId: committee.id,
          },
        });

        if (!existingCheckpost) {
          const checkpost = await prisma.checkpost.create({
            data: {
              name: checkpostName,
              committeeId: committee.id,
            },
          });
          console.log(
            `Created checkpost: ${checkpost.name} for committee: ${committee.name}`
          );
        } else {
          console.log(
            `Checkpost already exists: ${checkpostName} for committee: ${committee.name}`
          );
        }
      }
    }

    console.log('Database seeding completed successfully!');

    // Display summary
    const totalCommittees = await prisma.committee.count();
    const totalCheckposts = await prisma.checkpost.count();

    console.log(`\nSummary:`);
    console.log(`Total committees: ${totalCommittees}`);
    console.log(`Total checkposts: ${totalCheckposts}`);
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
