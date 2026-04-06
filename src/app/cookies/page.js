"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const lastUpdated = "12 March 2025";

const cookieTypes = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    name: "Strictly Necessary",
    badge: "Always active",
    badgeColor: { bg: "rgba(93,219,144,0.12)", color: "#5ddb90", border: "rgba(93,219,144,0.22)" },
    desc:
      "These cookies are essential for the website to function correctly. They enable core features like page navigation, secure areas, and remembering your session. The website cannot operate properly without them.",
    examples: ["Session authentication token", "CSRF security token", "Cookie consent preference", "Load balancer routing"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    name: "Analytics & Performance",
    badge: "Optional",
    badgeColor: { bg: "rgba(126,184,247,0.12)", color: "#7eb8f7", border: "rgba(126,184,247,0.22)" },
    desc:
      "These cookies help us understand how visitors use AwayHome — which pages are most popular, how long people spend browsing, and where they come from. All data is aggregated and anonymous.",
    examples: ["Page view counts", "Session duration tracking", "Traffic source attribution", "Search query analytics"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
      </svg>
    ),
    name: "Functional",
    badge: "Optional",
    badgeColor: { bg: "rgba(126,184,247,0.12)", color: "#7eb8f7", border: "rgba(126,184,247,0.22)" },
    desc:
      "Functional cookies remember your preferences to give you a more personalised experience — such as your preferred property type, saved searches, or display settings between visits.",
    examples: ["Saved search filters", "Preferred property type", "Recently viewed listings", "Display language"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    name: "Marketing & Targeting",
    badge: "Optional",
    badgeColor: { bg: "rgba(126,184,247,0.12)", color: "#7eb8f7", border: "rgba(126,184,247,0.22)" },
    desc:
      "We do not currently run advertising on AwayHome. If this changes in the future, we will update this policy and ask for your explicit consent before placing any marketing cookies.",
    examples: ["Not currently in use"],
  },
];

const cookieTable = [
  { name: "_aw_session", type: "Necessary", duration: "Session", purpose: "Maintains your login session securely across pages." },
  { name: "_aw_csrf", type: "Necessary", duration: "Session", purpose: "Prevents cross-site request forgery attacks on forms." },
  { name: "_aw_consent", type: "Necessary", duration: "12 months", purpose: "Stores your cookie consent preferences." },
  { name: "_aw_pref", type: "Functional", duration: "6 months", purpose: "Remembers your property type filter and display settings." },
  { name: "_aw_searches", type: "Functional", duration: "30 days", purpose: "Saves your recent searches for quick access." },
  { name: "_ga", type: "Analytics", duration: "2 years", purpose: "Google Analytics — distinguishes unique users." },
  { name: "_ga_*", type: "Analytics", duration: "2 years", purpose: "Google Analytics — persists session state." },
  { name: "_aw_perf", type: "Analytics", duration: "90 days", purpose: "Internal performance monitoring — page load times." },
];

const sections = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies?",
    body: `Cookies are small text files that a website places on your device (computer, phone, or tablet) when you visit. They are widely used to make websites work efficiently, remember your preferences, and provide information to the site's owners.

Cookies are not harmful and cannot access other files on your device. They do not contain personal information on their own — any data associated with a cookie is stored securely on our servers.`,
  },
  {
    id: "how-we-use",
    title: "How AwayHome Uses Cookies",
    body: `We use cookies to keep AwayHome fast, secure, and easy to use. Specifically, we use them to:

• Keep you logged in during your browsing session
• Remember your search preferences and recently viewed listings
• Understand how visitors navigate the site so we can improve it
• Protect the site from security threats like CSRF attacks

We do not use cookies to serve advertisements, and we do not sell cookie data to any third party.`,
  },
  {
    id: "third-party",
    title: "Third-Party Cookies",
    body: `Some cookies on AwayHome are set by third-party services we use to operate the platform:

Google Analytics — We use Google Analytics to understand aggregate traffic patterns. Google may set cookies on your device. You can opt out of Google Analytics across all websites by installing the Google Analytics Opt-out Browser Add-on.

No other third-party advertising or tracking services currently place cookies on AwayHome.`,
  },
  {
    id: "managing",
    title: "Managing & Disabling Cookies",
    body: `You are in control. You can manage your cookie preferences in several ways:

1. Cookie consent banner — When you first visit AwayHome, you will see a banner that lets you accept or decline optional cookies. You can change your choice at any time by clicking "Cookie Settings" in the footer.

2. Browser settings — All modern browsers let you view, delete, and block cookies. Note that blocking strictly necessary cookies may prevent parts of the site from working correctly.

3. Third-party opt-outs — For Google Analytics, visit tools.google.com/dlpage/gaoptout.

Clearing cookies will log you out of any active session and reset your saved preferences.`,
  },
  {
    id: "retention",
    title: "How Long We Keep Cookies",
    body: `Cookie lifetimes vary by purpose. Session cookies are deleted automatically when you close your browser. Persistent cookies remain on your device until they expire or you delete them. The specific durations for each cookie we use are listed in the cookie table above.`,
  },
  {
    id: "updates",
    title: "Updates to This Policy",
    body: `We may update this Cookie Policy from time to time to reflect changes to our technology or applicable law. When we make significant changes, we will notify you via a banner on the site and update the "Last updated" date at the top of this page. We encourage you to review this policy periodically.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    body: `If you have any questions about how we use cookies, please get in touch:`,
    hasContact: true,
  },
];

export default function CookiesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #0A0E1A;
          color: #fff;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .cookie-hero {
          position: relative;
          padding: 9rem 2rem 5rem;
          text-align: center;
          overflow: hidden;
        }
        .cookie-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 55% at 50% 0%, rgba(201,168,76,0.11) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 1.5rem;
        }
        .cookie-hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.12;
          margin-bottom: 1rem;
        }
        .cookie-hero h1 em {
          font-style: italic;
          color: #C9A84C;
        }
        .cookie-hero-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.68);
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto 1.5rem;
        }
        .last-updated {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.38);
        }
        .last-updated svg { opacity: 0.5; }

        /* ── Layout ── */
        .policy-section { padding: 1.5rem 0 6rem; }
        .container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .policy-grid {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* ── Sidebar TOC ── */
        .toc {
          position: sticky;
          top: 6rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem;
        }
        .toc-title {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-bottom: 0.85rem;
        }
        .toc a {
          display: block;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          padding: 5px 8px;
          border-radius: 7px;
          transition: background 0.18s, color 0.18s;
          line-height: 1.45;
          margin-bottom: 2px;
        }
        .toc a:hover {
          background: rgba(201,168,76,0.08);
          color: #C9A84C;
        }

        /* ── Main content ── */
        .policy-body { min-width: 0; }

        /* Cookie type cards */
        .cookie-types-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.1rem;
          margin-bottom: 3rem;
        }
        .cookie-type-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 1.4rem;
          transition: border-color 0.22s;
        }
        .cookie-type-card:hover { border-color: rgba(201,168,76,0.2); }
        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }
        .card-icon-name {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .type-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          background: rgba(201,168,76,0.1);
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
        }
        .type-name {
          font-size: 0.97rem;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 1.3;
        }
        .type-badge {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 100px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .type-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .examples-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.32);
          margin-bottom: 0.45rem;
        }
        .examples-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .example-pill {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 3px 9px;
        }

        /* ── Cookie table ── */
        .table-wrap {
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 3rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
        }
        thead tr {
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        thead th {
          padding: 12px 16px;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          white-space: nowrap;
        }
        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: rgba(255,255,255,0.025); }
        tbody td {
          padding: 12px 16px;
          color: rgba(255,255,255,0.75);
          vertical-align: top;
          line-height: 1.55;
        }
        .td-name {
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          color: #C9A84C;
          white-space: nowrap;
        }
        .td-type {
          white-space: nowrap;
        }
        .type-chip {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 9px;
          border-radius: 5px;
          display: inline-block;
        }
        .chip-necessary { background: rgba(93,219,144,0.1); color: #5ddb90; }
        .chip-functional { background: rgba(126,184,247,0.1); color: #7eb8f7; }
        .chip-analytics  { background: rgba(212,125,219,0.1); color: #d47ddb; }

        /* ── Policy sections ── */
        .policy-section-block {
          margin-bottom: 2.75rem;
          scroll-margin-top: 7rem;
        }
        .section-divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin-bottom: 2.75rem;
        }
        .block-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 1rem;
          line-height: 1.25;
        }
        .block-body {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.62);
          line-height: 1.82;
          white-space: pre-line;
        }
        .block-body strong { color: #FFFFFF; font-weight: 600; }

        /* Section label above types/table */
        .subsection-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 1.1rem;
        }

        /* Contact card */
        .contact-strip {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1.25rem;
        }
        .contact-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 0.85rem;
          color: #FFFFFF;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .contact-chip svg { color: #C9A84C; flex-shrink: 0; }
        .contact-chip:hover {
          background: rgba(201,168,76,0.08);
          border-color: rgba(201,168,76,0.25);
        }

        /* ── Consent banner preview ── */
        .banner-preview {
          background: #111827;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 3rem;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .banner-text { flex: 1; min-width: 200px; }
        .banner-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 0.4rem;
        }
        .banner-desc {
          font-size: 0.84rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.65;
        }
        .banner-actions {
          display: flex;
          gap: 0.65rem;
          align-items: center;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .btn-accept {
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A;
          font-weight: 700;
          font-size: 0.82rem;
          padding: 9px 18px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-manage {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.82rem;
          padding: 9px 18px;
          border-radius: 9px;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-reject {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.38);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          white-space: nowrap;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .policy-grid { grid-template-columns: 1fr; }
          .toc { position: static; margin-bottom: 1.5rem; }
          .cookie-types-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 540px) {
          .cookie-hero { padding: 7rem 1.25rem 3.5rem; }
          .banner-preview { flex-direction: column; }
        }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <div className="cookie-hero">
        <div className="hero-eyebrow">Legal &amp; Privacy</div>
        <h1>Cookie <em>Policy</em></h1>
        <p className="cookie-hero-sub">
          We believe in transparency. This page explains exactly what cookies AwayHome uses,
          why we use them, and how you can control them.
        </p>
        <span className="last-updated">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Last updated: {lastUpdated}
        </span>
      </div>

      {/* ── Main ── */}
      <section className="policy-section">
        <div className="container">
          <div className="policy-grid">

            {/* Sidebar TOC */}
            <aside className="toc">
              <div className="toc-title">On this page</div>
              <a href="#what-are-cookies">What are cookies?</a>
              <a href="#cookie-types">Types of cookies</a>
              <a href="#cookie-table">Cookie reference</a>
              <a href="#how-we-use">How we use them</a>
              <a href="#third-party">Third-party cookies</a>
              <a href="#managing">Managing cookies</a>
              <a href="#consent-banner">Consent banner</a>
              <a href="#retention">Retention periods</a>
              <a href="#updates">Policy updates</a>
              <a href="#contact">Contact us</a>
            </aside>

            {/* Body */}
            <div className="policy-body">

              {/* What are cookies */}
              <div className="policy-section-block" id="what-are-cookies">
                <h2 className="block-heading">What Are Cookies?</h2>
                <p className="block-body">
                  Cookies are small text files placed on your device when you visit a website. They are universally used to make sites work efficiently, remember your preferences, and give owners insight into how their platform is used.{"\n\n"}
                  Cookies are <strong>not harmful</strong> and cannot access other files on your device. They do not contain your personal information — any data linked to a cookie is stored securely on our servers and never sold to third parties.
                </p>
              </div>

              <div className="section-divider" />

              {/* Types */}
              <div className="policy-section-block" id="cookie-types">
                <h2 className="block-heading">Types of Cookies We Use</h2>
                <p className="block-body" style={{ marginBottom: "1.5rem" }}>
                  We group the cookies on AwayHome into four categories based on their purpose.
                </p>
                <div className="cookie-types-grid">
                  {cookieTypes.map((ct) => (
                    <div className="cookie-type-card" key={ct.name}>
                      <div className="card-top">
                        <div className="card-icon-name">
                          <div className="type-icon">{ct.icon}</div>
                          <div className="type-name">{ct.name}</div>
                        </div>
                        <span
                          className="type-badge"
                          style={{
                            background: ct.badgeColor.bg,
                            color: ct.badgeColor.color,
                            border: `1px solid ${ct.badgeColor.border}`,
                          }}
                        >
                          {ct.badge}
                        </span>
                      </div>
                      <p className="type-desc">{ct.desc}</p>
                      <div className="examples-label">Examples</div>
                      <div className="examples-list">
                        {ct.examples.map((ex) => (
                          <span className="example-pill" key={ex}>{ex}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-divider" />

              {/* Cookie table */}
              <div className="policy-section-block" id="cookie-table">
                <h2 className="block-heading">Cookie Reference Table</h2>
                <p className="block-body" style={{ marginBottom: "1.5rem" }}>
                  A full list of every cookie currently set by AwayHome, what it does, and how long it lasts.
                </p>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Cookie name</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieTable.map((row) => (
                        <tr key={row.name}>
                          <td className="td-name">{row.name}</td>
                          <td className="td-type">
                            <span className={`type-chip chip-${row.type.toLowerCase().split(" ")[0]}`}>
                              {row.type}
                            </span>
                          </td>
                          <td style={{ color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{row.duration}</td>
                          <td>{row.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="section-divider" />

              {/* Remaining text sections */}
              {sections.filter((s) => !["what-are-cookies"].includes(s.id)).map((s) => (
                <div key={s.id}>
                  <div className="policy-section-block" id={s.id}>
                    <h2 className="block-heading">{s.title}</h2>

                    {s.id === "managing" && (
                      <div style={{ marginBottom: "1.25rem" }}>
                        <p className="block-body" style={{ marginBottom: "1.1rem" }}>
                          You are in control. You can manage your cookie preferences in several ways:
                        </p>
                        {[
                          { n: "01", t: "Cookie consent banner", d: "When you first visit AwayHome you will see a banner where you can accept or decline optional cookies. You can change your choice at any time by clicking 'Cookie Settings' in the footer." },
                          { n: "02", t: "Browser settings", d: "All modern browsers let you view, delete, and block cookies. Note that blocking strictly necessary cookies may prevent parts of the site from working correctly." },
                          { n: "03", t: "Third-party opt-outs", d: "For Google Analytics, visit tools.google.com/dlpage/gaoptout. Clearing cookies will log you out of any active session and reset your saved preferences." },
                        ].map((step) => (
                          <div key={step.n} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                            <div style={{ minWidth: "36px", height: "36px", borderRadius: "9px", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: "700", color: "#C9A84C", letterSpacing: "0.04em", marginTop: "1px" }}>{step.n}</div>
                            <div>
                              <div style={{ fontSize: "0.88rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "3px" }}>{step.t}</div>
                              <div style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.55)", lineHeight: "1.68" }}>{step.d}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {s.id === "consent-banner" && (
                      <div style={{ marginBottom: "1.25rem" }}>
                        <p className="block-body" style={{ marginBottom: "1.25rem" }}>
                          When you first arrive on AwayHome, you will see a consent banner similar to the one below. Only strictly necessary cookies are active until you make a choice.
                        </p>
                        <div className="banner-preview">
                          <div className="banner-text">
                            <div className="banner-label">🍪 Cookie preferences</div>
                            <p className="banner-desc">
                              We use cookies to keep AwayHome secure, remember your preferences, and understand how you use the site. You can choose which categories to allow.
                            </p>
                          </div>
                          <div className="banner-actions">
                            <button className="btn-accept">Accept all</button>
                            <button className="btn-manage">Manage</button>
                            <button className="btn-reject">Reject optional</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {s.id !== "managing" && s.id !== "consent-banner" && !s.hasContact && (
                      <p className="block-body">{s.body}</p>
                    )}

                    {s.hasContact && (
                      <>
                        <p className="block-body" style={{ marginBottom: "1.1rem" }}>
                          If you have any questions about how we use cookies, please reach out — we're happy to help.
                        </p>
                        <div className="contact-strip">
                          <a href="mailto:privacy@awayhome.ng" className="contact-chip">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                            privacy@awayhome.ng
                          </a>
                          <Link href="/contact" className="contact-chip">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            Contact page
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="section-divider" />
                </div>
              ))}

              {/* Related links */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Contact Us", href: "/contact" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#C9A84C",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}