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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new password are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const user = await User.findById(currentUser._id).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/user/password]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}