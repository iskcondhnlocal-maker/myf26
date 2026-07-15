import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.SHEET_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('SHEET_WEBHOOK_URL not configured');
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    // Call the Google Apps Script Webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add_guest',
        primary_phone: body.primary_phone,
        guest_name: body.guest_name,
        guest_phone: body.guest_phone,
        guest_email: body.guest_email || ''
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('API Error: Webhook returned non-JSON:', response.status, text.slice(0, 300));
      return NextResponse.json(
        { success: false, error: 'The registration server returned an invalid response. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding guest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
