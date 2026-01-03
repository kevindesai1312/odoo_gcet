export type Employee = {
  id: string
  user_id: string
  employee_id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  profile_picture: string | null
  department: string | null
  position: string | null
  hire_date: string | null
  employment_type: string | null
  manager_name: string | null
  salary: number | null
  salary_currency: string | null
  pay_frequency: string | null
  benefits: string | null
  documents: any[] | null
  is_active: boolean
  role: 'employee' | 'admin' | 'hr'
  status: 'active' | 'inactive' | 'terminated'
  created_at: string
  updated_at: string
}

export type Attendance = {
  id: string
  employee_id: string
  date: string
  check_in: string | null
  check_out: string | null
  status: 'present' | 'absent' | 'half-day' | 'leave'
  notes: string | null
  created_at: string
}

export type LeaveRequest = {
  id: string
  employee_id: string
  leave_type: 'paid' | 'sick' | 'unpaid'
  start_date: string
  end_date: string
  remarks: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_comment: string | null
  approved_by: string | null
  created_at: string
  updated_at: string
}

export type Payroll = {
  id: string
  employee_id: string
  basic_salary: number
  allowances: number
  deductions: number
  net_salary: number
  pay_period_start: string
  pay_period_end: string
  payment_date: string | null
  status: 'pending' | 'processed' | 'paid'
  created_at: string
}
