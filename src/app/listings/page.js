"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiPhone, FiMail, FiGlobe } from "react-icons/fi";
import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .ls-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .ls-hero {
    position: relative; padding: 7rem 2rem 3.5rem;
    background: #0D1220;
    border-bottom: 1px solid rgba(201,168,76,0.12);
    overflow: hidden;
  }
  .ls-hero::before {
    content: ''; position: absolute;
    width: 700px; height: 700px; border-radius: 50%;
    background: rgba(201,168,76,0.04); filter: blur(100px);
    top: -200px; right: -200px; pointer-events: none;
  }
  .ls-hero-inner { position: relative; max-width: 900px; margin: 0 auto; text-align: center; }
  .ls-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem;
  }
  .ls-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.75rem); font-weight: 700; color: #fff; line-height: 1.15;
    margin-bottom: 0.85rem;
  }
  .ls-hero h1 em { font-style: italic; color: #C9A84C; }
  .ls-hero p { font-size: 0.95rem; color: rgba(255,255,255,0.45); line-height: 1.7; }

  /* ── Sticky search/filter bar ── */
  .ls-bar {
    position: sticky; top: 0; z-index: 30;
    background: rgba(13,18,32,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 0.9rem 2rem;
  }
  .ls-bar-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
  }

  .ls-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 360px; }
  .ls-search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.3); pointer-events: none;
  }
  .ls-search {
    width: 100%; padding: 10px 14px 10px 38px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .ls-search::placeholder { color: rgba(255,255,255,0.25); }
  .ls-search:focus { border-color: rgba(201,168,76,0.5); background: rgba(255,255,255,0.08); }

  .ls-tabs { display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); }
  .ls-tab {
    padding: 7px 16px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
    color: white; background: none; transition: all 0.2s; white-space: nowrap;
  }
  .ls-tab:hover { color: rgba(255,255,255,0.75); }
  .ls-tab.active { background: rgba(201,168,76,0.15); color: #C9A84C; border: 1px solid rgba(201,168,76,0.3); }

  .ls-filter-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
    border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
    color: white; transition: all 0.2s;
  }
  .ls-filter-btn:hover { border-color: rgba(201,168,76,0.3); color: rgba(255,255,255,0.85); }
  .ls-filter-btn.active { border-color: #C9A84C; background: rgba(201,168,76,0.1); color: #C9A84C; }
  .ls-filter-badge {
    background: #C9A84C; color: #0A0E1A;
    font-size: 0.65rem; font-weight: 700;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  .ls-sort {
    padding: 9px 12px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
    color: white; font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .ls-sort option { background: #0F1525; color: #fff; }
  .ls-sort:focus { border-color: rgba(201,168,76,0.4); }

  /* ── Filter panel ── */
  .ls-filter-panel {
    background: rgba(13,18,32,0.98); border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 1.25rem 2rem;
  }
  .ls-filter-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem;
    align-items: center;
  }
  .ls-filter-input, .ls-filter-select {
    width: 100%; padding: 10px 12px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    outline: none; transition: border-color 0.2s;
  }
  .ls-filter-input::placeholder { color: rgba(255,255,255,0.25); }
  .ls-filter-select option { background: #0F1525; }
  .ls-filter-input:focus, .ls-filter-select:focus { border-color: rgba(201,168,76,0.45); }
  .ls-clear-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(240,100,80,0.75); font-size: 0.8rem; font-family: 'DM Sans', sans-serif;
    font-weight: 600; padding: 0; transition: color 0.2s;
    display: flex; align-items: center; gap: 5px;
  }
  .ls-clear-btn:hover { color: #f46450; }

  /* ── Main content ── */
  .ls-content { max-width: 1200px; margin: 0 auto; padding: 2rem 2rem 5rem; width: 100%; flex: 1; }

  .ls-count { font-size: 0.82rem; color: rgba(255,255,255,0.35); margin-bottom: 1.5rem; }
  .ls-count strong { color: rgba(255,255,255,0.65); }

  /* ── Card grid ── */
  .ls-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }

  /* ── Listing card ── */
  .ls-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; overflow: hidden; text-decoration: none;
    display: block; transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .ls-card:hover {
    border-color: rgba(201,168,76,0.3); transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }
  .ls-card-img { position: relative; height: 150px; background: rgba(255,255,255,0.04); overflow: hidden; }
  .ls-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
  .ls-card:hover .ls-card-img img { transform: scale(1.04); }

  .ls-badge {
    position: absolute; top: 12px; left: 12px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 6px;
    background: rgba(0,0,0,0.55);
  color: #fff;
  backdrop-filter: blur(8px);
  }
  .ls-badge.hotel {background: rgba(96,165,250,0.9);   /* strong blue */ border: 1px solid rgba(96,165,250,1); color: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
 .ls-badge.shortlet {
  background: linear-gradient(
    135deg,
    rgba(52,211,153,0.95),
    rgba(16,185,129,0.95)
  );
  border: 1px solid rgba(255,255,255,0.15);
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
}
  .ls-badge.sale     { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3);  color: #C9A84C; }
  .ls-badge.rent {
  background: rgba(59,130,246,0.15);
  border: 1px solid rgba(59,130,246,0.3);
  color: #60A5FA;
}

  .ls-img-count {
    position: absolute; bottom: 10px; right: 10px;
    background: rgba(0,0,0,0.55); color: rgba(255,255,255,0.75);
    font-size: 0.68rem; padding: 3px 8px; border-radius: 5px; backdrop-filter: blur(4px);
  }
  .ls-card-no-img {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; color: rgba(255,255,255,0.15);
  }
  .ls-card-no-img span { font-size: 0.75rem; }

  .ls-img-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s, opacity 0.2s;
  opacity: 0;
}

.ls-card-img:hover .ls-img-nav {
  opacity: 1;
}

.ls-img-nav:hover {
  background: rgba(0,0,0,0.8);
}

.ls-img-nav.left {
  left: 8px;
}

.ls-img-nav.right {
  right: 8px;
}

  .ls-stars { display: flex; gap: 2px; margin-bottom: 6px; color: #C9A84C; }

  .ls-card-body { padding: 1rem 1.1rem 1.25rem; }
  .ls-card-title {
    font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 5px; line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
  }
  .ls-card-loc { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: rgba(255,255,255,0.35); margin-bottom: 7px; }
  .ls-card-meta { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: rgba(255,255,255,0.3); margin-bottom: 10px; }
  .ls-card-desc {
    font-size: 0.8rem; color: rgba(255,255,255,0.3); line-height: 1.55;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    margin-bottom: 14px;
  }
  .ls-card-price-row {
    display: flex; align-items: baseline; gap: 6px;
    padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06);
  }
  .ls-card-price { font-size: 1.1rem; font-weight: 700; color: #C9A84C; }
  .ls-card-price-sub { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

  /* ── Skeleton ── */
  .ls-skeleton { background: #111827; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .ls-sk {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 600px 100%; animation: shimmer 1.4s infinite linear; border-radius: 6px;
  }
  .ls-sk-img  { height: 200px; border-radius: 0; }
  .ls-sk-body { padding: 1rem 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 10px; }

  /* ── Empty / error states ── */
  .ls-empty { text-align: center; padding: 6rem 2rem; color: rgba(255,255,255,0.2); grid-column: 1 / -1; }
  .ls-empty-icon { margin: 0 auto 1.25rem; opacity: 0.2; }
  .ls-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem; }
  .ls-empty p { font-size: 0.875rem; color: rgba(255,255,255,0.25); }
  .ls-empty-btn {
    margin-top: 1.5rem; display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3);
    color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    padding: 10px 22px; border-radius: 10px; cursor: pointer; transition: background 0.2s;
    text-decoration: none;
  }
  .ls-empty-btn:hover { background: rgba(201,168,76,0.18); }

  .ls-error { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: #f46450; font-size: 0.9rem; }
  .ls-error button {
    margin-top: 0.75rem; background: none; border: none; cursor: pointer;
    color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; text-decoration: underline;
  }

  /* ── Pagination ── */
  .ls-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 3rem; }
  .ls-page-btn {
    width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5);
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .ls-page-btn:hover:not(:disabled) { border-color: rgba(201,168,76,0.4); color: #C9A84C; }
  .ls-page-btn.active { background: rgba(201,168,76,0.15); border-color: #C9A84C; color: #C9A84C; }
  .ls-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ls-page-ellipsis { color: rgba(255,255,255,0.2); font-size: 0.85rem; padding: 0 4px; }

  /* ── Breadcrumb ── */
  .ls-breadcrumb {
    max-width: 1200px; margin: 0 auto; padding: 1.25rem 2rem 0;
    display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.3);
  }
  .ls-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
  .ls-breadcrumb a:hover { color: #C9A84C; }

  @media (max-width: 640px) {
    .ls-tabs { display: none; }
    .ls-bar-inner { gap: 0.5rem; }
    .ls-grid { grid-template-columns: 1fr; }
    .ls-filter-grid { grid-template-columns: 1fr 1fr; }
  }
`;

// ─── Nigerian states ──────────────────────────────────────────────────────────
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const formatPrice = (n) => "₦" + Number(n).toLocaleString("en-NG");

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const BedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16M2 8h20v12H2M10 8v4M2 12h20"/>
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);
const ChevL = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevR = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const HomeIllo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// ─── Listing Card ────────────────────────────────────────────────────────────
function ListingCard({ listing, rentMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
const nextImage = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setCurrentIndex((prev) => (prev + 1) % images.length);
};

const prevImage = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setCurrentIndex((prev) =>
    prev === 0 ? images.length - 1 : prev - 1
  );
};
  const { _id, type, title, images, location, pricePerNight, price,
          starRating, bedrooms, propertyType, description, contact } = listing;
  let displayPrice;
let priceSuffix = "";

if (type === "sale") {
  displayPrice = price;

} else if (type === "rent") {
  if (rentMode === "month") {
    displayPrice = listing.pricePerMonth || listing.pricePerYear;
    priceSuffix = "/month";
  } else {
    displayPrice = listing.pricePerYear || listing.pricePerMonth;
    priceSuffix = "/year";
  }

} else {
  displayPrice = pricePerNight;
  priceSuffix = "/night";
}
  return (
    <Link href={`/listings/${_id}`} className="ls-card">
      <div className="ls-card-img">
        {images?.length > 0 ? (
  <>
    <img src={images[currentIndex]} alt={title} />

    {images.length > 1 && (
      <>
        <button className="ls-img-nav left" onClick={prevImage}>
          <ChevL />
        </button>

        <button className="ls-img-nav right" onClick={nextImage}>
          <ChevR />
        </button>
      </>
    )}
  </>
) : (
          <div className="ls-card-no-img">
            <HomeIllo />
            <span>No photo</span>
          </div>
        )}
        <span className={`ls-badge ${type}`}>
          {type === "hotel" ? "Hotel" : type === "shortlet" ? "Shortlet" : type === "rent" ? "For Rent" : "For Sale"}
        </span>
        {images?.length > 1 && (
          <span className="ls-img-count">+{images.length - 1} photos</span>
        )}
      </div>

      <div className="ls-card-body">
        {type === "hotel" && starRating && (
          <div className="ls-stars">
            {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < starRating} />)}
          </div>
        )}
        <h3 className="ls-card-title">{title}</h3>
        <p className="ls-card-loc"><LocationIcon /> {location?.city}, {location?.state}</p>
        {(bedrooms || propertyType) && (
          <p className="ls-card-meta">
            {bedrooms ? <><BedIcon /> {bedrooms} Bedroom{bedrooms !== 1 ? "s" : ""}</> : propertyType}
          </p>
        )}
        <p className="ls-card-desc">{description}</p>
        <div className="ls-card-contact">
  {contact?.phone && (
    <span className="ls-contact-item">
      <FiPhone size={14} /> {contact.phone}
    </span>
  )}

  {contact?.email && (
    <span className="ls-contact-item">
      <FiMail size={14} /> {contact.email}
    </span>
  )}

  {contact?.website && (
    <span
      className="ls-contact-item ls-link"
      onClick={(e) => {
        e.stopPropagation();
        window.open(contact.website, "_blank");
      }}
    >
      <FiGlobe size={14} /> Visit Website
    </span>
  )}
</div>
        <div className="ls-card-price-row">
          <span className="ls-card-price">{formatPrice(displayPrice)}</span>
          {priceSuffix && <span className="ls-card-price-sub">{priceSuffix}</span>}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="ls-skeleton">
      <div className="ls-sk ls-sk-img" />
      <div className="ls-sk-body">
        <div className="ls-sk" style={{ height: 14, width: "40%" }} />
        <div className="ls-sk" style={{ height: 16, width: "80%" }} />
        <div className="ls-sk" style={{ height: 12, width: "55%" }} />
        <div className="ls-sk" style={{ height: 12, width: "65%" }} />
        <div className="ls-sk" style={{ height: 12, width: "70%" }} />
        <div className="ls-sk" style={{ height: 20, width: "35%", marginTop: 8 }} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function ListingsContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [listings,    setListings]    = useState([]);
  const [pagination,  setPagination]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    type:      searchParams.get("type")      || "",
    state:     searchParams.get("state")     || "",
    city:      searchParams.get("city")      || "",
    search:    searchParams.get("search")    || "",
    minPrice:  searchParams.get("minPrice")  || "",
    maxPrice:  searchParams.get("maxPrice")  || "",
    bedrooms:  searchParams.get("bedrooms")  || "",
    sortBy:    searchParams.get("sortBy")    || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    rentMode:  searchParams.get("rentMode")  || "year",
    page:      parseInt(searchParams.get("page") || "1", 10),
  });

  const fetchListings = useCallback(async (params) => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) qs.set(k, v);
      });
      const res  = await fetch(`/api/listings?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch listings.");
      setListings(data.listings);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(filters);
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) qs.set(k, String(v));
    });
    router.replace(`/listings?${qs.toString()}`, { scroll: false });
  }, [filters]); 

 const setFilter = (k, v) => {
  setFilters((prev) => ({
    ...prev,
    [k]: v,
    page: 1,

    // 👇 reset rentMode when switching away from rent
    ...(k === "type" && v !== "rent" ? { rentMode: "year" } : {})
  }));
};
  const goToPage     = (p)    => setFilters((prev) => ({ ...prev, page: p }));
  const clearFilters = ()     => setFilters({
    type: "", state: "", city: "", search: "",
    minPrice: "", maxPrice: "", bedrooms: "",
    sortBy: "createdAt", sortOrder: "desc", page: 1,
  });

  const activeFilterCount = [
    filters.type, filters.state, filters.city,
    filters.minPrice, filters.maxPrice, filters.bedrooms,
  ].filter(Boolean).length;

  const buildPages = (total, current) => {
    const pages = Array.from({ length: total }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === total || Math.abs(p - current) <= 1);
    const result = [];
    pages.forEach((p, i) => {
      if (i > 0 && p - pages[i - 1] > 1) result.push("...");
      result.push(p);
    });
    return result;
  };

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="ls-page">
        <Navbar />

        {/* Hero */}
        <div className="ls-hero">
          <div className="ls-hero-inner">
            <div className="ls-eyebrow">Browse Properties</div>
            <h1>Find Your <em>Perfect</em> Property</h1>
            <p>Hotels, shortlets, and homes for sale — across every state in Nigeria.</p>
          </div>
        </div>

        {/* Sticky bar */}
        <div className="ls-bar">
          <div className="ls-bar-inner">
            <div className="ls-search-wrap">
              <span className="ls-search-icon"><SearchIcon /></span>
              <input className="ls-search" type="text" placeholder="Search listings…"
                value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
            </div>

            <div className="ls-tabs">
              {[["", "All"], ["hotel", "Hotels"], ["shortlet", "Shortlets"], ["rent", "For Rent"], ["sale", "For Sale"]].map(
                ([val, label]) => (
                  <button key={val} className={`ls-tab ${filters.type === val ? "active" : ""}`}
                    onClick={() => setFilter("type", val)}>
                    {label}
                  </button>
                )
              )}
            </div>

            <button
              className={`ls-filter-btn ${showFilters || activeFilterCount > 0 ? "active" : ""}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <FilterIcon />
              Filters
              {activeFilterCount > 0 && (
                <span className="ls-filter-badge">{activeFilterCount}</span>
              )}
            </button>

            <select className="ls-sort"
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(":");
                setFilters((p) => ({ ...p, sortBy, sortOrder, page: 1 }));
              }}>
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="price:asc">Price: Low → High</option>
              <option value="price:desc">Price: High → Low</option>
              <option value="pricePerNight:asc">Night: Low → High</option>
              <option value="pricePerNight:desc">Night: High → Low</option>
              <option value="pricePerYear:asc">Rent (Year): Low → High</option>
              <option value="pricePerYear:desc">Rent (Year): High → Low</option>
              <option value="pricePerMonth:asc">Rent (Month): Low → High</option>
              <option value="pricePerMonth:desc">Rent (Month): High → Low</option>
            </select>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="ls-filter-panel">
            <div className="ls-filter-grid">
              <select className="ls-filter-select" value={filters.state}
                onChange={(e) => setFilter("state", e.target.value)}>
                <option value="">All States</option>
                {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <input className="ls-filter-input" type="text" placeholder="City / Area"
                value={filters.city} onChange={(e) => setFilter("city", e.target.value)} />

              <input className="ls-filter-input" type="number" placeholder="Min Price (₦)"
                value={filters.minPrice} onChange={(e) => setFilter("minPrice", e.target.value)} />

              <input className="ls-filter-input" type="number" placeholder="Max Price (₦)"
                value={filters.maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)} />

              {filters.type !== "hotel" && (
                <select className="ls-filter-select" value={filters.bedrooms}
                  onChange={(e) => setFilter("bedrooms", e.target.value)}>
                  <option value="">Any Bedrooms</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} Bedroom{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              )}
              {filters.type === "rent" && (
  <select
    className="ls-filter-select"
    value={filters.rentMode}
    onChange={(e) => setFilter("rentMode", e.target.value)}
  >
    <option value="year">Per Year</option>
    <option value="month">Per Month</option>
  </select>
)}
              {activeFilterCount > 0 && (
                <button className="ls-clear-btn" onClick={clearFilters}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="ls-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Listings</span>
        </div>

        {/* Content */}
        <div className="ls-content">
          {!loading && pagination && (
            <p className="ls-count">
              <strong>{pagination.total.toLocaleString()}</strong>{" "}
              listing{pagination.total !== 1 ? "s" : ""} found
              {filters.search && <> for &ldquo;<strong>{filters.search}</strong>&rdquo;</>}
            </p>
          )}

          <div className="ls-grid">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <div className="ls-error">
                <p>{error}</p>
                <button onClick={() => fetchListings(filters)}>Try again</button>
              </div>
            ) : listings.length === 0 ? (
              <div className="ls-empty">
                <div className="ls-empty-icon"><HomeIllo /></div>
                <h3>No listings found</h3>
                <p>Try adjusting your filters or search terms.</p>
                {activeFilterCount > 0 && (
                  <button className="ls-empty-btn" onClick={clearFilters}>Clear filters</button>
                )}
              </div>
            ) : (
              listings.map((l) => <ListingCard key={l._id} listing={l} rentMode={filters.rentMode}/>)
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination && pagination.totalPages > 1 && (
            <div className="ls-pagination">
              <button className="ls-page-btn" onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}>
                <ChevL />
              </button>
              {buildPages(pagination.totalPages, pagination.page).map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="ls-page-ellipsis">…</span>
                ) : (
                  <button key={p} onClick={() => goToPage(p)}
                    className={`ls-page-btn ${p === pagination.page ? "active" : ""}`}>
                    {p}
                  </button>
                )
              )}
              <button className="ls-page-btn" onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage}>
                <ChevR />
              </button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
export default function ListingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#fff" }}>
      Loading listings...
    </div>}>
      <ListingsContent />
    </Suspense>
  );
}