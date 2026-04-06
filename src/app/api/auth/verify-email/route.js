import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  await connectDB()

  const user = await User.findOne({ verifyToken: token })

  if (!user) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 })
  }

  user.isVerified = true
  user.verifyToken = undefined
  await user.save()

  return NextResponse.redirect(new URL('/login?verified=true', req.url))
}