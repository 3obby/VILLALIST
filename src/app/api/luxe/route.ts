import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";

const prisma = new PrismaClient();

// Helper function to sanitize input to prevent XSS attacks
function sanitizeInput(input: string | null | undefined): string {
  if (!input) return "";
  return DOMPurify.sanitize(input.trim());
}

// Helper function to check if a string is an email
function isEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

// Helper function to check if a string is a phone number
function isPhoneNumber(input: string): boolean {
  // This regex matches various phone number formats
  // It's a basic check and can be made more specific based on requirements
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(input.replace(/\s+/g, ''));
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Sanitize all inputs to prevent XSS attacks
    const contactDetail = sanitizeInput(data.contactDetail);
    const name = sanitizeInput(data.name);
    const additionalInfo = sanitizeInput(data.additionalInfo);
    
    // Determine if contact detail is email or phone
    const contactIsEmail = isEmail(contactDetail);
    const contactIsPhone = !contactIsEmail && isPhoneNumber(contactDetail);
    
    // Set email and phone based on the contact detail
    let email = contactIsEmail ? contactDetail : null;
    const phone = contactIsPhone ? contactDetail : null;
    
    // If contact detail is neither email nor phone, add it to additional info
    
    if (!contactIsEmail && !contactIsPhone) {
       email = contactDetail;
    }
    
    // Sanitize array of selected services
    let selectedServices: string[] = [];
    if (Array.isArray(data.selectedServices)) {
      selectedServices = data.selectedServices.map((service: string) => sanitizeInput(service));
    }
    
    // Save to database
    const luxeMembership = await prisma.luxeMembership.create({
      data: {
        email,
        phone,
        name,
        selectedServices,
        additionalInfo,
      }
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
    
    // Format the selected services for email
    const formattedServices = selectedServices.map(service => `<li>${service}</li>`).join('');
    
    // Send email to the user if contact detail is an email
    if (email) {
      await transporter.sendMail({
        from: `"The Villa List LUXE" <info@thevillalist.com>`,
        to: email,
        subject: "Welcome to LUXE Membership! 🌟",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #DAA520;">Welcome to LUXE Membership!</h2>
            <p>Thank you for joining our exclusive LUXE membership program. Your membership has been confirmed!</p>
            
            <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #DAA520;">
              <h3 style="color: #DAA520; margin-top: 0;">Your LUXE Membership Details</h3>
              ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
              ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              
              <p><strong>Selected Premium Services:</strong></p>
              <ul style="padding-left: 20px;">
                ${formattedServices}
              </ul>
              
              <p><strong>Membership Status:</strong> Active</p>
              <p><strong>Membership ID:</strong> LUXE-${luxeMembership.id.substring(0, 8).toUpperCase()}</p>
            </div>
            
            <p>
              Our LUXE concierge team will contact you within 24 hours to discuss your selected services
              and provide you with exclusive access to our premium offerings.
            </p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #DAA520;">LUXE Member Benefits</h3>
              <ul style="padding-left: 20px;">
                <li>Priority booking for all properties</li>
                <li>Exclusive access to limited availability properties</li>
                <li>Complimentary upgrades when available</li>
                <li>24/7 dedicated concierge service</li>
                <li>Special rates on premium services</li>
              </ul>
            </div>
            
            <p>
              If you have any questions about your membership, please don't hesitate to contact our
              dedicated LUXE support team.
            </p>
            
            <p style="color: #888;">Best Regards,</p>
            <p style="color: #888;">The Villa List LUXE Team</p>
          </div>
        `,
      });
    }
    
    // Always send email to the admin
    await transporter.sendMail({
      from: `"The Villa List LUXE" <info@thevillalist.com>`,
      to: "Eyosiasbitsu@gmail.com",
      subject: "🔔 New LUXE Membership Registration",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #DAA520;">New LUXE Membership Registration</h2>
          <p><strong>Details of the new member:</strong></p>
          <ul style="list-style: none; padding: 0;">
            ${name ? `<li><strong>Name:</strong> ${name}</li>` : '<li><strong>Name:</strong> Not provided</li>'}
            ${email ? `<li><strong>Email:</strong> ${email}</li>` : ''}
            ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
            ${!email && !phone && contactDetail ? `<li><strong>Other Contact:</strong> ${contactDetail}</li>` : ''}
          </ul>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #DAA520;">Selected Services</h3>
            <ul>
              ${formattedServices || '<li>No services selected</li>'}
            </ul>
          </div>
          
          ${additionalInfo ? `
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #DAA520;">Additional Information</h3>
            <p style="white-space: pre-wrap;">${additionalInfo}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #DAA520;">Membership Information</h3>
            <p><strong>Date Registered:</strong> ${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p><strong>Membership ID:</strong> LUXE-${luxeMembership.id.substring(0, 8).toUpperCase()}</p>
            <p><strong>Priority Level:</strong> High</p>
          </div>
          
          <p>
            Please contact this member within 24 hours to discuss their selected services and provide them with exclusive access.
            ${email ? `The member can be reached by email at ${email}.` : ''}
            ${phone ? `The member can be reached by phone at ${phone}.` : ''}
            ${!email && !phone && contactDetail ? `The member provided this contact information: ${contactDetail}` : ''}
            ${!email && !phone && !contactDetail ? 'No contact information was provided.' : ''}
          </p>
          
          <p style="color: #888;">Best Regards,</p>
          <p style="color: #888;">The Villa List LUXE System</p>
        </div>
      `,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "LUXE membership registered successfully.",
      membershipId: luxeMembership.id
    });
    
  } catch (error) {
    console.error("Error processing LUXE membership:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process LUXE membership." },
      { status: 500 }
    );
  }
} 