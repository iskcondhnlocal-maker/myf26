import { NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Initialize Cashfree instance
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "",
  process.env.CASHFREE_SECRET_KEY || ""
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("2. /api/cashfree/create-order - received body:", body);
    
    const { amount, name, phone, email, source, bogo, guest_name, guest_phone, guest_email } = body;

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
       return NextResponse.json({ success: false, error: 'Invalid primary phone number' }, { status: 400 });
    }
    if (bogo && guest_phone && !phoneRegex.test(guest_phone)) {
       return NextResponse.json({ success: false, error: 'Invalid guest phone number' }, { status: 400 });
    }

    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const order_id = `MYF26-${timestamp}-${randomSuffix}`;
    
    const order_amount = amount || 20;
    const customer_id = phone ? phone.replace(/[^0-9]/g, '') : `cust_${timestamp}`;

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const return_url = `${protocol}://${host}/thank-you?order_id={order_id}`;

    const request = {
      order_amount: order_amount,
      order_currency: "INR",
      order_id: order_id,
      customer_details: {
        customer_id: customer_id,
        customer_name: name || "Guest",
        customer_email: email || "guest@example.com",
        customer_phone: phone || "9999999999",
      },
      order_meta: {
        return_url: return_url
      }
    };

    const response = await cashfree.PGCreateOrder(request);
    
    if (response.data) {
       return NextResponse.json({
         orderId: response.data.order_id,
         paymentSessionId: response.data.payment_session_id
       });
    }

    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 400 });
  } catch (error: any) {
    console.error('Error creating Cashfree order:', error.response?.data || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
