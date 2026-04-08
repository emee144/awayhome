import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

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

  
    const query = { status: "active" };

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
if (minPrice) query[priceField].$gte = Math.round(parseFloat(minPrice));
if (maxPrice) query[priceField].$lte = Math.round(parseFloat(maxPrice));
}

    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms, 10);
    }

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

   const roundedListings = listings.map((l) => ({
  ...l,
  price:         l.price         != null ? Math.round(l.price)         : null,
  pricePerNight: l.pricePerNight != null ? Math.round(l.pricePerNight) : null,
  pricePerYear:  l.pricePerYear  != null ? Math.round(l.pricePerYear)  : null,
  pricePerMonth: l.pricePerMonth != null ? Math.round(l.pricePerMonth) : null,
  pricePerWeek:  l.pricePerWeek  != null ? Math.round(l.pricePerWeek)  : null,
}));
 
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

const VALID_TYPES = ["hotel", "shortlet", "sale", "rent"];
const MAX_IMAGES = 4;
const CLOUDINARY_DOMAIN = "res.cloudinary.com";

const PHONE_REGEX = /^(\+234|0)[789][01]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRequired(obj, fields) {
  return fields.filter((f) => !obj[f] || String(obj[f]).trim() === "");
}

function validateBody(type, body) {
  const requiredMap = {
    hotel: [
      "hotelName","starRating","address","state","city",
      "totalRooms","pricePerNight","description",
      "contactName","contactPhone",
    ],
    shortlet: [
      "title","address","state","city",
      "pricePerNight","description",
      "contactName","contactPhone",
    ],
    sale: [
      "title","propertyType","address","state","city",
      "price","description",
      "contactName","contactPhone",
    ],
    rent: [
      "title","propertyType","address","state","city",
      "description","contactName","contactPhone",
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
    return { error: "Invalid image URLs detected." };
  }

  return null;
}

function validateContactFields(body) {
  const phone = String(body.contactPhone || "").trim().replace(/\s/g, "");

  if (!PHONE_REGEX.test(phone)) {
    return { error: "Invalid Nigerian phone number." };
  }

  if (body.contactEmail && !EMAIL_REGEX.test(body.contactEmail.trim())) {
    return { error: "Invalid email address." };
  }

  if (body.website) {
    try {
      new URL(body.website);
    } catch {
      return { error: "Invalid website URL." };
    }
  }

  return null;
}

function buildListingData(type, body, images, userId) {
  const base = {
    type,
    images,
    status: "pending",
    createdBy: userId,
    createdAt: new Date(),
    contact: {
      name: body.contactName.trim(),
      phone: String(body.contactPhone).trim(),
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
      pricePerNight: body.pricePerNight 
  ? Math.round(Number(body.pricePerNight))
  : null,
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
      pricePerNight: body.pricePerNight 
  ? Math.round(Number(body.pricePerNight))
  : null,
      pricePerWeek: body.pricePerWeek 
  ? Math.round(Number(body.pricePerWeek))
  : null,
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
      price: body.price ? Math.round(Number(body.price)) : null,
      negotiable: Boolean(body.negotiable),
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
     pricePerYear: body.pricePerYear 
  ? Math.round(Number(body.pricePerYear)) 
  : null,
      pricePerMonth: body.pricePerMonth 
  ? Math.round(Number(body.pricePerMonth))
  : null,
      negotiable: Boolean(body.negotiable),
      description: body.description.trim(),
      agencyName: body.agencyName?.trim() || null,
    };
  }

  return base;
}
export async function POST(request) {
  try {
  const user = await getCurrentUser();

if (!user || !user._id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

    const body = await request.json();
    const { type } = body;

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid listing type." }, { status: 400 });
    }

    const fieldError = validateBody(type, body);
    if (fieldError) return NextResponse.json(fieldError, { status: 400 });

    const imageError = validateImages(body.images || []);
    if (imageError) return NextResponse.json(imageError, { status: 400 });

    const contactError = validateContactFields(body);
    if (contactError) return NextResponse.json(contactError, { status: 400 });

    await connectDB();
    const listing = await Listing.create(
      buildListingData(type, body, body.images, user._id.toString())
    );

    return NextResponse.json(
      {
        message: "Listing submitted successfully. It will be reviewed and published within 24 hours.",
        listingId: listing._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[listings POST]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}