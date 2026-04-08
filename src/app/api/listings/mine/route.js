import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing"; 
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const listings = await Listing.find({ createdBy: currentUser._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ listings }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/listings/mine]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}