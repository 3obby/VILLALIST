// find-duplicate-names.js
const fs = require('fs');
const path = require('path');

// Function to find listings with duplicate names
function findDuplicateNames() {
  try {
    // Read the export file
    const exportFilePath = path.join(__dirname, '../exports/listings-export-updated.json');
    const listingsData = JSON.parse(fs.readFileSync(exportFilePath, 'utf8'));
    
    console.log(`Processing ${listingsData.length} listings...`);
    
    // Create a map to track titles and their occurrences
    const titleMap = new Map();
    const duplicates = [];
    
    // First pass: count occurrences of each title
    listingsData.forEach(listing => {
      if (!listing.uriId) return;
      
      const title = listing.uriId.trim();
      if (titleMap.has(title)) {
        titleMap.set(title, titleMap.get(title) + 1);
      } else {
        titleMap.set(title, 1);
      }
    });
    
    // Second pass: collect listings with duplicate titles
    listingsData.forEach(listing => {
      if (!listing.uriId) return;
      
      const title = listing.uriId.trim();
      if (titleMap.get(title) > 1) {
        duplicates.push({
          id: listing.id,
          uriId: listing.uriId,
            title: listing.title,
          occurrences: titleMap.get(title)
        });
      }
    });
    
    // Group duplicates by title for better readability
    const groupedDuplicates = {};
    duplicates.forEach(item => {
      if (!groupedDuplicates[item.title]) {
        groupedDuplicates[item.title] = [];
      }
      groupedDuplicates[item.title].push({
        id: item.id,
        uriId: item.uriId,
        occurrences: item.occurrences
      });
    });
    
    // Write the results to a new file
    const outputFilePath = path.join(__dirname, '../exports/duplicate-titles.json');
    
    // Ensure the exports directory exists
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(
      outputFilePath, 
      JSON.stringify({
        summary: {
          totalListings: listingsData.length,
          uniqueTitles: titleMap.size,
          duplicateTitles: Object.keys(groupedDuplicates).length,
          totalDuplicateListings: duplicates.length
        },
        duplicates: groupedDuplicates
      }, null, 2)
    );
    
    console.log(`Found ${Object.keys(groupedDuplicates).length} duplicate titles across ${duplicates.length} listings`);
    console.log(`Results saved to ${outputFilePath}`);
    
    // Also create a full export of just the duplicate listings
    const fullDuplicateListings = listingsData.filter(listing => 
      listing.uriId && titleMap.get(listing.uriId.trim()) > 1
    );
    
    const fullOutputPath = path.join(__dirname, '../exports/duplicate-listings-full.json');
    fs.writeFileSync(fullOutputPath, JSON.stringify(fullDuplicateListings, null, 2));
    console.log(`Full duplicate listings saved to ${fullOutputPath}`);
    
  } catch (error) {
    console.error('Error processing listings:', error);
  }
}

// Run the function
findDuplicateNames();