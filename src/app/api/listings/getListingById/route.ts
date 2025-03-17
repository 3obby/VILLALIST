import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Validate ID
  if (!id) {
    return NextResponse.json(
      { success: false, message: "Listing ID is required." },
      { status: 400 }
    );
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { uriId: id },
      include: {
        galleryImages: true,
        roomTypes: true,
      },
    });

    // Handle listing not found
    if (!listing) {
      return NextResponse.json(
        { success: false, message: "Listing not found." },
        { status: 404 }
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      message: "Listing fetched successfully.",
      data: listing,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching listing by ID:", { error, id });

    return NextResponse.json(
      { success: false, message: "Failed to fetch listing." },
      { status: 500 }
    );
  }
}
