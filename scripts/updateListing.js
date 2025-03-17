const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function updateListing() {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'listingWith.json'), 'utf-8')
    );

    // Process each listing in the JSON
    for (const listingData of jsonData) {
      // Find existing listing by title
      const existingListing = await prisma.listing.findUnique({
        where: { title: listingData.title },
        include: {
          galleryImages: true,
        },
      });

      if (!existingListing) {
        console.log(`Listing not found: ${listingData.title}`);
        continue;
      }

      // Prepare gallery images data
      const galleryImagesData = listingData.galleryImages.map(url => ({
        url,
      }));

      // Update the listing with any missing fields
      const updateData = {
        ...(listingData.description && { description: listingData.description }),
        ...(listingData.featuredImage && { featuredImage: listingData.featuredImage }),
        ...(listingData.typeOfPlace && { typeOfPlace: listingData.typeOfPlace }),
        ...(listingData.address && { address: listingData.address }),
        ...(listingData.pricePerNight && { pricePerNight: listingData.pricePerNight }),
        ...(listingData.maxGuests && { maxGuests: listingData.maxGuests }),
        ...(listingData.bedrooms && { bedrooms: listingData.bedrooms }),
        ...(listingData.bathrooms && { bathrooms: listingData.bathrooms }),
        ...(listingData.mapLat && { mapLat: listingData.mapLat }),
        ...(listingData.mapLng && { mapLng: listingData.mapLng }),
        ...(listingData.isFeatured !== undefined && { isFeatured: listingData.isFeatured }),
        ...(listingData.additionalDetails && { additionalDetails: listingData.additionalDetails }),
      };

      // Update the listing and its gallery images
      await prisma.listing.update({
        where: { id: existingListing.id },
        data: {
          ...updateData,
          galleryImages: {
            deleteMany: {}, // Remove existing gallery images
            create: galleryImagesData, // Create new gallery images
          },
        },
      });

      console.log(`Successfully updated listing: ${listingData.title}`);
    }

    console.log('Update completed successfully');
  } catch (error) {
    console.error('Error updating listing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateListing(); 