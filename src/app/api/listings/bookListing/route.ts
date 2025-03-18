import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { listingId, checkInDate, checkOutDate, name, email, message, guests, roomType } =
    await request.json();

  if (!listingId || !checkInDate || !checkOutDate || !name || !email || !guests) {
    return NextResponse.json(
      { success: false, message: "All required fields must be provided." },
      { status: 400 }
    );
  }

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formattedCheckIn = formatDate(checkInDate);
  const formattedCheckOut = formatDate(checkOutDate);

  try {
    // Get listing details for booking record
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, message: "Listing not found." },
        { status: 404 }
      );
    }

    // Calculate the total amount based on the room type or listing price
    let totalAmount = 0;
    let selectedRoomType = null;

    if (roomType) {
      selectedRoomType = await prisma.roomType.findUnique({
        where: { id: roomType },
      });
    }

    // Calculate nights between check-in and check-out
    const checkInDateTime = new Date(checkInDate);
    const checkOutDateTime = new Date(checkOutDate);
    const nights = Math.ceil((checkOutDateTime.getTime() - checkInDateTime.getTime()) / (1000 * 60 * 60 * 24));

    // Use the room type price if selected, otherwise use the listing's price
    const pricePerNight = selectedRoomType ? selectedRoomType.pricePerNight : listing.pricePerNight;
    totalAmount = pricePerNight * nights;

    // Save the booking to the database
    const newBooking = await prisma.booking.create({
      data: {
        propertyId: listingId,
        propertyName: listing.title,
        guestName: name,
        guestEmail: email,
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        guests: guests,
        status: "pending", // Default status
        totalAmount: totalAmount,
      },
    });

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "dawitshishu@gmail.com", 
        pass: "wtqi bcnf isnv eksf", 
      },
    });

    // Email to the user
    await transporter.sendMail({
        from: `"The Villa List" <${"dawitshishu@gmail.com"}>`,
        to: email,
        subject: "Your Booking Confirmation 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Thank You for Booking with Us, ${name}!</h2>
            <p>Your reservation has been successfully confirmed. Here are the details:</p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Listing ID:</strong> ${listingId}</li>
              <li><strong>Check-in:</strong> ${formattedCheckIn}</li>
              <li><strong>Check-out:</strong> ${formattedCheckOut}</li>
              <li><strong>Guests:</strong> ${guests}</li>
            </ul>
            ${message ? `<p><strong>Your Message:</strong> "${message}"</p>` : ""}
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2196F3;">Booking Information</h3>
              <p><strong>WhatsApp Support:</strong> +1 (555) 123-4567</p>
              <p><strong>Response Time:</strong> Within 12 hours</p>
            </div>
            <p>
              Our dedicated booking agent will review your reservation and confirm the details within 12 hours.
              If you have any immediate questions, feel free to reach out to us via WhatsApp or email.
            </p>
            <p style="color: #888;">Best Regards,</p>
            <p style="color: #888;">The Villa List Team</p>
          </div>
        `,
      });
      

    // Email to the admin
    await transporter.sendMail({
        from: `"The Villa List" <${"dawitshishu@gmail.com"}>`,
        to: "Eyosiasbitsu@gmail.com",
        subject: "🔔 New Booking Alert",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #F44336;">New Booking Received</h2>
            <p><strong>Details of the booking:</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Guest Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Listing ID:</strong> ${listingId}</li>
              <li><strong>Check-in:</strong> ${formattedCheckIn}</li>
              <li><strong>Check-out:</strong> ${formattedCheckOut}</li>
              <li><strong>Guests:</strong> ${guests}</li>
            </ul>
            ${message ? `<p><strong>User's Message:</strong> "${message}"</p>` : ""}
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2196F3;">Booking Information</h3>
              <p><strong>Date Received:</strong> ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>Priority Level:</strong> High</p>
            </div>
            <p>
              Please review this booking and confirm the reservation within 12 hours.
              The guest can be reached at ${email} or via WhatsApp at +1 (555) 123-4567.
            </p>
            <p style="color: #888;">Best Regards,</p>
            <p style="color: #888;">The Villa List Team</p>
          </div>
        `,
      });
      

    return NextResponse.json({ 
      success: true, 
      message: "Booking confirmed and emails sent.",
      booking: newBooking
    });
  } catch (error) {
    console.error("Error processing booking:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process booking." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
