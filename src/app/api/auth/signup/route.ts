import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-prod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const employees = db.collection('employees');

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userDoc = {
      email: email.toLowerCase(),
      password_hash,
      role: 'EMPLOYEE',
      is_verified: true,
      created_at: new Date()
    };

    const res = await users.insertOne(userDoc as any);
    const userId = res.insertedId;

    const employeeDoc = {
      user_id: userId,
      employee_id: `EMP-${Date.now()}`,
      first_name: firstName || '',
      last_name: lastName || '',
      email: email.toLowerCase(),
      is_active: true,
      created_at: new Date()
    };
    await employees.insertOne(employeeDoc as any);

    const token = jwt.sign({ userId: String(userId), email: email.toLowerCase(), role: 'EMPLOYEE' }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ token, user: { id: String(userId), email: email.toLowerCase(), role: 'EMPLOYEE' } }, { status: 201 });
  } catch (err: any) {
    console.error('Signup error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
/**
 * Sign Up API Route
 * POST /api/auth/signup
 * Register new user and create employee record
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';
import {
  hashPassword,
  isValidEmail,
  isStrongPassword,
  generateVerificationToken,
} from '@/lib/auth';
import type { SignupPayload, ApiResponse } from '@/lib/types-new';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SignupPayload = await request.json();

    // Validate input
    const { email, password, firstName, lastName, phone, hireDate } = body;

    if (!email || !password || !firstName || !lastName || !hireDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          error: 'email, password, firstName, lastName, and hireDate are required',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
          error: 'Please provide a valid email address',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.isStrong) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password does not meet requirements',
          error: passwordValidation.errors.join('; '),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User already exists',
          error: 'Email is already registered',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role: 'EMPLOYEE',
        is_verified: true,
      })
      .select()
      .single();

    if (userError || !newUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create user',
          error: userError?.message || 'Unknown error',
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Create employee record
    const { data: newEmployee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        user_id: newUser.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        hire_date: hireDate,
        is_active: true,
      })
      .select()
      .single();

    if (employeeError || !newEmployee) {
      // Rollback user creation
      await supabase.from('users').delete().eq('id', newUser.id);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create employee record',
          error: employeeError?.message || 'Unknown error',
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Generate email verification token
    const { token, expiresAt } = generateVerificationToken();

    const { error: tokenError } = await supabase
      .from('email_verification_tokens')
      .insert({
        user_id: newUser.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error('Failed to create verification token:', tokenError);
    }

    // TODO: Send verification email with token

    return NextResponse.json(
      {
        success: true,
        message:
          'User registered successfully. Please verify your email to proceed.',
        data: {
          userId: newUser.id,
          email: newUser.email,
        },
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
