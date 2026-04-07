"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .tc-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .tc-hero {
    position: relative; padding: 7rem 2rem 4rem;
    background: #0D1220; border-bottom: 1px solid rgba(201,168,76,0.12); overflow: hidden;
  }
  .tc-hero::before {
    content: ''; position: absolute; width: 700px; height: 700px; border-radius: 50%;
    background: rgba(201,168,76,0.04); filter: blur(100px);
    top: -250px; left: -150px; pointer-events: none;
  }
  .tc-hero-inner { position: relative; max-width: 760px; margin: 0 auto; text-align: center; }
  .tc-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: white; margin-bottom: 1.25rem;
  }
  .tc-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.9rem, 4vw, 2.9rem); font-weight: 700; color: white;
    line-height: 1.15; margin-bottom: 0.9rem;
  }
  .tc-hero h1 em { font-style: italic; color: white; }
  .tc-hero-meta { font-size: 0.82rem; color: white; }
  .tc-hero-meta strong { color: white; }

  /* ── Breadcrumb ── */
  .tc-breadcrumb {
    max-width: 1000px; margin: 0 auto; padding: 1.25rem 2rem 0;
    display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: white;
  }
  .tc-breadcrumb a { color: white; text-decoration: none; transition: color 0.2s; }
  .tc-breadcrumb a:hover { color: #C9A84C; }

  /* ── Layout ── */
  .tc-layout {
    max-width: 1000px; margin: 0 auto; padding: 3rem 2rem 5rem;
    display: grid; grid-template-columns: 220px 1fr; gap: 3rem; flex: 1; align-items: start;
  }

  /* ── Sticky nav ── */
  .tc-nav { position: sticky; top: 5rem; }
  .tc-nav-title {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: white; margin-bottom: 0.75rem;
  }
  .tc-nav-list { list-style: none; display: flex; flex-direction: column; gap: 2px; }
  .tc-nav-item a {
    display: block; padding: 7px 12px; border-radius: 8px;
    font-size: 0.82rem; color: white; text-decoration: none;
    border-left: 2px solid transparent; transition: all 0.2s;
  }
  .tc-nav-item a:hover { color: rgba(255,255,255,0.7); border-left-color: rgba(201,168,76,0.4); background: rgba(255,255,255,0.03); }
  .tc-nav-item a.active { color: #C9A84C; border-left-color: #C9A84C; background: rgba(201,168,76,0.06); }

  /* ── Content ── */
  .tc-content { min-width: 0; }
  .tc-section { margin-bottom: 3rem; scroll-margin-top: 6rem; }
  .tc-section:last-child { margin-bottom: 0; }

  .tc-section h2 {
    font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700;
    color: white; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;
  }
  .tc-section-num {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: rgba(201,168,76,0.12); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; font-family: 'DM Sans', sans-serif;
  }
  .tc-section p {
    font-size: 0.88rem; color: white; line-height: 1.85; margin-bottom: 0.85rem;
  }
  .tc-section p:last-child { margin-bottom: 0; }

  /* Warning box */
  .tc-warn-box {
    background: rgba(240,100,80,0.06); border: 1px solid rgba(240,100,80,0.18);
    border-radius: 12px; padding: 1.1rem 1.25rem; margin: 1rem 0;
    display: flex; gap: 12px; align-items: flex-start;
  }
  .tc-warn-box svg { flex-shrink: 0; color: white; margin-top: 1px; }
  .tc-warn-box p { font-size: 0.84rem; color: rwhite; margin: 0; line-height: 1.7; }

  /* Info box */
  .tc-info-box {
    background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.15);
    border-radius: 12px; padding: 1.1rem 1.25rem; margin: 1rem 0;
    display: flex; gap: 12px; align-items: flex-start;
  }
  .tc-info-box svg { flex-shrink: 0; color: white; margin-top: 1px; }
  .tc-info-box p { font-size: 0.84rem; color: white; margin: 0; line-height: 1.7; }

  /* List */
  .tc-list { list-style: none; margin: 0.75rem 0; display: flex; flex-direction: column; gap: 7px; }
  .tc-list li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 0.87rem; color: white; line-height: 1.65;
  }
  .tc-list li::before {
    content: ''; width: 5px; height: 5px; border-radius: 50%;
    background: #C9A84C; flex-shrink: 0; margin-top: 8px;
  }

  /* Prohibited list (red dots) */
  .tc-list.danger li::before { background: #f46450; }

  .tc-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 2.5rem 0; }

  /* Contact card */
  .tc-contact-card {
    background: #111827; border: 1px solid rgba(201,168,76,0.15);
    border-radius: 14px; padding: 1.5rem; margin-top: 1rem;
  }
  .tc-contact-card p { font-size: 0.85rem; color: white; margin-bottom: 0.5rem; }
  .tc-contact-card a { color: white; text-decoration: none; font-weight: 600; }
  .tc-contact-card a:hover { text-decoration: underline; }

  /* Quick links */
  .tc-links { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .tc-link {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    color: white; font-size: 0.82rem; font-weight: 500;
    padding: 8px 16px; border-radius: 8px; text-decoration: none; transition: all 0.2s;
  }
  .tc-link:hover { border-color: rgba(201,168,76,0.35); color: #C9A84C; }

  @media (max-width: 700px) {
    .tc-layout { grid-template-columns: 1fr; gap: 2rem; }
    .tc-nav { display: none; }
  }
`;

const SECTIONS = [
  { id: "acceptance",   num: "01", title: "Acceptance of Terms" },
  { id: "platform",     num: "02", title: "About the Platform" },
  { id: "accounts",     num: "03", title: "User Accounts" },
  { id: "listings",     num: "04", title: "Listing Rules" },
  { id: "prohibited",   num: "05", title: "Prohibited Content" },
  { id: "moderation",   num: "06", title: "Content Moderation" },
  { id: "liability",    num: "07", title: "Limitation of Liability" },
  { id: "ip",           num: "08", title: "Intellectual Property" },
  { id: "termination",  num: "09", title: "Termination" },
  { id: "governing",    num: "10", title: "Governing Law" },
  { id: "changes",      num: "11", title: "Changes to Terms" },
  { id: "contact",      num: "12", title: "Contact Us" },
];

export default function TermsPage() {
  const [activeId, setActiveId] = useState("acceptance");

  const handleNavClick = (id) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="tc-page">
        <Navbar />

        {/* Hero */}
        <div className="tc-hero">
          <div className="tc-hero-inner">
            <div className="tc-eyebrow">Legal</div>
            <h1>Terms of <em>Service</em></h1>
            <p className="tc-hero-meta">
              Last updated: <strong>{new Date().getFullYear()}</strong>
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="tc-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ color: "rgba(255,255,255,0.13)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Terms of Service</span>
        </div>

        <div className="tc-layout">
          {/* Sidebar */}
          <nav className="tc-nav">
            <p className="tc-nav-title">Contents</p>
            <ul className="tc-nav-list">
              {SECTIONS.map((s) => (
                <li key={s.id} className="tc-nav-item">
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
          <div className="tc-content">

            <div className="tc-info-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>
                Please read these Terms of Service carefully before using our platform.
                By accessing or using our services, you agree to be bound by these terms.
              </p>
            </div>

            <hr className="tc-divider" />

            {/* 01 */}
            <section id="acceptance" className="tc-section">
              <h2><span className="tc-section-num">01</span> Acceptance of Terms</h2>
              <p>
                By accessing or using our platform, creating an account, or submitting a
                listing, you agree to these Terms of Service and our Privacy Policy. If you
                do not agree, please do not use the platform.
              </p>
              <p>
                These terms apply to all users of the platform, including visitors, registered
                users, and property hosts.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 02 */}
            <section id="platform" className="tc-section">
              <h2><span className="tc-section-num">02</span> About the Platform</h2>
              <p>
                We operate a free online directory that allows property owners in Nigeria to
                list hotels, shortlets, and properties for sale, and allows visitors to browse
                and contact those owners directly.
              </p>
              <div className="tc-info-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p>
                  We are a <strong style={{ color: "rgba(255,255,255,0.7)" }}>directory platform only</strong>.
                  We do not handle bookings, payments, reservations, or any financial
                  transactions between hosts and guests. All dealings are directly between
                  the parties.
                </p>
              </div>
            </section>

            <hr className="tc-divider" />

            {/* 03 */}
            <section id="accounts" className="tc-section">
              <h2><span className="tc-section-num">03</span> User Accounts</h2>
              <p>To submit a listing, you must create a registered account. You agree to:</p>
              <ul className="tc-list">
                <li>Provide accurate, truthful, and current information when registering</li>
                <li>Keep your password secure and not share account credentials with others</li>
                <li>Notify us immediately of any unauthorised access to your account</li>
                <li>Be responsible for all activity that occurs under your account</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms,
                provide false information, or engage in abusive behaviour.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 04 */}
            <section id="listings" className="tc-section">
              <h2><span className="tc-section-num">04</span> Listing Rules</h2>
              <p>When submitting a listing, you confirm that:</p>
              <ul className="tc-list">
                <li>You are the owner of the property, or are authorised to list it on behalf of the owner</li>
                <li>All information provided — including descriptions, prices, photos, and contact details — is accurate and up to date</li>
                <li>The property is legally available for the purpose stated (rental, sale, etc.)</li>
                <li>Photos uploaded are of the actual property and are not misleading</li>
                <li>You will update or remove the listing if circumstances change</li>
              </ul>
              <p>
                Listings are reviewed by our team before being published. We reserve the right
                to reject, edit, or remove any listing that does not meet our standards.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 05 */}
            <section id="prohibited" className="tc-section">
              <h2><span className="tc-section-num">05</span> Prohibited Content</h2>
              <p>You may not submit listings or use the platform to post content that:</p>
              <ul className="tc-list danger">
                <li>Is false, misleading, or fraudulent</li>
                <li>Promotes properties that do not exist or that you have no right to list</li>
                <li>Contains offensive, discriminatory, or illegal material</li>
                <li>Violates any applicable Nigerian or international law</li>
                <li>Includes contact details belonging to someone else without their consent</li>
                <li>Constitutes spam, duplicate listings, or is submitted for the purpose of manipulating search rankings</li>
                <li>Contains malware, phishing links, or other harmful code</li>
              </ul>
              <div className="tc-warn-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <p>
                  Fraudulent listings will be reported to the relevant Nigerian authorities.
                  We take property fraud seriously and cooperate fully with law enforcement.
                </p>
              </div>
            </section>

            <hr className="tc-divider" />

            {/* 06 */}
            <section id="moderation" className="tc-section">
              <h2><span className="tc-section-num">06</span> Content Moderation</h2>
              <p>
                All listings submitted to the platform are reviewed by our moderation team
                before going live. We aim to review listings within 24 hours.
              </p>
              <p>
                We reserve the right — at our sole discretion — to approve, reject, edit, or
                remove any listing or account at any time, for any reason, with or without notice.
              </p>
              <p>
                If your listing is rejected, you will receive a notification explaining why.
                You may resubmit an updated listing after addressing the issues raised.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 07 */}
            <section id="liability" className="tc-section">
              <h2><span className="tc-section-num">07</span> Limitation of Liability</h2>
              <p>
                Our platform is provided as a directory and information service only. We are
                not a party to any transaction, booking, rental agreement, or sale between
                hosts and guests.
              </p>
              <div className="tc-warn-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <p>
                  To the fullest extent permitted by law, we are not liable for any loss,
                  damage, injury, or dispute arising from your use of the platform or from
                  interactions with other users, including hosts or guests you contact through
                  our listings.
                </p>
              </div>
              <p>
                We do not verify the physical existence, condition, or legal status of any
                listed property, nor do we guarantee the accuracy of any listing information.
                Users are responsible for conducting their own due diligence before making any
                property decision.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 08 */}
            <section id="ip" className="tc-section">
              <h2><span className="tc-section-num">08</span> Intellectual Property</h2>
              <p>
                By submitting a listing, you grant us a non-exclusive, royalty-free licence to
                display, reproduce, and distribute your listing content (including photos,
                descriptions, and contact information) on our platform and in promotional
                materials related to our services.
              </p>
              <p>
                You retain ownership of all content you submit. We will not sell your listing
                content to third parties.
              </p>
              <p>
                All platform design, code, branding, and non-user-generated content is our
                intellectual property and may not be reproduced without our written permission.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 09 */}
            <section id="termination" className="tc-section">
              <h2><span className="tc-section-num">09</span> Termination</h2>
              <p>
                You may delete your account at any time from your account settings. Upon
                deletion, your listings will be removed and your personal data will be
                processed in accordance with our Privacy Policy.
              </p>
              <p>
                We may suspend or terminate your account without notice if you violate these
                terms, engage in fraudulent behaviour, or pose a risk to other users or the
                integrity of the platform.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 10 */}
            <section id="governing" className="tc-section">
              <h2><span className="tc-section-num">10</span> Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the
                laws of the Federal Republic of Nigeria. Any disputes arising from these terms
                or your use of the platform shall be subject to the exclusive jurisdiction of
                the courts of Nigeria.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 11 */}
            <section id="changes" className="tc-section">
              <h2><span className="tc-section-num">11</span> Changes to Terms</h2>
              <p>
                We may update these Terms of Service from time to time. We will notify you
                of material changes by updating the &ldquo;Last updated&rdquo; date above and,
                where appropriate, by sending a notification to your registered email address.
              </p>
              <p>
                Continued use of the platform after changes take effect constitutes your
                acceptance of the revised terms.
              </p>
            </section>

            <hr className="tc-divider" />

            {/* 12 */}
            <section id="contact" className="tc-section">
              <h2><span className="tc-section-num">12</span> Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="tc-contact-card">
                <p>Email: <a href="mailto:contact@awayhomehq.com">contact@awayhomehq.com</a></p>
                <p>We aim to respond to all legal enquiries within 14 working days.</p>
              </div>
              <div className="tc-links">
                <Link href="/privacy" className="tc-link">Privacy Policy</Link>
                <Link href="/about" className="tc-link">About Us</Link>
                <Link href="/listings" className="tc-link">Browse Listings</Link>
              </div>
            </section>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}