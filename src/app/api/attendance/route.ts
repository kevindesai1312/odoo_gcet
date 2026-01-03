/**
 * Attendance API Routes
 * GET /api/attendance - Get attendance records
 * POST /api/attendance/check-in - Check in
 * POST /api/attendance/check-out - Check out
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import type { ApiResponse, Attendance } from '@/lib/types-new';

/**
 * GET /api/attendance
 * Get attendance records for employee or all employees (admin)
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
    const employeeId = url.searchParams.get('employeeId');
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');

    const db = await getDb();
    
    // Build query filter
    let filter: any = {};

    // If not admin, only return own attendance
    if (!employeeId && decoded.userId) {
      const employee = await db.collection('employees').findOne({
        user_id: new ObjectId(decoded.userId)
      });

      if (employee) {
        filter.employee_id = employee._id;
      }
    } else if (employeeId) {
      filter.employee_id = new ObjectId(employeeId);
    }

    if (fromDate) {
      filter.attendance_date = { $gte: new Date(fromDate) };
    }

    if (toDate) {
      if (filter.attendance_date) {
        filter.attendance_date.$lte = new Date(toDate);
      } else {
        filter.attendance_date = { $lte: new Date(toDate) };
      }
    }

    const attendance = await db.collection('attendance')
      .find(filter)
      .sort({ attendance_date: -1 })
      .toArray();

    // Serialize ObjectIds
    const serialized = attendance.map(record => ({
      ...record,
      _id: record._id?.toString(),
      employee_id: record.employee_id?.toString()
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Attendance records retrieved successfully',
        data: serialized || [],
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Get attendance error:', error);

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
 * POST /api/attendance/check-in
 * Record check-in time
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

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const { data: existingAttendance } = await supabase
      .from('attendance')
      .select('id')
      .eq('employee_id', employee.id)
      .eq('attendance_date', today)
      .single();

    if (existingAttendance) {
      return NextResponse.json(
        {
          success: false,
          message: 'Already checked in today',
          error: 'You have already checked in for today',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Create attendance record with check-in
    const now = new Date().toISOString();
    const { data: newAttendance, error } = await supabase
      .from('attendance')
      .insert({
        employee_id: employee.id,
        attendance_date: today,
        check_in_time: now,
        status: 'PRESENT',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to record check-in',
          error: error.message,
        } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Checked in successfully',
        data: newAttendance,
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error('Check-in error:', error);

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
