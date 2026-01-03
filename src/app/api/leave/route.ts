/**
 * Leave Management API Routes
 * GET /api/leave - Get leave applications
 * POST /api/leave/apply - Apply for leave
 * POST /api/leave/approve - Approve leave (admin)
 * POST /api/leave/reject - Reject leave (admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import type { ApiResponse, LeaveApplication } from '@/lib/types-new';

/**
 * GET /api/leave
 * Get leave applications
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'No authentication token provided',
        } as ApiResponse,
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'Invalid token',
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Get query params
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    // Get user's employee record
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    let query = supabase.from('leave_applications').select(`
      *,
      leave_types(id, name),
      employees(id, first_name, last_name)
    `);

    // If not admin, only return own leaves
    if (user?.role !== 'ADMIN') {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', decoded.userId)
        .single();

      if (employee) {
        query = query.eq('employee_id', employee.id);
      }
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: leaves, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch leave applications',
          error: error.message,
        } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Leave applications retrieved successfully',
        data: leaves || [],
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Get leave error:', error);

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

/**
 * POST /api/leave/apply
 * Apply for leave
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'No authentication token provided',
        } as ApiResponse,
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'Invalid token',
        } as ApiResponse,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { leaveTypeId, fromDate, toDate, reason } = body;

    if (!leaveTypeId || !fromDate || !toDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          error: 'leaveTypeId, fromDate, and toDate are required',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Get employee
    const { data: employee } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', decoded.userId)
      .single();

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: 'Employee record not found',
          error: 'No employee record associated with this user',
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Check leave balance
    const currentYear = new Date().getFullYear();
    const { data: leaveBalance } = await supabase
      .from('leave_balance')
      .select('remaining_days')
      .eq('employee_id', employee.id)
      .eq('leave_type_id', leaveTypeId)
      .eq('year', currentYear)
      .single();

    // Calculate days
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const daysRequested = Math.ceil(
      (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (
      leaveBalance &&
      leaveBalance.remaining_days < daysRequested
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Insufficient leave balance',
          error: `You have ${leaveBalance.remaining_days} days remaining`,
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Create leave application
    const { data: newLeave, error } = await supabase
      .from('leave_applications')
      .insert({
        employee_id: employee.id,
        leave_type_id: leaveTypeId,
        from_date: fromDate,
        to_date: toDate,
        reason: reason || null,
        status: 'PENDING',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to apply for leave',
          error: error.message,
        } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Leave application submitted successfully',
        data: newLeave,
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error('Apply leave error:', error);

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
