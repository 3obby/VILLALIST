const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

const getListingsWithoutRoomRates = async () => {
  try {
    // Fetch listings with no room rates or an empty roomRates array
    const listingsWithoutRoomRates = await prisma.listing.findMany({
      where: {
        roomTypes: {
          none: {}, // No related roomRates
        },
      },
      include: {
        roomTypes: true, // Include roomRates for verification
      },
    });

    // Filter listings that have an empty roomRates array
    const listingsToExport = listingsWithoutRoomRates.filter(
      (listing) => listing.roomTypes.length === 0
    );

    // Write to a separate JSON file
    const outputFile = "listings_without_room_rates.json";
    fs.writeFileSync(outputFile, JSON.stringify(listingsToExport, null, 2));

    console.log(`Listings without room rates saved to ${outputFile}`);
  } catch (error) {
    console.error("Error fetching listings:", error);
  } finally {
    await prisma.$disconnect();
  }
};

getListingsWithoutRoomRates();
