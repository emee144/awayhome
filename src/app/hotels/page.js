"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .ht-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .ht-hero {
    position: relative; padding: 7rem 2rem 3.5rem;
    background: #0D1220;
    border-bottom: 1px solid rgba(201,168,76,0.12);
    overflow: hidden;
  }
  .ht-hero::before {
    content: ''; position: absolute;
    width: 600px; height: 600px; border-radius: 50%;
    background: rgba(201,168,76,0.05); filter: blur(90px);
    top: -180px; right: -150px; pointer-events: none;
  }
  .ht-hero::after {
    content: ''; position: absolute;
    width: 400px; height: 400px; border-radius: 50%;
    background: rgba(96,165,250,0.04); filter: blur(80px);
    bottom: -100px; left: -100px; pointer-events: none;
  }
  .ht-hero-inner { position: relative; max-width: 860px; margin: 0 auto; text-align: center; }
  .ht-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem;
  }
  .ht-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #C9A84C;
    animation: htpulse 2s infinite;
  }
  @keyframes htpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
  .ht-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.9rem, 4vw, 2.9rem); font-weight: 700; color: #fff;
    line-height: 1.15; margin-bottom: 0.9rem;
  }
  .ht-hero h1 em { font-style: italic; color: #C9A84C; }
  .ht-hero p { font-size: 0.95rem; color: rgba(255,255,255,0.4); line-height: 1.75; max-width: 560px; margin: 0 auto; }

  /* ── Hero stats strip ── */
  .ht-stats {
    display: flex; justify-content: center; gap: 2.5rem; margin-top: 2.25rem;
    flex-wrap: wrap;
  }
  .ht-stat { text-align: center; }
  .ht-stat-num { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #C9A84C; }
  .ht-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

  /* ── Sticky bar ── */
  .ht-bar {
    position: sticky; top: 0; z-index: 30;
    background: rgba(13,18,32,0.96); backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 0.85rem 2rem;
  }
  .ht-bar-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap;
  }

  /* Search */
  .ht-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }
  .ht-search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.28); pointer-events: none;
  }
  .ht-search {
    width: 100%; padding: 10px 14px 10px 38px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.11);
    border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .ht-search::placeholder { color: rgba(255,255,255,0.22); }
  .ht-search:focus { border-color: rgba(201,168,76,0.5); background: rgba(255,255,255,0.08); }

  /* Star filter tabs */
  .ht-stars-row {
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.04); padding: 4px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.07);
  }
  .ht-star-tab {
    display: flex; align-items: center; gap: 4px;
    padding: 6px 12px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
    color: rgba(255,255,255,0.4); background: none; transition: all 0.2s; white-space: nowrap;
  }
  .ht-star-tab:hover { color: rgba(255,255,255,0.72); }
  .ht-star-tab.active { background: rgba(201,168,76,0.15); color: #C9A84C; border: 1px solid rgba(201,168,76,0.3); }

  /* Filter button */
  .ht-filter-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 15px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
    border: 1px solid rgba(255,255,255,0.11); background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.5); transition: all 0.2s;
  }
  .ht-filter-btn:hover { border-color: rgba(201,168,76,0.3); color: rgba(255,255,255,0.8); }
  .ht-filter-btn.active { border-color: #C9A84C; background: rgba(201,168,76,0.1); color: #C9A84C; }
  .ht-filter-badge {
    background: #C9A84C; color: #0A0E1A;
    font-size: 0.62rem; font-weight: 700;
    width: 17px; height: 17px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  /* Sort */
  .ht-sort {
    padding: 9px 12px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
    color: rgba(255,255,255,0.5); font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .ht-sort option { background: #0F1525; color: #fff; }
  .ht-sort:focus { border-color: rgba(201,168,76,0.4); }

  /* List a hotel CTA */
  .ht-cta-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 16px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 700;
    background: linear-gradient(135deg, #C9A84C, #E8C878);
    color: #0A0E1A; border: none; text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s; white-space: nowrap;
  }
  .ht-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.3); }

  /* ── Filter panel ── */
  .ht-filter-panel {
    background: rgba(11,15,28,0.98); border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 1.25rem 2rem;
  }
  .ht-filter-grid {
    max-width: 1280px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 0.75rem;
    align-items: center;
  }
  .ht-filter-input, .ht-filter-select {
    width: 100%; padding: 10px 12px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.11);
    border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    outline: none; transition: border-color 0.2s;
  }
  .ht-filter-input::placeholder { color: rgba(255,255,255,0.22); }
  .ht-filter-select option { background: #0F1525; }
  .ht-filter-input:focus, .ht-filter-select:focus { border-color: rgba(201,168,76,0.45); }
  .ht-clear-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(240,100,80,0.7); font-size: 0.8rem; font-family: 'DM Sans', sans-serif;
    font-weight: 600; padding: 0; transition: color 0.2s;
    display: flex; align-items: center; gap: 5px;
  }
  .ht-clear-btn:hover { color: #f46450; }

  /* ── Breadcrumb ── */
  .ht-breadcrumb {
    max-width: 1280px; margin: 0 auto; padding: 1.25rem 2rem 0;
    display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.28);
  }
  .ht-breadcrumb a { color: rgba(255,255,255,0.28); text-decoration: none; transition: color 0.2s; }
  .ht-breadcrumb a:hover { color: #C9A84C; }
  .ht-breadcrumb-sep { color: rgba(255,255,255,0.13); }

  /* ── Content ── */
  .ht-content { max-width: 1280px; margin: 0 auto; padding: 2rem 2rem 5rem; width: 100%; flex: 1; }
  .ht-count { font-size: 0.82rem; color: rgba(255,255,255,0.32); margin-bottom: 1.5rem; }
  .ht-count strong { color: rgba(255,255,255,0.6); }

  /* ── Grid ── */
  .ht-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.3rem; }

  /* ── Hotel Card ── */
  .ht-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden; text-decoration: none; display: block;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .ht-card:hover {
    border-color: rgba(201,168,76,0.32); transform: translateY(-4px);
    box-shadow: 0 20px 56px rgba(0,0,0,0.45);
  }

  /* Image */
  .ht-card-img { position: relative; height: 210px; background: rgba(255,255,255,0.04); overflow: hidden; }
  .ht-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.38s; }
  .ht-card:hover .ht-card-img img { transform: scale(1.05); }

  /* Overlays */
  .ht-card-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,14,26,0.7) 0%, transparent 55%);
    pointer-events: none;
  }
  .ht-card-img-count {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,0,0,0.5); color: rgba(255,255,255,0.7);
    font-size: 0.68rem; padding: 3px 8px; border-radius: 5px; backdrop-filter: blur(4px);
  }

  /* Star rating badge — bottom of image */
  .ht-card-stars-img {
    position: absolute; bottom: 12px; left: 12px;
    display: flex; gap: 2px; align-items: center;
  }

  /* No image placeholder */
  .ht-card-noimg {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 10px; color: rgba(255,255,255,0.12);
  }
  .ht-card-noimg span { font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; }

  /* Body */
  .ht-card-body { padding: 1.1rem 1.2rem 1.3rem; }
  .ht-card-title {
    font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 6px; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
  }
  .ht-card-loc {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.78rem; color: rgba(255,255,255,0.32); margin-bottom: 10px;
  }
  .ht-card-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .ht-pill {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em;
    padding: 3px 9px; border-radius: 100px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.45);
  }
  .ht-pill.gold { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.28); color: #C9A84C; }

  .ht-card-desc {
    font-size: 0.8rem; color: rgba(255,255,255,0.28); line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    margin-bottom: 14px;
  }

  /* Amenity chips */
  .ht-card-amenities { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
  .ht-amenity-chip {
    font-size: 0.68rem; padding: 2px 8px; border-radius: 5px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.35);
  }
  .ht-amenity-more { color: rgba(201,168,76,0.6); font-size: 0.68rem; padding: 2px 6px; }

  /* Price row */
  .ht-card-price-row {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 13px; border-top: 1px solid rgba(255,255,255,0.06);
  }
  .ht-card-price-left { display: flex; align-items: baseline; gap: 5px; }
  .ht-card-price { font-size: 1.15rem; font-weight: 700; color: #C9A84C; }
  .ht-card-price-sub { font-size: 0.72rem; color: rgba(255,255,255,0.28); }
  .ht-card-rooms {
    font-size: 0.72rem; color: rgba(255,255,255,0.28);
    display: flex; align-items: center; gap: 4px;
  }

  /* ── Skeleton ── */
  .ht-skeleton { background: #111827; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; overflow: hidden; }
  @keyframes htShimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .ht-sk {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 600px 100%; animation: htShimmer 1.4s infinite linear; border-radius: 6px;
  }
  .ht-sk-img  { height: 210px; border-radius: 0; }
  .ht-sk-body { padding: 1.1rem 1.2rem; display: flex; flex-direction: column; gap: 10px; }

  /* ── Empty / error ── */
  .ht-empty { grid-column: 1 / -1; text-align: center; padding: 6rem 2rem; }
  .ht-empty-icon { margin: 0 auto 1.5rem; color: rgba(255,255,255,0.1); }
  .ht-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: rgba(255,255,255,0.35); margin-bottom: 0.5rem; }
  .ht-empty p { font-size: 0.875rem; color: rgba(255,255,255,0.22); margin-bottom: 1.5rem; }
  .ht-empty-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3);
    color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    padding: 10px 22px; border-radius: 10px; cursor: pointer; transition: background 0.2s;
    text-decoration: none;
  }
  .ht-empty-btn:hover { background: rgba(201,168,76,0.18); }
  .ht-error { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: #f46450; font-size: 0.9rem; }
  .ht-error button {
    margin-top: 0.75rem; background: none; border: none; cursor: pointer;
    color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; text-decoration: underline; display: block; margin: 0.75rem auto 0;
  }

  /* ── Pagination ── */
  .ht-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 3.5rem; }
  .ht-page-btn {
    width: 37px; height: 37px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.45);
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .ht-page-btn:hover:not(:disabled) { border-color: rgba(201,168,76,0.4); color: #C9A84C; }
  .ht-page-btn.active { background: rgba(201,168,76,0.15); border-color: #C9A84C; color: #C9A84C; }
  .ht-page-btn:disabled { opacity: 0.28; cursor: not-allowed; }
  .ht-page-ellipsis { color: rgba(255,255,255,0.2); font-size: 0.85rem; padding: 0 4px; }

  @media (max-width: 680px) {
    .ht-stars-row { display: none; }
    .ht-cta-btn span { display: none; }
    .ht-grid { grid-template-columns: 1fr; }
    .ht-filter-grid { grid-template-columns: 1fr 1fr; }
    .ht-bar-inner { gap: 0.5rem; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
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
const StarIcon = ({ filled, size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);
const DoorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="2" width="18" height="20" rx="1"/><line x1="9" y1="12" x2="9.01" y2="12" strokeWidth="3"/>
  </svg>
);
const HotelIllo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="1" y="3" width="22" height="18" rx="1"/>
    <path d="M16 8h2v5h-2zM6 8h2v5H6zM11 8h2v5h-2z"/>
    <path d="M1 21h22M7 21v-4h10v4"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── Hotel Card ───────────────────────────────────────────────────────────────
function HotelCard({ hotel }) {
  const {
    _id, title, images, location, pricePerNight,
    starRating, totalRooms, description, amenities,
  } = hotel;

  const stars    = parseInt(starRating) || 0;
  const visibleA = (amenities || []).slice(0, 3);
  const extraA   = (amenities || []).length - visibleA.length;

  return (
    <Link href={`/listings/${_id}`} className="ht-card">
      {/* Image */}
      <div className="ht-card-img">
        {images?.[0] ? (
          <>
            <img src={images[0]} alt={title} />
            <div className="ht-card-gradient" />
          </>
        ) : (
          <div className="ht-card-noimg">
            <HotelIllo />
            <span>No photo</span>
          </div>
        )}

        {/* Stars overlaid on image */}
        {stars > 0 && (
          <div className="ht-card-stars-img">
            {Array.from({ length: stars }).map((_, i) => (
              <StarIcon key={i} filled size={14} />
            ))}
          </div>
        )}

        {images?.length > 1 && (
          <span className="ht-card-img-count">+{images.length - 1}</span>
        )}
      </div>

      {/* Body */}
      <div className="ht-card-body">
        <h3 className="ht-card-title">{title}</h3>

        <p className="ht-card-loc">
          <LocationIcon />
          {location?.city}, {location?.state}
        </p>

        {/* Pills */}
        <div className="ht-card-pills">
          {stars > 0 && (
            <span className="ht-pill gold">{stars}-Star Hotel</span>
          )}
          {!stars && <span className="ht-pill">Unrated</span>}
        </div>

        {/* Description */}
        <p className="ht-card-desc">{description}</p>

        {/* Amenities */}
        {visibleA.length > 0 && (
          <div className="ht-card-amenities">
            {visibleA.map((a) => (
              <span key={a} className="ht-amenity-chip">{a}</span>
            ))}
            {extraA > 0 && (
              <span className="ht-amenity-more">+{extraA} more</span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="ht-card-price-row">
          <div className="ht-card-price-left">
            <span className="ht-card-price">{formatPrice(pricePerNight)}</span>
            <span className="ht-card-price-sub">/night</span>
          </div>
          {totalRooms && (
            <span className="ht-card-rooms">
              <DoorIcon />
              {Number(totalRooms).toLocaleString()} rooms
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
    <div className="ht-skeleton">
      <div className="ht-sk ht-sk-img" />
      <div className="ht-sk-body">
        <div className="ht-sk" style={{ height: 16, width: "75%" }} />
        <div className="ht-sk" style={{ height: 12, width: "50%" }} />
        <div className="ht-sk" style={{ height: 12, width: "30%" }} />
        <div className="ht-sk" style={{ height: 12, width: "90%" }} />
        <div className="ht-sk" style={{ height: 12, width: "80%" }} />
        <div className="ht-sk" style={{ height: 22, width: "40%", marginTop: 8 }} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HotelsPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [hotels,      setHotels]      = useState([]);
  const [pagination,  setPagination]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search:    searchParams.get("search")    || "",
    starRating:searchParams.get("starRating")|| "",   // 1-5
    state:     searchParams.get("state")     || "",
    city:      searchParams.get("city")      || "",
    minPrice:  searchParams.get("minPrice")  || "",
    maxPrice:  searchParams.get("maxPrice")  || "",
    sortBy:    searchParams.get("sortBy")    || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page:      parseInt(searchParams.get("page") || "1", 10),
  });

  const fetchHotels = useCallback(async (params) => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({ type: "hotel" });
      Object.entries(params).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) qs.set(k, v);
      });
      const res  = await fetch(`/api/auth/listings?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load hotels.");
      setHotels(data.listings);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels(filters);
    const qs = new URLSearchParams({ type: "hotel" });
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) qs.set(k, String(v));
    });
    router.replace(`/hotels?${qs.toString()}`, { scroll: false });
  }, [filters]);

  const setFilter    = (k, v) => setFilters((p) => ({ ...p, [k]: v, page: 1 }));
  const goToPage     = (p)    => setFilters((prev) => ({ ...prev, page: p }));
  const clearFilters = ()     => setFilters({
    search: "", starRating: "", state: "", city: "",
    minPrice: "", maxPrice: "",
    sortBy: "createdAt", sortOrder: "desc", page: 1,
  });

  const activeFilterCount = [
    filters.state, filters.city, filters.minPrice, filters.maxPrice, filters.starRating,
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
      <div className="ht-page">
        <Navbar />

        {/* ── Hero ── */}
        <div className="ht-hero">
          <div className="ht-hero-inner">
            <div className="ht-eyebrow">
              <span className="ht-eyebrow-dot" />
              Hotels in Nigeria
            </div>
            <h1>Find <em>Exceptional</em> Hotels</h1>
            <p>
              From boutique guesthouses to 5-star luxury. Browse verified hotels
              across all 36 states and the FCT.
            </p>
            {pagination && !loading && (
              <div className="ht-stats">
                <div className="ht-stat">
                  <div className="ht-stat-num">{pagination.total.toLocaleString()}</div>
                  <div className="ht-stat-label">Hotels Listed</div>
                </div>
                <div className="ht-stat">
                  <div className="ht-stat-num">37</div>
                  <div className="ht-stat-label">States Covered</div>
                </div>
                <div className="ht-stat">
                  <div className="ht-stat-num">Free</div>
                  <div className="ht-stat-label">Direct Booking</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky bar ── */}
        <div className="ht-bar">
          <div className="ht-bar-inner">
            {/* Search */}
            <div className="ht-search-wrap">
              <span className="ht-search-icon"><SearchIcon /></span>
              <input className="ht-search" type="text" placeholder="Search hotels…"
                value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
            </div>

            {/* Star tabs */}
            <div className="ht-stars-row">
              {[["", "All"], ["5", "★★★★★"], ["4", "★★★★"], ["3", "★★★"], ["1", "1–2★"]].map(
                ([val, label]) => (
                  <button key={val}
                    className={`ht-star-tab ${filters.starRating === val ? "active" : ""}`}
                    onClick={() => setFilter("starRating", val)}>
                    {label}
                  </button>
                )
              )}
            </div>

            {/* Filter button */}
            <button
              className={`ht-filter-btn ${showFilters || activeFilterCount > 0 ? "active" : ""}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <FilterIcon />
              Filters
              {activeFilterCount > 0 && (
                <span className="ht-filter-badge">{activeFilterCount}</span>
              )}
            </button>

            {/* Sort */}
            <select className="ht-sort"
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(":");
                setFilters((p) => ({ ...p, sortBy, sortOrder, page: 1 }));
              }}>
              <option value="createdAt:desc">Newest First</option>
              <option value="pricePerNight:asc">Price: Low → High</option>
              <option value="pricePerNight:desc">Price: High → Low</option>
              <option value="starRating:desc">Stars: High → Low</option>
              <option value="starRating:asc">Stars: Low → High</option>
            </select>

            {/* List a hotel */}
            <Link href="/list-property" className="ht-cta-btn">
              <PlusIcon />
              <span>List a Hotel</span>
            </Link>
          </div>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="ht-filter-panel">
            <div className="ht-filter-grid">
              <select className="ht-filter-select" value={filters.state}
                onChange={(e) => setFilter("state", e.target.value)}>
                <option value="">All States</option>
                {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <input className="ht-filter-input" type="text" placeholder="City / Area"
                value={filters.city} onChange={(e) => setFilter("city", e.target.value)} />

              <input className="ht-filter-input" type="number" placeholder="Min Price/Night (₦)"
                value={filters.minPrice} onChange={(e) => setFilter("minPrice", e.target.value)} />

              <input className="ht-filter-input" type="number" placeholder="Max Price/Night (₦)"
                value={filters.maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)} />

              <select className="ht-filter-select" value={filters.starRating}
                onChange={(e) => setFilter("starRating", e.target.value)}>
                <option value="">Any Star Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
                <option value="0">Unrated</option>
              </select>

              {activeFilterCount > 0 && (
                <button className="ht-clear-btn" onClick={clearFilters}>
                  <CloseIcon /> Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Breadcrumb ── */}
        <div className="ht-breadcrumb">
          <Link href="/">Home</Link>
          <span className="ht-breadcrumb-sep">›</span>
          <Link href="/listings">Listings</Link>
          <span className="ht-breadcrumb-sep">›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Hotels</span>
        </div>

        {/* ── Content ── */}
        <div className="ht-content">
          {!loading && pagination && (
            <p className="ht-count">
              <strong>{pagination.total.toLocaleString()}</strong>{" "}
              hotel{pagination.total !== 1 ? "s" : ""} found
              {filters.search && <> for &ldquo;<strong>{filters.search}</strong>&rdquo;</>}
              {filters.state  && <> in <strong>{filters.state}</strong></>}
            </p>
          )}

          <div className="ht-grid">
            {loading ? (
              Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <div className="ht-error">
                <p>{error}</p>
                <button onClick={() => fetchHotels(filters)}>Try again</button>
              </div>
            ) : hotels.length === 0 ? (
              <div className="ht-empty">
                <div className="ht-empty-icon"><HotelIllo /></div>
                <h3>No hotels found</h3>
                <p>Try adjusting your filters, or be the first to list a hotel here.</p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  {activeFilterCount > 0 && (
                    <button className="ht-empty-btn" onClick={clearFilters}>Clear filters</button>
                  )}
                  <Link href="/list-property" className="ht-empty-btn">List a Hotel</Link>
                </div>
              </div>
            ) : (
              hotels.map((h) => <HotelCard key={h._id} hotel={h} />)
            )}
          </div>

          {/* ── Pagination ── */}
          {!loading && pagination && pagination.totalPages > 1 && (
            <div className="ht-pagination">
              <button className="ht-page-btn"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}>
                <ChevL />
              </button>

              {buildPages(pagination.totalPages, pagination.page).map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="ht-page-ellipsis">…</span>
                ) : (
                  <button key={p}
                    className={`ht-page-btn ${p === pagination.page ? "active" : ""}`}
                    onClick={() => goToPage(p)}>
                    {p}
                  </button>
                )
              )}

              <button className="ht-page-btn"
                onClick={() => goToPage(pagination.page + 1)}
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