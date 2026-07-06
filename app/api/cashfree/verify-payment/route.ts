import { NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { processWebhookAndTickets } from '@/lib/sheetWebhook';

// Initialize Cashfree instance
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "",
  process.env.CASHFREE_SECRET_KEY || ""
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("4. /api/cashfree/verify-payment - received body:", body);
    
    const { orderId, name, phone, email, source, bogo, guest_name, guest_phone, guest_email } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    // Call Cashfree's Get Order API using the SDK
    const orderResponse = await cashfree.PGFetchOrder(orderId);
    
    if (orderResponse.data?.order_status !== "PAID") {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const primaryTicketId = `${orderId}-P`;
    let guestTicketId = null;
    
    if (bogo && guest_name && guest_phone && guest_email) {
      guestTicketId = `${orderId}-G`;
    }

    const orderAmount = orderResponse.data?.order_amount || 20;
    const donationAmount = Math.max(0, orderAmount - 20);

    const ticketsCreated = await processWebhookAndTickets({
      orderId,
      name,
      phone,
      email,
      source,
      bogo,
      guest_name,
      guest_phone,
      guest_email,
      orderAmount,
      donationAmount
    });

    return NextResponse.json({ success: true, tickets: ticketsCreated, amount: orderAmount });
  } catch (error: any) {
    console.error('Error verifying Cashfree order:', error.response?.data || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
