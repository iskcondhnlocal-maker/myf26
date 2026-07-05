"use client";
import { useState, useEffect } from "react";

type TicketData = {
  found: boolean;
  name?: string;
  role?: string;
  checked_in?: string;
  checked_in_at?: string;
  error?: string;
};

export default function Gate() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  useEffect(() => {
    const authed = localStorage.getItem("gate_authed");
    if (authed === "true") {
      setIsAuthed(true);
    }
    setIsInitializing(false);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const res = await fetch("/api/gate-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("gate_authed", "true");
        setIsAuthed(true);
      } else {
        setAuthError(data.error || "Incorrect password");
      }
    } catch (err) {
      setAuthError("Network error");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    
    setIsLoading(true);
    setTicketData(null);
    setCheckinSuccess(false);

    try {
      const res = await fetch(`/api/ticket-status?ticket_id=${ticketId.trim()}`);
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

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const res = await fetch("/api/ticket-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId.trim() })
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

  if (isInitializing) {
    return <div className="min-h-screen bg-black flex justify-center items-center p-6" />;
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6 font-sans">
        <form onSubmit={handleAuth} className="w-full max-w-md bg-zinc-900 border-2 border-zinc-700 rounded-xl p-8 flex flex-col gap-6 shadow-2xl">
          <div className="text-center pb-2">
            <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-2">Gate Staff</h1>
            <p className="text-zinc-400">Enter password to access</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-800 border-2 border-zinc-700 text-white p-4 rounded-lg text-xl focus:border-cyan-400 focus:outline-none"
              autoFocus
            />
            {authError && <p className="text-red-500 font-bold">{authError}</p>}
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-4 bg-cyan-400 text-black text-2xl font-black rounded-lg uppercase tracking-wider active:scale-95 transition-transform"
          >
            {isAuthenticating ? "..." : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  const isCheckedInAlready = ticketData?.checked_in?.toLowerCase() === "yes" || checkinSuccess;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        <form onSubmit={handleSearch} className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-6 flex flex-col gap-4 shadow-2xl mt-12">
          <label className="text-zinc-400 text-lg uppercase font-bold tracking-widest text-center">Scan or Type Ticket ID</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="e.g. MYF26-..."
              className="flex-1 bg-zinc-800 border-2 border-zinc-700 text-white p-4 rounded-lg text-xl focus:border-cyan-400 focus:outline-none font-mono"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-cyan-400 text-black px-6 rounded-lg font-black uppercase text-xl active:scale-95 transition-transform"
            >
              Go
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center p-12">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider animate-pulse">Loading...</h2>
          </div>
        )}

        {ticketData && ticketData.found === false && (
          <div className="bg-zinc-900 border-2 border-red-900 rounded-xl p-8 text-center shadow-2xl">
            <h1 className="text-4xl font-black text-red-500 uppercase mb-4">Not Found</h1>
            <p className="text-zinc-400">{ticketId}</p>
          </div>
        )}

        {ticketData && ticketData.found !== false && (
          <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-8 flex flex-col gap-6 shadow-2xl">
            
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
              ) : (
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
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
