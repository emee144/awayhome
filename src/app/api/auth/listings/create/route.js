import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { getCurrentUser } from "@/lib/auth"; 

// ─── Validation helpers ───────────────────────────────────────────────────────
function validateRequired(obj, fields) {
  const missing = fields.filter((f) => !obj[f] || String(obj[f]).trim() === "");
  return missing;
}

// ─── POST /api/listings/create ────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { type } = body;

    // ── 🔐 0. Require authentication ───────────────────────────────────────────
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const userId = user._id.toString();

    // ── 1. Validate listing type ───────────────────────────────────────────────
    if (!["hotel", "shortlet", "sale", "rent"].includes(type)) {
      return NextResponse.json({ error: "Invalid listing type." }, { status: 400 });
    }

    // ── 2. Validate required fields per type ──────────────────────────────────
    let missingFields = [];

    if (type === "hotel") {
      missingFields = validateRequired(body, [
        "hotelName", "starRating", "address", "state", "city",
        "totalRooms", "pricePerNight", "description",
        "contactName", "contactPhone",
      ]);
    }

    if (type === "shortlet") {
      missingFields = validateRequired(body, [
        "title", "address", "state", "city",
        "pricePerNight", "description",
        "contactName", "contactPhone",
      ]);
    }

    if (type === "sale") {
      missingFields = validateRequired(body, [
        "title", "propertyType", "address", "state", "city",
        "price", "description",
        "contactName", "contactPhone",
      ]);
    }
  if (type === "rent") {
  missingFields = validateRequired(body, [
    "title", "propertyType", "address", "state", "city",
    "description",
    "contactName", "contactPhone",
  ]);

  if (!body.pricePerMonth && !body.pricePerYear) {
    return NextResponse.json(
      { error: "Provide at least pricePerMonth or pricePerYear." },
      { status: 400 }
    );
  }
}
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // ── 3. Validate images (Cloudinary URLs) ──────────────────────────────────
    const images = body.images || [];

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "At least one photo is required." },
        { status: 400 }
      );
    }

    if (images.length > 4) {
      return NextResponse.json(
        { error: "Maximum 4 photos allowed." },
        { status: 400 }
      );
    }

    const cloudinaryDomain = "res.cloudinary.com";
    const invalidImages = images.filter(
      (url) => typeof url !== "string" || !url.includes(cloudinaryDomain)
    );

    if (invalidImages.length > 0) {
      return NextResponse.json(
        { error: "Invalid image URLs detected. Please re-upload your photos." },
        { status: 400 }
      );
    }

    // ── 4. Validate phone number ───────────────────────────────────────────────
    const phone = String(body.contactPhone || "").trim();
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;

    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Please enter a valid Nigerian phone number." },
        { status: 400 }
      );
    }

    // ── 5. Validate email if provided ─────────────────────────────────────────
    if (body.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(body.contactEmail.trim())) {
        return NextResponse.json(
          { error: "Please enter a valid email address." },
          { status: 400 }
        );
      }
    }

    // ── 6. Validate URL if provided ───────────────────────────────────────────
    if (body.website) {
      try {
        new URL(body.website);
      } catch {
        return NextResponse.json(
          { error: "Please enter a valid website URL (include https://)." },
          { status: 400 }
        );
      }
    }

    // ── 7. Connect DB ─────────────────────────────────────────────────────────
    await connectDB();

    // ── 8. Build the listing document ─────────────────────────────────────────
    let listingData = {
      type,
      images,
      status: "pending",
      createdBy: userId,
      createdAt: new Date(),

      contact: {
        name: body.contactName.trim(),
        phone: phone,
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
      listingData = {
        ...listingData,
        title: body.hotelName.trim(),
        starRating: body.starRating,
        totalRooms: parseInt(body.totalRooms, 10),
        pricePerNight: parseFloat(body.pricePerNight),
        description: body.description.trim(),
      };
    }

    if (type === "shortlet") {
      listingData = {
        ...listingData,
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
      listingData = {
        ...listingData,
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
  listingData = {
    ...listingData,
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

    // ── 9. Save to database ───────────────────────────────────────────────────
    const listing = await Listing.create(listingData);

    // ── 10. Return success ────────────────────────────────────────────────────
    return NextResponse.json(
      {
        message:
          "Listing submitted successfully. It will be reviewed and published within 24 hours.",
        listingId: listing._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[listings/create]", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}