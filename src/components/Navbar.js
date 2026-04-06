"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Rent", href: "/rent" },
  { label: "Buy", href: "/buy" },
  { label: "Hotels", href: "/hotels" },
  { label: "List Property", href: "/list-property" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ AUTH STATE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Fetch logged-in user
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ Logout
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: background 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease;
          padding: ${scrolled ? "14px 0" : "22px 0"};
          background: ${scrolled ? "rgba(10,14,26,0.97)" : "transparent"};
          backdrop-filter: ${scrolled ? "blur(12px)" : "none"};
          box-shadow: ${scrolled ? "0 2px 30px rgba(0,0,0,0.25)" : "none"};
        }
        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-icon svg {
          width: 20px;
          height: 20px;
          fill: #fff;
        }
        .logo-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .logo-text span {
          color: #C9A84C;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links a:not(.nav-cta), 
.nav-links button {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          letter-spacing: 0.02em;
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-links a::after, .nav-links button::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #C9A84C;
          transition: width 0.25s ease;
        }
        .nav-links a:hover,
        .nav-links button:hover {
          color: #C9A84C;
        }
        .nav-links a:hover::after,
        .nav-links button:hover::after {
          width: 100%;
        }
        .nav-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #0A0E1A !important;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          padding: 10px 22px;
          border-radius: 8px;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: transform 0.2s, box-shadow 0.2s !important;
          white-space: nowrap;
        }
        .nav-cta::after { display: none !important; }
        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(201,168,76,0.4);
          color: #0A0E1A !important;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }

        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 0;
          background: rgba(10,14,26,0.98);
          border-top: 1px solid rgba(201,168,76,0.2);
          padding: 1rem 2rem 1.5rem;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a, .mobile-menu button {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: none;
          border: none;
          text-align: left;
        }
        .mobile-menu a:hover, .mobile-menu button:hover { color: #C9A84C; }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="logo-text">Away<span>Home</span></span>
          </Link>

          {/* DESKTOP */}
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.label === "List Property" ? (
                  <Link href={link.href} className="nav-cta">{link.label}</Link>
                ) : (
                  <Link href={link.href}>{link.label}</Link>
                )}
              </li>
            ))}

            {!loading && (
              user ? (
                <>
                  <li><Link href="/dashboard">Dashboard</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link href="/login">Sign In</Link></li>
                  <li><Link href="/signup">Register</Link></li>
                </>
              )
            )}
          </ul>

          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* MOBILE */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}

          {!loading && (
            user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )
          )}
        </div>
      </nav>
    </>
  );
}