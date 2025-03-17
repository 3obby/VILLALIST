const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const prisma = new PrismaClient();

const insertListings = async () => {
  try {
    const listingsFile = "missing.json";
    const skippedListingsFile = "skipped_listings.json";

    // Read JSON files
    const listingsData = JSON.parse(fs.readFileSync(listingsFile, "utf8"));
    let skippedListings = [];

    const successfullyAddedIds = [];

    for (const listing of listingsData) {
      // Check if listing title already exists
      const existingListing = await prisma.listing.findFirst({
        where: { title: listing.title },
      });

      if (existingListing) {
        console.log(
          `Skipping listing because title already exists: ${listing.title}`
        );
        skippedListings.push(listing);
        continue;
      }
      

      // Check if listing uriId exists but with a different title
      const existingUriListing = await prisma.listing.findFirst({
        where: { uriId: listing.url },
      });

      let finalUriId = listing.url;
      if (existingUriListing) {
        finalUriId = `${listing.url}-${listing.title
          .replace(/\s+/g, "-")
          .toLowerCase()}`;
      }

      // Skip if pricePerNight is missing or invalid
      if (!listing.pricePerNight || isNaN(listing.pricePerNight)) {
        console.log(`Skipping listing due to invalid price: ${listing.title}`);
        skippedListings.push(listing);
        continue;
      }

      // Skip if there are no gallery images
      if (!listing.galleryImages || listing.galleryImages.length === 0) {
        console.log(`Skipping listing due to missing images: ${listing.title}`);
        skippedListings.push(listing);
        continue;
      }

      const listingId = uuidv4();

      // Set default values
      const beds = listing.beds || 1;
      const bathrooms = listing.bathrooms || 1;
      const bedrooms = listing.bedrooms || 1;
      const typeOfPlace = listing.typeOfPlace || "Entire place";

      // Use the first gallery image as featuredImage if not provided
      const featuredImage =
        listing.featuredImage || listing.galleryImages[0].url;

      // Insert the listing
      const createdListing = await prisma.listing.create({
        data: {
          id: listingId,
          title: listing.title,
          description: listing.description,
          uriId: finalUriId,
          featuredImage: featuredImage,
          typeOfPlace: typeOfPlace,
          address: listing.address,
          pricePerNight: listing.pricePerNight,
          maxGuests: listing.maxGuests,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          mapLat: listing.mapLat,
          mapLng: listing.mapLng,
          isFeatured: listing.isFeatured,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`Listing created with ID: ${createdListing.id}`);

      // Insert gallery images
      const galleryImages = listing.galleryImages.map((image) => ({
        id: uuidv4(),
        listingId: createdListing.id,
        url: image,
      }));

      await prisma.galleryImage.createMany({
        data: galleryImages,
      });
      console.log(`Gallery images added for listing ID: ${createdListing.id}`);

      // Handle room rates
      let roomRates = listing.rooms;

      if (!roomRates || roomRates.length === 0) {
        // Create a default room
        roomRates = [
          {
            id: uuidv4(),
            listingId: createdListing.id,
            name: "Default",
            price: listing.pricePerNight,
            imageLinks: listing.galleryImages.map((image) => image),
          },
        ];
      }

      await prisma.roomType.createMany({
        data: roomRates.map((rate) => ({
          id: uuidv4(),
          listingId: createdListing.id,
          imageLinks: rate.imageLinks,
          name: rate.name,
          maxGuests: rate.maxGuests,
          bedrooms: rate.bedrooms,
          bathrooms: rate.bathrooms,
          price: rate.pricePerNight || listing.pricePerNight,
        })),
      });

      console.log(`Room rates added for listing ID: ${createdListing.id}`);

      successfullyAddedIds.push(listing.id);
    }

    // Filter out successfully added listings and update missing.json
    const remainingListings = listingsData.filter(
      (listing) => !successfullyAddedIds.includes(listing.id)
    );

    fs.writeFileSync(listingsFile, JSON.stringify(remainingListings, null, 2));
    console.log("Updated missing.json with remaining listings.");

    // Save skipped listings
    fs.writeFileSync(
      skippedListingsFile,
      JSON.stringify(skippedListings, null, 2)
    );
    console.log("Skipped listings saved in skipped_listings.json");

    console.log("All valid listings inserted successfully!");
  } catch (error) {
    console.error("Error inserting listings:", error);
  } finally {
    await prisma.$disconnect();
  }
};

insertListings();
