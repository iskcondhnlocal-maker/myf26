import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheetWebhookUrl = process.env.SHEET_WEBHOOK_URL;

    if (!sheetWebhookUrl) {
      console.error("SHEET_WEBHOOK_URL missing");
      return NextResponse.json({ success: false, error: "Missing webhook URL" }, { status: 500 });
    }

    const { order_id, name, phone, email, source, bogo, guest_name, guest_phone, guest_email, campaign_name, adset_name, ad_name } = body;

    const primaryTicketId = `${order_id}-P`;
    let guestTicketId = null;
    
    if (bogo && guest_name && guest_phone && guest_email) {
      guestTicketId = `${order_id}-G`;
    }

    const primaryPayload = {
      action: 'pending',
      ticket_id: primaryTicketId,
      role: "primary",
      name,
      Name: name,
      phone,
      Phone: phone,
      email,
      Email: email,
      source: source || "",
      campaign_name: campaign_name || "",
      adset_name: adset_name || "",
      ad_name: ad_name || "",
      order_id,
      linked_ticket_id: guestTicketId || "",
    };

    console.log("Sending pending primary registration to webhook:", primaryPayload);

    // Fire and forget (don't block frontend on this)
    fetch(sheetWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(primaryPayload)
    }).catch(err => console.error("Pending webhook error (primary):", err));

    if (guestTicketId) {
      const guestPayload = {
        action: 'pending',
        ticket_id: guestTicketId,
        role: "guest",
        name: guest_name,
        Name: guest_name,
        phone: guest_phone,
        Phone: guest_phone,
        email: guest_email,
        Email: guest_email,
        source: source || "",
        campaign_name: campaign_name || "",
        adset_name: adset_name || "",
        ad_name: ad_name || "",
        order_id,
        linked_ticket_id: primaryTicketId,
      };
      console.log("Sending pending guest registration to webhook:", guestPayload);
      fetch(sheetWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestPayload)
      }).catch(err => console.error("Pending webhook error (guest):", err));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in /api/registrations/pending:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
