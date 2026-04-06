"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  "Airport Shuttle","Laundry","Business Centre","Generator","CCTV",
  "Solar Power","Smart Home",
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
  "Prepaid Meter","Wardrobes","Kitchen Cabinets",
  "Balcony","Tiled Floors","POP Ceiling","Fence",
];

const CLOUDINARY_DOMAIN = "res.cloudinary.com";
const MAX_IMAGES = 4;

// ─── Shared CSS (identical design system as list page) ────────────────────────
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .lp-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  .lp-hero {
    position: relative; padding: 8rem 2rem 4rem;
    background: #0D1220;
    border-bottom: 1px solid rgba(201,168,76,0.12);
    overflow: hidden;
  }
  .lp-hero::before {
    content: ''; position: absolute;
    width: 700px; height: 700px; border-radius: 50%;
    background: rgba(201,168,76,0.04); filter: blur(100px);
    top: -200px; right: -200px; pointer-events: none;
  }
  .lp-hero-inner { position: relative; max-width: 800px; margin: 0 auto; text-align: center; }
  .lp-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem;
  }
  .lp-eyebrow.blue {
    background: rgba(99,179,237,0.1); border-color: rgba(99,179,237,0.28); color: #63B3ED;
  }
  .lp-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #fff; line-height: 1.15;
    margin-bottom: 1rem;
  }
  .lp-hero h1 em { font-style: italic; color: #C9A84C; }
  .lp-hero p { font-size: 0.95rem; color: rgba(255,255,255,0.5); line-height: 1.7; }

  .lp-main { max-width: 860px; margin: 0 auto; padding: 2rem 2rem 5rem; width: 100%; }

  .lp-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; overflow: hidden;
  }

  .lp-section {
    padding: 1.75rem 2rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .lp-section:last-child { border-bottom: none; }
  .lp-section-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 1.5rem;
  }
  .lp-section-title span {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(201,168,76,0.15); color: #C9A84C;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
  }

  .lp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
  .lp-grid.cols-1 { grid-template-columns: 1fr; }

  .lp-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .lp-field.span-2 { grid-column: span 2; }
  .lp-field.span-3 { grid-column: span 3; }

  .lp-field label {
    font-size: 0.8rem; font-weight: 600;
    color: rgba(255,255,255,0.65); letter-spacing: 0.04em;
  }
  .lp-field label .req { color: #C9A84C; margin-left: 2px; }

  .lp-input, .lp-select, .lp-textarea {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .lp-input { padding: 12px 14px; }
  .lp-select { padding: 12px 14px; cursor: pointer; }
  .lp-textarea { padding: 12px 14px; resize: vertical; min-height: 110px; line-height: 1.6; }
  .lp-input::placeholder, .lp-textarea::placeholder { color: rgba(255,255,255,0.25); }
  .lp-select option { background: #0F1525; color: #fff; }
  .lp-input:focus, .lp-select:focus, .lp-textarea:focus {
    border-color: rgba(201,168,76,0.55); background: rgba(255,255,255,0.08);
  }

  .lp-prefix-wrap { position: relative; }
  .lp-prefix {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: #C9A84C; font-weight: 600; font-size: 0.9rem; pointer-events: none;
  }
  .lp-prefix-wrap .lp-input { padding-left: 32px; }

  .lp-counter {
    display: flex; align-items: center; gap: 0;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; overflow: hidden;
  }
  .lp-counter button {
    width: 40px; height: 46px; background: none; border: none;
    color: rgba(255,255,255,0.5); font-size: 1.1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s; flex-shrink: 0;
  }
  .lp-counter button:hover { background: rgba(201,168,76,0.1); color: #C9A84C; }
  .lp-counter span {
    flex: 1; text-align: center; font-size: 0.95rem; font-weight: 600;
    color: #fff; border-left: 1px solid rgba(255,255,255,0.08);
    border-right: 1px solid rgba(255,255,255,0.08); height: 46px;
    display: flex; align-items: center; justify-content: center;
  }

  .lp-link-preview {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;
    font-size: 0.8rem; color: #C9A84C; text-decoration: none;
    word-break: break-all; transition: opacity 0.2s;
  }
  .lp-link-preview:hover { opacity: 0.8; text-decoration: underline; }

  .amenities-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 0.6rem;
  }
  .amenity-item {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; cursor: pointer; transition: all 0.2s;
    font-size: 0.82rem; color: rgba(255,255,255,0.6);
    user-select: none;
  }
  .amenity-item:hover { border-color: rgba(201,168,76,0.3); color: rgba(255,255,255,0.85); }
  .amenity-item.checked { border-color: rgba(201,168,76,0.45); background: rgba(201,168,76,0.08); color: #fff; }
  .amenity-item input { display: none; }
  .amenity-tick {
    width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
    border: 1.5px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .amenity-item.checked .amenity-tick { background: #C9A84C; border-color: #C9A84C; }

  /* ── Image slots ── */
  .img-upload-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
  .img-slot {
    aspect-ratio: 1; border-radius: 12px; overflow: hidden;
    border: 1.5px dashed rgba(255,255,255,0.15);
    position: relative; cursor: pointer; transition: border-color 0.2s;
    background: rgba(255,255,255,0.03);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  }
  .img-slot:hover { border-color: rgba(201,168,76,0.4); }
  .img-slot.filled { border-style: solid; border-color: rgba(201,168,76,0.3); }
  .img-slot img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .img-slot-label { font-size: 0.72rem; color: rgba(255,255,255,0.35); }
  .img-slot-icon { color: rgba(255,255,255,0.25); }
  .img-remove {
    position: absolute; top: 6px; right: 6px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(240,100,80,0.85); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; color: #fff;
    font-size: 12px; transition: background 0.2s; z-index: 2;
  }
  .img-remove:hover { background: #f46450; }
  .img-primary-badge {
    position: absolute; bottom: 6px; left: 6px;
    background: rgba(201,168,76,0.85); color: #0A0E1A;
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 2px 7px; border-radius: 4px;
  }
  .img-upload-note {
    font-size: 0.78rem; color: rgba(255,255,255,0.35); margin-top: 0.75rem;
    display: flex; align-items: center; gap: 6px;
  }
  /* existing image badge */
  .img-existing-badge {
    position: absolute; top: 6px; left: 6px;
    background: rgba(99,179,237,0.85); color: #0A0E1A;
    font-size: 0.58rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 2px 7px; border-radius: 4px;
  }

  .lp-contact-note {
    font-size: 0.8rem; color: rgba(255,255,255,0.35); line-height: 1.6;
    background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.12);
    border-radius: 10px; padding: 12px 14px; margin-bottom: 1.25rem;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .lp-contact-note svg { flex-shrink: 0; color: #C9A84C; margin-top: 1px; }

  .lp-alert {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 13px 14px; border-radius: 10px; font-size: 0.85rem; line-height: 1.5;
    margin-bottom: 1.5rem;
  }
  .lp-alert svg { flex-shrink: 0; margin-top: 1px; }
  .lp-alert.error { background: rgba(240,100,80,0.08); border: 1px solid rgba(240,100,80,0.2); color: #f46450; }
  .lp-alert.success { background: rgba(93,219,144,0.08); border: 1px solid rgba(93,219,144,0.2); color: #5ddb90; }

  /* ── Submit bar ── */
  .lp-submit-bar {
    padding: 1.5rem 2rem;
    background: rgba(255,255,255,0.02);
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .lp-submit-note { font-size: 0.8rem; color: rgba(255,255,255,0.35); }
  .lp-submit-note strong { color: rgba(255,255,255,0.6); }

  .lp-btn {
    background: linear-gradient(135deg, #C9A84C, #E8C878);
    color: #0A0E1A; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 0.95rem;
    padding: 14px 36px; border-radius: 10px; border: none; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }
  .lp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,168,76,0.35); }
  .lp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .lp-btn.ghost {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
  }
  .lp-btn.ghost:hover:not(:disabled) { background: rgba(255,255,255,0.1); box-shadow: none; }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(10,14,26,0.3); border-top-color: #0A0E1A;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* skeleton loader */
  .skeleton-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;
  }
  .skeleton-line {
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%);
    background-size: 400% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border-radius: 8px;
  }
  @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

  /* success state */
  .lp-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 1rem; padding: 4rem 2rem;
  }
  .lp-success-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(93,219,144,0.1); border: 1px solid rgba(93,219,144,0.25);
    display: flex; align-items: center; justify-content: center; color: #5ddb90;
  }
  .lp-success h2 { font-family: 'Playfair Display', serif; font-size: 1.75rem; color: #fff; }
  .lp-success p { font-size: 0.9rem; color: rgba(255,255,255,0.45); max-width: 420px; line-height: 1.7; }
  .lp-success p strong { color: #C9A84C; }

  /* breadcrumb */
  .lp-breadcrumb {
    max-width: 860px; margin: 0 auto; padding: 1.5rem 2rem 0;
    display: flex; align-items: center; gap: 6px;
    font-size: 0.78rem; color: rgba(255,255,255,0.3);
  }
  .lp-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
  .lp-breadcrumb a:hover { color: #C9A84C; }
  .lp-breadcrumb span { color: rgba(255,255,255,0.15); }

  /* type badge */
  .type-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2);
    border-radius: 100px; padding: 4px 14px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #C9A84C;
  }

  /* pending warning */
  .pending-notice {
    max-width: 860px; margin: 1.5rem auto 0; padding: 0 2rem;
  }
  .pending-notice-inner {
    background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.2);
    border-radius: 12px; padding: 12px 16px;
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 0.82rem; color: rgba(255,255,255,0.5); line-height: 1.6;
  }
  .pending-notice-inner svg { color: #FBBF24; flex-shrink: 0; margin-top: 1px; }

  @media (max-width: 680px) {
    .lp-grid { grid-template-columns: 1fr; }
    .lp-field.span-2, .lp-field.span-3 { grid-column: span 1; }
    .img-upload-grid { grid-template-columns: repeat(2, 1fr); }
    .lp-submit-bar { flex-direction: column; align-items: stretch; }
    .lp-btn { justify-content: center; }
  }
`;

// ─── Utilities ─────────────────────────────────────────────────────────────────
function normalizeWebsite(url) {
  if (!url) return null;
  let clean = url.trim();
  if (!/^https?:\/\//i.test(clean)) clean = "https://" + clean;
  return clean;
}

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
        <button className="img-remove" type="button" onClick={() => onRemove(index)} title="Remove">✕</button>
      </div>
    );
  }
  return (
    <div className="img-slot" onClick={() => inputRef.current.click()}>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && onAdd(index, e.target.files[0])} />
      <svg className="img-slot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5"/>
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

// ─── Shared submit bar ─────────────────────────────────────────────────────────
function SubmitBar({ submitting, error, listingId }) {
  return (
    <div className="lp-submit-bar">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {error && (
          <div className="lp-alert error" style={{ margin: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}
        <p className="lp-submit-note">
          Edited listings are re-reviewed and published within <strong>24 hours</strong>.
        </p>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href={`/listings/${listingId}`} className="lp-btn ghost">
          Cancel
        </Link>
        <button type="submit" className="lp-btn" disabled={submitting}>
          {submitting ? (
            <><span className="spinner" /> Saving...</>
          ) : (
            <>
              Save Changes
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <div className="skeleton-card">
      {[100, 60, 80, 40, 70, 50].map((w, i) => (
        <div key={i} className="skeleton-line" style={{ height: i === 0 ? 40 : 20, width: `${w}%` }} />
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {[1,2,3,4].map((i) => (
          <div key={i} className="skeleton-line" style={{ height: 46 }} />
        ))}
      </div>
      <div className="skeleton-line" style={{ height: 110 }} />
    </div>
  );
}

// ─── Hotel Edit Form ───────────────────────────────────────────────────────────
function HotelEditForm({ listing, onSubmit, submitting, error }) {
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

  // images: each slot is { file?: File, preview: string, isExisting: bool } | null
  const initImages = () => {
    const slots = [null, null, null, null];
    (listing.images || []).slice(0, 4).forEach((url, i) => {
      slots[i] = { file: null, preview: url, isExisting: true };
    });
    return slots;
  };
  const [images, setImages] = useState(initImages);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAddImage = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => { const n = [...prev]; n[index] = { file, preview: url, isExisting: false }; return n; });
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => { const n = [...prev]; n[index] = null; return n; });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type: "hotel", form, images: images.filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Hotel Information</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Hotel Name <span className="req">*</span></label>
            <input className="lp-input" placeholder="e.g. Eko Atlantic Grand Hotel" value={form.hotelName} onChange={(e) => set("hotelName", e.target.value)} required />
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
            <input className="lp-input" type="number" min="1" placeholder="e.g. 120" value={form.totalRooms} onChange={(e) => set("totalRooms", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Price Per Night (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" placeholder="45,000" value={form.pricePerNight} onChange={(e) => set("pricePerNight", e.target.value)} required />
            </div>
          </div>
          <div className="lp-field span-2">
            <label>Description <span className="req">*</span></label>
            <textarea className="lp-textarea" placeholder="Describe your hotel..." value={form.description} onChange={(e) => set("description", e.target.value)} required />
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
        <div className="lp-section-title"><span>3</span> Amenities & Facilities</div>
        <AmenityGrid list={AMENITIES_HOTEL} selected={form.amenities} onChange={(v) => set("amenities", v)} />
      </div>

      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos (up to 4)</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} isExisting={img?.isExisting}
              onAdd={handleAddImage} onRemove={handleRemoveImage} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Slots marked <strong style={{color:"#63B3ED"}}>Saved</strong> keep the current image. Replace by clicking the slot.
        </p>
      </div>

      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact & Booking Details</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Visitors will use these details to contact you directly.
        </div>
        <div className="lp-grid">
          <div className="lp-field">
            <label>Contact Name <span className="req">*</span></label>
            <input className="lp-input" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Phone Number <span className="req">*</span></label>
            <input className="lp-input" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Email Address</label>
            <input className="lp-input" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div className="lp-field">
            <label>Hotel Website / Booking Link</label>
            <input className="lp-input" type="text" placeholder="https://yourhotel.com" value={form.website}
              onChange={(e) => set("website", e.target.value)}
              onBlur={(e) => { const v = e.target.value.trim(); if (v && !/^https?:\/\//i.test(v)) set("website", "https://" + v); }} />
            {form.website && (
              <a href={normalizeWebsite(form.website)} target="_blank" rel="noopener noreferrer" className="lp-link-preview">
                🔗 Visit: {normalizeWebsite(form.website)}
              </a>
            )}
          </div>
        </div>
      </div>

      <SubmitBar submitting={submitting} error={error} listingId={listing._id} />
    </form>
  );
}

// ─── Shortlet Edit Form ────────────────────────────────────────────────────────
function ShortletEditForm({ listing, onSubmit, submitting, error }) {
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
  const initImages = () => {
    const slots = [null, null, null, null];
    (listing.images || []).slice(0, 4).forEach((url, i) => { slots[i] = { file: null, preview: url, isExisting: true }; });
    return slots;
  };
  const [images, setImages] = useState(initImages);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setCount = (k, v) => setCounts((c) => ({ ...c, [k]: v }));

  const handleAddImage = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => { const n = [...prev]; n[index] = { file, preview: url, isExisting: false }; return n; });
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => { const n = [...prev]; n[index] = null; return n; });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type: "shortlet", form: { ...form, ...counts }, images: images.filter(Boolean) });
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
          <div className="lp-field">
            <label>Bedrooms <span className="req">*</span></label>
            <Counter value={counts.bedrooms} onChange={(v) => setCount("bedrooms", v)} min={1} />
          </div>
          <div className="lp-field">
            <label>Bathrooms <span className="req">*</span></label>
            <Counter value={counts.bathrooms} onChange={(v) => setCount("bathrooms", v)} min={1} />
          </div>
          <div className="lp-field">
            <label>Toilets <span className="req">*</span></label>
            <Counter value={counts.toilets} onChange={(v) => setCount("toilets", v)} min={1} />
          </div>
          <div className="lp-field">
            <label>Minimum Night(s) Stay</label>
            <select className="lp-select" value={form.minNights} onChange={(e) => set("minNights", e.target.value)}>
              {["1","2","3","5","7","14","30"].map((n) => <option key={n} value={n}>{n} night{n !== "1" ? "s" : ""}</option>)}
            </select>
          </div>
          <div className="lp-field">
            <label>Price Per Night (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" value={form.pricePerNight} onChange={(e) => set("pricePerNight", e.target.value)} required />
            </div>
          </div>
          <div className="lp-field">
            <label>Price Per Week (₦)</label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" placeholder="Optional" value={form.pricePerWeek} onChange={(e) => set("pricePerWeek", e.target.value)} />
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
        <div className="lp-section-title"><span>3</span> Amenities & Features</div>
        <AmenityGrid list={AMENITIES_SHORTLET} selected={form.amenities} onChange={(v) => set("amenities", v)} />
      </div>

      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos (up to 4)</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} isExisting={img?.isExisting}
              onAdd={handleAddImage} onRemove={handleRemoveImage} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Slots marked <strong style={{color:"#63B3ED"}}>Saved</strong> keep the current image.
        </p>
      </div>

      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact Details</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Visitors will contact you directly.
        </div>
        <div className="lp-grid">
          <div className="lp-field">
            <label>Your Name <span className="req">*</span></label>
            <input className="lp-input" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Phone / WhatsApp <span className="req">*</span></label>
            <input className="lp-input" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Email Address</label>
            <input className="lp-input" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div className="lp-field">
            <label>Listing Link (optional)</label>
            <input className="lp-input" type="text" value={form.website}
              onChange={(e) => set("website", e.target.value)}
              onBlur={(e) => { const v = e.target.value.trim(); if (v && !/^https?:\/\//i.test(v)) set("website", "https://" + v); }} />
            {form.website && (
              <a href={normalizeWebsite(form.website)} target="_blank" rel="noopener noreferrer" className="lp-link-preview">
                🔗 Visit: {normalizeWebsite(form.website)}
              </a>
            )}
          </div>
        </div>
      </div>

      <SubmitBar submitting={submitting} error={error} listingId={listing._id} />
    </form>
  );
}

// ─── Sale Edit Form ────────────────────────────────────────────────────────────
function SaleEditForm({ listing, onSubmit, submitting, error }) {
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
  const [counts, setCounts] = useState({
    bedrooms: listing.bedrooms || 0,
    bathrooms: listing.bathrooms || 0,
    toilets: listing.toilets || 0,
  });
  const initImages = () => {
    const slots = [null, null, null, null];
    (listing.images || []).slice(0, 4).forEach((url, i) => { slots[i] = { file: null, preview: url, isExisting: true }; });
    return slots;
  };
  const [images, setImages] = useState(initImages);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setCount = (k, v) => setCounts((c) => ({ ...c, [k]: v }));

  const handleAddImage = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => { const n = [...prev]; n[index] = { file, preview: url, isExisting: false }; return n; });
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => { const n = [...prev]; n[index] = null; return n; });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type: "sale", form: { ...form, ...counts }, images: images.filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Property Details</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Listing Title <span className="req">*</span></label>
            <input className="lp-input" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Property Type <span className="req">*</span></label>
            <select className="lp-select" value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)} required>
              <option value="">Select type</option>
              {["Detached House","Semi-Detached House","Terraced House","Bungalow","Duplex","Penthouse","Maisonette","Flat / Apartment","Land","Commercial Property","Warehouse"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="lp-field">
            <label>Sale Price (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required />
            </div>
          </div>
          <div className="lp-field">
            <label>Bedrooms</label>
            <Counter value={counts.bedrooms} onChange={(v) => setCount("bedrooms", v)} min={0} />
          </div>
          <div className="lp-field">
            <label>Bathrooms</label>
            <Counter value={counts.bathrooms} onChange={(v) => setCount("bathrooms", v)} min={0} />
          </div>
          <div className="lp-field">
            <label>Toilets</label>
            <Counter value={counts.toilets} onChange={(v) => setCount("toilets", v)} min={0} />
          </div>
          <div className="lp-field">
            <label>Land / Floor Size</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input className="lp-input" type="number" placeholder="500" value={form.landSize} onChange={(e) => set("landSize", e.target.value)} style={{ flex: 1 }} />
              <select className="lp-select" value={form.landUnit} onChange={(e) => set("landUnit", e.target.value)} style={{ width: "90px" }}>
                <option value="sqm">sqm</option><option value="sqft">sqft</option>
                <option value="plots">plots</option><option value="acres">acres</option>
              </select>
            </div>
          </div>
          <div className="lp-field" style={{ justifyContent: "flex-end" }}>
            <label style={{ marginBottom: "0.5rem" }}>Pricing</label>
            <label className="amenity-item" style={{ cursor: "pointer", maxWidth: "200px" }}>
              <input type="checkbox" style={{ display: "none" }} checked={form.negotiable} onChange={(e) => set("negotiable", e.target.checked)} />
              <span className="amenity-tick" style={form.negotiable ? { background: "#C9A84C", borderColor: "#C9A84C" } : {}}>
                {form.negotiable && <svg viewBox="0 0 12 10" fill="none" stroke="#0A0E1A" strokeWidth="2" width="10" height="8"><polyline points="1 5 4.5 8.5 11 1"/></svg>}
              </span>
              Price is negotiable
            </label>
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
        <div className="lp-section-title"><span>3</span> Features & Amenities</div>
        <AmenityGrid list={AMENITIES_SALE} selected={form.amenities} onChange={(v) => set("amenities", v)} />
      </div>

      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos (up to 4)</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} isExisting={img?.isExisting}
              onAdd={handleAddImage} onRemove={handleRemoveImage} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Slots marked <strong style={{color:"#63B3ED"}}>Saved</strong> keep the current image.
        </p>
      </div>

      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Agent / Owner Contact</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Buyers will contact you directly.
        </div>
        <div className="lp-grid">
          <div className="lp-field">
            <label>Contact Name <span className="req">*</span></label>
            <input className="lp-input" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Phone / WhatsApp <span className="req">*</span></label>
            <input className="lp-input" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Email Address</label>
            <input className="lp-input" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div className="lp-field">
            <label>Agency / Company Name</label>
            <input className="lp-input" placeholder="(if applicable)" value={form.agencyName} onChange={(e) => set("agencyName", e.target.value)} />
          </div>
        </div>
      </div>

      <SubmitBar submitting={submitting} error={error} listingId={listing._id} />
    </form>
  );
}

// ─── Rent Edit Form ────────────────────────────────────────────────────────────
function RentEditForm({ listing, onSubmit, submitting, error }) {
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
  const [counts, setCounts] = useState({
    bedrooms: listing.bedrooms || 2,
    bathrooms: listing.bathrooms || 2,
    toilets: listing.toilets || 2,
  });
  const initImages = () => {
    const slots = [null, null, null, null];
    (listing.images || []).slice(0, 4).forEach((url, i) => { slots[i] = { file: null, preview: url, isExisting: true }; });
    return slots;
  };
  const [images, setImages] = useState(initImages);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setCount = (k, v) => setCounts((c) => ({ ...c, [k]: v }));

  const handleAddImage = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => { const n = [...prev]; n[index] = { file, preview: url, isExisting: false }; return n; });
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => { const n = [...prev]; n[index] = null; return n; });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type: "rent", form: { ...form, ...counts }, images: images.filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Rental Details</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Listing Title <span className="req">*</span></label>
            <input className="lp-input" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Property Type <span className="req">*</span></label>
            <select className="lp-select" value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)} required>
              <option value="">Select type</option>
              {["Flat / Apartment","Duplex","Bungalow","Mini Flat","Self Contain","Commercial"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="lp-field">
            <label>Price Per Year (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" value={form.pricePerYear} onChange={(e) => set("pricePerYear", e.target.value)} required />
            </div>
          </div>
          <div className="lp-field">
            <label>Price Per Month (₦)</label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" placeholder="Optional" value={form.pricePerMonth} onChange={(e) => set("pricePerMonth", e.target.value)} />
            </div>
          </div>
          <div className="lp-field">
            <label>Bedrooms</label>
            <Counter value={counts.bedrooms} onChange={(v) => setCount("bedrooms", v)} />
          </div>
          <div className="lp-field">
            <label>Bathrooms</label>
            <Counter value={counts.bathrooms} onChange={(v) => setCount("bathrooms", v)} />
          </div>
          <div className="lp-field">
            <label>Toilets</label>
            <Counter value={counts.toilets} onChange={(v) => setCount("toilets", v)} />
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
        <div className="lp-section-title"><span>3</span> Features</div>
        <AmenityGrid list={AMENITIES_RENT} selected={form.amenities} onChange={(v) => set("amenities", v)} />
      </div>

      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} isExisting={img?.isExisting}
              onAdd={handleAddImage} onRemove={handleRemoveImage} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Slots marked <strong style={{color:"#63B3ED"}}>Saved</strong> keep the current image.
        </p>
      </div>

      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact</div>
        <div className="lp-grid">
          <div className="lp-field">
            <label>Name <span className="req">*</span></label>
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
            <label>Agency</label>
            <input className="lp-input" value={form.agencyName} onChange={(e) => set("agencyName", e.target.value)} />
          </div>
        </div>
      </div>

      <SubmitBar submitting={submitting} error={error} listingId={listing._id} />
    </form>
  );
}

// ─── Type label map ─────────────────────────────────────────────────────────────
const TYPE_LABELS = {
  hotel: "Hotel",
  shortlet: "Shortlet",
  sale: "Property for Sale",
  rent: "Property for Rent",
};

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [listing, setListing]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);

  // ── Fetch the listing ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load listing.");
        setListing(data.listing);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── Upload new images, keep existing URLs as-is ─────────────────────────────
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
      // For existing images, keep the URL; for new files, upload to Cloudinary
      const imageUrls = await Promise.all(
        images.map((img) =>
          img.isExisting ? Promise.resolve(img.preview) : uploadToCloudinary(img.file)
        )
      );

      const res = await fetch(`/api/listings/${id}`, {
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
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{SHARED_CSS}</style>
      <div className="lp-page">
        <Navbar />

        {/* Hero */}
        <div className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-eyebrow blue">Edit Listing</div>
            <h1>Update Your <em>Listing</em></h1>
            <p>
              Make changes to your property details below. Edits are reviewed by our team
              and go live within 24 hours.
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="lp-breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/listings">Listings</Link>
          <span>›</span>
          {listing ? (
            <>
              <Link href={`/listings/${id}`}>{listing.title}</Link>
              <span>›</span>
            </>
          ) : null}
          <span style={{ color: "rgba(255,255,255,0.55)" }}>Edit</span>
        </div>

        {/* Pending re-review notice */}
        {listing && (
          <div className="pending-notice">
            <div className="pending-notice-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>
                Saving changes will set this listing back to <strong style={{color:"#FBBF24"}}>pending review</strong>.
                It will remain visible in its current state until our team approves the update.
              </span>
            </div>
          </div>
        )}

        {/* Form area */}
        <div className="lp-main">
          {loading ? (
            <SkeletonLoader />
          ) : fetchError ? (
            <div className="lp-card">
              <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
                <div className="lp-alert error" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {fetchError}
                </div>
                <Link href="/listings" className="lp-btn ghost" style={{ textDecoration: "none" }}>← Back to Listings</Link>
              </div>
            </div>
          ) : success ? (
            <div className="lp-card">
              <div className="lp-success">
                <div className="lp-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="36" height="36">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2>Changes Saved!</h2>
                <p>
                  Your <strong>{TYPE_LABELS[listing?.type]}</strong> listing has been updated and submitted for review.
                  It will go live within <strong style={{ color: "rgba(255,255,255,0.7)" }}>24 hours</strong>.
                </p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <Link href={`/listings/${id}`} className="lp-btn" style={{ textDecoration: "none" }}>
                    View Listing
                  </Link>
                  <Link href="/listings" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    fontSize: "0.9rem", padding: "13px 28px", borderRadius: "10px", textDecoration: "none",
                  }}>Browse Listings</Link>
                </div>
              </div>
            </div>
          ) : listing ? (
            <div className="lp-card">
              {/* Type badge header */}
              <div style={{
                padding: "1.25rem 2rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>Editing:</span>
                  <span style={{ fontWeight: 600, color: "#fff", fontSize: "0.95rem" }}>{listing.title}</span>
                </div>
                <span className="type-badge">{TYPE_LABELS[listing.type] || listing.type}</span>
              </div>

              {listing.type === "hotel"    && <HotelEditForm    listing={listing} onSubmit={handleSubmit} submitting={submitting} error={error} />}
              {listing.type === "shortlet" && <ShortletEditForm listing={listing} onSubmit={handleSubmit} submitting={submitting} error={error} />}
              {listing.type === "sale"     && <SaleEditForm     listing={listing} onSubmit={handleSubmit} submitting={submitting} error={error} />}
              {listing.type === "rent"     && <RentEditForm     listing={listing} onSubmit={handleSubmit} submitting={submitting} error={error} />}
            </div>
          ) : null}
        </div>

        <Footer />
      </div>
    </>
  );
}
