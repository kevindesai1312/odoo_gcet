/**
 * Get Employees API Route
 * GET /api/employees
 * Retrieve list of employees (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import type { ApiResponse, PaginatedResponse, Employee } from '@/lib/types-new';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-prod';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication from cookie
    const cookieHeader = request.headers.get('cookie');
    const authToken = cookieHeader?.split('auth-token=')[1]?.split(';')[0];

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'No authentication token provided',
        } as ApiResponse,
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET);
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'Invalid token',
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Check if user is admin
    const db = await getDb();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    if (user?.role !== 'admin' && user?.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden',
      );
    }

    // Get pagination params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const offset = (page - 1) * pageSize;

    // Get total count and employees
    const [employees, totalCount] = await Promise.all([
      db.collection('employees')
        .find({ is_active: true })
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(pageSize)
        .toArray(),
      db.collection('employees').countDocuments({ is_active: true })
    ]);

    // Serialize ObjectIds to strings
    const employeesList = employees.map(emp => ({
      ...emp,
      _id: emp._id?.toString() || '',
      user_id: emp.user_id?.toString() || ''
    }));

    const responsePayload = {
      success: true,
      data: employeesList,
      total: totalCount || 0,
      page,
      pageSize,
      totalPages: Math.ceil((totalCount || 0) / pageSize),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error('Get employees error:', error);

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
