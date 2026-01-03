/**
 * Core Type Definitions for Dayflow HRMS
 * Comprehensive type system for all modules
 */

/**
 * User Authentication Types
 */
export type User = {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  hireDate: string;
};

/**
 * Department Types
 */
export type Department = {
  id: string;
  name: string;
  managerId?: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Employee Types
 */
export type Employee = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  hireDate: Date;
  salary?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type EmployeeProfile = Employee & {
  department?: Department;
};

export type CreateEmployeePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  hireDate: string;
  salary?: number;
};

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

/**
 * Leave Management Types
 */
export type LeaveType = {
  id: string;
  name: string;
  description?: string;
  maxDaysPerYear: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LeaveBalance = {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  remainingDays: number;
  usedDays: number;
  year: number;
  updatedAt: Date;
};

export type LeaveApplication = {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: Date;
  toDate: Date;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateLeavePayload = {
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  reason?: string;
};

export type ApproveLeavePayload = {
  leaveApplicationId: string;
  approvedBy: string;
};

export type RejectLeavePayload = {
  leaveApplicationId: string;
  rejectionReason: string;
};

/**
 * Attendance Types
 */
export type Attendance = {
  id: string;
  employeeId: string;
  attendanceDate: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  totalHours?: number;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY' | 'LATE';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AttendanceRecord = Attendance & {
  employee?: Employee;
};

export type CheckInPayload = {
  checkInTime: string;
};

export type CheckOutPayload = {
  checkOutTime: string;
};

export type MarkAttendancePayload = {
  employeeId: string;
  attendanceDate: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY' | 'LATE';
  notes?: string;
};

/**
 * Payroll Types
 */
export type PayrollRecord = {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
  paidOn?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type SalaryComponent = {
  id: string;
  payrollId: string;
  name: string;
  amount: number;
  type: 'ALLOWANCE' | 'DEDUCTION';
  createdAt: Date;
};

export type SalarySlip = {
  id: string;
  payrollId: string;
  employeeId: string;
  pdfUrl?: string;
  generatedAt: Date;
  createdAt: Date;
};

export type ProcessPayrollPayload = {
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances?: number;
  deductions?: number;
  components?: Array<{
    name: string;
    amount: number;
    type: 'ALLOWANCE' | 'DEDUCTION';
  }>;
};

/**
 * Dashboard & Analytics Types
 */
export type DashboardStats = {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  absent: number;
  pendingLeaveApprovals: number;
  pendingAttendanceReviews: number;
};

export type AttendanceStats = {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leavesDays: number;
  halfDaysDays: number;
  lateDays: number;
  presentagePercentage: number;
};

export type LeaveStats = {
  leaveTypeId: string;
  leaveTypeName: string;
  totalBalance: number;
  usedDays: number;
  remainingDays: number;
};

export type PayrollStats = {
  baseSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  month: number;
  year: number;
};

/**
 * API Response Types
 */
export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Filter & Query Types
 */
export type AttendanceFilter = {
  employeeId?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
};

export type LeaveFilter = {
  employeeId?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  fromDate?: string;
  toDate?: string;
};

export type PayrollFilter = {
  employeeId?: string;
  month?: number;
  year?: number;
  status?: 'DRAFT' | 'APPROVED' | 'PAID';
};
