"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: "", password: "", remember: false });
  const [status, setStatus]   = useState("idle"); // idle | loading | error
  const [message, setMessage] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:    form.email.trim().toLowerCase(),
          password: form.password,
          remember: form.remember,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Invalid email or password.");
      } else {
       
        router.push(data.redirectTo || "/");
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
        body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; min-height: 100vh; }

        .lg-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

        /* ── Two-column layout ── */
        .lg-main {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 80px);
        }

        /* ── Left panel – decorative ── */
        .lg-panel {
          position: relative;
          overflow: hidden;
          background: #0D1220;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
        }
        .lg-panel-bg {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80');
          background-size: cover; background-position: center;
        }
        .lg-panel-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,14,26,0.3) 0%, rgba(10,14,26,0.92) 100%);
        }
        .lg-panel-content { position: relative; z-index: 1; }
        .lg-panel-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 100px; padding: 5px 14px;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem;
        }
        .lg-panel-badge::before {
          content: ''; width: 5px; height: 5px; border-radius: 50%;
          background: #C9A84C; animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.8); }
        }
        .lg-panel h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          font-weight: 700; color: #fff; line-height: 1.2;
          margin-bottom: 1rem;
        }
        .lg-panel h2 em { font-style: italic; color: #C9A84C; }
        .lg-panel p {
          font-size: 0.875rem; color: rgba(255,255,255,0.5);
          line-height: 1.7; max-width: 360px; margin-bottom: 2rem;
        }
        .lg-stats {
          display: flex; gap: 2rem; flex-wrap: wrap;
        }
        .lg-stat .val {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; font-weight: 700; color: #C9A84C; display: block;
        }
        .lg-stat .lbl { font-size: 0.72rem; color: rgba(255,255,255,0.35); letter-spacing: 0.05em; }

        /* ── Right panel – form ── */
        .lg-form-side {
          display: flex; align-items: center; justify-content: center;
          padding: 7rem 3rem 3rem;
          background: #0A0E1A;
          position: relative; overflow: hidden;
        }
        .lg-form-side::before {
          content: ''; position: absolute;
          width: 400px; height: 400px; border-radius: 50%;
          background: rgba(201,168,76,0.04); filter: blur(80px);
          top: -100px; right: -100px; pointer-events: none;
        }

        .lg-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px;
        }

        /* breadcrumb */
        .lg-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.78rem; color: rgba(255,255,255,0.3); margin-bottom: 2rem;
        }
        .lg-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
        .lg-breadcrumb a:hover { color: #C9A84C; }
        .lg-breadcrumb span { color: rgba(255,255,255,0.15); }

        /* heading */
        .lg-icon-wrap {
          width: 56px; height: 56px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: #C9A84C; margin-bottom: 1.4rem;
        }
        .lg-card h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem; font-weight: 700; color: #fff;
          margin-bottom: 0.4rem; line-height: 1.2;
        }
        .lg-card p.lg-desc {
          font-size: 0.875rem; color: rgba(255,255,255,0.4);
          line-height: 1.6; margin-bottom: 2rem;
        }

        /* alert */
        .lg-alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 13px 14px; border-radius: 10px;
          font-size: 0.85rem; line-height: 1.5;
          margin-bottom: 1.25rem;
        }
        .lg-alert svg { flex-shrink: 0; margin-top: 1px; }
        .lg-alert.error { background: rgba(240,100,80,0.08); border: 1px solid rgba(240,100,80,0.2); color: #f46450; }

        /* form */
        .lg-form { display: flex; flex-direction: column; gap: 1.1rem; }

        .lg-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .lg-field label {
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.55); letter-spacing: 0.04em;
        }
        .lg-field .label-row {
          display: flex; justify-content: space-between; align-items: center;
        }
        .lg-field .label-row a {
          font-size: 0.78rem; color: #C9A84C; text-decoration: none; font-weight: 500;
        }
        .lg-field .label-row a:hover { text-decoration: underline; }

        .lg-input-wrap { position: relative; }
        .lg-input-wrap .field-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.28); pointer-events: none;
        }
        .lg-input-wrap .toggle-icon {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.28); cursor: pointer;
          background: none; border: none;
          display: flex; align-items: center; padding: 0;
          transition: color 0.2s;
        }
        .lg-input-wrap .toggle-icon:hover { color: #C9A84C; }

        .lg-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 14px 13px 42px;
          color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .lg-input.with-toggle { padding-right: 42px; }
        .lg-input::placeholder { color: rgba(255,255,255,0.22); }
        .lg-input:focus {
          border-color: rgba(201,168,76,0.55);
          background: rgba(255,255,255,0.07);
        }
        .lg-input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* remember me */
        .lg-check {
          display: flex; align-items: center; gap: 9px;
          cursor: pointer; user-select: none;
        }
        .lg-check input[type="checkbox"] {
          width: 16px; height: 16px; flex-shrink: 0;
          accent-color: #C9A84C; cursor: pointer;
        }
        .lg-check span { font-size: 0.82rem; color: rgba(255,255,255,0.45); }

        /* submit */
        .lg-btn {
          width: 100%;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A; font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 0.95rem;
          padding: 14px; border-radius: 10px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 0.25rem;
        }
        .lg-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.35);
        }
        .lg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(10,14,26,0.3);
          border-top-color: #0A0E1A; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* divider */
        .lg-divider { display: flex; align-items: center; gap: 12px; margin: 1.25rem 0; }
        .lg-divider span { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .lg-divider small { font-size: 0.75rem; color: rgba(255,255,255,0.25); }

        /* social buttons */
        .lg-socials { display: flex; flex-direction: column; gap: 0.75rem; }
        .lg-social-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 12px 16px;
          color: rgba(255,255,255,0.7); font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 500; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-decoration: none;
        }
        .lg-social-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }

        .lg-signup {
          text-align: center; font-size: 0.875rem;
          color: rgba(255,255,255,0.4); margin-top: 1.5rem;
        }
        .lg-signup a { color: #C9A84C; text-decoration: none; font-weight: 600; }
        .lg-signup a:hover { text-decoration: underline; }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .lg-main { grid-template-columns: 1fr; }
          .lg-panel { display: none; }
          .lg-form-side { padding: 7rem 1.5rem 3rem; }
        }
      `}</style>

      <div className="lg-page">
        <Navbar />

        <div className="lg-main">

          {/* ── Left decorative panel ── */}
          <div className="lg-panel">
            <div className="lg-panel-bg" />
            <div className="lg-panel-overlay" />
            <div className="lg-panel-content">
              <div className="lg-panel-badge">Nigeria's Property Directory</div>
              <h2>Your <em>Perfect</em> Stay or Investment Awaits</h2>
              <p>
                Access thousands of verified hotels, apartments, shortlets, and properties for sale.
                Connect directly with owners — no booking fees, no commissions.
              </p>
              <div className="lg-stats">
                {[
                  { val: "2,750+", lbl: "Listed Properties" },
                  { val: "12",     lbl: "States Covered"    },
                  { val: "850+",   lbl: "Verified Agents"   },
                ].map((s) => (
                  <div className="lg-stat" key={s.lbl}>
                    <span className="val">{s.val}</span>
                    <span className="lbl">{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="lg-form-side">
            <div className="lg-card">

              {/* Breadcrumb */}
              <div className="lg-breadcrumb">
                <Link href="/">Home</Link>
                <span>›</span>
                <span style={{ color: "rgba(255,255,255,0.55)" }}>Login</span>
              </div>

              {/* Icon + heading */}
              <div className="lg-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="26" height="26">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h1>Welcome Back</h1>
              <p className="lg-desc">Sign in to your account to continue browsing and managing your listings.</p>

              {/* Error alert */}
              {status === "error" && (
                <div className="lg-alert error">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {message}
                </div>
              )}

              {/* Form */}
              <form className="lg-form" onSubmit={handleSubmit}>

                {/* Email */}
                <div className="lg-field">
                  <label htmlFor="email">Email Address</label>
                  <div className="lg-input-wrap">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      id="email" name="email" type="email"
                      className="lg-input"
                      placeholder="you@example.com"
                      value={form.email} onChange={handleChange}
                      required autoComplete="email"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="lg-field">
                  <div className="label-row">
                    <label htmlFor="password">Password</label>
                    <Link href="/forgot-password">Forgot password?</Link>
                  </div>
                  <div className="lg-input-wrap">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <input
                      id="password" name="password"
                      type={showPass ? "text" : "password"}
                      className="lg-input with-toggle"
                      placeholder="Enter your password"
                      value={form.password} onChange={handleChange}
                      required autoComplete="current-password"
                      disabled={status === "loading"}
                    />
                    <button type="button" className="toggle-icon" onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                      {showPass
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="lg-check">
                  <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                  <span>Keep me signed in for 30 days</span>
                </label>

                {/* Submit */}
                <button type="submit" className="lg-btn" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <><span className="spinner" /> Signing In...</>
                  ) : (
                    <>
                      Sign In
                    </>
                  )}
                </button>
              </form>
              <p className="lg-signup">
                Don't have an account?{" "}
                <Link href="/signup">Register</Link>
              </p>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}