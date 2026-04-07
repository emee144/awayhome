"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiPhone, FiMail } from "react-icons/fi";
import "../hotels.css";


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
    starRating, totalRooms, description, amenities, contact,
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
       {contact?.phone && (
  <button
    onClick={(e) => {
      e.stopPropagation(); 
      window.location.href = `tel:${contact.phone}`;
    }}
    className="ht-card-contact-item"
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
    className="ht-card-contact-item"
  >
    <FiMail size={13} />
    <span>{contact.email}</span>
  </button>
)}
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
      const res  = await fetch(`/api/listings?${qs.toString()}`);
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
              From guesthouses to 5-star luxury. Browse verified hotels
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