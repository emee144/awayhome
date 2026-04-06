"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .ab-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .ab-hero {
    position: relative; padding: 8rem 2rem 5rem;
    background: #0D1220; border-bottom: 1px solid rgba(201,168,76,0.12);
    overflow: hidden;
  }
  .ab-hero::before {
    content: ''; position: absolute;
    width: 800px; height: 800px; border-radius: 50%;
    background: rgba(201,168,76,0.05); filter: blur(110px);
    top: -300px; right: -200px; pointer-events: none;
  }
  .ab-hero::after {
    content: ''; position: absolute;
    width: 500px; height: 500px; border-radius: 50%;
    background: rgba(96,165,250,0.03); filter: blur(90px);
    bottom: -150px; left: -100px; pointer-events: none;
  }
  .ab-hero-inner { position: relative; max-width: 760px; margin: 0 auto; text-align: center; }
  .ab-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #C9A84C; margin-bottom: 1.5rem;
  }
  .ab-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #C9A84C; animation: abpulse 2s infinite; }
  @keyframes abpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
  .ab-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 700;
    color: #fff; line-height: 1.12; margin-bottom: 1.25rem;
  }
  .ab-hero h1 em { font-style: italic; color: #C9A84C; }
  .ab-hero-lead {
    font-size: 1.05rem; color: rgba(255,255,255,0.45); line-height: 1.8;
    max-width: 580px; margin: 0 auto 2.5rem;
  }

  /* ── Stats band ── */
  .ab-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    max-width: 600px; margin: 0 auto;
    border: 1px solid rgba(201,168,76,0.15); border-radius: 16px;
    overflow: hidden; background: rgba(201,168,76,0.04);
  }
  .ab-stat {
    padding: 1.5rem 1rem; text-align: center;
    border-right: 1px solid rgba(201,168,76,0.12);
  }
  .ab-stat:last-child { border-right: none; }
  .ab-stat-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: #C9A84C; }
  .ab-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }

  /* ── Breadcrumb ── */
  .ab-breadcrumb {
    max-width: 900px; margin: 0 auto; padding: 1.5rem 2rem 0;
    display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.28);
  }
  .ab-breadcrumb a { color: rgba(255,255,255,0.28); text-decoration: none; transition: color 0.2s; }
  .ab-breadcrumb a:hover { color: #C9A84C; }

  /* ── Content ── */
  .ab-content { max-width: 900px; margin: 0 auto; padding: 3rem 2rem 5rem; flex: 1; }

  /* ── Mission section ── */
  .ab-mission {
    display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;
    align-items: center; margin-bottom: 5rem;
  }
  .ab-mission-text h2 {
    font-family: 'Playfair Display', serif; font-size: 1.9rem; color: #fff;
    line-height: 1.2; margin-bottom: 1rem;
  }
  .ab-mission-text h2 em { font-style: italic; color: #C9A84C; }
  .ab-mission-text p { font-size: 0.9rem; color: rgba(255,255,255,0.45); line-height: 1.85; margin-bottom: 0.9rem; }
  .ab-mission-visual {
    background: #111827; border: 1px solid rgba(201,168,76,0.15);
    border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1rem;
  }
  .ab-mission-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 1rem; background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;
    transition: border-color 0.2s;
  }
  .ab-mission-item:hover { border-color: rgba(201,168,76,0.2); }
  .ab-mission-icon {
    width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
    background: rgba(201,168,76,0.12); display: flex; align-items: center; justify-content: center;
    color: #C9A84C;
  }
  .ab-mission-item-title { font-size: 0.88rem; font-weight: 600; color: #fff; margin-bottom: 3px; }
  .ab-mission-item-sub { font-size: 0.78rem; color: rgba(255,255,255,0.35); line-height: 1.5; }

  /* ── Divider ── */
  .ab-divider {
    border: none; border-top: 1px solid rgba(255,255,255,0.06);
    margin: 4rem 0;
  }
  .ab-section-label {
    display: flex; align-items: center; gap: 12px; margin-bottom: 2.5rem;
  }
  .ab-section-label-line {
    flex: 1; height: 1px; background: rgba(255,255,255,0.06);
  }
  .ab-section-label span {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.3); white-space: nowrap;
  }

  /* ── Values grid ── */
  .ab-values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 4rem; }
  .ab-value-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 1.5rem;
    transition: border-color 0.25s, transform 0.25s;
  }
  .ab-value-card:hover { border-color: rgba(201,168,76,0.25); transform: translateY(-3px); }
  .ab-value-num {
    font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700;
    color: rgba(201,168,76,0.2); line-height: 1; margin-bottom: 0.75rem;
  }
  .ab-value-title { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 0.5rem; }
  .ab-value-text { font-size: 0.82rem; color: rgba(255,255,255,0.38); line-height: 1.65; }

  /* ── Story section ── */
  .ab-story {
    background: #111827; border: 1px solid rgba(201,168,76,0.12);
    border-radius: 20px; padding: 2.5rem; margin-bottom: 4rem; position: relative; overflow: hidden;
  }
  .ab-story::before {
    content: '"'; position: absolute; top: -20px; left: 20px;
    font-family: 'Playfair Display', serif; font-size: 12rem; color: rgba(201,168,76,0.05);
    line-height: 1; pointer-events: none;
  }
  .ab-story-inner { position: relative; }
  .ab-story h2 {
    font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #fff; margin-bottom: 1.25rem;
  }
  .ab-story h2 em { font-style: italic; color: #C9A84C; }
  .ab-story p { font-size: 0.9rem; color: rgba(255,255,255,0.42); line-height: 1.85; margin-bottom: 0.9rem; }
  .ab-story p:last-child { margin-bottom: 0; }

  /* ── CTA strip ── */
  .ab-cta {
    background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03));
    border: 1px solid rgba(201,168,76,0.18); border-radius: 20px;
    padding: 2.5rem; text-align: center;
  }
  .ab-cta h2 { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #fff; margin-bottom: 0.75rem; }
  .ab-cta h2 em { font-style: italic; color: #C9A84C; }
  .ab-cta p { font-size: 0.88rem; color: rgba(255,255,255,0.4); margin-bottom: 1.75rem; line-height: 1.7; }
  .ab-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .ab-btn-gold {
    display: inline-flex; align-items: center; gap: 7px;
    background: linear-gradient(135deg, #C9A84C, #E8C878);
    color: #0A0E1A; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem;
    padding: 13px 28px; border-radius: 10px; text-decoration: none; border: none; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ab-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }
  .ab-btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.9rem;
    padding: 13px 28px; border-radius: 10px; text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .ab-btn-ghost:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.06); }

  @media (max-width: 680px) {
    .ab-mission { grid-template-columns: 1fr; gap: 2rem; }
    .ab-values   { grid-template-columns: 1fr 1fr; }
    .ab-stats    { grid-template-columns: 1fr; }
    .ab-stat     { border-right: none; border-bottom: 1px solid rgba(201,168,76,0.12); }
    .ab-stat:last-child { border-bottom: none; }
  }
  @media (max-width: 420px) {
    .ab-values { grid-template-columns: 1fr; }
  }
`;

const VALUES = [
  {
    num: "01", title: "Transparency",
    text: "No hidden fees, no commission cuts. Owners and guests connect directly. What you see is exactly what you get.",
  },
  {
    num: "02", title: "Accessibility",
    text: "Anyone with a property in Nigeria can list for free. No technical barriers, no gatekeeping.",
  },
  {
    num: "03", title: "Trust",
    text: "Every listing is reviewed before going live. We maintain quality so guests can book with confidence.",
  },
];

const MISSION_ITEMS = [
  {
    title: "Zero Booking Fees",
    sub: "Hosts keep 100% of what guests pay. We never take a cut.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: "Direct Connections",
    sub: "Travellers talk to hosts directly — no intermediaries involved.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: "Verified Listings",
    sub: "Our team reviews every submission before it goes live.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <style>{CSS}</style>
      <div className="ab-page">
        <Navbar />

        {/* Hero */}
        <div className="ab-hero">
          <div className="ab-hero-inner">
            <div className="ab-eyebrow">
              <span className="ab-eyebrow-dot" />
              About Us
            </div>
            <h1>Nigeria&rsquo;s <em>Free</em><br />Property Directory</h1>
            <p className="ab-hero-lead">
              We built the platform we wished existed — a simple, honest place to find and
              list hotels, shortlets, and properties for sale across every corner of Nigeria.
            </p>
            <div className="ab-stats">
              <div className="ab-stat">
                <div className="ab-stat-num">37</div>
                <div className="ab-stat-label">States Covered</div>
              </div>
              <div className="ab-stat">
                <div className="ab-stat-num">Free</div>
                <div className="ab-stat-label">Always &amp; Forever</div>
              </div>
              <div className="ab-stat">
                <div className="ab-stat-num">0%</div>
                <div className="ab-stat-label">Commission</div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="ab-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ color: "rgba(255,255,255,0.13)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>About</span>
        </div>

        <div className="ab-content">

          {/* Mission */}
          <div className="ab-mission">
            <div className="ab-mission-text">
              <h2>Built for <em>Nigeria</em>,<br />by Nigerians</h2>
              <p>
                Finding accommodation or a property to buy in Nigeria shouldn&rsquo;t require
                navigating five middlemen, paying undisclosed fees, or dealing with listings
                that haven&rsquo;t been updated in two years.
              </p>
              <p>
                We set out to fix that. Our platform is a clean, direct marketplace that
                connects property owners with the people who need them — no commissions,
                no booking fees, no noise.
              </p>
            </div>
            <div className="ab-mission-visual">
              {MISSION_ITEMS.map((item) => (
                <div key={item.title} className="ab-mission-item">
                  <div className="ab-mission-icon">{item.icon}</div>
                  <div>
                    <div className="ab-mission-item-title">{item.title}</div>
                    <div className="ab-mission-item-sub">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="ab-divider" />

          {/* Values */}
          <div className="ab-section-label">
            <div className="ab-section-label-line" />
            <span>What We Stand For</span>
            <div className="ab-section-label-line" />
          </div>
          <div className="ab-values">
            {VALUES.map((v) => (
              <div key={v.num} className="ab-value-card">
                <div className="ab-value-num">{v.num}</div>
                <div className="ab-value-title">{v.title}</div>
                <p className="ab-value-text">{v.text}</p>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="ab-story">
            <div className="ab-story-inner">
              <h2>Our <em>Story</em></h2>
              <p>
                It started with frustration. Searching for a hotel in Port Harcourt, a shortlet
                in Lekki, or land in Abuja meant calling dozens of numbers, visiting dodgy
                aggregator sites plastered with ads, or paying agents who disappeared after
                collecting their fee.
              </p>
              <p>
                We believed property discovery in Nigeria deserved better. So we built a
                platform where owners list directly, listings are reviewed before going live,
                and every phone number on the page actually belongs to the person who owns
                the property.
              </p>
              <p>
                Today we&rsquo;re growing — one genuine listing at a time — with a simple promise:
                free for hosts, honest for guests, always.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="ab-cta">
            <h2>Ready to <em>List</em> Your Property?</h2>
            <p>
              Join thousands of property owners across Nigeria who reach renters and
              buyers directly — with zero commission and no hidden charges.
            </p>
            <div className="ab-cta-btns">
              <Link href="/list-property" className="ab-btn-gold">List for Free</Link>
              <Link href="/listings" className="ab-btn-ghost">Browse Listings</Link>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
}