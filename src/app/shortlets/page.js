"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiPhone, FiMail, FiGlobe } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .sl-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .sl-hero {
    position: relative; padding: 7rem 2rem 3.5rem;
    background: #0D1220;
    border-bottom: 1px solid rgba(52,211,153,0.12);
    overflow: hidden;
  }
  .sl-hero::before {
    content: ''; position: absolute;
    width: 700px; height: 700px; border-radius: 50%;
    background: rgba(52,211,153,0.05); filter: blur(100px);
    top: -200px; right: -200px; pointer-events: none;
  }
  .sl-hero::after {
    content: ''; position: absolute;
    width: 400px; height: 400px; border-radius: 50%;
    background: rgba(201,168,76,0.03); filter: blur(80px);
    bottom: -100px; left: -100px; pointer-events: none;
  }
  .sl-hero-inner { position: relative; max-width: 900px; margin: 0 auto; text-align: center; }
  .sl-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #34D399; margin-bottom: 1.25rem;
  }
  .sl-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.75rem); font-weight: 700; color: #ffffff; line-height: 1.15;
    margin-bottom: 0.85rem;
  }
  .sl-hero h1 em { font-style: italic; color: #34D399; }
  .sl-hero p { font-size: 0.95rem; color: rgba(255,255,255,0.6); line-height: 1.7; }

  /* ── Sticky search/filter bar ── */
  .sl-bar {
    position: sticky; top: 0; z-index: 30;
    background: rgba(13,18,32,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 0.9rem 2rem;
  }
  .sl-bar-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
  }

  .sl-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 360px; }
  .sl-search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.35); pointer-events: none;
  }
  .sl-search {
    width: 100%; padding: 10px 14px 10px 38px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; color: #ffffff; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .sl-search::placeholder { color: rgba(255,255,255,0.3); }
  .sl-search:focus { border-color: rgba(52,211,153,0.5); background: rgba(255,255,255,0.08); }

  .sl-filter-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
    border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.65); transition: all 0.2s;
  }
  .sl-filter-btn:hover { border-color: rgba(52,211,153,0.3); color: #fff; }
  .sl-filter-btn.active { border-color: #34D399; background: rgba(52,211,153,0.1); color: #34D399; }
  .sl-filter-badge {
    background: #34D399; color: #0A0E1A;
    font-size: 0.65rem; font-weight: 700;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  .sl-sort {
    padding: 9px 12px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.7); font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .sl-sort option { background: #0F1525; color: #fff; }
  .sl-sort:focus { border-color: rgba(52,211,153,0.4); }

  /* ── Filter panel ── */
  .sl-filter-panel {
    background: rgba(13,18,32,0.98); border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 1.25rem 2rem;
  }
  .sl-filter-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem;
    align-items: center;
  }
  .sl-filter-input, .sl-filter-select {
    width: 100%; padding: 10px 12px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; color: #ffffff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    outline: none; transition: border-color 0.2s;
  }
  .sl-filter-input::placeholder { color: rgba(255,255,255,0.3); }
  .sl-filter-select option { background: #0F1525; color: #fff; }
  .sl-filter-input:focus, .sl-filter-select:focus { border-color: rgba(52,211,153,0.45); }
  .sl-clear-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(240,100,80,0.85); font-size: 0.8rem; font-family: 'DM Sans', sans-serif;
    font-weight: 600; padding: 0; transition: color 0.2s;
    display: flex; align-items: center; gap: 5px;
  }
  .sl-clear-btn:hover { color: #f46450; }

  /* ── Main content ── */
  .sl-content { max-width: 1200px; margin: 0 auto; padding: 2rem 2rem 5rem; width: 100%; flex: 1; }

  .sl-count { font-size: 0.82rem; color: rgba(255,255,255,0.5); margin-bottom: 1.5rem; }
  .sl-count strong { color: #ffffff; }

  /* ── Card grid ── */
  .sl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }

  /* ── Listing card ── */
  .sl-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; overflow: hidden; text-decoration: none;
    display: block; transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .sl-card:hover {
    border-color: rgba(52,211,153,0.35); transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }
  .sl-card-img { position: relative; height: 170px; background: rgba(255,255,255,0.04); overflow: hidden; }
  .sl-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
  .sl-card:hover .sl-card-img img { transform: scale(1.04); }

  .sl-badge {
    position: absolute; top: 12px; left: 12px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 6px;
    background: linear-gradient(135deg, rgba(52,211,153,0.95), rgba(16,185,129,0.95));
    border: 1px solid rgba(255,255,255,0.15);
    color: #ffffff;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  }

  .sl-img-count {
    position: absolute; bottom: 10px; right: 10px;
    background: rgba(0,0,0,0.55); color: rgba(255,255,255,0.85);
    font-size: 0.68rem; padding: 3px 8px; border-radius: 5px; backdrop-filter: blur(4px);
  }
  .sl-card-no-img {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; color: rgba(255,255,255,0.2);
  }
  .sl-card-no-img span { font-size: 0.75rem; }

  .sl-img-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(0,0,0,0.5); border: none; color: #fff;
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; backdrop-filter: blur(4px);
    transition: background 0.2s, opacity 0.2s; opacity: 0;
  }
  .sl-card-img:hover .sl-img-nav { opacity: 1; }
  .sl-img-nav:hover { background: rgba(0,0,0,0.8); }
  .sl-img-nav.left { left: 8px; }
  .sl-img-nav.right { right: 8px; }

  /* ── Shortlet-specific tags ── */
  .sl-features {
    display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;
  }
  .sl-feature-tag {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2);
    color: #34D399; font-size: 0.7rem; font-weight: 600;
    padding: 3px 9px; border-radius: 5px;
  }

  .sl-card-body { padding: 1rem 1.1rem 1.25rem; }
  .sl-card-title {
    font-size: 0.95rem; font-weight: 600; color: #ffffff; margin-bottom: 5px; line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
  }
  .sl-card-loc { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-bottom: 7px; }
  .sl-card-meta { display: flex; align-items: center; gap: 10px; font-size: 0.78rem; color: rgba(255,255,255,0.45); margin-bottom: 10px; flex-wrap: wrap; }
  .sl-card-meta-item { display: flex; align-items: center; gap: 4px; }
  .sl-card-desc {
    font-size: 0.8rem; color: rgba(255,255,255,0.45); line-height: 1.55;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    margin-bottom: 12px;
  }
  .sl-card-contact {
    display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;
  }
  .sl-contact-item {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.75rem; color: rgba(255,255,255,0.5);
  }
  .sl-link { cursor: pointer; color: #34D399 !important; }
  .sl-link:hover { text-decoration: underline; }

  .sl-card-price-row {
    display: flex; align-items: baseline; gap: 6px;
    padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.07);
  }
  .sl-card-price { font-size: 1.1rem; font-weight: 700; color: #34D399; }
  .sl-card-price-alt { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-left: auto; }
  .sl-card-price-sub { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
  .sl-min-nights {
    font-size: 0.7rem; color: rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 4px; padding: 2px 7px; margin-left: auto;
  }

  /* ── Skeleton ── */
  .sl-skeleton { background: #111827; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .sl-sk {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 600px 100%; animation: shimmer 1.4s infinite linear; border-radius: 6px;
  }
  .sl-sk-img  { height: 170px; border-radius: 0; }
  .sl-sk-body { padding: 1rem 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 10px; }

  /* ── Empty / error states ── */
  .sl-empty { text-align: center; padding: 6rem 2rem; color: rgba(255,255,255,0.25); grid-column: 1 / -1; }
  .sl-empty-icon { margin: 0 auto 1.25rem; opacity: 0.25; }
  .sl-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; }
  .sl-empty p { font-size: 0.875rem; color: rgba(255,255,255,0.3); }
  .sl-empty-btn {
    margin-top: 1.5rem; display: inline-flex; align-items: center; gap: 7px;
    background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3);
    color: #34D399; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    padding: 10px 22px; border-radius: 10px; cursor: pointer; transition: background 0.2s;
    text-decoration: none;
  }
  .sl-empty-btn:hover { background: rgba(52,211,153,0.18); }

  .sl-error { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: #f46450; font-size: 0.9rem; }
  .sl-error button {
    margin-top: 0.75rem; background: none; border: none; cursor: pointer;
    color: #34D399; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; text-decoration: underline;
  }

  /* ── Pagination ── */
  .sl-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 3rem; }
  .sl-page-btn {
    width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .sl-page-btn:hover:not(:disabled) { border-color: rgba(52,211,153,0.4); color: #34D399; }
  .sl-page-btn.active { background: rgba(52,211,153,0.15); border-color: #34D399; color: #34D399; }
  .sl-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .sl-page-ellipsis { color: rgba(255,255,255,0.25); font-size: 0.85rem; padding: 0 4px; }

  /* ── Breadcrumb ── */
  .sl-breadcrumb {
    max-width: 1200px; margin: 0 auto; padding: 1.25rem 2rem 0;
    display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.4);
  }
  .sl-breadcrumb a { color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
  .sl-breadcrumb a:hover { color: #34D399; }

  /* ── Price toggle ── */
  .sl-price-toggle {
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.04); padding: 4px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .sl-price-tab {
    padding: 7px 14px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
    color: rgba(255,255,255,0.5); background: none; transition: all 0.2s; white-space: nowrap;
  }
  .sl-price-tab:hover { color: rgba(255,255,255,0.8); }
  .sl-price-tab.active { background: rgba(52,211,153,0.15); color: #34D399; border: 1px solid rgba(52,211,153,0.3); }

  @media (max-width: 640px) {
    .sl-bar-inner { gap: 0.5rem; }
    .sl-grid { grid-template-columns: 1fr; }
    .sl-filter-grid { grid-template-columns: 1fr 1fr; }
    .sl-price-toggle { display: none; }
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
const BathIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 6 Q9 3 12 3 Q15 3 15 6"/><rect x="2" y="11" width="20" height="4" rx="1"/>
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>
  </svg>
);
const NightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
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

// ─── Shortlet Card ────────────────────────────────────────────────────────────
function ShortletCard({ listing, priceMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const {
    _id, title, images, location,
    pricePerNight, pricePerWeek,
    bedrooms, bathrooms, toilets,
    minNights, description, contact,
  } = listing;

  // Determine display price based on toggle
  let displayPrice, priceSuffix, altPrice, altSuffix;
  if (priceMode === "week" && pricePerWeek) {
    displayPrice = pricePerWeek;
    priceSuffix  = "/week";
    altPrice     = pricePerNight;
    altSuffix    = "/night";
  } else {
    displayPrice = pricePerNight;
    priceSuffix  = "/night";
    if (pricePerWeek) {
      altPrice   = pricePerWeek;
      altSuffix  = "/week";
    }
  }

  return (
    <Link href={`/listings/${_id}`} className="sl-card">
      <div className="sl-card-img">
        {images?.length > 0 ? (
          <>
            <img src={images[currentIndex]} alt={title} />
            {images.length > 1 && (
              <>
                <button className="sl-img-nav left" onClick={prevImage}><ChevL /></button>
                <button className="sl-img-nav right" onClick={nextImage}><ChevR /></button>
              </>
            )}
          </>
        ) : (
          <div className="sl-card-no-img">
            <HomeIllo />
            <span>No photo</span>
          </div>
        )}
        <span className="sl-badge">Shortlet</span>
        {images?.length > 1 && (
          <span className="sl-img-count">+{images.length - 1} photos</span>
        )}
      </div>

      <div className="sl-card-body">
        <h3 className="sl-card-title">{title}</h3>
        <p className="sl-card-loc"><LocationIcon /> {location?.city}, {location?.state}</p>

        {/* Beds / Baths row */}
        <div className="sl-card-meta">
          {bedrooms > 0 && (
            <span className="sl-card-meta-item"><BedIcon /> {bedrooms} Bed{bedrooms !== 1 ? "s" : ""}</span>
          )}
          {bathrooms > 0 && (
            <span className="sl-card-meta-item"><BathIcon /> {bathrooms} Bath{bathrooms !== 1 ? "s" : ""}</span>
          )}
          {minNights > 1 && (
            <span className="sl-card-meta-item"><NightIcon /> {minNights} night min</span>
          )}
        </div>

        <p className="sl-card-desc">{description}</p>

        {/* Contact */}
        {(contact?.phone || contact?.email || contact?.website) && (
          <div className="sl-card-contact">
            {contact.phone && (
              <span className="sl-contact-item">
                <FiPhone size={13} /> {contact.phone}
              </span>
            )}
            {contact.email && (
              <span className="sl-contact-item">
                <FiMail size={13} /> {contact.email}
              </span>
            )}
            {contact.website && (
              <span
                className="sl-contact-item sl-link"
                onClick={(e) => { e.stopPropagation(); window.open(contact.website, "_blank"); }}
              >
                <FiGlobe size={13} /> Visit Website
              </span>
            )}
          </div>
        )}

        <div className="sl-card-price-row">
          <span className="sl-card-price">{formatPrice(displayPrice)}</span>
          <span className="sl-card-price-sub">{priceSuffix}</span>
          {altPrice && (
            <span className="sl-card-price-alt">
              {formatPrice(altPrice)}{altSuffix}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="sl-skeleton">
      <div className="sl-sk sl-sk-img" />
      <div className="sl-sk-body">
        <div className="sl-sk" style={{ height: 16, width: "80%" }} />
        <div className="sl-sk" style={{ height: 12, width: "55%" }} />
        <div className="sl-sk" style={{ height: 12, width: "70%" }} />
        <div className="sl-sk" style={{ height: 12, width: "65%" }} />
        <div className="sl-sk" style={{ height: 20, width: "40%", marginTop: 8 }} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ShortletsPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [listings,    setListings]    = useState([]);
  const [pagination,  setPagination]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    state:     searchParams.get("state")     || "",
    city:      searchParams.get("city")      || "",
    search:    searchParams.get("search")    || "",
    minPrice:  searchParams.get("minPrice")  || "",
    maxPrice:  searchParams.get("maxPrice")  || "",
    bedrooms:  searchParams.get("bedrooms")  || "",
    sortBy:    searchParams.get("sortBy")    || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    priceMode: searchParams.get("priceMode") || "night",
    page:      parseInt(searchParams.get("page") || "1", 10),
  });

  const fetchListings = useCallback(async (params) => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams();
      // Always filter for shortlets
      qs.set("type", "shortlet");
      Object.entries(params).forEach(([k, v]) => {
        if (k !== "priceMode" && v !== "" && v !== null && v !== undefined) {
          qs.set(k, v);
        }
      });
      const res  = await fetch(`/api/listings?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch shortlets.");
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
    router.replace(`/shortlets?${qs.toString()}`, { scroll: false });
  }, [filters]);

  const setFilter = (k, v) =>
    setFilters((prev) => ({ ...prev, [k]: v, page: 1 }));

  const goToPage = (p) => setFilters((prev) => ({ ...prev, page: p }));

  const clearFilters = () =>
    setFilters({
      state: "", city: "", search: "",
      minPrice: "", maxPrice: "", bedrooms: "",
      sortBy: "createdAt", sortOrder: "desc",
      priceMode: "night", page: 1,
    });

  const activeFilterCount = [
    filters.state, filters.city,
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
      <div className="sl-page">
        <Navbar />

        {/* Hero */}
        <div className="sl-hero">
          <div className="sl-hero-inner">
            <div className="sl-eyebrow">🏠 Shortlet Apartments</div>
            <h1>Find Your <em>Perfect</em> Shortlet</h1>
            <p>Fully furnished apartments for short stays — across every state in Nigeria.</p>
          </div>
        </div>

        {/* Sticky bar */}
        <div className="sl-bar">
          <div className="sl-bar-inner">
            <div className="sl-search-wrap">
              <span className="sl-search-icon"><SearchIcon /></span>
              <input
                className="sl-search" type="text" placeholder="Search shortlets…"
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>

            {/* Price mode toggle */}
            <div className="sl-price-toggle">
              {[["night", "Per Night"], ["week", "Per Week"]].map(([val, label]) => (
                <button
                  key={val}
                  className={`sl-price-tab ${filters.priceMode === val ? "active" : ""}`}
                  onClick={() => setFilter("priceMode", val)}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              className={`sl-filter-btn ${showFilters || activeFilterCount > 0 ? "active" : ""}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <FilterIcon />
              Filters
              {activeFilterCount > 0 && (
                <span className="sl-filter-badge">{activeFilterCount}</span>
              )}
            </button>

            <select
              className="sl-sort"
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(":");
                setFilters((p) => ({ ...p, sortBy, sortOrder, page: 1 }));
              }}
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="pricePerNight:asc">Price/Night: Low → High</option>
              <option value="pricePerNight:desc">Price/Night: High → Low</option>
              <option value="pricePerWeek:asc">Price/Week: Low → High</option>
              <option value="pricePerWeek:desc">Price/Week: High → Low</option>
            </select>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="sl-filter-panel">
            <div className="sl-filter-grid">
              <select
                className="sl-filter-select" value={filters.state}
                onChange={(e) => setFilter("state", e.target.value)}
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <input
                className="sl-filter-input" type="text" placeholder="City / Area"
                value={filters.city} onChange={(e) => setFilter("city", e.target.value)}
              />

              <input
                className="sl-filter-input" type="number" placeholder="Min Price (₦)"
                value={filters.minPrice} onChange={(e) => setFilter("minPrice", e.target.value)}
              />

              <input
                className="sl-filter-input" type="number" placeholder="Max Price (₦)"
                value={filters.maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)}
              />

              <select
                className="sl-filter-select" value={filters.bedrooms}
                onChange={(e) => setFilter("bedrooms", e.target.value)}
              >
                <option value="">Any Bedrooms</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Bedroom{n > 1 ? "s" : ""}</option>
                ))}
              </select>

              {activeFilterCount > 0 && (
                <button className="sl-clear-btn" onClick={clearFilters}>
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
        <div className="sl-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
          <Link href="/listings">Listings</Link>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Shortlets</span>
        </div>

        {/* Content */}
        <div className="sl-content">
          {!loading && pagination && (
            <p className="sl-count">
              <strong>{pagination.total.toLocaleString()}</strong>{" "}
              shortlet{pagination.total !== 1 ? "s" : ""} found
              {filters.search && <> for &ldquo;<strong>{filters.search}</strong>&rdquo;</>}
            </p>
          )}

          <div className="sl-grid">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <div className="sl-error">
                <p>{error}</p>
                <button onClick={() => fetchListings(filters)}>Try again</button>
              </div>
            ) : listings.length === 0 ? (
              <div className="sl-empty">
                <div className="sl-empty-icon"><HomeIllo /></div>
                <h3>No shortlets found</h3>
                <p>Try adjusting your filters or search terms.</p>
                {activeFilterCount > 0 && (
                  <button className="sl-empty-btn" onClick={clearFilters}>Clear filters</button>
                )}
              </div>
            ) : (
              listings.map((l) => (
                <ShortletCard key={l._id} listing={l} priceMode={filters.priceMode} />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination && pagination.totalPages > 1 && (
            <div className="sl-pagination">
              <button
                className="sl-page-btn"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <ChevL />
              </button>
              {buildPages(pagination.totalPages, pagination.page).map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="sl-page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`sl-page-btn ${p === pagination.page ? "active" : ""}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                className="sl-page-btn"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
              >
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
