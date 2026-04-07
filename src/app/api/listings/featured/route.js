import { NextResponse } from "next/server";
import { connectDB }     from "@/lib/mongodb";
import Listing           from "@/models/Listing";

export async function GET() {
  try {
    await connectDB();

    const types = ["sale", "rent", "hotel", "shortlet"];

    
    const results = await Promise.all(
      types.map((type) =>
        Listing.findOne({ type, status: "active" })
          .sort({ createdAt: -1 })
          .select("title type images location price pricePerYear pricePerMonth pricePerNight bedrooms bathrooms totalRooms starRating phone createdAt")
          .lean()
      )
    );

    const listings = results.filter(Boolean);

    return NextResponse.json({ listings }, { status: 200 });
  } catch (err) {
    console.error("[listings/featured] Error:", err);
    return NextResponse.json({ error: "Failed to fetch featured listings." }, { status: 500 });
  }
}