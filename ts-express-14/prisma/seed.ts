import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add seed data here
  await prisma.user.create({
    data: {
      email: "test@example.com",
      hashedPassword: "hashedPassword123",
    },
  });

  await prisma.event.create({
    data: {
      name: "Test Event",
      date: new Date(),
      distance: 10,
      ticketPrice: 50.0,
      location: {
        create: {
          firstLine: "123 Test Street",
          city: "Test City",
          postcode: "12345",
        },
      },
    },
  });
}

main()
  .then(() => {
    console.log("Seeding completed");
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    prisma.$disconnect();
    process.exit(1);
  });
