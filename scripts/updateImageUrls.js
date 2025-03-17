const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateImageUrls() {
  try {
    // Get all listings with their gallery images
    const listings = await prisma.listing.findMany({
      include: {
        galleryImages: true,
        roomTypes: true
      }
    });

    console.log(`Found ${listings.length} listings to process`);

    for (const listing of listings) {
      let needsUpdate = false;
      const updateData = {};

      // Check featured image
      if (listing.featuredImage && listing.featuredImage.startsWith('https://Bkklucy')) {
        updateData.featuredImage = listing.featuredImage.replace('https://Bkklucy', 'https://villaz.b-cdn.net/Bkklucy');
        needsUpdate = true;
        console.log(`Updating featured image for listing: ${listing.title}`);
        console.log(`From: ${listing.featuredImage}`);
        console.log(`To: ${updateData.featuredImage}`);
      }

      // Check gallery images
      const galleryUpdates = [];
      for (const galleryImage of listing.galleryImages) {
        if (galleryImage.url.startsWith('https://Bkklucy')) {
          const newUrl = galleryImage.url.replace('https://Bkklucy', 'https://villaz.b-cdn.net/Bkklucy');
          galleryUpdates.push({
            id: galleryImage.id,
            url: newUrl
          });
          console.log(`Updating gallery image URL for listing: ${listing.title}`);
          console.log(`From: ${galleryImage.url}`);
          console.log(`To: ${newUrl}`);
        }
      }

      // Check room type images
      const roomTypeUpdates = [];
      for (const roomType of listing.roomTypes) {
        const updatedImageLinks = roomType.imageLinks.map(link => {
          if (!link.startsWith('https://villaz.b-cdn.net/Bkklucy/Bkklucy/')) {
            return link.replace('https://villaz.b-cdn.net/Bkklucy/', 'https://villaz.b-cdn.net/Bkklucy/Bkklucy/');
          }
          return link;
        });

        if (JSON.stringify(updatedImageLinks) !== JSON.stringify(roomType.imageLinks)) {
          roomTypeUpdates.push({
            id: roomType.id,
            imageLinks: updatedImageLinks
          });
          console.log(`Updating room type images for listing: ${listing.title}`);
          console.log('From:', roomType.imageLinks);
          console.log('To:', updatedImageLinks);
        }
      }

      // Update listing if needed
      if (needsUpdate) {
        await prisma.listing.update({
          where: { id: listing.id },
          data: updateData
        });
      }

      // Update gallery images if needed
      for (const galleryUpdate of galleryUpdates) {
        await prisma.galleryImage.update({
          where: { id: galleryUpdate.id },
          data: { url: galleryUpdate.url }
        });
      }

      // Update room types if needed
      for (const roomTypeUpdate of roomTypeUpdates) {
        await prisma.roomType.update({
          where: { id: roomTypeUpdate.id },
          data: { imageLinks: roomTypeUpdate.imageLinks }
        });
      }
    }

    console.log('Image URL updates completed successfully');
  } catch (error) {
    console.error('Error updating image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateImageUrls(); 