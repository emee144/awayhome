import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";

// ─── GET /api/listings ────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // ── 1. Parse query params ─────────────────────────────────────────────────
    const type      = searchParams.get("type")    || null;  
    const state     = searchParams.get("state")   || null;
    const city      = searchParams.get("city")    || null;
    const search    = searchParams.get("search")  || null;   
    const minPrice  = searchParams.get("minPrice")|| null;
    const maxPrice  = searchParams.get("maxPrice")|| null;
    const rentMode = searchParams.get("rentMode") || "year";
    const bedrooms  = searchParams.get("bedrooms")|| null;  
    const page      = Math.max(1, parseInt(searchParams.get("page")  || "1", 10));
    const limit     = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const sortBy    = searchParams.get("sortBy")  || "createdAt"; 
    const sortOrder = searchParams.get("sortOrder")=== "asc" ? 1 : -1;

    // ── 2. Build query ────────────────────────────────────────────────────────
    const query = { status: "active" }; // only show published listings

    if (type)  query.type = type;
    if (state) query["location.state"] = { $regex: new RegExp(`^${state}$`, "i") };
    if (city)  query["location.city"]  = { $regex: new RegExp(`^${city}$`,  "i") };

    if (search) {
      query.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

   if ((minPrice || maxPrice) && type) {
  let priceField;

  switch (type) {
    case "sale":
      priceField = "price";
      break;

    case "rent":
      priceField =
        rentMode === "month"
          ? "pricePerMonth"
          : "pricePerYear";
      break;

    default:
      priceField = "pricePerNight";
  }

  query[priceField] = {};
  if (minPrice) query[priceField].$gte = parseFloat(minPrice);
  if (maxPrice) query[priceField].$lte = parseFloat(maxPrice);
}

    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms, 10);
    }

    // ── 3. Sort map ───────────────────────────────────────────────────────────
   const allowedSortFields = [
  "createdAt",
  "price",
  "pricePerNight",
  "pricePerYear",
  "pricePerMonth",
  "starRating"
];
    const safeSortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sort = { [safeSortField]: sortOrder };

    // ── 4. Connect & query ────────────────────────────────────────────────────
    await connectDB();

    const skip  = (page - 1) * limit;
    const total = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(
        "type title images location pricePerNight price starRating pricePerMonth pricePerYear bedrooms bathrooms propertyType description createdAt amenities contact"
      )
      .lean();

    // ── 5. Return paginated response ──────────────────────────────────────────
    return NextResponse.json({
      listings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("[listings/GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch listings. Please try again." },
      { status: 500 }
    );
  }
}