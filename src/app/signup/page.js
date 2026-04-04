"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user", // user | agent | hotel
    agree: false,
  });
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  // Basic password strength
  function strength(pw) {
    let s = 0;
    if (pw.length >= 8)          s++;
    if (/[A-Z]/.test(pw))        s++;
    if (/[0-9]/.test(pw))        s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0-4
  }
  const pw = form.password;
  const pwStrength = strength(pw);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#f46450", "#f0a45d", "#C9A84C", "#5ddb90"];

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (!form.agree) {
      setStatus("error");
      setMessage("Please accept the terms and conditions.");
      return;
    }
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName:  form.lastName.trim(),
          email:     form.email.trim().toLowerCase(),
          phone:     form.phone.trim(),
          password:  form.password,
          role:      form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      } else {
        setStatus("success");
        setMessage(data.message || "Account created! Please check your email to verify.");
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

        .su-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

        .su-main {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 7rem 1.5rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .su-main::before, .su-main::after {
          content: ''; position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none;
        }
        .su-main::before {
          width: 600px; height: 600px;
          background: rgba(201,168,76,0.05);
          top: -150px; right: -120px;
        }
        .su-main::after {
          width: 400px; height: 400px;
          background: rgba(126,184,247,0.04);
          bottom: -80px; left: -80px;
        }

        .su-card {
          position: relative; z-index: 1;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.75rem 2.5rem;
          width: 100%; max-width: 560px;
        }

        /* header */
        .su-icon-wrap {
          width: 60px; height: 60px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: #C9A84C; margin-bottom: 1.5rem;
        }
        .su-card h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem; font-weight: 700; color: #fff;
          margin-bottom: 0.4rem; line-height: 1.2;
        }
        .su-card p.su-desc {
          font-size: 0.875rem; color: rgba(255,255,255,0.45); line-height: 1.6;
          margin-bottom: 1.75rem;
        }

        /* role tabs */
        .role-tabs {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem; margin-bottom: 1.75rem;
        }
        .role-tab {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .role-tab svg { color: rgba(255,255,255,0.4); transition: color 0.2s; }
        .role-tab span { font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.45); transition: color 0.2s; }
        .role-tab small { font-size: 0.7rem; color: rgba(255,255,255,0.25); }
        .role-tab.active {
          background: rgba(201,168,76,0.1);
          border-color: rgba(201,168,76,0.4);
        }
        .role-tab.active svg { color: #C9A84C; }
        .role-tab.active span { color: #C9A84C; }
        .role-tab.active small { color: rgba(201,168,76,0.6); }

        /* form */
        .su-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .su-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .su-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .su-field label {
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.55); letter-spacing: 0.04em;
        }
        .su-input-wrap { position: relative; }
        .su-input-wrap .field-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.28); pointer-events: none;
        }
        .su-input-wrap .toggle-icon {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.28); cursor: pointer; background: none; border: none;
          display: flex; align-items: center; padding: 0;
          transition: color 0.2s;
        }
        .su-input-wrap .toggle-icon:hover { color: #C9A84C; }

        .su-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 14px 13px 42px;
          color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .su-input.with-toggle { padding-right: 42px; }
        .su-input::placeholder { color: rgba(255,255,255,0.22); }
        .su-input:focus {
          border-color: rgba(201,168,76,0.55);
          background: rgba(255,255,255,0.07);
        }
        .su-input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* strength meter */
        .strength-bar {
          display: flex; gap: 4px; margin-top: 6px;
        }
        .strength-seg {
          flex: 1; height: 3px; border-radius: 2px;
          background: rgba(255,255,255,0.08);
          transition: background 0.3s;
        }
        .strength-label {
          font-size: 0.72rem; margin-top: 4px;
          color: rgba(255,255,255,0.35);
          min-height: 14px;
        }

        /* checkbox */
        .su-check {
          display: flex; align-items: flex-start; gap: 10px;
          cursor: pointer; user-select: none;
        }
        .su-check input[type="checkbox"] {
          width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px;
          accent-color: #C9A84C; cursor: pointer;
        }
        .su-check span {
          font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.5;
        }
        .su-check a { color: #C9A84C; text-decoration: none; }
        .su-check a:hover { text-decoration: underline; }

        /* alerts */
        .su-alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 13px 14px; border-radius: 10px;
          font-size: 0.85rem; line-height: 1.5;
        }
        .su-alert svg { flex-shrink: 0; margin-top: 1px; }
        .su-alert.success { background: rgba(93,219,144,0.08); border: 1px solid rgba(93,219,144,0.2); color: #5ddb90; }
        .su-alert.error   { background: rgba(240,100,80,0.08); border: 1px solid rgba(240,100,80,0.2); color: #f46450; }

        /* submit */
        .su-btn {
          width: 100%;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A; font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 0.95rem;
          padding: 14px; border-radius: 10px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 0.25rem;
        }
        .su-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.35);
        }
        .su-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(10,14,26,0.3);
          border-top-color: #0A0E1A; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* divider */
        .su-divider { display: flex; align-items: center; gap: 12px; }
        .su-divider span { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .su-divider small { font-size: 0.75rem; color: rgba(255,255,255,0.25); }

        .su-login {
          text-align: center; font-size: 0.875rem; color: rgba(255,255,255,0.4);
        }
        .su-login a { color: #C9A84C; text-decoration: none; font-weight: 600; }
        .su-login a:hover { text-decoration: underline; }

        /* breadcrumb */
        .su-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.78rem; color: rgba(255,255,255,0.3); margin-bottom: 1.75rem;
        }
        .su-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
        .su-breadcrumb a:hover { color: #C9A84C; }
        .su-breadcrumb span { color: rgba(255,255,255,0.15); }

        /* success state */
        .su-success {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 1rem; padding: 1rem 0;
        }
        .su-success-icon {
          width: 72px; height: 72px;
          background: rgba(93,219,144,0.1);
          border: 1px solid rgba(93,219,144,0.25);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: #5ddb90;
        }
        .su-success h2 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #fff; }
        .su-success p { font-size: 0.875rem; color: rgba(255,255,255,0.45); line-height: 1.65; max-width: 320px; }
        .su-success p strong { color: #C9A84C; }

        @media (max-width: 540px) {
          .su-card { padding: 2rem 1.5rem; border-radius: 16px; }
          .su-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="su-page">
        <Navbar />

        <main className="su-main">
          <div className="su-card">

            {/* Breadcrumb */}
            <div className="su-breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Create Account</span>
            </div>

            {/* ── Success State ── */}
            {status === "success" ? (
              <div className="su-success">
                <div className="su-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2>You're In!</h2>
                <p>
                  Your account has been created. We sent a verification email to{" "}
                  <strong>{form.email}</strong>. Please verify before logging in.
                </p>
                <Link
                  href="/login"
                  style={{
                    marginTop: "0.5rem",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "linear-gradient(135deg,#C9A84C,#E8C878)",
                    color: "#0A0E1A", fontWeight: 700, fontSize: "0.9rem",
                    padding: "12px 28px", borderRadius: "10px", textDecoration: "none",
                  }}
                >
                  Go to Login →
                </Link>
              </div>
            ) : (
              <>
                {/* Icon + heading */}
                <div className="su-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="28" height="28">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h1>Create an Account</h1>
                <p className="su-desc">
                  Join thousands of property seekers and owners on Nigeria's premier property directory.
                </p>

                {/* Role selector */}
                <div className="role-tabs">
                  {[
                    {
                      value: "user", label: "Tenant / Buyer", sub: "Browse & contact",
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="22" height="22"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                    },
                    {
                      value: "agent", label: "Agent / Landlord", sub: "List properties",
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                    },
                    {
                      value: "hotel", label: "Hotel / Shortlet", sub: "List rooms",
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="22" height="22"><path d="M2 22h20M3 22V8l9-6 9 6v14M9 22V14h6v8"/></svg>,
                    },
                  ].map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      className={`role-tab ${form.role === r.value ? "active" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                      <small>{r.sub}</small>
                    </button>
                  ))}
                </div>

                {/* Error / success alert */}
                {status === "error" && (
                  <div className="su-alert error" style={{ marginBottom: "1.25rem" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {message}
                  </div>
                )}

                <form className="su-form" onSubmit={handleSubmit}>

                  {/* Name row */}
                  <div className="su-row">
                    <div className="su-field">
                      <label htmlFor="firstName">First Name</label>
                      <div className="su-input-wrap">
                        <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        <input id="firstName" name="firstName" type="text" className="su-input"
                          placeholder="John" value={form.firstName} onChange={handleChange}
                          required autoComplete="given-name" disabled={status === "loading"} />
                      </div>
                    </div>
                    <div className="su-field">
                      <label htmlFor="lastName">Last Name</label>
                      <div className="su-input-wrap">
                        <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        <input id="lastName" name="lastName" type="text" className="su-input"
                          placeholder="Doe" value={form.lastName} onChange={handleChange}
                          required autoComplete="family-name" disabled={status === "loading"} />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="su-field">
                    <label htmlFor="email">Email Address</label>
                    <div className="su-input-wrap">
                      <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input id="email" name="email" type="email" className="su-input"
                        placeholder="you@example.com" value={form.email} onChange={handleChange}
                        required autoComplete="email" disabled={status === "loading"} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="su-field">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="su-input-wrap">
                      <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                      <input id="phone" name="phone" type="tel" className="su-input"
                        placeholder="+234 800 000 0000" value={form.phone} onChange={handleChange}
                        autoComplete="tel" disabled={status === "loading"} />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="su-field">
                    <label htmlFor="password">Password</label>
                    <div className="su-input-wrap">
                      <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <input id="password" name="password" type={showPass ? "text" : "password"}
                        className="su-input with-toggle"
                        placeholder="Min. 8 characters" value={form.password}
                        onChange={handleChange} required autoComplete="new-password"
                        disabled={status === "loading"} />
                      <button type="button" className="toggle-icon" onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                        {showPass
                          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    {pw.length > 0 && (
                      <>
                        <div className="strength-bar">
                          {[1,2,3,4].map((i) => (
                            <div key={i} className="strength-seg"
                              style={{ background: i <= pwStrength ? strengthColors[pwStrength] : undefined }} />
                          ))}
                        </div>
                        <div className="strength-label" style={{ color: strengthColors[pwStrength] }}>
                          {strengthLabels[pwStrength]}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="su-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="su-input-wrap">
                      <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <input id="confirmPassword" name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        className="su-input with-toggle"
                        placeholder="Re-enter your password"
                        value={form.confirmPassword} onChange={handleChange}
                        required autoComplete="new-password" disabled={status === "loading"} />
                      <button type="button" className="toggle-icon" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password">
                        {showConfirm
                          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    {form.confirmPassword && form.password !== form.confirmPassword && (
                      <div style={{ fontSize: "0.75rem", color: "#f46450", marginTop: "4px" }}>
                        Passwords do not match
                      </div>
                    )}
                    {form.confirmPassword && form.password === form.confirmPassword && form.password && (
                      <div style={{ fontSize: "0.75rem", color: "#5ddb90", marginTop: "4px" }}>
                        ✓ Passwords match
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <label className="su-check">
                    <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
                    <span>
                      I agree to the{" "}
                      <Link href="/terms">Terms of Service</Link>{" "}and{" "}
                      <Link href="/privacy">Privacy Policy</Link>
                    </span>
                  </label>

                  {/* Submit */}
                  <button type="submit" className="su-btn"
                    disabled={status === "loading" || !form.agree}>
                    {status === "loading" ? (
                      <><span className="spinner" /> Creating Account...</>
                    ) : (
                      <>
                        Create Account
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="su-divider" style={{ margin: "1.5rem 0 1rem" }}>
                  <span /><small>already have an account?</small><span />
                </div>

                <p className="su-login">
                  <Link href="/login">Sign in to your account →</Link>
                </p>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}