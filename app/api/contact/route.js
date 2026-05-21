import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, destination, date, tourType, message, hotel, hotelPrice, duration } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields (name, email, message)"
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: "Invalid email address format"
      }, { status: 400 });
    }

    const inquiry = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || 'N/A',
      destination: destination || 'General Inquiry',
      travelDate: date || 'N/A',
      tourType: tourType || 'N/A',
      hotel: hotel || 'N/A',
      hotelPrice: hotelPrice || 'N/A',
      duration: duration || 'N/A',
      message,
      createdAt: new Date().toISOString()
    };

    // Log details to stdout
    console.log("========================================");
    console.log(`[Contact Inquiry] Received:`);
    console.log(`Name: ${inquiry.name}`);
    console.log(`Email: ${inquiry.email}`);
    console.log(`Phone: ${inquiry.phone}`);
    console.log(`Destination: ${inquiry.destination}`);
    console.log(`Travel Date: ${inquiry.travelDate}`);
    console.log(`Duration: ${inquiry.duration}`);
    console.log(`Tour Type: ${inquiry.tourType}`);
    console.log(`Hotel: ${inquiry.hotel}`);
    console.log(`Hotel Price: ${inquiry.hotelPrice}`);
    console.log(`Message: ${inquiry.message}`);
    console.log("========================================");

    // Save locally to a scratch folder as a mock persistent database file
    const scratchDir = path.join(process.cwd(), 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }
    
    const inquiriesFilePath = path.join(scratchDir, 'inquiries.json');
    let existingInquiries = [];
    if (fs.existsSync(inquiriesFilePath)) {
      try {
        existingInquiries = JSON.parse(fs.readFileSync(inquiriesFilePath, 'utf8'));
      } catch (e) {
        console.error("Could not parse inquiries.json, resetting:", e);
      }
    }
    existingInquiries.push(inquiry);
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(existingInquiries, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: "Inquiry saved successfully"
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}
