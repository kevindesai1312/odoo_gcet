# 📊 Dayflow HRMS - Complete System Guide

## Overview
**Dayflow** is a web-based Human Resource Management System that helps companies manage their employees digitally. It handles authentication, employee information, attendance tracking, leave management, and payroll—all from one place.

---

# 🏗️ PART 1: SYSTEM ARCHITECTURE

## What is Architecture?
Architecture is the overall design of how different parts of the system work together. Think of it like a building blueprint.

## High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      🌐 FRONTEND (Website/App)                    │
│                  Next.js + React + TypeScript                     │
│  ┌────────────────────┬────────────────────┐                     │
│  │  Admin Dashboard   │  Employee Portal   │                     │
│  │  • Approve Leaves  │  • View Profile    │                     │
│  │  • Check Reports   │  • Apply for Leave │                     │
│  │  • Manage Employees│  • Check In/Out    │                     │
│  │  • View Analytics  │  • View Salary     │                     │
│  └────────────────────┴────────────────────┘                     │
└──────────────────────────────────┬───────────────────────────────┘
                                   │ (Internet Connection)
┌──────────────────────────────────▼───────────────────────────────┐
│                     🔒 AUTHENTICATION LAYER                        │
│            JWT Tokens + Password Encryption (bcryptjs)           │
│  - Checks if user is valid  - Gives permission levels           │
│  - Keeps user logged in     - Protects passwords                │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
┌──────────────────────────────────▼───────────────────────────────┐
│                     📡 API (Backend Server)                        │
│                Node.js + Next.js API Routes                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Auth API │  │Employee  │  │Attendance│  │ Leave    │        │
│  │  Routes  │  │  API     │  │  API     │  │  API     │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Payroll  │  │Dashboard │  │Analytics │                      │
│  │  Routes  │  │  Routes  │  │ Routes   │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
┌──────────────────────────────────▼───────────────────────────────┐
│                    💾 DATABASE (MongoDB)                           │
│          Stores all information (like a digital filing cabinet)   │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Users     │  │Employees │  │Attendance│  │ Leaves   │       │
│  │ (Login    │  │ (Info,   │  │ (Daily   │  │(Requests,│       │
│  │  Accounts)│  │ salary,  │  │ check-in)│  │approvals)│       │
│  └───────────┘  └──────────┘  └──────────┘  └──────────┘       │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ Payroll   │  │Approvals │  │Audit Log │                     │
│  │(Salary    │  │(Who      │  │(Activity │                     │
│  │ records)  │  │approved?)│  │ history) │                     │
│  └───────────┘  └──────────┘  └──────────┘                     │
└──────────────────────────────────────────────────────────────────┘
```

## Component Explanation (Simple Words)

### 1️⃣ **Frontend (What Users See)**
- **What**: The website or app that employees and admins use
- **Technology**: Built with Next.js (a JavaScript framework)
- **Two Separate Views**:
  - **Admin Dashboard**: For managers to approve requests, see reports
  - **Employee Portal**: For workers to view their info, apply for leave

### 2️⃣ **Authentication Layer (Security Gate)**
- **What**: Ensures only valid users can access the system
- **How It Works**:
  - User enters email and password
  - System checks if credentials are correct
  - Generates a secure token (JWT) if valid
  - User stays logged in using this token
- **Security Features**:
  - Passwords are hashed (encrypted) before storing
  - Tokens expire after a certain time
  - Every action is verified for user permission

### 3️⃣ **API (Backend Server)**
- **What**: The "brain" of the system that processes all requests
- **Technology**: Node.js with Next.js
- **What It Does**:
  - Receives requests from frontend
  - Validates data (is it correct format?)
  - Processes business logic (apply rules, calculations)
  - Sends response back to frontend
  - Communicates with database

### 4️⃣ **Database (MongoDB)**
- **What**: Digital filing cabinet that stores all data
- **Type**: NoSQL (stores data as documents, not tables)
- **What It Stores**:
  - User login credentials
  - Employee information
  - Daily attendance records
  - Leave applications
  - Salary information
  - Approval records
  - Activity logs

---

# 📦 PART 2: MODULE BREAKDOWN

## What is a Module?
A module is a section of the system that handles one specific job. Like how a factory has different departments, each module has a specific purpose.

---

## 📌 MODULE 1: AUTHENTICATION MODULE

### Purpose
Allow users to securely create accounts, log in, and log out.

### Key Features

| Feature | Description |
|---------|-------------|
| **Sign Up** | New user creates account with email and password |
| **Email Verification** | System sends verification email to confirm email is real |
| **Sign In** | User logs in with email and password |
| **Password Hashing** | Passwords are encrypted before storing in database |
| **JWT Tokens** | Secure tokens keep users logged in (like session tickets) |
| **Role Assignment** | User gets assigned as Admin or Employee |
| **Session Management** | System remembers who is logged in |
| **Logout** | User can safely exit the system |

### How It Works (Step by Step)

```
NEW USER SIGNUP FLOW:
1. User clicks "Sign Up" button
2. Enters email and password
3. System checks if email already exists
4. If new → Creates user account → Hashes password → Stores in DB
5. Sends verification email to user
6. User clicks email link → Email verified
7. Account activated → User can now login

EXISTING USER LOGIN FLOW:
1. User clicks "Sign In" button
2. Enters email and password
3. System retrieves user from database
4. Compares entered password with stored password
5. If match → Generates JWT token → Sets secure cookie
6. Redirects to dashboard
7. Token is sent with every future request to verify user

LOGOUT FLOW:
1. User clicks logout button
2. System removes JWT token
3. User redirected to login page
4. User is no longer authenticated
```

### Database Collections Used
- **users**: Stores email, hashed password, role, verification status, creation date
- **email_verification_tokens**: Temporary tokens for email verification

---

## 👥 MODULE 2: EMPLOYEE MANAGEMENT MODULE

### Purpose
Manage employee information, profiles, and details.

### Admin Features
| Feature | What It Does |
|---------|-------------|
| **Add Employee** | Create new employee record with all details |
| **Update Profile** | Edit employee name, contact, department, position |
| **View All Employees** | See list of all employees in company |
| **Search & Filter** | Find specific employees by name, department, etc. |
| **Deactivate/Remove** | Remove employee from active list (archive record) |
| **Set Salary** | Assign and update salary information |
| **Assign Department** | Set which department employee belongs to |
| **View Salary Slips** | See payroll history for each employee |

### Employee Features
| Feature | What It Does |
|---------|-------------|
| **View Own Profile** | See their own personal information |
| **View Salary** | Check their current salary (read-only) |
| **Update Contact** | Change phone number or personal email |
| **View Hire Date** | See when they joined company |
| **Download Profile** | Export their information as PDF |

### Employee Data Stored
```
Employee Profile Contains:
├── Personal Info
│   ├── Full Name
│   ├── Email
│   ├── Phone Number
│   ├── Date of Birth
│   └── Gender
├── Employment Info
│   ├── Employee ID
│   ├── Department
│   ├── Position/Designation
│   ├── Hire Date
│   └── Employment Type (Full-time/Part-time)
└── Financial Info
    ├── Base Salary
    ├── Bank Account
    └── Tax ID
```

### Database Collections Used
- **employees**: Full employee information
- **departments**: Department details
- **positions**: Job titles and descriptions

---

## 📍 MODULE 3: ATTENDANCE MODULE

### Purpose
Track when employees come to work and leave, and maintain daily records.

### Key Features

| Feature | Admin Can | Employee Can |
|---------|-----------|--------------|
| **View Attendance** | ✅ See all employees' records | ✅ See only their own |
| **Check-In/Check-Out** | ❌ | ✅ Record arrival/departure |
| **View Reports** | ✅ Daily/Weekly/Monthly reports | ✅ View own weekly summary |
| **Mark Absent** | ✅ Manually mark employee absent | ❌ |
| **Edit Attendance** | ✅ Correct wrong entries | ❌ |
| **Export Reports** | ✅ Download as PDF/Excel | ❌ |
| **Track Patterns** | ✅ Identify late arrivals | ❌ |

### Attendance Record Info
```
Each Attendance Record Contains:
├── Employee ID (Who)
├── Date (When)
├── Check-In Time (Arrival time)
├── Check-Out Time (Departure time)
├── Hours Worked (Calculated)
├── Status (Present/Absent/Late/Leave)
└── Notes (Optional remarks)
```

### How Check-In/Check-Out Works

```
DAILY ATTENDANCE PROCESS:
1. Employee arrives at work
2. Clicks "Check In" button on their phone/computer
3. System records exact time
4. Employee can see "You are checked in"
5. Employee works throughout the day
6. Before leaving, clicks "Check Out"
7. System records departure time
8. Calculates hours worked automatically
9. Record saved to database

ADMIN VIEW:
- Can see all employees' attendance
- Can see who is late, absent, or on leave
- Can generate weekly/monthly reports
- Can manually correct mistakes
- Can download reports as PDF
```

### Attendance Reports
- **Daily Report**: Who came today, who is absent
- **Weekly Report**: Each employee's attendance for the week
- **Monthly Report**: Full month attendance summary
- **Late Arrivals**: Track employees who frequently come late
- **Absenteeism**: Track absent days and patterns

### Database Collections Used
- **attendance**: Daily attendance records
- **attendance_reports**: Generated reports

---

## 🏖️ MODULE 4: LEAVE MANAGEMENT MODULE

### Purpose
Allow employees to request leave and allow admins to approve requests.

### Leave Types Supported
```
Types of Leave Available:
├── Sick Leave (Personal illness)
├── Casual Leave (Random time off)
├── Annual Leave (Yearly vacation)
├── Maternity/Paternity Leave
├── Unpaid Leave
└── Special Leave (Emergencies)
```

### Employee Features
| Feature | What It Does |
|---------|-------------|
| **View Leave Balance** | See remaining leave days |
| **Apply for Leave** | Submit leave request for specific dates |
| **Select Leave Type** | Choose which type of leave |
| **Add Reason** | Explain why they need leave |
| **View Applications** | See all past leave requests and status |
| **Cancel Request** | Cancel pending requests (before approval) |

### Admin Features
| Feature | What It Does |
|---------|-------------|
| **View All Requests** | See all leave applications from all employees |
| **Approve/Reject** | Accept or deny leave requests |
| **Add Comments** | Add notes for rejection or approval |
| **Adjust Balances** | Manually add or reduce leave days |
| **Set Leave Policies** | Define how many days each employee gets |
| **Generate Report** | See who is on leave and when |

### Leave Request Flow (Step by Step)

```
LEAVE REQUEST PROCESS:

STEP 1: Employee Applies
   └─→ Goes to Leave section
   └─→ Clicks "Apply for Leave"
   └─→ Selects dates and leave type
   └─→ Adds reason (e.g., "Doctor appointment")
   └─→ Submits request
   └─→ Status: PENDING

STEP 2: Admin Reviews
   └─→ Sees new request in "Pending Approvals"
   └─→ Reads employee's reason
   └─→ Can see if employee has enough balance
   └─→ Approves or Rejects request

STEP 3: If Approved
   └─→ Leave days deducted from employee's balance
   └─→ Employee notified (via email/notification)
   └─→ Status: APPROVED
   └─→ Dates marked as "Leave" in attendance

STEP 4: If Rejected
   └─→ Admin adds reason for rejection
   └─→ Employee notified
   └─→ Leave balance unchanged
   └─→ Status: REJECTED
   └─→ Employee can reapply
```

### Leave Balance Management

```
Example Employee Leave Balance:

Annual Leave: 20 days
├── Used: 5 days
├── Remaining: 15 days
└── Approved Pending: 3 days

Sick Leave: 10 days
├── Used: 1 day
└── Remaining: 9 days

Casual Leave: 8 days
├── Used: 0 days
└── Remaining: 8 days

TOTAL AVAILABLE: 32 days
```

### Database Collections Used
- **leave_applications**: All leave requests
- **leave_balances**: Each employee's remaining leave days
- **leave_types**: Types of leave and policies
- **leave_approvals**: Approval history

---

## 💰 MODULE 5: PAYROLL MODULE

### Purpose
Display salary information and allow admins to manage payroll.

### Employee Features
| Feature | What It Does |
|---------|-------------|
| **View Salary** | See current salary information |
| **View Salary Slips** | See previous month's salary breakdown |
| **Download Slip** | Download salary slip as PDF |
| **View Tax Details** | See tax deductions |
| **View Deductions** | See all deductions (PF, insurance, etc.) |

### Payroll Information Visible

```
Employee Salary Slip Example:

SALARY BREAKDOWN:
├── Basic Salary: $2,000
├── HRA (House Rent): $500
├── Dearness Allowance: $300
└── Total Earnings: $2,800

DEDUCTIONS:
├── Provident Fund (PF): $150
├── Tax: $200
├── Insurance: $50
└── Total Deductions: $400

NET SALARY: $2,400
```

### Admin Features
| Feature | What It Does |
|---------|-------------|
| **Set Salary** | Assign salary to employee |
| **Update Salary** | Change salary amount |
| **View All Payroll** | See all employees' salaries |
| **Generate Payroll** | Create monthly payroll for all employees |
| **Export Reports** | Download payroll as Excel/PDF |
| **View Payroll History** | See past payroll records |
| **Add Bonuses** | Add performance bonus to salary |
| **Manage Deductions** | Set tax, PF, insurance deductions |

### Payroll Process

```
MONTHLY PAYROLL PROCESS:

STEP 1: Attendance Finalization (Last day of month)
   └─→ All attendance records are finalized
   └─→ Calculate total working days
   └─→ Identify leave days and absence

STEP 2: Salary Calculation
   └─→ Calculate daily rate (Monthly salary ÷ Working days)
   └─→ Calculate actual salary for days worked
   └─→ Add bonuses/allowances
   └─→ Calculate deductions (Tax, PF, etc.)
   └─→ Calculate net salary

STEP 3: Payroll Generation
   └─→ Admin generates payroll for all employees
   └─→ System creates salary records
   └─→ Generates salary slips automatically

STEP 4: Payment Processing
   └─→ Finance team processes payment
   └─→ Salary transferred to employees' accounts
   └─→ Employees can view their salary slip

STEP 5: Record Keeping
   └─→ Payroll record saved in database
   └─→ Salary slip available to employee
   └─→ Audit trail maintained
```

### Database Collections Used
- **payroll**: Monthly payroll records
- **salary**: Employee salary details
- **salary_slips**: Generated salary slips
- **deductions**: Tax and other deductions

---

## 📊 MODULE 6: DASHBOARD & REPORTS

### Admin Dashboard
The admin dashboard shows important company information at a glance.

**Widgets & Analytics**:
```
┌─────────────────────────────────────────────┐
│     ADMIN DASHBOARD - Key Information       │
├─────────────────────────────────────────────┤
│  Total Employees: 150                       │
│  Present Today: 145                         │
│  Absent Today: 5                            │
│  On Leave Today: 10                         │
│  Pending Approvals: 8 (3 leaves, 5 reports)│
├─────────────────────────────────────────────┤
│  RECENT ACTIVITIES:                         │
│  • John submitted leave request (1 hr ago)  │
│  • Salary slip generated for all (2 hrs ago)│
│  • New employee added: Sarah (5 hrs ago)    │
├─────────────────────────────────────────────┤
│  CHARTS:                                    │
│  • Attendance Rate: 96%                     │
│  • Leave Usage: 45% of available days       │
│  • Department Performance: (pie chart)      │
└─────────────────────────────────────────────┘
```

### Employee Dashboard
Shows personal information and quick actions.

```
┌─────────────────────────────────────────────┐
│    EMPLOYEE DASHBOARD - Your Information    │
├─────────────────────────────────────────────┤
│  👤 Name: John Smith                        │
│  📧 Email: john@company.com                 │
│  🏢 Department: IT                          │
│  💼 Position: Senior Developer              │
├─────────────────────────────────────────────┤
│  TODAY'S STATUS:                            │
│  ✅ Checked In: 9:15 AM                     │
│  ⏰ Hours Worked: 4h 30m                    │
├─────────────────────────────────────────────┤
│  QUICK STATS:                               │
│  Annual Leave: 15/20 days remaining         │
│  Sick Leave: 9/10 days remaining            │
│  Current Salary: $2,000/month               │
├─────────────────────────────────────────────┤
│  QUICK ACTIONS:                             │
│  [Check Out]  [Apply for Leave]  [Reports] │
└─────────────────────────────────────────────┘
```

### Available Reports
- **Attendance Report**: Daily, weekly, monthly summaries
- **Leave Report**: Leave usage and patterns
- **Payroll Report**: Salary records and histories
- **Department Report**: Performance by department
- **Employee Report**: Individual employee records

---

# 👥 PART 3: USER ROLES & PERMISSIONS

## Role 1: ADMIN / HR OFFICER

### What They Can Do

**Authentication**
- ✅ Sign in with credentials
- ✅ Change password
- ✅ Logout

**Employee Management**
- ✅ Add new employees
- ✅ View all employees
- ✅ Edit employee information
- ✅ Update salary
- ✅ Deactivate employees
- ✅ View employee profiles

**Attendance Management**
- ✅ View all employees' attendance
- ✅ Generate attendance reports
- ✅ Manually mark attendance
- ✅ Correct wrong entries
- ✅ Download attendance reports

**Leave Management**
- ✅ View all leave applications
- ✅ Approve leave requests
- ✅ Reject leave requests
- ✅ Adjust leave balance manually
- ✅ Generate leave reports
- ✅ Set leave policies

**Payroll Management**
- ✅ View all salary information
- ✅ Update salary details
- ✅ Generate monthly payroll
- ✅ View salary slips
- ✅ Download payroll reports
- ✅ Manage deductions and bonuses

**Analytics & Reports**
- ✅ View dashboard with statistics
- ✅ Generate various reports
- ✅ Download reports as PDF/Excel
- ✅ View company-wide analytics

---

## Role 2: EMPLOYEE

### What They Can Do

**Authentication**
- ✅ Sign up for account
- ✅ Verify email
- ✅ Sign in with credentials
- ✅ Change password
- ✅ Logout

**Personal Profile**
- ✅ View own profile
- ✅ Update personal contact info
- ✅ View hire date and employment info
- ✅ Download profile information

**Attendance**
- ✅ Check in when arriving
- ✅ Check out when leaving
- ✅ View own attendance records
- ✅ View own weekly/monthly summary

**Leave Management**
- ✅ View leave balance
- ✅ Apply for leave
- ✅ Select leave type and dates
- ✅ View leave applications status
- ✅ Cancel pending requests
- ✅ View leave history

**Payroll**
- ✅ View current salary
- ✅ View salary slip
- ✅ Download salary slip
- ✅ View pay history

**Dashboard**
- ✅ View personal dashboard
- ✅ See quick statistics
- ✅ View attendance summary
- ✅ View leave balance summary

### What They CANNOT Do
- ❌ Edit another employee's information
- ❌ Approve/Reject leave requests
- ❌ Change anyone's salary
- ❌ View other employees' attendance
- ❌ Access admin features
- ❌ Generate company reports

---

# 🔄 PART 4: USER FLOWS (How Users Move Through System)

## EMPLOYEE USER FLOW

```
START
  │
  ├─→ [New User?]
  │   └─→ Go to Sign Up
  │       ├─→ Enter Email & Password
  │       ├─→ Verify Email (click link in email)
  │       ├─→ Account Created ✅
  │       └─→ Proceed to Login
  │
  ├─→ Sign In Page
  │   ├─→ Enter Email
  │   ├─→ Enter Password
  │   ├─→ Click "Sign In"
  │   ├─→ System validates → JWT token generated
  │   └─→ Redirected to Dashboard ✅
  │
  ├─→ EMPLOYEE DASHBOARD (Main Hub)
  │   ├─→ View Profile Section
  │   ├─→ View Today's Attendance Status
  │   ├─→ Quick Links
  │   └─→ Notifications
  │
  ├─→ From Dashboard, Employee Can:
  │
  │   [PATH 1: ATTENDANCE]
  │   ├─→ Go to Attendance Section
  │   ├─→ Click "Check In" (if not checked in)
  │   ├─→ System records time with GPS/location
  │   ├─→ Employee sees "Checked in at 9:15 AM"
  │   ├─→ ... (work throughout day)
  │   ├─→ Click "Check Out" when leaving
  │   ├─→ System records departure time
  │   ├─→ Hours automatically calculated
  │   └─→ Record saved ✅
  │
  │   [PATH 2: APPLY FOR LEAVE]
  │   ├─→ Go to Leave Section
  │   ├─→ Click "Apply New Leave"
  │   ├─→ Select Leave Type (Annual/Sick/Casual)
  │   ├─→ Choose Start Date & End Date
  │   ├─→ Enter Reason (e.g., "Doctor appointment")
  │   ├─→ System checks balance (has enough days?)
  │   ├─→ Submit Application
  │   ├─→ Status shows as "PENDING"
  │   ├─→ Notification sent to Admin ✅
  │   └─→ Can check status anytime
  │
  │   [PATH 3: VIEW PERSONAL RECORDS]
  │   ├─→ Go to Attendance Section
  │   ├─→ View own attendance history
  │   ├─→ View weekly/monthly summaries
  │   ├─→ Download as PDF
  │   │
  │   ├─→ Go to Leave Section
  │   ├─→ View leave balance
  │   ├─→ View past applications
  │   ├─→ View leave history
  │   │
  │   ├─→ Go to Salary Section
  │   ├─→ View current salary
  │   ├─→ View salary slip
  │   ├─→ Download salary slip as PDF
  │   └─→ View payroll history
  │
  │   [PATH 4: UPDATE PROFILE]
  │   ├─→ Go to Profile Section
  │   ├─→ Click "Edit Profile"
  │   ├─→ Update phone number or email
  │   ├─→ Save changes
  │   └─→ Changes saved ✅
  │
  └─→ LOGOUT
      ├─→ Click Logout Button
      ├─→ Token removed
      └─→ Redirected to Login Page

FLOW ENDS
```

## ADMIN USER FLOW

```
START
  │
  ├─→ Sign In Page
  │   ├─→ Enter Admin Email
  │   ├─→ Enter Password
  │   ├─→ Click "Sign In"
  │   ├─→ System validates → JWT token with ADMIN role
  │   └─→ Redirected to Admin Dashboard ✅
  │
  ├─→ ADMIN DASHBOARD (Control Center)
  │   ├─→ Key Statistics (Total employees, Present/Absent, Pending approvals)
  │   ├─→ Navigation Menu
  │   └─→ Recent Activities Log
  │
  ├─→ From Dashboard, Admin Can:
  │
  │   [PATH 1: MANAGE EMPLOYEES]
  │   ├─→ Go to Employee Management
  │   ├─→ View List of All Employees
  │   ├─→ [Sub-Path A: Add New Employee]
  │   │   ├─→ Click "Add Employee"
  │   │   ├─→ Enter Full Details (Name, Email, Phone, etc.)
  │   │   ├─→ Assign Department & Position
  │   │   ├─→ Set Salary
  │   │   ├─→ Click "Save"
  │   │   ├─→ System sends welcome email to new employee
  │   │   └─→ Employee record created ✅
  │   │
  │   ├─→ [Sub-Path B: Edit Employee]
  │   │   ├─→ Click on Employee Name
  │   │   ├─→ Update Details (name, contact, department)
  │   │   ├─→ Click "Save"
  │   │   └─→ Changes applied ✅
  │   │
  │   └─→ [Sub-Path C: View & Deactivate]
  │       ├─→ Select Employee
  │       ├─→ Click "Deactivate" (if removing)
  │       └─→ Employee moved to inactive list
  │
  │   [PATH 2: REVIEW & APPROVE LEAVE]
  │   ├─→ Go to Leave Management
  │   ├─→ See "Pending Approvals" section
  │   ├─→ Requests listed with:
  │   │   ├─→ Employee Name
  │   │   ├─→ Leave Dates
  │   │   ├─→ Leave Type
  │   │   ├─→ Reason
  │   │   └─→ Employee's Leave Balance
  │   │
  │   ├─→ [Sub-Path A: Approve Leave]
  │   │   ├─→ Click on Request
  │   │   ├─→ Review Details
  │   │   ├─→ Click "Approve"
  │   │   ├─→ Optionally Add Comment
  │   │   ├─→ System deducts leave from employee balance
  │   │   ├─→ Employee notified via email
  │   │   ├─→ Dates marked as "Leave" in attendance
  │   │   └─→ Approval recorded ✅
  │   │
  │   └─→ [Sub-Path B: Reject Leave]
  │       ├─→ Click on Request
  │       ├─→ Review Details
  │       ├─→ Click "Reject"
  │       ├─→ Add Rejection Reason
  │       ├─→ Employee notified
  │       ├─→ Leave balance unchanged
  │       └─→ Rejection recorded ✅
  │
  │   [PATH 3: VIEW & MANAGE ATTENDANCE]
  │   ├─→ Go to Attendance Management
  │   ├─→ View All Employees' Attendance
  │   ├─→ Filter by Date, Department, Status
  │   ├─→ [Sub-Path A: View Reports]
  │   │   ├─→ Click "Generate Report"
  │   │   ├─→ Select Report Type (Daily/Weekly/Monthly)
  │   │   ├─→ Select Date Range
  │   │   ├─→ System generates report
  │   │   ├─→ Can view on screen or download as PDF
  │   │   └─→ Report available ✅
  │   │
  │   ├─→ [Sub-Path B: Correct Attendance]
  │   │   ├─→ Find Employee's Record
  │   │   ├─→ Click "Edit"
  │   │   ├─→ Correct Check-In/Check-Out Time
  │   │   ├─→ Add Note (why corrected)
  │   │   ├─→ Save Changes
  │   │   └─→ Record updated ✅
  │   │
  │   └─→ [Sub-Path C: Manual Marking]
  │       ├─→ Find Employee
  │       ├─→ Click "Mark Attendance"
  │       ├─→ Select Date & Status (Present/Absent/Late)
  │       ├─→ Add Reason (optional)
  │       └─→ Record saved ✅
  │
  │   [PATH 4: MANAGE PAYROLL]
  │   ├─→ Go to Payroll Management
  │   ├─→ [Sub-Path A: View All Salaries]
  │   │   ├─→ See All Employees' Salary Details
  │   │   ├─→ View base salary, allowances, deductions
  │   │   └─→ Can filter by department
  │   │
  │   ├─→ [Sub-Path B: Update Salary]
  │   │   ├─→ Select Employee
  │   │   ├─→ Click "Edit Salary"
  │   │   ├─→ Update Amount
  │   │   ├─→ Change Allowances/Deductions
  │   │   ├─→ Click "Save"
  │   │   └─→ Salary updated ✅
  │   │
  │   ├─→ [Sub-Path C: Generate Payroll]
  │   │   ├─→ Click "Generate Monthly Payroll"
  │   │   ├─→ Select Month/Year
  │   │   ├─→ System calculates based on attendance
  │   │   ├─→ Generates salary slips for all
  │   │   ├─→ Employee receives email with slip
  │   │   └─→ Payroll created ✅
  │   │
  │   └─→ [Sub-Path D: Export Reports]
  │       ├─→ Click "Download Report"
  │       ├─→ Select Format (PDF/Excel)
  │       ├─→ System generates file
  │       └─→ File downloaded ✅
  │
  │   [PATH 5: VIEW ANALYTICS]
  │   ├─→ Go to Analytics Section
  │   ├─→ View Attendance Trends
  │   ├─→ View Leave Usage Patterns
  │   ├─→ View Department Performance
  │   ├─→ Generate Custom Reports
  │   └─→ Export insights
  │
  └─→ LOGOUT
      ├─→ Click Logout Button
      ├─→ Token removed
      └─→ Redirected to Login Page

FLOW ENDS
```

---

# 📋 PART 5: PROCESS FLOWCHARTS

## FLOWCHART 1: LEAVE APPROVAL PROCESS

```
                           START
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Employee Applies for │
                  │ Leave (submits form) │
                  └──────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │ System Checks:  │
                    │ - Valid dates?  │
                    │ - Enough balance?
                    │ - No conflicts? │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ ALL CHECKS OK?  │
                    └────┬───────┬────┘
                         │       │
                    YES  │       │  NO
                         ▼       ▼
              ┌──────────────┐ ┌──────────────────┐
              │ Save Request │ │ Show Error Msg   │
              │ Status:      │ │ Insufficient     │
              │ PENDING      │ │ balance OR dates │
              └──────┬───────┘ │ Ask to retry     │
                     │         └──────────────────┘
                     │
              ┌──────▼──────────────────────┐
              │ Notify Admin of New Request │
              │ (Email + Dashboard alert)   │
              └──────┬─────────────────────┘
                     │
              ┌──────▼──────────────────────┐
              │ Admin Reviews Request       │
              │ - Employee name             │
              │ - Dates requested           │
              │ - Reason given              │
              │ - Current balance           │
              └──────┬─────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
        YES          NO         UNKNOWN
         │            │           │
         ▼            ▼           ▼
    ┌────────┐  ┌──────────┐ ┌──────────┐
    │APPROVE │  │ REJECT   │ │ REQUEST  │
    │        │  │          │ │ MORE INFO│
    └────┬───┘  └────┬─────┘ └────┬─────┘
         │           │             │
         │           │       ┌─────▼──────┐
         │           │       │ Ask Employee│
         │           │       │ for Details │
         │           │       └─────┬──────┘
         │           │             │
         │     ┌─────▼──────┐      │
         │     │ Reason for │      │
         │     │ Rejection  │      │
         │     │ sent to    │      │
         │     │ Employee   │      │
         │     │ Email      │      │
         │     └─────┬──────┘      │
         │           │             │
         │     ┌─────▼──────┐ ┌────▼────┐
         │     │ Status:    │ │ Wait for │
         │     │ REJECTED   │ │ Response │
         │     └─────┬──────┘ └────┬────┘
         │           │             │
         │     ┌─────▼──────────────┘
         │     │
         │     ▼
    ┌────▼────────────┐
    │ Update Database │
    │ - Leave balance │
    │ - Status change │
    │ - Add timestamp │
    └────┬────────────┘
         │
         ▼
    ┌─────────────────────┐
    │ Send Confirmation   │
    │ Email to Employee   │
    │ with Details        │
    └────┬────────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ Mark Leave Dates in  │
    │ Attendance Records   │
    │ (Status: LEAVE)      │
    └────┬─────────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ Add to Audit Log     │
    │ (Who approved, when) │
    └────┬─────────────────┘
         │
         ▼
         END
```

## FLOWCHART 2: DAILY ATTENDANCE TRACKING

```
                      START (Employee Arrives)
                              │
                              ▼
                  ┌───────────────────────┐
                  │ Employee Opens App    │
                  │ Dayflow Dashboard     │
                  └───────┬───────────────┘
                          │
                  ┌───────▼───────────┐
                  │ Is Employee       │
                  │ Already Checked In?
                  └───┬───────────┬───┘
                      │           │
                   YES│           │NO
                      │           │
                      │    ┌──────▼─────────────┐
                      │    │ Employee sees     │
                      │    │ "Check In" button │
                      │    └──────┬────────────┘
                      │           │
                      │    ┌──────▼──────────────┐
                      │    │ Click "Check In"   │
                      │    │ System records:    │
                      │    │ - Current time     │
                      │    │ - Employee ID      │
                      │    │ - Location (if GPS)│
                      │    └──────┬─────────────┘
                      │           │
                      │    ┌──────▼─────────────────┐
                      │    │ Send to Database      │
                      │    │ Create Attendance Rec.│
                      │    └──────┬────────────────┘
                      │           │
                      │    ┌──────▼──────────────┐
                      │    │ Display:            │
                      │    │ "Checked In at 9:15"│
                      │    │ Show "Check Out" btn│
                      │    └──────┬─────────────┘
                      │           │
      ┌───────────────┼───────────┘
      │               │
      │        ┌──────▼──────────────┐
      │        │ Employee Works      │
      │        │ (throughout the day)│
      │        │ Duration: ??? hours │
      │        └──────┬─────────────┘
      │               │
      │        ┌──────▼──────────────┐
      │        │ Employee Ready to   │
      │        │ Leave Office        │
      │        │ Click "Check Out"   │
      │        └──────┬─────────────┘
      │               │
      │        ┌──────▼──────────────────┐
      │        │ System Records:         │
      │        │ - Check-out time       │
      │        │ - Calculate hours work │
      │        └──────┬─────────────────┘
      │               │
      │        ┌──────▼──────────────────┐
      │        │ Update Attendance Rec. │
      │        │ - Hours worked added   │
      │        │ - Status: PRESENT      │
      │        └──────┬─────────────────┘
      │               │
      │        ┌──────▼──────────────────┐
      │        │ Save to Database        │
      │        │ Record Complete         │
      │        └──────┬─────────────────┘
      │               │
      │        ┌──────▼──────────────────┐
      │        │ Display Confirmation:  │
      │        │ "Checked out at 5:30"  │
      │        │ "Hours worked: 8h 15m" │
      │        └──────┬─────────────────┘
      │               │
      │        ┌──────▼──────────────────┐
      │        │ Optional: Send Email    │
      │        │ Summary to Employee     │
      │        └──────┬─────────────────┘
      │               │
      └───────────────┼───────────────────┐
                      │                   │
                      ▼                   ▼
                    END               Admin View:
                                   (View all employees'
                                    attendance daily)
```

---

# 🚀 PART 6: FUTURE ENHANCEMENTS

As the system grows, these features can be added:

## 1. **Mobile Application**
- Native Android/iOS apps
- Mobile check-in with biometric authentication
- Push notifications for approvals
- Offline mode for attendance

## 2. **Advanced Analytics**
- Predictive analytics for leave patterns
- Employee engagement scores
- Department-wise performance metrics
- Turnover prediction models
- Custom report builder

## 3. **Integration with External Services**
- Email integration (Gmail, Outlook)
- SMS notifications for approvals
- Video conferencing (Zoom, Google Meet) integration
- File storage (Google Drive, OneDrive)
- Payroll software integration (QuickBooks)

## 4. **Advanced Leave Management**
- Approval workflows (multi-level: Manager → HR → Admin)
- Partial day leave requests
- Shift swapping between employees
- Auto-approval for short leaves
- Leave encashment tracking

## 5. **Enhanced Security**
- Two-factor authentication (2FA)
- Single Sign-On (SSO) with company AD
- Biometric authentication
- End-to-end encryption
- Advanced audit logging

## 6. **Performance Management**
- Performance review system
- Goal tracking and management
- 360-degree feedback
- Rating and evaluation
- Development plans

## 7. **Communication Features**
- Internal messaging system
- Announcement boards
- Company news feed
- Document sharing
- Team collaboration tools

## 8. **Time Tracking & Project Management**
- Project assignment tracking
- Time spent on projects
- Task management
- Productivity reports
- Timesheet management

## 9. **Employee Onboarding**
- Automated onboarding workflows
- Document collection
- Training assignment
- Checklist for new hires
- Buddy assignment system

## 10. **Advanced Compliance**
- Compliance dashboard
- Automated compliance reporting
- Document versioning
- Digital signature support
- GDPR/HIPAA compliance features

---

# 📊 SYSTEM DATA MODEL

## Database Collections (Collections are like Tables)

### 1. Users Collection
```
users {
  _id: unique ID
  email: "john@company.com"
  password_hash: "encrypted password"
  role: "admin" or "employee"
  is_verified: true
  created_at: date
  last_login: date
  is_active: true
}
```

### 2. Employees Collection
```
employees {
  _id: unique ID
  user_id: reference to users
  full_name: "John Smith"
  phone: "+1 123 456 7890"
  date_of_birth: "1990-01-15"
  gender: "Male"
  department: "IT"
  position: "Senior Developer"
  hire_date: "2020-01-10"
  salary: 2000
  hra: 500
  allowances: {...}
  bank_account: "123456789"
  tax_id: "TAX123"
  is_active: true
}
```

### 3. Attendance Collection
```
attendance {
  _id: unique ID
  employee_id: reference to employees
  date: "2024-01-03"
  check_in_time: "09:15:00"
  check_out_time: "17:45:00"
  hours_worked: 8.5
  status: "present"/"absent"/"late"/"leave"
  notes: "Optional notes"
  edited_by: admin_id if edited
}
```

### 4. Leave_Applications Collection
```
leave_applications {
  _id: unique ID
  employee_id: reference to employees
  leave_type: "annual"/"sick"/"casual"
  start_date: "2024-01-10"
  end_date: "2024-01-12"
  num_days: 3
  reason: "Vacation"
  status: "pending"/"approved"/"rejected"
  approved_by: admin_id
  applied_at: timestamp
  approval_date: timestamp
  rejection_reason: "if rejected"
}
```

### 5. Leave_Balances Collection
```
leave_balances {
  _id: unique ID
  employee_id: reference to employees
  year: 2024
  annual_leave: {
    total: 20,
    used: 5,
    remaining: 15
  }
  sick_leave: {
    total: 10,
    used: 1,
    remaining: 9
  }
  casual_leave: {
    total: 8,
    used: 0,
    remaining: 8
  }
}
```

### 6. Payroll Collection
```
payroll {
  _id: unique ID
  employee_id: reference to employees
  month: "2024-01"
  basic_salary: 2000
  hra: 500
  allowances: 300
  gross_salary: 2800
  pf_deduction: 150
  tax_deduction: 200
  insurance_deduction: 50
  net_salary: 2400
  status: "pending"/"processed"/"paid"
  created_at: timestamp
}
```

### 7. Approvals Collection (Audit Trail)
```
approvals {
  _id: unique ID
  request_type: "leave"/"attendance"
  request_id: reference to request
  approved_by: admin_id
  action: "approved"/"rejected"
  action_date: timestamp
  reason: "optional reason"
  ip_address: "192.168.1.1"
}
```

---

# ✅ IMPLEMENTATION CHECKLIST

## Phase 1: Foundation (Week 1-2)
- [ ] Database setup (MongoDB)
- [ ] User authentication system
- [ ] Password hashing and security
- [ ] JWT token implementation
- [ ] Email verification system
- [ ] Basic login/signup pages

## Phase 2: Core Modules (Week 3-4)
- [ ] Employee management module
- [ ] Employee profile pages
- [ ] Attendance tracking (check-in/out)
- [ ] Basic leave application system

## Phase 3: Advanced Features (Week 5-6)
- [ ] Leave approval workflow
- [ ] Admin dashboard
- [ ] Analytics and reports
- [ ] Payroll management module

## Phase 4: Polish & Deploy (Week 7-8)
- [ ] Responsive design (mobile-friendly)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing and bug fixes
- [ ] Deployment to production

---

# 🔒 SECURITY BEST PRACTICES

## Password Security
- ✅ Passwords hashed with bcryptjs (never store plain passwords)
- ✅ Minimum 8 characters required
- ✅ Must contain uppercase, lowercase, and numbers

## API Security
- ✅ All API routes check JWT token
- ✅ Role-based access control (RBAC) enforced
- ✅ Rate limiting on login attempts
- ✅ HTTPS encryption for data in transit

## Database Security
- ✅ MongoDB Atlas (cloud database with encryption)
- ✅ User credentials for database access
- ✅ Data encrypted at rest
- ✅ Regular backups automated

## Session Management
- ✅ JWT tokens with expiration
- ✅ Secure HTTP-only cookies
- ✅ Automatic logout on inactivity
- ✅ Session tokens cannot be reused

---

# 📞 SUPPORT & DOCUMENTATION

- **API Documentation**: See API_TESTING_GUIDE.md
- **Setup Instructions**: See SETUP_GUIDE.md
- **Database Seeding**: See SEED_GUIDE.md
- **Testing Guide**: See TESTING_CHECKLIST.md

---

**Document Version**: 1.0  
**Last Updated**: January 3, 2026  
**System Status**: Complete
