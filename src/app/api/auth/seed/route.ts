import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/mongodb'

export async function POST() {
  try {
    const db = await getDb()
    const users = db.collection('users')
    const employees = db.collection('employees')

    const seedUsers = [
      { email: 'kevin@gmail.com', password: 'kevin@123', role: 'admin', firstName: 'Kevin', lastName: 'Admin' },
      { email: 'test@gmail.com', password: 'test@123', role: 'employee', firstName: 'Test', lastName: 'User' },
    ]

    const results: Array<{ email: string; created: boolean }> = []

    for (const u of seedUsers) {
      const existing = await users.findOne({ email: u.email.toLowerCase() })
      if (existing) {
        results.push({ email: u.email, created: false })
        continue
      }

      const passwordHash = await bcrypt.hash(u.password, 10)
      const userResult = await users.insertOne({
        email: u.email.toLowerCase(),
        password_hash: passwordHash,
        role: u.role,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      })

      if (userResult.insertedId) {
        await employees.insertOne({
          user_id: userResult.insertedId,
          first_name: u.firstName,
          last_name: u.lastName,
          email: u.email.toLowerCase(),
          phone: '',
          position: u.role === 'admin' ? 'Administrator' : 'Employee',
          department: 'General',
          salary: u.role === 'admin' ? 0 : 0,
          joining_date: new Date(),
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        })

        results.push({ email: u.email, created: true })
      } else {
        results.push({ email: u.email, created: false })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (err) {
    console.error('Seed error', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
