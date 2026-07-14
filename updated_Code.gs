// ====== CONFIG — edit these lines ======
const SHEET_NAME = "Registration";              // exact tab name at the bottom of your sheet
const EVENT_NAME = "Mega Youth Festival 2026";
const WHATSAPP_LINK = "https://chat.whatsapp.com/Lal2cZdnc2d8LdegxV7dUD";
const VERIFY_BASE_URL = "https://myf.iskcondhanbad.com/verify/";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === "checkin") return handleCheckin(data);
    if (data.action === "pending") return handlePending(data);
    return handleRegister(data);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e.parameter.action === "recent") return handleRecentRegistrations();

  const ticketId = e.parameter.ticket_id;
  if (!ticketId) return jsonResponse({ success: false, error: "ticket_id required" });
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf("ticket_id");
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(ticketId)) {
      const row = {};
      headers.forEach((h, idx) => row[h] = values[i][idx]);
      const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
                    encodeURIComponent(VERIFY_BASE_URL + ticketId);
      row.qr_url = qrUrl;
      return jsonResponse({ success: true, ticket: row });
    }
  }
  return jsonResponse({ success: false, error: "Ticket not found" });
}

function handleRecentRegistrations() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const nameCol = headers.indexOf("Name");
  const timestampCol = headers.indexOf("Timestamp");

  const recent = [];
  for (let i = values.length - 1; i >= 1 && recent.length < 15; i--) {
    const fullName = values[i][nameCol];
    const timestamp = values[i][timestampCol];
    if (!fullName || !timestamp) continue; 
    const firstName = String(fullName).split(" ")[0];
    recent.push({
      firstName: firstName,
      timestamp: timestamp,
      location: "Dhanbad"
    });
  }

  return jsonResponse({ success: true, data: recent });
}

function handlePending(data) {
  const sheet = getSheet();
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  
  const idCol = headers.indexOf("ticket_id");
  const nameCol = headers.indexOf("Name");
  const phoneCol = headers.indexOf("Phone");
  const emailCol = headers.indexOf("Email");
  
  let rowIndex = -1;
  // Check if ticket_id already exists
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idCol]) === String(data.ticket_id)) {
      rowIndex = i + 1; // +1 because sheet is 1-indexed
      break;
    }
  }

  if (rowIndex > -1) {
    // Update existing row in place
    if (nameCol > -1) sheet.getRange(rowIndex, nameCol + 1).setValue(data.name || "");
    if (phoneCol > -1) sheet.getRange(rowIndex, phoneCol + 1).setValue(data.phone || "");
    if (emailCol > -1) sheet.getRange(rowIndex, emailCol + 1).setValue(data.email || "");
  } else {
    // Append new row with Payment_status = pending
    const rowValues = headers.map(h => {
      switch (h) {
        case "Timestamp": return new Date();
        case "ticket_id": return data.ticket_id || "";
        case "Role": return data.role || "";
        case "Linked_ticket_id": return data.linked_ticket_id || "";
        case "Name": return data.name || "";
        case "Phone": return data.phone || "";
        case "Email": return data.email || "";
        case "Source": return data.source || "";
        case "Campaign_name": return data.campaign_name || "";
        case "Adset_name": return data.adset_name || "";
        case "Ad_name": return data.ad_name || "";
        case "Payment_status": return "pending";
        // Leave order_id, Amount, Donation_amount blank
        default: return ""; 
      }
    });
    sheet.appendRow(rowValues);
  }

  return jsonResponse({ success: true, status: "pending logged" });
}

function handleRegister(data) {
  const sheet = getSheet();
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  
  const idCol = headers.indexOf("ticket_id");
  const phoneCol = headers.indexOf("Phone");
  const emailCol = headers.indexOf("Email");
  const paymentStatusCol = headers.indexOf("Payment_status");
  
  // Find if this ticket_id exists
  let existingRowIndex = -1;
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idCol]) === String(data.ticket_id)) {
      existingRowIndex = i + 1; // +1 for 1-based indexing
      break;
    }
  }

  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
                encodeURIComponent(VERIFY_BASE_URL + data.ticket_id);

  if (existingRowIndex > -1) {
    // Update existing row
    const orderIdCol = headers.indexOf("order_id");
    const amountCol = headers.indexOf("Amount");
    const donationCol = headers.indexOf("Donation_amount");
    
    if (paymentStatusCol > -1) sheet.getRange(existingRowIndex, paymentStatusCol + 1).setValue("paid");
    if (orderIdCol > -1) sheet.getRange(existingRowIndex, orderIdCol + 1).setValue(data.order_id || "");
    if (amountCol > -1) sheet.getRange(existingRowIndex, amountCol + 1).setValue(data.amount || 0);
    if (donationCol > -1) sheet.getRange(existingRowIndex, donationCol + 1).setValue(data.donation_amount || 0);
    
    // Refresh allData to reflect changes
    const updatedData = sheet.getDataRange().getValues();
    
    // Resolve other pending rows for same phone+email
    for (let i = 1; i < updatedData.length; i++) {
      if (i + 1 === existingRowIndex) continue; // Skip the one we just updated
      if (data.phone && data.email &&
          updatedData[i][phoneCol] == data.phone &&
          updatedData[i][emailCol] == data.email &&
          updatedData[i][paymentStatusCol] === "pending") {
        sheet.getRange(i + 1, paymentStatusCol + 1).setValue("converted-elsewhere");
      }
    }
  } else {
    // Fallback append new row
    let possibleDuplicate = "";
    for (let i = 1; i < allData.length; i++) {
      if (data.phone && data.email &&
          allData[i][phoneCol] === data.phone &&
          allData[i][emailCol] === data.email) {
        possibleDuplicate = "yes";
        break;
      }
    }

    const rowValues = headers.map(h => {
      switch (h) {
        case "Timestamp": return new Date();
        case "ticket_id": return data.ticket_id || "";
        case "Role": return data.role || "";
        case "Linked_ticket_id": return data.linked_ticket_id || "";
        case "Name": return data.name || "";
        case "Phone": return data.phone || "";
        case "Email": return data.email || "";
        case "Source": return data.source || "";
        case "Campaign_name": return data.campaign_name || "";
        case "Adset_name": return data.adset_name || "";
        case "Ad_name": return data.ad_name || "";
        case "order_id": return data.order_id || "";
        case "Amount": return data.amount || 0;
        case "Donation_amount": return data.donation_amount || 0;
        case "Possible_duplicate": return possibleDuplicate;
        case "Payment_status": return "paid";
        case "Checked_in": return "no";
        case "Checked_in_at": return "";
        case "Email_sent": return "";
        default: return ""; 
      }
    });
    sheet.appendRow(rowValues);
    
    // Resolve other pending rows
    const updatedData = sheet.getDataRange().getValues();
    for (let i = 1; i < updatedData.length - 1; i++) {
      if (data.phone && data.email &&
          updatedData[i][phoneCol] == data.phone &&
          updatedData[i][emailCol] == data.email &&
          updatedData[i][paymentStatusCol] === "pending") {
        sheet.getRange(i + 1, paymentStatusCol + 1).setValue("converted-elsewhere");
      }
    }
  }

  return jsonResponse({ success: true, ticket_id: data.ticket_id, qr_url: qrUrl });
}

function sendPendingEmails() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const emailCol = headers.indexOf("Email");
  const nameCol = headers.indexOf("Name");
  const ticketCol = headers.indexOf("ticket_id");
  const roleCol = headers.indexOf("Role");
  const sentCol = headers.indexOf("Email_sent");
  const paymentStatusCol = headers.indexOf("Payment_status");

  for (let i = 1; i < values.length; i++) {
    // Only send if payment is paid (or if no Payment_status column exists yet, fallback to sending to avoid breaking old rows)
    const isPaid = (paymentStatusCol === -1) ? true : (values[i][paymentStatusCol] === "paid");
    
    if (isPaid && values[i][sentCol] !== "yes" && values[i][emailCol]) {
      const ticketId = values[i][ticketCol];
      const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
                    encodeURIComponent(VERIFY_BASE_URL + ticketId);
      try {
        sendPassEmail(values[i][nameCol], values[i][emailCol], ticketId, values[i][roleCol], qrUrl);
        sheet.getRange(i + 1, sentCol + 1).setValue("yes");
      } catch (err) {
        
      }
    }
  }
}

function handleCheckin(data) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf("ticket_id");
  const checkedCol = headers.indexOf("Checked_in");
  const checkedAtCol = headers.indexOf("Checked_in_at");

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(data.ticket_id)) {
      if (values[i][checkedCol] === "yes") {
        return jsonResponse({ success: false, already: true, message: "Already checked in" });
      }
      sheet.getRange(i + 1, checkedCol + 1).setValue("yes");
      sheet.getRange(i + 1, checkedAtCol + 1).setValue(new Date());
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ success: false, error: "Ticket not found" });
}

function sendPassEmail(name, email, ticketId, role, qrUrl) {
  const subject = "Aapka MYF26 Seat Confirm Ho Gaya ✅";

  const htmlBody = `
  <div style="background-color:#0D1B3E; padding:30px 20px; font-family:Arial, sans-serif; color:#FFFFFF;">
    <div style="max-width:500px; margin:0 auto;">

      <div style="display:inline-block; background-color:#C41E2A; color:#FFFFFF; font-size:12px; font-weight:bold; letter-spacing:1px; padding:6px 14px; border-radius:4px; margin-bottom:20px;">
        19 JULY · GOLF GROUND, DHANBAD
      </div>

      <h1 style="color:#3ED6D6; font-size:24px; margin:10px 0;">Aapka Seat Confirm Ho Gaya! 🎉</h1>

      <p style="font-size:15px; color:#FFFFFF; margin:0 0 22px 0; line-height:1.5;">Hey ${name}, aapka MYF26 registration confirm ho gaya hai — ab kuch important baatein neeche padh lijiye.</p>

      <div style="background-color:#13234F; border:1px solid #3ED6D6; border-radius:8px; padding:18px; margin-bottom:25px;">
        <p style="margin:0 0 10px 0; font-weight:bold; font-size:15px;">Mega Youth Festival 2026</p>
        <p style="margin:0; font-size:13px; color:#D7DEEF;">📅 19 July 2026 &nbsp;·&nbsp; 📍 Golf Ground, Dhanbad &nbsp;·&nbsp; 🕙 Morning 10AM</p>
      </div>

      <div style="background-color:#FFFFFF; border-radius:8px; padding:20px; text-align:center; margin-bottom:15px;">
        <img src="${qrUrl}" alt="QR Code" style="width:200px; height:200px;" />
      </div>

      <p style="text-align:center; font-size:13px; color:#3ED6D6; margin:0 0 5px 0;">Ticket ID: ${ticketId}</p>
      <p style="text-align:center; font-size:13px; color:#A9B6D9; margin:0 0 25px 0;">Yeh QR gate par dikhaiye entry ke liye.</p>

      <div style="border:1px dashed #3ED6D6; border-radius:8px; padding:18px; margin-bottom:25px;">
        <p style="text-align:center; font-size:12px; font-weight:bold; letter-spacing:1px; color:#3ED6D6; margin:0 0 10px 0;">BEFORE YOU COME</p>
        <ul style="font-size:14px; color:#FFFFFF; padding-left:20px; margin:0;">
          <li style="margin-bottom:8px;">Venue pe 9:30 AM tak pahunch jaayein</li>
          <li style="margin-bottom:8px;">Yeh QR code screenshot lekar apne phone mein save kar lein, entry ke time yehi dikhana hoga</li>
          <li style="margin-bottom:0;">Yeh QR sirf ek baar scan hoga — kisi aur ke saath share na karein</li>
        </ul>
      </div>

      <p style="color:#3ED6D6; font-size:14px; text-align:center; font-weight:bold; margin:0 0 25px 0;">Dhanbad ka sabse bada youth festival — 19 July ko miss mat kariye!</p>

      <div style="background-color:#123A3A; border-radius:8px; padding:18px; text-align:center; margin-bottom:25px;">
        <p style="font-size:12px; font-weight:bold; letter-spacing:1px; color:#3ED6D6; margin:0 0 10px 0;">NEXT STEP</p>
        <p style="font-size:14px; margin:0 0 15px 0;">WhatsApp group join kariye — saare updates aur reminders sirf wahin milenge.</p>
        <a href="${WHATSAPP_LINK}" style="display:inline-block; background-color:#3ED6D6; color:#0D1B3E; font-weight:bold; font-size:14px; padding:12px 24px; border-radius:6px; text-decoration:none;">Join WhatsApp Group →</a>
      </div>

      <p style="text-align:center; font-size:12px; color:#7C8AB8; margin:0;">19 July ko milte hain.<br/>— Team Mega Youth Festival, ISKCON Dhanbad</p>

    </div>
  </div>
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: "Mega Youth Festival 2026"
  });
}

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
