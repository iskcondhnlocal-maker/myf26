export async function processWebhookAndTickets(params: {
  orderId: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  bogo: boolean;
  guest_name?: string;
  guest_phone?: string;
  guest_email?: string;
  orderAmount: number;
  donationAmount: number;
}) {
  const { orderId, name, phone, email, source, bogo, guest_name, guest_phone, guest_email, orderAmount, donationAmount } = params;

  const primaryTicketId = `${orderId}-P`;
  let guestTicketId = null;
  
  if (bogo && guest_name && guest_phone && guest_email) {
    guestTicketId = `${orderId}-G`;
  }

  const ticketsCreated: any[] = [];
  const sheetWebhookUrl = process.env.SHEET_WEBHOOK_URL;

  // Helper to check if ticket exists
  async function checkTicketExists(tId: string) {
     if (!sheetWebhookUrl || !sheetWebhookUrl.startsWith('http')) return null;
     try {
       const res = await fetch(`${sheetWebhookUrl}?ticket_id=${tId}`);
       const data = await res.json();
       if (data && data.found) return data;
     } catch (err) {
       // ignore
     }
     return null;
  }

  // Send primary ticket
  if (sheetWebhookUrl && sheetWebhookUrl.startsWith('http')) {
    let existingPrimary = await checkTicketExists(primaryTicketId);
    if (existingPrimary) {
       ticketsCreated.push({
         ticket_id: primaryTicketId,
         role: "primary",
         qr_url: existingPrimary.qr_url || null
       });
    } else {
      try {
        const primaryPayload = {
          ticket_id: primaryTicketId,
          role: "primary",
          name,
          Name: name,
          fullName: name,
          full_name: name,
          phone,
          Phone: phone,
          phoneNumber: phone,
          phone_number: phone,
          email,
          Email: email,
          source: source || "",
          Source: source || "",
          order_id: orderId,
          linked_ticket_id: guestTicketId,
          amount: orderAmount,
          Amount: orderAmount,
          donation_amount: donationAmount,
          Donation_Amount: donationAmount
        };
        console.log("webhook helper - POSTing primary ticket to webhook:", primaryPayload);

        const res = await fetch(sheetWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(primaryPayload)
        });
        const webhookData = await res.json();
        ticketsCreated.push({
          ticket_id: primaryTicketId,
          role: "primary",
          qr_url: webhookData.qr_url || null
        });
      } catch (err) {
        console.error("Failed to send primary ticket to webhook", err);
        ticketsCreated.push({ ticket_id: primaryTicketId, role: "primary", qr_url: null });
      }
    }
  } else {
    ticketsCreated.push({ ticket_id: primaryTicketId, role: "primary", qr_url: null });
  }

  // Send guest ticket if applicable
  if (guestTicketId) {
    if (sheetWebhookUrl && sheetWebhookUrl.startsWith('http')) {
      let existingGuest = await checkTicketExists(guestTicketId);
      if (existingGuest) {
         ticketsCreated.push({
           ticket_id: guestTicketId,
           role: "guest",
           qr_url: existingGuest.qr_url || null
         });
      } else {
        try {
          const guestPayload = {
            ticket_id: guestTicketId,
            role: "guest",
            name: guest_name,
            Name: guest_name,
            fullName: guest_name,
            full_name: guest_name,
            phone: guest_phone,
            Phone: guest_phone,
            phoneNumber: guest_phone,
            phone_number: guest_phone,
            email: guest_email,
            Email: guest_email,
            source: source || "",
            Source: source || "",
            order_id: orderId,
            linked_ticket_id: primaryTicketId,
            amount: 0, // BOGO is free
            Amount: 0,
            donation_amount: 0,
            Donation_Amount: 0
          };
          console.log("webhook helper - POSTing guest ticket to webhook:", guestPayload);

          const res = await fetch(sheetWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guestPayload)
          });
          const webhookData = await res.json();
          ticketsCreated.push({
            ticket_id: guestTicketId,
            role: "guest",
            qr_url: webhookData.qr_url || null
          });
        } catch (err) {
          console.error("Failed to send guest ticket to webhook", err);
          ticketsCreated.push({ ticket_id: guestTicketId, role: "guest", qr_url: null });
        }
      }
    } else {
      ticketsCreated.push({ ticket_id: guestTicketId, role: "guest", qr_url: null });
    }
  }

  return ticketsCreated;
}
