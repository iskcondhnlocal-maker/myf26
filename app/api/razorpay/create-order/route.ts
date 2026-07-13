import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("2. /api/razorpay/create-order - received body:", body);
    
    const { amount, name, phone, email, source, campaign_name, adset_name, ad_name, bogo, guest_name, guest_phone, guest_email, orderId } = body;

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
       return NextResponse.json({ success: false, error: 'Invalid primary phone number' }, { status: 400 });
    }
    if (bogo && guest_phone && !phoneRegex.test(guest_phone)) {
       return NextResponse.json({ success: false, error: 'Invalid guest phone number' }, { status: 400 });
    }

    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const our_order_id = orderId || `MYF26-${timestamp}-${randomSuffix}`;
    
    const order_amount = amount || 20;

    const options = {
      amount: order_amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: our_order_id,
      notes: {
        name,
        phone,
        email,
        source,
        campaign_name: campaign_name || "",
        adset_name: adset_name || "",
        ad_name: ad_name || "",
        bogo: bogo ? "true" : "false",
        guest_name: guest_name || "",
        guest_phone: guest_phone || ""
      }
    };

    const order = await razorpay.orders.create(options);
    
    if (order && order.id) {
       return NextResponse.json({
         razorpay_order_id: order.id,
         our_order_id,
         amount: order_amount,
         key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
       });
    }

    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 400 });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
