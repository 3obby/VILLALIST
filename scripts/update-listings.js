// Script to update listings in the database using the export file
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateListings() {
  try {
    // Read the export file
    const exportFilePath = path.join(__dirname, '../exports/listings-export-updated.json');
    const listingsData = JSON.parse(fs.readFileSync(exportFilePath, 'utf8'));
    
    console.log(`Found ${listingsData.length} listings in the export file`);
    
    // Track statistics
    let updatedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    // Process each listing
    for (const listing of listingsData) {
      try {
        // Check if we have the required fields
        if (!listing.id || !listing.uriId) {
          console.log(`Skipping listing with missing id or uriId: ${listing.id || 'unknown'}`);
          skippedCount++;
          continue;
        }
        
        // Check if the listing exists in the database
        const existingListing = await prisma.listing.findUnique({
          where: { id: listing.id },
        });
        
        if (!existingListing) {
          console.log(`Listing with id ${listing.id} not found in database, skipping`);
          skippedCount++;
          continue;
        }
        
        // Update the listing
        await prisma.listing.update({
          where: { id: listing.id },
          data: {
            uriId: listing.uriId,
          },
        });
    
        
        updatedCount++;
        console.log(`Updated listing: ${listing.id} (${listing.uriId})`);
      } catch (error) {
        console.error(`Error updating listing ${listing.id}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('\nUpdate Summary:');
    console.log(`Total listings in export: ${listingsData.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Failed to update listings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateListings()
  .then(() => console.log('Update process completed'))
  .catch((error) => console.error('Update process failed:', error)); 