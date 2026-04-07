"use client";
import React, { use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
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

        /* ── Page Hero ── */
        .contact-hero {
          position: relative;
          padding: 9rem 2rem 5rem;
          text-align: center;
          overflow: hidden;
        }
        .contact-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .contact-hero-eyebrow {
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
        .contact-hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.12;
          margin-bottom: 1.1rem;
        }
        .contact-hero h1 em {
          font-style: italic;
          color: #C9A84C;
        }
        .contact-hero-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.72);
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto;
        }

        /* ── Layout ── */
        .contact-section {
          padding: 2rem 0 6rem;
        }
        .container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.55fr;
          gap: 2.5rem;
          align-items: start;
        }

        /* ── Info Panel ── */
        .info-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .info-panel-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.65rem;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }
        .info-panel-desc {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.68);
          line-height: 1.72;
          margin-bottom: 0.5rem;
        }

        /* Contact Info Cards */
        .contact-info-card {
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 1.15rem 1.3rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: border-color 0.22s, background 0.22s;
        }
        .contact-info-card:hover {
          background: rgba(201,168,76,0.06);
          border-color: rgba(201,168,76,0.25);
        }
        .info-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          background: rgba(201,168,76,0.12);
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
        }
        .info-card-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.42);
          margin-bottom: 3px;
        }
        .info-card-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 1.4;
        }
        .info-card-value a {
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.18s;
        }
        .info-card-value a:hover { color: #C9A84C; }
        .info-card-note {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.42);
          margin-top: 2px;
        }

        /* Social row */
        .social-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding-top: 0.5rem;
        }
        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 8px 14px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #FFFFFF;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .social-btn:hover {
          background: rgba(201,168,76,0.1);
          border-color: rgba(201,168,76,0.3);
          color: #C9A84C;
        }

        /* ── Form Card ── */
        .form-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem;
        }
        .form-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.35rem;
        }
        .form-card-sub {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.52);
          margin-bottom: 1.75rem;
          line-height: 1.6;
        }

        /* Form fields */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 1.1rem;
        }
        .field.full { grid-column: 1 / -1; }
        label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.03em;
        }
        .required-dot {
          color: #C9A84C;
          margin-left: 3px;
        }
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        select,
        textarea {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 10px;
          padding: 12px 15px;
          color: #FFFFFF;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }
        input::placeholder,
        textarea::placeholder { color: rgba(255,255,255,0.28); }
        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(201,168,76,0.55);
          background: rgba(255,255,255,0.085);
        }
        select { cursor: pointer; }
        select option { background: #111827; color: #fff; }
        textarea { resize: vertical; min-height: 130px; line-height: 1.65; }

        /* Subject tabs */
        .subject-tabs {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 1.1rem;
        }
        .subject-tab {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          transition: all 0.18s;
        }
        .subject-tab:hover,
        .subject-tab.active {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.35);
          color: #C9A84C;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 14px 28px;
          border-radius: 11px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 0.5rem;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.35);
        }
        .submit-btn:active { transform: translateY(0); }

        .form-note {
          text-align: center;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.32);
          margin-top: 0.9rem;
          line-height: 1.6;
        }

        /* ── FAQ strip ── */
        .faq-section {
          background: #0D1220;
          padding: 5rem 0;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        .faq-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.5rem;
        }
        .faq-q {
          font-size: 0.95rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.6rem;
          line-height: 1.4;
        }
        .faq-a {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.52);
          line-height: 1.7;
        }
        .faq-a a {
          color: #C9A84C;
          text-decoration: none;
        }
        .faq-a a:hover { text-decoration: underline; }

        /* Section helpers */
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
          font-size: clamp(1.7rem, 2.8vw, 2.3rem);
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }
        .section-sub {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          line-height: 1.7;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
          .faq-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 580px) {
          .faq-grid { grid-template-columns: 1fr; }
          .form-card { padding: 1.75rem 1.25rem; }
          .contact-hero { padding: 7rem 1.25rem 3.5rem; }
        }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <div className="contact-hero">
        <div className="contact-hero-eyebrow">We're here to help</div>
        <h1>Get in <em>Touch</em></h1>
        <p className="contact-hero-sub">
          Have a question about a listing, need help posting your property, or just want to say hello?
          Our team is happy to assist as soon as possible.
        </p>
      </div>

      {/* ── Main content ── */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">

            {/* Info Panel */}
            <div className="info-panel">
              <div>
                <h2 className="info-panel-heading">Contact Information</h2>
                <p className="info-panel-desc">
                  Reach us through any of the channels below, or fill in the form and we'll get back to you promptly.
                </p>
              </div>

              <div className="contact-info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className="info-card-label">Phone / WhatsApp</div>
                  <div className="info-card-value">
                    <a href="tel:+2348012345678">+234 801 234 5678</a>
                  </div>
                  <div className="info-card-note">Mon – Fri, 8 am – 6 pm WAT</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className="info-card-label">Email</div>
                  <div className="info-card-value">
                    <a href="mailto:contact@awayhomehq.com">contact@awayhomehq.com</a>
                  </div>
                  <div className="info-card-note">We reply immediately</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="info-card-label">Office</div>
                  <div className="info-card-value">12 Akin Adesola St, Victoria Island</div>
                  <div className="info-card-note">Lagos, Nigeria</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="21" height="21">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <div className="info-card-label">Business Hours</div>
                  <div className="info-card-value">Monday – Friday: 8 am – 6 pm</div>
                  <div className="info-card-note">Saturday: 10 am – 3 pm · Sunday: Closed</div>
                </div>
              </div>

              <div>
                <div className="info-card-label" style={{ marginBottom: "0.6rem" }}>Follow us</div>
                <div className="social-row">
                  {[
                    {
                      label: "Twitter / X",
                      href: "https://twitter.com/awayhomehq.com",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      ),
                    },
                    {
                      label: "Instagram",
                      href: "https://instagram.com/awayhomehq.com",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <circle cx="12" cy="12" r="4"/>
                          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                        </svg>
                      ),
                    },
                    {
                      label: "Facebook",
                      href: "https://facebook.com/awayhomehq.com",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                        </svg>
                      ),
                    },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn">
                      {s.icon}
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="form-card">
              <h2 className="form-card-title">Send Us a Message</h2>
              <p className="form-card-sub">Fill in the details below and we'll get back to you shortly.</p>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>What is this about?</label>
                <div className="subject-tabs">
                  {["General enquiry", "List my property", "Report a listing", "Partnership", "Other"].map((t) => (
                    <button key={t} className={`subject-tab${t === "General enquiry" ? " active" : ""}`}>{t}</button>
                  ))}
                </div>
              </div>

              <form
  onSubmit={async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      state: formData.get("state"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Message sent ✅");
        e.target.reset();
      } else {
        alert("Failed to send ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  }}
>
                <div className="form-row">
                  <div className="field">
                    <label>First name <span className="required-dot">*</span></label>
                    <input name="firstName" type="text" placeholder="Emeka" required />
                  </div>
                  <div className="field">
                    <label>Last name <span className="required-dot">*</span></label>
                    <input name="lastName" type="text" placeholder="Okafor" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label>Email address <span className="required-dot">*</span></label>
                    <input name="email" type="email" placeholder="emeka@email.com" required />
                  </div>
                  <div className="field">
                    <label>Phone number</label>
                    <input name="phone" type="tel" placeholder="+234 800 000 0000" />
                  </div>
                </div>

                <div className="field">
                  <label>State / City</label>
                  <select name="state">
                    <option value="">Select your state</option>
                    {["Lagos", "Abuja (FCT)", "Rivers", "Kano", "Ogun", "Oyo", "Delta", "Anambra", "Enugu", "Kaduna", "Other"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Message <span className="required-dot">*</span></label>
                  <textarea name="message" placeholder="Tell us how we can help you..." required />
                </div>

                <button type="submit" className="submit-btn">
                  Send Message
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                  </svg>
                </button>
              </form>

              <p className="form-note">
                By submitting this form you agree to our{" "}
                <Link href="/privacy" style={{ color: "rgba(201,168,76,0.7)", textDecoration: "none" }}>Privacy Policy</Link>.
                We never share your information with third parties.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <p className="section-eyebrow">Quick answers</p>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Can't find what you're looking for? Send us a message above.
            </p>
          </div>
          <div className="faq-grid">
            {[
              {
                q: "Is listing my property really free?",
                a: "Yes — 100% free. We do not charge owners, agents, or hotels to appear on AwayHome. No commissions, no listing fees.",
              },
              {
                q: "How do I get my property verified?",
                a: "After submitting your listing, our team reviews it within 48 hours. We may call you to confirm details. Verified listings get a badge.",
              },
              {
                q: "Can I list multiple properties?",
                a: "Absolutely. Agents and developers can manage multiple listings from a single account. Contact us to set up an agency profile.",
              },
              {
                q: "Does AwayHome handle bookings or payments?",
                a: "No — we connect you directly with owners. All bookings, payments, and negotiations happen between you and the property owner.",
              },
              {
                q: "How do I report an incorrect or suspicious listing?",
                a: <>Use the 'Report a listing' option above or email <a href="mailto:contact@awayhomehq.com">contact@awayhomehq.com</a>. We review all reports within 24 hours.</>,
              },
              {
                q: "Which states are currently covered?",
                a: "We currently list properties across Lagos, Abuja, Rivers, Kano, Ogun, Oyo, Delta, Anambra, Enugu, Kaduna, Plateau, and Cross River.",
              },
            ].map((f, i) => (
              <div className="faq-card" key={i}>
                <p className="faq-q">{f.q}</p>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}