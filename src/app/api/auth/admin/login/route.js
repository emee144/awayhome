import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const ipRequests = new Map();      
const loginAttempts = new Map();   

export async function POST(req) {
  try {
    // ─── 0. Basic checks ───────────────────────────────────────────────────
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

  
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

    const now = Date.now();


    const WINDOW = 10 * 1000; // 10 sec
    const LIMIT = 5;

    if (!ipRequests.has(ip)) ipRequests.set(ip, []);
    const recentRequests = ipRequests.get(ip).filter(t => now - t < WINDOW);

    recentRequests.push(now);
    ipRequests.set(ip, recentRequests);

    if (recentRequests.length > LIMIT) {
      return NextResponse.json(
        { error: "Too many requests. Try again shortly." },
        { status: 429 }
      );
    }

    const key = `${normalizedEmail}:${ip}`;
    const attemptData = loginAttempts.get(key);

    if (attemptData && attemptData.lockUntil > now) {
      const secondsLeft = Math.ceil((attemptData.lockUntil - now) / 1000);
      return NextResponse.json(
        { error: `Account locked. Try again in ${secondsLeft}s.` },
        { status: 429 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    
    const fakeHash = "$2a$10$7EqJtq98hPqEX7fNZaFWoOHi"; // dummy
    const passwordMatch = await bcrypt.compare(
      password,
      user?.password || fakeHash
    );

    if (!user || !passwordMatch) {
      // ─── Track failed attempts ──────────────────────────────────────────
      const attempts = attemptData?.count || 0;
      const newCount = attempts + 1;

      let lockUntil = 0;

      if (newCount >= 5) {
        lockUntil = now + 5 * 60 * 1000; // 5 minutes lock
      }

      loginAttempts.set(key, {
        count: newCount,
        lockUntil,
      });

      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ─── 6. Admin check ────────────────────────────────────────────────────
    const isAdmin = user.isAdmin === true || user.role === "admin";
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // ─── 7. Reset attempts on success ──────────────────────────────────────
    loginAttempts.delete(key);

    // ─── 8. Generate JWT ───────────────────────────────────────────────────
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // ─── 9. Set cookie ─────────────────────────────────────────────────────
    const cookieStore = await cookies();

    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // strong CSRF protection
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    // ─── 10. Success response ──────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name || "",
          email: user.email,
        },
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("[admin/login] Error:", err);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}