const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function exportListingsToJson() {
  // Initialize Prisma client
  const prisma = new PrismaClient();
  
  try {
    console.log('Fetching listings with related data...');
    
    // Fetch all listings with their room types and gallery images
    const listings = await prisma.listing.findMany({
      include: {
        roomTypes: true,
        galleryImages: true,
      },
    });
    
    console.log(`Found ${listings.length} listings to export`);
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    // Save to JSON file
    const outputPath = path.join(outputDir, 'listings-export.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(listings, null, 2)
    );
    
    console.log(`Successfully exported listings to ${outputPath}`);
  } catch (error) {
    console.error('Error exporting listings:', error);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

// Run the export function
exportListingsToJson()
  .then(() => console.log('Export process completed'))
  .catch((err) => console.error('Export process failed:', err)); 