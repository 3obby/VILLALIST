import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomTypeId = searchParams.get("id");

    if (!roomTypeId) {
      return NextResponse.json(
        { success: false, message: "Room Type ID is required." },
        { status: 400 }
      );
    }

    // Delete the room type from the database
    await prisma.roomType.delete({
      where: { id: roomTypeId },
    });

    return NextResponse.json({ success: true, message: "Room type deleted successfully." });
  } catch (error) {
    console.error("Error deleting room type:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete room type." },
      { status: 500 }
    );
  }
}
