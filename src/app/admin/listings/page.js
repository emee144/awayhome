"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Styles ───────────────────────────────────────────────────────────────────
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0E1A; color: #fff; }

  .ad-page { min-height: 100vh; display: flex; flex-direction: column; background: #0A0E1A; }

  /* ── Hero ── */
  .ad-hero {
    position: relative; padding: 7rem 2rem 3.5rem;
    background: #0D1220;
    border-bottom: 1px solid rgba(201,168,76,0.12);
    overflow: hidden;
  }
  .ad-hero::before {
    content: ''; position: absolute;
    width: 700px; height: 700px; border-radius: 50%;
    background: rgba(201,168,76,0.04); filter: blur(100px);
    top: -200px; right: -200px; pointer-events: none;
  }
  .ad-hero-inner { position: relative; max-width: 1200px; margin: 0 auto; }
  .ad-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.28);
    border-radius: 100px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem;
  }
  .ad-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; color: #fff; line-height: 1.15;
    margin-bottom: 0.5rem;
  }
  .ad-hero h1 em { font-style: italic; color: #C9A84C; }
  .ad-hero p { font-size: 0.9rem; color: rgba(255,255,255,0.4); }

  /* ── Stats row ── */
  .ad-stats {
    max-width: 1200px; margin: 0 auto; padding: 2rem 2rem 0;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem;
  }
  .ad-stat-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 1.25rem 1.5rem;
    display: flex; flex-direction: column; gap: 6px;
  }
  .ad-stat-card.gold   { border-color: rgba(201,168,76,0.25); background: rgba(201,168,76,0.06); }
  .ad-stat-card.green  { border-color: rgba(93,219,144,0.2);  background: rgba(93,219,144,0.05); }
  .ad-stat-card.blue   { border-color: rgba(96,165,250,0.2);  background: rgba(96,165,250,0.05); }
  .ad-stat-card.red    { border-color: rgba(240,100,80,0.2);  background: rgba(240,100,80,0.05); }
  .ad-stat-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.35); }
  .ad-stat-value { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: #fff; line-height: 1; }
  .ad-stat-card.gold  .ad-stat-value { color: #C9A84C; }
  .ad-stat-card.green .ad-stat-value { color: #5ddb90; }
  .ad-stat-card.blue  .ad-stat-value { color: #60A5FA; }
  .ad-stat-card.red   .ad-stat-value { color: #f46450; }

  /* ── Bar ── */
  .ad-bar {
    position: sticky; top: 0; z-index: 30;
    background: rgba(13,18,32,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 0.9rem 2rem;
  }
  .ad-bar-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
  }
  .ad-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }
  .ad-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
  .ad-search {
    width: 100%; padding: 10px 14px 10px 38px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    outline: none; transition: border-color 0.2s;
  }
  .ad-search::placeholder { color: rgba(255,255,255,0.25); }
  .ad-search:focus { border-color: rgba(201,168,76,0.5); }

  .ad-tabs { display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); }
  .ad-tab {
    padding: 7px 16px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
    color: rgba(255,255,255,0.45); background: none; transition: all 0.2s; white-space: nowrap;
    display: flex; align-items: center; gap: 6px;
  }
  .ad-tab:hover { color: rgba(255,255,255,0.75); }
  .ad-tab.active { background: rgba(201,168,76,0.15); color: #C9A84C; border: 1px solid rgba(201,168,76,0.3); }
  .ad-tab-dot {
    width: 7px; height: 7px; border-radius: 50%;
  }
  .ad-tab-dot.pending  { background: #C9A84C; }
  .ad-tab-dot.active   { background: #5ddb90; }
  .ad-tab-dot.rejected { background: #f46450; }
  .ad-tab-dot.all      { background: rgba(255,255,255,0.3); }

  .ad-type-select {
    padding: 9px 12px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.55); font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .ad-type-select option { background: #0F1525; color: #fff; }
  .ad-type-select:focus { border-color: rgba(201,168,76,0.4); }

  /* ── Breadcrumb ── */
  .ad-breadcrumb {
    max-width: 1200px; margin: 0 auto; padding: 1.25rem 2rem 0;
    display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.3);
  }
  .ad-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
  .ad-breadcrumb a:hover { color: #C9A84C; }

  /* ── Content ── */
  .ad-content { max-width: 1200px; margin: 0 auto; padding: 2rem 2rem 5rem; width: 100%; flex: 1; }
  .ad-count { font-size: 0.82rem; color: rgba(255,255,255,0.35); margin-bottom: 1.5rem; }
  .ad-count strong { color: rgba(255,255,255,0.65); }

  /* ── Grid ── */
  .ad-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }

  /* ── Card ── */
  .ad-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .ad-card:hover { border-color: rgba(201,168,76,0.2); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
  .ad-card.pending  { border-left: 3px solid rgba(201,168,76,0.5); }
  .ad-card.active   { border-left: 3px solid rgba(93,219,144,0.5); }
  .ad-card.rejected { border-left: 3px solid rgba(240,100,80,0.4); }

  .ad-card-img { position: relative; height: 140px; background: rgba(255,255,255,0.04); overflow: hidden; }
  .ad-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
  .ad-card:hover .ad-card-img img { transform: scale(1.04); }
  .ad-card-no-img {
    width: 100%; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 8px; color: rgba(255,255,255,0.15);
  }
  .ad-card-no-img span { font-size: 0.75rem; }

  .ad-type-badge {
    position: absolute; top: 10px; left: 10px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 6px; backdrop-filter: blur(8px);
  }
  .ad-type-badge.hotel    { background: rgba(96,165,250,0.9);   color: #fff; }
  .ad-type-badge.shortlet { background: rgba(52,211,153,0.9);   color: #fff; }
  .ad-type-badge.sale     { background: rgba(201,168,76,0.15);  border: 1px solid rgba(201,168,76,0.3); color: #C9A84C; }
  .ad-type-badge.rent     { background: rgba(59,130,246,0.15);  border: 1px solid rgba(59,130,246,0.3); color: #60A5FA; }

  .ad-status-badge {
    position: absolute; top: 10px; right: 10px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 6px; backdrop-filter: blur(8px);
  }
  .ad-status-badge.pending  { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.35); color: #C9A84C; }
  .ad-status-badge.active   { background: rgba(93,219,144,0.12); border: 1px solid rgba(93,219,144,0.3);  color: #5ddb90; }
  .ad-status-badge.rejected { background: rgba(240,100,80,0.1);  border: 1px solid rgba(240,100,80,0.3);  color: #f46450; }

  .ad-card-body { padding: 1rem 1.1rem 1.1rem; }
  .ad-card-title {
    font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 4px; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
  }
  .ad-card-loc { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: rgba(255,255,255,0.35); margin-bottom: 5px; }
  .ad-card-meta { font-size: 0.78rem; color: rgba(255,255,255,0.28); margin-bottom: 8px; }
  .ad-card-price { font-size: 1rem; font-weight: 700; color: #C9A84C; margin-bottom: 5px; }
  .ad-card-submitter { font-size: 0.75rem; color: rgba(255,255,255,0.25); margin-bottom: 10px; }
  .ad-card-submitter strong { color: rgba(255,255,255,0.45); }

  /* ── Action row ── */
  .ad-card-actions {
    display: flex; align-items: center; gap: 8px;
    padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);
  }
  .ad-btn {
    flex: 1; padding: 9px 12px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: all 0.2s; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .ad-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ad-btn.approve {
    background: rgba(93,219,144,0.12); border: 1px solid rgba(93,219,144,0.3);
    color: #5ddb90;
  }
  .ad-btn.approve:hover:not(:disabled) { background: rgba(93,219,144,0.22); }
  .ad-btn.reject {
    background: rgba(240,100,80,0.08); border: 1px solid rgba(240,100,80,0.25);
    color: #f46450;
  }
  .ad-btn.reject:hover:not(:disabled) { background: rgba(240,100,80,0.16); }
  .ad-btn.view {
    flex: 0; padding: 9px 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.45);
  }
  .ad-btn.view:hover { border-color: rgba(201,168,76,0.3); color: #C9A84C; }

  /* ── Spinner inside button ── */
  .ad-spin {
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.2); border-top-color: currentColor;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Skeleton ── */
  .ad-skeleton { background: #111827; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .ad-sk {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 600px 100%; animation: shimmer 1.4s infinite linear; border-radius: 6px;
  }
  .ad-sk-img  { height: 140px; border-radius: 0; }
  .ad-sk-body { padding: 1rem 1.1rem 1.1rem; display: flex; flex-direction: column; gap: 10px; }

  /* ── Empty / error ── */
  .ad-empty { text-align: center; padding: 6rem 2rem; color: rgba(255,255,255,0.2); grid-column: 1 / -1; }
  .ad-empty-icon { margin: 0 auto 1.25rem; opacity: 0.2; }
  .ad-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem; }
  .ad-empty p { font-size: 0.875rem; color: rgba(255,255,255,0.25); }

  .ad-error { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: #f46450; font-size: 0.9rem; }
  .ad-error button {
    margin-top: 0.75rem; background: none; border: none; cursor: pointer;
    color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; text-decoration: underline;
  }

  /* ── Pagination ── */
  .ad-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 3rem; }
  .ad-page-btn {
    width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5);
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .ad-page-btn:hover:not(:disabled) { border-color: rgba(201,168,76,0.4); color: #C9A84C; }
  .ad-page-btn.active { background: rgba(201,168,76,0.15); border-color: #C9A84C; color: #C9A84C; }
  .ad-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ad-page-ellipsis { color: rgba(255,255,255,0.2); font-size: 0.85rem; padding: 0 4px; }

  /* ── Toast ── */
  .ad-toast {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
    padding: 13px 20px; border-radius: 12px; font-size: 0.875rem; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    animation: slideUp 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .ad-toast.success { background: rgba(13,18,32,0.98); border: 1px solid rgba(93,219,144,0.3); color: #5ddb90; }
  .ad-toast.error   { background: rgba(13,18,32,0.98); border: 1px solid rgba(240,100,80,0.3);  color: #f46450; }

  @media (max-width: 640px) {
    .ad-tabs { display: none; }
    .ad-grid { grid-template-columns: 1fr; }
    .ad-stats { grid-template-columns: 1fr 1fr; }
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const LocationIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>;
const CheckIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>;
const XIcon        = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const EyeIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const HomeIllo     = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ChevL        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevR        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>;

const formatPrice = (n) => n ? "₦" + Number(n).toLocaleString("en-NG") : "—";

function getDisplayPrice(listing) {
  if (listing.type === "sale") return { price: listing.price, suffix: "" };
  if (listing.type === "rent") return { price: listing.pricePerYear || listing.pricePerMonth, suffix: listing.pricePerYear ? "/yr" : "/mo" };
  return { price: listing.pricePerNight, suffix: "/night" };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="ad-skeleton">
      <div className="ad-sk ad-sk-img" />
      <div className="ad-sk-body">
        <div className="ad-sk" style={{ height: 14, width: "35%" }} />
        <div className="ad-sk" style={{ height: 16, width: "75%" }} />
        <div className="ad-sk" style={{ height: 12, width: "50%" }} />
        <div className="ad-sk" style={{ height: 12, width: "60%" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <div className="ad-sk" style={{ height: 34, flex: 1 }} />
          <div className="ad-sk" style={{ height: 34, flex: 1 }} />
          <div className="ad-sk" style={{ height: 34, width: 36 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function AdminCard({ listing, onAction }) {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const { _id, type, title, images, location, status, createdBy, createdAt } = listing;
  const { price, suffix } = getDisplayPrice(listing);

  const act = async (action) => {
    const setLoading = action === "approve" ? setApproving : setRejecting;
    setLoading(true);
    await onAction(_id, action);
    setLoading(false);
  };

  const isActive   = status === "active";
  const isRejected = status === "rejected";

  return (
    <div className={`ad-card ${status}`}>
      <div className="ad-card-img">
        {images?.length > 0
          ? <img src={images[0]} alt={title} />
          : <div className="ad-card-no-img"><HomeIllo /><span>No photo</span></div>
        }
        <span className={`ad-type-badge ${type}`}>
          {type === "hotel" ? "Hotel" : type === "shortlet" ? "Shortlet" : type === "rent" ? "Rent" : "Sale"}
        </span>
        <span className={`ad-status-badge ${status}`}>{status}</span>
      </div>

      <div className="ad-card-body">
        <h3 className="ad-card-title">{title}</h3>
        <p className="ad-card-loc"><LocationIcon /> {location?.city}, {location?.state}</p>
        {listing.bedrooms ? (
          <p className="ad-card-meta">{listing.bedrooms} Bed · {listing.bathrooms} Bath</p>
        ) : listing.totalRooms ? (
          <p className="ad-card-meta">{listing.totalRooms} Rooms · ★ {listing.starRating}</p>
        ) : null}
        <p className="ad-card-price">{formatPrice(price)}{suffix && <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>{suffix}</span>}</p>
        <p className="ad-card-submitter">
          Submitted {new Date(createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          {createdBy?.name && <> · <strong>{createdBy.name}</strong></>}
        </p>

        <div className="ad-card-actions">
          <button
            className="ad-btn approve"
            disabled={approving || rejecting || isActive}
            onClick={() => act("approve")}
          >
            {approving ? <span className="ad-spin" /> : <CheckIcon />}
            Approve
          </button>
          <button
            className="ad-btn reject"
            disabled={approving || rejecting || isRejected}
            onClick={() => act("reject")}
          >
            {rejecting ? <span className="ad-spin" /> : <XIcon />}
            Reject
          </button>
          <Link href={`/listings/${_id}`} target="_blank" className="ad-btn view">
            <EyeIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function AdminContent() {
  const router = useRouter();

  const [listings,   setListings]   = useState([]);
  const [stats,      setStats]      = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [toast,      setToast]      = useState(null);

  const [filters, setFilters] = useState({
    status: "pending",
    type:   "",
    search: "",
    page:   1,
  });

  const showToast = (msg, kind = "success") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchListings = useCallback(async (f) => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams();
      Object.entries(f).forEach(([k, v]) => { if (v) qs.set(k, v); });
      const res  = await fetch(`/api/admin/listings?${qs.toString()}`);
      if (res.status === 401 || res.status === 403) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch.");
      setListings(data.listings);
      setPagination(data.pagination);
      if (data.stats) setStats(data.stats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchListings(filters); }, [filters]);

  const setFilter = (k, v) => setFilters(prev => ({ ...prev, [k]: v, page: 1 }));
  const goToPage  = (p)    => setFilters(prev => ({ ...prev, page: p }));

const handleAction = async (id, action) => {
  try {
    const res = await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
      credentials: "include",
    });

    if (res.status === 401) {
      window.location.href = "/admin"; 
      return;
    }

    if (res.status === 403) {
      showToast("Access denied", "error");
      return;
    }

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Action failed.");

    showToast(
      action === "approve"
        ? "Listing approved ✓"
        : "Listing rejected",
      action === "approve" ? "success" : "error"
    );

    setListings(prev => prev.filter(l => l._id !== id));

    fetchListings({ ...filters, page: filters.page });

  } catch (e) {
    showToast(e.message, "error");
  }
};

  const buildPages = (total, current) => {
    const pages = Array.from({ length: total }, (_, i) => i + 1)
      .filter(p => p === 1 || p === total || Math.abs(p - current) <= 1);
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
      <div className="ad-page">
        <Navbar />

        {/* Hero */}
        <div className="ad-hero">
          <div className="ad-hero-inner">
            <div className="ad-eyebrow">Admin Panel</div>
            <h1>Listing <em>Review</em> Dashboard</h1>
            <p>Approve or reject submitted listings before they go live.</p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="ad-stats">
            <div className="ad-stat-card gold">
              <span className="ad-stat-label">Pending</span>
              <span className="ad-stat-value">{stats.pending ?? 0}</span>
            </div>
            <div className="ad-stat-card green">
              <span className="ad-stat-label">Active</span>
              <span className="ad-stat-value">{stats.active ?? 0}</span>
            </div>
            <div className="ad-stat-card red">
              <span className="ad-stat-label">Rejected</span>
              <span className="ad-stat-value">{stats.rejected ?? 0}</span>
            </div>
            <div className="ad-stat-card blue">
              <span className="ad-stat-label">Total</span>
              <span className="ad-stat-value">{stats.total ?? 0}</span>
            </div>
          </div>
        )}

        {/* Bar */}
        <div className="ad-bar" style={{ marginTop: stats ? "1.5rem" : 0 }}>
          <div className="ad-bar-inner">
            <div className="ad-search-wrap">
              <span className="ad-search-icon"><SearchIcon /></span>
              <input className="ad-search" type="text" placeholder="Search listings…"
                value={filters.search} onChange={e => setFilter("search", e.target.value)} />
            </div>

            <div className="ad-tabs">
              {[["pending","pending"],["active","active"],["rejected","rejected"],["","all"]].map(([val, dot]) => (
                <button key={dot} className={`ad-tab ${filters.status === val ? "active" : ""}`}
                  onClick={() => setFilter("status", val)}>
                  <span className={`ad-tab-dot ${dot}`} />
                  {val === "" ? "All" : val.charAt(0).toUpperCase() + val.slice(1)}
                </button>
              ))}
            </div>

            <select className="ad-type-select" value={filters.type}
              onChange={e => setFilter("type", e.target.value)}>
              <option value="">All Types</option>
              <option value="hotel">Hotel</option>
              <option value="shortlet">Shortlet</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="ad-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Admin</span>
        </div>

        {/* Content */}
        <div className="ad-content">
          {!loading && pagination && (
            <p className="ad-count">
              <strong>{pagination.total.toLocaleString()}</strong>{" "}
              listing{pagination.total !== 1 ? "s" : ""}
              {filters.status && <> · <strong style={{ textTransform: "capitalize" }}>{filters.status}</strong></>}
            </p>
          )}

          <div className="ad-grid">
            {loading ? (
              Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <div className="ad-error">
                <p>{error}</p>
                <button onClick={() => fetchListings(filters)}>Try again</button>
              </div>
            ) : listings.length === 0 ? (
              <div className="ad-empty">
                <div className="ad-empty-icon"><HomeIllo /></div>
                <h3>No listings found</h3>
                <p>Nothing here yet for the selected filter.</p>
              </div>
            ) : (
              listings.map(l => (
                <AdminCard key={l._id} listing={l} onAction={handleAction} />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination && pagination.totalPages > 1 && (
            <div className="ad-pagination">
              <button className="ad-page-btn" onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}><ChevL /></button>
              {buildPages(pagination.totalPages, pagination.page).map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="ad-page-ellipsis">…</span>
                ) : (
                  <button key={p} onClick={() => goToPage(p)}
                    className={`ad-page-btn ${p === pagination.page ? "active" : ""}`}>
                    {p}
                  </button>
                )
              )}
              <button className="ad-page-btn" onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage}><ChevR /></button>
            </div>
          )}
        </div>

        <Footer />
      </div>

      {/* Toast */}
      {toast && (
        <div className={`ad-toast ${toast.kind}`}>
          {toast.kind === "success" ? <CheckIcon /> : <XIcon />}
          {toast.msg}
        </div>
      )}
    </>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#fff" }}>Loading…</div>}>
      <AdminContent />
    </Suspense>
  );
}