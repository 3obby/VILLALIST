const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

// Load JSON data
const listingsData = JSON.parse(fs.readFileSync('final.json', 'utf8')); // Update with your actual file name

async function processListings() {
    let missingListings = [];

    for (let listing of listingsData) {
        const { title, url } = listing;

        // Case-insensitive search for listing
        const existingListing = await prisma.listing.findFirst({
            where: {
                title: {
                    mode: 'insensitive', // Case-insensitive search
                    equals: title
                }
            }
        });

        if (existingListing) {
            // Update the uriId with the URL from JSON
            await prisma.listing.update({
                where: { id: existingListing.id },
                data: { uriId: url }
            });
            console.log(`Updated: ${title}`);
        } else {
            // Save missing listing to an array
            missingListings.push(listing);
            console.log(`Missing: ${title}`);
        }
    }

    // If there are missing listings, save them to a JSON file
    if (missingListings.length > 0) {
        fs.writeFileSync('missing_listings.json', JSON.stringify(missingListings, null, 2));
        console.log('Missing listings saved to missing_listings.json');
    }

    await prisma.$disconnect();
}

processListings().catch((error) => {
    console.error(error);
    prisma.$disconnect();
});
