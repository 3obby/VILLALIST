import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { id, name, pricePerNight, maxGuests, bedrooms, bathrooms,  } = body;

    if (!id || !name ) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Update the room type in the database
    const updatedRoomType = await prisma.roomType.update({
      where: { id },
      data: {
        name,
        pricePerNight: parseFloat(pricePerNight) || 0,
        maxGuests: parseInt(maxGuests) || 0,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
      },
    });

    return NextResponse.json({ success: true, data: updatedRoomType });
  } catch (error) {
    console.error("Error updating room type:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update room type." },
      { status: 500 }
    );
  }
}
