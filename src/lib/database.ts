/**
 * Database Connection & Configuration
 * Handles all database operations for Dayflow HRMS
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * SQL Scripts for Database Setup
 * Run these in Supabase SQL Editor to create tables
 */

export const SQL_SETUP_SCRIPTS = `
-- 1. Create users table (Core authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE' CHECK (role IN ('ADMIN', 'EMPLOYEE')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  position VARCHAR(255),
  hire_date DATE NOT NULL,
  salary DECIMAL(12, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create leave types
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  max_days_per_year INT NOT NULL DEFAULT 0,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create leave balance
CREATE TABLE IF NOT EXISTS leave_balance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  remaining_days INT NOT NULL DEFAULT 0,
  used_days INT NOT NULL DEFAULT 0,
  year INT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, leave_type_id, year)
);

-- 7. Create leave applications
CREATE TABLE IF NOT EXISTS leave_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  total_hours DECIMAL(5, 2),
  status VARCHAR(50) DEFAULT 'PRESENT' CHECK (status IN ('PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY', 'LATE')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, attendance_date)
);

-- 9. Create payroll table
CREATE TABLE IF NOT EXISTS payroll (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month >= 1 AND month <= 12),
  year INT NOT NULL,
  base_salary DECIMAL(12, 2) NOT NULL,
  allowances DECIMAL(12, 2) DEFAULT 0,
  deductions DECIMAL(12, 2) DEFAULT 0,
  net_salary DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'APPROVED', 'PAID')),
  paid_on DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, month, year)
);

-- 10. Create salary components (allowances and deductions)
CREATE TABLE IF NOT EXISTS salary_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payroll_id UUID NOT NULL REFERENCES payroll(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ALLOWANCE', 'DEDUCTION')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create salary slips (generated documents)
CREATE TABLE IF NOT EXISTS salary_slips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payroll_id UUID NOT NULL UNIQUE REFERENCES payroll(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  pdf_url VARCHAR(500),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_leave_applications_employee_id ON leave_applications(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month_year ON payroll(month, year);

-- Insert default leave types
INSERT INTO leave_types (name, description, max_days_per_year, color) VALUES
('Paid Leave', 'Annual paid leave', 20, '#3B82F6'),
('Sick Leave', 'Medical/health-related leave', 10, '#EF4444'),
('Casual Leave', 'Casual absence from work', 5, '#F59E0B'),
('Special Leave', 'Special circumstances leave', 3, '#8B5CF6')
ON CONFLICT DO NOTHING;
`;

// Export for use in migrations
export const getDatabaseSetupScript = () => SQL_SETUP_SCRIPTS;
