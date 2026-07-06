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
    
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature, name, phone, email, source, bogo, guest_name, guest_phone, guest_email } = body;

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

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

    // amount is in paise
    const orderAmount = Number(payment.amount) / 100;
    const donationAmount = Math.max(0, orderAmount - 1);

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
    console.error('Error verifying Razorpay order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
