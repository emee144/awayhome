"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const BedIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);
const BathIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="6" y2="6"/><line x1="8" x2="16" y1="12" y2="12"/><line x1="11" x2="13" y1="18" y2="18"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/>
    <rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/>
  </svg>
);
const ListIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/>
    <line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/>
    <line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const getRentPrice = (listing, mode) => {
  if (mode === "month") return listing.pricePerMonth ? { value: fmt(listing.pricePerMonth), label: "/month" } : null;
  return listing.pricePerYear ? { value: fmt(listing.pricePerYear), label: "/year" } : null;
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0E1A !important; }

  .rp-page {
    min-height: 100vh; display: flex; flex-direction: column;
    background: #0A0E1A; font-family: 'DM Sans', sans-serif; color: #ffffff;
  }

  /* ── Hero ── */
  .rp-hero {
    position: relative; padding: 7rem 2rem 4rem;
    background: #0D1220;
    border-bottom: 1px solid rgba(201,168,76,0.12);
    overflow: hidden;
  }
  .rp-hero::before {
    content: ''; position: absolute;
    width: 600px; height: 600px; border-radius: 50%;
    background: rgba(201,168,76,0.05); filter: blur(90px);
    top: -180px; right: -150px; pointer-events: none;
  }
  .rp-hero::after {
    content: ''; position: absolute;
    width: 400px; height: 400px; border-radius: 50%;
    background: rgba(201,168,76,0.03); filter: blur(70px);
    bottom: -100px; left: -100px; pointer-events: none;
  }
  .rp-hero-inner { position: relative; max-width: 1200px; margin: 0 auto; }
  .rp-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #C9A84C; margin-bottom: 1.25rem;
  }
  .rp-eyebrow::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: #C9A84C; animation: rp-pulse 2s infinite;
  }
  @keyframes rp-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.4; transform:scale(.8); }
  }
  .rp-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 4.5vw, 3.5rem);
    font-weight: 900; color: #ffffff;
    line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1rem;
  }
  .rp-hero h1 em { font-style: italic; color: #C9A84C; }
  .rp-hero-sub {
    font-size: 0.95rem; color: rgba(255,255,255,0.45);
    line-height: 1.7; max-width: 500px;
  }
  .rp-hero-sub strong { color: #C9A84C; font-weight: 600; }

  /* ── Breadcrumb ── */
  .rp-breadcrumb {
    max-width: 1200px; margin: 0 auto; padding: 1.25rem 2rem 0;
    display: flex; align-items: center; gap: 6px;
    font-size: 0.77rem; color: rgba(255,255,255,0.3);
  }
  .rp-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
  .rp-breadcrumb a:hover { color: #C9A84C; }
  .rp-breadcrumb span { color: rgba(255,255,255,0.15); }

  /* ── Body ── */
  .rp-body { max-width: 1200px; margin: 0 auto; padding: 2.5rem 2rem 5rem; width: 100%; }

  /* ── Toolbar ── */
  .rp-toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }

  .rp-search-wrap { position: relative; flex: 1; min-width: 240px; }
  .rp-search-icon {
    position: absolute; left: 15px; top: 50%;
    transform: translateY(-50%); color: rgba(255,255,255,0.3);
    pointer-events: none; display: flex;
  }
  .rp-search {
    width: 100%; height: 46px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 0 16px 0 44px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; font-weight: 500;
    color: #ffffff; outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .rp-search::placeholder { color: rgba(255,255,255,0.25); }
  .rp-search:focus { border-color: rgba(201,168,76,0.5); background: rgba(255,255,255,0.07); }

  .rp-mode-tabs {
    display: flex; gap: 4px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 4px; border-radius: 12px;
  }
  .rp-tab {
    padding: 7px 18px; border-radius: 9px; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .rp-tab-active { background: linear-gradient(135deg, #C9A84C, #E8C878); color: #0A0E1A; }
  .rp-tab-inactive { background: transparent; color: rgba(255,255,255,0.4); }
  .rp-tab-inactive:hover { color: #ffffff; }

  .rp-select-wrap { position: relative; }
  .rp-select {
    height: 46px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 0 38px 0 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    color: #ffffff; outline: none;
    appearance: none; cursor: pointer; transition: border-color 0.2s;
  }
  .rp-select:focus { border-color: rgba(201,168,76,0.5); }
  .rp-select option { background: #0F1525; color: #ffffff; }
  .rp-select-chevron {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none; color: rgba(255,255,255,0.35); display: flex;
  }

  .rp-btn-ghost {
    height: 46px; padding: 0 18px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    color: #ffffff; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: border-color 0.2s, background 0.2s; white-space: nowrap;
  }
  .rp-btn-ghost:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.06); }

  .rp-view-btns { display: flex; gap: 4px; }
  .rp-view-btn {
    width: 46px; height: 46px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(255,255,255,0.4); transition: all 0.2s;
  }
  .rp-view-btn:hover { border-color: rgba(201,168,76,0.35); color: #ffffff; }
  .rp-view-btn-active {
    background: rgba(201,168,76,0.12);
    border-color: rgba(201,168,76,0.45); color: #C9A84C;
  }

  .rp-badge-count {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px;
    background: #C9A84C; color: #0A0E1A;
    border-radius: 100px; font-size: 10px; font-weight: 800;
  }

  /* ── Filter panel ── */
  .rp-filters {
    background: #111827;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 1.5rem; margin-bottom: 20px;
    animation: rp-fadeup 0.25s ease;
  }
  @keyframes rp-fadeup {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .rp-filter-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 14px; align-items: end;
  }
  .rp-filter-field { display: flex; flex-direction: column; gap: 6px; }
  .rp-filter-label {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .rp-filter-input {
    width: 100%; height: 42px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 0 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500;
    color: #ffffff; outline: none; transition: border-color 0.2s;
  }
  .rp-filter-input::placeholder { color: rgba(255,255,255,0.2); }
  .rp-filter-input:focus { border-color: rgba(201,168,76,0.5); }
  .rp-filter-select {
    width: 100%; height: 42px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 0 34px 0 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500;
    color: #ffffff; outline: none;
    appearance: none; cursor: pointer; transition: border-color 0.2s;
  }
  .rp-filter-select:focus { border-color: rgba(201,168,76,0.5); }
  .rp-filter-select option { background: #0F1525; }
  .rp-filter-clear { display: flex; justify-content: flex-end; margin-top: 14px; }
  .rp-clear-btn {
    background: none; border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px; padding: 7px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; font-weight: 600;
    color: rgba(255,255,255,0.4); cursor: pointer;
    display: flex; align-items: center; gap: 6px; transition: all 0.2s;
  }
  .rp-clear-btn:hover { border-color: rgba(240,100,80,0.4); color: #f46450; }

  /* ── Meta ── */
  .rp-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .rp-meta-count { font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.35); }
  .rp-meta-count strong { color: rgba(255,255,255,0.65); }

  /* ── Grid / List ── */
  .rp-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;
  }
  .rp-list { display: flex; flex-direction: column; gap: 14px; }

  @keyframes rp-card-in {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Card ── */
  .rp-card {
    background: #111827;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
    text-decoration: none; color: inherit; display: block;
  }
  .rp-card:hover {
    border-color: rgba(201,168,76,0.35);
    box-shadow: 0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,168,76,0.1);
    transform: translateY(-3px);
  }
  .rp-card-row { display: flex; }

  .rp-card-img {
    position: relative; background: #0D1220; overflow: hidden; flex-shrink: 0;
  }
  .rp-card-img-grid { width: 100%; height: 210px; }
  .rp-card-img-row  { width: 260px; min-width: 260px; }

  .rp-card-img img { transition: transform 0.45s ease !important; }
  .rp-card:hover .rp-card-img img { transform: scale(1.05); }

  .rp-card-img-placeholder {
    width: 100%; height: 100%; min-height: 180px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #0D1220 0%, #111827 100%);
    font-size: 42px; opacity: 0.2;
  }

  .rp-img-badge {
    position: absolute; top: 12px; left: 12px;
    background: #C9A84C; color: #0A0E1A;
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 100px;
  }
  .rp-img-rating {
    position: absolute; top: 12px; right: 12px;
    background: rgba(10,14,26,0.75); backdrop-filter: blur(6px);
    border: 1px solid rgba(201,168,76,0.3);
    color: #C9A84C; font-size: 0.78rem; font-weight: 700;
    padding: 4px 10px; border-radius: 100px;
    display: flex; align-items: center; gap: 4px;
  }

  .rp-card-body {
    padding: 18px 20px;
    display: flex; flex-direction: column; justify-content: space-between; flex: 1;
  }

  .rp-card-location {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.73rem; font-weight: 600;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.03em; margin-bottom: 7px;
  }
  .rp-card-location svg { color: #C9A84C; }

  .rp-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem; font-weight: 700;
    color: #ffffff; line-height: 1.3; margin-bottom: 8px;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .rp-card-row .rp-card-title { font-size: 1.1rem; }

  .rp-card-type {
    display: inline-block;
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 3px 10px; border-radius: 100px; margin-bottom: 14px;
  }

  .rp-card-stats {
    display: flex; gap: 14px; margin-bottom: 14px;
    color: rgba(255,255,255,0.45); font-size: 0.8rem; font-weight: 500;
  }
  .rp-card-stat { display: flex; align-items: center; gap: 5px; }

  .rp-card-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 14px; }

  .rp-card-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 800;
    color: #ffffff; letter-spacing: -0.02em;
  }
  .rp-card-row .rp-card-price { font-size: 1.5rem; }
  .rp-card-price-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; font-weight: 600;
    color: rgba(255,255,255,0.35); margin-left: 2px;
  }

  .rp-card-cta {
    margin-top: 12px; display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.8rem; font-weight: 700; color: #C9A84C;
    letter-spacing: 0.03em; transition: gap 0.2s;
  }
  .rp-card:hover .rp-card-cta { gap: 10px; }

  /* ── Skeleton ── */
  @keyframes rp-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  .rp-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.09) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: rp-shimmer 1.6s infinite; border-radius: 6px;
  }
  .rp-skel {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
  }

  /* ── Empty state ── */
  .rp-empty { text-align: center; padding: 80px 20px; grid-column: 1 / -1; }
  .rp-empty-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 28px;
  }
  .rp-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 800; color: #ffffff; margin-bottom: 10px;
  }
  .rp-empty p { font-size: 0.88rem; color: rgba(255,255,255,0.35); margin-bottom: 24px; }
  .rp-empty-btn {
    background: linear-gradient(135deg, #C9A84C, #E8C878);
    color: #0A0E1A; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 0.9rem;
    padding: 12px 28px; border-radius: 10px; border: none; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .rp-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }

  /* ── Pagination ── */
  .rp-pagination {
    display: flex; justify-content: center; align-items: center;
    gap: 6px; margin-top: 56px;
  }
  .rp-page-btn {
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s;
  }
  .rp-page-btn:hover:not(:disabled) { border-color: rgba(201,168,76,0.4); color: #ffffff; }
  .rp-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .rp-page-btn-active {
    background: linear-gradient(135deg, #C9A84C, #E8C878);
    border-color: transparent; color: #0A0E1A; font-weight: 800;
  }

  @media (max-width: 900px) { .rp-filter-grid { grid-template-columns: 1fr 1fr 1fr; } }
  @media (max-width: 640px) {
    .rp-filter-grid { grid-template-columns: 1fr 1fr; }
    .rp-grid { grid-template-columns: 1fr; }
    .rp-card-img-row { width: 130px; min-width: 130px; }
  }
`;

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rp-skel">
    <div className="rp-shimmer" style={{ height: "210px" }} />
    <div style={{ padding: "18px 20px" }}>
      <div className="rp-shimmer" style={{ height: "12px", width: "40%", marginBottom: "10px" }} />
      <div className="rp-shimmer" style={{ height: "18px", width: "85%", marginBottom: "8px" }} />
      <div className="rp-shimmer" style={{ height: "18px", width: "60%", marginBottom: "16px" }} />
      <div className="rp-shimmer" style={{ height: "12px", width: "50%", marginBottom: "14px" }} />
      <div className="rp-shimmer" style={{ height: "22px", width: "45%" }} />
    </div>
  </div>
);

// ─── Listing Card ─────────────────────────────────────────────────────────────
const ListingCard = ({ listing, mode, viewMode, index }) => {
  const [imgErr, setImgErr] = useState(false);
  const price = getRentPrice(listing, mode);
  const isRow = viewMode === "list";
  const loc = [listing.location?.city, listing.location?.state].filter(Boolean).join(", ");

  return (
    <Link
      href={`/listings/${listing._id}`}
      className={`rp-card${isRow ? " rp-card-row" : ""}`}
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms`, animation: "rp-card-in 0.4s ease both" }}
    >
      {/* Image */}
      <div className={`rp-card-img ${isRow ? "rp-card-img-row" : "rp-card-img-grid"}`}>
        {listing.images?.[0] && !imgErr ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            style={{ objectFit: "cover" }}
            onError={() => setImgErr(true)}
            sizes={isRow ? "260px" : "(max-width: 768px) 100vw, 360px"}
          />
        ) : (
          <div className="rp-card-img-placeholder">🏠</div>
        )}
        <span className="rp-img-badge">For Rent</span>
        {listing.starRating > 0 && (
          <div className="rp-img-rating">
            <StarIcon /> {listing.starRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="rp-card-body">
        <div>
          {loc && (
            <div className="rp-card-location">
              <MapPinIcon /> {loc}
            </div>
          )}
          <h3 className="rp-card-title">{listing.title}</h3>
          {listing.propertyType && (
            <span className="rp-card-type">{listing.propertyType}</span>
          )}
          {(listing.bedrooms > 0 || listing.bathrooms > 0) && (
            <div className="rp-card-stats">
              {listing.bedrooms > 0 && (
                <span className="rp-card-stat">
                  <BedIcon /> {listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}
                </span>
              )}
              {listing.bathrooms > 0 && (
                <span className="rp-card-stat">
                  <BathIcon /> {listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>
        <div>
          <div className="rp-card-divider" />
          {price ? (
            <div>
              <span className="rp-card-price">
                {price.value}
                <span className="rp-card-price-label">{price.label}</span>
              </span>
            </div>
          ) : (
            <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.25)" }}>Price on request</span>
          )}
          <div className="rp-card-cta">
            View details <ArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RentPage() {
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [filters, setFilters] = useState({
    search: "", state: "", city: "",
    minPrice: "", maxPrice: "",
    rentMode: "year", bedrooms: "",
    sortBy: "createdAt", sortOrder: "desc",
    page: 1,
  });

  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchListings = useCallback(async (params) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ type: "rent" });
      Object.entries(params).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) qs.set(k, String(v));
      });
      const res = await fetch(`/api/auth/listings?${qs.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setListings(data.listings || []);
      setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      console.error(err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchListings(filters); }, [filters, fetchListings]);

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }));

  const handleSearch = (val) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFilter("search", val), 420);
  };

  const clearFilters = () => {
    if (searchRef.current) searchRef.current.value = "";
    setFilters({ search: "", state: "", city: "", minPrice: "", maxPrice: "", rentMode: filters.rentMode, bedrooms: "", sortBy: "createdAt", sortOrder: "desc", page: 1 });
  };

  const activeCount = [filters.state, filters.city, filters.minPrice, filters.maxPrice, filters.bedrooms].filter(Boolean).length;

  const getPages = () => {
    const total = pagination.totalPages;
    const cur = filters.page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1,2,3,4,5,"…",total];
    if (cur >= total - 3) return [1,"…",total-4,total-3,total-2,total-1,total];
    return [1,"…",cur-1,cur,cur+1,"…",total];
  };

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="rp-page">
        <Navbar />

        {/* Hero */}
        <div className="rp-hero">
          <div className="rp-hero-inner">
            <div className="rp-eyebrow">Rental Listings</div>
            <h1>Find Your <em>Perfect</em> Rental</h1>
            <p className="rp-hero-sub">
              Browse{" "}
              <strong>{pagination.total > 0 ? pagination.total.toLocaleString() : "available"}</strong>
              {" "}rental properties across Nigeria — apartments, duplexes, and more.
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="rp-breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/listings">Listings</Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>Rent</span>
        </div>

        <div className="rp-body">

          {/* Toolbar */}
          <div className="rp-toolbar">
            <div className="rp-search-wrap">
              <span className="rp-search-icon"><SearchIcon /></span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search listings…"
                defaultValue={filters.search}
                onChange={e => handleSearch(e.target.value)}
                className="rp-search"
              />
            </div>

            <div className="rp-mode-tabs">
              {["year", "month"].map(m => (
                <button
                  key={m}
                  onClick={() => setFilter("rentMode", m)}
                  className={`rp-tab ${filters.rentMode === m ? "rp-tab-active" : "rp-tab-inactive"}`}
                >
                  Per {m === "year" ? "Year" : "Month"}
                </button>
              ))}
            </div>

            <div className="rp-select-wrap">
              <select
                value={filters.sortBy}
                onChange={e => setFilter("sortBy", e.target.value)}
                className="rp-select"
              >
                <option value="createdAt">Newest first</option>
                <option value={filters.rentMode === "month" ? "pricePerMonth" : "pricePerYear"}>By price</option>
                <option value="starRating">By rating</option>
              </select>
              <span className="rp-select-chevron"><ChevronDown /></span>
            </div>

            <button
              className="rp-btn-ghost"
              onClick={() => setFilter("sortOrder", filters.sortOrder === "desc" ? "asc" : "desc")}
            >
              {filters.sortOrder === "desc" ? "↓ High–Low" : "↑ Low–High"}
            </button>

            <button className="rp-btn-ghost" onClick={() => setFiltersOpen(p => !p)}>
              <FilterIcon />
              Filters
              {activeCount > 0 && <span className="rp-badge-count">{activeCount}</span>}
            </button>

            <div className="rp-view-btns">
              {[{ v: "grid", Icon: GridIcon }, { v: "list", Icon: ListIcon }].map(({ v, Icon }) => (
                <button
                  key={v}
                  className={`rp-view-btn ${viewMode === v ? "rp-view-btn-active" : ""}`}
                  onClick={() => setViewMode(v)}
                  title={`${v} view`}
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="rp-filters">
              <div className="rp-filter-grid">
                <div className="rp-filter-field">
                  <label className="rp-filter-label">State</label>
                  <input className="rp-filter-input" placeholder="e.g. Lagos" value={filters.state} onChange={e => setFilter("state", e.target.value)} />
                </div>
                <div className="rp-filter-field">
                  <label className="rp-filter-label">City / Area</label>
                  <input className="rp-filter-input" placeholder="e.g. Lekki" value={filters.city} onChange={e => setFilter("city", e.target.value)} />
                </div>
                <div className="rp-filter-field">
                  <label className="rp-filter-label">Min Price (₦)</label>
                  <input className="rp-filter-input" type="number" placeholder="0" value={filters.minPrice} onChange={e => setFilter("minPrice", e.target.value)} />
                </div>
                <div className="rp-filter-field">
                  <label className="rp-filter-label">Max Price (₦)</label>
                  <input className="rp-filter-input" type="number" placeholder="Any" value={filters.maxPrice} onChange={e => setFilter("maxPrice", e.target.value)} />
                </div>
                <div className="rp-filter-field">
                  <label className="rp-filter-label">Bedrooms</label>
                  <div style={{ position: "relative" }}>
                    <select value={filters.bedrooms} onChange={e => setFilter("bedrooms", e.target.value)} className="rp-filter-select">
                      <option value="">Any</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                    <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)", display: "flex" }}>
                      <ChevronDown />
                    </span>
                  </div>
                </div>
              </div>
              {activeCount > 0 && (
                <div className="rp-filter-clear">
                  <button className="rp-clear-btn" onClick={clearFilters}>
                    <CloseIcon /> Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Meta */}
          {!loading && (
            <div className="rp-meta">
              <p className="rp-meta-count">
                {pagination.total > 0
                  ? <>Showing <strong>{((filters.page - 1) * 12) + 1}–{Math.min(filters.page * 12, pagination.total)}</strong> of <strong>{pagination.total.toLocaleString()}</strong> rentals</>
                  : "No listings match your filters"}
              </p>
            </div>
          )}

          {/* Cards */}
          {loading ? (
            <div className="rp-grid">
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : listings.length === 0 ? (
            <div className="rp-empty">
              <div className="rp-empty-icon">🏠</div>
              <h3>No rentals found</h3>
              <p>Try adjusting your filters or clearing your search.</p>
              <button className="rp-empty-btn" onClick={clearFilters}>Clear all filters</button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "rp-grid" : "rp-list"}>
              {listings.map((listing, i) => (
                <ListingCard key={listing._id} listing={listing} mode={filters.rentMode} viewMode={viewMode} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="rp-pagination">
              <button className="rp-page-btn" disabled={!pagination.hasPrevPage} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}>←</button>
              {getPages().map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.9rem", padding: "0 4px" }}>…</span>
                ) : (
                  <button key={p} className={`rp-page-btn ${filters.page === p ? "rp-page-btn-active" : ""}`} onClick={() => setFilters(prev => ({ ...prev, page: p }))}>
                    {p}
                  </button>
                )
              )}
              <button className="rp-page-btn" disabled={!pagination.hasNextPage} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}>→</button>
            </div>
          )}

        </div>
        <Footer />
      </div>
    </>
  );
}