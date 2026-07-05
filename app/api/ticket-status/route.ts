import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticket_id = searchParams.get('ticket_id');

  if (!ticket_id) {
    return NextResponse.json({ error: 'ticket_id is required' }, { status: 400 });
  }

  const sheetWebhookUrl = process.env.SHEET_WEBHOOK_URL;

  if (!sheetWebhookUrl || !sheetWebhookUrl.startsWith('http')) {
    // If webhook is not configured, simulate a successful response for testing
    return NextResponse.json({ 
      error: 'Webhook URL not configured',
      mock: true
    }, { status: 500 });
  }

  try {
    const response = await fetch(`${sheetWebhookUrl}?ticket_id=${ticket_id}`);
    const data = await response.json();
    
    if (data.success && data.ticket) {
      return NextResponse.json({
        found: true,
        name: data.ticket.Name,
        role: data.ticket.Role,
        checked_in: data.ticket.Checked_in,
        checked_in_at: data.ticket.Checked_in_at
      });
    } else {
      return NextResponse.json({ 
        found: false, 
        error: data.error || 'Ticket not found in database' 
      });
    }
  } catch (error: any) {
    console.error('Error fetching ticket status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
