/**
 * Get Employees API Route
 * GET /api/employees
 * Retrieve list of employees (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import type { ApiResponse, PaginatedResponse, Employee } from '@/lib/types-new';

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

    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden',
          error: 'Only admins can view all employees',
        } as ApiResponse,
        { status: 403 }
      );
    }

    // Get pagination params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const offset = (page - 1) * pageSize;

    // Get total count
    const { count } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true });

    // Get employees
    const { data: employees, error } = await supabase
      .from('employees')
      .select(
        `
        id,
        user_id,
        first_name,
        last_name,
        email,
        phone,
        department_id,
        position,
        hire_date,
        salary,
        is_active,
        created_at,
        updated_at,
        departments(id, name)
      `
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch employees',
          error: error.message,
        } as ApiResponse,
        { status: 500 }
      );
    }

    const employeesList: Employee[] = Array.isArray(employees)
      ? (employees as unknown as Employee[])
      : [];

    const responsePayload: PaginatedResponse<Employee> = {
      success: true,
      data: employeesList,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
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
