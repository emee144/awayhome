"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Styles ───────────────────────────────────────────────────────────────────
const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  /* ── Layout ── */
  .login-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #0A0E1A;
  }

  /* ── Left panel ── */
  .login-left {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem 4rem;
    background: #0D1220;
    border-right: 1px solid rgba(201,168,76,0.1);
    overflow: hidden;
  }
  .login-left::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
    top: -150px; left: -150px;
    pointer-events: none;
  }
  .login-left::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    pointer-events: none;
  }

  /* decorative grid lines */
  .login-grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .login-left-inner { position: relative; z-index: 1; max-width: 420px; }

  .login-logo {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 3.5rem;
  }
  .login-logo-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08));
    border: 1px solid rgba(201,168,76,0.35);
    display: flex; align-items: center; justify-content: center;
  }
  .login-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem; font-weight: 700;
    color: #fff; letter-spacing: 0.02em;
  }
  .login-logo-text span { color: #C9A84C; }

  .login-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.22);
    border-radius: 100px; padding: 5px 14px;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: #C9A84C;
    margin-bottom: 1.25rem;
  }

  .login-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 700; line-height: 1.12; color: #fff;
    margin-bottom: 1rem;
  }
  .login-headline em { font-style: italic; color: #C9A84C; }

  .login-sub {
    font-size: 0.9rem; line-height: 1.65;
    color: rgba(255,255,255,0.38);
    max-width: 340px; margin-bottom: 3rem;
  }

  /* feature pills */
  .login-features { display: flex; flex-direction: column; gap: 10px; }
  .login-feat {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .login-feat-icon {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .login-feat-icon.gold  { background: rgba(201,168,76,0.12); color: #C9A84C; }
  .login-feat-icon.green { background: rgba(93,219,144,0.1);  color: #5ddb90; }
  .login-feat-icon.blue  { background: rgba(96,165,250,0.1);  color: #60A5FA; }
  .login-feat-text { font-size: 0.82rem; color: rgba(255,255,255,0.5); line-height: 1.4; }
  .login-feat-text strong { color: rgba(255,255,255,0.82); display: block; font-size: 0.84rem; margin-bottom: 1px; }

  /* ── Right panel ── */
  .login-right {
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 3rem;
    background: #0A0E1A;
  }

  .login-card {
    width: 100%; max-width: 420px;
    background: #111827;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 2.5rem 2.25rem;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  }

  .login-card-header { margin-bottom: 2rem; }
  .login-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.45rem; font-weight: 700; color: #fff;
    margin-bottom: 0.4rem;
  }
  .login-card-sub { font-size: 0.82rem; color: rgba(255,255,255,0.3); }

  /* ── Form ── */
  .login-form { display: flex; flex-direction: column; gap: 1.1rem; }

  .login-field { display: flex; flex-direction: column; gap: 6px; }
  .login-label {
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: white;
  }
  .login-input-wrap { position: relative; }
 .login-input-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.22);
  pointer-events: none; /* keep for left icon */
}


.login-input-icon.right {
  left: auto;
  right: 13px;
  cursor: pointer;
  pointer-events: auto;
}
  .login-input {
    width: 100%; padding: 11px 14px 11px 40px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .login-input::placeholder { color: rgba(255,255,255,0.2); }
  .login-input:focus {
    border-color: rgba(201,168,76,0.5);
    background: rgba(201,168,76,0.04);
  }
  .login-input:focus + .login-focus-ring { opacity: 1; }

  /* error state */
  .login-input.error { border-color: rgba(240,100,80,0.5); }

  /* ── Error box ── */
  .login-error-box {
    display: flex; align-items: flex-start; gap: 9px;
    padding: 11px 14px; border-radius: 10px;
    background: rgba(240,100,80,0.07);
    border: 1px solid rgba(240,100,80,0.25);
    color: #f46450; font-size: 0.82rem; line-height: 1.45;
  }
  .login-error-box svg { flex-shrink: 0; margin-top: 1px; }

  /* ── Submit ── */
  .login-submit {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #C9A84C 0%, #a8872e 100%);
    border: none; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 700;
    color: #0A0E1A; letter-spacing: 0.06em; text-transform: uppercase;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.2);
    margin-top: 0.4rem;
  }
  .login-submit:hover:not(:disabled) {
    opacity: 0.92; transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(201,168,76,0.3);
  }
  .login-submit:active:not(:disabled) { transform: translateY(0); }
  .login-submit:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Spinner ── */
  .login-spin {
    width: 16px; height: 16px;
    border: 2px solid rgba(10,14,26,0.25);
    border-top-color: #0A0E1A;
    border-radius: 50%;
    animation: lspin 0.65s linear infinite;
  }
  @keyframes lspin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .login-divider {
    display: flex; align-items: center; gap: 12px;
    font-size: 0.72rem; color: rgba(255,255,255,0.2);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin: 0.25rem 0;
  }
  .login-divider::before,
  .login-divider::after {
    content: ''; flex: 1; height: 1px;
    background: rgba(255,255,255,0.07);
  }

  /* ── Footer note ── */
  .login-card-footer {
    margin-top: 1.5rem; padding-top: 1.25rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    text-align: center;
    font-size: 0.75rem; color: rgba(255,255,255,0.2);
  }
  .login-card-footer strong { color: rgba(255,255,255,0.38); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .login-root { grid-template-columns: 1fr; }
    .login-left  { display: none; }
    .login-right { padding: 2rem 1.25rem; align-items: flex-start; padding-top: 4rem; }
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckAllIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2l-9.6 9.6"/>
    <path d="M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const router = useRouter();
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim().toLowerCase(), password }),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        return;
      }

      router.push("/admin/listings");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{LOGIN_CSS}</style>
      <div className="login-root">

        {/* ── Left ── */}
        <div className="login-left">
          <div className="login-grid-lines" />
          <div className="login-left-inner">

            {/* Logo */}
            <div className="login-logo">
              <div className="login-logo-icon"><ShieldIcon /></div>
              <span className="login-logo-text">AwayHome Admin <span>Page</span></span>
            </div>

            <div className="login-eyebrow">
              <ShieldIcon />
              Secure Portal
            </div>
            <h1 className="login-headline">
              Your <em>Command</em><br />Centre Awaits
            </h1>
            <p className="login-sub">
              Manage listings, review submissions, and keep the platform
              running smoothly — all from one powerful dashboard.
            </p>

            <div className="login-features">
              <div className="login-feat">
                <div className="login-feat-icon gold"><ListIcon /></div>
                <div className="login-feat-text">
                  <strong>Listing Review</strong>
                  Approve or reject property submissions instantly
                </div>
              </div>
              <div className="login-feat">
                <div className="login-feat-icon green"><CheckAllIcon /></div>
                <div className="login-feat-text">
                  <strong>Live Stats</strong>
                  Real-time counts across pending, active & rejected
                </div>
              </div>
              <div className="login-feat">
                <div className="login-feat-icon blue"><BellIcon /></div>
                <div className="login-feat-text">
                  <strong>Instant Feedback</strong>
                  Toast notifications confirm every action you take
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Right ── */}
        <div className="login-right">
          <div className="login-card">

            <div className="login-card-header">
              <h2 className="login-card-title">Welcome back</h2>
              <p className="login-card-sub">Sign in to access the admin dashboard</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="login-field">
                <label className="login-label" htmlFor="admin-email">Email address</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><MailIcon /></span>
                  <input
                    id="admin-email"
                    className={`login-input${error ? " error" : ""}`}
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <label className="login-label" htmlFor="admin-pass">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><LockIcon /></span>
                  <input
                    id="admin-pass"
                    className={`login-input${error ? " error" : ""}`}
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    disabled={loading}
                    style={{ paddingRight: "40px" }}
                  />
                  <span
                    className="login-input-icon right"
                    onClick={() => setShowPass(p => !p)}
                    title={showPass ? "Hide password" : "Show password"}
                    style={{ color: showPass ? "#C9A84C" : "rgba(255,255,255,0.22)" }}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="login-error-box">
                  <AlertIcon />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button className="login-submit" type="submit" disabled={loading}>
                {loading
                  ? <><span className="login-spin" /> Signing in…</>
                  : <><KeyIcon /> Sign In to Dashboard</>
                }
              </button>

            </form>

            <div className="login-card-footer">
              <strong>Restricted access.</strong> Authorised administrators only.
            </div>

          </div>
        </div>

      </div>
    </>
  );
}