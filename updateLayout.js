const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function updateListingLayouts() {
    try {
        const jsonData = await fs.readFile(path.join(__dirname, 'merged-listings.json'), 'utf8');
        const listings = JSON.parse(jsonData);

        console.log('Processing listings and rooms...');

        for (const listing of listings) {
            if (!listing.title) {
                console.log('Skipping listing: missing uriId');
                continue;
            }

            try {
                const dbListing = await prisma.listing.findUnique({
                    where: { title: listing.title },
                    include: { roomTypes: true }
                });

                if (!dbListing) {
                    console.log(`Listing not found for uriId: ${listing.url}`);
                    continue;
                }

                // Update listing layout if it exists
                if (listing.layouts) {
                    const layoutJson = typeof listing.layouts === 'string' 
                        ? JSON.parse(listing.layouts) 
                        : listing.layouts;

                    await prisma.listing.update({
                        where: { title: listing.title },
                        data: { layout: layoutJson }
                    });
                    console.log(`Updated layout for listing: ${listing.url}`);
                }
               

                // Update room type layouts if they exist
                if (listing.rooms && listing.rooms.length > 0) {
                    for (const room of listing.rooms) {
                        const dbRoom = dbListing.roomTypes.find(r => r.name === room.name);
                        if (dbRoom && room.layouts) {
                            const roomLayoutJson = typeof room.layouts === 'string'
                                ? JSON.parse(room.layouts)
                                : room.layouts;

                            await prisma.roomType.update({
                                where: { id: dbRoom.id }, // Use the id from the database
                                data: { layout: roomLayoutJson }
                            });
                            console.log(`Updated layout for room type: ${dbRoom.id}`);
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing listing ${listing.uriId}:`, error);
            }
        }

    } catch (error) {
        console.error('Error processing file:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
updateListingLayouts()
    .then(() => console.log('Layout update process completed'))
    .catch(error => console.error('Script failed:', error));