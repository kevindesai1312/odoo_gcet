import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { jwtVerify } from 'jose'
import { ObjectId } from 'mongodb'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie')
    const authToken = cookieHeader?.split('auth-token=')[1]?.split(';')[0]

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let decoded: any
    try {
      const verified = await jwtVerify(authToken, secret)
      decoded = verified.payload
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const db = await getDb()
    const today = new Date().toISOString().split('T')[0]

    // Get employee for this user
    const employee = await db.collection('employees').findOne({
      user_id: new ObjectId(decoded.userId as string)
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Find today's attendance
    const attendance = await db.collection('attendance').findOne({
      employee_id: employee._id,
      date: today
    })

    if (!attendance) {
      return NextResponse.json({ error: 'No check-in found for today' }, { status: 404 })
    }

    if (attendance.check_out_time) {
      return NextResponse.json({ error: 'Already checked out' }, { status: 400 })
    }

    const now = new Date()

    // Update with check-out time
    await db.collection('attendance').updateOne(
      { _id: attendance._id },
      {
        $set: {
          check_out_time: now,
          updated_at: now
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Checked out successfully'
    })
  } catch (error) {
    console.error('Check-out error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
