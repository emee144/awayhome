import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { getCurrentUser } from "@/lib/auth";

// ─── Auth guard ───────────────────────────────────────────────────────────────
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return { user: null, err: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  if (user.role !== "admin") return { user: null, err: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  return { user, err: null };
}

// ─── GET /api/admin/listings ──────────────────────────────────────────────────
export async function GET(request) {
  const { err } = await requireAdmin();
  if (err) return err;

  try {
    const { searchParams } = new URL(request.url);

    const status    = searchParams.get("status")  || null;   // pending | active | rejected | null = all
    const type      = searchParams.get("type")    || null;
    const search    = searchParams.get("search")  || null;
    const page      = Math.max(1, parseInt(searchParams.get("page")  || "1",  10));
    const limit     = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    await connectDB();

    // ── Stats (always computed across all statuses) ───────────────────────────
    const [pending, active, rejected, total] = await Promise.all([
      Listing.countDocuments({ status: "pending"  }),
      Listing.countDocuments({ status: "active"   }),
      Listing.countDocuments({ status: "rejected" }),
      Listing.countDocuments({}),
    ]);
    const stats = { pending, active, rejected, total };

    // ── Build query ───────────────────────────────────────────────────────────
    const query = {};
    if (status) query.status = status;
    if (type)   query.type   = type;
    if (search) {
      query.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city":  { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    const skip       = (page - 1) * limit;
    const totalCount = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email")
      .select(
        "type title images location status pricePerNight price pricePerYear pricePerMonth " +
        "bedrooms bathrooms totalRooms starRating propertyType description createdAt createdBy contact"
      )
      .lean();

    return NextResponse.json({
      listings,
      stats,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("[admin/listings GET]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}