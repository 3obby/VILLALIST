import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Add the locations data
const locationsData = [
  {
    country: "Thailand",
    regions: [{ name: "Phuket" }, { name: "Koh Samui" }],
  },
  {
    country: "Indonesia",
    regions: [{ name: "Bali" }],
  },
  {
    country: "Japan",
    regions: [{ name: "Niseko" }],
  },
];

export async function POST(request: Request) {
  const { location, checkInDate, checkOutDate, guests, name, email } =
    await request.json();

  if (!location || !checkInDate || !checkOutDate || !name || !email || !guests) {
    return NextResponse.json(
      { success: false, message: "All required fields must be provided." },
      { status: 400 }
    );
  }

  // Create a map of regions to countries for quick lookup
  const regionToCountry = new Map();
  locationsData.forEach(country => {
    country.regions.forEach(region => {
      regionToCountry.set(region.name.toLowerCase(), country.country);
    });
  });

  // Format location
  let formattedLocation: string;
  if (location.includes(',')) {
    const [city, country] = location.split(',').map(part => part.trim());
    formattedLocation = `${city}, ${country}`;
  } else {
    const matchedCountry = regionToCountry.get(location.trim().toLowerCase());
    if (!matchedCountry) {
      return NextResponse.json(
        { success: false, message: "Invalid location. Please select from the suggested list." },
        { status: 400 }
      );
    }
    formattedLocation = `${location.trim()}, ${matchedCountry}`;
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

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "dawitshishu@gmail.com", 
      pass:"wtqi bcnf isnv eksf", 
    },
  });

  try {
    await transporter.sendMail({
        from: `"The Villa List" <${"info@thevillalist.com"}>`,
        to: email,
        subject: "Your Vacation Request Confirmation 🌴",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Hi ${name}, Your Vacation Request is Received!</h2>
            <p>Thank you for reaching out to us. Here are the details of your request:</p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Destination:</strong> ${formattedLocation}</li>
              <li><strong>Check-in:</strong> ${formattedCheckIn}</li>
              <li><strong>Check-out:</strong> ${formattedCheckOut}</li>
              <li><strong>Guests:</strong> ${guests}</li>
            </ul>
            <p>
              Our team will review your request and get back to you within 24 hours with the best vacation options.
              Your dedicated travel agent will be assigned shortly and will contact you via email or WhatsApp.
            </p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2196F3;">Important Information</h3>
              <p><strong>WhatsApp Support:</strong> +1 (555) 123-4567</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
            <p>
              If you have any immediate questions, feel free to reach out to us via WhatsApp or email.
            </p>
            <p style="color: #888;">Best Regards,</p>
            <p style="color: #888;">The Villa List Team</p>
          </div>
        `,
      });
      

    // Email to the admin
    await transporter.sendMail({
        from:  `"The Villa List" <${"info@thevillalist.com"}>`,
        to: "Eyosiasbitsu@gmail.com",
        subject: "🔔 New Vacation Request",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #F44336;">New Vacation Request</h2>
            <p><strong>Details of the request:</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Guest Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Location:</strong> ${formattedLocation}</li>
              <li><strong>Check-in:</strong> ${formattedCheckIn}</li>
              <li><strong>Check-out:</strong> ${formattedCheckOut}</li>
              <li><strong>Guests:</strong> ${guests}</li>
            </ul>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2196F3;">Request Information</h3>
              <p><strong>Date Received:</strong> ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
              <p><strong>Priority Level:</strong> Standard</p>
            </div>
            <p>
              Please review this request and provide suitable options to the guest within 24 hours.
              The guest can be reached at ${email}.
            </p>
            <p style="color: #888;">Best Regards,</p>
            <p style="color: #888;">The Villa List Team</p>
          </div>
        `,
      });
      

    return NextResponse.json({ success: true, message: "Vacation emails sent." });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send vacation emails." },
      { status: 500 }
    );
  }
}
