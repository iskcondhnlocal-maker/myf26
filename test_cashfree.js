const fs = require('fs');

// Parse .env manually
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0] && parts.length > 1) {
        const k = parts[0].trim();
        const v = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        env[k] = v;
    }
});

const { Cashfree, CFEnvironment } = require('cashfree-pg');

Cashfree.XClientId = env.CASHFREE_APP_ID;
Cashfree.XClientSecret = env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = CFEnvironment.SANDBOX;

const cf = new Cashfree(
    CFEnvironment.SANDBOX,
    env.CASHFREE_APP_ID,
    env.CASHFREE_SECRET_KEY
);

async function test() {
    try {
        console.log("APP ID Starts with:", env.CASHFREE_APP_ID.substring(0, 5));
        console.log("SECRET Starts with:", env.CASHFREE_SECRET_KEY.substring(0, 5));
        
        const request = {
            order_amount: 20,
            order_currency: "INR",
            order_id: "MYF-TEST-" + Date.now(),
            customer_details: {
                customer_id: "testCustomer",
                customer_phone: "9999999999"
            }
        };

        const response = await cf.PGCreateOrder(request);
        console.log("Success! Session ID:", response.data.payment_session_id);
    } catch (e) {
        if (e.response && e.response.data) {
            console.log("CASHFREE API ERROR (403/401):", JSON.stringify(e.response.data, null, 2));
        } else {
            console.log("OTHER ERROR:", e.message);
        }
    }
}
test();
