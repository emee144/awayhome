"use client";
import { useState, useRef } from "react";
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
  "Airport Shuttle","Laundry","Business Centre", "Generator", "CCTV",
  "Solar Power", "Smart Home",
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
const MAX_IMAGES = 4;

// ─── Shared input styles injected once ───────────────────────────────────────
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .lp-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero banner ── */
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
  .lp-eyebrow::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: #C9A84C; animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
  .lp-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #fff; line-height: 1.15;
    margin-bottom: 1rem;
  }
  .lp-hero h1 em { font-style: italic; color: #C9A84C; }
  .lp-hero p { font-size: 0.95rem; color: rgba(255,255,255,0.5); line-height: 1.7; }

  /* ── Type selector tabs ── */
  .lp-type-wrap {
    max-width: 860px; margin: 0 auto; padding: 3rem 2rem 0;
  }
  .lp-type-label {
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 1rem;
    text-align: center;
  }
  .lp-type-tabs {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
  }
  .lp-type-tab {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 1.5rem 1rem;
    background: #111827; border: 1.5px solid rgba(255,255,255,0.07);
    border-radius: 16px; cursor: pointer; transition: all 0.25s;
    font-family: 'DM Sans', sans-serif;
  }
  .lp-type-tab:hover { border-color: rgba(201,168,76,0.3); background: rgba(201,168,76,0.05); }
  .lp-type-tab.active { border-color: #C9A84C; background: rgba(201,168,76,0.08); }
  .lp-type-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4);
    transition: all 0.25s;
  }
  .lp-type-tab.active .lp-type-icon,
  .lp-type-tab:hover .lp-type-icon { background: rgba(201,168,76,0.15); color: #C9A84C; }
  .lp-type-name { font-size: 0.95rem; font-weight: 600; color: rgba(255,255,255,0.6); transition: color 0.2s; }
  .lp-type-tab.active .lp-type-name,
  .lp-type-tab:hover .lp-type-name { color: #fff; }
  .lp-type-sub { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

  /* ── Main form card ── */
  .lp-main { max-width: 860px; margin: 0 auto; padding: 2rem 2rem 5rem; width: 100%; }

  .lp-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; overflow: hidden;
  }

  /* section headers inside the card */
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

  /* ── Form grid ── */
  .lp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
  .lp-grid.cols-4 { grid-template-columns: repeat(4, 1fr); }
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
  .lp-input:disabled, .lp-select:disabled { opacity: 0.5; cursor: not-allowed; }

  /* with prefix (₦) */
  .lp-prefix-wrap { position: relative; }
  .lp-prefix {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: #C9A84C; font-weight: 600; font-size: 0.9rem; pointer-events: none;
  }
  .lp-prefix-wrap .lp-input { padding-left: 32px; }

  /* ── Counter (beds/baths) ── */
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #C9A84C;
  text-decoration: none;
  word-break: break-all;
  transition: opacity 0.2s;
}

.lp-link-preview:hover {
  opacity: 0.8;
  text-decoration: underline;
}
  /* ── Amenities checkboxes ── */
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
  .amenity-item.checked .amenity-tick {
    background: #C9A84C; border-color: #C9A84C;
  }

  /* ── Image upload zone ── */
  .img-upload-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
  .img-slot {
    aspect-ratio: 1; border-radius: 12px; overflow: hidden;
    border: 1.5px dashed rgba(255,255,255,0.15);
    position: relative; cursor: pointer; transition: border-color 0.2s;
    background: rgba(255,255,255,0.03);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px;
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

  /* ── Contact section ── */
  .lp-contact-note {
    font-size: 0.8rem; color: rgba(255,255,255,0.35); line-height: 1.6;
    background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.12);
    border-radius: 10px; padding: 12px 14px; margin-bottom: 1.25rem;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .lp-contact-note svg { flex-shrink: 0; color: #C9A84C; margin-top: 1px; }

  /* ── Alerts ── */
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

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(10,14,26,0.3); border-top-color: #0A0E1A;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Success state ── */
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
  .lp-success p { font-size: 0.9rem; color: rgba(255,255,255,0.45); max-width: 400px; line-height: 1.7; }
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

  @media (max-width: 680px) {
    .lp-type-tabs { grid-template-columns: 1fr; }
    .lp-grid { grid-template-columns: 1fr; }
    .lp-grid.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
    .lp-field.span-2, .lp-field.span-3 { grid-column: span 1; }
    .img-upload-grid { grid-template-columns: repeat(2, 1fr); }
    .lp-submit-bar { flex-direction: column; align-items: stretch; }
    .lp-btn { justify-content: center; }
  }
`;

// ─── Counter component ────────────────────────────────
function Counter({ value, onChange, min = 0, max = 20 }) {
  return (
    <div className="lp-counter">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

// ─── Image upload slot ────────────────────────────────────────────────────────
function ImageSlot({ index, preview, onAdd, onRemove }) {
  const inputRef = useRef();
  if (preview) {
    return (
      <div className="img-slot filled">
        <img src={preview} alt={`Upload ${index + 1}`} />
        {index === 0 && <span className="img-primary-badge">Cover</span>}
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

// ─── Amenity toggle ───────────────────────────────────────────────────────────
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

// ─── HOTEL FORM ───────────────────────────────────────────────────────────────
function HotelForm({ onSubmit, submitting, error }) {
  const [form, setForm] = useState({
    hotelName: "", starRating: "", address: "", state: "", city: "", zipCode: "",
    totalRooms: "", pricePerNight: "", description: "",
    contactName: "", contactPhone: "", contactEmail: "", website: "",
    amenities: [],
  });
  const [images, setImages] = useState([null, null, null, null]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAddImage = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => { const n = [...prev]; n[index] = { file, preview: url }; return n; });
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
      {/* Basic Info */}
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
            <textarea className="lp-textarea" placeholder="Describe your hotel — rooms, atmosphere, nearby landmarks..." value={form.description} onChange={(e) => set("description", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="lp-section">
        <div className="lp-section-title"><span>2</span> Location</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Street Address <span className="req">*</span></label>
            <input className="lp-input" placeholder="e.g. 15 Adeola Odeku Street" value={form.address} onChange={(e) => set("address", e.target.value)} required />
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
            <input className="lp-input" placeholder="e.g. Victoria Island" value={form.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="lp-section">
        <div className="lp-section-title"><span>3</span> Amenities & Facilities</div>
        <AmenityGrid list={AMENITIES_HOTEL} selected={form.amenities} onChange={(v) => set("amenities", v)} />
      </div>

      {/* Photos */}
      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos (up to 4)</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot key={i} index={i} preview={img?.preview}
              onAdd={handleAddImage} onRemove={handleRemoveImage} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          First photo will be used as the cover image. JPG, PNG or WEBP. Max 5MB each.
        </p>
      </div>

      {/* Contact */}
      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact & Booking Details</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Visitors will use these details to contact you directly. We don't handle bookings.
        </div>
        <div className="lp-grid">
          <div className="lp-field">
            <label>Contact Name <span className="req">*</span></label>
            <input className="lp-input" placeholder="Manager / Front Desk name" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Phone Number <span className="req">*</span></label>
            <input className="lp-input" type="tel" placeholder="+234 800 000 0000" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Email Address</label>
            <input className="lp-input" type="email" placeholder="reservations@hotel.com" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div className="lp-field">
            <label>Hotel Website / Booking Link</label>
            <input
  className="lp-input"
  type="text"
  placeholder="https://yourhotel.com"
  value={form.website}
  onChange={(e) => set("website", e.target.value)}
  onBlur={(e) => {
    const val = e.target.value.trim();
    if (val && !/^https?:\/\//i.test(val)) {
      set("website", "https://" + val);
    }
  }}
/>
{form.website && (
    <a
      href={normalizeWebsite(form.website)}
      target="_blank"
      rel="noopener noreferrer"
      className="lp-link-preview"
    >
      🔗 Visit: {normalizeWebsite(form.website)}
    </a>
  )}
          </div>
        </div>
      </div>

      <SubmitBar submitting={submitting} error={error} />
    </form>
  );
}

// ─── SHORTLET FORM ────────────────────────────────────────────────────────────
function ShortletForm({ onSubmit, submitting, error }) {
  const [form, setForm] = useState({
    title: "", address: "", state: "", city: "",
    pricePerNight: "", pricePerWeek: "", minNights: "1",
    description: "", contactName: "", contactPhone: "", contactEmail: "", website: "",
    amenities: [],
  });
  const [counts, setCounts] = useState({ bedrooms: 1, bathrooms: 1, toilets: 1 });
  const [images, setImages] = useState([null, null, null, null]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setCount = (k, v) => setCounts((c) => ({ ...c, [k]: v }));

  const handleAddImage = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => { const n = [...prev]; n[index] = { file, preview: url }; return n; });
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
      {/* Basic Info */}
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Shortlet Details</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Listing Title <span className="req">*</span></label>
            <input className="lp-input" placeholder="e.g. Cozy 2-Bedroom Shortlet in Lekki Phase 1" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          {/* Counts */}
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

          {/* Pricing */}
          <div className="lp-field">
            <label>Price Per Night (₦) <span className="req">*</span></label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" placeholder="28,000" value={form.pricePerNight} onChange={(e) => set("pricePerNight", e.target.value)} required />
            </div>
          </div>
          <div className="lp-field">
            <label>Price Per Week (₦)</label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input" type="number" placeholder="150,000 (optional)" value={form.pricePerWeek} onChange={(e) => set("pricePerWeek", e.target.value)} />
            </div>
          </div>

          <div className="lp-field span-2">
            <label>Description <span className="req">*</span></label>
            <textarea className="lp-textarea" placeholder="Describe the space — furnishings, views, neighbourhood, access..." value={form.description} onChange={(e) => set("description", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="lp-section">
        <div className="lp-section-title"><span>2</span> Location</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Street Address <span className="req">*</span></label>
            <input className="lp-input" placeholder="e.g. Plot 12 Freedom Way, Lekki Phase 1" value={form.address} onChange={(e) => set("address", e.target.value)} required />
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
            <input className="lp-input" placeholder="e.g. Lekki Phase 1" value={form.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="lp-section">
        <div className="lp-section-title"><span>3</span> Amenities & Features</div>
        <AmenityGrid list={AMENITIES_SHORTLET} selected={form.amenities} onChange={(v) => set("amenities", v)} />
      </div>

      {/* Photos */}
      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos (up to 4)</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} onAdd={handleAddImage} onRemove={handleRemoveImage} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          First photo will be used as the cover image. JPG, PNG or WEBP. Max 5MB each.
        </p>
      </div>

      {/* Contact */}
      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact Details</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Visitors will contact you directly. We do not process bookings or payments.
        </div>
        <div className="lp-grid">
          <div className="lp-field">
            <label>Your Name <span className="req">*</span></label>
            <input className="lp-input" placeholder="Full name" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Phone / WhatsApp <span className="req">*</span></label>
            <input className="lp-input" type="tel" placeholder="+234 800 000 0000" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Email Address</label>
            <input className="lp-input" type="email" placeholder="you@example.com" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div className="lp-field">
            <label>Listing Link (optional)</label>
            <input
  className="lp-input"
  type="text"
  placeholder="https://yourhotel.com"
  value={form.website}
  onChange={(e) => set("website", e.target.value)}
  onBlur={(e) => {
    const val = e.target.value.trim();
    if (val && !/^https?:\/\//i.test(val)) {
      set("website", "https://" + val);
    }
  }}
/>
{form.website && (
    <a
      href={normalizeWebsite(form.website)}
      target="_blank"
      rel="noopener noreferrer"
      className="lp-link-preview"
    >
      🔗 Visit: {normalizeWebsite(form.website)}
    </a>
  )}
          </div>
        </div>
      </div>

      <SubmitBar submitting={submitting} error={error} />
    </form>
  );
}

// ─── SALE FORM ────────────────────────────────────────────────────────────────
function SaleForm({ onSubmit, submitting, error }) {
  const [form, setForm] = useState({
    title: "", propertyType: "", address: "", state: "", city: "", landSize: "", landUnit: "sqm",
    price: "", negotiable: false, description: "",
    contactName: "", contactPhone: "", contactEmail: "", agencyName: "",
    amenities: [],
  });
  const [counts, setCounts] = useState({ bedrooms: 3, bathrooms: 2, toilets: 3 });
  const [images, setImages] = useState([null, null, null, null]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setCount = (k, v) => setCounts((c) => ({ ...c, [k]: v }));

  const handleAddImage = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => { const n = [...prev]; n[index] = { file, preview: url }; return n; });
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
      {/* Property Details */}
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Property Details</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Listing Title <span className="req">*</span></label>
            <input className="lp-input" placeholder="e.g. 5-Bedroom Duplex for Sale in Banana Island" value={form.title} onChange={(e) => set("title", e.target.value)} required />
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
              <input className="lp-input" type="number" placeholder="850,000,000" value={form.price} onChange={(e) => set("price", e.target.value)} required />
            </div>
          </div>

          {/* Room counts */}
          <div className="lp-field">
            <label>Bedrooms <span className="req">*</span></label>
            <Counter value={counts.bedrooms} onChange={(v) => setCount("bedrooms", v)} min={0} />
          </div>
          <div className="lp-field">
            <label>Bathrooms <span className="req">*</span></label>
            <Counter value={counts.bathrooms} onChange={(v) => setCount("bathrooms", v)} min={0} />
          </div>
          <div className="lp-field">
            <label>Toilets</label>
            <Counter value={counts.toilets} onChange={(v) => setCount("toilets", v)} min={0} />
          </div>

          {/* Land size */}
          <div className="lp-field">
            <label>Land / Floor Size</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input className="lp-input" type="number" placeholder="500" value={form.landSize} onChange={(e) => set("landSize", e.target.value)} style={{ flex: 1 }} />
              <select className="lp-select" value={form.landUnit} onChange={(e) => set("landUnit", e.target.value)} style={{ width: "90px" }}>
                <option value="sqm">sqm</option>
                <option value="sqft">sqft</option>
                <option value="plots">plots</option>
                <option value="acres">acres</option>
              </select>
            </div>
          </div>

          {/* Negotiable */}
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
            <textarea className="lp-textarea" placeholder="Describe the property — features, condition, title type (C of O, R of O), nearby landmarks..." value={form.description} onChange={(e) => set("description", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="lp-section">
        <div className="lp-section-title"><span>2</span> Location</div>
        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Street Address <span className="req">*</span></label>
            <input className="lp-input" placeholder="e.g. 4 Ocean Boulevard, Banana Island" value={form.address} onChange={(e) => set("address", e.target.value)} required />
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
            <input className="lp-input" placeholder="e.g. Banana Island" value={form.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="lp-section">
        <div className="lp-section-title"><span>3</span> Features & Amenities</div>
        <AmenityGrid list={AMENITIES_SALE} selected={form.amenities} onChange={(v) => set("amenities", v)} />
      </div>

      {/* Photos */}
      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos (up to 4)</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot key={i} index={i} preview={img?.preview} onAdd={handleAddImage} onRemove={handleRemoveImage} />
          ))}
        </div>
        <p className="img-upload-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          First photo will be used as the cover image. JPG, PNG or WEBP. Max 5MB each.
        </p>
      </div>

      {/* Contact */}
      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Agent / Owner Contact</div>
        <div className="lp-contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Buyers will contact you directly. All viewings and negotiations happen off-platform.
        </div>
        <div className="lp-grid">
          <div className="lp-field">
            <label>Contact Name <span className="req">*</span></label>
            <input className="lp-input" placeholder="Your full name" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Phone / WhatsApp <span className="req">*</span></label>
            <input className="lp-input" type="tel" placeholder="+234 800 000 0000" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
          </div>
          <div className="lp-field">
            <label>Email Address</label>
            <input className="lp-input" type="email" placeholder="you@example.com" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div className="lp-field">
            <label>Agency / Company Name</label>
            <input className="lp-input" placeholder="(if applicable)" value={form.agencyName} onChange={(e) => set("agencyName", e.target.value)} />
          </div>
        </div>
      </div>

      <SubmitBar submitting={submitting} error={error} />
    </form>
  );
}
function RentForm({ onSubmit, submitting, error }) {
  const [form, setForm] = useState({
    title: "",
    propertyType: "",
    address: "",
    state: "",
    city: "",
    pricePerYear: "",
    pricePerMonth: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    agencyName: "",
    amenities: [],
  });

  const [counts, setCounts] = useState({
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
  });

  const [images, setImages] = useState([null, null, null, null]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setCount = (k, v) => setCounts((c) => ({ ...c, [k]: v }));

  const handleAddImage = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const n = [...prev];
      n[index] = { file, preview: url };
      return n;
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const n = [...prev];
      n[index] = null;
      return n;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type: "rent",
      form: { ...form, ...counts },
      images: images.filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Property Details */}
      <div className="lp-section">
        <div className="lp-section-title"><span>1</span> Rental Details</div>

        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Listing Title <span className="req">*</span></label>
            <input className="lp-input"
              placeholder="e.g. 3-Bedroom Apartment for Rent in Lekki"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div className="lp-field">
            <label>Property Type <span className="req">*</span></label>
            <select className="lp-select"
              value={form.propertyType}
              onChange={(e) => set("propertyType", e.target.value)}
              required
            >
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
              <input className="lp-input"
                type="number"
                placeholder="1,500,000"
                value={form.pricePerYear}
                onChange={(e) => set("pricePerYear", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="lp-field">
            <label>Price Per Month (₦)</label>
            <div className="lp-prefix-wrap">
              <span className="lp-prefix">₦</span>
              <input className="lp-input"
                type="number"
                placeholder="Optional"
                value={form.pricePerMonth}
                onChange={(e) => set("pricePerMonth", e.target.value)}
              />
            </div>
          </div>

          {/* Counters */}
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
            <textarea className="lp-textarea"
              placeholder="Describe the rental property..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="lp-section">
        <div className="lp-section-title"><span>2</span> Location</div>

        <div className="lp-grid">
          <div className="lp-field span-2">
            <label>Street Address <span className="req">*</span></label>
            <input className="lp-input"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              required
            />
          </div>

          <div className="lp-field">
            <label>State <span className="req">*</span></label>
            <select className="lp-select"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              required
            >
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="lp-field">
            <label>City / Area <span className="req">*</span></label>
            <input className="lp-input"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="lp-section">
        <div className="lp-section-title"><span>3</span> Features</div>
        <AmenityGrid
          list={AMENITIES_RENT}
          selected={form.amenities}
          onChange={(v) => set("amenities", v)}
        />
      </div>

      {/* Photos */}
      <div className="lp-section">
        <div className="lp-section-title"><span>4</span> Photos</div>
        <div className="img-upload-grid">
          {images.map((img, i) => (
            <ImageSlot
              key={i}
              index={i}
              preview={img?.preview}
              onAdd={handleAddImage}
              onRemove={handleRemoveImage}
            />
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="lp-section">
        <div className="lp-section-title"><span>5</span> Contact</div>

        <div className="lp-grid">
          <div className="lp-field">
            <label>Name</label>
            <input className="lp-input"
              value={form.contactName}
              onChange={(e) => set("contactName", e.target.value)}
              required
            />
          </div>

          <div className="lp-field">
            <label>Phone</label>
            <input className="lp-input"
              value={form.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              required
            />
          </div>

          <div className="lp-field">
            <label>Email</label>
            <input className="lp-input"
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </div>

          <div className="lp-field">
            <label>Agency</label>
            <input className="lp-input"
              value={form.agencyName}
              onChange={(e) => set("agencyName", e.target.value)}
            />
          </div>
        </div>
      </div>

      <SubmitBar submitting={submitting} error={error} />
    </form>
  );
}
// ─── Shared submit bar ────────────────────────────────────────────────────────
function SubmitBar({ submitting, error }) {
  return (
    <div className="lp-submit-bar">
      <p className="lp-submit-note">
        By submitting you agree to our <strong>Terms of Service</strong>.<br />
        Listings are reviewed and published within <strong>24 hours</strong>.
      </p>
      <button type="submit" className="lp-btn" disabled={submitting}>
        {submitting ? (
          <><span className="spinner" /> Publishing...</>
        ) : (
          <>
            Submit Listing
          </>
        )}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TYPES = [
  {
    id: "hotel", name: "Hotel", sub: "Hotels & guest houses",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26"><path d="M2 22h20M3 22V8l9-6 9 6v14M9 22V14h6v8"/></svg>,
  },
  {
    id: "shortlet", name: "Shortlet", sub: "Daily & weekly rentals",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    id: "sale", name: "Property for Sale", sub: "Houses, land & more",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
  id: "rent",
  name: "Property for Rent",
  sub: "Apartments & houses for rent",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <path d="M9 22V12h6v10"/>
    </svg>
  ),
}
];
function normalizeWebsite(url) {
  if (!url) return null;

  let clean = url.trim();

  if (!/^https?:\/\//i.test(clean)) {
    clean = "https://" + clean;
  }

  return clean;
}
export default function ListPropertyPage() {
  const [activeType, setActiveType] = useState("hotel");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState(false);

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
 
      const imageUrls = await Promise.all(images.map((img) => uploadToCloudinary(img.file)));

      // Send to API
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  type,
  ...form,
  website: normalizeWebsite(form.website), 
  images: imageUrls,
}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{SHARED_CSS}</style>

      <div className="lp-page">
        <Navbar />

        {/* Hero */}
        <div className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-eyebrow">Free Listing</div>
            <h1>List Your <em>Property</em> for Free</h1>
            <p>
              Reach thousands of renters, buyers, and travellers across Nigeria.
              No booking fees. No commissions. Just direct connections.
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="lp-breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>List a Property</span>
        </div>

        {/* Type selector */}
        <div className="lp-type-wrap">
          <p className="lp-type-label">What are you listing?</p>
          <div className="lp-type-tabs">
            {TYPES.map((t) => (
              <button key={t.id} type="button"
                className={`lp-type-tab ${activeType === t.id ? "active" : ""}`}
                onClick={() => { setActiveType(t.id); setError(""); setSuccess(false); }}>
                <div className="lp-type-icon">{t.icon}</div>
                <span className="lp-type-name">{t.name}</span>
                <span className="lp-type-sub">{t.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="lp-main">
          <div className="lp-card">
            {success ? (
              <div className="lp-success">
                <div className="lp-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="36" height="36">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2>Listing Submitted!</h2>
                <p>
                  Your <strong>{TYPES.find((t) => t.id === activeType)?.name}</strong> listing has been received.
                  Our team will review and publish it within <strong style={{ color: "rgba(255,255,255,0.7)" }}>24 hours</strong>.
                </p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <button className="lp-btn" onClick={() => setSuccess(false)}>Submit Another</button>
                  <Link href="/listings" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    fontSize: "0.9rem", padding: "13px 28px", borderRadius: "10px", textDecoration: "none",
                  }}>Browse Listings</Link>
                </div>
              </div>
            ) : (
              <>
                {activeType === "hotel"    && <HotelForm    onSubmit={handleSubmit} submitting={submitting} error={error} />}
                {activeType === "shortlet" && <ShortletForm onSubmit={handleSubmit} submitting={submitting} error={error} />}
                {activeType === "sale"     && <SaleForm     onSubmit={handleSubmit} submitting={submitting} error={error} />}
                {activeType === "rent"     && <RentForm     onSubmit={handleSubmit} submitting={submitting} error={error} />}
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}