/**
 * Email Verification API Route
 * POST /api/auth/verify-email
 * Verify user email with token
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';
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

    // Find verification token
    const { data: verificationRecord, error: tokenError } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !verificationRecord) {
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
      await supabase
        .from('email_verification_tokens')
        .delete()
        .eq('id', verificationRecord.id);

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
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', verificationRecord.user_id);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to verify email',
          error: updateError.message,
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Delete verification token
    await supabase
      .from('email_verification_tokens')
      .delete()
      .eq('id', verificationRecord.id);

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
