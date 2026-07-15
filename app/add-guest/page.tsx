"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AddGuestPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    primary_name: '',
    primary_phone: '',
    guest_name: '',
    guest_phone: '',
    guest_email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({
      ...formData,
      [e.target.name]: val
    });
  };

  const isFormValid = formData.primary_phone.length === 10 && formData.guest_phone.length === 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/add-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Server returned an invalid response. It might be taking too long.');
      }

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-background)] min-h-[100dvh] text-white font-sans overflow-x-hidden selection:bg-[var(--color-secondary)] selection:text-[#000000]">
      <div className="max-w-[400px] mx-auto p-6 md:p-8 pt-12 md:pt-20">
        
        {/* Header Logo or Back Link */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center text-[var(--color-secondary)] hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            <span className="font-semibold tracking-wide uppercase text-sm">Back to Home</span>
          </Link>
          <h1 className="mt-8 text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Add Your Guest
          </h1>
          <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            Link a guest to your existing Mega Youth Fest registration.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[var(--color-surface-container)] rounded-3xl p-6 md:p-8 border border-[var(--color-outline-variant)]/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {success ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <span className="material-symbols-outlined text-[var(--color-secondary)] text-3xl font-black">check</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Success!</h2>
              <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-8">
                Guest add ho gaya! Unhe QR code email par milega.
              </p>
              <button 
                onClick={() => {
                  setSuccess(false);
                  setFormData({ ...formData, guest_name: '', guest_phone: '', guest_email: '' });
                }}
                className="w-full h-[52px] rounded-xl font-bold tracking-wide uppercase text-sm bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
              >
                Add Another Guest
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Primary User Details */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-white/70 uppercase ml-1">
                  Aapka Naam
                </label>
                <input
                  type="text"
                  name="primary_name"
                  value={formData.primary_name}
                  onChange={handleChange}
                  required
                  placeholder="Rahul Kumar"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-base placeholder:text-white/20 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-white/70 uppercase ml-1">
                  Aapka Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  name="primary_phone"
                  value={formData.primary_phone}
                  onChange={handlePhoneChange}
                  required
                  placeholder="Number you registered with"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-base placeholder:text-white/20 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all"
                />
                {formData.primary_phone.length > 0 && formData.primary_phone.length < 10 && (
                  <p className="text-red-400 text-xs mt-0.5 ml-1 animate-fade-in">Phone number 10 digit ka hona chahiye.</p>
                )}
              </div>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-outline-variant)]/40"></div>
                </div>
                <div className="relative bg-[var(--color-surface-container)] px-4">
                  <span className="text-xs font-bold tracking-widest text-[var(--color-secondary)] uppercase">
                    Guest Ki Details
                  </span>
                </div>
              </div>

              {/* Guest Details */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-white/70 uppercase ml-1">
                  Guest Ka Naam
                </label>
                <input
                  type="text"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleChange}
                  required
                  placeholder="Guest's full name"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-base placeholder:text-white/20 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-white/70 uppercase ml-1">
                  Guest Ka Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  name="guest_phone"
                  value={formData.guest_phone}
                  onChange={handlePhoneChange}
                  required
                  placeholder="Guest's phone number"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-base placeholder:text-white/20 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all"
                />
                {formData.guest_phone.length > 0 && formData.guest_phone.length < 10 && (
                  <p className="text-red-400 text-xs mt-0.5 ml-1 animate-fade-in">Phone number 10 digit ka hona chahiye.</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-white/70 uppercase ml-1">
                  Guest Ka Email
                </label>
                <input
                  type="email"
                  name="guest_email"
                  value={formData.guest_email}
                  onChange={handleChange}
                  required
                  placeholder="guest@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-base placeholder:text-white/20 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all"
                />
              </div>

              {error && (
                <div className="mt-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-red-400 shrink-0 text-xl">error</span>
                  <div className="flex flex-col">
                    <p className="text-red-200 text-sm font-medium">{error}</p>
                    <p className="text-red-200/70 text-xs mt-1">
                      Double-check the phone number you registered with, or contact the organizers if the issue continues.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="mt-4 w-full h-[56px] rounded-xl font-bold tracking-widest uppercase text-[15px] bg-[var(--color-secondary)] text-[#000000] hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Guest Add Karein"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
