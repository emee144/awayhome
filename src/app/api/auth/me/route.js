import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(req) {
  try {
    const token = req.cookies.get('access_token')?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    await connectDB()

    const user = await User.findById(decoded.id).select('-password')

    return NextResponse.json({ user })

  } catch {
    return NextResponse.json({ user: null })
  }
}