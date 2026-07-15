const fetch = require('node-fetch');
require('dotenv').config({ path: '.env' });

async function pushData() {
  const webhookUrl = process.env.SHEET_WEBHOOK_URL;
  const payload = {
    action: "paid",
    ticket_id: "MYF26-1784110827041-952-P",
    role: "primary",
    name: "Sandeep Kumar",
    Name: "Sandeep Kumar",
    fullName: "Sandeep Kumar",
    full_name: "Sandeep Kumar",
    phone: "9315841783",
    Phone: "9315841783",
    phoneNumber: "9315841783",
    phone_number: "9315841783",
    email: "lighthouse210976@gmail.com",
    Email: "lighthouse210976@gmail.com",
    source: "paid-common",
    Source: "paid-common",
    amount: 20,
    donation: 0,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.text();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

pushData();
