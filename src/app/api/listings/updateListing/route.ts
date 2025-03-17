import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request) {
  try {
    const body = await request.json();

    // Validate the required fields
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Listing ID is required." },
        { status: 400 }
      );
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update provided." },
        { status: 400 }
      );
    }

    // List of numeric fields to sanitize
    const numericFields = ["pricePerNight", "maxGuests", "bedrooms", "bathrooms"];

    // Ensure numeric fields are valid numbers or set them to 0
    numericFields.forEach((field) => {
      if (updateData[field] === "") {
        updateData[field] = 0;
      } else if (updateData[field] != null) {
        updateData[field] = parseInt(updateData[field], 10);
      }
    });

    // Update the listing in the database
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
    });

    // Ensure numeric fields are always returned as numbers (including 0 if absent)
    numericFields.forEach((field) => {
      if (updatedListing[field] == null) {
        updatedListing[field] = 0;
      }
    });

    return NextResponse.json({
      success: true,
      message: "Listing updated successfully.",
      data: updatedListing,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update the listing." },
      { status: 500 }
    );
  }
}
