import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { getCurrentUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return { user: null, err: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  if (user.role !== "admin") return { user: null, err: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  return { user, err: null };
}

const VALID_ACTIONS = ["approve", "reject"];

export async function PATCH(request, { params }) {
  const { err } = await requireAdmin();
  if (err) return err;

  try {
    const { id: listingId } = await params;
    const body = await request.json();
    const { action } = body;

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
    }

    await connectDB();

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    listing.status    = action === "approve" ? "active" : "rejected";
    listing.updatedAt = new Date();
    await listing.save();

    return NextResponse.json({
      message: `Listing ${action === "approve" ? "approved and published" : "rejected"} successfully.`,
      listing: { _id: listing._id, status: listing.status },
    });
  } catch (err) {
    console.error("[admin/listings PATCH]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}