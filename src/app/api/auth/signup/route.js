import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { sendEmail } from '@/lib/email'

export async function POST(req) {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      agree
    } = await req.json()

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    if (!agree) {
      return NextResponse.json(
        { message: 'You must accept the terms' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      )
    }

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      )
    }

    const verifyToken = crypto.randomBytes(32).toString('hex')

    const user = await User.create({
      name,
      email,
      phone,
      password,
      isVerified: false,
      verifyToken,
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verifyToken}`
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `
        <h2>Welcome, ${name} 👋</h2>
        <p>Please verify your email:</p>
        <a href="${verifyUrl}" style="padding:10px 20px;background:black;color:white;text-decoration:none;border-radius:5px;">
          Verify Email
        </a>
        <p style="font-size:12px;color:#888;margin-top:20px;">
          This is an automated message. Please do not reply.
        </p>
      `,
    })

    return NextResponse.json(
      { message: 'Account created. Check your email to verify.' },
      { status: 201 }
    )

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}