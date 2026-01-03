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

    // Check if already checked in today
    const existingAttendance = await db.collection('attendance').findOne({
      employee_id: employee._id,
      date: today
    })

    if (existingAttendance && existingAttendance.check_in_time) {
      return NextResponse.json({ error: 'Already checked in today' }, { status: 400 })
    }

    const now = new Date()

    if (existingAttendance) {
      // Update existing record with check-in
      await db.collection('attendance').updateOne(
        { _id: existingAttendance._id },
        {
          $set: {
            check_in_time: now,
            status: 'present'
          }
        }
      )
    } else {
      // Create new attendance record
      await db.collection('attendance').insertOne({
        employee_id: employee._id,
        date: today,
        check_in_time: now,
        check_out_time: null,
        status: 'present',
        created_at: now,
        updated_at: now
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Checked in successfully'
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
