"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .pp-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .pp-hero {
    position: relative; padding: 7rem 2rem 4rem;
    background: #0D1220; border-bottom: 1px solid rgba(201,168,76,0.12); overflow: hidden;
  }
  .pp-hero::before {
    content: ''; position: absolute; width: 700px; height: 700px; border-radius: 50%;
    background: rgba(201,168,76,0.04); filter: blur(100px);
    top: -250px; right: -150px; pointer-events: none;
  }
  .pp-hero-inner { position: relative; max-width: 760px; margin: 0 auto; text-align: center; }
  .pp-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem;
  }
  .pp-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.9rem, 4vw, 2.9rem); font-weight: 700; color: #fff;
    line-height: 1.15; margin-bottom: 0.9rem;
  }
  .pp-hero h1 em { font-style: italic; color: #C9A84C; }
  .pp-hero-meta { font-size: 0.82rem; color: rgba(255,255,255,0.32); }
  .pp-hero-meta strong { color: rgba(255,255,255,0.55); }

  /* ── Breadcrumb ── */
  .pp-breadcrumb {
    max-width: 1000px; margin: 0 auto; padding: 1.25rem 2rem 0;
    display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.28);
  }
  .pp-breadcrumb a { color: rgba(255,255,255,0.28); text-decoration: none; transition: color 0.2s; }
  .pp-breadcrumb a:hover { color: #C9A84C; }

  /* ── Layout: sidebar + content ── */
  .pp-layout {
    max-width: 1000px; margin: 0 auto; padding: 3rem 2rem 5rem;
    display: grid; grid-template-columns: 220px 1fr; gap: 3rem; flex: 1; align-items: start;
  }

  /* ── Sticky nav ── */
  .pp-nav { position: sticky; top: 5rem; }
  .pp-nav-title {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 0.75rem;
  }
  .pp-nav-list { list-style: none; display: flex; flex-direction: column; gap: 2px; }
  .pp-nav-item a {
    display: block; padding: 7px 12px; border-radius: 8px;
    font-size: 0.82rem; color: rgba(255,255,255,0.38); text-decoration: none;
    border-left: 2px solid transparent; transition: all 0.2s;
  }
  .pp-nav-item a:hover { color: rgba(255,255,255,0.7); border-left-color: rgba(201,168,76,0.4); background: rgba(255,255,255,0.03); }
  .pp-nav-item a.active { color: #C9A84C; border-left-color: #C9A84C; background: rgba(201,168,76,0.06); }

  /* ── Content ── */
  .pp-content { min-width: 0; }
  .pp-section { margin-bottom: 3rem; scroll-margin-top: 6rem; }
  .pp-section:last-child { margin-bottom: 0; }

  .pp-section h2 {
    font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700;
    color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;
  }
  .pp-section-num {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: rgba(201,168,76,0.12); color: #C9A84C;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; font-family: 'DM Sans', sans-serif;
  }
  .pp-section p {
    font-size: 0.88rem; color: rgba(255,255,255,0.45); line-height: 1.85; margin-bottom: 0.85rem;
  }
  .pp-section p:last-child { margin-bottom: 0; }

  /* Highlighted info box */
  .pp-info-box {
    background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.15);
    border-radius: 12px; padding: 1.1rem 1.25rem; margin: 1rem 0;
    display: flex; gap: 12px; align-items: flex-start;
  }
  .pp-info-box svg { flex-shrink: 0; color: #C9A84C; margin-top: 1px; }
  .pp-info-box p { font-size: 0.84rem; color: rgba(255,255,255,0.5); margin: 0; line-height: 1.7; }

  /* List items */
  .pp-list { list-style: none; margin: 0.75rem 0; display: flex; flex-direction: column; gap: 7px; }
  .pp-list li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 0.87rem; color: rgba(255,255,255,0.42); line-height: 1.65;
  }
  .pp-list li::before {
    content: ''; width: 5px; height: 5px; border-radius: 50%;
    background: #C9A84C; flex-shrink: 0; margin-top: 8px;
  }

  /* Divider */
  .pp-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 2.5rem 0; }

  /* Contact card */
  .pp-contact-card {
    background: #111827; border: 1px solid rgba(201,168,76,0.15);
    border-radius: 14px; padding: 1.5rem; margin-top: 1rem;
  }
  .pp-contact-card p { font-size: 0.85rem; color: rgba(255,255,255,0.42); margin-bottom: 0.5rem; }
  .pp-contact-card a { color: #C9A84C; text-decoration: none; font-weight: 600; }
  .pp-contact-card a:hover { text-decoration: underline; }

  @media (max-width: 700px) {
    .pp-layout { grid-template-columns: 1fr; gap: 2rem; }
    .pp-nav { display: none; }
  }
`;

const SECTIONS = [
  { id: "collection", num: "01", title: "Information We Collect" },
  { id: "use",        num: "02", title: "How We Use Your Information" },
  { id: "sharing",   num: "03", title: "Information Sharing" },
  { id: "cookies",   num: "04", title: "Cookies" },
  { id: "retention", num: "05", title: "Data Retention" },
  { id: "rights",    num: "06", title: "Your Rights" },
  { id: "security",  num: "07", title: "Security" },
  { id: "children",  num: "08", title: "Children's Privacy" },
  { id: "changes",   num: "09", title: "Changes to This Policy" },
  { id: "contact",   num: "10", title: "Contact Us" },
];

export default function PrivacyPage() {
  const [activeId, setActiveId] = useState("collection");

  const handleNavClick = (id) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pp-page">
        <Navbar />

        {/* Hero */}
        <div className="pp-hero">
          <div className="pp-hero-inner">
            <div className="pp-eyebrow">Legal</div>
            <h1><em>Privacy</em> Policy</h1>
            <p className="pp-hero-meta">
              Last updated: <strong>January 1, 2025</strong>
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="pp-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ color: "rgba(255,255,255,0.13)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Privacy Policy</span>
        </div>

        <div className="pp-layout">
          {/* Sidebar nav */}
          <nav className="pp-nav">
            <p className="pp-nav-title">Contents</p>
            <ul className="pp-nav-list">
              {SECTIONS.map((s) => (
                <li key={s.id} className="pp-nav-item">
                  <a
                    href={`#${s.id}`}
                    className={activeId === s.id ? "active" : ""}
                    onClick={(e) => { e.preventDefault(); handleNavClick(s.id); }}
                  >
                    {s.num}. {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="pp-content">

            <div className="pp-info-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>
                This Privacy Policy explains how we collect, use, and protect your personal
                information when you use our platform. By using our services, you agree to the
                practices described here.
              </p>
            </div>

            <hr className="pp-divider" />

            {/* 01 */}
            <section id="collection" className="pp-section">
              <h2><span className="pp-section-num">01</span> Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="pp-list">
                <li>Account registration details — name, email address, and password</li>
                <li>Listing information — property details, photos, descriptions, and contact information you submit</li>
                <li>Communications — messages you send us via contact forms or email</li>
                <li>Profile information — any additional details you add to your account</li>
              </ul>
              <p>We also automatically collect certain technical information when you visit our platform:</p>
              <ul className="pp-list">
                <li>Device information — browser type, operating system, and device identifiers</li>
                <li>Log data — IP address, pages visited, time spent, and referring URLs</li>
                <li>Cookie data — as described in the Cookies section below</li>
              </ul>
            </section>

            <hr className="pp-divider" />

            {/* 02 */}
            <section id="use" className="pp-section">
              <h2><span className="pp-section-num">02</span> How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="pp-list">
                <li>Create and manage your account</li>
                <li>Publish and manage your property listings</li>
                <li>Review listings before they go live on the platform</li>
                <li>Respond to your enquiries and support requests</li>
                <li>Send you transactional notifications about your listings (approval, rejection, etc.)</li>
                <li>Detect and prevent fraud, abuse, or misuse of our platform</li>
                <li>Improve our platform through anonymised usage analytics</li>
              </ul>
              <p>
                We do <strong style={{ color: "rgba(255,255,255,0.7)" }}>not</strong> sell your
                personal data to third parties, and we do not use your information for targeted
                advertising.
              </p>
            </section>

            <hr className="pp-divider" />

            {/* 03 */}
            <section id="sharing" className="pp-section">
              <h2><span className="pp-section-num">03</span> Information Sharing</h2>
              <p>
                Your listing contact details (name, phone, email) are visible to the public on
                your published listing pages — this is intentional, as our platform facilitates
                direct contact between hosts and guests.
              </p>
              <p>We share information with third parties only in these limited cases:</p>
              <ul className="pp-list">
                <li><strong style={{ color: "rgba(255,255,255,0.6)" }}>Service providers</strong> — cloud hosting (MongoDB Atlas), image storage (Cloudinary), and analytics tools that process data on our behalf</li>
                <li><strong style={{ color: "rgba(255,255,255,0.6)" }}>Legal requirements</strong> — when required by law, court order, or to protect the rights and safety of our users</li>
                <li><strong style={{ color: "rgba(255,255,255,0.6)" }}>Business transfers</strong> — in the event of a merger, acquisition, or sale of assets, with notice to you</li>
              </ul>
            </section>

            <hr className="pp-divider" />

            {/* 04 */}
            <section id="cookies" className="pp-section">
              <h2><span className="pp-section-num">04</span> Cookies</h2>
              <p>
                We use cookies and similar technologies to operate our platform and improve
                your experience. Cookies we use include:
              </p>
              <ul className="pp-list">
                <li><strong style={{ color: "rgba(255,255,255,0.6)" }}>Essential cookies</strong> — required for authentication and session management. These cannot be disabled.</li>
                <li><strong style={{ color: "rgba(255,255,255,0.6)" }}>Analytics cookies</strong> — help us understand how visitors use the platform (anonymised). You can opt out in your browser settings.</li>
              </ul>
              <p>
                You can control or delete cookies through your browser settings. Disabling essential
                cookies may affect your ability to log in or use the platform.
              </p>
            </section>

            <hr className="pp-divider" />

            {/* 05 */}
            <section id="retention" className="pp-section">
              <h2><span className="pp-section-num">05</span> Data Retention</h2>
              <p>
                We retain your account data for as long as your account is active. If you delete
                your account, we will remove your personal data within 30 days, except where
                retention is required by law or legitimate business reasons (such as fraud
                investigation records).
              </p>
              <p>
                Published listing data may remain visible for a short period after deletion
                during cache clearance.
              </p>
            </section>

            <hr className="pp-divider" />

            {/* 06 */}
            <section id="rights" className="pp-section">
              <h2><span className="pp-section-num">06</span> Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="pp-list">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Object to processing of your data in certain circumstances</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p>
                To exercise any of these rights, contact us using the details in the Contact
                section below. We will respond within 14 working days.
              </p>
            </section>

            <hr className="pp-divider" />

            {/* 07 */}
            <section id="security" className="pp-section">
              <h2><span className="pp-section-num">07</span> Security</h2>
              <p>
                We take reasonable technical and organisational measures to protect your data,
                including encrypted connections (HTTPS), hashed password storage, and access
                controls on our databases.
              </p>
              <p>
                No online platform can guarantee absolute security. Please use a strong, unique
                password and do not share your account credentials with others.
              </p>
            </section>

            <hr className="pp-divider" />

            {/* 08 */}
            <section id="children" className="pp-section">
              <h2><span className="pp-section-num">08</span> Children&rsquo;s Privacy</h2>
              <p>
                Our platform is not intended for children under the age of 18. We do not
                knowingly collect personal data from minors. If you believe a minor has
                registered an account, please contact us and we will promptly delete the data.
              </p>
            </section>

            <hr className="pp-divider" />

            {/* 09 */}
            <section id="changes" className="pp-section">
              <h2><span className="pp-section-num">09</span> Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we make material
                changes, we will update the &ldquo;Last updated&rdquo; date at the top of this
                page and, where appropriate, notify you by email or a notice on the platform.
              </p>
              <p>
                Continued use of our platform after changes are posted constitutes your
                acceptance of the updated policy.
              </p>
            </section>

            <hr className="pp-divider" />

            {/* 10 */}
            <section id="contact" className="pp-section">
              <h2><span className="pp-section-num">10</span> Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or how we handle your data,
                please get in touch:
              </p>
              <div className="pp-contact-card">
                <p>Email: <a href="mailto:contact@awayhomehq.com">contact@awayhomehq.com</a></p>
                <p>We aim to respond to all privacy enquiries within 14 working days.</p>
              </div>
            </section>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}