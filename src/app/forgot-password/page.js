"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState("idle"); // idle | loading | success | error
  const [message, setMessage]   = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      } else {
        setStatus("success");
        setMessage(data.message || "Reset link sent! Check your inbox.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #0A0E1A;
          color: #fff;
          min-height: 100vh;
        }

        .fp-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0A0E1A;
        }

        .fp-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7rem 1.5rem 4rem;
          position: relative;
          overflow: hidden;
        }

        /* decorative blobs */
        .fp-main::before,
        .fp-main::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .fp-main::before {
          width: 500px;
          height: 500px;
          background: rgba(201,168,76,0.06);
          top: -100px;
          right: -100px;
        }
        .fp-main::after {
          width: 400px;
          height: 400px;
          background: rgba(126,184,247,0.04);
          bottom: -80px;
          left: -80px;
        }

        .fp-card {
          position: relative;
          z-index: 1;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.75rem 2.5rem;
          width: 100%;
          max-width: 460px;
        }

        /* top icon */
        .fp-icon-wrap {
          width: 60px;
          height: 60px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
          margin-bottom: 1.5rem;
        }

        .fp-card h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .fp-card p.fp-desc {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
          margin-bottom: 2rem;
        }

        /* form */
        .fp-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .fp-field { display: flex; flex-direction: column; gap: 0.45rem; }

        .fp-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.04em;
        }

        .fp-input-wrap {
          position: relative;
        }
        .fp-input-wrap svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }
        .fp-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 14px 13px 42px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .fp-input::placeholder { color: rgba(255,255,255,0.25); }
        .fp-input:focus {
          border-color: rgba(201,168,76,0.55);
          background: rgba(255,255,255,0.07);
        }
        .fp-input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* submit button */
        .fp-btn {
          width: 100%;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 14px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 0.25rem;
        }
        .fp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.35);
        }
        .fp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* spinner */
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(10,14,26,0.3);
          border-top-color: #0A0E1A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* alert banners */
        .fp-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 13px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .fp-alert svg { flex-shrink: 0; margin-top: 1px; }
        .fp-alert.success {
          background: rgba(93,219,144,0.08);
          border: 1px solid rgba(93,219,144,0.2);
          color: #5ddb90;
        }
        .fp-alert.error {
          background: rgba(240,100,80,0.08);
          border: 1px solid rgba(240,100,80,0.2);
          color: #f46450;
        }

        /* divider */
        .fp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0.25rem 0;
        }
        .fp-divider span {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .fp-divider small {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
        }

        /* back to login */
        .fp-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }
        .fp-back:hover { color: #C9A84C; }
        .fp-back svg { transition: transform 0.2s; }
        .fp-back:hover svg { transform: translateX(-3px); }

        /* success state */
        .fp-success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 1rem 0;
        }
        .fp-success-icon {
          width: 72px;
          height: 72px;
          background: rgba(93,219,144,0.1);
          border: 1px solid rgba(93,219,144,0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5ddb90;
        }
        .fp-success-state h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
        }
        .fp-success-state p {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
          max-width: 320px;
        }
        .fp-success-state p strong { color: #C9A84C; }

        /* breadcrumb */
        .fp-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1.75rem;
        }
        .fp-breadcrumb a {
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .fp-breadcrumb a:hover { color: #C9A84C; }
        .fp-breadcrumb span { color: rgba(255,255,255,0.15); }

        @media (max-width: 500px) {
          .fp-card { padding: 2rem 1.5rem; border-radius: 16px; }
        }
      `}</style>

      <div className="fp-page">
        <Navbar />

        <main className="fp-main">
          <div className="fp-card">

            {/* Breadcrumb */}
            <div className="fp-breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <Link href="/login">Login</Link>
              <span>›</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Forgot Password</span>
            </div>

            {/* ── Success State ── */}
            {status === "success" ? (
              <div className="fp-success-state">
                <div className="fp-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2>Check Your Inbox</h2>
                <p>
                  If an account exists for <strong>{email}</strong>, a password reset link has been sent. It expires in <strong style={{ color: "rgba(255,255,255,0.6)" }}>1 hour</strong>.
                </p>
                <p>Don't see it? Check your spam folder.</p>
                <Link href="/login" className="fp-back" style={{ marginTop: "0.5rem" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="fp-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="28" height="28">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>

                <h1>Forgot Password?</h1>
                <p className="fp-desc">
                  No worries. Enter your registered email address and we'll send you a secure link to reset your password.
                </p>

                {/* Error Alert */}
                {status === "error" && (
                  <div className="fp-alert error" style={{ marginBottom: "1.25rem" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {message}
                  </div>
                )}

                {/* Form */}
                <form className="fp-form" onSubmit={handleSubmit}>
                  <div className="fp-field">
                    <label htmlFor="email">Email Address</label>
                    <div className="fp-input-wrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <input
                        id="email"
                        type="email"
                        className="fp-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="fp-btn"
                    disabled={status === "loading" || !email.trim()}
                  >
                    {status === "loading" ? (
                      <>
                        <span className="spinner" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>

                <div className="fp-divider" style={{ marginTop: "1.75rem" }}>
                  <span /><small>or</small><span />
                </div>

                <Link href="/login" className="fp-back" style={{ marginTop: "0.25rem" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Login
                </Link>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}