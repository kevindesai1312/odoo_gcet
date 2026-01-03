/**
 * Payroll API Routes
 * GET /api/payroll - Get payroll records
 * POST /api/payroll/process - Process payroll (admin)
 * GET /api/payroll/salary-slip - Get salary slip
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import type { ApiResponse, PayrollRecord } from '@/lib/types-new';

/**
 * GET /api/payroll
 * Get payroll records
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
    const month = url.searchParams.get('month');
    const year = url.searchParams.get('year');

    // Get user's employee record
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    let query = supabase
      .from('payroll')
      .select(`
      *,
      employees(id, first_name, last_name)
    `);

    // If not admin, only return own payroll
    if (user?.role !== 'ADMIN') {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', decoded.userId)
        .single();

      if (employee) {
        query = query.eq('employee_id', employee.id);
      }
    } else if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    if (month) {
      query = query.eq('month', parseInt(month));
    }

    if (year) {
      query = query.eq('year', parseInt(year));
    }

    const { data: payroll, error } = await query.order('year', {
      ascending: false,
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch payroll records',
          error: error.message,
        } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payroll records retrieved successfully',
        data: payroll || [],
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Get payroll error:', error);

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
 * POST /api/payroll/process
 * Process payroll (admin only)
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
          error: 'Only admins can process payroll',
        } as ApiResponse,
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      employeeId,
      month,
      year,
      baseSalary,
      allowances = 0,
      deductions = 0,
      components = [],
    } = body;

    if (!employeeId || !month || !year || !baseSalary) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          error: 'employeeId, month, year, and baseSalary are required',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if payroll already exists for this month
    const { data: existingPayroll } = await supabase
      .from('payroll')
      .select('id')
      .eq('employee_id', employeeId)
      .eq('month', month)
      .eq('year', year)
      .single();

    if (existingPayroll) {
      return NextResponse.json(
        {
          success: false,
          message: 'Payroll already exists',
          error: 'Payroll for this month has already been processed',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Calculate net salary
    const netSalary = baseSalary + allowances - deductions;

    // Create payroll record
    const { data: newPayroll, error: payrollError } = await supabase
      .from('payroll')
      .insert({
        employee_id: employeeId,
        month,
        year,
        base_salary: baseSalary,
        allowances,
        deductions,
        net_salary: netSalary,
        status: 'DRAFT',
      })
      .select()
      .single();

    if (payrollError || !newPayroll) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to process payroll',
          error: payrollError?.message || 'Unknown error',
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Add salary components if provided
    if (components.length > 0) {
      const componentRows = components.map((comp: any) => ({
        payroll_id: newPayroll.id,
        name: comp.name,
        amount: comp.amount,
        type: comp.type,
      }));

      const { error: componentError } = await supabase
        .from('salary_components')
        .insert(componentRows);

      if (componentError) {
        console.error('Failed to add salary components:', componentError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payroll processed successfully',
        data: newPayroll,
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error('Process payroll error:', error);

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
