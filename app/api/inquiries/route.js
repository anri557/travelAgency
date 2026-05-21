import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const scratchDir = path.join(process.cwd(), 'scratch');
const inquiriesFilePath = path.join(scratchDir, 'inquiries.json');

// GET all inquiries
export async function GET(req) {
  try {
    let inquiries = [];
    if (fs.existsSync(inquiriesFilePath)) {
      try {
        inquiries = JSON.parse(fs.readFileSync(inquiriesFilePath, 'utf8'));
        // Sort by createdAt descending (newest first)
        inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (err) {
        console.error("Error reading/parsing inquiries.json:", err);
      }
    }
    return NextResponse.json({
      success: true,
      inquiries
    });
  } catch (error) {
    console.error("GET inquiries error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}

// DELETE a specific inquiry
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Missing inquiry ID"
      }, { status: 400 });
    }

    if (!fs.existsSync(inquiriesFilePath)) {
      return NextResponse.json({
        success: false,
        error: "Database file not found"
      }, { status: 404 });
    }

    let inquiries = [];
    try {
      inquiries = JSON.parse(fs.readFileSync(inquiriesFilePath, 'utf8'));
    } catch (err) {
      console.error("Error parsing inquiries.json on delete:", err);
      return NextResponse.json({
        success: false,
        error: "Database corrupt"
      }, { status: 500 });
    }

    const filtered = inquiries.filter(inq => inq.id !== id);
    
    // Save updated list
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(filtered, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully"
    });
  } catch (error) {
    console.error("DELETE inquiry error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}
