/**
 * Email Verification API Route
 * POST /api/auth/verify-email
 * Verify user email with token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { ApiResponse } from '@/lib/types-new';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing verification token',
          error: 'Token is required',
        } as ApiResponse,
        { status: 400 }
      );
    }

    const db = await getDb();

    // Find verification token
    const verificationRecord = await db
      .collection('email_verification_tokens')
      .findOne({ token });

    if (!verificationRecord) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid verification token',
          error: 'Token not found or expired',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if token is expired
    const expiresAt = new Date(verificationRecord.expires_at);
    if (expiresAt < new Date()) {
      // Delete expired token
      await db
        .collection('email_verification_tokens')
        .deleteOne({ _id: verificationRecord._id });

      return NextResponse.json(
        {
          success: false,
          message: 'Verification token expired',
          error: 'Token has expired, please request a new one',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Mark user as verified
    const updateResult = await db
      .collection('users')
      .updateOne(
        { _id: verificationRecord.user_id },
        { $set: { is_verified: true } }
      );

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to verify email',
          error: 'Could not update user',
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Delete verification token
    await db
      .collection('email_verification_tokens')
      .deleteOne({ _id: verificationRecord._id });

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);

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
