"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const disclaimerSections = [
  {
    id: "general",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "General Information Only",
    body: `The content published on AwayHome — including property listings, descriptions, prices, images, and related details is provided for general informational purposes only.\n\nNothing on this website constitutes professional real estate advice, legal counsel, financial guidance, or any other form of regulated professional advice. You should not rely solely on information found on AwayHome when making any property-related decision. Always conduct independent due diligence and consult a qualified professional where appropriate.`,
  },
  {
    id: "accuracy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: "Accuracy of Listings",
    body: `AwayHome acts as a directory platform. Property listings are submitted by third-party owners, agents, and hotels. While we make reasonable efforts to verify submissions, we cannot guarantee the accuracy, completeness, or currency of any listing at any given time.\n\nPrices, availability, room counts, amenities, contact details, and images may change without notice. AwayHome expressly disclaims all liability for any errors, omissions, or outdated information within listings. Always confirm details directly with the property owner or agent before making any commitment.`,
  },
  {
    id: "third-party",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Third-Party Listings & Links",
    body: `AwayHome may contain links to third-party websites, including property owner sites, hotel booking platforms, and agency portals. These links are provided for convenience only.\n\nWe do not endorse, control, or take responsibility for the content, privacy practices, or accuracy of any third-party website. Accessing any external link is done entirely at your own risk. We encourage you to review the terms and privacy policies of any external site you visit.`,
  },
  {
    id: "no-booking",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="10" y1="14" x2="14" y2="18" />
        <line x1="14" y1="14" x2="10" y2="18" />
      </svg>
    ),
    title: "No Booking or Payment Processing",
    body: `AwayHome is a listing directory — we do not facilitate, process, or guarantee any bookings, reservations, or payments between users and property owners.\n\nAll transactions, agreements, and financial arrangements are made solely between you and the property owner or agent. AwayHome bears no responsibility for any payment disputes, failed transactions, fraud, or losses arising from dealings between users and listed parties. Exercise caution and verify a property's legitimacy before making any payment.`,
  },
  {
    id: "images",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: "Images & Visual Content",
    body: `Property images displayed on AwayHome are provided by listing owners and agents. We do not independently verify that images accurately represent the current condition, size, or features of a property.\n\nImages may be illustrative, outdated, or digitally enhanced. AwayHome accepts no liability if the physical property differs materially from images displayed. Always request a physical viewing before committing to any rental, purchase, or stay.`,
  },
  {
    id: "professional",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    title: "No Professional or Legal Advice",
    body: `Nothing on AwayHome constitutes legal, financial, tax, or investment advice. Property investment involves significant financial risk. Any information about market trends, pricing estimates, or property values is provided for general reference only and may not reflect actual market conditions in your specific area.\n\nAlways consult a licensed estate agent, solicitor, or financial adviser before making any property investment, rental agreement, or purchase decision.`,
  },
  {
    id: "liability",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Limitation of Liability",
    body: `To the fullest extent permitted by applicable Nigerian law, AwayHome and its operators, directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:\n\n• Your use of or inability to use this website\n• Reliance on any listing, price, or information displayed\n• Any transaction, agreement, or dispute between you and a listed property owner\n• Unauthorized access to or alteration of your data\n• Any other matter relating to the AwayHome platform\n\nYour use of AwayHome is entirely at your own risk.`,
  },
  {
    id: "availability",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Website Availability",
    body: `We strive to keep AwayHome available at all times, but we do not guarantee uninterrupted, error-free access to the platform. The website may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control.\n\nAwayHome reserves the right to modify, suspend, or discontinue any part of the platform at any time without prior notice.`,
  },
  {
    id: "jurisdiction",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
    title: "Governing Law & Jurisdiction",
    body: `This disclaimer and your use of AwayHome are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from your use of the platform shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.\n\nIf any provision of this disclaimer is found to be unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    id: "changes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>
    ),
    title: "Changes to This Disclaimer",
    body: `We may update this disclaimer periodically to reflect changes in our services or applicable law. The "Last updated" date at the top of this page will always reflect the most recent revision.\n\nContinued use of AwayHome after any changes constitutes your acceptance of the updated disclaimer. We encourage you to review this page periodically.`,
  },
];

const highlights = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    label: "Directory only",
    desc: "We list properties — we don't manage, own, or book them.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    label: "Not professional advice",
    desc: "Nothing here is legal, financial, or real-estate advice.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    label: "Verify before you pay",
    desc: "Always confirm listing details and meet the owner before any transaction.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "Nigerian law governs",
    desc: "All disputes are subject to the courts of Lagos State, Nigeria.",
  },
];

export default function DisclaimerPage() {
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

        /* ── Hero ── */
        .hero {
          position: relative;
          padding: 9rem 2rem 5.5rem;
          text-align: center;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 85% 55% at 50% 0%, rgba(201,168,76,0.13) 0%, transparent 68%);
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
          color: white;
          margin-bottom: 1.5rem;
        }
        .hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.3rem, 4.5vw, 3.6rem);
          font-weight: 700;
          color: white;
          line-height: 1.1;
          margin-bottom: 1.1rem;
        }
        .hero h1 em { font-style: italic; color: white; }
        .hero-sub {
          font-size: 1.02rem;
          color: rgba(255,255,255,0.72);
          line-height: 1.75;
          max-width: 540px;
          margin: 0 auto 1.6rem;
        }
        .meta-row {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: white;
        }
        .meta-chip svg { color: white; opacity: 0.8; }

        /* ── Highlight strip ── */
        .highlights {
          background: #0D1220;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 2rem 0;
        }
        .highlights-grid {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
        }
        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          padding: 0 1.5rem;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .highlight-item:first-child { padding-left: 0; }
        .highlight-item:last-child { border-right: none; }
        .hi-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: rgba(201,168,76,0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-top: 2px;
        }
        .hi-label {
          font-size: 0.88rem;
          font-weight: 600;
          color: white;
          margin-bottom: 3px;
        }
        .hi-desc {
          font-size: 0.8rem;
          color: white;
          line-height: 1.6;
        }

        /* ── Layout ── */
        .main-section { padding: 3rem 0 6rem; }
        .container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 210px 1fr;
          gap: 3.5rem;
          align-items: start;
        }

        /* ── TOC ── */
        .toc {
          position: sticky;
          top: 6rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 1.25rem;
        }
        .toc-title {
          font-size: 0.71rem;
          font-weight: 600;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: white;
          margin-bottom: 0.85rem;
        }
        .toc a {
          display: block;
          font-size: 0.81rem;
          color: white;
          text-decoration: none;
          padding: 5px 8px;
          border-radius: 7px;
          transition: background 0.18s, color 0.18s;
          line-height: 1.45;
          margin-bottom: 1px;
        }
        .toc a:hover {
          background: rgba(201,168,76,0.09);
          color: #C9A84C;
        }
        .toc-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 0.75rem 0;
        }
        .toc-related-label {
          font-size: 0.71rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: white;
          margin-bottom: 0.6rem;
        }
        .toc-related-link {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: white;
          text-decoration: none;
          padding: 4px 0;
        }
        .toc-related-link:hover { text-decoration: underline; }

        .disclaimer-block {
          scroll-margin-top: 7rem;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 2rem;
          margin-bottom: 1.25rem;
          transition: border-color 0.22s;
        }
        .disclaimer-block:hover {
          border-color: rgba(201,168,76,0.18);
        }
        .block-header {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.1rem;
        }
        .block-icon {
          width: 46px;
          height: 46px;
          min-width: 46px;
          background: rgba(201,168,76,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .block-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: white;
          line-height: 1.25;
        }
        .block-body {
          font-size: 0.88rem;
          color: white;
          line-height: 1.85;
          white-space: pre-line;
        }
        .block-body strong { color: white; font-weight: 600; }

        /* Bullet list styling inside block body */
        .bullet-list {
          list-style: none;
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .bullet-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: white;
          line-height: 1.65;
        }
        .bullet-dot {
          width: 6px;
          height: 6px;
          min-width: 6px;
          border-radius: 50%;
          background: #C9A84C;
          margin-top: 8px;
        }

        /* ── Alert box ── */
        .alert-box {
          background: rgba(201,168,76,0.07);
          border: 1px solid rgba(201,168,76,0.22);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .alert-icon {
          color: white;
          min-width: 20px;
          margin-top: 2px;
        }
        .alert-text {
          font-size: 0.88rem;
          color: white;
          line-height: 1.72;
        }
        .alert-text strong { color: white; font-weight: 600; }

        /* ── Contact footer strip ── */
        .contact-strip {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }
        .contact-strip-left { flex: 1; min-width: 200px; }
        .contact-strip-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: white;
          margin-bottom: 0.35rem;
        }
        .contact-strip-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.35rem;
        }
        .contact-strip-sub {
          font-size: 0.84rem;
          color: white;
          line-height: 1.6;
        }
        .contact-btns {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A;
          font-weight: 700;
          font-size: 0.88rem;
          padding: 11px 22px;
          border-radius: 10px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(201,168,76,0.35);
        }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.11);
          color: white;
          font-weight: 600;
          font-size: 0.88rem;
          padding: 11px 22px;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.22);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
          .toc { position: static; margin-bottom: 1.5rem; }
          .highlights-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
          .highlight-item { border-right: none; padding: 0; }
        }
        @media (max-width: 560px) {
          .highlights-grid { grid-template-columns: 1fr; }
          .hero { padding: 7rem 1.25rem 4rem; }
          .disclaimer-block { padding: 1.5rem 1.1rem; }
          .contact-strip { flex-direction: column; }
        }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <div className="hero">
        <div className="eyebrow">Legal notice</div>
        <h1>Site <em>Disclaimer</em></h1>
        <p className="hero-sub">
          Please read this disclaimer carefully before using AwayHome. By accessing our platform,
          you acknowledge and accept the terms set out below.
        </p>
        <div className="meta-row">
          <span className="meta-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Last updated: {lastUpdated}
          </span>
          <span className="meta-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
            </svg>
            Governed by Nigerian law
          </span>
        </div>
      </div>

      {/* ── Highlight strip ── */}
      <div className="highlights">
        <div className="highlights-grid">
          {highlights.map((h) => (
            <div className="highlight-item" key={h.label}>
              <div className="hi-icon">{h.icon}</div>
              <div>
                <div className="hi-label">{h.label}</div>
                <div className="hi-desc">{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main ── */}
      <section className="main-section">
        <div className="container">
          <div className="content-grid">

            {/* TOC */}
            <aside className="toc">
              <div className="toc-title">Contents</div>
              {disclaimerSections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>{s.title}</a>
              ))}
              <div className="toc-divider" />
              <div className="toc-related-label">Related</div>
              <Link href="/privacy" className="toc-related-link">Privacy Policy →</Link>
              <Link href="/cookies" className="toc-related-link">Cookie Policy →</Link>
              <Link href="/terms" className="toc-related-link">Terms of Service →</Link>
              <Link href="/contact" className="toc-related-link">Contact Us →</Link>
            </aside>

            {/* Body */}
            <div>

              {/* Alert */}
              <div className="alert-box">
                <span className="alert-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </span>
                <p className="alert-text">
                  <strong>Important:</strong> AwayHome is a property listing directory. We connect users with property owners and agents but do not own, manage, or book properties. Always verify listing details directly with the owner and conduct independent due diligence before making any financial commitment.
                </p>
              </div>

              {/* Sections */}
              {disclaimerSections.map((s) => (
                <div className="disclaimer-block" key={s.id} id={s.id}>
                  <div className="block-header">
                    <div className="block-icon">{s.icon}</div>
                    <h2 className="block-title">{s.title}</h2>
                  </div>

                  {s.id === "liability" ? (
                    <>
                      <p className="block-body">
                        To the fullest extent permitted by applicable Nigerian law, AwayHome and its operators, directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
                      </p>
                      <ul className="bullet-list">
                        {[
                          "Your use of or inability to use this website",
                          "Reliance on any listing, price, or information displayed",
                          "Any transaction, agreement, or dispute between you and a listed property owner",
                          "Unauthorised access to or alteration of your data",
                          "Any other matter relating to the AwayHome platform",
                        ].map((item) => (
                          <li key={item}>
                            <span className="bullet-dot" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="block-body" style={{ marginTop: "0.85rem" }}>
                        Your use of AwayHome is entirely at your own risk.
                      </p>
                    </>
                  ) : (
                    <p className="block-body">{s.body}</p>
                  )}
                </div>
              ))}

              {/* Contact strip */}
              <div className="contact-strip">
                <div className="contact-strip-left">
                  <div className="contact-strip-label">Questions about this disclaimer?</div>
                  <div className="contact-strip-title">We're happy to clarify</div>
                  <p className="contact-strip-sub">
                    If anything in this disclaimer is unclear or you have a specific legal concern, reach out to our team.
                  </p>
                </div>
                <div className="contact-btns">
                  <a href="mailto:contact@awayhomehq.com" className="btn-gold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="15" height="15">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    contact@awayhomehq.com
                  </a>
                  <Link href="/contact" className="btn-ghost">
                    Contact page
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}