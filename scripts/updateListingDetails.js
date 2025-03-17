const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Helper function to check if coordinates are close enough
function areCoordinatesClose(lat1, lng1, lat2, lng2, tolerance = 0.0001) {
    return Math.abs(lat1 - lat2) < tolerance && Math.abs(lng1 - lng2) < tolerance;
}

// Helper function to generate uriId from title
function generateUriId(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function updateListingDetails() {
    try {
        // Read the listing JSON file
        const listingJsonPath = path.join(__dirname, '../listingWith.json');
        const listingData = JSON.parse(await fs.readFile(listingJsonPath, 'utf8'));

        // Arrays to store results
        const updatedListings = [];
        const createdListings = [];
        const updatedRooms = [];
        const createdRooms = [];
        const notFoundListings = [];
        const notFoundRooms = [];

        // Ensure data directory exists
        const dataDir = path.join(__dirname, '../data');
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir);
        }

        // Process each listing from the JSON
        for (const listing of listingData) {
            try {
                // First try to find by title
                let existingListing = await prisma.listing.findUnique({
                    where: { title: listing.title },
                    include: {
                        roomTypes: true
                    }
                });

                // If not found by title, try to find by coordinates
                if (!existingListing) {
                    const listingsByCoords = await prisma.listing.findMany({
                        where: {
                            AND: [
                                { mapLat: listing.mapLat },
                                { mapLng: listing.mapLng }
                            ]
                        },
                        include: {
                            roomTypes: true
                        }
                    });

                    if (listingsByCoords.length > 0) {
                        existingListing = listingsByCoords[0];
                        console.log(`Found listing by coordinates: ${existingListing.title}`);
                    }
                }

                if (existingListing) {
                    // Update existing listing
                    await prisma.listing.update({
                        where: { id: existingListing.id },
                        data: {
                            additionalDetails: listing.additionalDetails
                        }
                    });

                    // Update room types' additionalDetails if they exist
                    if (listing.rooms && listing.rooms.length > 0) {
                        console.log(`\nProcessing rooms for listing: ${existingListing.title}`);
                        
                        // Get all existing room types for this listing
                        const existingRoomTypes = await prisma.roomType.findMany({
                            where: { listingId: existingListing.id }
                        });

                        // Update each room type
                        for (const room of listing.rooms) {
                            const existingRoomType = existingRoomTypes.find(
                                rt => rt.name === room.name
                            );

                            if (existingRoomType) {
                                try {
                                    await prisma.roomType.update({
                                        where: { id: existingRoomType.id },
                                        data: {
                                            additionalDetails: room.additionalDetails || {}
                                        }
                                    });
                                    updatedRooms.push({
                                        listingTitle: existingListing.title,
                                        roomName: room.name
                                    });
                                    console.log(`✓ Updated room: ${room.name}`);
                                } catch (roomError) {
                                    console.error(`Error updating room ${room.name}:`, roomError);
                                    notFoundRooms.push({
                                        listingTitle: existingListing.title,
                                        roomName: room.name,
                                        error: roomError.message
                                    });
                                }
                            } else {
                                notFoundRooms.push({
                                    listingTitle: existingListing.title,
                                    roomName: room.name,
                                    reason: 'Room not found in database'
                                });
                                console.log(`✗ Room not found: ${room.name}`);
                            }
                        }
                    } else {
                        console.log(`No rooms found in JSON for listing: ${existingListing.title}`);
                    }

                    updatedListings.push(existingListing.title);
                    console.log(`\nUpdated listing: ${existingListing.title}`);
                } else {
                    // Create new listing with all details
                    console.log(`\nCreating new listing: ${listing.title}`);
                    
                    // Generate uriId from title and UUID for id
                    const uriId = generateUriId(listing.title);
                    const newId = uuidv4();
                    
                    // Create the listing with room types
                    const newListing = await prisma.listing.create({
                        data: {
                            id: newId,
                            uriId: uriId,
                            title: listing.title,
                            description: listing.description,
                            featuredImage: listing.featuredImage,
                            typeOfPlace: listing.typeOfPlace,
                            address: listing.address,
                            pricePerNight: listing.pricePerNight,
                            maxGuests: listing.maxGuests,
                            bedrooms: listing.bedrooms,
                            bathrooms: listing.bathrooms,
                            mapLat: listing.mapLat,
                            mapLng: listing.mapLng,
                            isFeatured: listing.isFeatured || false,
                            additionalDetails: listing.additionalDetails || {},
                            // Create room types from the rooms array
                            roomTypes: {
                                create: listing.rooms.map(room => ({
                                    name: room.name,
                                    pricePerNight: room.pricePerNight,
                                    maxGuests: room.maxGuests,
                                    bedrooms: room.bedrooms,
                                    bathrooms: room.bathrooms,
                                    imageLinks: room.imageLinks || [],
                                    additionalDetails: room.additionalDetails || {}
                                }))
                            }
                        }
                    });

                    // Create gallery images if they exist
                    if (listing.galleryImages && listing.galleryImages.length > 0) {
                        console.log(`\nProcessing gallery images for listing: ${listing.title}`);
                        console.log(`Found ${listing.galleryImages.length} gallery images`);
                        
                        try {
                            const galleryImages = await prisma.galleryImage.createMany({
                                data: listing.galleryImages.map(image => ({
                                    listingId: newListing.id,
                                    url: image.url
                                }))
                            });
                            console.log(`✓ Successfully created ${galleryImages.count} gallery images`);
                        } catch (galleryError) {
                            console.error(`Error creating gallery images for ${listing.title}:`, galleryError);
                            // Log the problematic gallery images for debugging
                            console.log('Problematic gallery images:', JSON.stringify(listing.galleryImages, null, 2));
                        }
                    } else {
                        console.log(`No gallery images found for listing: ${listing.title}`);
                    }

                    createdListings.push(listing.title);
                    createdRooms.push(...listing.rooms.map(room => room.name));
                    console.log(`✓ Created new listing: ${listing.title}`);
                    console.log(`✓ Created ${listing.rooms.length} rooms for ${listing.title}`);
                }
            } catch (error) {
                console.error(`Error processing listing ${listing.title}:`, error);
                notFoundListings.push(listing);
            }
        }

        // Save not found listings to a separate JSON file
        if (notFoundListings.length > 0) {
            const notFoundListingsPath = path.join(dataDir, 'notFoundListings.json');
            await fs.writeFile(
                notFoundListingsPath,
                JSON.stringify(notFoundListings, null, 2)
            );
            console.log(`\nSaved ${notFoundListings.length} not found listings to notFoundListings.json`);
        }

        // Save not found rooms to a separate JSON file
        if (notFoundRooms.length > 0) {
            const notFoundRoomsPath = path.join(dataDir, 'notFoundRooms.json');
            await fs.writeFile(
                notFoundRoomsPath,
                JSON.stringify(notFoundRooms, null, 2)
            );
            console.log(`Saved ${notFoundRooms.length} not found rooms to notFoundRooms.json`);
        }

        console.log(`\nProcessing complete:`);
        console.log(`- Updated ${updatedListings.length} listings`);
        console.log(`- Created ${createdListings.length} new listings`);
        console.log(`- Updated ${updatedRooms.length} rooms`);
        console.log(`- Created ${createdRooms.length} new rooms`);
        console.log(`- ${notFoundListings.length} listings failed to process`);
        console.log(`- ${notFoundRooms.length} rooms not found`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
updateListingDetails(); 