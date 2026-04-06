import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    // ── Core ──────────────────────────────────────────────────────────────────
    type: {
      type: String,
      enum: ["hotel", "shortlet", "sale"],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "sold"],
      default: "pending",
      index: true,
    },
    featured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // ── Images (Cloudinary URLs) ───────────────────────────────────────────────
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 4,
        message: "Between 1 and 4 images are required.",
      },
    },

    // ── Location ──────────────────────────────────────────────────────────────
    location: {
      address: { type: String, required: true, trim: true },
      city:    { type: String, required: true, trim: true },
      state:   { type: String, required: true, trim: true },
    },

    // ── Contact ───────────────────────────────────────────────────────────────
    contact: {
      name:    { type: String, required: true, trim: true },
      phone:   { type: String, required: true, trim: true },
      email:   { type: String, trim: true, lowercase: true, default: null },
      website: { type: String, trim: true, default: null },
    },

    // ── Amenities (shared) ────────────────────────────────────────────────────
    amenities: { type: [String], default: [] },

    // ── Hotel-specific ────────────────────────────────────────────────────────
    starRating:    { type: String, default: null },
    totalRooms:    { type: Number, default: null },
    pricePerNight: { type: Number, default: null },

    // ── Shortlet-specific ─────────────────────────────────────────────────────
    pricePerWeek: { type: Number, default: null },
    minNights:    { type: Number, default: 1 },

    // ── Rooms (shortlet + sale) ───────────────────────────────────────────────
    bedrooms:  { type: Number, default: null },
    bathrooms: { type: Number, default: null },
    toilets:   { type: Number, default: null },

    // ── Sale-specific ─────────────────────────────────────────────────────────
    propertyType: { type: String, default: null },
    price:        { type: Number, default: null },
    negotiable:   { type: Boolean, default: false },
    landSize:     { type: Number, default: null },
    landUnit:     { type: String, default: "sqm" },
    agencyName:   { type: String, default: null },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// ── Indexes for common queries ─────────────────────────────────────────────────
ListingSchema.index({ type: 1, status: 1 });
ListingSchema.index({ "location.state": 1 });
ListingSchema.index({ "location.city": 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ pricePerNight: 1 });
ListingSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema);