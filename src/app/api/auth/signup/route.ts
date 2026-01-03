/**
 * Sign Up API Route
 * POST /api/auth/signup
 * Register new user and create employee record
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/mongodb';
import { isValidEmail, isStrongPassword } from '@/lib/auth';
import type { ApiResponse } from '@/lib/types-new';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-prod';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

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

    const db = await getDb();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      email: email.toLowerCase() 
    });

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
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await db.collection('users').insertOne({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role: 'employee',
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    });

    if (!userResult.insertedId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create user',
          error: 'Database insertion failed',
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Create employee record
    const employeeResult = await db.collection('employees').insertOne({
      user_id: userResult.insertedId,
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      position: 'Employee',
      department: 'General',
      salary: 0,
      joining_date: new Date(hireDate),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    });

    if (!employeeResult.insertedId) {
      // Rollback user creation
      await db.collection('users').deleteOne({ _id: userResult.insertedId });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create employee record',
          error: 'Employee creation failed',
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: String(userResult.insertedId), 
        email: email.toLowerCase(), 
        role: 'employee' 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: {
          userId: String(userResult.insertedId),
          email: email.toLowerCase(),
          token
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
