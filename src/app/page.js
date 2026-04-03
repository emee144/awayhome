import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// ─── Sample Data ──────────────────────────────────────────────────────────────
const featuredProperties = [
  {
    id: 1,
    type: "Hotel",
    badge: "Hotel",
    name: "Eko Atlantic Grand Hotel",
    location: "Victoria Island, Lagos",
    price: "₦45,000",
    period: "/night",
    beds: null,
    baths: null,
    rooms: "120 Rooms",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    tag: "Luxury",
    website: "https://ekohotels.com",
    phone: "+234 801 234 5678",
  },
  {
    id: 2,
    type: "Apartment",
    badge: "For Rent",
    name: "Lekki Phase 1 Executive Flat",
    location: "Lekki Phase 1, Lagos",
    price: "₦3,500,000",
    period: "/year",
    beds: 3,
    baths: 2,
    rooms: null,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    tag: "Serviced",
    website: null,
    phone: "+234 802 345 6789",
  },
  {
    id: 3,
    type: "Sale",
    badge: "For Sale",
    name: "Banana Island Luxury Villa",
    location: "Banana Island, Ikoyi",
    price: "₦850,000,000",
    period: "",
    beds: 5,
    baths: 6,
    rooms: null,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    tag: "Premium",
    website: null,
    phone: "+234 803 456 7890",
  },
  {
    id: 4,
    type: "Shortlet",
    badge: "Shortlet",
    name: "Abuja Central Business Suite",
    location: "Central Business District, Abuja",
    price: "₦28,000",
    period: "/night",
    beds: 2,
    baths: 2,
    rooms: null,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    tag: "Self-Contain",
    website: "https://example.com",
    phone: "+234 804 567 8901",
  },
  {
    id: 5,
    type: "Hotel",
    badge: "Hotel",
    name: "Transcorp Hilton Abuja",
    location: "Maitama, Abuja",
    price: "₦85,000",
    period: "/night",
    beds: null,
    baths: null,
    rooms: "667 Rooms",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    tag: "5-Star",
    website: "https://hilton.com",
    phone: "+234 805 678 9012",
  },
  {
    id: 6,
    type: "Apartment",
    badge: "For Rent",
    name: "Ikeja GRA 2-Bedroom",
    location: "Ikeja GRA, Lagos",
    price: "₦1,800,000",
    period: "/year",
    beds: 2,
    baths: 1,
    rooms: null,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    tag: "Self-Contain",
    website: null,
    phone: "+234 806 789 0123",
  },
];

const categories = [
  {
    label: "Apartments",
    sub: "Rent or buy",
    href: "/rent",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    count: "1,200+",
  },
  {
    label: "Hotels",
    sub: "All budgets",
    href: "/hotels",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M2 22h20M3 22V8l9-6 9 6v14M9 22V14h6v8" />
      </svg>
    ),
    count: "450+",
  },
  {
    label: "Shortlets",
    sub: "Daily & weekly",
    href: "/shortlets",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    count: "320+",
  },
  {
    label: "Properties for Sale",
    sub: "Buy your dream home",
    href: "/buy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    count: "780+",
  },
];

const stats = [
  { value: "2,750+", label: "Listed Properties" },
  { value: "12", label: "States Covered" },
  { value: "850+", label: "Verified Agents" },
  { value: "100%", label: "Free to Browse" },
];

// ─── Badge color map ──────────────────────────────────────────────────────────
const badgeColors = {
  Hotel: { bg: "#1a2a4a", color: "#7eb8f7" },
  "For Rent": { bg: "#0d2d1a", color: "#5ddb90" },
  "For Sale": { bg: "#2d1a0d", color: "#f0a45d" },
  Shortlet: { bg: "#2d1a2d", color: "#d47ddb" },
};

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ p }) {
  const badge = badgeColors[p.badge] || { bg: "#1a1a1a", color: "#999" };

  return (
    <div className="prop-card">
      <div className="prop-img-wrap">
        <img src={p.image} alt={p.name} className="prop-img" />
        <span className="prop-badge" style={{ background: badge.bg, color: badge.color }}>
          {p.badge}
        </span>
        <span className="prop-tag">{p.tag}</span>
      </div>
      <div className="prop-body">
        <h3>{p.name}</h3>
        <p className="prop-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {p.location}
        </p>
        <div className="prop-meta">
          {p.beds && <span>{p.beds} Beds</span>}
          {p.baths && <span>{p.baths} Baths</span>}
          {p.rooms && <span>{p.rooms}</span>}
        </div>
        <div className="prop-footer">
          <div className="prop-price">
            {p.price}<small>{p.period}</small>
          </div>
          <div className="prop-actions">
            <a href={`tel:${p.phone}`} className="btn-call" title="Call agent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </a>
            {p.website && (
              <a href={p.website} target="_blank" rel="noopener noreferrer" className="btn-website">
                Visit Site →
              </a>
            )}
            <Link href={`/property/${p.id}`} className="btn-view">View</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
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
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=80');
          background-size: cover;
          background-position: center;
          transform: scale(1.05);
          animation: heroZoom 14s ease-in-out infinite alternate;
        }
        @keyframes heroZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.0); }
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,14,26,0.88) 0%, rgba(10,14,26,0.6) 60%, rgba(10,14,26,0.75) 100%);
        }
        .hero-content {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 8rem 2rem 5rem;
          width: 100%;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 1.5rem;
        }
        .hero-eyebrow::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C9A84C;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.5rem, 5vw, 4.2rem);
          font-weight: 700;
          line-height: 1.12;
          color: #fff;
          margin-bottom: 1.25rem;
          max-width: 680px;
        }
        .hero h1 em {
          font-style: italic;
          color: #C9A84C;
        }
        .hero-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 2.5rem;
        }
        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 14px 28px;
          border-radius: 10px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.4);
        }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-weight: 500;
          font-size: 0.9rem;
          padding: 14px 28px;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          backdrop-filter: blur(8px);
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.4);
        }

        /* Search Box */
        .search-box {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 700px;
          flex-wrap: wrap;
        }
        .search-input-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
        }
        .search-input-wrap svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.4);
        }
        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 12px 14px 12px 42px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.35); }
        .search-input:focus { border-color: rgba(201,168,76,0.5); }
        .search-select {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 12px 16px;
          color: rgba(255,255,255,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
          min-width: 130px;
        }
        .search-select option { background: #0F1525; color: #fff; }
        .search-btn {
          background: linear-gradient(135deg, #C9A84C, #E8C878);
          color: #0A0E1A;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 12px 24px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(201,168,76,0.4);
        }

        /* Stats bar */
        .hero-stats {
          display: flex;
          gap: 2.5rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }
        .hero-stat { text-align: left; }
        .hero-stat .val {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #C9A84C;
          display: block;
        }
        .hero-stat .lbl {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.05em;
        }

        /* ── Section shared ── */
        section { padding: 5rem 0; }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }
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
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }
        .section-sub {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          line-height: 1.7;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .view-all {
          font-size: 0.875rem;
          font-weight: 600;
          color: #C9A84C;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .view-all:hover { text-decoration: underline; }

        /* ── Categories ── */
        .categories-section { background: #0D1220; }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .cat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-decoration: none;
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .cat-card:hover {
          background: rgba(201,168,76,0.07);
          border-color: rgba(201,168,76,0.3);
          transform: translateY(-4px);
        }
        .cat-icon {
          width: 56px;
          height: 56px;
          background: rgba(201,168,76,0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
        }
        .cat-label {
          font-size: 1.05rem;
          font-weight: 600;
          color: #fff;
        }
        .cat-sub { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
        .cat-count {
          font-size: 0.78rem;
          font-weight: 600;
          color: #C9A84C;
          background: rgba(201,168,76,0.1);
          border-radius: 100px;
          padding: 3px 10px;
          display: inline-block;
          align-self: flex-start;
        }

        /* ── Property Cards ── */
        .props-section { background: #0A0E1A; }
        .props-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .prop-card {
          background: #111827;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .prop-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .prop-img-wrap {
          position: relative;
          height: 210px;
          overflow: hidden;
        }
        .prop-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .prop-card:hover .prop-img { transform: scale(1.06); }
        .prop-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .prop-tag {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
          border-radius: 6px;
          padding: 4px 10px;
        }
        .prop-body { padding: 1.25rem; }
        .prop-body h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.4rem;
          line-height: 1.3;
        }
        .prop-location {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 0.75rem;
        }
        .prop-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .prop-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .prop-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #C9A84C;
        }
        .prop-price small {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
          margin-left: 2px;
        }
        .prop-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .btn-call {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(93,219,144,0.12);
          border: 1px solid rgba(93,219,144,0.2);
          color: #5ddb90;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-call:hover { background: rgba(93,219,144,0.22); }
        .btn-website {
          font-size: 0.75rem;
          font-weight: 600;
          color: #7eb8f7;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 7px;
          background: rgba(126,184,247,0.1);
          border: 1px solid rgba(126,184,247,0.2);
          transition: background 0.2s;
        }
        .btn-website:hover { background: rgba(126,184,247,0.2); }
        .btn-view {
          font-size: 0.78rem;
          font-weight: 600;
          color: #C9A84C;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 7px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          transition: background 0.2s;
        }
        .btn-view:hover { background: rgba(201,168,76,0.2); }

        /* ── How It Works ── */
        .how-section { background: #0D1220; }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .step-card {
          text-align: center;
          padding: 2rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          position: relative;
        }
        .step-num {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 700;
          color: rgba(201,168,76,0.15);
          line-height: 1;
          margin-bottom: 1rem;
        }
        .step-icon {
          width: 52px;
          height: 52px;
          background: rgba(201,168,76,0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
          margin: 0 auto 1rem;
        }
        .step-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .step-card p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
        }

        /* ── CTA Banner ── */
        .cta-section {
          background: linear-gradient(135deg, #0A0E1A 0%, #111827 100%);
          border-top: 1px solid rgba(201,168,76,0.1);
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .cta-inner {
          max-width: 800px;
          margin: 0 auto;
          padding: 5rem 2rem;
          text-align: center;
        }
        .cta-inner .section-title { margin: 0 auto 1rem; }
        .cta-inner .section-sub { margin: 0 auto 2rem; text-align: center; }
        .cta-inner .hero-ctas { justify-content: center; }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
          .props-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .cat-grid { grid-template-columns: 1fr; }
          .props-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: 1.5rem; }
          .search-box { flex-direction: column; }
          .search-input-wrap, .search-select { width: 100%; }
          .search-btn { width: 100%; }
        }
      `}</style>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">Nigeria's Property Directory</div>
          <h1>Find Your <em>Perfect</em> Place to Stay or Buy</h1>
          <p className="hero-sub">
            Browse thousands of verified hotels, apartments, shortlets, and properties
            for sale across Nigeria. Connect directly with owners — no hidden fees.
          </p>
          <div className="hero-ctas">
            <Link href="/listings" className="btn-primary">
              Browse Listings
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/list-property" className="btn-outline">
              List Your Property
            </Link>
          </div>

          {/* Search */}
          <div className="search-box">
            <div className="search-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" className="search-input" placeholder="Search city, area or property..." />
            </div>
            <select className="search-select">
              <option>All Types</option>
              <option>Hotel</option>
              <option>Apartment</option>
              <option>Shortlet</option>
              <option>For Sale</option>
            </select>
            <button className="search-btn">Search</button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map((s) => (
              <div className="hero-stat" key={s.label}>
                <span className="val">{s.value}</span>
                <span className="lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Browse by type</p>
              <h2 className="section-title">What Are You Looking For?</h2>
            </div>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link href={c.href} className="cat-card" key={c.label}>
                <div className="cat-icon">{c.icon}</div>
                <div>
                  <div className="cat-label">{c.label}</div>
                  <div className="cat-sub">{c.sub}</div>
                </div>
                <span className="cat-count">{c.count} listings</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────────────── */}
      <section className="props-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Hand-picked listings</p>
              <h2 className="section-title">Featured Properties</h2>
              <p className="section-sub">Verified listings from trusted owners and agents across Nigeria.</p>
            </div>
            <Link href="/listings" className="view-all">View all listings →</Link>
          </div>
          <div className="props-grid">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="how-section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <p className="section-eyebrow">Simple & free</p>
            <h2 className="section-title">How AwayHome Works</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              No booking fees. No commissions. Just direct connections.
            </p>
          </div>
          <div className="steps-grid">
            {[
              {
                n: "01", title: "Search & Filter",
                desc: "Browse by property type, location, price range, or amenities.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                ),
              },
              {
                n: "02", title: "View Details",
                desc: "See photos, amenities, contact info, and the property owner's website.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                ),
              },
              {
                n: "03", title: "Contact Directly",
                desc: "Call the owner, WhatsApp them, or visit their website — no middlemen.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                ),
              },
              {
                n: "04", title: "Move In / Check In",
                desc: "Arrange viewings, negotiate, and finalize — all on your own terms.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                    <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((step) => (
              <div className="step-card" key={step.n}>
                <div className="step-num">{step.n}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-inner">
          <p className="section-eyebrow">Own a hotel or property?</p>
          <h2 className="section-title">List Your Property for Free</h2>
          <p className="section-sub">
            Get your hotel, apartment, or property in front of thousands of ready buyers and renters across Nigeria.
            Listing is 100% free.
          </p>
          <div className="hero-ctas">
            <Link href="/list-property" className="btn-primary">
              Get Listed Today →
            </Link>
            <Link href="/how-it-works" className="btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
