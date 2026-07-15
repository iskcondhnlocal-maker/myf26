"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
// @ts-expect-error - Cashfree JS SDK does not provide TypeScript declarations
import { load } from "@cashfreepayments/cashfree-js";
import Script from "next/script";
import SocialProofWidget from '@/components/SocialProofWidget';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "offline";
  const campaignName = searchParams.get("utm_medium") || "";
  const adsetName = searchParams.get("utm_campaign") || "";
  const adName = searchParams.get("utm_content") || "";
  const basePrice = 20;
  const { timeLeft, formatTime } = useCountdownTimer();

  const [bogoEnabled, setBogoEnabled] = useState(false);
  const [donationEnabled, setDonationEnabled] = useState(false);
  const [isDonationExpanded, setIsDonationExpanded] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const orderIdRef = useRef<string | null>(null);

  const phoneRegex = /^[6-9]\d{9}$/;
  const isPhoneValid = phone === "" || phoneRegex.test(phone);
  const isGuestPhoneValid = !bogoEnabled || guestPhone === "" || phoneRegex.test(guestPhone);
  const isFormValid = name && email && phoneRegex.test(phone) && (!bogoEnabled || (guestName && guestEmail && phoneRegex.test(guestPhone)));

  const total = basePrice + (donationEnabled ? donationAmount : 0);

  const [cashfree, setCashfree] = useState<any>(null);

  useEffect(() => {
    load({ mode: "sandbox" }).then((cf: any) => setCashfree(cf));

    // Restore form data if returning from checkout
    const savedStateStr = localStorage.getItem("myf_register_state");
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

    // Save state before Razorpay popup
    localStorage.setItem("myf_register_state", JSON.stringify({
      bogoEnabled, donationEnabled, donationAmount, name, phone, email, guestName, guestPhone, guestEmail, source, campaignName, adsetName, adName
    }));

    // Generate stable orderId for this session
    if (!orderIdRef.current) {
      orderIdRef.current = `MYF26-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    const currentOrderId = orderIdRef.current;

    // Fire pending webhook in background
    fetch('/api/registrations/pending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: currentOrderId,
        name, phone, email, source, bogo: bogoEnabled, guest_name: guestName, guest_phone: guestPhone, guest_email: guestEmail,
        campaign_name: campaignName, adset_name: adsetName, ad_name: adName,
        role: "primary", linked_ticket_id: bogoEnabled ? `${currentOrderId}-G` : "", ticket_id: `${currentOrderId}-P`
      })
    }).catch(console.error);

    try {
      // 1. Create Order via Razorpay
      const payload = {
        orderId: currentOrderId,
        amount: total,
        name,
        phone,
        email,
        source,
        campaign_name: campaignName,
        adset_name: adsetName,
        ad_name: adName,
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
          let fbclidParam = "";
          try {
            const savedFbclid = localStorage.getItem("myf_fbclid");
            if (savedFbclid) {
              fbclidParam = `&fbclid=${encodeURIComponent(savedFbclid)}`;
            }
          } catch (e) {}
          window.location.href = `/thank-you?order_id=${orderData.our_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}${fbclidParam}`;
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

  const handleSkipPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setErrorMsg("");

    localStorage.setItem("myf_register_state", JSON.stringify({
      bogoEnabled, donationEnabled, donationAmount, name, phone, email, guestName, guestPhone, guestEmail, source, campaignName, adsetName, adName
    }));

    // Generate stable orderId for this session
    if (!orderIdRef.current) {
      orderIdRef.current = `MYF26-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    const currentOrderId = orderIdRef.current;

    // Fire pending webhook in background
    fetch('/api/registrations/pending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: currentOrderId,
        name, phone, email, source, bogo: bogoEnabled, guest_name: guestName, guest_phone: guestPhone, guest_email: guestEmail,
        campaign_name: campaignName, adset_name: adsetName, ad_name: adName,
        role: "primary", linked_ticket_id: bogoEnabled ? `${currentOrderId}-G` : "", ticket_id: `${currentOrderId}-P`
      })
    }).catch(console.error);

    try {
      const payload = {
        orderId: currentOrderId,
        amount: total,
        name,
        phone,
        email,
        source,
        campaign_name: campaignName,
        adset_name: adsetName,
        ad_name: adName,
        bogo: bogoEnabled,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail
      };

      const createOrderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const orderData = await createOrderRes.json();

      if (!orderData.razorpay_order_id) {
        throw new Error(orderData.error || "Failed to create order for skip");
      }

      let fbclidParam = "";
      try {
        const savedFbclid = localStorage.getItem("myf_fbclid");
        if (savedFbclid) {
          fbclidParam = `&fbclid=${encodeURIComponent(savedFbclid)}`;
        }
      } catch (e) {}

      window.location.href = `/thank-you?order_id=${orderData.our_order_id}&razorpay_payment_id=dev_test_payment&razorpay_order_id=${orderData.razorpay_order_id}&razorpay_signature=dev_signature${fbclidParam}`;
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during payment skip.");
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
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-[#ef4444] text-white font-label-caps px-2 sm:px-4 py-1.5 sm:py-2 self-start uppercase text-[9px] sm:text-xs whitespace-nowrap mb-[clamp(0.5rem,3vw,1.5rem)]">
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
              <span className="text-xl font-bold text-[var(--color-secondary)] font-display">₹{basePrice}</span>
            </div>
            <div className="bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/30 p-3 mb-6">
              <p className="text-[var(--color-secondary)] text-sm font-medium">Yeh registration sirf 18-30 saal ke ladkon (boys) ke liye hai. Ladkiyon ke liye alag program jald hi aayega.</p>
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

              {/* BOGO Integration */}
              <div className="mt-4 pt-6 border-t border-[var(--color-outline-variant)]/30 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                  <div className="flex flex-col gap-1 w-full sm:w-auto flex-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#25D366] shrink-0 text-[18px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                      <span className="font-label-caps uppercase text-[#25D366] text-[13px] sm:text-[16px] leading-tight font-bold whitespace-nowrap">Ek dost ko free mein laao</span>
                      <span className="bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/50 px-1.5 py-0.5 text-[10px] sm:text-[12px] font-bold tracking-widest uppercase inline-block whitespace-nowrap shrink-0 ml-1">SAVE 50%</span>
                    </div>
                    <span className="font-label-caps text-[10px] sm:text-[11px] text-[#25D366]/80 uppercase tracking-widest font-bold ml-6 sm:ml-8 leading-tight whitespace-nowrap">
                      ONE TIME OFFER — BUY 1 GET 1
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end sm:self-auto mt-2 sm:mt-0 mr-1 sm:mr-0">
                    <input type="checkbox" className="sr-only peer" checked={bogoEnabled} onChange={(e) => setBogoEnabled(e.target.checked)} />
                    <div className="w-11 h-6 bg-[var(--color-surface-container-high)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#25D366] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                  </label>
                </div>

                {bogoEnabled && (
                  <div className="flex flex-col gap-4 mt-2 p-4 border border-dashed border-[#25D366]/50 bg-[#25D366]/10 rounded-sm">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-[#25D366] uppercase">Guest Name</label>
                      <input required value={guestName} onChange={e => setGuestName(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[#25D366] focus:ring-0 focus:border-[#25D366] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="Enter guest name" type="text" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-[#25D366] uppercase">Guest Phone Number</label>
                      <input required value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[#25D366] focus:ring-0 focus:border-[#25D366] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="10-digit mobile number" type="tel" maxLength={10} />
                      {!isGuestPhoneValid && <span className="text-red-500 text-sm mt-1">Enter a valid 10-digit mobile number</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-[#25D366] uppercase">Guest Email Address</label>
                      <input required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className="bg-[#000000] border-0 border-b-2 border-[#25D366] focus:ring-0 focus:border-[#25D366] text-[var(--color-on-surface)] font-body py-2 px-0 w-full placeholder:text-[var(--color-on-surface-variant)]/50" placeholder="guest@example.com" type="email" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rath Yatra Donation (Expandable) */}
          <div className="w-full">
            <button 
              type="button" 
              onClick={() => setIsDonationExpanded(!isDonationExpanded)}
              className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-[var(--color-secondary-fixed)] transition-colors w-full text-left py-2 px-1"
            >
              <span className="material-symbols-outlined shrink-0 text-[18px]">
                {isDonationExpanded ? 'remove' : 'add'}
              </span>
              <span className="font-label-caps uppercase text-[clamp(11px,3.5vw,14px)] font-bold underline underline-offset-4 decoration-[var(--color-secondary)]/30 hover:decoration-[var(--color-secondary)]">
                Ek Chhota Sa Yogdaan — Rath Yatra Ke Liye (Optional)
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDonationExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className={`bg-[#000000] border border-dashed border-[var(--color-secondary)] p-6 hard-shadow-cyan relative transition-opacity duration-300 ${!donationEnabled ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-secondary)]">volunteer_activism</span>
                    <h3 className="font-label-caps text-[var(--color-secondary)] uppercase">Rath Yatra Ke Liye Daan De Sakte Hain? (Optional)</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={donationEnabled} onChange={(e) => setDonationEnabled(e.target.checked)} />
                    <div className="w-11 h-6 bg-[var(--color-surface-container-high)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-secondary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-secondary)]"></div>
                  </label>
                </div>
                <p className="text-[var(--color-on-surface-variant)] text-base mb-6">Aapka chhota sa yogdaan Dhanbad ke sabse bade Rath Yatra ko aur bhi grand banayega.</p>

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
            </div>
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

            <div className="flex flex-col gap-1 items-center justify-center text-center">
              <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                1100+ log already register kar chuke hain — seats limited hain.
              </p>
              <p className="text-[12px] font-bold label-caps text-[#ef4444]">
                {timeLeft !== null && timeLeft <= 0 ? "Offer ending soon" : 
                 timeLeft !== null ? `Offer ends in ${formatTime(timeLeft)} mins` : "Ends Soon"}
              </p>
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
            
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                disabled={isLoading || !isFormValid}
                onClick={(e) => {
                  if (!isFormValid) {
                    const form = document.querySelector('form');
                    form?.reportValidity();
                  } else {
                    handleSkipPayment(e);
                  }
                }}
                className={`w-full bg-gray-800 text-white text-sm font-bold py-3 flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors ${(isLoading || !isFormValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                SKIP PAYMENT (DEV ONLY)
              </button>
            )}
            <div className="flex items-center justify-center gap-2 text-[var(--color-on-surface-variant)] font-label-caps text-[12px] uppercase mt-2">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Secure payment via Razorpay
            </div>
          </div>
        </div>

      </main>
      <SocialProofWidget />
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
