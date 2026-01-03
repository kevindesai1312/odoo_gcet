# Dayflow - Human Resource Management System (HRMS)
## System Design & Architecture Documentation

---

## 1. System Architecture

### High-Level Overview

**Dayflow** is a web-based HRMS that helps companies manage their employees and HR operations digitally.

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Web App)                        │
│  • Employee Dashboard                                         │
│  • Admin Dashboard                                            │
│  • Authentication Pages                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                     Backend API Server                        │
│  • Authentication Service                                     │
│  • Employee Management Service                                │
│  • Attendance Service                                         │
│  • Leave Management Service                                   │
│  • Payroll Service                                            │
│  • Notification Service                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      Database                                 │
│  • Users (Employees & Admins)                                │
│  • Employee Profiles                                         │
│  • Attendance Records                                        │
│  • Leave Applications                                        │
│  • Payroll Data                                              │
│  • Approvals & Workflows                                     │
└─────────────────────────────────────────────────────────────┘
```

### Components Breakdown

**Frontend Layer**
- Built with Next.js (React framework)
- Responsive UI for web browsers
- Separate interfaces for Employee and Admin roles
- Real-time updates for notifications

**Backend Layer**
- REST API to handle business logic
- Authentication & Authorization
- Data processing and validation
- Email verification and notifications

**Database Layer**
- Stores all user and operational data
- Secure and encrypted sensitive information
- Maintains data relationships and integrity

---

## 2. Module Breakdown

### 📌 Module 1: Authentication Module

**Purpose:** Secure login and user registration

**Key Features:**
- Sign Up with email verification
- Sign In with credentials
- Password reset functionality
- Role assignment (Admin or Employee)
- Session management (keep users logged in)

**User Journey:**
```
New User → Sign Up → Enter Email & Password → Verify Email → Account Created
Existing User → Sign In → Enter Credentials → Dashboard Access
```

**Database Tables Needed:**
- `users` - Store user credentials and role
- `email_verification_tokens` - For email verification

---

### 👥 Module 2: Employee Management Module

**Purpose:** Manage employee information and profiles

**Key Features (Admin Only):**
- Add new employees
- Update employee details (name, contact, department)
- View all employees list
- Deactivate/remove employees
- Assign roles and permissions
- Set salary information

**Key Features (Employee):**
- View own profile
- Update personal information (contact details)
- View salary information (read-only)

**Database Tables Needed:**
- `employees` - Store employee details
- `departments` - Department information
- `roles` - Employee roles and permissions

---

### 📋 Module 3: Attendance Module

**Purpose:** Track employee presence and work hours

**Key Features:**
- Daily Check-In / Check-Out
- Mark attendance manually (Admin only)
- View daily attendance
- Weekly attendance summary
- Generate attendance reports

**Tracking Information:**
- Check-in time
- Check-out time
- Total hours worked
- Late arrivals and early departures
- Absences

**Database Tables Needed:**
- `attendance` - Daily check-in/check-out records
- `attendance_rules` - Company policies (working hours, late policy)

---

### 🏖️ Module 4: Leave & Time-Off Management Module

**Purpose:** Handle leave requests and approvals

**Key Features:**
- Apply for leave (vacation, sick, personal)
- View remaining leave balance
- Track leave history
- Approval workflow for leave requests
- Admin approval/rejection with comments

**Leave Types:**
- Paid Leave (PL)
- Sick Leave (SL)
- Casual Leave (CL)
- Special Leave

**Leave Request Workflow:**
```
Employee applies → HR/Admin reviews → Approved/Rejected → Notification sent → Record updated
```

**Database Tables Needed:**
- `leave_types` - Types of leaves available
- `leave_balance` - Employee's remaining leave count
- `leave_applications` - Leave requests
- `leave_approvals` - Approval history

---

### 💰 Module 5: Payroll Module

**Purpose:** Manage salary and payroll information

**Key Features (Admin):**
- Set employee salary
- View payroll data
- Generate salary slips
- Calculate deductions (tax, insurance)
- Process monthly payroll

**Key Features (Employee):**
- View own salary
- Download salary slips
- View payroll history
- See deductions and allowances breakdown

**Payroll Information:**
- Base salary
- Allowances (HRA, DA, etc.)
- Deductions (tax, insurance)
- Net salary
- Payment history

**Database Tables Needed:**
- `payroll` - Salary and payroll records
- `salary_components` - Allowances and deductions
- `salary_slips` - Generated salary documents

---

### 📊 Module 6: Admin Dashboard

**Purpose:** Central place for HR to manage all operations

**Key Features:**
- Overview of all employees
- Pending leave approvals
- Pending attendance reviews
- Company-wide attendance statistics
- Payroll summary
- Upcoming holidays and events

**Reports & Analytics:**
- Attendance reports (monthly, quarterly)
- Leave usage statistics
- Payroll reports
- Employee overview
- Absenteeism patterns

---

## 3. User Flows

### 🧑‍💼 Employee User Flow

```
Step 1: Login
  ↓
Step 2: View Dashboard
  • Personal attendance
  • Leave balance
  • Salary slip
  • Notifications
  ↓
Step 3: Perform Actions
  ├─ Check-In / Check-Out
  ├─ Apply for Leave
  ├─ View Attendance
  ├─ Download Salary Slip
  └─ Update Profile
```

**Detailed Flow:**

1. **Login**
   - Enter email and password
   - Click "Sign In"
   - Redirected to Dashboard

2. **Dashboard Home**
   - See overview of attendance, leave, and salary
   - View upcoming leave approvals status
   - See today's check-in/check-out status

3. **Daily Actions**
   - **Check-In:** Click "Check-In" button → Records current time
   - **Check-Out:** Click "Check-Out" button → Records exit time
   - **Apply Leave:** Go to Leave section → Fill form → Submit

4. **View Information**
   - Attendance: See daily/weekly attendance records
   - Leave: View pending, approved, rejected requests
   - Salary: Download salary slip, view payroll history

5. **Profile Management**
   - Update contact details
   - Change password
   - View personal information

---

### 👨‍💼 Admin/HR Officer User Flow

```
Step 1: Login
  ↓
Step 2: View Admin Dashboard
  • All employees list
  • Pending approvals
  • Analytics & reports
  ↓
Step 3: Perform Admin Actions
  ├─ Manage Employees
  │  ├─ Add new employee
  │  ├─ Update details
  │  └─ Remove employee
  ├─ Approve Requests
  │  ├─ Leave approval
  │  ├─ Attendance correction
  │  └─ Add comments
  ├─ Manage Attendance
  │  ├─ Mark attendance
  │  └─ View reports
  ├─ Manage Payroll
  │  ├─ Set salaries
  │  ├─ Generate salary slips
  │  └─ Process payroll
  └─ View Analytics
     ├─ Attendance reports
     ├─ Leave statistics
     └─ Payroll summary
```

**Detailed Flow:**

1. **Login**
   - Enter email and password
   - Access Admin Dashboard

2. **Main Dashboard**
   - See pending approvals
   - View company-wide statistics
   - Quick access to main functions

3. **Employee Management**
   - Go to Employees section
   - Add new employee → Enter details → Save
   - Edit employee → Update info → Save
   - View all employees in a table

4. **Attendance Management**
   - View employee attendance
   - Mark or correct attendance
   - Generate attendance reports

5. **Leave Approvals**
   - Go to Pending Leaves section
   - Review each leave request
   - Approve → Record approved
   - Reject → Add reason → Record rejected
   - Employee notified automatically

6. **Payroll Management**
   - Set salary for employees
   - View payroll records
   - Generate salary slips
   - View payroll history

7. **Reports & Analytics**
   - View attendance trends
   - Leave usage statistics
   - Payroll reports
   - Export reports as PDF/Excel

---

## 4. Workflow Diagrams (Text-Based)

### 🔄 Leave Approval Workflow

```
┌─────────────────┐
│  Employee      │
│  Applies for   │
│  Leave         │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│  Leave Request Created   │
│  Status: PENDING         │
│  (Stored in Database)    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Admin/HR Reviews       │
│  Reads Request Details  │
│  Checks Leave Balance   │
│  Checks Approval Rules  │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌────────┐
│APPROVE │  │ REJECT │
└────┬───┘  └────┬───┘
     │           │
     ▼           ▼
┌─────────────────────────────────┐
│ Update Status in Database       │
│ APPROVED / REJECTED             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Send Notification to Employee   │
│ Email: Request Approved/Rejected│
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Employee Sees Status in App     │
│ Can view decision & feedback    │
└─────────────────────────────────┘
```

### 📍 Attendance Tracking Workflow

```
┌──────────────────────┐
│  Employee Arrives    │
│  at Office           │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────┐
    │  Opens App   │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────┐
    │  Clicks "Check-In"   │
    │  Button              │
    └──────┬───────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  System Records:         │
    │  • Current Date & Time   │
    │  • Location (Optional)   │
    │  • Employee ID           │
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Confirmation Message    │
    │  "Checked In at 9:05 AM" │
    └──────┬───────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
During Work   Leave/Break
    │             │
    │             ▼
    │     ┌───────────────┐
    │     │ Manual Status │
    │     │  (Optional)   │
    │     └───────────────┘
    │
    ▼
┌──────────────────────┐
│  Employee Leaves     │
│  for Day             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Clicks "Check-Out"   │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────────┐
│ System Records:             │
│ • Check-out Time            │
│ • Total Hours Worked        │
│ • (Auto-calculates)         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Confirmation Message        │
│ "Checked Out at 5:30 PM"    │
│ "Hours Worked: 8h 25m"      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Record Saved in Database    │
│ Attendance Updated          │
│ Available for Reports       │
└─────────────────────────────┘
```

### 🔐 Authentication Workflow

```
┌──────────────────────┐
│   New User           │
│   (Sign Up Page)     │
└──────┬───────────────┘
       │
       ▼
┌────────────────────────────┐
│  Enter Details:            │
│  • Full Name               │
│  • Email                   │
│  • Password                │
│  • Confirm Password        │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  Validate Input            │
│  • Strong password check   │
│  • Email format check      │
│  • Duplicate email check   │
└──────┬─────────────────────┘
       │
  ┌────┴───────┐
  │             │
  ▼             ▼
Valid       Invalid
  │             │
  │             ▼
  │       ┌──────────────┐
  │       │ Show Error   │
  │       │ Message      │
  │       └──────────────┘
  │
  ▼
┌────────────────────────────┐
│  Create User Account       │
│  • Hash password           │
│  • Store in Database       │
│  • Assign Employee role    │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  Send Verification Email   │
│  with unique link          │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  Employee Clicks Link      │
│  in Email                  │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  Verify Email              │
│  Mark account as verified  │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  Account Ready             │
│  Can Login Now             │
└────────────────────────────┘

───────────────────────────────

EXISTING USER (Sign In)
┌──────────────────┐
│   Login Page     │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  Enter Credentials   │
│  • Email             │
│  • Password          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│  Verify Credentials      │
│  Check in Database       │
└──────┬───────────────────┘
       │
  ┌────┴────────┐
  │             │
  ▼             ▼
Match      No Match
  │             │
  ▼             ▼
  │        ┌──────────────┐
  │        │ Login Failed │
  │        │ Try Again    │
  │        └──────────────┘
  │
  ▼
┌──────────────────────────┐
│  Create Session/Token    │
│  Keep user logged in     │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Redirect to Dashboard   │
│  Based on Role           │
└──────────────────────────┘
```

---

## 5. Database Schema Overview

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | id, email, password_hash, role (ADMIN/EMPLOYEE) |
| `employees` | Employee details | id, name, email, department, phone, hire_date |
| `attendance` | Daily records | id, employee_id, check_in_time, check_out_time, date |
| `leave_types` | Leave categories | id, name (PL, SL, CL), max_days_per_year |
| `leave_balance` | Available leaves | id, employee_id, leave_type_id, remaining_days |
| `leave_applications` | Leave requests | id, employee_id, leave_type_id, from_date, to_date, status (PENDING/APPROVED/REJECTED) |
| `payroll` | Salary info | id, employee_id, base_salary, month, year |
| `salary_components` | Deductions | id, name (allowance/deduction), amount, type |
| `departments` | Department info | id, name, manager_id |
| `email_verification` | Email tokens | id, user_id, token, is_verified |

---

## 6. Technology Stack

### Frontend
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / PostCSS
- **UI Components:** Custom built (shadcn/ui style)
- **State Management:** Context API / React Hooks

### Backend
- **API:** REST API (Node.js / Python / Java)
- **Authentication:** JWT Tokens, Email Verification
- **Database:** PostgreSQL / MySQL / Supabase
- **Email Service:** SendGrid / Nodemailer / AWS SES

### Deployment
- **Frontend Hosting:** Vercel / Netlify / Azure
- **Backend Hosting:** Heroku / AWS / Azure / Railway
- **Database Hosting:** Supabase / AWS RDS / Cloud SQL

---

## 7. Security Considerations

✅ **Authentication Security**
- Passwords hashed (bcrypt)
- Email verification required
- Session timeout for security

✅ **Data Protection**
- Sensitive data encrypted (salary, personal info)
- Secure password reset process
- HTTPS for all communications

✅ **Access Control**
- Role-based permissions (Admin vs Employee)
- Employees can only access their own data
- Admin audit logs for compliance

✅ **Best Practices**
- Regular backups of database
- Input validation on all forms
- SQL injection prevention
- CSRF protection

---

## 8. Future Enhancements

### 🚀 Phase 2 Features

**Biometric Attendance**
- Fingerprint/Face recognition for check-in
- Integration with biometric devices
- Increased security and accuracy

**Advanced Analytics**
- Predictive analytics (absenteeism trends)
- Employee performance insights
- Attendance patterns analysis

**Mobile App**
- iOS and Android applications
- Offline check-in capability
- Push notifications

**Performance Management**
- Employee goals and objectives
- Performance reviews
- Feedback and ratings system

**Recruitment Module**
- Job posting
- Application tracking
- Interview scheduling

### 🚀 Phase 3 Features

**Leave Management Enhancement**
- Workflow approvals (multiple levels)
- Public holiday calendar
- Team capacity planning
- Bulk leave approval

**Self-Service Portal**
- Employee self-service options
- Expense submissions
- Document upload and storage
- Ticket/complaint system

**Integration Features**
- Calendar sync (Google, Outlook)
- Email notifications advanced
- Slack/Teams integration
- Accounting software integration

**Advanced Payroll**
- Salary deduction customization
- Income tax calculation
- Pension/PF management
- Bulk salary processing

**Compliance & Reporting**
- Government compliance reports
- GDPR compliance features
- Audit trails
- Data export for compliance

**Team Management**
- Org chart visualization
- Team hierarchy
- Reporting relationships
- Team performance metrics

---

## 9. Implementation Roadmap

### Week 1-2: Setup & Authentication
- Project setup
- Database design finalization
- Authentication module
- Email verification

### Week 3-4: Core Modules
- Employee management
- Attendance tracking
- Leave management setup

### Week 5-6: Admin Features
- Admin dashboard
- Approval workflows
- Reports generation

### Week 7-8: Payroll & Testing
- Payroll module
- System testing
- Bug fixes
- Performance optimization

### Week 9: Deployment
- Production setup
- Data migration
- User training
- Go-live

---

## 10. Quick Reference: Key Features by Role

### 👨‍💼 Admin/HR Officer

| Feature | Capability |
|---------|-----------|
| Employee Management | ✅ Full control |
| Attendance | ✅ View, Mark, Correct |
| Leave Approval | ✅ Approve/Reject |
| Payroll | ✅ Set salary, View, Generate slips |
| Reports | ✅ Generate all reports |
| Analytics | ✅ View all analytics |
| Settings | ✅ Configure system |

### 🧑‍💼 Employee

| Feature | Capability |
|---------|-----------|
| Profile | ✅ View, Update personal info |
| Attendance | ✅ Check-in/out, View |
| Leave | ✅ Apply, View balance, Status |
| Payroll | ✅ View salary, Download slip |
| Reports | ✅ Download own reports |
| Analytics | ✅ View own statistics |

---

## 11. System Requirements

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Targets
- Page load time: < 3 seconds
- API response time: < 500ms
- Database query time: < 200ms
- 99.5% uptime SLA

### Storage
- Initial: ~100 GB
- Scalable for 10,000+ employees
- Archive old records annually

---

## 12. Support & Maintenance

### User Support
- In-app help/FAQ section
- Email support: support@dayflow.com
- Knowledge base articles
- Video tutorials

### System Maintenance
- Weekly backups
- Monthly database optimization
- Quarterly security audits
- Regular software updates

---

## Summary

**Dayflow** is a comprehensive HRMS that:
- ✅ Secures employee data with strong authentication
- ✅ Simplifies HR operations with automated workflows
- ✅ Provides real-time visibility into attendance and leave
- ✅ Streamlines payroll management
- ✅ Offers analytics for data-driven decisions
- ✅ Scales with your organization's growth

The system is designed to be user-friendly, secure, and scalable for organizations of any size.

---

**Document Version:** 1.0  
**Last Updated:** January 3, 2026  
**Status:** Approved for Development
