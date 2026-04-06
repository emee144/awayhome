import mongoose from "mongoose";

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

    // ── Images (Cloudinary URLs) ───────────────────────────────────────────────
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

    // ── Amenities (shared) ────────────────────────────────────────────────────
    amenities: { type: [String], default: [] },

    // ── Hotel-shortlet-specific ────────────────────────────────────────────────────────
    starRating:    { type: String, default: null },
    totalRooms:    { type: Number, default: null },
    pricePerNight: {
  type: Number,
  default: null,
  required: [
    function () {
      return this.type === "hotel" || this.type === "shortlet";
    },
    "pricePerNight is required for hotel or shortlet listings",
  ],
},

    // ── Shortlet-specific ─────────────────────────────────────────────────────
    pricePerWeek: { type: Number, default: null },
    minNights:    { type: Number, default: 1 },

    // ── Rooms (shortlet + sale) ───────────────────────────────────────────────
    bedrooms:  { type: Number, default: null },
    bathrooms: { type: Number, default: null },
    toilets:   { type: Number, default: null },

    // ── Sale-or-rent-specific ─────────────────────────────────────────────────────────
   propertyType: {
  type: String,
  default: null,
  required: function () {
    return this.type === "sale" || this.type === "rent";
  },
},
    price: {
  type: Number,
  default: null,
  required: function () {
    return this.type === "sale";
  },
},
    negotiable:   { type: Boolean, default: false },
    landSize:     { type: Number, default: null },
    landUnit:     { type: String, default: "sqm" },
    agencyName:   { type: String, default: null },

    // ── Rent-specific ────────────────────────────────────────────────────────────
pricePerYear: {
  type: Number,
  default: null,
  required: function () {
    return this.type === "rent";
  },
},
pricePerMonth: { type: Number, default: null },
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
ListingSchema.index({ pricePerYear: 1 });
ListingSchema.index({ pricePerMonth: 1 });
ListingSchema.pre("save", function () {
  if (this.type !== "sale") {
    this.price = null;
  }

  if (this.type !== "rent") {
    this.pricePerYear = null;
    this.pricePerMonth = null;
  }

  if (this.type !== "hotel" && this.type !== "shortlet") {
    this.pricePerNight = null;
  }
});
ListingSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (!update) return;

  // Handle both $set and direct updates
  const data = update.$set || update;
  const type = data.type;

  if (type) {
    if (type !== "sale") {
      data.price = null;
    }

    if (type !== "rent") {
      data.pricePerYear = null;
      data.pricePerMonth = null;
    }

    if (type !== "hotel" && type !== "shortlet") {
      data.pricePerNight = null;
    }
  }


  this.setOptions({ runValidators: true });
});

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema);