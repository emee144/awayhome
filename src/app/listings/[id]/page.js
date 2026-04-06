"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiPhone, FiMail, FiGlobe, FiEdit2, FiTrash2, FiArrowLeft,
         FiMapPin, FiHome, FiStar, FiCalendar, FiCheck } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Design System (matches listings page) ───────────────────────────────────
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .dp-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Breadcrumb ── */
  .dp-breadcrumb {
    max-width: 1100px; margin: 0 auto; padding: 1.4rem 2rem 0;
    display: flex; align-items: center; gap: 6px;
    font-size: 0.78rem; color: rgba(255,255,255,0.3);
  }
  .dp-breadcrumb a {
    color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s;
    display: flex; align-items: center; gap: 5px;
  }
  .dp-breadcrumb a:hover { color: #C9A84C; }
  .dp-breadcrumb span { color: rgba(255,255,255,0.15); }

  /* ── Main layout ── */
  .dp-wrap {
    max-width: 1100px; margin: 0 auto; padding: 1.75rem 2rem 5rem;
    width: 100%; flex: 1;
  }

  /* ── Header row ── */
  .dp-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .dp-header-left { flex: 1; min-width: 0; }
  .dp-badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 0.6rem; flex-wrap: wrap; }

  .dp-badge {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 6px;
  }
  .dp-badge.hotel   { background: rgba(96,165,250,0.9); color: #fff; }
  .dp-badge.shortlet { background: linear-gradient(135deg, rgba(52,211,153,0.95), rgba(16,185,129,0.95)); color: #fff; }
  .dp-badge.sale    { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); color: #C9A84C; }
  .dp-badge.rent    { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60A5FA; }

  .dp-status {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 6px;
  }
  .dp-status.pending  { background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.25); color: #FBBF24; }
  .dp-status.approved { background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.25); color: #34D399; }
  .dp-status.rejected { background: rgba(239,68,68,0.12);  border: 1px solid rgba(239,68,68,0.25);  color: #EF4444; }

  .dp-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 700; color: #fff; line-height: 1.15;
    margin-bottom: 0.5rem;
  }
  .dp-location { display: flex; align-items: center; gap: 5px; font-size: 0.88rem; color: rgba(255,255,255,0.4); }

  /* Owner action buttons */
  .dp-actions { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
  .dp-btn-edit {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3);
    color: #C9A84C; text-decoration: none; transition: background 0.2s, border-color 0.2s;
  }
  .dp-btn-edit:hover { background: rgba(201,168,76,0.18); border-color: rgba(201,168,76,0.5); }
  .dp-btn-del {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
    color: #EF4444; transition: background 0.2s, border-color 0.2s;
  }
  .dp-btn-del:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.45); }

  /* ── Gallery ── */
  .dp-gallery { display: grid; gap: 6px; margin-bottom: 2rem; border-radius: 16px; overflow: hidden; }
  .dp-gallery.one   { grid-template-columns: 1fr; grid-template-rows: 440px; }
  .dp-gallery.two   { grid-template-columns: 1fr 1fr; grid-template-rows: 380px; }
  .dp-gallery.three { grid-template-columns: 1fr 1fr; grid-template-rows: 280px 180px; }
  .dp-gallery.four  { grid-template-columns: 1fr 1fr; grid-template-rows: 260px 160px; }
  .dp-gallery.four .dp-gal-main { grid-row: 1 / 2; }

  .dp-gal-slot { position: relative; overflow: hidden; cursor: pointer; background: rgba(255,255,255,0.04); }
  .dp-gal-slot:first-child { grid-row: span 1; }
  .dp-gallery.three .dp-gal-slot:first-child { grid-row: span 2; grid-column: 1; }
  .dp-gal-slot img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .dp-gal-slot:hover img { transform: scale(1.04); }
  .dp-gal-more {
    position: absolute; inset: 0; background: rgba(0,0,0,0.55);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: 700; color: #fff; gap: 4px;
    font-family: 'Playfair Display', serif;
  }
  .dp-gal-more span { font-size: 0.72rem; font-weight: 500; color: rgba(255,255,255,0.6); font-family: 'DM Sans', sans-serif; letter-spacing: 0.06em; }

  /* Lightbox */
  .dp-lightbox {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center;
    padding: 2rem;
  }
  .dp-lb-inner { position: relative; max-width: 1000px; width: 100%; }
  .dp-lb-img { width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px; }
  .dp-lb-close {
    position: absolute; top: -44px; right: 0;
    background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer;
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; transition: background 0.2s;
  }
  .dp-lb-close:hover { background: rgba(255,255,255,0.2); }
  .dp-lb-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer;
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; transition: background 0.2s;
  }
  .dp-lb-nav:hover { background: rgba(255,255,255,0.2); }
  .dp-lb-nav.prev { left: -56px; }
  .dp-lb-nav.next { right: -56px; }
  .dp-lb-counter { text-align: center; margin-top: 12px; font-size: 0.8rem; color: rgba(255,255,255,0.4); }

  /* ── Content grid ── */
  .dp-body { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }

  /* ── Left column ── */
  .dp-left {}

  .dp-section { margin-bottom: 2rem; }
  .dp-section-title {
    font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700;
    color: rgba(255,255,255,0.9); margin-bottom: 1rem;
    padding-bottom: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; gap: 8px;
  }
  .dp-section-title svg { color: #C9A84C; }

  .dp-desc { font-size: 0.9rem; color: rgba(255,255,255,0.55); line-height: 1.8; }

  /* Stats row */
  .dp-stats { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .dp-stat {
    flex: 1; min-width: 120px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 1rem 1.1rem;
    display: flex; flex-direction: column; gap: 4px;
  }
  .dp-stat-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.3); font-weight: 600; }
  .dp-stat-val { font-size: 1rem; font-weight: 700; color: #fff; }
  .dp-stat-val.gold { color: #C9A84C; }

  /* Stars */
  .dp-stars { display: flex; gap: 3px; color: #C9A84C; margin-bottom: 4px; }

  /* Amenities */
  .dp-amenities { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  .dp-amenity {
    display: flex; align-items: center; gap: 6px;
    background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.15);
    color: rgba(255,255,255,0.65); font-size: 0.8rem; padding: 6px 13px; border-radius: 8px;
  }
  .dp-amenity svg { color: #C9A84C; flex-shrink: 0; }

  /* ── Right column — sidebar ── */
  .dp-sidebar { position: sticky; top: 90px; display: flex; flex-direction: column; gap: 1rem; }

  .dp-price-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 1.5rem;
  }
  .dp-price-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.35); margin-bottom: 6px; }
  .dp-price-main { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: #C9A84C; line-height: 1; margin-bottom: 4px; }
  .dp-price-sub { font-size: 0.8rem; color: rgba(255,255,255,0.3); margin-bottom: 1.25rem; }
  .dp-price-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 1rem 0; }

  .dp-contact-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 1.5rem;
  }
  .dp-contact-name { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 1rem; }
  .dp-contact-row {
    display: flex; align-items: center; gap: 10px;
    padding: 0.65rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.85rem; color: rgba(255,255,255,0.55);
  }
  .dp-contact-row:last-child { border-bottom: none; }
  .dp-contact-row svg { color: #C9A84C; flex-shrink: 0; }
  .dp-contact-row a { color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s; word-break: break-all; }
  .dp-contact-row a:hover { color: #C9A84C; }

  .dp-cta {
    width: 100%; padding: 13px; border-radius: 11px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700;
    background: linear-gradient(135deg, #C9A84C, #a8843c);
    border: none; color: #0A0E1A;
    transition: opacity 0.2s, transform 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .dp-cta:hover { opacity: 0.9; transform: translateY(-1px); }
  .dp-cta-ghost {
    width: 100%; padding: 12px; border-radius: 11px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
    background: none; border: 1px solid rgba(201,168,76,0.3); color: #C9A84C;
    transition: background 0.2s, border-color 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    text-decoration: none; margin-top: 0.6rem;
  }
  .dp-cta-ghost:hover { background: rgba(201,168,76,0.08); border-color: rgba(201,168,76,0.5); }

  /* ── Delete modal ── */
  .dp-modal-bg {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 2rem;
  }
  .dp-modal {
    background: #111827; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px; padding: 2rem; max-width: 420px; width: 100%;
    animation: dp-pop 0.2s ease;
  }
  @keyframes dp-pop { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .dp-modal-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center; color: #EF4444;
    margin-bottom: 1.1rem;
  }
  .dp-modal h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: #fff; margin-bottom: 0.5rem; }
  .dp-modal p  { font-size: 0.875rem; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 1.5rem; }
  .dp-modal-btns { display: flex; gap: 0.6rem; }
  .dp-modal-cancel {
    flex: 1; padding: 11px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6);
    transition: background 0.2s;
  }
  .dp-modal-cancel:hover { background: rgba(255,255,255,0.1); }
  .dp-modal-confirm {
    flex: 1; padding: 11px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 700;
    background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35); color: #EF4444;
    transition: background 0.2s, border-color 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .dp-modal-confirm:hover { background: rgba(239,68,68,0.25); border-color: rgba(239,68,68,0.55); }
  .dp-modal-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Skeletons ── */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .dp-sk {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 600px 100%; animation: shimmer 1.4s infinite linear; border-radius: 8px;
  }
  .dp-sk-gallery { height: 380px; border-radius: 16px; margin-bottom: 2rem; }
  .dp-sk-block   { margin-bottom: 0.6rem; }

  /* ── Error / 404 ── */
  .dp-notfound {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 5rem 2rem; text-align: center; color: rgba(255,255,255,0.2);
  }
  .dp-notfound h2 { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: rgba(255,255,255,0.45); margin-bottom: 0.5rem; }
  .dp-notfound p  { font-size: 0.9rem; margin-bottom: 1.5rem; }

  .dp-back-link {
    display: inline-flex; align-items: center; gap: 7px;
    color: #C9A84C; text-decoration: none; font-size: 0.85rem; font-weight: 600;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25);
    padding: 9px 18px; border-radius: 9px; transition: background 0.2s;
  }
  .dp-back-link:hover { background: rgba(201,168,76,0.18); }

  /* ── Toast ── */
  .dp-toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    z-index: 999; padding: 12px 22px; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
    animation: dp-toast-in 0.3s ease;
    display: flex; align-items: center; gap: 8px;
  }
  .dp-toast.success { background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.3); color: #34D399; }
  .dp-toast.error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.3);  color: #EF4444; }
  @keyframes dp-toast-in { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .dp-body { grid-template-columns: 1fr; }
    .dp-sidebar { position: static; }
    .dp-gallery.three { grid-template-columns: 1fr; grid-template-rows: repeat(3, 200px); }
    .dp-gallery.three .dp-gal-slot:first-child { grid-row: span 1; grid-column: auto; }
    .dp-lb-nav.prev { left: -12px; }
    .dp-lb-nav.next { right: -12px; }
  }
  @media (max-width: 560px) {
    .dp-wrap { padding: 1.25rem 1rem 4rem; }
    .dp-gallery.two, .dp-gallery.four { grid-template-columns: 1fr; grid-template-rows: auto; }
    .dp-gal-slot { height: 220px; }
    .dp-gallery.one .dp-gal-slot { height: 260px; }
    .dp-actions { flex-wrap: wrap; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (n) => "₦" + Number(n).toLocaleString("en-NG");

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const ChevL = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevR = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── Gallery ─────────────────────────────────────────────────────────────────
function Gallery({ images }) {
  const [lightbox, setLightbox] = useState(null); // index

  if (!images?.length) return null;

  const count  = images.length;
  const layout = count === 1 ? "one" : count === 2 ? "two" : count === 3 ? "three" : "four";
  const shown  = Math.min(count, 4);

  const open  = (i) => setLightbox(i);
  const close = () => setLightbox(null);
  const prev  = () => setLightbox((i) => (i - 1 + count) % count);
  const next  = () => setLightbox((i) => (i + 1) % count);

  return (
    <>
      <div className={`dp-gallery ${layout}`}>
        {images.slice(0, shown).map((src, i) => (
          <div className="dp-gal-slot" key={i} onClick={() => open(i)}>
            <img src={src} alt={`Photo ${i + 1}`} />
            {i === shown - 1 && count > shown && (
              <div className="dp-gal-more">
                +{count - shown}
                <span>more photos</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div className="dp-lightbox" onClick={close}>
          <div className="dp-lb-inner" onClick={(e) => e.stopPropagation()}>
            <button className="dp-lb-close" onClick={close}><CloseIcon /></button>
            {count > 1 && (
              <button className="dp-lb-nav prev" onClick={prev}><ChevL /></button>
            )}
            <img className="dp-lb-img" src={images[lightbox]} alt={`Photo ${lightbox + 1}`} />
            {count > 1 && (
              <button className="dp-lb-nav next" onClick={next}><ChevR /></button>
            )}
            <p className="dp-lb-counter">{lightbox + 1} / {count}</p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="dp-wrap">
      <div className="dp-sk dp-sk-gallery" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
        <div>
          <div className="dp-sk dp-sk-block" style={{ height: 20, width: "30%" }} />
          <div className="dp-sk dp-sk-block" style={{ height: 36, width: "70%" }} />
          <div className="dp-sk dp-sk-block" style={{ height: 14, width: "40%" }} />
          <div style={{ height: "1.5rem" }} />
          <div className="dp-sk dp-sk-block" style={{ height: 14, width: "100%" }} />
          <div className="dp-sk dp-sk-block" style={{ height: 14, width: "95%" }} />
          <div className="dp-sk dp-sk-block" style={{ height: 14, width: "80%" }} />
        </div>
        <div>
          <div className="dp-sk" style={{ height: 200, borderRadius: 16 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ onCancel, onConfirm, loading }) {
  return (
    <div className="dp-modal-bg" onClick={onCancel}>
      <div className="dp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dp-modal-icon">
          <FiTrash2 size={22} />
        </div>
        <h3>Delete this listing?</h3>
        <p>This action is permanent and cannot be undone. The listing will be removed from our platform immediately.</p>
        <div className="dp-modal-btns">
          <button className="dp-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="dp-modal-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting…" : <><FiTrash2 size={14} /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
  return (
    <div className={`dp-toast ${type}`}>
      {type === "success" ? <FiCheck size={15} /> : null}
      {message}
    </div>
  );
}

// ─── Stat helpers ─────────────────────────────────────────────────────────────
function buildStats(listing) {
  const { type } = listing;
  const stats = [];

  if (type === "hotel") {
    stats.push({ label: "Star Rating", value: listing.starRating ? `${listing.starRating} Star` : "—" });
    stats.push({ label: "Total Rooms", value: listing.totalRooms || "—" });
    stats.push({ label: "Per Night", value: listing.pricePerNight ? formatPrice(listing.pricePerNight) : "—", gold: true });
  }
  if (type === "shortlet") {
    stats.push({ label: "Bedrooms",   value: listing.bedrooms || "—" });
    stats.push({ label: "Bathrooms",  value: listing.bathrooms || "—" });
    stats.push({ label: "Toilets",    value: listing.toilets || "—" });
    stats.push({ label: "Min Nights", value: listing.minNights || 1 });
    stats.push({ label: "Per Night",  value: listing.pricePerNight ? formatPrice(listing.pricePerNight) : "—", gold: true });
    if (listing.pricePerWeek) stats.push({ label: "Per Week", value: formatPrice(listing.pricePerWeek), gold: true });
  }
  if (type === "sale") {
    stats.push({ label: "Property Type", value: listing.propertyType || "—" });
    if (listing.bedrooms) stats.push({ label: "Bedrooms",  value: listing.bedrooms });
    if (listing.bathrooms) stats.push({ label: "Bathrooms", value: listing.bathrooms });
    if (listing.toilets)   stats.push({ label: "Toilets",   value: listing.toilets });
    if (listing.landSize)  stats.push({ label: "Land Size",  value: `${listing.landSize} ${listing.landUnit || "sqm"}` });
    stats.push({ label: "Negotiable", value: listing.negotiable ? "Yes" : "No" });
  }
  if (type === "rent") {
    stats.push({ label: "Property Type", value: listing.propertyType || "—" });
    if (listing.bedrooms)  stats.push({ label: "Bedrooms",  value: listing.bedrooms });
    if (listing.bathrooms) stats.push({ label: "Bathrooms", value: listing.bathrooms });
    if (listing.toilets)   stats.push({ label: "Toilets",   value: listing.toilets });
    stats.push({ label: "Negotiable", value: listing.negotiable ? "Yes" : "No" });
  }
  return stats;
}

function buildPriceBlock(listing) {
  const { type } = listing;
  if (type === "hotel")    return { label: "Price per night",  value: listing.pricePerNight };
  if (type === "shortlet") return { label: "Price per night",  value: listing.pricePerNight };
  if (type === "sale")     return { label: "Asking price",     value: listing.price };
  if (type === "rent") {
    if (listing.pricePerYear)  return { label: "Per year",  value: listing.pricePerYear };
    if (listing.pricePerMonth) return { label: "Per month", value: listing.pricePerMonth };
  }
  return { label: "Price", value: null };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ListingDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();

  const [listing,     setListing]     = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showDelete,  setShowDelete]  = useState(false);
  const [delLoading,  setDelLoading]  = useState(false);
  const [toast,       setToast]       = useState(null); // { message, type }

  // Fetch listing
  const fetchListing = useCallback(async () => {
    setLoading(true); setError(null);
    try {
        console.log("ID:", id);
      const res  = await fetch(`/api/listings/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Listing not found.");
      setListing(data.listing);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch current user session
  const fetchUser = useCallback(async () => {
    try {
      const res  = await fetch("/api/auth/me");
      if (!res.ok) return;
      const data = await res.json();
      setCurrentUser(data.user || null);
    } catch {}
  }, []);

  useEffect(() => {
    fetchListing();
    fetchUser();
  }, [fetchListing, fetchUser]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      const res  = await fetch(`/api/listings/?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      showToast("Listing deleted successfully.");
      setTimeout(() => router.push("/listings"), 1500);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDelLoading(false);
      setShowDelete(false);
    }
  };

  const isOwner = listing && currentUser &&
    String(listing.createdBy) === String(currentUser._id);

  // ── Loading
  if (loading) {
    return (
      <>
        <style>{PAGE_CSS}</style>
        <div className="dp-page">
          <Navbar />
          <Skeleton />
          <Footer />
        </div>
      </>
    );
  }

  // ── Error / Not found
  if (error || !listing) {
    return (
      <>
        <style>{PAGE_CSS}</style>
        <div className="dp-page">
          <Navbar />
          <div className="dp-notfound">
            <h2>Listing Not Found</h2>
            <p>{error || "This listing may have been removed or doesn't exist."}</p>
            <Link href="/listings" className="dp-back-link">
              <FiArrowLeft size={15} /> Back to Listings
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const { type, title, images, location, description, amenities, status, contact, agencyName } = listing;
  const stats      = buildStats(listing);
  const priceBlock = buildPriceBlock(listing);

  const typeLabel  = type === "hotel" ? "Hotel" : type === "shortlet" ? "Shortlet"
                   : type === "rent"  ? "For Rent" : "For Sale";

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="dp-page">
        <Navbar />

        {/* Breadcrumb */}
        <nav className="dp-breadcrumb">
          <Link href="/listings"><FiArrowLeft size={13} /> Listings</Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{title}</span>
        </nav>

        <div className="dp-wrap">

          {/* Header */}
          <div className="dp-header">
            <div className="dp-header-left">
              <div className="dp-badge-row">
                <span className={`dp-badge ${type}`}>{typeLabel}</span>
                {isOwner && (
                  <span className={`dp-status ${status}`}>
                    {status === "pending" ? "Under Review" : status === "approved" ? "Live" : "Rejected"}
                  </span>
                )}
              </div>

              {type === "hotel" && listing.starRating && (
                <div className="dp-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < listing.starRating} />
                  ))}
                </div>
              )}

              <h1 className="dp-title">{title}</h1>
              <p className="dp-location">
                <FiMapPin size={13} />
                {location?.address && `${location.address}, `}
                {location?.city}, {location?.state}
              </p>
            </div>

            {/* Owner controls */}
            {isOwner && (
              <div className="dp-actions">
                <Link href={`/listings/${id}/edit`} className="dp-btn-edit">
                  <FiEdit2 size={14} /> Edit
                </Link>
                <button className="dp-btn-del" onClick={() => setShowDelete(true)}>
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Gallery */}
          <Gallery images={images} />

          {/* Body */}
          <div className="dp-body">

            {/* Left */}
            <div className="dp-left">

              {/* Stats */}
              {stats.length > 0 && (
                <div className="dp-section">
                  <p className="dp-section-title"><FiHome size={15} /> Property Details</p>
                  <div className="dp-stats">
                    {stats.map((s, i) => (
                      <div className="dp-stat" key={i}>
                        <span className="dp-stat-label">{s.label}</span>
                        <span className={`dp-stat-val${s.gold ? " gold" : ""}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="dp-section">
                  <p className="dp-section-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Description
                  </p>
                  <p className="dp-desc">{description}</p>
                </div>
              )}

              {/* Amenities */}
              {amenities?.length > 0 && (
                <div className="dp-section">
                  <p className="dp-section-title">
                    <FiCheck size={15} /> Amenities
                  </p>
                  <div className="dp-amenities">
                    {amenities.map((a, i) => (
                      <span className="dp-amenity" key={i}>
                        <FiCheck size={12} /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Agency */}
              {agencyName && (
                <div className="dp-section">
                  <p className="dp-section-title">
                    <FiStar size={15} /> Agency
                  </p>
                  <p className="dp-desc">{agencyName}</p>
                </div>
              )}

            </div>

            {/* Right sidebar */}
            <div className="dp-sidebar">

              {/* Price card */}
              <div className="dp-price-card">
                <p className="dp-price-label">{priceBlock.label}</p>
                <p className="dp-price-main">
                  {priceBlock.value ? formatPrice(priceBlock.value) : "Contact for price"}
                </p>
                {type === "rent" && listing.pricePerYear && listing.pricePerMonth && (
                  <p className="dp-price-sub">
                    Also available: {formatPrice(listing.pricePerMonth)}/month
                  </p>
                )}
                {listing.negotiable && (
                  <p className="dp-price-sub" style={{ color: "#C9A84C" }}>Price is negotiable</p>
                )}

                <div className="dp-price-divider" />

                {/* CTA — call */}
                {contact?.phone && (
                  <a href={`tel:${contact.phone}`} className="dp-cta">
                    <FiPhone size={15} /> Call Now
                  </a>
                )}

                {/* CTA — WhatsApp */}
                {contact?.phone && (
                  <a
                    href={`https://wa.me/${contact.phone.replace(/^\+/, "").replace(/^0/, "234")}`}
                    target="_blank" rel="noreferrer"
                    className="dp-cta-ghost"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12.004 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.882l6.219-1.433A11.938 11.938 0 0012.004 24C18.63 24 24 18.627 24 12S18.63 0 12.004 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.214-3.712.856.921-3.618-.235-.371a9.818 9.818 0 01-1.502-5.103c0-5.42 4.413-9.818 9.894-9.818 5.482 0 9.895 4.398 9.895 9.818 0 5.421-4.413 9.818-9.895 9.818z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
              </div>

              {/* Contact card */}
              {contact && (
                <div className="dp-contact-card">
                  <p className="dp-contact-name">{contact.name}</p>

                  {contact.phone && (
                    <div className="dp-contact-row">
                      <FiPhone size={14} />
                      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                    </div>
                  )}
                  {contact.email && (
                    <div className="dp-contact-row">
                      <FiMail size={14} />
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </div>
                  )}
                  {contact.website && (
                    <div className="dp-contact-row">
                      <FiGlobe size={14} />
                      <a href={contact.website} target="_blank" rel="noreferrer">Visit Website</a>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        <Footer />
      </div>


      {showDelete && (
        <DeleteModal
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
          loading={delLoading}
        />
      )}


      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
