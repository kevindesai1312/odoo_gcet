# Dayflow HRMS - System Documentation

## Overview
**Dayflow** is a Human Resource Management System that digitizes and streamlines HR operations including authentication, employee management, attendance tracking, leave management, and payroll visibility with role-based access control.

---

## 1. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Frontend)                 │
│              Next.js 15 + React 19 + TypeScript              │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  Admin Dashboard │      │ Employee Portal  │            │
│  │  - Analytics     │      │ - Check-in/Out   │            │
│  │  - Approvals     │      │ - Leave Apply    │            │
│  │  - Management    │      │ - View Profile   │            │
│  └──────────────────┘      └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   API LAYER (Backend)                        │
│              Node.js + Next.js Route Handlers               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Routes  │  │ Employee API │  │ Attendance   │     │
│  │ Leave Routes │  │ Payroll API  │  │ Leave Routes │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 AUTHENTICATION & SECURITY                    │
│              JWT (JSON Web Tokens) + Middleware             │
│  - Token Verification     - Role-Based Access Control       │
│  - Secure Password Hashing (bcryptjs)                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │Employees │  │Attendance│  │  Leaves  │   │
│  │ Table    │  │ Table    │  │ Table    │  │ Table    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Payroll  │  │Audit Log │  │Settings  │               │
│  │ Table    │  │ Table    │  │ Table    │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Components Explained

**Frontend Layer**
- **Technology**: Next.js 15 with React 19 and TypeScript
- **Purpose**: Displays user interface and handles user interactions
- **Separated Dashboards**: Admin dashboard for management, Employee portal for personal actions

**API Layer (Backend)**
- **Technology**: Node.js with Next.js API routes
- **Purpose**: Processes requests, validates data, manages business logic
- **Routes**: Authentication, Employee management, Attendance, Leave, Payroll

**Authentication & Security**
- **JWT Tokens**: Secure token-based authentication (stored in auth-token cookies)
- **Password Security**: Bcryptjs for secure password hashing
- **Middleware**: Validates every request to ensure user is authorized

**Database Layer**
- **Technology**: MongoDB (NoSQL database)
- **Purpose**: Stores all system data persistently
- **Collections**: Users, Employees, Attendance, Leave Applications, Payroll, Audit Logs

---

## 2. Module Breakdown

### A. Authentication Module

**Purpose**: Securely manage user login, signup, and account verification

**Key Functions**:
- User registration (Sign Up)
- Email verification
- Secure login (Sign In)
- Password hashing and validation
- JWT token generation and verification
- Session management
- Logout functionality

**User Flow**:
1. User visits login page
2. Enters email and password
3. System validates credentials against database
4. If valid → generates JWT token → redirects to dashboard
5. If invalid → shows error message

**Database Involvement**:
- **Users Table**: Stores email, hashed password, role, verification status
- **Tokens**: JWT tokens stored in browser cookies with expiration time

**Security Features**:
- Passwords never stored in plain text (hashed with bcryptjs)
- Tokens expire automatically
- Email verification prevents unauthorized accounts
- Middleware validates every request

---

### B. Employee Management Module

**Purpose**: Manage employee information and profiles

**Key Functions**:
- Create/Add new employees
- Update employee information
- View employee directory (Admin only)
- Employee profile management
- Deactivate/Activate employees
- Department and position management

**Admin Capabilities**:
- Add new employees to the system
- Update salary, position, department
- View all employee records
- Search and filter employees
- Bulk operations (if needed)

**Employee Capabilities**:
- View own profile
- Update personal information
- Change password
- View profile completion status

**Database Involvement**:
- **Employees Table**: Stores employee ID, name, email, position, department, salary, status, etc.
- **Audit Log**: Tracks all changes made to employee records

**Example Data Structure**:
```
Employee Record:
{
  _id: "employee_123"
  first_name: "John"
  last_name: "Doe"
  email: "john.doe@company.com"
  position: "Software Engineer"
  department: "IT"
  salary: 50000
  is_active: true
  created_at: "2024-01-15"
  user_id: "user_789"
}
```

---

### C. Attendance Module

**Purpose**: Track daily attendance and check-in/check-out times

**Key Functions**:
- Check-in (Employee logs arrival)
- Check-out (Employee logs departure)
- View daily attendance
- View weekly attendance
- View monthly reports (Admin)
- Attendance analytics and statistics

**Employee Actions**:
1. Clicks "Check-In" button on arrival
2. System records time and location (if applicable)
3. Throughout day, employee is marked as "Present"
4. Clicks "Check-Out" button when leaving
5. System calculates working hours

**Admin Capabilities**:
- View all employee attendance records
- See who is present/absent today
- Generate attendance reports
- Mark absent employees
- View attendance trends

**Attendance Status Types**:
- **Present**: Employee checked in and out
- **Absent**: Employee did not check in
- **Late**: Employee checked in after specified time
- **Half Day**: Employee left early
- **On Leave**: Employee has approved leave

**Database Involvement**:
- **Attendance Table**: Records check-in time, check-out time, date, status, employee ID
- **Analytics**: Calculated from attendance records

**Example Entry**:
```
Attendance Record:
{
  _id: "attendance_456"
  employee_id: "employee_123"
  date: "2024-01-20"
  check_in_time: "09:00 AM"
  check_out_time: "05:30 PM"
  working_hours: 8.5
  status: "Present"
  notes: ""
}
```

---

### D. Leave Management Module

**Purpose**: Manage employee leave requests and approvals

**Key Functions**:
- Apply for leave
- View leave balance
- Approve/Reject leave requests (Admin)
- View leave history
- Calculate remaining leaves
- Set leave policies (Admin)

**Leave Types**:
- **Sick Leave**: Due to illness
- **Casual Leave**: General time off
- **Earned Leave**: Annual vacation days
- **Maternity/Paternity Leave**: Special circumstances
- **Unpaid Leave**: Without pay

**Employee Workflow**:
1. Employee clicks "Apply for Leave"
2. Selects leave type and dates
3. Adds reason/notes
4. Submits request
5. Request goes to admin for approval
6. Admin approves/rejects
7. Employee notified of decision
8. If approved, dates marked as "On Leave" in attendance

**Admin Workflow**:
1. Views pending leave requests
2. Checks employee's leave balance
3. Reviews reason and dates
4. Approves or rejects request
5. Provides feedback if rejected
6. System updates attendance records

**Leave Balance**:
- Each employee starts with allocated leaves per year
- Approved leaves are deducted from balance
- Rejected leaves don't affect balance
- Admin can manually adjust balance

**Database Involvement**:
- **Leave Applications**: Request details, status, dates, approval status
- **Leave Policies**: Company-wide leave allocation rules
- **Audit Log**: All approval actions tracked

**Example Request**:
```
Leave Application:
{
  _id: "leave_789"
  employee_id: "employee_123"
  leave_type: "Earned Leave"
  start_date: "2024-02-10"
  end_date: "2024-02-15"
  total_days: 6
  reason: "Family vacation"
  status: "Pending"
  applied_on: "2024-01-25"
  approved_by: "admin_123"
  approved_on: "2024-01-26"
}
```

---

### E. Payroll Module

**Purpose**: Manage and display salary information and payroll records

**Key Functions**:
- View salary details (Employees)
- Generate salary slips
- Manage payroll cycles (Admin)
- Calculate deductions
- View payment history
- Payroll analytics (Admin)

**Employee View**:
- View monthly salary
- Download salary slips
- View deductions and benefits
- Check payment history
- View tax information

**Admin Capabilities**:
- Create and manage payroll records
- Calculate salary based on attendance
- Apply deductions and bonuses
- Generate payroll reports
- Process salary payments
- View payroll analytics

**Salary Calculation**:
```
Gross Salary = Basic Salary + Allowances
               (HRA, DA, Medical, etc.)

Deductions = Income Tax + PF + Insurance
             + Other mandatory deductions

Net Salary = Gross Salary - Deductions
```

**Database Involvement**:
- **Payroll Table**: Monthly salary records, deductions, bonuses
- **Salary Templates**: Standard salary structure for employees
- **Payment Records**: Payment history and status

**Example Payroll Record**:
```
Payroll Record:
{
  _id: "payroll_123"
  employee_id: "employee_123"
  pay_period_start: "2024-01-01"
  pay_period_end: "2024-01-31"
  basic_salary: 40000
  hra: 5000
  dearness_allowance: 3000
  gross_salary: 48000
  income_tax: 4800
  pf_contribution: 2400
  net_salary: 40800
  payment_status: "Paid"
  payment_date: "2024-02-05"
}
```

---

### F. Admin Dashboard

**Purpose**: Central hub for HR management and decision-making

**Dashboard Components**:

1. **Overview/Analytics**
   - Total employees
   - Present today
   - On leave today
   - Pending approvals

2. **Pending Approvals**
   - Leave requests awaiting approval
   - Attendance disputes
   - Document submissions

3. **Employee Directory**
   - List of all employees
   - Search and filter options
   - Quick employee info access
   - Add/Edit employee forms

4. **Reports and Analytics**
   - Attendance trends
   - Leave analysis
   - Payroll reports
   - Department-wise statistics

5. **Settings**
   - Leave policies
   - Attendance rules
   - Holiday calendar
   - User management

**Quick Actions Available**:
- Approve/Reject leaves
- Mark attendance
- Generate reports
- Add new employee
- View salary information

---

## 3. User Flows

### A. Employee User Flow

```
START
  │
  ├─→ [Visit Dayflow Website]
  │
  ├─→ [No Account?] ──→ [Sign Up]
  │                        │
  │                        ├─→ [Enter Email & Password]
  │                        │
  │                        ├─→ [Verify Email]
  │                        │
  │                        └─→ [Account Created] ──┐
  │                                                  │
  │   [Have Account?] ──→ [Sign In] ────────────────┤
  │                        │                         │
  │                        ├─→ [Enter Credentials]   │
  │                        │                         │
  │                        └─→ [Authenticate] ──────┤
  │                                                  │
  ├──────────────────────────────────────────────────┘
  │
  ├─→ [Employee Dashboard]
  │    │
  │    ├─→ [Quick Actions Available]
  │    │    ├─ Check In
  │    │    ├─ Check Out
  │    │    ├─ Apply Leave
  │    │    ├─ View Profile
  │    │    └─ View Salary
  │    │
  │    ├─→ [Check In/Out]
  │    │    └─→ System records time ──→ [Attendance Updated]
  │    │
  │    ├─→ [Apply for Leave]
  │    │    ├─→ [Select Leave Type]
  │    │    ├─→ [Choose Dates]
  │    │    ├─→ [Add Notes]
  │    │    └─→ [Submit] ──→ [Waiting for Approval]
  │    │
  │    ├─→ [View My Attendance]
  │    │    └─→ [See Check-in/out times, Working hours]
  │    │
  │    ├─→ [View My Profile]
  │    │    ├─→ [See Personal Information]
  │    │    └─→ [Update Profile] (if allowed)
  │    │
  │    ├─→ [View Salary/Payroll]
  │    │    ├─→ [See Monthly Salary]
  │    │    ├─→ [Download Salary Slip]
  │    │    └─→ [View Payment History]
  │    │
  │    └─→ [Logout]
  │         └─→ [Session Ended] ──→ [Redirected to Login]
  │
END
```

### B. Admin/HR Officer User Flow

```
START
  │
  ├─→ [HR Officer Login]
  │    ├─→ [Enter Email & Password]
  │    └─→ [Authenticate with HR Credentials]
  │
  ├─→ [Admin Dashboard]
  │    │
  │    ├─→ [Overview/Analytics]
  │    │    ├─ Total Employees: 150
  │    │    ├─ Present Today: 145
  │    │    ├─ On Leave Today: 5
  │    │    └─ Pending Approvals: 8
  │    │
  │    ├─→ [Approval Workflows]
  │    │    ├─→ [View Pending Leave Requests]
  │    │    │    ├─→ [Review Request Details]
  │    │    │    │    ├─ Employee Name
  │    │    │    │    ├─ Leave Type
  │    │    │    │    ├─ Dates
  │    │    │    │    ├─ Remaining Balance
  │    │    │    │    └─ Reason
  │    │    │    │
  │    │    │    ├─→ [Approve Leave]
  │    │    │    │    └─→ [Send Notification to Employee]
  │    │    │    │
  │    │    │    └─→ [Reject Leave]
  │    │    │         ├─→ [Add Reason for Rejection]
  │    │    │         └─→ [Send Notification to Employee]
  │    │    │
  │    │    ├─→ [Manage Attendance Disputes]
  │    │    │    └─→ [Mark attendance manually if needed]
  │    │    │
  │    │    └─→ [Other Pending Tasks]
  │    │
  │    ├─→ [Employee Management]
  │    │    ├─→ [View Employee Directory]
  │    │    │    ├─ Search employees
  │    │    │    ├─ Filter by department
  │    │    │    └─ View employee details
  │    │    │
  │    │    ├─→ [Add New Employee]
  │    │    │    ├─→ [Enter Employee Details]
  │    │    │    │    ├─ Name, Email, Position
  │    │    │    │    ├─ Department, Salary
  │    │    │    │    └─ Role Assignment
  │    │    │    │
  │    │    │    └─→ [Employee Added to System]
  │    │    │
  │    │    ├─→ [Edit Employee Information]
  │    │    │    ├─→ [Update Details]
  │    │    │    └─→ [Save Changes]
  │    │    │
  │    │    └─→ [Deactivate Employee]
  │    │         └─→ [Confirm Action]
  │    │
  │    ├─→ [Attendance Management]
  │    │    ├─→ [View All Attendance Records]
  │    │    │    ├─ Daily/Weekly/Monthly view
  │    │    │    ├─ Filter by employee/department
  │    │    │    └─ Export reports
  │    │    │
  │    │    ├─→ [Mark Attendance Manually]
  │    │    │    ├─ For employees who forgot to check in
  │    │    │    └─ Add reason/notes
  │    │    │
  │    │    └─→ [View Attendance Analytics]
  │    │         ├─ Punctuality trends
  │    │         └─ Absence patterns
  │    │
  │    ├─→ [Leave Management]
  │    │    ├─→ [View All Leave Requests]
  │    │    │    ├─ Pending, Approved, Rejected
  │    │    │    └─ Filter by employee/type
  │    │    │
  │    │    ├─→ [Set Leave Policies]
  │    │    │    ├─ Annual leave allocation
  │    │    │    ├─ Leave year start date
  │    │    │    └─ Leave types available
  │    │    │
  │    │    └─→ [Generate Leave Reports]
  │    │         └─ Employee leave utilization
  │    │
  │    ├─→ [Payroll Management]
  │    │    ├─→ [View Payroll Records]
  │    │    │    ├─ Monthly payroll summary
  │    │    │    ├─ Individual salary details
  │    │    │    └─ Payment status
  │    │    │
  │    │    ├─→ [Create/Edit Payroll]
  │    │    │    ├─ Set salary structure
  │    │    │    ├─ Apply deductions
  │    │    │    └─ Process salary
  │    │    │
  │    │    ├─→ [Generate Salary Slips]
  │    │    │    └─ Individual or bulk
  │    │    │
  │    │    └─→ [View Payroll Analytics]
  │    │         ├─ Salary trends
  │    │         └─ Cost analysis
  │    │
  │    ├─→ [Reports & Analytics]
  │    │    ├─→ [Attendance Report]
  │    │    ├─→ [Leave Report]
  │    │    ├─→ [Payroll Report]
  │    │    └─→ [Custom Reports]
  │    │
  │    ├─→ [Settings]
  │    │    ├─ Configure system
  │    │    ├─ Manage leave policies
  │    │    └─ Set holidays
  │    │
  │    └─→ [Logout]
  │         └─→ [Session Ended]
  │
END
```

---

## 4. Simple Flowcharts (Text-Based)

### A. Leave Approval Process

```
EMPLOYEE INITIATES LEAVE REQUEST
             │
             ↓
    ┌────────────────────┐
    │ Fill Leave Details │
    │ - Type             │
    │ - Start Date       │
    │ - End Date         │
    │ - Reason           │
    └────────────────────┘
             │
             ↓
    ┌────────────────────┐
    │   Submit Request   │
    └────────────────────┘
             │
             ↓
    System validates:
    ├─ Leave balance sufficient?
    ├─ Dates conflict with existing leaves?
    └─ All required fields filled?
             │
       ┌─────┴─────┐
       │           │
      YES          NO
       │           │
       ↓           ↓
    Move to    Show Error
    Approval   Message
       │        Return to
       │        Form
       ↓
    ┌────────────────────┐
    │  PENDING STATE     │
    │  Awaiting Admin    │
    │  Approval          │
    └────────────────────┘
             │
      (ADMIN REVIEWS REQUEST)
             │
       ┌─────┴──────┐
       │            │
    APPROVE      REJECT
       │            │
       ↓            ↓
    Leaves      Leave Balance
    Deducted    Unchanged
       │            │
       │            ├─→ [Notify Employee]
       │            │   [Reason: Not Enough Balance]
       │            │
       ├────────────┴────────┐
       ↓                     ↓
    Mark Date          Employee Sees
    As "On Leave"      Status: REJECTED
       │
       ↓
    Notify Employee
    Status: APPROVED
       │
       ↓
    Attendance Shows
    "On Leave" for
    Selected Dates
       │
       ↓
    PROCESS COMPLETE
```

### B. Attendance Tracking Process

```
EMPLOYEE ARRIVES AT OFFICE
             │
             ↓
    ┌────────────────────┐
    │  Opens Dashboard   │
    │  Clicks "Check-In" │
    └────────────────────┘
             │
             ↓
    ┌────────────────────┐
    │ System Records:    │
    │ - Current Time     │
    │ - Employee ID      │
    │ - Date             │
    │ - Location (opt)   │
    └────────────────────┘
             │
             ↓
    Check Current Time:
    ├─ Before 10:00 AM → "On Time"
    ├─ 10:00 AM - 12:00 PM → "Late"
    └─ After 12:00 PM → "Very Late"
             │
             ↓
    ┌────────────────────┐
    │   Status: Present  │
    │   Check-In Time    │
    │   Recorded         │
    └────────────────────┘
             │
             ↓
    DURING WORK DAY
    Employee completes tasks
             │
             ↓
    EMPLOYEE LEAVES OFFICE
             │
             ↓
    ┌────────────────────┐
    │  Opens Dashboard   │
    │  Clicks "Check-Out"│
    └────────────────────┘
             │
             ↓
    ┌────────────────────┐
    │ System Records:    │
    │ - Check-Out Time   │
    │ - Calculates Hours │
    │ - Marks Complete   │
    └────────────────────┘
             │
             ↓
    CALCULATE WORKING HOURS
    Example:
    Check-In: 09:00 AM
    Check-Out: 05:30 PM
    Working Hours: 8.5 hours
             │
             ↓
    ┌────────────────────┐
    │   Record Complete  │
    │   Status: Present  │
    │   Hours: 8.5       │
    └────────────────────┘
             │
             ↓
    ADMIN CAN VIEW:
    ├─ All attendance records
    ├─ Who was present/absent
    ├─ Working hours
    └─ Generate reports
             │
             ↓
    PROCESS COMPLETE
```

### C. Employee Check-in/Check-out Sequence

```
┌─────────────────────────────────────────────────────────┐
│          DAILY ATTENDANCE WORKFLOW                       │
└─────────────────────────────────────────────────────────┘

MORNING
───────
Time: 9:00 AM
Event: Employee arrives
Action: Click "Check In"
    │
    ├─→ System records:
    │   • Date: 2024-01-20
    │   • Check-in Time: 09:00 AM
    │   • Status: On Time
    │
    └─→ Dashboard shows:
        ✓ You checked in at 09:00 AM

AFTERNOON (Optional)
───────────────────
Time: 1:00 PM
Event: Lunch break
Action: Click "Mark Break" (optional)
    │
    └─→ System records break time

EVENING
──────
Time: 5:30 PM
Event: Employee leaves office
Action: Click "Check Out"
    │
    ├─→ System records:
    │   • Check-out Time: 17:30 (5:30 PM)
    │   • Total Hours: 8.5
    │   • Status: Complete
    │
    └─→ Dashboard shows:
        ✓ You checked out at 5:30 PM
        ✓ Working Hours: 8.5 hours

ADMIN VERIFICATION
─────────────────
Next Morning: Admin reviews:
├─ All check-ins/check-outs
├─ Total working hours
├─ Can mark absent if not checked in
└─ Can add notes for irregularities
```

---

## 5. Detailed Module Features

### Authentication Module - Key Features
- **Secure Login**: Email + Password authentication
- **Email Verification**: Confirms user email before account activation
- **Password Recovery**: Reset password via email
- **Session Management**: Automatic logout after inactivity
- **Role Assignment**: Admin or Employee role on signup
- **Security**: JWT tokens + bcrypt password hashing

### Employee Management Module - Operations
- **Create**: Add new employees with all details
- **Read**: View employee information (directory access)
- **Update**: Modify employee information (name, position, salary, etc.)
- **Delete**: Deactivate employee accounts
- **Search**: Find employees by name, department, position
- **Bulk Operations**: Add multiple employees at once

### Attendance Module - Tracking Methods
- **Real-time Tracking**: Automatic check-in/out timestamp
- **Manual Marking**: Admin can manually mark attendance
- **Status Categories**: Present, Absent, Late, Half Day, On Leave
- **Daily Reports**: View who checked in/out today
- **Weekly/Monthly Reports**: Attendance trends over time
- **Analytics**: Punctuality metrics, absent day patterns

### Leave Module - Request Management
- **Request Submission**: Employee submits leave request with dates
- **Approval Workflow**: Admin reviews and approves/rejects
- **Balance Tracking**: Maintains leave balance per employee
- **Notifications**: Automatic email notifications on approval/rejection
- **History**: Complete record of all leave requests
- **Policy Management**: Set company-wide leave rules

### Payroll Module - Salary Management
- **Salary Structure**: Define basic, allowances, deductions
- **Monthly Processing**: Calculate salary based on attendance
- **Salary Slip Generation**: Generate and send salary slips to employees
- **Deduction Management**: Apply tax, insurance, PF deductions
- **Bonus/Incentives**: Add performance bonuses
- **Payment Records**: Track payment dates and methods
- **Reports**: Payroll analytics and trends

---

## 6. Test Credentials

### Admin/HR Officer Account
```
Email:    nextin@gmail.com
Password: Nextin@123
Role:     Admin / HR Officer
Access:   Full system access for approvals and management
```

**What Admin Can Do**:
- Approve/reject leave requests
- Manage employee directory
- View all attendance records
- Process payroll
- Generate reports
- Configure system settings

### Employee Account
```
Email:    test@gmail.com
Password: test@123
Role:     Employee
Access:   Limited to personal actions
```

**What Employee Can Do**:
- Check in/out
- Apply for leave
- View own attendance
- View own profile
- View own salary
- Download salary slips

---

## 7. Data Model (Database Collections)

### Users Collection
```
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String (ADMIN/EMPLOYEE),
  is_verified: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Employees Collection
```
{
  _id: ObjectId,
  user_id: ObjectId (Reference to Users),
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  position: String,
  department: String,
  salary: Number,
  joining_date: Date,
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Attendance Collection
```
{
  _id: ObjectId,
  employee_id: ObjectId (Reference to Employees),
  date: Date,
  check_in_time: String,
  check_out_time: String,
  working_hours: Number,
  status: String (Present/Absent/Late/Half Day/On Leave),
  notes: String,
  created_at: Date,
  updated_at: Date
}
```

### Leave Applications Collection
```
{
  _id: ObjectId,
  employee_id: ObjectId (Reference to Employees),
  leave_type: String (Sick/Casual/Earned/Maternity/Unpaid),
  start_date: Date,
  end_date: Date,
  total_days: Number,
  reason: String,
  status: String (Pending/Approved/Rejected),
  applied_on: Date,
  approved_by: ObjectId (Reference to Admin),
  approved_on: Date,
  rejection_reason: String,
  created_at: Date,
  updated_at: Date
}
```

### Payroll Collection
```
{
  _id: ObjectId,
  employee_id: ObjectId (Reference to Employees),
  pay_period_start: Date,
  pay_period_end: Date,
  basic_salary: Number,
  allowances: {
    hra: Number,
    dearness_allowance: Number,
    medical: Number
  },
  gross_salary: Number,
  deductions: {
    income_tax: Number,
    pf: Number,
    insurance: Number
  },
  net_salary: Number,
  payment_status: String (Pending/Paid),
  payment_date: Date,
  created_at: Date,
  updated_at: Date
}
```

---

## 8. Security Measures

### Authentication Security
- ✅ Passwords hashed with bcryptjs (not stored in plain text)
- ✅ JWT tokens with expiration
- ✅ Email verification before account activation
- ✅ Secure password recovery process
- ✅ Session timeout after inactivity

### Data Protection
- ✅ Role-based access control (Admin vs Employee)
- ✅ Employees can only view their own data
- ✅ Admins can view all data
- ✅ Audit logs track all changes
- ✅ Data validation on all inputs

### API Security
- ✅ JWT middleware validates every request
- ✅ CORS protection
- ✅ Input sanitization
- ✅ Rate limiting for login attempts
- ✅ Secure cookies (HttpOnly, SameSite)

---

## 9. Future Enhancements

### Phase 2 Features
1. **Mobile Application**
   - React Native/Flutter app for iOS and Android
   - Push notifications for approvals
   - QR code check-in/out
   - Offline attendance support

2. **Advanced Analytics**
   - Predictive analytics for leave patterns
   - Department-wise performance metrics
   - Employee productivity dashboard
   - Salary trend analysis

3. **Integration Features**
   - Google/Microsoft Calendar integration
   - Email notifications with Gmail/Outlook
   - Slack notifications
   - Third-party HR tools integration

4. **Biometric Integration**
   - Fingerprint attendance
   - Face recognition check-in
   - Geolocation tracking
   - Time-based location verification

### Phase 3 Features
5. **Performance Management**
   - Performance review system
   - Goal tracking
   - 360-degree feedback
   - Rating and evaluation

6. **Training & Development**
   - Training module assignment
   - Certification tracking
   - Skills development plans
   - Learning management system

7. **Recruitment Module**
   - Job posting
   - Application tracking
   - Interview scheduling
   - Offer management

8. **Employee Self-Service**
   - Leave encashment
   - Loan applications
   - Claims management
   - Policy documentation

### Phase 4 Features
9. **Advanced Compliance**
   - Compliance dashboard
   - Legal reporting
   - Labor law compliance checker
   - Audit trail visualization

10. **Financial Integrations**
    - Bank API integration for auto-salary disbursement
    - PF fund management
    - Tax calculation automation
    - GST compliance

---

## 10. System Benefits

### For Employees
- ✅ Easy check-in/check-out process
- ✅ Online leave application
- ✅ Transparent salary information
- ✅ Real-time approval status
- ✅ Access to attendance history
- ✅ Mobile accessibility (future)

### For HR/Admins
- ✅ Centralized employee database
- ✅ Automated leave approvals
- ✅ Attendance tracking simplified
- ✅ Payroll processing efficiency
- ✅ Data-driven insights
- ✅ Audit trail for compliance
- ✅ Time-saving reporting

### For Organization
- ✅ Reduced manual paperwork
- ✅ Better workforce planning
- ✅ Improved attendance accuracy
- ✅ Cost control through better visibility
- ✅ Compliance with labor laws
- ✅ Data-driven decision making
- ✅ Employee satisfaction improvement

---

## 11. Technical Stack Summary

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Backend** | Node.js, Next.js API Routes |
| **Database** | MongoDB |
| **Authentication** | JWT, bcryptjs |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Hosting** | Azure (future), Cloud-ready |
| **API Documentation** | RESTful APIs |

---

## 12. Getting Started Guide

### For New Users

**Step 1: Access the System**
- Go to Dayflow website
- You'll see login page

**Step 2: Create Account (Employees)**
- Click "Sign Up"
- Enter email and password
- Verify email
- Account created

**Step 3: Login**
- Enter email and password
- Click "Sign In"
- Redirected to dashboard

**Step 4: Perform Actions**
- For Check-in: Click "Check In" button
- For Leave: Go to "Leave" section → "Apply New"
- For Profile: Click "My Profile"
- For Salary: Go to "Payroll" section

### For Admin Users

**Step 1: Login**
- Use admin credentials
- Redirected to admin dashboard

**Step 2: Approve Pending Requests**
- Go to "Approvals" section
- Review leave requests
- Click Approve/Reject

**Step 3: Manage Employees**
- Go to "Employees" section
- View employee list
- Add/Edit employee information

**Step 4: View Reports**
- Go to "Reports" section
- Select report type
- View or export data

---

## 13. Support & Documentation

For questions or issues:
- Contact HR: nextin@gmail.com
- System Administrator: Contact IT team
- Documentation: Refer to in-app help sections

---

**Last Updated**: January 2026
**System Version**: 1.0.0 (MVP)
**Status**: Production Ready

---

**End of Documentation**
