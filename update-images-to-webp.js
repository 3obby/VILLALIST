const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function updateListingImages() {
  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(
      path.join(__dirname, 'listings-export-with-webp.json'),
      'utf8'
    );
    const listings = JSON.parse(jsonData);

    console.log(`Found ${listings.length} listings in JSON file`);

    // Process each listing
    for (const jsonListing of listings) {
      const listingId = jsonListing.id;
      
      // Find the corresponding listing in the database
      const dbListing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: {
          galleryImages: true,
          roomTypes: true
        }
      });

      if (!dbListing) {
        console.log(`Listing with ID ${listingId} not found in database. Skipping.`);
        continue;
      }

      console.log(`Processing listing: ${dbListing.title} (${listingId})`);

      // Update featuredImage with webp version
      let updatedFeaturedImage = dbListing.featuredImage;
      if (jsonListing.featuredImage && jsonListing.featuredImage.webp) {
        updatedFeaturedImage = jsonListing.featuredImage.webp;
      }

      // Update the listing's featuredImage
      await prisma.listing.update({
        where: { id: listingId },
        data: {
          featuredImage: updatedFeaturedImage
        }
      });
      
      // Update gallery images
      if (jsonListing.galleryImages && jsonListing.galleryImages.length > 0) {
        for (let i = 0; i < jsonListing.galleryImages.length; i++) {
          const jsonGalleryImage = jsonListing.galleryImages[i];
          
          // Find the corresponding gallery image in the database
          // We're matching by index since there's no specific ID to match
          if (i < dbListing.galleryImages.length && jsonGalleryImage.webp) {
            await prisma.galleryImage.update({
              where: { id: dbListing.galleryImages[i].id },
              data: {
                url: jsonGalleryImage.webp
              }
            });
          }
        }
      }
      
      // Update room types image links
      if (jsonListing.roomTypes && jsonListing.roomTypes.length > 0) {
        for (let i = 0; i < jsonListing.roomTypes.length; i++) {
          const jsonRoomType = jsonListing.roomTypes[i];
          
          // Find the corresponding room type in the database
          // We're matching by index since there's no specific ID to match
          if (i < dbListing.roomTypes.length && jsonRoomType.imageLinks) {
            // Convert image links to webp versions
            const updatedImageLinks = jsonRoomType.imageLinks.map(imgObj => 
              imgObj.webp ? imgObj.webp : (typeof imgObj === 'string' ? imgObj : '')
            ).filter(url => url !== '');
            
            await prisma.roomType.update({
              where: { id: dbListing.roomTypes[i].id },
              data: {
                imageLinks: updatedImageLinks
              }
            });
          }
        }
      }
      
      console.log(`Successfully updated images for listing: ${dbListing.title}`);
    }

    console.log('Image update process completed successfully');
  } catch (error) {
    console.error('Error updating listing images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateListingImages()
  .then(() => console.log('Script execution completed'))
  .catch(error => console.error('Script execution failed:', error)); 