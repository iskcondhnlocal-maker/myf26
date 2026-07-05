"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type TicketData = {
  found: boolean;
  name?: string;
  role?: string;
  checked_in?: string; // e.g., "yes" or "no"
  checked_in_at?: string;
  error?: string;
};

export default function VerifyTicket() {
  const params = useParams();
  const ticket_id = params.ticket_id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  useEffect(() => {
    if (!ticket_id) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/ticket-status?ticket_id=${ticket_id}`);
        const data = await res.json();
        
        if (!res.ok) {
           setTicketData({ found: false, error: data.error });
        } else {
           setTicketData(data);
        }
      } catch (err: any) {
        setTicketData({ found: false, error: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    if (localStorage.getItem("gate_authed") === "true") {
      setIsStaff(true);
    }
  }, [ticket_id]);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const res = await fetch("/api/ticket-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id })
      });
      const data = await res.json();
      
      if (res.ok && data.success !== false) {
        setCheckinSuccess(true);
      } else {
        alert(data.error || "Failed to check in. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsCheckingIn(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6">
        <h1 className="text-4xl font-bold text-white text-center">Checking...</h1>
      </div>
    );
  }

  if (!ticketData || ticketData.found === false || ticketData.error) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6 text-center">
        <h1 className="text-5xl font-black text-red-500 uppercase mb-4">Ticket Not Found</h1>
        <p className="text-xl text-gray-400">ID: {ticket_id}</p>
        {ticketData?.error && <p className="text-red-400 mt-4">{ticketData.error}</p>}
      </div>
    );
  }

  const isCheckedInAlready = ticketData.checked_in?.toLowerCase() === "yes" || checkinSuccess;

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-zinc-700 rounded-xl p-8 flex flex-col gap-6 shadow-2xl">
        
        <div className="text-center border-b-2 border-zinc-700 pb-6">
          <p className="text-gray-400 text-lg uppercase font-bold tracking-widest mb-2">Name</p>
          <h2 className="text-5xl font-black text-white leading-tight break-words">{ticketData.name || "Unknown"}</h2>
        </div>

        <div className="text-center border-b-2 border-zinc-700 pb-6">
          <p className="text-gray-400 text-lg uppercase font-bold tracking-widest mb-2">Role</p>
          <h3 className="text-4xl font-bold text-cyan-400">{ticketData.role || "Registrant"}</h3>
        </div>

        <div className="text-center pt-2 flex flex-col items-center">
          {isCheckedInAlready ? (
            <div className="bg-green-500/20 border-4 border-green-500 rounded-lg p-6 w-full animate-in fade-in zoom-in duration-300">
              <h1 className="text-4xl font-black text-green-400 uppercase">Checked In!</h1>
              {ticketData.checked_in_at && !checkinSuccess && (
                <p className="text-green-300 mt-2 text-xl font-bold">{ticketData.checked_in_at}</p>
              )}
            </div>
          ) : isStaff ? (
            <button 
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className={`w-full py-6 rounded-lg text-3xl font-black uppercase tracking-wider transition-transform active:scale-95 ${
                isCheckingIn 
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" 
                  : "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]"
              }`}
            >
              {isCheckingIn ? "Processing..." : "Mark Checked In"}
            </button>
          ) : (
            <div className="bg-cyan-900/30 border-4 border-cyan-800 rounded-lg p-6 w-full">
              <h1 className="text-3xl font-black text-cyan-400 uppercase">Valid Ticket</h1>
              <p className="text-cyan-200 mt-2 font-bold uppercase">Ready for Check-in</p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
           <p className="text-zinc-600 text-sm font-mono">{ticket_id}</p>
        </div>

      </div>
    </div>
  );
}
