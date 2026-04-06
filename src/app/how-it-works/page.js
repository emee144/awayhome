"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  {
    n: "01",
    title: "Search & Filter",
    desc: "Enter a city, area, or property name in the search bar. Narrow results by property type — hotel, apartment, shortlet, or for sale — and filter by price range, number of bedrooms, or state.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    tips: ["Use short location names like 'Lekki' or 'Maitama'", "Switch type filter to narrow results instantly", "Price filters work for both nightly and yearly rates"],
  },
  {
    n: "02",
    title: "Browse Listings",
    desc: "Explore verified cards showing the property photo, price, bedroom count, location, and type badge. Featured listings are hand-picked by our team for quality and accuracy.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    tips: ["Look for the gold 'Verified' badge for confirmed listings", "Tap the image to see the full photo gallery", "Save favourites by creating a free account"],
  },
  {
    n: "03",
    title: "View Full Details",
    desc: "Open any listing to see the complete property profile — high-resolution photos, full amenity list, exact address, owner description, and all available contact options.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    tips: ["Scroll down for the full amenities checklist", "Check the 'Rooms' section for hotel-specific details", "Map view shows the exact neighbourhood location"],
  },
  {
    n: "04",
    title: "Contact Directly",
    desc: "Reach the owner or agent straight from the listing page. Call, WhatsApp, or visit their website — no middlemen, no booking fees, no commission cuts. Your conversation stays private.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    tips: ["WhatsApp is usually the fastest response method", "Call button dials directly — no copy-pasting needed", "Some listings have a 'Visit Site' button for direct booking"],
  },
  {
    n: "05",
    title: "Arrange a Viewing",
    desc: "Negotiate terms, schedule a physical inspection, and agree on price directly with the owner. We encourage all users to view a property in person before making any payment.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    tips: ["Always inspect in person before any payment", "Bring a trusted person along for safety", "Ask for all agreements in writing"],
  },
  {
    n: "06",
    title: "Move In / Check In",
    desc: "Once everything is confirmed and agreed, complete your move-in or check-in on your own terms. AwayHome's job is done — you've found your place with zero platform fees.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
        <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tips: ["Document the property condition at check-in", "Keep copies of all receipts and agreements", "Rate your experience to help the community"],
  },
];

const forOwners = [
  {
    n: "01",
    title: "Create a Free Account",
    desc: "Sign up with your name, email, and phone number. No subscription, no upfront cost — listing on AwayHome is completely free.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Submit Your Listing",
    desc: "Fill in the property details — type, location, price, bedrooms, amenities — and upload up to 20 high-quality photos. Add your WhatsApp number and website if you have one.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "We Review & Verify",
    desc: "Our team reviews every listing within 48 hours. We may contact you to confirm property details. Verified listings receive a badge and rank higher in search results.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Go Live & Get Enquiries",
    desc: "Your listing goes live and starts appearing in search results. Interested users call or WhatsApp you directly — you manage all conversations and deals on your own terms.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "Is AwayHome completely free to use?",
    a: "Yes browsing, searching, and contacting property owners is 100% free for users. Listing a property is also free for owners and agents. We charge no commission or booking fees.",
  },
  {
    q: "Does AwayHome process payments or handle bookings?",
    a: "No. We are a listing directory. All payments, bookings, and agreements happen directly between you and the property owner. We are not involved in any financial transaction.",
  },
  {
    q: "How do I know a listing is legitimate?",
    a: "Look for the gold 'Verified' badge — our team has contacted and confirmed these listings. For all listings, we recommend viewing the property in person and never paying without a signed agreement.",
  },
  {
    q: "Can I list my property for free?",
    a: "Absolutely. Create a free account, submit your property details and photos, and our team will review and publish it within 48 hours. No credit card required.",
  },
  {
    q: "Which states does AwayHome cover?",
    a: "We currently cover Lagos, Abuja (FCT), Rivers, Kano, Ogun, Oyo, Delta, Anambra, Enugu, Kaduna, Plateau, and Cross River — with more states being added regularly.",
  },
  {
    q: "How do I update or remove my listing?",
    a: "Log into your owner dashboard, navigate to your listings, and edit or delete at any time. Changes go live within a few hours. Contact support if you need help.",
  },
];

const stats = [
  { value: "2,750+", label: "Active Listings" },
  { value: "37", label: "States Covered" },
  { value: "850+", label: "Verified Agents" },
  { value: "₦0", label: "Platform Fees" },
];

export default function HowItWorksPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #0A0E1A;
          color: #FFFFFF;
          overflow-x: hidden;
        }

        /* ─── Hero ─────────────────────────────────── */
        .hero {
          position: relative;
          padding: 9rem 2rem 6rem;
          text-align: center;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 60% at 50% 0%,
            rgba(201,168,76,0.14) 0%, transparent 68%);
          pointer-events: none;
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,168,76,0.13);
          border: 1px solid rgba(201,168,76,0.32);
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 1.5rem;
        }
        .hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.1;
          margin-bottom: 1.2rem;
        }
        .hero h1 em { font-style: italic; color: #C9A84C; }
        .hero-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.75;
          max-width: 560px;
          margin: 0 auto 2.5rem;
        }
        .hero-ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A;
          font-weight: 700;
          font-size: 0.92rem;
          padding: 14px 28px;
          border-radius: 11px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.38);
        }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.18);
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.92rem;
          padding: 14px 28px;
          border-radius: 11px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.32);
        }

        /* ─── Stats bar ────────────────────────────── */
        .stats-bar {
          background: #0D1220;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 2.25rem 0;
        }
        .stats-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
        }
        .stat-item {
          text-align: center;
          padding: 0 1.5rem;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .stat-item:last-child { border-right: none; }
        .stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #C9A84C;
          display: block;
          line-height: 1;
          margin-bottom: 5px;
        }
        .stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.04em;
        }

        /* ─── Shared section ───────────────────────── */
        .container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .section-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 0.5rem;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.2vw, 2.6rem);
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.18;
          margin-bottom: 0.6rem;
        }
        .section-sub {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          max-width: 500px;
        }

        /* ─── For Renters/Buyers steps ─────────────── */
        .steps-section {
          padding: 5.5rem 0 4rem;
          background: #0A0E1A;
        }
        .steps-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
        }

        .steps-timeline {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .step-row {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 0 2rem;
          position: relative;
        }

        /* Left column — number + line */
        .step-left {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .step-num-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(201,168,76,0.1);
          border: 2px solid rgba(201,168,76,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #C9A84C;
          flex-shrink: 0;
          z-index: 1;
          position: relative;
        }
        .step-connector {
          width: 2px;
          flex: 1;
          background: linear-gradient(to bottom, rgba(201,168,76,0.25), rgba(201,168,76,0.06));
          margin: 6px 0;
          min-height: 40px;
        }
        .step-row:last-child .step-connector { display: none; }

        /* Right column — card */
        .step-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 1.75rem 2rem;
          margin-bottom: 1.5rem;
          transition: border-color 0.22s, transform 0.22s;
        }
        .step-card:hover {
          border-color: rgba(201,168,76,0.22);
          transform: translateX(4px);
        }
        .step-card-top {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 0.85rem;
        }
        .step-icon-wrap {
          width: 48px;
          height: 48px;
          min-width: 48px;
          background: rgba(201,168,76,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
        }
        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.18rem;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.2;
        }
        .step-desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
          margin-bottom: 1.1rem;
        }
        .tips-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.55rem;
        }
        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          font-size: 0.83rem;
          color: rgba(255,255,255,0.62);
          line-height: 1.55;
        }
        .tip-dot {
          width: 5px;
          height: 5px;
          min-width: 5px;
          border-radius: 50%;
          background: #C9A84C;
          margin-top: 7px;
        }

        /* ─── For Owners section ───────────────────── */
        .owners-section {
          background: #0D1220;
          padding: 5.5rem 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .owners-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-top: 3rem;
        }
        .owner-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 1.6rem 1.4rem;
          transition: border-color 0.22s, transform 0.22s;
        }
        .owner-card:hover {
          border-color: rgba(201,168,76,0.22);
          transform: translateY(-4px);
        }
        .owner-num {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 700;
          color: rgba(201,168,76,0.14);
          line-height: 1;
          margin-bottom: 0.75rem;
        }
        .owner-icon {
          width: 46px;
          height: 46px;
          background: rgba(201,168,76,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
          margin-bottom: 1rem;
        }
        .owner-title {
          font-size: 1rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        .owner-desc {
          font-size: 0.84rem;
          color: rgba(255,255,255,0.62);
          line-height: 1.72;
        }

        /* ─── Why AwayHome ─────────────────────────── */
        .why-section {
          background: #0A0E1A;
          padding: 5.5rem 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 3rem;
        }
        .why-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 1.75rem;
          transition: border-color 0.22s;
        }
        .why-card:hover { border-color: rgba(201,168,76,0.2); }
        .why-icon {
          width: 50px;
          height: 50px;
          background: rgba(201,168,76,0.1);
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
          margin-bottom: 1.1rem;
        }
        .why-title {
          font-size: 1rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }
        .why-desc {
          font-size: 0.86rem;
          color: rgba(255,255,255,0.64);
          line-height: 1.75;
        }

        /* ─── FAQ ──────────────────────────────────── */
        .faq-section {
          background: #0D1220;
          padding: 5.5rem 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.1rem;
          margin-top: 3rem;
        }
        .faq-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 1.5rem 1.6rem;
          transition: border-color 0.2s;
        }
        .faq-card:hover { border-color: rgba(201,168,76,0.18); }
        .faq-q {
          font-size: 0.96rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.6rem;
          line-height: 1.4;
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }
        .faq-q-mark {
          min-width: 22px;
          height: 22px;
          background: rgba(201,168,76,0.12);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          color: #C9A84C;
          margin-top: 1px;
        }
        .faq-a {
          font-size: 0.86rem;
          color: rgba(255,255,255,0.64);
          line-height: 1.75;
          padding-left: 1.85rem;
        }

        /* ─── CTA banner ───────────────────────────── */
        .cta-section {
          background: #0A0E1A;
          border-top: 1px solid rgba(201,168,76,0.1);
          padding: 5.5rem 0;
        }
        .cta-inner {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
        }
        .cta-inner .section-sub {
          margin: 0 auto 2rem;
          text-align: center;
          max-width: 480px;
        }
        .cta-btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ─── Responsive ───────────────────────────── */
        @media (max-width: 1024px) {
          .owners-grid { grid-template-columns: repeat(2, 1fr); }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          .stat-item { border-right: none; }
          .faq-grid { grid-template-columns: 1fr; }
          .step-row { grid-template-columns: 52px 1fr; gap: 0 1.25rem; }
          .step-num-circle { width: 48px; height: 48px; font-size: 0.95rem; }
        }
        @media (max-width: 600px) {
          .hero { padding: 7rem 1.25rem 4.5rem; }
          .owners-grid { grid-template-columns: 1fr; }
          .why-grid { grid-template-columns: 1fr; }
          .step-card { padding: 1.25rem; }
        }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <div className="hero">
        <div className="eyebrow">Simple &amp; free</div>
        <h1>How <em>AwayHome</em> Works</h1>
        <p className="hero-sub">
          No booking fees. No commissions. No middlemen.
          Just a direct connection between you and the property owner — in six easy steps.
        </p>
        <div className="hero-ctas">
          <Link href="/listings" className="btn-gold">
            Browse Listings
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/list-property" className="btn-ghost">
            List Your Property
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <span className="stat-val">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Steps — For Renters/Buyers ── */}
      <section className="steps-section">
        <div className="container">
          <div className="steps-header">
            <div>
              <p className="section-eyebrow">For renters &amp; buyers</p>
              <h2 className="section-title">Find Your Perfect Place</h2>
              <p className="section-sub">
                From search to move-in, here's exactly how AwayHome works for anyone looking for a property.
              </p>
            </div>
            <Link href="/listings" className="btn-gold" style={{ alignSelf: "flex-start" }}>
              Browse Listings →
            </Link>
          </div>

          <div className="steps-timeline">
            {steps.map((step) => (
              <div className="step-row" key={step.n}>
                <div className="step-left">
                  <div className="step-num-circle">{step.n}</div>
                  <div className="step-connector" />
                </div>
                <div className="step-card">
                  <div className="step-card-top">
                    <div className="step-icon-wrap">{step.icon}</div>
                    <h3 className="step-title">{step.title}</h3>
                  </div>
                  <p className="step-desc">{step.desc}</p>
                  <div className="tips-label">Pro tips</div>
                  <div className="tips-list">
                    {step.tips.map((tip) => (
                      <div className="tip-item" key={tip}>
                        <span className="tip-dot" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Owners ── */}
      <section className="owners-section">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <p className="section-eyebrow">For property owners &amp; agents</p>
            <h2 className="section-title">List Your Property in 4 Steps</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Getting your property in front of thousands of ready buyers and renters is fast, simple, and completely free.
            </p>
          </div>
          <div className="owners-grid">
            {forOwners.map((o) => (
              <div className="owner-card" key={o.n}>
                <div className="owner-num">{o.n}</div>
                <div className="owner-icon">{o.icon}</div>
                <div className="owner-title">{o.title}</div>
                <p className="owner-desc">{o.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/list-property" className="btn-gold">
              List Property Free 
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why AwayHome ── */}
      <section className="why-section">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <p className="section-eyebrow">Why choose us</p>
            <h2 className="section-title">The AwayHome Difference</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              We built AwayHome because finding a home in Nigeria should be simple, transparent, and free of unnecessary middlemen.
            </p>
          </div>
          <div className="why-grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
                title: "Zero Fees, Always",
                desc: "Browsing is free. Contacting owners is free. Listing your property is free. AwayHome earns nothing from your transaction — that's our promise.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                ),
                title: "Direct Contact",
                desc: "Every listing shows the owner's or agent's phone number. One tap and you're speaking directly to the decision-maker — no holding queues, no automated replies.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                ),
                title: "Verified Listings",
                desc: "Our team reviews and calls back every listing before publishing. Verified properties receive a gold badge and appear higher in search results.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                title: "Nigeria-Wide Coverage",
                desc: "From Victoria Island to Maitama, Port Harcourt to Kano — we cover 37 states and growing, with thousands of listings across every property type.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                ),
                title: "All Property Types",
                desc: "Hotels, serviced apartments, shortlets, properties for rent, and properties for sale — all in one place, filterable in seconds.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "Safe & Transparent",
                desc: "We publish clear guidance on how to stay safe — view before you pay, get agreements in writing, and never send money without meeting the owner.",
              },
            ].map((w) => (
              <div className="why-card" key={w.title}>
                <div className="why-icon">{w.icon}</div>
                <div className="why-title">{w.title}</div>
                <p className="why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <p className="section-eyebrow">Got questions?</p>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Everything you need to know about using AwayHome as a renter, buyer, or property owner.
            </p>
          </div>
          <div className="faq-grid">
            {faqs.map((f) => (
              <div className="faq-card" key={f.q}>
                <div className="faq-q">
                  <span className="faq-q-mark">Q</span>
                  {f.q}
                </div>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.52)", marginBottom: "1rem" }}>
              Still have questions? We're happy to help.
            </p>
            <Link href="/contact" className="btn-ghost">Contact Our Team</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <p className="section-eyebrow">Ready to get started?</p>
          <h2 className="section-title">Find or List Your Property Today</h2>
          <p className="section-sub">
            Join thousands of Nigerians who use AwayHome to find hotels, apartments, shortlets,
            and properties for sale — all with zero platform fees.
          </p>
          <div className="cta-btns">
            <Link href="/listings" className="btn-gold">
              Browse Listings →
            </Link>
            <Link href="/list-property" className="btn-ghost">
              List My Property Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}