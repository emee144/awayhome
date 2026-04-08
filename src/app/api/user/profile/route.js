import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { name, phone, email } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (email.toLowerCase() !== currentUser.email) {
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: currentUser._id } });
      if (existing) {
        return NextResponse.json({ error: "That email is already in use." }, { status: 400 });
      }
    }

    if (phone && phone !== currentUser.phone) {
      const existingPhone = await User.findOne({ phone, _id: { $ne: currentUser._id } });
      if (existingPhone) {
        return NextResponse.json({ error: "That phone number is already in use." }, { status: 400 });
      }
    }

    const updateFields = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
    };
    if (phone !== undefined) updateFields.phone = phone.trim() || undefined;

    const updated = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires -verifyToken -verifyTokenExpires");

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/user/profile]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}