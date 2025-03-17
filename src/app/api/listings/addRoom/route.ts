import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { listingId, name, pricePerNight, maxGuests, bedrooms, bathrooms } = body;

    if (!listingId || !name) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Create the new room type
    const newRoomType = await prisma.roomType.create({
      data: {
        listingId,
        name,
        pricePerNight: parseFloat(pricePerNight) || 0,
        maxGuests: parseInt(maxGuests) || 0,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
      },
    });

    return NextResponse.json({ success: true, data: newRoomType });
  } catch (error) {
    console.error("Error creating room type:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create room type." },
      { status: 500 }
    );
  }
}
