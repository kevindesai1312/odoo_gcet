import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { ObjectId } from 'mongodb'
import { getDb } from './mongodb'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function verifyAndGetUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, secret)
    const userId = verified.payload.userId as string
    
    const db = await getDb()
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    })

    return user
  } catch (error) {
    return null
  }
}

export async function verifyAndGetEmployee() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, secret)
    const userId = verified.payload.userId as string

    const db = await getDb()
    const employee = await db.collection('employees').findOne({
      user_id: new ObjectId(userId)
    })

    return employee
  } catch (error) {
    return null
  }
}

export async function verifyAndGetUserWithRole() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, secret)
    const userId = verified.payload.userId as string
    
    const db = await getDb()
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    })

    if (!user) {
      return null
    }

    return {
      ...user,
      id: user._id,
      userId: String(user._id)
    }
  } catch (error) {
    return null
  }
}
