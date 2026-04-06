import { NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // ── 1. Exchange code for token ─────────────────────────────
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/api/auth/google/callback",
      }
    );

    const { access_token } = tokenRes.data;

    // ── 2. Get user info ───────────────────────────────────────
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name } = userRes.data;

    // ── 3. Connect DB ──────────────────────────────────────────
    await connectDB();

    // ── 4. Find or create user ─────────────────────────────────
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        password: Math.random().toString(36).slice(-10), // dummy password
      });
    }

    // ── 5. Create JWT ──────────────────────────────────────────
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ── 6. Set cookie ──────────────────────────────────────────
    cookies().set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // ── 7. Redirect to dashboard/home ──────────────────────────
    return NextResponse.redirect("http://localhost:3000");
  } catch (err) {
    console.error("Google Auth Error:", err.response?.data || err.message);

    return NextResponse.json(
      { error: "Google authentication failed" },
      { status: 500 }
    );
  }
}