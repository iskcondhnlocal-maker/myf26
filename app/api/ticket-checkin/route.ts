import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticket_id } = body;

    if (!ticket_id) {
      return NextResponse.json({ error: 'ticket_id is required' }, { status: 400 });
    }

    const sheetWebhookUrl = process.env.SHEET_WEBHOOK_URL;

    if (!sheetWebhookUrl || !sheetWebhookUrl.startsWith('http')) {
      return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
    }

    const response = await fetch(sheetWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: "checkin", ticket_id })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error checking in ticket:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
