// update-gallery-images.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function updateGalleryImages() {
  try {
    // Read the listings file
    const listingsPath = path.join(__dirname, 'exports', 'listings-no-gall.json');
    console.log('Reading listings file...');
    const listings = JSON.parse(fs.readFileSync(listingsPath, 'utf8'));

    console.log(`Processing ${listings.length} listings...`);
    
    for (const [index, listing] of listings.entries()) {
      try {
        console.log(`Processing listing ${index + 1}/${listings.length}: ${listing.title}`);

        // First, delete any existing gallery images for this listing
        await prisma.galleryImage.deleteMany({
          where: {
            listingId: listing.id
          }
        });

        // Get all image links from roomTypes
        const galleryImages = listing.roomTypes.reduce((images, roomType) => {
          return [...images, ...roomType.imageLinks];
        }, []);

        // Create gallery image objects with UUID - remove listingId from here
        const galleryImageData = galleryImages.map(url => ({
          id: uuidv4(),
          url: url
        }));

        // Update the database
        await prisma.listing.update({
          where: {
            id: listing.id
          },
          data: {
            galleryImages: {
              createMany: {
                data: galleryImageData
              }
            }
          }
        });

        // For the JSON file, we still want to include the listingId
        listing.galleryImages = galleryImageData.map(img => ({
          ...img,
          listingId: listing.id
        }));

        console.log(`✓ Successfully updated gallery images for ${listing.title}`);
      } catch (error) {
        console.error(`Error processing listing ${listing.title}:`, error);
        // Continue with next listing even if one fails
      }
    }

    // Write the updated listings back to a new file
    const outputPath = path.join(__dirname, 'exports', 'listings-with-gallery.json');
    fs.writeFileSync(outputPath, JSON.stringify(listings, null, 2));

    console.log('\nSummary:');
    console.log('- Database updated successfully');
    console.log('- New JSON file created at:', outputPath);
    console.log('- Total listings processed:', listings.length);

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
}

// Run the update function
updateGalleryImages();