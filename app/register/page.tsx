"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
// @ts-expect-error - Cashfree JS SDK does not provide TypeScript declarations
import { load } from "@cashfreepayments/cashfree-js";
import Script from "next/script";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "offline";
  const basePrice = 20;

  const [bogoEnabled, setBogoEnabled] = useState(false);
  const [donationEnabled, setDonationEnabled] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const phoneRegex = /^[6-9]\d{9}$/;
  const isPhoneValid = phone === "" || phoneRegex.test(phone);
  const isGuestPhoneValid = !bogoEnabled || guestPhone === "" || phoneRegex.test(guestPhone);
  const isFormValid = name && email && phoneRegex.test(phone) && (!bogoEnabled || (guestName && guestEmail && phoneRegex.test(guestPhone)));

  const total = basePrice + (donationEnabled ? donationAmount : 0);

  const [cashfree, setCashfree] = useState<any>(null);

  useEffect(() => {
    load({ mode: "sandbox" }).then((cf: any) => setCashfree(cf));

    // Restore form data if returning from checkout
    const savedStateStr = sessionStorage.getItem("myf_register_state");
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        setBogoEnabled(savedState.bogoEnabled);
        setDonationEnabled(savedState.donationEnabled);
        setDonationAmount(savedState.donationAmount);
        setName(savedState.name);
        setPhone(savedState.phone);
        setEmail(savedState.email);
        setGuestName(savedState.guestName);
        setGuestPhone(savedState.guestPhone);
        setGuestEmail(savedState.guestEmail);
      } catch (e) {
        console.error("Failed to restore state", e);
      }
    }
  }, []);



  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg("");

    // Save state before redirecting
    sessionStorage.setItem("myf_register_state", JSON.stringify({
      bogoEnabled, donationEnabled, donationAmount, name, phone, email, guestName, guestPhone, guestEmail, source
    }));

    try {
      // 1. Create Order via Razorpay
      const payload = {
        amount: total,
        name,
        phone,
        email,
        source,
        bogo: bogoEnabled,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail
      };

      console.log("1. /register page - sending to Razorpay create-order:", payload);

      const createOrderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const orderData = await createOrderRes.json();

      if (!orderData.razorpay_order_id) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100,
        currency: "INR",
        order_id: orderData.razorpay_order_id,
        name: "Mega Youth Festival 2026",
        description: "MYF26 Registration",
        prefill: { name, email, contact: phone },
        handler: function (response: any) {
          // response has razorpay_payment_id, razorpay_order_id, razorpay_signature
          window.location.href = `/thank-you?order_id=${orderData.our_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`;
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            setErrorMsg("Payment cancelled. Please try again.");
          }
        },
        theme: { color: "#0D1B3E" }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during payment.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-primary-container)] min-h-screen text-[var(--color-on-surface)] font-body md:flex md:flex-col md:items-center overflow-x-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* Top Navigation */}
      <header className="w-full max-w-7xl relative flex justify-between items-center px-4 sm:px-6 py-4 border-b border-[var(--color-outline-variant)]/30 sticky top-0 bg-[var(--color-primary-container)]/90 backdrop-blur-md z-50 overflow-hidden">
        <Link className="flex items-center gap-1 sm:gap-2 text-[var(--color-secondary)] transition-transform active:scale-95 z-10" href="/">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_back</span>
          <span className="font-label-caps uppercase hidden sm:block">Back</span>
        </Link>
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none w-full text-center px-[4.5rem] sm:px-24">
          <span className="text-[clamp(13px,4.5vw,30px)] md:text-3xl font-black text-[var(--color-secondary)] tracking-tight font-display">
            MEGA YOUTH FESTIVAL 2026
          </span>
        </div>
      </header>

      <main className="w-full max-w-7xl px-6 py-16 flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">

        {/* Header Section */}
        <div className="lg:col-span-12 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-[var(--color-on-tertiary-container)] text-[var(--color-surface-container-lowest)] font-label-caps px-2 sm:px-4 py-1.5 sm:py-2 self-start uppercase text-[9px] sm:text-xs whitespace-nowrap">
            <span className="material-symbols-outlined text-[10px] sm:text-[16px]">location_on</span>
            19 July · 10 AM · Golf Ground, Dhanbad
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--color-on-surface)] uppercase drop-shadow-[4px_4px_0_var(--color-secondary)] font-display tracking-tight">
            Apna Seat Confirm Kariye
          </h1>
          <p className="text-xl text-[var(--color-on-surface-variant)] max-w-2xl">
            Registration aur payment ek hi step hai — turant confirm ho jaayega.
          </p>
        </div>

        <form onSubmit={handlePay} className="lg:col-span-8 flex flex-col gap-8 w-full">

          {/* Primary Form Fields */}
          <div className="bg-[#000000] p-6 border border-[var(--color-secondary)] hard-shadow-cyan">
            <div className="flex justify-between items-center mb-4 border-b border-[var(--color-outline-variant)]/30 pb-2">
              <h3 className="font-label-caps text-[var(--color-secondary)] uppercase">Your Details</h3>
              <span className="text-xl font-bold text-[var(--color-secondary)] font-display">₹20</span>
            </div>
            <div className="bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/30 p-3 mb-6">
              <p className="text-[var(--color-secondary)] text-sm font-medium">Yeh registration sirf ladkon (boys) ke liye hai. Ladkiyon ke liye alag program jald hi aayega.</p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-[var(--color-secondary)] uppercase">Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[var(--color-secondary)] focus:ring-0 focus:border-[var(--color-secondary)] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="Enter your full name" type="text" />
                <span className="text-[12px] text-gray-500 mt-1">Apna pura naam likhein — jaise gate pe pehchaan ho sake</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-[var(--color-secondary)] uppercase">Phone Number</label>
                <input required value={phone} onChange={e => setPhone(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[var(--color-secondary)] focus:ring-0 focus:border-[var(--color-secondary)] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="10-digit mobile number" type="tel" maxLength={10} />
                {!isPhoneValid && <span className="text-red-500 text-sm mt-1">Enter a valid 10-digit mobile number</span>}
                {isPhoneValid && <span className="text-[12px] text-gray-500 mt-1">Sahi number aur email dein — aapka pass isi par bhega jayega</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-[var(--color-secondary)] uppercase">Email Address</label>
                <input required value={email} onChange={e => setEmail(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[var(--color-secondary)] focus:ring-0 focus:border-[var(--color-secondary)] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="you@example.com" type="email" />
                <span className="text-[12px] text-gray-500 mt-1">Sahi number aur email dein — aapka pass isi par bhega jayega</span>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-[#000000] border border-[var(--color-secondary)] p-6 relative overflow-hidden group hover:border-[4px] transition-all duration-150 hard-shadow-cyan">
            <div className="absolute left-0 top-0 bottom-0 w-6 ticket-edge bg-[var(--color-primary-container)] border-r border-[var(--color-secondary)] group-hover:border-r-[4px]"></div>
            <div className="pl-8 flex flex-col gap-4 relative z-10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-[var(--color-outline-variant)]/30 pb-4 gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-secondary)] transition-colors uppercase font-display leading-tight flex items-center flex-wrap gap-2">
                    One time offer
                    <span className="bg-[#00ffd1]/20 text-[#00ffd1] border border-[#00ffd1]/50 px-2 py-0.5 text-xs sm:text-sm font-bold tracking-widest uppercase inline-block">FREE</span>
                  </h2>
                  <span className="font-label-caps text-sm sm:text-base text-[var(--color-on-surface-variant)] mt-1 block">General Admission — Buy 1, Get 1 Free</span>
                </div>
              </div>

              {/* BOGO Toggle */}
              <div className="pt-2 flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <span className="material-symbols-outlined text-[var(--color-secondary)] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                  <span className="font-label-caps uppercase text-[var(--color-secondary)] text-sm sm:text-base leading-tight">Ek dost ko free mein laao (BOGO)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1 sm:mt-0">
                  <input type="checkbox" className="sr-only peer" checked={bogoEnabled} onChange={(e) => setBogoEnabled(e.target.checked)} />
                  <div className="w-11 h-6 bg-[var(--color-surface-container-high)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-secondary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-secondary)]"></div>
                </label>
              </div>

              {/* BOGO Fields */}
              {bogoEnabled && (
                <div className="flex-col gap-4 mt-4 p-4 border border-dashed border-[var(--color-secondary)]/50 bg-[var(--color-surface)]/50 flex">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-caps text-[var(--color-secondary)] uppercase">Guest Name</label>
                    <input required value={guestName} onChange={e => setGuestName(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[var(--color-secondary)] focus:ring-0 focus:border-[var(--color-secondary)] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="Enter guest name" type="text" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-caps text-[var(--color-secondary)] uppercase">Guest Phone Number</label>
                    <input required value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[var(--color-secondary)] focus:ring-0 focus:border-[var(--color-secondary)] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="10-digit mobile number" type="tel" maxLength={10} />
                    {!isGuestPhoneValid && <span className="text-red-500 text-sm mt-1">Enter a valid 10-digit mobile number</span>}
                    {isGuestPhoneValid && <span className="text-[12px] text-gray-500 mt-1">Sahi number aur email dein — aapka pass isi par bhega jayega</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-caps text-[var(--color-secondary)] uppercase">Guest Email Address</label>
                    <input required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[var(--color-secondary)] focus:ring-0 focus:border-[var(--color-secondary)] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="guest@example.com" type="email" />
                    <span className="text-[12px] text-gray-500 mt-1">Sahi number aur email dein — aapka pass isi par bhega jayega</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Action Column */}
          <div className="bg-[#000000] border border-dashed border-[var(--color-secondary)] p-6 hard-shadow-cyan relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-secondary)]">volunteer_activism</span>
                <h3 className="font-label-caps text-[var(--color-secondary)] uppercase">Support DHanbad's Biggest Rath Yatra (Optional)</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={donationEnabled} onChange={(e) => setDonationEnabled(e.target.checked)} />
                <div className="w-11 h-6 bg-[var(--color-surface-container-high)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-secondary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-secondary)]"></div>
              </label>
            </div>
            <p className="text-[var(--color-on-surface-variant)] text-base mb-6">Help us make the festival grander. Your contribution goes directly to the Rath Yatra preparations.</p>

            {donationEnabled && (
              <div className="flex flex-wrap gap-3">
                {[11, 51, 101, 251, 501].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDonationAmount(amount)}
                    className={`px-4 py-2 border border-[var(--color-secondary)]/30 font-label-caps transition-colors ${donationAmount === amount ? 'bg-[var(--color-secondary)] text-[#000000]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10'}`}
                  >
                    ₹{amount}
                  </button>
                ))}
                <div className="relative flex-1 min-w-[120px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">₹</span>
                  <input
                    type="number"
                    placeholder="Custom"
                    value={donationAmount || ''}
                    onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent border border-[var(--color-secondary)]/30 pl-7 pr-3 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:ring-0 font-label-caps"
                  />
                </div>
              </div>
            )}
          </div>

        </form>

        {/* Right Sticky Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-4 w-full">
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 text-sm">
              {errorMsg}
            </div>
          )}
          <div className="bg-[#000000] border border-[var(--color-outline-variant)]/30 p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-secondary)]/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center border-b border-[var(--color-outline-variant)]/30 pb-4">
              <span className="font-label-caps text-[var(--color-on-surface-variant)] uppercase">Total Payable</span>
              <span className="text-3xl font-black text-[var(--color-secondary)] font-display">₹{total}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              onClick={(e) => {
                if (!isFormValid) {
                  const form = document.querySelector('form');
                  form?.reportValidity();
                } else {
                  handlePay(e);
                }
              }}
              className={`w-full bg-[var(--color-secondary)] text-[#000000] text-xl font-black uppercase py-4 flex items-center justify-center gap-2 hover:bg-[var(--color-secondary-fixed)] transition-colors active:scale-95 font-display ${(isLoading || !isFormValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-gtm-cta="payment-submit"
            >
              {isLoading ? "PROCESSING..." : `₹${total} PAY & REGISTER`}
              {!isLoading && <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>}
            </button>
            <div className="flex items-center justify-center gap-2 text-[var(--color-on-surface-variant)] font-label-caps text-[12px] uppercase mt-2">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Secure payment via Cashfree
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-primary-container)] text-white p-8">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
