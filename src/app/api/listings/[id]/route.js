import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { getCurrentUser } from "@/lib/auth";

// ─── Constants ────────────────────────────────────────────────────────────────
const LOGIN_URL = "/login";
const VALID_TYPES = ["hotel", "shortlet", "sale", "rent"];
const MAX_IMAGES = 4;
const CLOUDINARY_DOMAIN = "res.cloudinary.com";
const PHONE_REGEX = /^(\+234|0)[789][01]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRequired(obj, fields) {
  return fields.filter((f) => !obj[f] || String(obj[f]).trim() === "");
}

function redirectToLogin() {
  return NextResponse.redirect(new URL(LOGIN_URL, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}

function unauthorized(message = "Unauthorized. Please log in.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

function forbidden(message = "You do not have permission to do this.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

function notFound(message = "Listing not found.") {
  return NextResponse.json({ error: message }, { status: 404 });
}

// ─── Auth guard — returns user or a redirect response ─────────────────────────
async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { user: null, response: redirectToLogin() };
  return { user, response: null };
}

// ─── Ownership guard ──────────────────────────────────────────────────────────
function isOwner(listing, userId) {
  return String(listing.createdBy) === String(userId);
}

// ─── Build listing document from body ────────────────────────────────────────
function buildListingData(type, body, images, userId) {
  const base = {
    type,
    images,
    status: "pending",
    createdBy: userId,
    createdAt: new Date(),
    contact: {
      name: body.contactName.trim(),
      phone: String(body.contactPhone).trim().replace(/\s/g, ""),
      email: body.contactEmail?.trim() || null,
      website: body.website?.trim() || null,
    },
    location: {
      address: body.address.trim(),
      state: body.state.trim(),
      city: body.city.trim(),
    },
    amenities: Array.isArray(body.amenities) ? body.amenities : [],
  };

  if (type === "hotel") {
    return {
      ...base,
      title: body.hotelName.trim(),
      starRating: body.starRating,
      totalRooms: parseInt(body.totalRooms, 10),
      pricePerNight: parseFloat(body.pricePerNight),
      description: body.description.trim(),
    };
  }

  if (type === "shortlet") {
    return {
      ...base,
      title: body.title.trim(),
      bedrooms: parseInt(body.bedrooms, 10) || 1,
      bathrooms: parseInt(body.bathrooms, 10) || 1,
      toilets: parseInt(body.toilets, 10) || 1,
      pricePerNight: parseFloat(body.pricePerNight),
      pricePerWeek: body.pricePerWeek ? parseFloat(body.pricePerWeek) : null,
      minNights: parseInt(body.minNights, 10) || 1,
      description: body.description.trim(),
    };
  }

  if (type === "sale") {
    return {
      ...base,
      title: body.title.trim(),
      propertyType: body.propertyType,
      bedrooms: parseInt(body.bedrooms, 10) || 0,
      bathrooms: parseInt(body.bathrooms, 10) || 0,
      toilets: parseInt(body.toilets, 10) || 0,
      price: body.price ? parseFloat(body.price) : null,
      negotiable: Boolean(body.negotiable),
      landSize: body.landSize ? parseFloat(body.landSize) : null,
      landUnit: body.landUnit || "sqm",
      description: body.description.trim(),
      agencyName: body.agencyName?.trim() || null,
    };
  }

  if (type === "rent") {
    return {
      ...base,
      title: body.title.trim(),
      propertyType: body.propertyType,
      bedrooms: parseInt(body.bedrooms, 10) || 0,
      bathrooms: parseInt(body.bathrooms, 10) || 0,
      toilets: parseInt(body.toilets, 10) || 0,
      pricePerYear: body.pricePerYear ? parseFloat(body.pricePerYear) : null,
      pricePerMonth: body.pricePerMonth ? parseFloat(body.pricePerMonth) : null,
      negotiable: Boolean(body.negotiable),
      description: body.description.trim(),
      agencyName: body.agencyName?.trim() || null,
    };
  }
}

function validateBody(type, body) {
  // Required fields per type
  const requiredMap = {
    hotel: [
      "hotelName", "starRating", "address", "state", "city",
      "totalRooms", "pricePerNight", "description",
      "contactName", "contactPhone",
    ],
    shortlet: [
      "title", "address", "state", "city",
      "pricePerNight", "description",
      "contactName", "contactPhone",
    ],
    sale: [
      "title", "propertyType", "address", "state", "city",
      "price", "description",
      "contactName", "contactPhone",
    ],
    rent: [
      "title", "propertyType", "address", "state", "city",
      "description", "contactName", "contactPhone",
    ],
  };

  const missing = validateRequired(body, requiredMap[type] || []);
  if (missing.length > 0) {
    return { error: `Missing required fields: ${missing.join(", ")}` };
  }

  if (type === "rent" && !body.pricePerMonth && !body.pricePerYear) {
    return { error: "Provide at least pricePerMonth or pricePerYear." };
  }

  return null;
}

function validateImages(images) {
  if (!Array.isArray(images) || images.length === 0) {
    return { error: "At least one photo is required." };
  }
  if (images.length > MAX_IMAGES) {
    return { error: `Maximum ${MAX_IMAGES} photos allowed.` };
  }
  const invalid = images.filter(
    (url) => typeof url !== "string" || !url.includes(CLOUDINARY_DOMAIN)
  );
  if (invalid.length > 0) {
    return { error: "Invalid image URLs detected. Please re-upload your photos." };
  }
  return null;
}

function validateContactFields(body) {
  const phone = String(body.contactPhone || "").trim().replace(/\s/g, "");
  if (!PHONE_REGEX.test(phone)) {
    return { error: "Please enter a valid Nigerian phone number." };
  }
  if (body.contactEmail && !EMAIL_REGEX.test(body.contactEmail.trim())) {
    return { error: "Please enter a valid email address." };
  }
  if (body.website) {
    try { new URL(body.website); } catch {
      return { error: "Please enter a valid website URL (include https://)." };
    }
  }
  return null;
}
export async function GET(request, { params }) {
  try {
    const { id: listingId } = await params;

    console.log("👉 ID FROM PARAMS:", listingId);

    await connectDB();

    const allListings = await Listing.find().limit(5);
    console.log("👉 ALL LISTINGS IN DB:", allListings);

    const listing = await Listing.findById(listingId);
    console.log("👉 FOUND LISTING:", listing);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    return NextResponse.json({ listing });

  } catch (err) {
    console.error("[GET LISTING]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

   const { id: listingId } = await params;

    await connectDB();

    const listing = await Listing.findById(listingId);
    if (!listing) return notFound();

    if (!isOwner(listing, user._id)) {
      return forbidden("You can only edit your own listings.");
    }

    const body = await request.json();
    const type = body.type || listing.type;

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid listing type." }, { status: 400 });
    }

    const fieldError = validateBody(type, body);
    if (fieldError) return NextResponse.json(fieldError, { status: 400 });

    const images = body.images || listing.images;
    const imageError = validateImages(images);
    if (imageError) return NextResponse.json(imageError, { status: 400 });

    const contactError = validateContactFields(body);
    if (contactError) return NextResponse.json(contactError, { status: 400 });

    const updatedData = buildListingData(type, body, images, listing.createdBy);
    delete updatedData.createdBy;
    delete updatedData.createdAt;

    updatedData.status = "pending";
    updatedData.updatedAt = new Date();

    const updated = await Listing.findByIdAndUpdate(
      listingId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Listing updated successfully.",
      listing: updated,
    });

  } catch (err) {
    console.error("[PATCH]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const { id: listingId } = await params;

    await connectDB();

    const listing = await Listing.findById(listingId);
    if (!listing) return notFound();

    if (!isOwner(listing, user._id)) {
      return forbidden("You can only delete your own listings.");
    }

    await Listing.findByIdAndDelete(listingId);

    return NextResponse.json({
      message: "Listing deleted successfully.",
    });

  } catch (err) {
    console.error("[DELETE]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}