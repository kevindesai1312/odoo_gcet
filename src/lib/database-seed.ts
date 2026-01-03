/**
 * Database Setup & Test Data
 * Run this to populate test data for development
 */

export const TEST_DATA = {
  // Test Departments
  departments: [
    {
      id: 'dept-001',
      name: 'Engineering',
    },
    {
      id: 'dept-002',
      name: 'Human Resources',
    },
    {
      id: 'dept-003',
      name: 'Sales',
    },
    {
      id: 'dept-004',
      name: 'Finance',
    },
  ],

  // Test Users & Employees
  users: [
    {
      email: 'admin@dayflow.com',
      password: 'AdminPass123',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      hireDate: '2024-01-01',
    },
    {
      email: 'john.doe@dayflow.com',
      password: 'JohnPass123',
      role: 'EMPLOYEE',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567891',
      hireDate: '2024-01-15',
      departmentId: 'dept-001',
      position: 'Senior Software Engineer',
      salary: 120000,
    },
    {
      email: 'jane.smith@dayflow.com',
      password: 'JanePass123',
      role: 'EMPLOYEE',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567892',
      hireDate: '2024-01-15',
      departmentId: 'dept-002',
      position: 'HR Manager',
      salary: 100000,
    },
    {
      email: 'mike.wilson@dayflow.com',
      password: 'MikePass123',
      role: 'EMPLOYEE',
      firstName: 'Mike',
      lastName: 'Wilson',
      phone: '+1234567893',
      hireDate: '2024-02-01',
      departmentId: 'dept-003',
      position: 'Sales Executive',
      salary: 80000,
    },
    {
      email: 'sarah.brown@dayflow.com',
      password: 'SarahPass123',
      role: 'EMPLOYEE',
      firstName: 'Sarah',
      lastName: 'Brown',
      phone: '+1234567894',
      hireDate: '2024-02-01',
      departmentId: 'dept-004',
      position: 'Accountant',
      salary: 75000,
    },
  ],

  // Leave Type Setup (auto-inserted via SQL)
  leaveTypes: [
    { name: 'Paid Leave', maxDaysPerYear: 20, color: '#3B82F6' },
    { name: 'Sick Leave', maxDaysPerYear: 10, color: '#EF4444' },
    { name: 'Casual Leave', maxDaysPerYear: 5, color: '#F59E0B' },
    { name: 'Special Leave', maxDaysPerYear: 3, color: '#8B5CF6' },
  ],

  // Sample Attendance Records (for testing)
  attendanceRecords: [
    {
      employeeId: 'emp-002', // John Doe
      attendanceDate: new Date(2025, 0, 2),
      checkInTime: new Date(2025, 0, 2, 9, 0),
      checkOutTime: new Date(2025, 0, 2, 17, 30),
      status: 'PRESENT',
    },
    {
      employeeId: 'emp-002',
      attendanceDate: new Date(2025, 0, 3),
      checkInTime: new Date(2025, 0, 3, 9, 15),
      checkOutTime: new Date(2025, 0, 3, 17, 0),
      status: 'LATE',
    },
  ],

  // Sample Leave Applications (for testing)
  leaveApplications: [
    {
      employeeId: 'emp-002',
      leaveTypeId: 'leave-001', // Paid Leave
      fromDate: new Date(2025, 1, 15),
      toDate: new Date(2025, 1, 17),
      reason: 'Personal work',
      status: 'PENDING',
    },
  ],

  // Sample Payroll (for testing)
  payroll: [
    {
      employeeId: 'emp-002',
      month: 1,
      year: 2025,
      baseSalary: 120000,
      allowances: 20000,
      deductions: 25000,
      status: 'DRAFT',
    },
  ],
};

/**
 * Setup Instructions
 */
export const SETUP_INSTRUCTIONS = `
# Dayflow HRMS - Database Setup Instructions

## Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in project details
5. Wait for project initialization
6. Copy your project URL and API keys

## Step 2: Update Environment Variables
Edit .env.local with:
- NEXT_PUBLIC_SUPABASE_URL (from step 1)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (from step 1)
- SUPABASE_SERVICE_ROLE_KEY (from step 1)

## Step 3: Create Database Tables
Option A: Use Supabase Dashboard
1. Open your Supabase project
2. Go to SQL Editor
3. Click "New Query"
4. Copy and paste SQL from HRMS_SYSTEM_DESIGN.md
5. Click "Run"

Option B: Use API
Run: npm run setup:db

## Step 4: Add Test Data (Optional)
1. Go to Supabase Dashboard
2. Go to Table Editor
3. Manually insert test data OR
4. Run: npm run seed:db

## Step 5: Verify Setup
Run the app:
npm run dev

Test endpoints with curl or Postman:
- POST /api/auth/signup
- POST /api/auth/signin
- GET /api/employees (with Bearer token)

## Troubleshooting

Q: "Connection refused" error?
A: Check SUPABASE_URL is correct and Supabase service is running

Q: "Invalid API key" error?
A: Verify keys are correct and not swapped
- ANON_KEY = Public key (for client)
- SERVICE_ROLE_KEY = Secret key (for server)

Q: Tables not created?
A: Make sure you ran the SQL script or npm run setup:db

Q: Authentication not working?
A: Verify JWT_SECRET is set in .env.local

## Default Test Credentials
Email: admin@dayflow.com
Password: AdminPass123

Email: john.doe@dayflow.com
Password: JohnPass123

⚠️ Change these in production!
`;

/**
 * Database Health Check Queries
 */
export const HEALTH_CHECK_QUERIES = {
  checkUsersTable: 'SELECT COUNT(*) FROM users;',
  checkEmployeesTable: 'SELECT COUNT(*) FROM employees;',
  checkAttendanceTable: 'SELECT COUNT(*) FROM attendance;',
  checkLeaveTable: 'SELECT COUNT(*) FROM leave_applications;',
  checkPayrollTable: 'SELECT COUNT(*) FROM payroll;',
  checkAllTables: `
    SELECT 
      'users' as table_name, COUNT(*) as record_count FROM users
    UNION ALL
    SELECT 'employees', COUNT(*) FROM employees
    UNION ALL
    SELECT 'attendance', COUNT(*) FROM attendance
    UNION ALL
    SELECT 'leave_applications', COUNT(*) FROM leave_applications
    UNION ALL
    SELECT 'payroll', COUNT(*) FROM payroll;
  `,
};

/**
 * Utility function to generate test data
 */
export function generateTestAttendance(
  employeeId: string,
  days: number = 30
) {
  const records = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const checkInTime = new Date(date);
    checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));

    const checkOutTime = new Date(date);
    checkOutTime.setHours(17 + Math.floor(Math.random() * 1), Math.floor(Math.random() * 60));

    records.push({
      employeeId,
      attendanceDate: date.toISOString().split('T')[0],
      checkInTime: checkInTime.toISOString(),
      checkOutTime: checkOutTime.toISOString(),
      status: checkInTime.getHours() > 9 ? 'LATE' : 'PRESENT',
    });
  }

  return records;
}

