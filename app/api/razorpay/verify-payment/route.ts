import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { processWebhookAndTickets } from '@/lib/sheetWebhook';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("4. /api/razorpay/verify-payment - received body:", body);
    
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature, name, phone, email, source, campaign_name, adset_name, ad_name, bogo, guest_name, guest_phone, guest_email } = body;

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    // --- DEV ONLY: Skip Razorpay verification for local testing ---
    if (process.env.NODE_ENV === 'development' && razorpay_payment_id === 'dev_test_payment') {
      console.log("DEV MODE: Skipping Razorpay signature and fetch validation");
      // Hardcode total amount to 20 for test
      const orderAmount = 20; 
      const donationAmount = 0;
      
      const ticketsCreated = await processWebhookAndTickets({
        orderId,
        name,
        phone,
        email,
        source,
        campaign_name,
        adset_name,
        ad_name,
        bogo,
        guest_name,
        guest_phone,
        guest_email,
        orderAmount,
        donationAmount
      });
      return NextResponse.json({ success: true, tickets: ticketsCreated, amount: orderAmount });
    }
    // --- END DEV ONLY ---

    // Verify signature
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
                                    .update(razorpay_order_id + "|" + razorpay_payment_id)
                                    .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    // Fetch payment to confirm status and amount
    let payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status === "authorized") {
      // Auto-capture if not captured already
      payment = await razorpay.payments.capture(razorpay_payment_id, payment.amount, payment.currency);
    }

    if (payment.status !== "captured") {
      return NextResponse.json({ success: false, error: 'Payment not captured' }, { status: 400 });
    }

    // Fetch the original order to get the fallback data from notes
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = order.notes || {};

    const finalName = name || notes.name || "";
    const finalPhone = phone || notes.phone || "";
    const finalEmail = email || notes.email || "";
    const finalSource = source || notes.source || "";
    const finalCampaignName = campaign_name || notes.campaign_name || "";
    const finalAdsetName = adset_name || notes.adset_name || "";
    const finalAdName = ad_name || notes.ad_name || "";
    const finalBogo = bogo !== undefined ? bogo : (notes.bogo === "true");
    const finalGuestName = guest_name || notes.guest_name || "";
    const finalGuestPhone = guest_phone || notes.guest_phone || "";
    const finalGuestEmail = guest_email || notes.guest_email || "";

    const orderAmount = Number(payment.amount) / 100;
    const donationAmount = Math.max(0, orderAmount - 20);

    const ticketsCreated = await processWebhookAndTickets({
      orderId,
      name: finalName,
      phone: finalPhone,
      email: finalEmail,
      source: finalSource,
      campaign_name: finalCampaignName,
      adset_name: finalAdsetName,
      ad_name: finalAdName,
      bogo: finalBogo,
      guest_name: finalGuestName,
      guest_phone: finalGuestPhone,
      guest_email: finalGuestEmail,
      orderAmount,
      donationAmount
    });

    return NextResponse.json({ success: true, tickets: ticketsCreated, amount: orderAmount });
  } catch (error: any) {
    console.error('Error verifying Razorpay order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
