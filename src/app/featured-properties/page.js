"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Badge colours (same as homepage) ────────────────────────────────────────
const badgeColors = {
  hotel:    { bg: "#1a2a4a", color: "#7eb8f7" },
  rent:     { bg: "#0d2d1a", color: "#5ddb90" },
  sale:     { bg: "#2d1a0d", color: "#f0a45d" },
  shortlet: { bg: "#2d1a2d", color: "#d47ddb" },
};

const badgeLabel = {
  hotel:    "Hotel",
  rent:     "For Rent",
  sale:     "For Sale",
  shortlet: "Shortlet",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const HomeIllo = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(listing) {
  const fmt = (n) => n ? "₦" + Number(n).toLocaleString("en-NG") : null;

  if (listing.type === "sale")     return { price: fmt(listing.price),          suffix: "" };
  if (listing.type === "rent")     return { price: fmt(listing.pricePerYear || listing.pricePerMonth), suffix: listing.pricePerYear ? "/yr" : "/mo" };
  if (listing.type === "hotel")    return { price: fmt(listing.pricePerNight),  suffix: "/night" };
  if (listing.type === "shortlet") return { price: fmt(listing.pricePerNight),  suffix: "/night" };
  return { price: "—", suffix: "" };
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="fp-card fp-skeleton">
      <div className="fp-sk fp-sk-img" />
      <div className="fp-sk-body">
        <div className="fp-sk fp-sk-line" style={{ width: "30%", height: 12 }} />
        <div className="fp-sk fp-sk-line" style={{ width: "80%", height: 16 }} />
        <div className="fp-sk fp-sk-line" style={{ width: "55%", height: 12 }} />
        <div className="fp-sk fp-sk-line" style={{ width: "40%", height: 12 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <div className="fp-sk fp-sk-line" style={{ flex: 1, height: 32 }} />
          <div className="fp-sk fp-sk-line" style={{ width: 32, height: 32 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ listing }) {
  const { type, title, images, location, phone } = listing;
  const badge  = badgeColors[type] || { bg: "#1a1a1a", color: "#999" };
  const label  = badgeLabel[type]  || type;
  const { price, suffix } = formatPrice(listing);

  return (
    <div className="fp-card">
      <div className="fp-img-wrap">
        {images?.length > 0
          ? <img src={images[0]} alt={title} className="fp-img" />
          : <div className="fp-no-img"><HomeIllo /><span>No photo</span></div>
        }
        <span className="fp-badge" style={{ background: badge.bg, color: badge.color }}>
          {label}
        </span>
      </div>

      <div className="fp-body">
        <h3 className="fp-title">{title}</h3>

        <p className="fp-location">
          <LocationIcon />
          {[location?.city, location?.state].filter(Boolean).join(", ") || "Nigeria"}
        </p>

        <div className="fp-meta">
          {listing.bedrooms   && <span>{listing.bedrooms} Beds</span>}
          {listing.bathrooms  && <span>{listing.bathrooms} Baths</span>}
          {listing.totalRooms && <span>{listing.totalRooms} Rooms</span>}
          {listing.starRating && <span>★ {listing.starRating}</span>}
        </div>

        <div className="fp-footer">
          <div className="fp-price">
            {price}
            {suffix && <small>{suffix}</small>}
          </div>

          <div className="fp-actions">
            {phone && (
              <a href={`tel:${phone}`} className="fp-btn-call" title="Call agent">
                <PhoneIcon />
              </a>
            )}
            <Link href={`/listings/${listing._id}`} className="fp-btn-view">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FeaturedProperties() {
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res  = await fetch("/api/listings/featured");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch.");
        setListings(data.listings || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <>
      <style>{`
        /* ── Cards ── */
        .fp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 250px));
  justify-content: center;
  gap: 1rem;
  padding: 1.2rem;
}
        .fp-card {
          background: #111827;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .fp-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }

        /* ── Image ── */
        .fp-img-wrap {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
        }
        .fp-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .fp-card:hover .fp-img { transform: scale(1.06); }
        .fp-no-img {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px; color: rgba(255,255,255,0.15);
          font-size: 0.75rem;
        }
        .fp-badge {
          position: absolute; top: 12px; left: 12px;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 6px;
        }

        /* ── Body ── */
        .fp-body { padding: 1.1rem 1.15rem 1.15rem; }
        .fp-title {
          font-size: 0.95rem; font-weight: 600; color: #fff;
          margin-bottom: 0.35rem; line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 1;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .fp-location {
          font-size: 0.78rem; color: rgba(255,255,255,0.4);
          display: flex; align-items: center; gap: 4px;
          margin-bottom: 0.6rem;
        }
        .fp-meta {
          display: flex; gap: 0.75rem; flex-wrap: wrap;
          font-size: 0.76rem; color: rgba(255,255,255,0.4);
          margin-bottom: 0.85rem; min-height: 18px;
        }
        .fp-footer {
          display: flex; align-items: center;
          justify-content: space-between; gap: 0.5rem;
          padding-top: 0.7rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .fp-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; font-weight: 700; color: #C9A84C;
        }
        .fp-price small {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem; color: rgba(255,255,255,0.35);
          font-weight: 400; margin-left: 2px;
        }
        .fp-actions { display: flex; gap: 6px; align-items: center; }
        .fp-btn-call {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(93,219,144,0.1);
          border: 1px solid rgba(93,219,144,0.2);
          color: #5ddb90; display: flex;
          align-items: center; justify-content: center;
          text-decoration: none; transition: background 0.2s;
        }
        .fp-btn-call:hover { background: rgba(93,219,144,0.2); }
        .fp-btn-view {
          font-size: 0.76rem; font-weight: 600; color: #C9A84C;
          text-decoration: none; padding: 6px 12px; border-radius: 7px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          transition: background 0.2s;
        }
        .fp-btn-view:hover { background: rgba(201,168,76,0.2); }

        /* ── Skeleton ── */
        .fp-skeleton { pointer-events: none; }
        @keyframes fp-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .fp-sk {
          background: linear-gradient(90deg,
            rgba(255,255,255,0.04) 25%,
            rgba(255,255,255,0.08) 50%,
            rgba(255,255,255,0.04) 75%);
          background-size: 600px 100%;
          animation: fp-shimmer 1.4s infinite linear;
          border-radius: 6px;
        }
        .fp-sk-img  { height: 190px; border-radius: 0; }
        .fp-sk-body { padding: 1.1rem 1.15rem 1.15rem; display: flex; flex-direction: column; gap: 10px; }
        .fp-sk-line { display: block; }

        /* ── Error / Empty ── */
        .fp-error {
          grid-column: 1 / -1; text-align: center;
          padding: 3rem 1rem; color: rgba(255,255,255,0.3);
          font-size: 0.875rem;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) { .fp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) {
  .fp-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    
  }
}
      `}</style>

      <div className="fp-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <p className="fp-error">{error}</p>
        ) : listings.length === 0 ? (
          <p className="fp-error">No featured listings yet.</p>
        ) : (
          listings.map(l => <PropertyCard key={l._id} listing={l} />)
        )}
      </div>
    </>
  );
}