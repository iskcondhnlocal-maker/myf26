"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const razorpayPaymentId = searchParams.get("razorpay_payment_id");
  const razorpayOrderId = searchParams.get("razorpay_order_id");
  const razorpaySignature = searchParams.get("razorpay_signature");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [tickets, setTickets] = useState<{ticket_id: string, role: string, qr_url: string | null}[]>([]);
  const hasFired = useRef(false);

  useEffect(() => {
    if (!orderId) {
       setStatus("error");
       setErrorMessage("No order ID found.");
       return;
    }

    if (hasFired.current) return;
    hasFired.current = true;

    const verifyPayment = async () => {
      try {
        const savedStateStr = sessionStorage.getItem("myf_register_state");
        const savedState = savedStateStr ? JSON.parse(savedStateStr) : {};

        const payload = {
          orderId: orderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: razorpaySignature,
          name: savedState.name,
          phone: savedState.phone,
          email: savedState.email,
          source: savedState.source,
          bogo: savedState.bogoEnabled,
          guest_name: savedState.guestName,
          guest_phone: savedState.guestPhone,
          guest_email: savedState.guestEmail
        };

        const apiRoute = razorpayPaymentId ? "/api/razorpay/verify-payment" : "/api/cashfree/verify-payment";

        console.log(`3. /thank-you page - sending to ${apiRoute}:`, payload);

        const res = await fetch(apiRoute, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          setTickets(data.tickets || []);
          setStatus("success");
          sessionStorage.removeItem("myf_register_state");
          
          // Push successful purchase event to GTM dataLayer
          if (typeof window !== "undefined") {
            const dataLayer = (window as any).dataLayer || [];
            
            console.log("Pushing purchase event to dataLayer:", {
              event: "purchase",
              value: data.amount,
              currency: "INR",
              transaction_id: orderId
            });
            
            dataLayer.push({
              event: "purchase",
              value: data.amount,
              currency: "INR",
              transaction_id: orderId
            });
            (window as any).dataLayer = dataLayer;
          }
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Payment verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "An error occurred during verification.");
      }
    };

    verifyPayment();
  }, [orderId]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden bg-[var(--color-primary-container)]">
         <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
           <h2 className="text-2xl font-black text-[var(--color-inverse-surface)] uppercase font-display tracking-tight">Confirming your payment...</h2>
           <p className="text-[var(--color-primary-fixed-dim)]">Please do not close this window.</p>
         </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden bg-[var(--color-primary-container)]">
         <div className="flex flex-col items-center text-center gap-6 max-w-md">
           <span className="material-symbols-outlined text-[80px] text-red-500">error</span>
           <h2 className="text-3xl font-black text-[var(--color-inverse-surface)] uppercase font-display tracking-tight">Payment Failed</h2>
           <p className="text-[var(--color-primary-fixed-dim)]">{errorMessage}</p>
           <Link href="/register" className="mt-4 px-6 py-3 bg-[var(--color-secondary)] text-[#000000] font-black uppercase font-display flex items-center gap-2 hover:bg-[var(--color-inverse-surface)]">
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_back</span>
             Try Again
           </Link>
         </div>
      </main>
    );
  }

  return (
    <div className="bg-[var(--color-primary-container)] text-[var(--color-on-surface)] font-body antialiased selection:bg-[var(--color-secondary)] selection:text-[var(--color-surface)]">
      
      <main className="min-h-screen flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-center items-center">
          <span className="material-symbols-outlined text-[400px] text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </div>
        
        <div className="max-w-xl w-full flex flex-col items-center text-center relative z-10">
          {/* Celebratory Icon */}
          <div className="mb-8">
            <span className="material-symbols-outlined !text-[120px] md:!text-[150px] text-[var(--color-secondary)] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          
          {/* Headlines & Body */}
          <h1 className="text-5xl md:text-7xl font-black text-[var(--color-inverse-surface)] mb-6 uppercase font-display tracking-tight leading-none">
            Aapka Seat<br/>Confirm<br/>Ho Gaya! 🎉
          </h1>
          
          {/* QR Codes */}
          {tickets.length > 0 && (
            <div className="flex flex-col gap-8 w-full mb-12 items-center">
              {tickets.map((ticket, index) => (
                <div key={ticket.ticket_id} className="bg-[var(--color-surface)] p-6 border border-[var(--color-secondary)] hard-shadow-cyan flex flex-col items-center max-w-sm w-full">
                  <h3 className="font-label-caps text-[var(--color-secondary)] uppercase mb-4 tracking-widest text-xl">
                    {ticket.role === 'primary' ? 'Your Pass' : 'Guest Pass'}
                  </h3>
                  {ticket.qr_url ? (
                    <>
                      <img src={ticket.qr_url} alt={`QR Code for ${ticket.ticket_id}`} className="w-48 h-48 mb-6 bg-white p-2" />
                      <a 
                        href={ticket.qr_url} 
                        download={`MYF26_Pass_${ticket.ticket_id}.png`}
                        className="bg-[var(--color-secondary)] text-[#000000] font-black uppercase py-2 px-6 hover:bg-[var(--color-inverse-surface)] hover:text-white transition-colors"
                      >
                        Download Pass
                      </a>
                    </>
                  ) : (
                    <p className="text-[var(--color-on-surface-variant)] text-sm">QR Code unavailable.</p>
                  )}
                  <p className="text-[var(--color-on-surface-variant)] mt-4 font-mono text-xs">{ticket.ticket_id}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Next Step Card */}
          <div className="w-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-secondary)] p-6 md:p-8 relative group transition-all duration-300 hover:border-[3px] hard-shadow-cyan text-left">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[var(--color-secondary)] text-3xl">mail</span>
                <h2 className="font-display font-black text-[var(--color-inverse-surface)] text-2xl uppercase">Check Your Email! 📩</h2>
              </div>
              <p className="text-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                Apke ticket aur event ki saari important details email par bhej di gayi hain. <span className="font-bold text-[var(--color-inverse-surface)]">Spam/Promotions folder check karna mat bhoolna!</span>
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#25D366] text-3xl">groups</span>
                <h2 className="font-display font-black text-[var(--color-inverse-surface)] text-2xl uppercase">Join Our Community 🚀</h2>
              </div>
              <p className="text-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                Event updates, schedule, aur surprises ke liye hamare official WhatsApp group ko join karein:
              </p>
            </div>
            
            {/* CTA Button */}
            <a href="https://chat.whatsapp.com/Lal2cZdnc2d8LdegxV7dUD" target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white font-display text-[20px] font-black py-4 px-6 flex items-center justify-center gap-3 transition-transform active:scale-95 hover:bg-[#1DA851]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              <span>JOIN WHATSAPP GROUP ➔</span>
            </a>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="absolute bottom-8 left-0 w-full text-center px-6">
          <p className="font-label-caps text-[var(--color-outline-variant)] uppercase">
            19 July, Mega Youth Fest — milte hain wahan.
          </p>
        </footer>
      </main>
      
    </div>
  );
}

export default function ThankYou() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-primary-container)]"></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
