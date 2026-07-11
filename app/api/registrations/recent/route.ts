import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sheetWebhookUrl = process.env.SHEET_WEBHOOK_URL;
    
    if (!sheetWebhookUrl) {
      console.error("SHEET_WEBHOOK_URL is missing in environment variables.");
      return NextResponse.json({ success: false, data: [] }, { status: 500 });
    }

    const res = await fetch(`${sheetWebhookUrl}?action=recent`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from webhook, status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching recent registrations:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
