const fs = require('fs');
const path = require('path');

// Path to the listings-export.json file
const listingsFilePath = path.join(__dirname, '../exports/listings-export.json');
// Path to save listings with no extractable IDs
const noIdListingsFilePath = path.join(__dirname, '../exports/listings-no-id.json');

// Function to extract listing ID from the featuredImage URL


function extractListingId(featuredImageUrl) {
  if (!featuredImageUrl) {
    console.log('No featuredImage URL found');
    return null;
  }
  
  console.log(`Processing URL: ${featuredImageUrl}`);
  
  // Parse the URL to extract the listing ID
  // Example: https://villaz.b-cdn.net/Bkklucy/Bkklucy/Thailand/Phuket/0030/Pic01.jpg
  // We want to extract "0030"
  
  // Try to match the pattern with any file extension
  const regex = /\/([^\/]+)\/(?:Pic\d+\.\w+|[^\/]+\.\w+)$/i;
  const match = featuredImageUrl.match(regex);
  
  if (match && match[1]) {
    console.log(`Extracted ID: ${match[1]}`);
    return match[1];
  }
  
  // If we couldn't extract the ID using the regex, try to extract it from the URL path
  // Example: https://villaz.b-cdn.net/Bkklucy/Bkklucy/Thailand/Phuket/0030/298949230.jpg
  const pathParts = featuredImageUrl.split('/');
  if (pathParts.length >= 2) {
    // Get the second-to-last part of the path (before the filename)
    const potentialId = pathParts[pathParts.length - 2];
    
    // Check if it looks like an ID (numeric or alphanumeric)
    if (/^\d{4}$/.test(potentialId)) {
      console.log(`Extracted ID from path: ${potentialId}`);
      return potentialId;
    }
  }
  
  console.log('No match found in URL');
  return null;
}

// Main function to update the listings
async function updateListings() {
  try {
    console.log('Reading listings file...');
    const data = fs.readFileSync(listingsFilePath, 'utf8');
    console.log('Parsing JSON...');
    const listings = JSON.parse(data);
    
    console.log(`Processing ${listings.length} listings...`);
    let updatedCount = 0;
    let missingImageCount = 0;
    
    // Arrays to store listings with and without IDs
    const listingsWithId = [];
    const listingsWithoutId = [];
    
    // Process each listing
    listings.forEach(listing => {
      console.log(`\nProcessing listing: ${listing.title}`);
      const listingId = extractListingId(listing.featuredImage);
      
      if (listingId) {
        updatedCount++;
        listingsWithId.push({
          ...listing,
          listingId
        });
      } else {
        missingImageCount++;
        console.warn(`Could not extract listing ID for listing: ${listing.id} (${listing.title})`);
        listingsWithoutId.push(listing);
      }
    });
    
    // Write the updated listings back to the file
    console.log('Writing updated listings to file...');
    fs.writeFileSync(
      listingsFilePath, 
      JSON.stringify(listingsWithId, null, 2), 
      'utf8'
    );
    
    // Write listings with no extractable IDs to a separate file
    console.log('Writing listings with no extractable IDs to separate file...');
    fs.writeFileSync(
      noIdListingsFilePath,
      JSON.stringify(listingsWithoutId, null, 2),
      'utf8'
    );
    
    console.log('Update complete!');
    console.log(`Updated ${updatedCount} listings with listing IDs`);
    console.log(`${missingImageCount} listings had no extractable ID and were saved to ${noIdListingsFilePath}`);
    
  } catch (error) {
    console.error('Error updating listings:', error);
    console.error(error.stack);
  }
}

// Run the update function
updateListings(); 