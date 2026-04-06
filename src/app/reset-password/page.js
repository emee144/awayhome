"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token");

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset link.");
  }, [token]);

  const handleSubmit = async () => {
    setError("");
    if (!password || !confirm)  return setError("Please fill in both fields.");
    if (password.length < 8)    return setError("Password must be at least 8 characters.");
    if (password !== confirm)   return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

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

        .rp-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0A0E1A;
        }

        .rp-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7rem 1.5rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .rp-main::before,
        .rp-main::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .rp-main::before {
          width: 500px;
          height: 500px;
          background: rgba(201,168,76,0.06);
          top: -100px;
          right: -100px;
        }
        .rp-main::after {
          width: 400px;
          height: 400px;
          background: rgba(126,184,247,0.04);
          bottom: -80px;
          left: -80px;
        }

        .rp-card {
          position: relative;
          z-index: 1;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.75rem 2.5rem;
          width: 100%;
          max-width: 460px;
        }

        .rp-icon-wrap {
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

        .rp-card h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .rp-card p.rp-desc {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
          margin-bottom: 2rem;
        }

        .rp-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .rp-field { display: flex; flex-direction: column; gap: 0.45rem; }

        .rp-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.04em;
        }

        .rp-input-wrap {
          position: relative;
        }
        .rp-input-wrap .rp-icon-left {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }
        .rp-input-wrap .rp-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .rp-input-wrap .rp-toggle:hover { color: rgba(255,255,255,0.6); }

        .rp-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 42px 13px 42px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .rp-input.no-left-icon {
          padding-left: 14px;
        }
        .rp-input::placeholder { color: rgba(255,255,255,0.25); }
        .rp-input:focus {
          border-color: rgba(201,168,76,0.55);
          background: rgba(255,255,255,0.07);
        }
        .rp-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .rp-btn {
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
        .rp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.35);
        }
        .rp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(10,14,26,0.3);
          border-top-color: #0A0E1A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .rp-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 13px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .rp-alert svg { flex-shrink: 0; margin-top: 1px; }
        .rp-alert.error {
          background: rgba(240,100,80,0.08);
          border: 1px solid rgba(240,100,80,0.2);
          color: #f46450;
        }

        .rp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0.25rem 0;
        }
        .rp-divider span {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .rp-divider small {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
        }

        .rp-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }
        .rp-back:hover { color: #C9A84C; }
        .rp-back svg { transition: transform 0.2s; }
        .rp-back:hover svg { transform: translateX(-3px); }

        .rp-success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 1rem 0;
        }
        .rp-success-icon {
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
        .rp-success-state h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
        }
        .rp-success-state p {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
          max-width: 320px;
        }

        .rp-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1.75rem;
        }
        .rp-breadcrumb a {
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .rp-breadcrumb a:hover { color: #C9A84C; }
        .rp-breadcrumb span { color: rgba(255,255,255,0.15); }

        @media (max-width: 500px) {
          .rp-card { padding: 2rem 1.5rem; border-radius: 16px; }
        }
      `}</style>

      <div className="rp-page">
        <Navbar />

        <main className="rp-main">
          <div className="rp-card">

            {/* Breadcrumb */}
            <div className="rp-breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <Link href="/login">Login</Link>
              <span>›</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Reset Password</span>
            </div>

            {/* ── Success State ── */}
            {done ? (
              <div className="rp-success-state">
                <div className="rp-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2>Password Updated!</h2>
                <p>Your password has been reset successfully. Redirecting you to login…</p>
                <Link href="/login" className="rp-back" style={{ marginTop: "0.5rem" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="rp-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="28" height="28">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>

                <h1>Reset Password</h1>
                <p className="rp-desc">
                  Choose a strong new password for your AwayHome account. Make sure it's at least 8 characters.
                </p>

                {/* Error Alert */}
                {error && (
                  <div className="rp-alert error" style={{ marginBottom: "1.25rem" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Form */}
                <div className="rp-form">

                  {/* New Password */}
                  <div className="rp-field">
                    <label htmlFor="new-password">New Password</label>
                    <div className="rp-input-wrap">
                      <span className="rp-icon-left">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                      </span>
                      <input
                        id="new-password"
                        type={showPass ? "text" : "password"}
                        className="rp-input"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        disabled={loading || !token}
                      />
                      <button
                        type="button"
                        className="rp-toggle"
                        onClick={() => setShowPass(!showPass)}
                        aria-label={showPass ? "Hide password" : "Show password"}
                      >
                        {showPass ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="rp-field">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="rp-input-wrap">
                      <span className="rp-icon-left">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <input
                        id="confirm-password"
                        type={showPass ? "text" : "password"}
                        className="rp-input"
                        placeholder="Repeat your password"
                        value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        disabled={loading || !token}
                      />
                    </div>
                  </div>

                  <button
                    className="rp-btn"
                    onClick={handleSubmit}
                    disabled={loading || !token}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" />
                        Updating Password…
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>

                <div className="rp-divider" style={{ marginTop: "1.75rem" }}>
                  <span /><small>or</small><span />
                </div>

                <Link href="/login" className="rp-back" style={{ marginTop: "0.25rem" }}>
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}