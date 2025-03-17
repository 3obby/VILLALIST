import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma to access QueryMode

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const adults = parseInt(searchParams.get("adults") || "0");
  const children = parseInt(searchParams.get("children") || "0");

  if (!location) {
    return NextResponse.json(
      { success: false, message: "Location is required for search." },
      { status: 400 }
    );
  }

  try {
    // Split the search location into words and clean them
    const searchWords = location
      .toLowerCase()
      .replace(/,/g, ' ')
      .split(' ')
      .filter(word => word.trim().length > 0);

    // Check if search is for "any" - if so, return all listings
    if (searchWords.length === 1 && searchWords[0] === 'all') {
      console.log("Searching for all listings");
      const allListings = await prisma.listing.findMany({
        include: {
          galleryImages: true,
          roomTypes: true,
        },
      });
      console.log(allListings.length);
      return NextResponse.json({ 
        success: true, 
        data: allListings 
      });
    }

    const listings = await prisma.listing.findMany({
      where: {
        address: {
          contains: searchWords[0], // Need at least one word to match for Prisma query
          mode: Prisma.QueryMode.insensitive,
        },
      },
      include: {
        galleryImages: true,
        roomTypes: true,
      },
    });

    // Post-process results to check if all search words are present in the address
    const filteredListings = listings.filter(listing => {
      const addressWords = listing.address
        .toLowerCase()
        .replace(/,/g, ' ')
        .split(' ')
        .filter(word => word.trim().length > 0);

      return searchWords.every(searchWord => 
        addressWords.some(addressWord => addressWord.includes(searchWord))
      );
    });

    // Return success response with filtered listings or empty array
    return NextResponse.json({ 
      success: true, 
      data: filteredListings.length > 0 ? filteredListings : [] 
    });
  } catch (error) {
    console.error("Error searching listings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to search listings." },
      { status: 500 }
    );
  }
}
