import mongoose from "mongoose";

const roundedNumber = {
  type: Number,
  default: null,
  set: (v) => (v == null ? null : Math.round(Number(v))),
};

const ListingSchema = new mongoose.Schema(
  {
    // ── Core ──────────────────────────────────────────────────────────────────
    type: {
      type: String,
      enum: ["hotel", "shortlet", "sale", "rent"],
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

    images: {
      type: [String],
      required: true,
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

    // ── Amenities ─────────────────────────────────────────────────────────────
    amenities: { type: [String], default: [] },

    // ── Hotel / Shortlet ──────────────────────────────────────────────────────
    starRating: { type: String, default: null },
    totalRooms: { type: Number, default: null },
    pricePerNight: {
      ...roundedNumber, 
      required: [
        function () { return this.type === "hotel" || this.type === "shortlet"; },
        "pricePerNight is required for hotel or shortlet listings",
      ],
    },

    // ── Shortlet-specific ─────────────────────────────────────────────────────
    pricePerWeek: { ...roundedNumber },  
    minNights:    { type: Number, default: 1 },

    // ── Rooms ─────────────────────────────────────────────────────────────────
    bedrooms:  { type: Number, default: null },
    bathrooms: { type: Number, default: null },
    toilets:   { type: Number, default: null },

    // ── Sale / Rent ───────────────────────────────────────────────────────────
    propertyType: {
      type: String,
      default: null,
      required: function () { return this.type === "sale" || this.type === "rent"; },
    },
    price: {
      ...roundedNumber, 
      required: [
        function () { return this.type === "sale"; },
        "price is required for sale listings",
      ],
    },
    negotiable: { type: Boolean, default: false },
    landSize:   { type: Number, default: null },
    landUnit:   { type: String, default: "sqm" },
    agencyName: { type: String, default: null },

    // ── Rent-specific ─────────────────────────────────────────────────────────
    pricePerYear: {
      ...roundedNumber,
      required: [
        function () { return this.type === "rent"; },
        "pricePerYear is required for rent listings",
      ],
    },
    pricePerMonth: { ...roundedNumber },  
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
ListingSchema.index({ type: 1, status: 1 });
ListingSchema.index({ "location.state": 1 });
ListingSchema.index({ "location.city": 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ pricePerNight: 1 });
ListingSchema.index({ featured: -1, createdAt: -1 });
ListingSchema.index({ pricePerYear: 1 });
ListingSchema.index({ pricePerMonth: 1 });

// ── Pre-save hooks ────────────────────────────────────────────────────────────
ListingSchema.pre("save", function () {
  if (this.type !== "sale")                              this.price = null;
  if (this.type !== "rent")   { this.pricePerYear = null; this.pricePerMonth = null; }
  if (this.type !== "hotel" && this.type !== "shortlet") this.pricePerNight = null;
});

ListingSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (!update) return;
  const data = update.$set || update;
  const type = data.type;
  if (type) {
    if (type !== "sale")                             data.price = null;
    if (type !== "rent") { data.pricePerYear = null; data.pricePerMonth = null; }
    if (type !== "hotel" && type !== "shortlet")     data.pricePerNight = null;
  }
  this.setOptions({ runValidators: true });
});

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema);