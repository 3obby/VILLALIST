const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const prisma = new PrismaClient();

const insertListings = async () => {
  try {
    const listingsFile = "final.json";
    const skippedListingsFile = "skipped_listings.json";

    // Read JSON files
    const listingsData = JSON.parse(fs.readFileSync(listingsFile, "utf8"));
    let skippedListings = [];

    const successfullyAddedIds = [];

    for (const listing of listingsData) {

        // Check if listing title already exists
      const existingListing = await prisma.listing.findFirst({
        where: { title: listing.title },
        include:{roomTypes:true} 
      });

      if (!existingListing) {
        console.log(`Skipping listing because title don't exists: ${listing.title}`);
        skippedListings.push(listing);
        continue;
      }

      if (existingListing.roomTypes && existingListing.roomTypes.length > 0 ) {
        console.log(`Skipping listing has roomtypes: ${listing.title}`);
        skippedListings.push(listing);
        continue;
      }

      // Handle room rates
      let roomRates = listing.rooms;

      if (!roomRates || roomRates.length === 0) {
        // Create a default room
        roomRates = [
          {
            id: uuidv4(),
            listingId: existingListing.id,
            name: "Default",
            price: listing.pricePerNight,
            maxGuests:listing.maxGuests,
            bedrooms:listing.bedrooms,
            bathrooms:listing.bathrooms,
            imageLinks: listing.galleryImages.map((image) => image),
          },
        ];
      }

      await prisma.roomType.createMany({
        data: roomRates.map((rate) => ({
          id: uuidv4(),
          listingId: existingListing.id,
          imageLinks: rate.imageLinks,
          name: rate.name,
          maxGuests: rate.maxGuests,
          bedrooms: rate.bedrooms,
          bathrooms: rate.bathrooms,
          pricePerNight: rate.pricePerNight || listing.pricePerNight,
        })),
      });

      console.log(`Room rates added for listing ID: ${existingListing.id}`);

      successfullyAddedIds.push(listing.id);
    }

    // Filter out successfully added listings and update missing.json
    console.log("All valid listings inserted successfully!");
  } catch (error) {
    console.error("Error inserting listings:", error);
  } finally {
    await prisma.$disconnect();
  }
};

insertListings();
