import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-prod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password_hash || '');
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: String(user._id || user.id), email: user.email, role: user.role || 'employee' }, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({ token, user: { id: String(user._id || user.id), email: user.email, role: user.role } }, { status: 200 });

    // Set secure HttpOnly cookie for auth-token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Signin error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

