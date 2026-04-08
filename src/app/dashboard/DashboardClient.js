"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Constants ────────────────────────────────────────────────────────────────
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const AMENITIES_HOTEL = [
  "Swimming Pool","Gym","Restaurant","Bar","Spa","Free WiFi","Parking",
  "Conference Room","24/7 Security","Air Conditioning","Room Service",
  "Airport Shuttle","Laundry","Business Centre","Generator","CCTV","Solar Power","Smart Home",
];
const AMENITIES_SHORTLET = [
  "Free WiFi","Air Conditioning","Fully Equipped Kitchen","Generator/NEPA",
  "Parking","Security","Swimming Pool","Gym","Washing Machine","Smart TV",
  "Water Heater","Balcony","CCTV",
];
const AMENITIES_SALE = [
  "Swimming Pool","Gym","Boys Quarter","Generator","Water Treatment",
  "CCTV","Security Post","Perimeter Fence","Parking","Garden/Lawn",
  "Solar Power","Borehole","Elevator","Smart Home",
];
const AMENITIES_RENT = [
  "Parking","Security","Borehole","Generator","CCTV",
  "Prepaid Meter","Wardrobes","Kitchen Cabinets","Balcony","Tiled Floors","POP Ceiling","Fence",
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const DASH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .db-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .db-hero {
    position: relative; padding: 8rem 2rem 3.5rem;
    background: #0D1220; border-bottom: 1px solid rgba(201,168,76,0.12); overflow: hidden;
  }
  .db-hero::before {
    content:''; position:absolute; width:700px; height:700px; border-radius:50%;
    background:rgba(201,168,76,0.04); filter:blur(100px);
    top:-200px; right:-200px; pointer-events:none;
  }
  .db-hero-inner { position:relative; max-width:1100px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:1.5rem; flex-wrap:wrap; }
  .db-hero-left {}
  .db-eyebrow {
    display:inline-flex; align-items:center; gap:7px;
    background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.28);
    border-radius:100px; padding:5px 16px;
    font-size:0.72rem; font-weight:600; letter-spacing:0.12em;
    text-transform:uppercase; color:#C9A84C; margin-bottom:1rem;
  }
  .db-eyebrow::before {
    content:''; width:6px; height:6px; border-radius:50%;
    background:#C9A84C; animation:pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
  .db-hero h1 {
    font-family:'Playfair Display',serif;
    font-size:clamp(1.6rem,3vw,2.4rem); font-weight:700; color:#fff; line-height:1.15;
    margin-bottom:0.4rem;
  }
  .db-hero h1 em { font-style:italic; color:#C9A84C; }
  .db-hero p { font-size:0.88rem; color:rgba(255,255,255,0.4); }
  .db-avatar {
    width:56px; height:56px; border-radius:14px;
    background:linear-gradient(135deg,#C9A84C,#a8843c);
    display:flex; align-items:center; justify-content:center;
    font-size:1.4rem; font-weight:700; color:#0A0E1A; flex-shrink:0;
  }

  /* ── Main wrap ── */
  .db-wrap { max-width:1100px; margin:0 auto; padding:2.5rem 2rem 5rem; width:100%; flex:1; }

  /* ── Stat strip ── */
  .db-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:2.5rem; }
  .db-stat-card {
    background:#111827; border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:1.25rem 1.4rem;
    display:flex; flex-direction:column; gap:6px;
    position:relative; overflow:hidden;
  }
  .db-stat-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--sc,rgba(201,168,76,0.4)),transparent);
  }
  .db-stat-label { font-size:0.7rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.3); }
  .db-stat-val { font-family:'Playfair Display',serif; font-size:2rem; font-weight:700; color:#fff; line-height:1; }
  .db-stat-sub { font-size:0.75rem; color:rgba(255,255,255,0.3); }

  /* ── Section header ── */
  .db-section-hd {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:1.25rem; gap:1rem; flex-wrap:wrap;
  }
  .db-section-title {
    display:flex; align-items:center; gap:10px;
    font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:700; color:#fff;
  }
  .db-section-title svg { color:#C9A84C; }

  /* ── Tabs ── */
  .db-tabs { display:flex; gap:6px; flex-wrap:wrap; }
  .db-tab {
    padding:6px 16px; border-radius:8px; font-size:0.8rem; font-weight:600;
    cursor:pointer; border:1px solid rgba(255,255,255,0.1);
    background:transparent; color:rgba(255,255,255,0.4);
    transition:all 0.2s; font-family:'DM Sans',sans-serif;
  }
  .db-tab:hover { color:rgba(255,255,255,0.7); border-color:rgba(255,255,255,0.2); }
  .db-tab.active { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.35); color:#C9A84C; }

  /* ── Listing cards grid ── */
  .db-listings-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:1.25rem; }

  .db-listing-card {
    background:#111827; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; overflow:hidden;
    transition:border-color 0.2s, transform 0.2s;
    display:flex; flex-direction:column;
  }
  .db-listing-card:hover { border-color:rgba(201,168,76,0.2); transform:translateY(-2px); }

  .db-card-img {
    height:180px; overflow:hidden; position:relative;
    background:rgba(255,255,255,0.03);
    display:flex; align-items:center; justify-content:center;
  }
  .db-card-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s; }
  .db-listing-card:hover .db-card-img img { transform:scale(1.05); }
  .db-card-img-placeholder { color:rgba(255,255,255,0.1); }
  .db-card-type {
    position:absolute; top:10px; left:10px;
    font-size:0.65rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
    padding:3px 10px; border-radius:5px;
  }
  .db-card-type.hotel   { background:rgba(96,165,250,0.9); color:#fff; }
  .db-card-type.shortlet{ background:rgba(52,211,153,0.9); color:#fff; }
  .db-card-type.sale    { background:rgba(201,168,76,0.9); color:#0A0E1A; }
  .db-card-type.rent    { background:rgba(99,102,241,0.9); color:#fff; }

  .db-card-status {
    position:absolute; top:10px; right:10px;
    font-size:0.65rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;
    padding:3px 10px; border-radius:5px;
  }
  .db-card-status.pending  { background:rgba(251,191,36,0.15); border:1px solid rgba(251,191,36,0.3); color:#FBBF24; }
  .db-card-status.approved { background:rgba(52,211,153,0.15); border:1px solid rgba(52,211,153,0.3); color:#34D399; }
  .db-card-status.rejected { background:rgba(239,68,68,0.15);  border:1px solid rgba(239,68,68,0.3);  color:#EF4444; }

  .db-card-body { padding:1.1rem 1.25rem; flex:1; display:flex; flex-direction:column; gap:0.5rem; }
  .db-card-title {
    font-weight:600; color:#fff; font-size:0.92rem; line-height:1.3;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .db-card-location { font-size:0.78rem; color:rgba(255,255,255,0.35); display:flex; align-items:center; gap:5px; }
  .db-card-price { font-size:0.9rem; font-weight:700; color:#C9A84C; margin-top:auto; padding-top:0.4rem; }

  .db-card-actions {
    padding:0.75rem 1.25rem;
    border-top:1px solid rgba(255,255,255,0.06);
    display:flex; gap:0.5rem;
  }
  .db-card-btn {
    flex:1; padding:8px 10px; border-radius:8px; font-size:0.8rem; font-weight:600;
    cursor:pointer; border:none; font-family:'DM Sans',sans-serif;
    display:flex; align-items:center; justify-content:center; gap:5px;
    transition:all 0.2s;
  }
  .db-card-btn.view { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.55); text-decoration:none; }
  .db-card-btn.view:hover { background:rgba(255,255,255,0.1); color:#fff; }
  .db-card-btn.edit { background:rgba(201,168,76,0.1); color:#C9A84C; border:1px solid rgba(201,168,76,0.2); }
  .db-card-btn.edit:hover { background:rgba(201,168,76,0.18); border-color:rgba(201,168,76,0.4); }
  .db-card-btn.del { background:rgba(239,68,68,0.08); color:#EF4444; border:1px solid rgba(239,68,68,0.2); }
  .db-card-btn.del:hover { background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.4); }

  /* ── Empty state ── */
  .db-empty {
    grid-column:1/-1;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:4rem 2rem; text-align:center; gap:1rem;
    background:#111827; border:1px dashed rgba(255,255,255,0.1); border-radius:16px;
  }
  .db-empty-icon { color:rgba(255,255,255,0.1); }
  .db-empty h3 { font-family:'Playfair Display',serif; font-size:1.2rem; color:rgba(255,255,255,0.4); }
  .db-empty p { font-size:0.85rem; color:rgba(255,255,255,0.25); max-width:300px; line-height:1.6; }

  /* ── Profile Card ── */
  .db-profile-card {
    background:#111827; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; margin-bottom:2.5rem; overflow:hidden;
  }
  .db-profile-header {
    padding:1.5rem 2rem; border-bottom:1px solid rgba(255,255,255,0.06);
    display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;
  }
  .db-profile-hd-left { display:flex; align-items:center; gap:12px; }
  .db-profile-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:700; color:#fff; }
  .db-profile-sub { font-size:0.78rem; color:rgba(255,255,255,0.3); margin-top:2px; }
  .db-profile-body { padding:1.5rem 2rem; }
  .db-profile-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; }

  .db-pfield { display:flex; flex-direction:column; gap:0.4rem; }
  .db-pfield label { font-size:0.78rem; font-weight:600; color:rgba(255,255,255,0.4); letter-spacing:0.05em; text-transform:uppercase; }
  .db-pfield-val { font-size:0.9rem; color:#fff; font-weight:500; }
  .db-pfield-input {
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
    border-radius:9px; color:#fff; font-family:'DM Sans',sans-serif; font-size:0.88rem;
    padding:10px 13px; outline:none; transition:border-color 0.2s;
  }
  .db-pfield-input:focus { border-color:rgba(201,168,76,0.5); }
  .db-pfield-input::placeholder { color:rgba(255,255,255,0.2); }

  .db-edit-btn {
    display:flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:9px;
    font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600;
    background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.2);
    color:#C9A84C; cursor:pointer; transition:all 0.2s;
  }
  .db-edit-btn:hover { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); }
  .db-save-btn {
    display:flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:9px;
    font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:700;
    background:linear-gradient(135deg,#C9A84C,#E8C878);
    border:none; color:#0A0E1A; cursor:pointer; transition:all 0.2s;
  }
  .db-save-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .db-cancel-btn {
    display:flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:9px;
    font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.5); cursor:pointer; transition:all 0.2s;
  }

  /* password section */
  .db-pw-section { padding:1.25rem 2rem; border-top:1px solid rgba(255,255,255,0.06); }
  .db-pw-toggle {
    display:flex; align-items:center; gap:8px;
    font-size:0.82rem; font-weight:600; color:rgba(255,255,255,0.4);
    cursor:pointer; background:none; border:none; font-family:'DM Sans',sans-serif;
    transition:color 0.2s;
  }
  .db-pw-toggle:hover { color:#C9A84C; }
  .db-pw-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-top:1.1rem; }

  /* ── Edit Modal ── */
  .db-modal-bg {
    position:fixed; inset:0; z-index:300;
    background:rgba(0,0,0,0.8); backdrop-filter:blur(8px);
    display:flex; align-items:flex-start; justify-content:center;
    padding:2rem 1rem; overflow-y:auto;
  }
  .db-modal {
    background:#0D1220; border:1px solid rgba(255,255,255,0.1);
    border-radius:20px; width:100%; max-width:860px;
    animation:db-pop 0.25s ease; margin:auto;
    position:relative;
  }
  @keyframes db-pop { from{transform:scale(0.96);opacity:0} to{transform:scale(1);opacity:1} }
  .db-modal-hd {
    padding:1.5rem 2rem; border-bottom:1px solid rgba(255,255,255,0.07);
    display:flex; align-items:center; justify-content:space-between; gap:1rem;
    position:sticky; top:0; background:#0D1220; z-index:10; border-radius:20px 20px 0 0;
  }
  .db-modal-hd-left { display:flex; align-items:center; gap:10px; }
  .db-modal-title { font-family:'Playfair Display',serif; font-size:1.1rem; color:#fff; font-weight:700; }
  .db-modal-sub { font-size:0.78rem; color:rgba(255,255,255,0.3); margin-top:2px; }
  .db-modal-close {
    width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.07);
    border:none; color:rgba(255,255,255,0.5); cursor:pointer;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    transition:background 0.2s, color 0.2s;
  }
  .db-modal-close:hover { background:rgba(255,255,255,0.13); color:#fff; }

  /* form inside modal — reuse lp-* classes */
  .lp-section { padding:1.75rem 2rem; border-bottom:1px solid rgba(255,255,255,0.06); }
  .lp-section:last-child { border-bottom:none; }
  .lp-section-title {
    display:flex; align-items:center; gap:10px;
    font-size:0.92rem; font-weight:600; color:#fff; margin-bottom:1.4rem;
  }
  .lp-section-title span {
    width:26px; height:26px; border-radius:7px;
    background:rgba(201,168,76,0.15); color:#C9A84C;
    display:flex; align-items:center; justify-content:center;
    font-size:0.72rem; font-weight:700; flex-shrink:0;
  }
  .lp-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .lp-field { display:flex; flex-direction:column; gap:0.4rem; }
  .lp-field.span-2 { grid-column:span 2; }
  .lp-field label { font-size:0.78rem; font-weight:600; color:rgba(255,255,255,0.55); letter-spacing:0.04em; }
  .lp-field label .req { color:#C9A84C; margin-left:2px; }
  .lp-input,.lp-select,.lp-textarea {
    width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
    border-radius:9px; color:#fff; font-family:'DM Sans',sans-serif; font-size:0.88rem;
    outline:none; transition:border-color 0.2s, background 0.2s;
  }
  .lp-input { padding:11px 13px; }
  .lp-select { padding:11px 13px; cursor:pointer; }
  .lp-textarea { padding:11px 13px; resize:vertical; min-height:100px; line-height:1.6; }
  .lp-input::placeholder,.lp-textarea::placeholder { color:rgba(255,255,255,0.22); }
  .lp-select option { background:#0F1525; color:#fff; }
  .lp-input:focus,.lp-select:focus,.lp-textarea:focus { border-color:rgba(201,168,76,0.5); background:rgba(255,255,255,0.08); }
  .lp-prefix-wrap { position:relative; }
  .lp-prefix { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#C9A84C; font-weight:600; font-size:0.88rem; pointer-events:none; }
  .lp-prefix-wrap .lp-input { padding-left:30px; }
  .lp-counter {
    display:flex; align-items:center;
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
    border-radius:9px; overflow:hidden;
  }
  .lp-counter button {
    width:38px; height:44px; background:none; border:none;
    color:rgba(255,255,255,0.5); font-size:1.1rem; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background 0.2s,color 0.2s; flex-shrink:0;
  }
  .lp-counter button:hover { background:rgba(201,168,76,0.1); color:#C9A84C; }
  .lp-counter span {
    flex:1; text-align:center; font-size:0.92rem; font-weight:600; color:#fff;
    border-left:1px solid rgba(255,255,255,0.08); border-right:1px solid rgba(255,255,255,0.08);
    height:44px; display:flex; align-items:center; justify-content:center;
  }
  .amenities-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:0.55rem; }
  .amenity-item {
    display:flex; align-items:center; gap:8px; padding:8px 11px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    border-radius:8px; cursor:pointer; transition:all 0.2s;
    font-size:0.8rem; color:rgba(255,255,255,0.55); user-select:none;
  }
  .amenity-item:hover { border-color:rgba(201,168,76,0.28); color:rgba(255,255,255,0.85); }
  .amenity-item.checked { border-color:rgba(201,168,76,0.42); background:rgba(201,168,76,0.07); color:#fff; }
  .amenity-item input { display:none; }
  .amenity-tick {
    width:15px; height:15px; border-radius:4px; flex-shrink:0;
    border:1.5px solid rgba(255,255,255,0.2);
    display:flex; align-items:center; justify-content:center; transition:all 0.2s;
  }
  .amenity-item.checked .amenity-tick { background:#C9A84C; border-color:#C9A84C; }
  .img-upload-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0.7rem; }
  .img-slot {
    aspect-ratio:1; border-radius:11px; overflow:hidden;
    border:1.5px dashed rgba(255,255,255,0.14);
    position:relative; cursor:pointer; transition:border-color 0.2s;
    background:rgba(255,255,255,0.03);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:7px;
  }
  .img-slot:hover { border-color:rgba(201,168,76,0.38); }
  .img-slot.filled { border-style:solid; border-color:rgba(201,168,76,0.28); }
  .img-slot img { width:100%; height:100%; object-fit:cover; position:absolute; inset:0; }
  .img-slot-label { font-size:0.7rem; color:rgba(255,255,255,0.3); }
  .img-slot-icon { color:rgba(255,255,255,0.22); }
  .img-remove {
    position:absolute; top:5px; right:5px; width:20px; height:20px; border-radius:50%;
    background:rgba(240,100,80,0.85); border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center; color:#fff;
    font-size:11px; z-index:2;
  }
  .img-primary-badge {
    position:absolute; bottom:5px; left:5px;
    background:rgba(201,168,76,0.85); color:#0A0E1A;
    font-size:0.58rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;
    padding:2px 6px; border-radius:4px;
  }
  .img-existing-badge {
    position:absolute; top:5px; left:5px;
    background:rgba(99,179,237,0.85); color:#0A0E1A;
    font-size:0.56rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;
    padding:2px 6px; border-radius:4px;
  }
  .img-upload-note { font-size:0.76rem; color:rgba(255,255,255,0.32); margin-top:0.7rem; display:flex; align-items:center; gap:6px; }
  .lp-contact-note {
    font-size:0.78rem; color:rgba(255,255,255,0.32); line-height:1.6;
    background:rgba(201,168,76,0.05); border:1px solid rgba(201,168,76,0.12);
    border-radius:9px; padding:11px 13px; margin-bottom:1.1rem;
    display:flex; gap:9px; align-items:flex-start;
  }
  .lp-contact-note svg { flex-shrink:0; color:#C9A84C; margin-top:1px; }
  .lp-link-preview {
    display:inline-flex; align-items:center; gap:5px; margin-top:5px;
    font-size:0.78rem; color:#C9A84C; text-decoration:none; word-break:break-all;
  }
  .lp-link-preview:hover { opacity:0.8; text-decoration:underline; }

  /* modal submit bar */
  .db-modal-submit {
    padding:1.25rem 2rem; background:rgba(255,255,255,0.02);
    border-top:1px solid rgba(255,255,255,0.07);
    display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;
    position:sticky; bottom:0; border-radius:0 0 20px 20px; background:#0D1220;
  }
  .db-modal-note { font-size:0.78rem; color:rgba(255,255,255,0.3); line-height:1.5; }
  .db-modal-note strong { color:rgba(255,255,255,0.5); }
  .db-modal-btns { display:flex; gap:0.6rem; flex-wrap:wrap; }
  .db-modal-cancel {
    padding:11px 22px; border-radius:9px; font-family:'DM Sans',sans-serif;
    font-size:0.85rem; font-weight:600; cursor:pointer;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.5); transition:all 0.2s;
  }
  .db-modal-cancel:hover { background:rgba(255,255,255,0.1); color:#fff; }
  .db-modal-save {
    padding:11px 28px; border-radius:9px; font-family:'DM Sans',sans-serif;
    font-size:0.85rem; font-weight:700; cursor:pointer;
    background:linear-gradient(135deg,#C9A84C,#E8C878); border:none; color:#0A0E1A;
    display:flex; align-items:center; gap:7px; transition:opacity 0.2s,transform 0.2s;
  }
  .db-modal-save:hover:not(:disabled) { transform:translateY(-1px); opacity:0.92; }
  .db-modal-save:disabled { opacity:0.55; cursor:not-allowed; }

  /* ── Delete confirm modal ── */
  .db-del-modal {
    position:fixed; inset:0; z-index:400;
    background:rgba(0,0,0,0.82); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center; padding:2rem;
  }
  .db-del-box {
    background:#111827; border:1px solid rgba(255,255,255,0.1);
    border-radius:18px; padding:2rem; max-width:400px; width:100%;
    animation:db-pop 0.2s ease;
  }
  .db-del-icon {
    width:50px; height:50px; border-radius:13px;
    background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2);
    display:flex; align-items:center; justify-content:center; color:#EF4444;
    margin-bottom:1rem;
  }
  .db-del-box h3 { font-family:'Playfair Display',serif; font-size:1.2rem; color:#fff; margin-bottom:0.4rem; }
  .db-del-box p  { font-size:0.85rem; color:rgba(255,255,255,0.38); line-height:1.6; margin-bottom:1.4rem; }
  .db-del-btns { display:flex; gap:0.6rem; }
  .db-del-cancel {
    flex:1; padding:10px; border-radius:9px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:600;
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.55);
  }
  .db-del-confirm {
    flex:1; padding:10px; border-radius:9px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:700;
    background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); color:#EF4444;
    display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.2s;
  }
  .db-del-confirm:hover { background:rgba(239,68,68,0.22); }
  .db-del-confirm:disabled { opacity:0.5; cursor:not-allowed; }

  /* ── Toast ── */
  .db-toast {
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
    z-index:500; padding:11px 20px; border-radius:11px;
    font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:600;
    display:flex; align-items:center; gap:8px;
    animation:db-toast-in 0.3s ease; white-space:nowrap;
  }
  .db-toast.success { background:rgba(52,211,153,0.15); border:1px solid rgba(52,211,153,0.3); color:#34D399; }
  .db-toast.error   { background:rgba(239,68,68,0.15);  border:1px solid rgba(239,68,68,0.3);  color:#EF4444; }
  @keyframes db-toast-in { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  /* alerts */
  .db-alert {
    display:flex; align-items:flex-start; gap:9px;
    padding:11px 13px; border-radius:9px; font-size:0.82rem; line-height:1.5; margin-bottom:1rem;
  }
  .db-alert.error { background:rgba(240,100,80,0.08); border:1px solid rgba(240,100,80,0.2); color:#f46450; }

  .spinner {
    width:16px; height:16px;
    border:2px solid rgba(10,14,26,0.3); border-top-color:#0A0E1A;
    border-radius:50%; animation:spin 0.7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }

  .db-lp-btn {
    display:inline-flex; align-items:center; gap:8px;
    background:linear-gradient(135deg,#C9A84C,#E8C878);
    color:#0A0E1A; font-family:'DM Sans',sans-serif;
    font-weight:700; font-size:0.88rem;
    padding:12px 28px; border-radius:10px; border:none; cursor:pointer;
    transition:transform 0.2s,box-shadow 0.2s; text-decoration:none;
  }
  .db-lp-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(201,168,76,0.3); }

  /* breadcrumb */
  .db-breadcrumb {
    max-width:1100px; margin:0 auto; padding:1.4rem 2rem 0;
    display:flex; align-items:center; gap:6px;
    font-size:0.76rem; color:rgba(255,255,255,0.3);
  }
  .db-breadcrumb a { color:rgba(255,255,255,0.3); text-decoration:none; transition:color 0.2s; }
  .db-breadcrumb a:hover { color:#C9A84C; }
  .db-breadcrumb span { color:rgba(255,255,255,0.15); }

  /* verified badge */
  .db-verified { display:inline-flex; align-items:center; gap:4px; font-size:0.72rem; font-weight:600; color:#34D399; }

  @media (max-width:900px) {
    .db-stats-row { grid-template-columns:repeat(2,1fr); }
    .db-profile-grid { grid-template-columns:1fr 1fr; }
    .db-pw-grid { grid-template-columns:1fr; }
  }
  @media (max-width:640px) {
    .db-stats-row { grid-template-columns:1fr 1fr; }
    .db-profile-grid { grid-template-columns:1fr; }
    .lp-grid { grid-template-columns:1fr; }
    .lp-field.span-2 { grid-column:span 1; }
    .img-upload-grid { grid-template-columns:repeat(2,1fr); }
    .db-modal-submit { flex-direction:column; align-items:stretch; }
    .db-modal-btns { flex-direction:column; }
    .db-modal-save,.db-modal-cancel { justify-content:center; }
  }
`;

// ─── Utilities ─────────────────────────────────────────────────────────────────
function normalizeWebsite(url) {
  if (!url) return null;
  let clean = url.trim();
  if (!/^https?:\/\//i.test(clean)) clean = "https://" + clean;
  return clean;
}

function formatPrice(n) {
  if (!n) return null;
  return "₦" + Number(n).toLocaleString("en-NG");
}

function getListingPrice(listing) {
  if (listing.type === "hotel")    return listing.pricePerNight ? formatPrice(listing.pricePerNight) + "/night" : null;
  if (listing.type === "shortlet") return listing.pricePerNight ? formatPrice(listing.pricePerNight) + "/night" : null;
  if (listing.type === "sale")     return listing.price ? formatPrice(listing.price) : null;
  if (listing.type === "rent")     return listing.pricePerYear ? formatPrice(listing.pricePerYear) + "/yr" : null;
  return null;
}

const TYPE_LABELS = { hotel:"Hotel", shortlet:"Shortlet", sale:"For Sale", rent:"For Rent" };

// ─── Sub-components ────────────────────────────────────────────────────────────
function Counter({ value, onChange, min = 0, max = 20 }) {
  return (
    <div className="lp-counter">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function ImageSlot({ index, preview, isExisting, onAdd, onRemove }) {
  const inputRef = useRef();
  if (preview) {
    return (
      <div className="img-slot filled">
        <img src={preview} alt={`Photo ${index + 1}`} />
        {index === 0 && <span className="img-primary-badge">Cover</span>}
        {isExisting && <span className="img-existing-badge">Saved</span>}
        <button className="img-remove" type="button" onClick={() => onRemove(index)}>✕</button>
      </div>
    );
  }
  return (
    <div className="img-slot" onClick={() => inputRef.current.click()}>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && onAdd(index, e.target.files[0])} />
      <svg className="img-slot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span className="img-slot-label">{index === 0 ? "Cover photo" : `Photo ${index + 1}`}</span>
    </div>
  );
}

function AmenityGrid({ list, selected, onChange }) {
  const toggle = (item) => {
    if (selected.includes(item)) onChange(selected.filter((a) => a !== item));
    else onChange([...selected, item]);
  };
  return (
    <div className="amenities-grid">
      {list.map((item) => {
        const checked = selected.includes(item);
        return (
          <label key={item} className={`amenity-item ${checked ? "checked" : ""}`}>
            <input type="checkbox" checked={checked} onChange={() => toggle(item)} />
            <span className="amenity-tick">
              {checked && <svg viewBox="0 0 12 10" fill="none" stroke="#0A0E1A" strokeWidth="2" width="10" height="8"><polyline points="1 5 4.5 8.5 11 1"/></svg>}
            </span>
            {item}
          </label>
        );
      })}
    </div>
  );
}

// ─── Edit Forms (Hotel, Shortlet, Sale, Rent) ─────────────────────────────────
function HotelEditFields({ listing, onSubmit, submitting, error, onCancel }) {
  const [form, setForm] = useState({
    hotelName: listing.title || "",
    starRating: listing.starRating || "",
    address: listing.location?.address || "",
    state: listing.location?.state || "",
    city: listing.location?.city || "",
    totalRooms: listing.totalRooms?.toString() || "",
    pricePerNight: listing.pricePerNight?.toString() || "",
    description: listing.description || "",
    contactName: listing.contact?.name || "",
    contactPhone: listing.contact?.phone || "",
    contactEmail: listing.contact?.email || "",
    website: listing.contact?.website || "",
    amenities: listing.amenities || [],
  });
  const [images, setImages] = useState(() => {
    const slots = [null,null,null,null];
    (listing.images||[]).slice(0,4).forEach((url,i) => { slots[i] = { file:null, preview:url, isExisting:true }; });
    return slots;
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type:"hotel", form, images: images.filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Hotel Information</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Hotel Name <span className="req">*</span></label>
            <input className="lp-input" value={form.hotelName} onChange={(e) => set("hotelName", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Star Rating <span className="req">*</span></label>
            <select className="lp-select" value={form.starRating} onChange={(e) => set("starRating", e.target.value)} required>
              <option value="">Select rating</option>
              {["1 Star","2 Stars","3 Stars","4 Stars","5 Stars","Unrated"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="lp-field">
            <label>Total Rooms <span className="req">*</span></label>
            <input className="lp-input" type="number" min="1" value={form.totalRooms} onChange={(e) => set("totalRooms", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Price Per Night (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap"><span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" value={form.pricePerNight} onChange={(e) => set("pricePerNight", e.target.value)} required />
            </div>
          </div>
          <div className="lp-field span-2">
            <label>Description <span className="req">*</span></label>
            <textarea className="lp-textarea" value={form.description} onChange={(e) => set("description", e.target.value)} required />
          </div>
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>2</span> Location</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Street Address <span className="req">*</span></label>
            <input className="lp-input" value={form.address} onChange={(e) => set("address", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>State <span className="req">*</span></label>
            <select className="lp-select" value={form.state} onChange={(e) => set("state", e.target.value)} required>
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="lp-field">
            <label>City / Area <span className="req">*</span></label>
            <input className="lp-input" value={form.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>3</span> Amenities</div>
        <AmenityGrid list={AMENITIES_HOTEL} selected={form.amenities} onChange={(v) => set("amenities", v)} />
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos (up to 4)</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} isExisting={img?.isExisting}
              onAdd={(idx, file) => { const url = URL.createObjectURL(file); setImages((prev) => { const n=[...prev]; n[idx]={file,preview:url,isExisting:false}; return n; }); }}
              onRemove={(idx) => setImages((prev) => { const n=[...prev]; n[idx]=null; return n; })} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Slots marked <strong style={{color:"#63B3ED"}}>Saved</strong> keep the current image. JPG, PNG or WEBP.
        </p>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact & Booking</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Visitors contact you directly. We do not handle bookings.
        </div>
        <div className="lp-grid">
          <div className="lp-field">
            <label>Contact Name <span className="req">*</span></label>
            <input className="lp-input" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Phone <span className="req">*</span></label>
            <input className="lp-input" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Email</label>
            <input className="lp-input" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div className="lp-field">
            <label>Website / Booking Link</label>
            <input className="lp-input" type="text" placeholder="https://yourhotel.com" value={form.website}
              onChange={(e) => set("website", e.target.value)}
              onBlur={(e) => { const v=e.target.value.trim(); if(v&&!/^https?:\/\//i.test(v)) set("website","https://"+v); }} />
            {form.website && <a href={normalizeWebsite(form.website)} target="_blank" rel="noopener noreferrer" className="lp-link-preview">🔗 {normalizeWebsite(form.website)}</a>}
          </div>
        </div>
      </div>
      <EditModalSubmitBar submitting={submitting} error={error} onCancel={onCancel} />
    </form>
  );
}

function ShortletEditFields({ listing, onSubmit, submitting, error, onCancel }) {
  const [form, setForm] = useState({
    title: listing.title || "",
    address: listing.location?.address || "",
    state: listing.location?.state || "",
    city: listing.location?.city || "",
    pricePerNight: listing.pricePerNight?.toString() || "",
    pricePerWeek: listing.pricePerWeek?.toString() || "",
    minNights: listing.minNights?.toString() || "1",
    description: listing.description || "",
    contactName: listing.contact?.name || "",
    contactPhone: listing.contact?.phone || "",
    contactEmail: listing.contact?.email || "",
    website: listing.contact?.website || "",
    amenities: listing.amenities || [],
  });
  const [counts, setCounts] = useState({
    bedrooms: listing.bedrooms || 1,
    bathrooms: listing.bathrooms || 1,
    toilets: listing.toilets || 1,
  });
  const [images, setImages] = useState(() => {
    const slots = [null,null,null,null];
    (listing.images||[]).slice(0,4).forEach((url,i) => { slots[i]={file:null,preview:url,isExisting:true}; });
    return slots;
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setCount = (k, v) => setCounts((c) => ({ ...c, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type:"shortlet", form:{...form,...counts}, images:images.filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Shortlet Details</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Listing Title <span className="req">*</span></label>
            <input className="lp-input" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="lp-field"><label>Bedrooms <span className="req">*</span></label><Counter value={counts.bedrooms} onChange={(v) => setCount("bedrooms",v)} min={1} /></div>
          <div className="lp-field"><label>Bathrooms <span className="req">*</span></label><Counter value={counts.bathrooms} onChange={(v) => setCount("bathrooms",v)} min={1} /></div>
          <div className="lp-field"><label>Toilets</label><Counter value={counts.toilets} onChange={(v) => setCount("toilets",v)} min={1} /></div>
          <div className="lp-field">
            <label>Min Stay</label>
            <select className="lp-select" value={form.minNights} onChange={(e) => set("minNights", e.target.value)}>
              {["1","2","3","5","7","14","30"].map((n) => <option key={n} value={n}>{n} night{n!=="1"?"s":""}</option>)}
            </select>
          </div>
          <div className="lp-field">
            <label>Price Per Night (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap"><span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" value={form.pricePerNight} onChange={(e) => set("pricePerNight",e.target.value)} required />
            </div>
          </div>
          <div className="lp-field">
            <label>Price Per Week (₦)</label>
            <div className="lp-prefix-wrap"><span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" placeholder="Optional" value={form.pricePerWeek} onChange={(e) => set("pricePerWeek",e.target.value)} />
            </div>
          </div>
          <div className="lp-field span-2">
            <label>Description <span className="req">*</span></label>
            <textarea className="lp-textarea" value={form.description} onChange={(e) => set("description",e.target.value)} required />
          </div>
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>2</span> Location</div>
        <div className="lp-grid">
          <div className="lp-field span-2"><label>Street Address <span className="req">*</span></label><input className="lp-input" value={form.address} onChange={(e) => set("address",e.target.value)} required /></div>
          <div className="lp-field"><label>State <span className="req">*</span></label>
            <select className="lp-select" value={form.state} onChange={(e) => set("state",e.target.value)} required>
              <option value="">Select state</option>{NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="lp-field"><label>City / Area <span className="req">*</span></label><input className="lp-input" value={form.city} onChange={(e) => set("city",e.target.value)} required /></div>
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>3</span> Amenities</div>
        <AmenityGrid list={AMENITIES_SHORTLET} selected={form.amenities} onChange={(v) => set("amenities",v)} />
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos (up to 4)</div>
        <div className="img-upload-grid">
          {images.map((img,i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} isExisting={img?.isExisting}
              onAdd={(idx,file) => { const url=URL.createObjectURL(file); setImages((prev)=>{ const n=[...prev]; n[idx]={file,preview:url,isExisting:false}; return n; }); }}
              onRemove={(idx) => setImages((prev)=>{ const n=[...prev]; n[idx]=null; return n; })} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Slots marked <strong style={{color:"#63B3ED"}}>Saved</strong> keep the current image.
        </p>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Visitors contact you directly.
        </div>
        <div className="lp-grid">
          <div className="lp-field"><label>Your Name <span className="req">*</span></label><input className="lp-input" value={form.contactName} onChange={(e) => set("contactName",e.target.value)} required /></div>
          <div className="lp-field"><label>Phone / WhatsApp <span className="req">*</span></label><input className="lp-input" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone",e.target.value)} required /></div>
          <div className="lp-field"><label>Email</label><input className="lp-input" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail",e.target.value)} /></div>
          <div className="lp-field">
            <label>Listing Link</label>
            <input className="lp-input" type="text" value={form.website} onChange={(e) => set("website",e.target.value)}
              onBlur={(e) => { const v=e.target.value.trim(); if(v&&!/^https?:\/\//i.test(v)) set("website","https://"+v); }} />
            {form.website && <a href={normalizeWebsite(form.website)} target="_blank" rel="noopener noreferrer" className="lp-link-preview">🔗 {normalizeWebsite(form.website)}</a>}
          </div>
        </div>
      </div>
      <EditModalSubmitBar submitting={submitting} error={error} onCancel={onCancel} />
    </form>
  );
}

function SaleEditFields({ listing, onSubmit, submitting, error, onCancel }) {
  const [form, setForm] = useState({
    title: listing.title || "",
    propertyType: listing.propertyType || "",
    address: listing.location?.address || "",
    state: listing.location?.state || "",
    city: listing.location?.city || "",
    landSize: listing.landSize?.toString() || "",
    landUnit: listing.landUnit || "sqm",
    price: listing.price?.toString() || "",
    negotiable: listing.negotiable || false,
    description: listing.description || "",
    contactName: listing.contact?.name || "",
    contactPhone: listing.contact?.phone || "",
    contactEmail: listing.contact?.email || "",
    agencyName: listing.agencyName || "",
    amenities: listing.amenities || [],
  });
  const [counts, setCounts] = useState({ bedrooms:listing.bedrooms||0, bathrooms:listing.bathrooms||0, toilets:listing.toilets||0 });
  const [images, setImages] = useState(() => {
    const slots=[null,null,null,null];
    (listing.images||[]).slice(0,4).forEach((url,i) => { slots[i]={file:null,preview:url,isExisting:true}; });
    return slots;
  });
  const set = (k,v) => setForm((f) => ({...f,[k]:v}));
  const setCount = (k,v) => setCounts((c) => ({...c,[k]:v}));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type:"sale", form:{...form,...counts}, images:images.filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Property Details</div>
        <div className="lp-grid">
          <div className="lp-field span-2"><label>Listing Title <span className="req">*</span></label><input className="lp-input" value={form.title} onChange={(e) => set("title",e.target.value)} required /></div>
          <div className="lp-field">
            <label>Property Type <span className="req">*</span></label>
            <select className="lp-select" value={form.propertyType} onChange={(e) => set("propertyType",e.target.value)} required>
              <option value="">Select type</option>
              {["Detached House","Semi-Detached House","Terraced House","Bungalow","Duplex","Penthouse","Maisonette","Flat / Apartment","Land","Commercial Property","Warehouse"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="lp-field">
            <label>Sale Price (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap"><span className="lp-prefix">₦</span><input className="lp-input" type="number" value={form.price} onChange={(e) => set("price",e.target.value)} required /></div>
          </div>
          <div className="lp-field"><label>Bedrooms</label><Counter value={counts.bedrooms} onChange={(v) => setCount("bedrooms",v)} min={0} /></div>
          <div className="lp-field"><label>Bathrooms</label><Counter value={counts.bathrooms} onChange={(v) => setCount("bathrooms",v)} min={0} /></div>
          <div className="lp-field"><label>Toilets</label><Counter value={counts.toilets} onChange={(v) => setCount("toilets",v)} min={0} /></div>
          <div className="lp-field">
            <label>Land / Floor Size</label>
            <div style={{display:"flex",gap:"0.5rem"}}>
              <input className="lp-input" type="number" placeholder="500" value={form.landSize} onChange={(e) => set("landSize",e.target.value)} style={{flex:1}} />
              <select className="lp-select" value={form.landUnit} onChange={(e) => set("landUnit",e.target.value)} style={{width:"85px"}}>
                <option value="sqm">sqm</option><option value="sqft">sqft</option><option value="plots">plots</option><option value="acres">acres</option>
              </select>
            </div>
          </div>
          <div className="lp-field" style={{justifyContent:"flex-end"}}>
            <label style={{marginBottom:"0.5rem"}}>Pricing</label>
            <label className="amenity-item" style={{cursor:"pointer",maxWidth:"190px"}}>
              <input type="checkbox" style={{display:"none"}} checked={form.negotiable} onChange={(e) => set("negotiable",e.target.checked)} />
              <span className="amenity-tick" style={form.negotiable?{background:"#C9A84C",borderColor:"#C9A84C"}:{}}>
                {form.negotiable && <svg viewBox="0 0 12 10" fill="none" stroke="#0A0E1A" strokeWidth="2" width="10" height="8"><polyline points="1 5 4.5 8.5 11 1"/></svg>}
              </span>
              Price is negotiable
            </label>
          </div>
          <div className="lp-field span-2"><label>Description <span className="req">*</span></label><textarea className="lp-textarea" value={form.description} onChange={(e) => set("description",e.target.value)} required /></div>
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>2</span> Location</div>
        <div className="lp-grid">
          <div className="lp-field span-2"><label>Street Address <span className="req">*</span></label><input className="lp-input" value={form.address} onChange={(e) => set("address",e.target.value)} required /></div>
          <div className="lp-field"><label>State <span className="req">*</span></label>
            <select className="lp-select" value={form.state} onChange={(e) => set("state",e.target.value)} required>
              <option value="">Select state</option>{NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="lp-field"><label>City / Area <span className="req">*</span></label><input className="lp-input" value={form.city} onChange={(e) => set("city",e.target.value)} required /></div>
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>3</span> Features & Amenities</div>
        <AmenityGrid list={AMENITIES_SALE} selected={form.amenities} onChange={(v) => set("amenities",v)} />
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos</div>
        <div className="img-upload-grid">
          {images.map((img,i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} isExisting={img?.isExisting}
              onAdd={(idx,file) => { const url=URL.createObjectURL(file); setImages((prev)=>{ const n=[...prev]; n[idx]={file,preview:url,isExisting:false}; return n; }); }}
              onRemove={(idx) => setImages((prev)=>{ const n=[...prev]; n[idx]=null; return n; })} />
          ))}
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Agent / Owner Contact</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Buyers contact you directly.
        </div>
        <div className="lp-grid">
          <div className="lp-field"><label>Contact Name <span className="req">*</span></label><input className="lp-input" value={form.contactName} onChange={(e) => set("contactName",e.target.value)} required /></div>
          <div className="lp-field"><label>Phone / WhatsApp <span className="req">*</span></label><input className="lp-input" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone",e.target.value)} required /></div>
          <div className="lp-field"><label>Email</label><input className="lp-input" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail",e.target.value)} /></div>
          <div className="lp-field"><label>Agency / Company Name</label><input className="lp-input" placeholder="(if applicable)" value={form.agencyName} onChange={(e) => set("agencyName",e.target.value)} /></div>
        </div>
      </div>
      <EditModalSubmitBar submitting={submitting} error={error} onCancel={onCancel} />
    </form>
  );
}

function RentEditFields({ listing, onSubmit, submitting, error, onCancel }) {
  const [form, setForm] = useState({
    title: listing.title || "",
    propertyType: listing.propertyType || "",
    address: listing.location?.address || "",
    state: listing.location?.state || "",
    city: listing.location?.city || "",
    pricePerYear: listing.pricePerYear?.toString() || "",
    pricePerMonth: listing.pricePerMonth?.toString() || "",
    description: listing.description || "",
    contactName: listing.contact?.name || "",
    contactPhone: listing.contact?.phone || "",
    contactEmail: listing.contact?.email || "",
    agencyName: listing.agencyName || "",
    amenities: listing.amenities || [],
  });
  const [counts, setCounts] = useState({ bedrooms:listing.bedrooms||2, bathrooms:listing.bathrooms||2, toilets:listing.toilets||2 });
  const [images, setImages] = useState(() => {
    const slots=[null,null,null,null];
    (listing.images||[]).slice(0,4).forEach((url,i) => { slots[i]={file:null,preview:url,isExisting:true}; });
    return slots;
  });
  const set = (k,v) => setForm((f) => ({...f,[k]:v}));
  const setCount = (k,v) => setCounts((c) => ({...c,[k]:v}));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type:"rent", form:{...form,...counts}, images:images.filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Rental Details</div>
        <div className="lp-grid">
          <div className="lp-field span-2"><label>Listing Title <span className="req">*</span></label><input className="lp-input" value={form.title} onChange={(e) => set("title",e.target.value)} required /></div>
          <div className="lp-field">
            <label>Property Type <span className="req">*</span></label>
            <select className="lp-select" value={form.propertyType} onChange={(e) => set("propertyType",e.target.value)} required>
              <option value="">Select type</option>
              {["Flat / Apartment","Duplex","Bungalow","Mini Flat","Self Contain","Commercial"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="lp-field">
            <label>Price Per Year (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap"><span className="lp-prefix">₦</span><input className="lp-input" type="number" value={form.pricePerYear} onChange={(e) => set("pricePerYear",e.target.value)} required /></div>
          </div>
          <div className="lp-field">
            <label>Price Per Month (₦)</label>
            <div className="lp-prefix-wrap"><span className="lp-prefix">₦</span><input className="lp-input" type="number" placeholder="Optional" value={form.pricePerMonth} onChange={(e) => set("pricePerMonth",e.target.value)} /></div>
          </div>
          <div className="lp-field"><label>Bedrooms</label><Counter value={counts.bedrooms} onChange={(v) => setCount("bedrooms",v)} /></div>
          <div className="lp-field"><label>Bathrooms</label><Counter value={counts.bathrooms} onChange={(v) => setCount("bathrooms",v)} /></div>
          <div className="lp-field"><label>Toilets</label><Counter value={counts.toilets} onChange={(v) => setCount("toilets",v)} /></div>
          <div className="lp-field span-2"><label>Description <span className="req">*</span></label><textarea className="lp-textarea" value={form.description} onChange={(e) => set("description",e.target.value)} required /></div>
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>2</span> Location</div>
        <div className="lp-grid">
          <div className="lp-field span-2"><label>Street Address <span className="req">*</span></label><input className="lp-input" value={form.address} onChange={(e) => set("address",e.target.value)} required /></div>
          <div className="lp-field"><label>State <span className="req">*</span></label>
            <select className="lp-select" value={form.state} onChange={(e) => set("state",e.target.value)} required>
              <option value="">Select state</option>{NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="lp-field"><label>City / Area <span className="req">*</span></label><input className="lp-input" value={form.city} onChange={(e) => set("city",e.target.value)} required /></div>
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>3</span> Features</div>
        <AmenityGrid list={AMENITIES_RENT} selected={form.amenities} onChange={(v) => set("amenities",v)} />
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos</div>
        <div className="img-upload-grid">
          {images.map((img,i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} isExisting={img?.isExisting}
              onAdd={(idx,file) => { const url=URL.createObjectURL(file); setImages((prev)=>{ const n=[...prev]; n[idx]={file,preview:url,isExisting:false}; return n; }); }}
              onRemove={(idx) => setImages((prev)=>{ const n=[...prev]; n[idx]=null; return n; })} />
          ))}
        </div>
      </div>
      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact</div>
        <div className="lp-grid">
          <div className="lp-field"><label>Name <span className="req">*</span></label><input className="lp-input" value={form.contactName} onChange={(e) => set("contactName",e.target.value)} required /></div>
          <div className="lp-field"><label>Phone <span className="req">*</span></label><input className="lp-input" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone",e.target.value)} required /></div>
          <div className="lp-field"><label>Email</label><input className="lp-input" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail",e.target.value)} /></div>
          <div className="lp-field"><label>Agency</label><input className="lp-input" value={form.agencyName} onChange={(e) => set("agencyName",e.target.value)} /></div>
        </div>
      </div>
      <EditModalSubmitBar submitting={submitting} error={error} onCancel={onCancel} />
    </form>
  );
}

function EditModalSubmitBar({ submitting, error, onCancel }) {
  return (
    <div className="db-modal-submit">
      <div>
        {error && (
          <div className="db-alert error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}
        <p className="db-modal-note">Edits are reviewed within <strong>24 hours</strong>.</p>
      </div>
      <div className="db-modal-btns">
        <button type="button" className="db-modal-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="db-modal-save" disabled={submitting}>
          {submitting ? <><span className="spinner" /> Saving…</> : <>Save Changes <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
        </button>
      </div>
    </div>
  );
}

// ─── Edit Modal wrapper ────────────────────────────────────────────────────────
function EditModal({ listing, onClose, onSaved }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function uploadToCloudinary(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );
    const json = await res.json();
    if (!json.secure_url) throw new Error("Image upload failed");
    return json.secure_url;
  }

  async function handleSubmit({ type, form, images }) {
    setSubmitting(true);
    setError("");
    try {
      const imageUrls = await Promise.all(
        images.map((img) =>
          img.isExisting ? Promise.resolve(img.preview) : uploadToCloudinary(img.file)
        )
      );
      const res = await fetch(`/api/listings/${listing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          ...form,
          website: normalizeWebsite(form.website),
          images: imageUrls,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      onSaved();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const title = listing.title || "Listing";
  const typeLabel = TYPE_LABELS[listing.type] || listing.type;

  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()}>
        <div className="db-modal-hd">
          <div className="db-modal-hd-left">
            <div>
              <div className="db-modal-title">Edit Listing</div>
              <div className="db-modal-sub">{title} · <span style={{color:"#C9A84C"}}>{typeLabel}</span></div>
            </div>
          </div>
          <button className="db-modal-close" onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {listing.type === "hotel"    && <HotelEditFields    listing={listing} onSubmit={handleSubmit} submitting={submitting} error={error} onCancel={onClose} />}
        {listing.type === "shortlet" && <ShortletEditFields listing={listing} onSubmit={handleSubmit} submitting={submitting} error={error} onCancel={onClose} />}
        {listing.type === "sale"     && <SaleEditFields     listing={listing} onSubmit={handleSubmit} submitting={submitting} error={error} onCancel={onClose} />}
        {listing.type === "rent"     && <RentEditFields     listing={listing} onSubmit={handleSubmit} submitting={submitting} error={error} onCancel={onClose} />}
      </div>
    </div>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ listing, onEdit, onDelete }) {
  const price = getListingPrice(listing);
  const cover = listing.images?.[0];

  return (
    <div className="db-listing-card">
      <div className="db-card-img">
        {cover
          ? <img src={cover} alt={listing.title} />
          : <svg className="db-card-img-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
        }
        <span className={`db-card-type ${listing.type}`}>{TYPE_LABELS[listing.type] || listing.type}</span>
        <span className={`db-card-status ${listing.status || "pending"}`}>
          {listing.status === "approved" ? "Live" : listing.status === "rejected" ? "Rejected" : "Pending"}
        </span>
      </div>
      <div className="db-card-body">
        <div className="db-card-title">{listing.title}</div>
        <div className="db-card-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {listing.location?.city}{listing.location?.state ? `, ${listing.location.state}` : ""}
        </div>
        {price && <div className="db-card-price">{price}</div>}
      </div>
      <div className="db-card-actions">
        <Link href={`/listings/${listing._id}`} className="db-card-btn view">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </Link>
        <button className="db-card-btn edit" onClick={() => onEdit(listing)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button className="db-card-btn del" onClick={() => onDelete(listing)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardClient({ user }) {
  const [listings, setListings]         = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [activeTab, setActiveTab]       = useState("all");

  // Profile state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm]   = useState({ name: user.name || "", phone: user.phone || "", email: user.email || "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password state
  const [showPwSection, setShowPwSection] = useState(false);
  const [pwForm, setPwForm]             = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaving, setPwSaving]         = useState(false);
  const [pwError, setPwError]           = useState("");

  // Edit modal
  const [editListing, setEditListing]   = useState(null);

  // Delete modal
  const [deleteListing, setDeleteListing] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  // Toast
  const [toast, setToast]               = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoadingListings(true);
    try {
      const res  = await fetch("/api/listings/mine");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch listings");
      setListings(data.listings || []);
    } catch {
      setListings([]);
    } finally {
      setLoadingListings(false);
    }
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  // Stats
  const total    = listings.length;
  const active   = listings.filter((l) => l.status === "approved").length;
  const pending  = listings.filter((l) => l.status === "pending").length;
  const rejected = listings.filter((l) => l.status === "rejected").length;

  // Filtered listings
  const filtered = activeTab === "all" ? listings
    : listings.filter((l) => (l.status || "pending") === activeTab);

  // Profile save
  async function saveProfile(e) {
    e.preventDefault();
    setProfileSaving(true); setProfileError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone, email: profileForm.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setEditingProfile(false);
      showToast("Profile updated successfully");
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  }

  // Password save
  async function savePassword(e) {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords do not match."); return; }
    if (pwForm.newPw.length < 8)         { setPwError("Password must be at least 8 characters."); return; }
    setPwSaving(true); setPwError("");
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed");
      setPwForm({ current:"", newPw:"", confirm:"" });
      setShowPwSection(false);
      showToast("Password changed successfully");
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  }

  // Delete listing
  async function confirmDelete() {
    if (!deleteListing) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/listings?id=${deleteListing._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setListings((prev) => prev.filter((l) => l._id !== deleteListing._id));
      showToast("Listing deleted");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
      setDeleteListing(null);
    }
  }

  const initials = (user.name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <style>{DASH_CSS}</style>
      <div className="db-page">
        <Navbar />

        {/* Hero */}
        <div className="db-hero">
          <div className="db-hero-inner">
            <div className="db-hero-left">
              <div className="db-eyebrow">My Dashboard</div>
              <h1>Welcome back, <em>{user.name?.split(" ")[0] || "there"}</em></h1>
              <p>Manage your listings and account details from one place.</p>
            </div>
            <div className="db-avatar">{initials}</div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="db-breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>Dashboard</span>
        </div>

        <div className="db-wrap">

          {/* ── Stats ── */}
          <div className="db-stats-row">
            {[
              { label:"Total Listings", val:total, sub:"All time", color:"rgba(201,168,76,0.4)" },
              { label:"Live / Active",  val:active, sub:"Visible to visitors", color:"rgba(52,211,153,0.4)" },
              { label:"Under Review",   val:pending, sub:"Awaiting approval", color:"rgba(251,191,36,0.4)" },
              { label:"Rejected",       val:rejected, sub:"Needs attention", color:"rgba(239,68,68,0.4)" },
            ].map((s, i) => (
              <div className="db-stat-card" key={i} style={{"--sc": s.color}}>
                <div className="db-stat-label">{s.label}</div>
                <div className="db-stat-val">{loadingListings ? "—" : s.val}</div>
                <div className="db-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Profile ── */}
          <div className="db-profile-card">
            <div className="db-profile-header">
              <div className="db-profile-hd-left">
                <div className="db-avatar" style={{ width:44, height:44, fontSize:"1rem", borderRadius:11 }}>{initials}</div>
                <div>
                  <div className="db-profile-title">My Profile</div>
                  <div className="db-profile-sub">
                    {user.isVerified
                      ? <span className="db-verified"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M20 6L9 17l-5-5"/></svg> Verified Account</span>
                      : "Account not verified"
                    }
                  </div>
                </div>
              </div>
              {!editingProfile && (
                <button className="db-edit-btn" onClick={() => setEditingProfile(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={saveProfile}>
              <div className="db-profile-body">
                {profileError && (
                  <div className="db-alert error" style={{ marginBottom:"1rem" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {profileError}
                  </div>
                )}
                <div className="db-profile-grid">
                  {[
                    { label:"Full Name", key:"name", type:"text", placeholder:"Your full name" },
                    { label:"Email Address", key:"email", type:"email", placeholder:"you@example.com" },
                    { label:"Phone Number", key:"phone", type:"tel", placeholder:"+234 800 000 0000" },
                  ].map(({ label, key, type, placeholder }) => (
                    <div className="db-pfield" key={key}>
                      <label>{label}</label>
                      {editingProfile
                        ? <input className="db-pfield-input" type={type} placeholder={placeholder}
                            value={profileForm[key]}
                            onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))} />
                        : <div className="db-pfield-val">{user[key] || <span style={{ color:"rgba(255,255,255,0.2)" }}>Not set</span>}</div>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {editingProfile && (
                <div style={{ padding:"1rem 2rem", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:"0.6rem", flexWrap:"wrap" }}>
                  <button type="submit" className="db-save-btn" disabled={profileSaving}>
                    {profileSaving ? <><span className="spinner" /> Saving…</> : "Save Changes"}
                  </button>
                  <button type="button" className="db-cancel-btn" onClick={() => { setEditingProfile(false); setProfileError(""); }}>Cancel</button>
                </div>
              )}
            </form>

            {/* Password section */}
            <div className="db-pw-section">
              <button className="db-pw-toggle" type="button" onClick={() => setShowPwSection((v) => !v)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                {showPwSection ? "Hide password change" : "Change password"}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ transition:"transform 0.2s", transform: showPwSection ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showPwSection && (
                <form onSubmit={savePassword}>
                  {pwError && (
                    <div className="db-alert error" style={{ marginTop:"1rem" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {pwError}
                    </div>
                  )}
                  <div className="db-pw-grid">
                    {[
                      { label:"Current Password", key:"current", placeholder:"Enter current password" },
                      { label:"New Password",     key:"newPw",   placeholder:"At least 8 characters" },
                      { label:"Confirm New Password", key:"confirm", placeholder:"Repeat new password" },
                    ].map(({ label, key, placeholder }) => (
                      <div className="db-pfield" key={key}>
                        <label>{label}</label>
                        <input className="db-pfield-input" type="password" placeholder={placeholder}
                          value={pwForm[key]}
                          onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:"1rem", display:"flex", gap:"0.6rem" }}>
                    <button type="submit" className="db-save-btn" disabled={pwSaving}>
                      {pwSaving ? <><span className="spinner" /> Saving…</> : "Update Password"}
                    </button>
                    <button type="button" className="db-cancel-btn" onClick={() => { setShowPwSection(false); setPwError(""); }}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── My Listings ── */}
          <div className="db-section-hd">
            <div className="db-section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              My Listings
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
              <div className="db-tabs">
                {[
                  { id:"all", label:`All (${total})` },
                  { id:"approved", label:`Live (${active})` },
                  { id:"pending", label:`Pending (${pending})` },
                  { id:"rejected", label:`Rejected (${rejected})` },
                ].map((tab) => (
                  <button key={tab.id} className={`db-tab ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
                ))}
              </div>
              <Link href="/list-property" className="db-lp-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Listing
              </Link>
            </div>
          </div>

          <div className="db-listings-grid">
            {loadingListings ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="db-listing-card" style={{ opacity:0.5 }}>
                  <div className="db-card-img" style={{ background:"rgba(255,255,255,0.04)" }} />
                  <div className="db-card-body">
                    <div style={{ height:14, width:"70%", background:"rgba(255,255,255,0.07)", borderRadius:6 }} />
                    <div style={{ height:11, width:"45%", background:"rgba(255,255,255,0.05)", borderRadius:6, marginTop:8 }} />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="db-empty">
                <svg className="db-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="56" height="56">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <h3>{activeTab === "all" ? "No listings yet" : `No ${activeTab} listings`}</h3>
                <p>
                  {activeTab === "all"
                    ? "You haven't submitted any listings. Add your first one now."
                    : `You have no listings with status "${activeTab}".`}
                </p>
                {activeTab === "all" && (
                  <Link href="/list-property" className="db-lp-btn" style={{ marginTop:"0.5rem" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    List a Property
                  </Link>
                )}
              </div>
            ) : (
              filtered.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  onEdit={setEditListing}
                  onDelete={setDeleteListing}
                />
              ))
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* ── Edit Modal ── */}
      {editListing && (
        <EditModal
          listing={editListing}
          onClose={() => setEditListing(null)}
          onSaved={() => {
            setEditListing(null);
            showToast("Listing updated — pending review");
            fetchListings();
          }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteListing && (
        <div className="db-del-modal" onClick={() => setDeleteListing(null)}>
          <div className="db-del-box" onClick={(e) => e.stopPropagation()}>
            <div className="db-del-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
            <h3>Delete this listing?</h3>
            <p>This is permanent and cannot be undone. The listing will be removed from our platform immediately.</p>
            <div className="db-del-btns">
              <button className="db-del-cancel" onClick={() => setDeleteListing(null)}>Cancel</button>
              <button className="db-del-confirm" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`db-toast ${toast.type}`}>
          {toast.type === "success"
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M20 6L9 17l-5-5"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          }
          {toast.message}
        </div>
      )}
    </>
  );
}
