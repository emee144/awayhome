"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiPhone, FiMail } from "react-icons/fi";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .by-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .by-hero {
    position: relative; padding: 7.5rem 2rem 4.5rem;
    background: #0D1220; border-bottom: 1px solid rgba(201,168,76,0.12); overflow: hidden;
  }
  .by-hero::before {
    content: ''; position: absolute; width: 750px; height: 750px; border-radius: 50%;
    background: rgba(201,168,76,0.05); filter: blur(110px);
    top: -280px; right: -180px; pointer-events: none;
  }
  .by-hero::after {
    content: ''; position: absolute; width: 450px; height: 450px; border-radius: 50%;
    background: rgba(52,211,153,0.03); filter: blur(90px);
    bottom: -150px; left: -80px; pointer-events: none;
  }
  .by-hero-inner { position: relative; max-width: 820px; margin: 0 auto; text-align: center; }
  .by-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem;
  }
  .by-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #C9A84C; animation: bypulse 2s infinite; }
  @keyframes bypulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
  .by-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4.5vw, 3.1rem); font-weight: 700;
    color: #fff; line-height: 1.12; margin-bottom: 0.9rem;
  }
  .by-hero h1 em { font-style: italic; color: #C9A84C; }
  .by-hero p { font-size: 0.95rem; color: rgba(255,255,255,0.4); line-height: 1.75; max-width: 520px; margin: 0 auto 2.25rem; }

  /* Stats strip */
  .by-stats {
    display: inline-flex; gap: 0; border: 1px solid rgba(201,168,76,0.15);
    border-radius: 14px; overflow: hidden; background: rgba(201,168,76,0.04);
  }
  .by-stat { padding: 1.1rem 2rem; text-align: center; border-right: 1px solid rgba(201,168,76,0.12); }
  .by-stat:last-child { border-right: none; }
  .by-stat-num { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; color: #C9A84C; }
  .by-stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.32); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }

  /* ── Sticky bar ── */
  .by-bar {
    position: sticky; top: 0; z-index: 30;
    background: rgba(13,18,32,0.96); backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255,255,255,0.07); padding: 0.85rem 2rem;
  }
  .by-bar-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap;
  }

  /* Search */
  .by-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }
  .by-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.28); pointer-events: none; }
  .by-search {
    width: 100%; padding: 10px 14px 10px 38px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.11);
    border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .by-search::placeholder { color: rgba(255,255,255,0.22); }
  .by-search:focus { border-color: rgba(201,168,76,0.5); background: rgba(255,255,255,0.08); }

  /* Property type tabs */
  .by-type-tabs {
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.04); padding: 4px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.07);
  }
  .by-type-tab {
    padding: 6px 13px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
    color: rgba(255,255,255,0.4); background: none; transition: all 0.2s; white-space: nowrap;
  }
  .by-type-tab:hover { color: rgba(255,255,255,0.72); }
  .by-type-tab.active { background: rgba(201,168,76,0.15); color: #C9A84C; border: 1px solid rgba(201,168,76,0.3); }

  /* Filter button */
  .by-filter-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 15px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
    border: 1px solid rgba(255,255,255,0.11); background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.5); transition: all 0.2s;
  }
  .by-filter-btn:hover { border-color: rgba(201,168,76,0.3); color: rgba(255,255,255,0.8); }
  .by-filter-btn.active { border-color: #C9A84C; background: rgba(201,168,76,0.1); color: #C9A84C; }
  .by-filter-badge {
    background: #C9A84C; color: #0A0E1A; font-size: 0.62rem; font-weight: 700;
    width: 17px; height: 17px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  /* Sort */
  .by-sort {
    padding: 9px 12px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
    color: rgba(255,255,255,0.5); font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .by-sort option { background: #0F1525; color: #fff; }
  .by-sort:focus { border-color: rgba(201,168,76,0.4); }

  /* List CTA */
  .by-cta-btn {
    display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 700;
    background: linear-gradient(135deg, #C9A84C, #E8C878);
    color: #0A0E1A; border: none; text-decoration: none; white-space: nowrap;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .by-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.3); }

  /* ── Filter panel ── */
  .by-filter-panel {
    background: rgba(11,15,28,0.98); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 1.25rem 2rem;
  }
  .by-filter-grid {
    max-width: 1280px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 0.75rem; align-items: center;
  }
  .by-filter-input, .by-filter-select {
    width: 100%; padding: 10px 12px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.11);
    border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    outline: none; transition: border-color 0.2s;
  }
  .by-filter-input::placeholder { color: rgba(255,255,255,0.22); }
  .by-filter-select option { background: #0F1525; }
  .by-filter-input:focus, .by-filter-select:focus { border-color: rgba(201,168,76,0.45); }

  /* Negotiable toggle */
  .by-nego-toggle {
    display: flex; align-items: center; gap: 9px; cursor: pointer;
    padding: 10px 14px; border-radius: 10px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.11);
    transition: border-color 0.2s;
  }
  .by-nego-toggle:hover { border-color: rgba(201,168,76,0.3); }
  .by-nego-toggle.on { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.07); }
  .by-nego-box {
    width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
    border: 1.5px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .by-nego-toggle.on .by-nego-box { background: #C9A84C; border-color: #C9A84C; }
  .by-nego-label { font-size: 0.82rem; color: rgba(255,255,255,0.45); white-space: nowrap; }
  .by-nego-toggle.on .by-nego-label { color: #C9A84C; }

  .by-clear-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(240,100,80,0.7); font-size: 0.8rem; font-family: 'DM Sans', sans-serif;
    font-weight: 600; padding: 0; transition: color 0.2s;
    display: flex; align-items: center; gap: 5px;
  }
  .by-clear-btn:hover { color: #f46450; }

  /* ── Breadcrumb ── */
  .by-breadcrumb {
    max-width: 1280px; margin: 0 auto; padding: 1.25rem 2rem 0;
    display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.28);
  }
  .by-breadcrumb a { color: rgba(255,255,255,0.28); text-decoration: none; transition: color 0.2s; }
  .by-breadcrumb a:hover { color: #C9A84C; }

  /* ── Content ── */
  .by-content { max-width: 1280px; margin: 0 auto; padding: 2rem 2rem 5rem; width: 100%; flex: 1; }
  .by-count { font-size: 0.82rem; color: rgba(255,255,255,0.32); margin-bottom: 1.5rem; }
  .by-count strong { color: rgba(255,255,255,0.6); }

  /* ── Grid ── */
  .by-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.3rem; }

  /* ── Card ── */
  .by-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden; text-decoration: none; display: block;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .by-card:hover {
    border-color: rgba(201,168,76,0.32); transform: translateY(-4px);
    box-shadow: 0 20px 56px rgba(0,0,0,0.45);
  }

  /* Image */
  .by-card-img { position: relative; height: 150px; background: rgba(255,255,255,0.04); overflow: hidden; }
  .by-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.38s; }
  .by-card:hover .by-card-img img { transform: scale(1.05); }
  .by-card-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,14,26,0.75) 0%, transparent 50%);
    pointer-events: none;
  }
  .by-card-img-count {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,0,0,0.5); color: rgba(255,255,255,0.7);
    font-size: 0.68rem; padding: 3px 8px; border-radius: 5px; backdrop-filter: blur(4px);
  }
.by-card-contact {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.by-card-contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.45);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s;
}

.by-card-contact-item:hover {
  color: #C9A84C;
}
  .ht-card-contact-item svg {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.by-card-contact-item:hover svg {
  opacity: 1;
}
  /* Badges */
  .by-card-badges { position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; flex-wrap: wrap; }
  .by-badge {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
    padding: 4px 9px; border-radius: 6px;
  }
  .by-badge.type {
  background: rgba(0,0,0,0.65);
  border: 1px solid rgba(201,168,76,0.6);
  color: #E8C878;
  backdrop-filter: blur(6px);
}
  .by-badge.nego { background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.3); color: #34d399; }

  /* Price — overlaid bottom of image */
  .by-card-price-overlay {
    position: absolute; bottom: 12px; left: 12px;
    display: flex; align-items: baseline; gap: 5px;
  }
  .by-price-big { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.6); }
  .by-price-nego { font-size: 0.7rem; color: #34d399; font-weight: 600; }

  /* Body */
  .by-card-body { padding: 1.1rem 1.2rem 1.3rem; }
  .by-card-title {
    font-size: 0.97rem; font-weight: 600; color: #fff; margin-bottom: 6px; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
  }
  .by-card-loc {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.78rem; color: rgba(255,255,255,0.32); margin-bottom: 12px;
  }

  /* Specs row */
  .by-card-specs { display: flex; align-items: center; gap: 0; margin-bottom: 12px; }
  .by-spec {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.78rem; color: rgba(255,255,255,0.38); padding-right: 12px;
    border-right: 1px solid rgba(255,255,255,0.08); margin-right: 12px;
  }
  .by-spec:last-child { border-right: none; margin-right: 0; padding-right: 0; }

  /* Land size chip */
  .by-land-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; padding: 3px 9px; border-radius: 6px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.38); margin-bottom: 10px;
  }

  /* Amenity chips */
  .by-card-amenities { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
  .by-amenity-chip {
    font-size: 0.68rem; padding: 2px 8px; border-radius: 5px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.32);
  }
  .by-amenity-more { color: rgba(201,168,76,0.6); font-size: 0.68rem; padding: 2px 6px; }

  /* Description */
  .by-card-desc {
    font-size: 0.8rem; color: rgba(255,255,255,0.28); line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    margin-bottom: 14px;
  }

  /* Footer row */
  .by-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06);
  }
  .by-card-agency { font-size: 0.72rem; color: rgba(255,255,255,0.28); }
  .by-card-agency strong { color: rgba(255,255,255,0.5); font-weight: 600; }
  .by-view-btn {
    font-size: 0.75rem; font-weight: 600; color: #C9A84C;
    display: flex; align-items: center; gap: 4px; transition: gap 0.2s;
  }
  .by-card:hover .by-view-btn { gap: 7px; }

  /* ── Skeleton ── */
  .by-skeleton { background: #111827; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; overflow: hidden; }
  @keyframes byShimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .by-sk {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 600px 100%; animation: byShimmer 1.4s infinite linear; border-radius: 6px;
  }
  .by-sk-img  { height: 215px; border-radius: 0; }
  .by-sk-body { padding: 1.1rem 1.2rem; display: flex; flex-direction: column; gap: 10px; }

  /* ── Empty / error ── */
  .by-empty { grid-column: 1 / -1; text-align: center; padding: 6rem 2rem; }
  .by-empty-icon { margin: 0 auto 1.5rem; color: rgba(255,255,255,0.1); }
  .by-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: rgba(255,255,255,0.35); margin-bottom: 0.5rem; }
  .by-empty p { font-size: 0.875rem; color: rgba(255,255,255,0.22); margin-bottom: 1.5rem; }
  .by-empty-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .by-empty-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3);
    color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    padding: 10px 22px; border-radius: 10px; cursor: pointer; transition: background 0.2s; text-decoration: none;
  }
  .by-empty-btn:hover { background: rgba(201,168,76,0.18); }
  .by-error { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: #f46450; font-size: 0.9rem; }
  .by-error button {
    margin: 0.75rem auto 0; display: block; background: none; border: none; cursor: pointer;
    color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; text-decoration: underline;
  }

  /* ── Pagination ── */
  .by-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 3.5rem; }
  .by-page-btn {
    width: 37px; height: 37px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.45);
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .by-page-btn:hover:not(:disabled) { border-color: rgba(201,168,76,0.4); color: #C9A84C; }
  .by-page-btn.active { background: rgba(201,168,76,0.15); border-color: #C9A84C; color: #C9A84C; }
  .by-page-btn:disabled { opacity: 0.28; cursor: not-allowed; }
  .by-page-ellipsis { color: rgba(255,255,255,0.2); font-size: 0.85rem; padding: 0 4px; }

  @media (max-width: 700px) {
    .by-type-tabs { display: none; }
    .by-grid { grid-template-columns: 1fr; }
    .by-filter-grid { grid-template-columns: 1fr 1fr; }
    .by-stats { flex-direction: column; }
    .by-stat { border-right: none; border-bottom: 1px solid rgba(201,168,76,0.12); }
    .by-stat:last-child { border-bottom: none; }
    .by-cta-btn span { display: none; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const PROPERTY_TYPES = [
  "Detached House","Semi-Detached House","Terraced House","Bungalow","Duplex",
  "Penthouse","Maisonette","Flat / Apartment","Land","Commercial Property","Warehouse",
];

// Quick-filter tabs shown in the bar
const TYPE_TABS = [
  { val: "",                  label: "All" },
  { val: "Detached House",    label: "Houses" },
  { val: "Land",              label: "Land" },
  { val: "Flat / Apartment",  label: "Apartments" },
  { val: "Duplex",            label: "Duplexes" },
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
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
  </svg>
);
const RulerIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.3 8.7 8.7 21.3a2.41 2.41 0 0 1-3.4 0L2.7 18.7a2.41 2.41 0 0 1 0-3.4L15.3 2.7a2.41 2.41 0 0 1 3.4 0l2.6 2.6a2.41 2.41 0 0 1 0 3.4Z"/>
    <path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/>
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
const ArrowR = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const HomeIllo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 12 10" fill="none" stroke="#0A0E1A" strokeWidth="2">
    <polyline points="1 5 4.5 8.5 11 1"/>
  </svg>
);

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ property }) {
  const {
    _id, title, images, location, price, negotiable,
    propertyType, bedrooms, bathrooms, landSize, landUnit,
    description, amenities, agencyName, contact,
  } = property;

  const visibleA = (amenities || []).slice(0, 3);
  const extraA   = (amenities || []).length - visibleA.length;
  const isLand   = propertyType === "Land";

  return (
    <Link href={`/listings/${_id}`} className="by-card">
      {/* Image */}
      <div className="by-card-img">
        {images?.[0] ? (
          <>
            <img src={images[0]} alt={title} />
            <div className="by-card-gradient" />
          </>
        ) : (
          <div style={{
            width: "100%", height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.12)",
          }}>
            <HomeIllo />
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>No photo</span>
          </div>
        )}

        {/* Top badges */}
        <div className="by-card-badges">
          {propertyType && <span className="by-badge type">{propertyType}</span>}
          {negotiable   && <span className="by-badge nego">Negotiable</span>}
        </div>

        {images?.length > 1 && (
          <span className="by-card-img-count">+{images.length - 1} photos</span>
        )}

        {/* Price overlay */}
        {images?.[0] && (
          <div className="by-card-price-overlay">
            <span className="by-price-big">{formatPrice(price)}</span>
            {negotiable && <span className="by-price-nego">negotiable</span>}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="by-card-body">
        <h3 className="by-card-title">{title}</h3>

        <p className="by-card-loc">
          <LocationIcon />
          {location?.city}, {location?.state}
        </p>

        {/* Specs */}
        {!isLand && (bedrooms > 0 || bathrooms > 0) && (
          <div className="by-card-specs">
            {bedrooms > 0 && (
              <span className="by-spec">
                <BedIcon /> {bedrooms} Bed{bedrooms !== 1 ? "s" : ""}
              </span>
            )}
            {bathrooms > 0 && (
              <span className="by-spec">
                <BathIcon /> {bathrooms} Bath{bathrooms !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* Land size */}
        {landSize && (
          <div className="by-land-chip">
            <RulerIcon />
            {Number(landSize).toLocaleString()} {landUnit || "sqm"}
          </div>
        )}

        {/* Price (no image case) */}
        {!images?.[0] && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#C9A84C" }}>
              {formatPrice(price)}
            </span>
            {negotiable && (
              <span style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 600 }}>negotiable</span>
            )}
          </div>
        )}

        {/* Amenities */}
        {visibleA.length > 0 && (
          <div className="by-card-amenities">
            {visibleA.map((a) => <span key={a} className="by-amenity-chip">{a}</span>)}
            {extraA > 0 && <span className="by-amenity-more">+{extraA} more</span>}
          </div>
        )}

        {/* Description */}
        <p className="by-card-desc">{description}</p>
        {contact?.phone && (
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              window.location.href = `tel:${contact.phone}`;
            }}
            className="by-card-contact-item"
          >
            <FiPhone size={13} />
            <span>{contact.phone}</span>
          </button>
        )}
        
        {contact?.email && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${contact.email}`;
            }}
            className="by-card-contact-item"
          >
            <FiMail size={13} />
            <span>{contact.email}</span>
          </button>
        )}

        {/* Footer */}
        <div className="by-card-footer">
          <div className="by-card-agency">
            {agencyName
              ? <><strong>{agencyName}</strong></>
              : <span>Private Seller</span>}
          </div>
          <span className="by-view-btn">View <ArrowR /></span>
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="by-skeleton">
      <div className="by-sk by-sk-img" />
      <div className="by-sk-body">
        <div className="by-sk" style={{ height: 16, width: "78%" }} />
        <div className="by-sk" style={{ height: 12, width: "48%" }} />
        <div className="by-sk" style={{ height: 12, width: "35%" }} />
        <div className="by-sk" style={{ height: 12, width: "88%" }} />
        <div className="by-sk" style={{ height: 12, width: "72%" }} />
        <div className="by-sk" style={{ height: 22, width: "42%", marginTop: 8 }} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BuyPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [properties,  setProperties]  = useState([]);
  const [pagination,  setPagination]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search:       searchParams.get("search")       || "",
    propertyType: searchParams.get("propertyType") || "",
    state:        searchParams.get("state")        || "",
    city:         searchParams.get("city")         || "",
    minPrice:     searchParams.get("minPrice")     || "",
    maxPrice:     searchParams.get("maxPrice")     || "",
    bedrooms:     searchParams.get("bedrooms")     || "",
    negotiable:   searchParams.get("negotiable")   === "true",
    sortBy:       searchParams.get("sortBy")       || "createdAt",
    sortOrder:    searchParams.get("sortOrder")    || "desc",
    page:         parseInt(searchParams.get("page") || "1", 10),
  });

  const fetchProperties = useCallback(async (params) => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({ type: "sale" });
      Object.entries(params).forEach(([k, v]) => {
        if (v !== "" && v !== false && v !== null && v !== undefined) qs.set(k, v);
      });
      const res  = await fetch(`/api/listings?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load properties.");
      setProperties(data.listings);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(filters);
    const qs = new URLSearchParams({ type: "sale" });
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== false && v !== null && v !== undefined) qs.set(k, String(v));
    });
    router.replace(`/buy?${qs.toString()}`, { scroll: false });
  }, [filters]); // eslint-disable-line

  const setFilter    = (k, v) => setFilters((p) => ({ ...p, [k]: v, page: 1 }));
  const goToPage     = (p)    => setFilters((prev) => ({ ...prev, page: p }));
  const clearFilters = ()     => setFilters({
    search: "", propertyType: "", state: "", city: "",
    minPrice: "", maxPrice: "", bedrooms: "", negotiable: false,
    sortBy: "createdAt", sortOrder: "desc", page: 1,
  });

  const activeFilterCount = [
    filters.state, filters.city, filters.minPrice,
    filters.maxPrice, filters.bedrooms,
    filters.negotiable ? "nego" : "",
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
      <style>{CSS}</style>
      <div className="by-page">
        <Navbar />

        {/* ── Hero ── */}
        <div className="by-hero">
          <div className="by-hero-inner">
            <div className="by-eyebrow">
              <span className="by-eyebrow-dot" />
              Properties for Sale
            </div>
            <h1>Find Your <em>Dream</em> Property</h1>
            <p>
              Houses, land, duplexes, and commercial properties for sale across Nigeria.
              Direct from owners and agents — no middlemen, no hidden fees.
            </p>
            {pagination && !loading && (
              <div className="by-stats">
                <div className="by-stat">
                  <div className="by-stat-num">{pagination.total.toLocaleString()}</div>
                  <div className="by-stat-label">Properties</div>
                </div>
                <div className="by-stat">
                  <div className="by-stat-num">37</div>
                  <div className="by-stat-label">States</div>
                </div>
                <div className="by-stat">
                  <div className="by-stat-num">Direct</div>
                  <div className="by-stat-label">No Agents Needed</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky bar ── */}
        <div className="by-bar">
          <div className="by-bar-inner">
            {/* Search */}
            <div className="by-search-wrap">
              <span className="by-search-icon"><SearchIcon /></span>
              <input className="by-search" type="text" placeholder="Search properties…"
                value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
            </div>

            {/* Property type quick tabs */}
            <div className="by-type-tabs">
              {TYPE_TABS.map(({ val, label }) => (
                <button key={val}
                  className={`by-type-tab ${filters.propertyType === val ? "active" : ""}`}
                  onClick={() => setFilter("propertyType", val)}>
                  {label}
                </button>
              ))}
            </div>

            {/* Filter */}
            <button
              className={`by-filter-btn ${showFilters || activeFilterCount > 0 ? "active" : ""}`}
              onClick={() => setShowFilters((v) => !v)}>
              <FilterIcon />
              Filters
              {activeFilterCount > 0 && (
                <span className="by-filter-badge">{activeFilterCount}</span>
              )}
            </button>

            {/* Sort */}
            <select className="by-sort"
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(":");
                setFilters((p) => ({ ...p, sortBy, sortOrder, page: 1 }));
              }}>
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="price:asc">Price: Low → High</option>
              <option value="price:desc">Price: High → Low</option>
            </select>

            {/* List CTA */}
            <Link href="/list-property" className="by-cta-btn">
              <PlusIcon />
              <span>List a Property</span>
            </Link>
          </div>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="by-filter-panel">
            <div className="by-filter-grid">
              <select className="by-filter-select" value={filters.state}
                onChange={(e) => setFilter("state", e.target.value)}>
                <option value="">All States</option>
                {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <input className="by-filter-input" type="text" placeholder="City / Area"
                value={filters.city} onChange={(e) => setFilter("city", e.target.value)} />

              <select className="by-filter-select" value={filters.propertyType}
                onChange={(e) => setFilter("propertyType", e.target.value)}>
                <option value="">All Property Types</option>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>

              <select className="by-filter-select" value={filters.bedrooms}
                onChange={(e) => setFilter("bedrooms", e.target.value)}>
                <option value="">Any Bedrooms</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}+ Bedroom{n > 1 ? "s" : ""}</option>
                ))}
              </select>

              <input className="by-filter-input" type="number" placeholder="Min Price (₦)"
                value={filters.minPrice} onChange={(e) => setFilter("minPrice", e.target.value)} />

              <input className="by-filter-input" type="number" placeholder="Max Price (₦)"
                value={filters.maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)} />

              {/* Negotiable toggle */}
              <div
                className={`by-nego-toggle ${filters.negotiable ? "on" : ""}`}
                onClick={() => setFilter("negotiable", !filters.negotiable)}
              >
                <div className="by-nego-box">
                  {filters.negotiable && <CheckIcon />}
                </div>
                <span className="by-nego-label">Negotiable only</span>
              </div>

              {activeFilterCount > 0 && (
                <button className="by-clear-btn" onClick={clearFilters}>
                  <CloseIcon /> Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Breadcrumb ── */}
        <div className="by-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ color: "rgba(255,255,255,0.13)" }}>›</span>
          <Link href="/listings">Listings</Link>
          <span style={{ color: "rgba(255,255,255,0.13)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Properties for Sale</span>
        </div>

        {/* ── Content ── */}
        <div className="by-content">
          {!loading && pagination && (
            <p className="by-count">
              <strong>{pagination.total.toLocaleString()}</strong>{" "}
              propert{pagination.total !== 1 ? "ies" : "y"} for sale
              {filters.search && <> matching &ldquo;<strong>{filters.search}</strong>&rdquo;</>}
              {filters.state  && <> in <strong>{filters.state}</strong></>}
            </p>
          )}

          <div className="by-grid">
            {loading ? (
              Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <div className="by-error">
                <p>{error}</p>
                <button onClick={() => fetchProperties(filters)}>Try again</button>
              </div>
            ) : properties.length === 0 ? (
              <div className="by-empty">
                <div className="by-empty-icon"><HomeIllo /></div>
                <h3>No properties found</h3>
                <p>Try adjusting your filters, or be the first to list a property here.</p>
                <div className="by-empty-btns">
                  {activeFilterCount > 0 && (
                    <button className="by-empty-btn" onClick={clearFilters}>Clear filters</button>
                  )}
                  <Link href="/list-property" className="by-empty-btn">List a Property</Link>
                </div>
              </div>
            ) : (
              properties.map((p) => <PropertyCard key={p._id} property={p} />)
            )}
          </div>

          {/* ── Pagination ── */}
          {!loading && pagination && pagination.totalPages > 1 && (
            <div className="by-pagination">
              <button className="by-page-btn"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}>
                <ChevL />
              </button>

              {buildPages(pagination.totalPages, pagination.page).map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="by-page-ellipsis">…</span>
                ) : (
                  <button key={p}
                    className={`by-page-btn ${p === pagination.page ? "active" : ""}`}
                    onClick={() => goToPage(p)}>
                    {p}
                  </button>
                )
              )}

              <button className="by-page-btn"
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