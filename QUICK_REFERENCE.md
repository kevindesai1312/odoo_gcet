# Dayflow HRMS - Quick Reference Guide

## 🚀 Getting Started

### System Status
✅ **Build**: Successful
✅ **Database**: MongoDB seeded with test data
✅ **Authentication**: JWT with secure password hashing
✅ **Dashboards**: Admin and Employee ready

### Access the System
- **URL**: http://localhost:3000
- **Status**: Dev server running

---

## 👤 Login Credentials

### Admin/HR Officer
```
Email:    nextin@gmail.com
Password: Nextin@123
```

### Employee
```
Email:    test@gmail.com
Password: test@123
```

---

## 📊 Available Data

After seeding, you have:

| Item | Count | Details |
|------|-------|---------|
| **Users** | 2 | 1 Admin, 1 Employee |
| **Employees** | 6 | Various positions & departments |
| **Attendance Records** | ~95 | 20 days per employee |
| **Leave Applications** | 8 | Mix of approved & pending |
| **Payroll Records** | 18 | 3 months per employee |

---

## 🎯 Admin Features

### Dashboard Overview
- Total employees count
- Attendance status today
- Pending approvals count
- Recent activities

### Core Functions

#### 1. **Approve/Reject Leave Requests**
- Navigate to: Dashboard → Approvals
- See all pending leave requests
- Click Approve/Reject
- System updates employee leave balance

#### 2. **Manage Employees**
- Navigate to: Dashboard → Employees
- View all employees (6 total)
- Search by name/email
- Filter by department
- View detailed profiles
- Edit employee information
- Deactivate/Activate employees

#### 3. **View Attendance**
- Navigate to: Dashboard → Attendance
- See all employee records
- Filter by date range
- View check-in/check-out times
- Mark attendance manually
- Generate reports

#### 4. **Manage Payroll**
- Navigate to: Dashboard → Payroll
- View all salary records
- See payroll calculations
- Download salary slips
- Process payments
- View payment history

#### 5. **View Reports**
- Attendance reports (daily, weekly, monthly)
- Leave analysis
- Payroll summaries
- Department-wise statistics

---

## 👨‍💼 Employee Features

### Dashboard Overview
- My attendance summary
- Applied leave status
- Salary information
- Personal profile

### Core Functions

#### 1. **Check In / Check Out**
- Click "Check In" on arrival
- System records time automatically
- Click "Check Out" on departure
- Working hours calculated automatically

#### 2. **Apply for Leave**
- Navigate to: Dashboard → Leave
- Click "Apply New"
- Select leave type:
  - Sick Leave
  - Casual Leave
  - Earned Leave
  - Other types
- Choose dates
- Add reason/notes
- Submit (awaits admin approval)

#### 3. **View My Attendance**
- Navigate to: Dashboard → Attendance
- See last 20 days of records
- Check-in/out times
- Working hours per day
- Attendance status

#### 4. **View My Profile**
- Navigate to: Dashboard → Profile
- Personal information
- Position & department
- Contact details
- Update profile (if allowed)

#### 5. **View Salary**
- Navigate to: Dashboard → Payroll
- View monthly salary
- See salary breakdown:
  - Basic Salary
  - HRA (House Rent Allowance)
  - Dearness Allowance
  - Gross Salary
- View deductions:
  - Income Tax
  - PF (Provident Fund)
- Download salary slip

---

## 📱 Navigation Guide

### Admin Dashboard Menu
```
├── Dashboard
│   ├── Overview (Analytics)
│   └── Pending Approvals
├── Employee Management
│   ├── Employee Directory
│   ├── Add New Employee
│   └── Edit Employee
├── Attendance
│   ├── View Records
│   ├── Mark Attendance
│   └── Generate Reports
├── Leave Management
│   ├── Approve Requests
│   └── Leave Policy Settings
├── Payroll
│   ├── Salary Records
│   ├── Generate Salary Slips
│   └── Process Payments
├── Reports
│   ├── Attendance Report
│   ├── Leave Report
│   └── Payroll Report
└── Logout
```

### Employee Dashboard Menu
```
├── Dashboard
│   ├── Quick Overview
│   └── Recent Activities
├── Attendance
│   ├── Check In/Out
│   └── View Records
├── Leave
│   ├── Apply for Leave
│   └── View Applications
├── Profile
│   ├── View Profile
│   └── Edit Profile
├── Salary/Payroll
│   ├── View Salary
│   └── Download Slip
└── Logout
```

---

## 🔐 Security Features

✅ **Password Hashing**: Bcryptjs
✅ **Authentication**: JWT tokens
✅ **Authorization**: Role-based access control
✅ **Email Verification**: On signup
✅ **Session Management**: Automatic timeout
✅ **Secure Cookies**: HttpOnly, SameSite

---

## 💾 Database Collections

### Schema Overview

**Users**: Authentication credentials and roles
**Employees**: Employee profiles and personal info
**Attendance**: Daily check-in/out records
**Leave Applications**: Leave requests and approvals
**Payroll**: Salary and payment records

All documents include `created_at` and `updated_at` timestamps.

---

## 🛠️ Technical Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Backend | Node.js + Next.js API Routes |
| Database | MongoDB |
| Auth | JWT + bcryptjs |
| Styling | Tailwind CSS + shadcn/ui |

---

## 📋 Sample Test Data

### Employees in System

1. **Nextin Admin** - HR Manager (Admin)
   - Email: nextin@gmail.com
   - Salary: 75,000
   - Department: Human Resources

2. **John Doe** - Software Engineer (Employee)
   - Email: test@gmail.com
   - Salary: 55,000
   - Department: IT

3. **Jane Smith** - Product Manager
   - Email: jane.smith@company.com
   - Salary: 65,000
   - Department: Product

4. **Robert Johnson** - Backend Developer
   - Email: robert.johnson@company.com
   - Salary: 58,000
   - Department: IT

5. **Emily Davis** - UI/UX Designer
   - Email: emily.davis@company.com
   - Salary: 52,000
   - Department: Design

6. **Michael Brown** - QA Engineer
   - Email: michael.brown@company.com
   - Salary: 48,000
   - Department: Quality Assurance

7. **Sarah Wilson** - DevOps Engineer
   - Email: sarah.wilson@company.com
   - Salary: 60,000
   - Department: Infrastructure

---

## 📊 Attendance Statistics

- **Records per employee**: 20 days
- **Status distribution**: 90% Present, 5% Absent, 5% Late
- **Check-in time**: 9:00 AM (on-time), 10:15 AM (late)
- **Check-out time**: 5:30 PM (regular), 5:45 PM (late)
- **Working hours**: 8.5 hours (full), 7.5 hours (late)

---

## 📜 Leave Request Examples

### Pending Requests (For Admin to Review)
1. John Doe - Sick Leave (2 days) - Medical appointment
2. John Doe - Casual Leave (1 day) - Personal work
3. Jane Smith - Earned Leave (5 days) - Annual vacation
4. Robert Johnson - Casual Leave (1 day) - Doctor appointment
5. Emily Davis - Earned Leave (5 days) - Annual vacation
6. Michael Brown - Casual Leave (1 day) - Doctor appointment
7. Sarah Wilson - Earned Leave (5 days) - Annual vacation

### Approved Requests
- John Doe - Earned Leave (6 days) - Family vacation (Approved)
- Jane Smith - Casual Leave (1 day) - Doctor appointment (Approved)
- Other employees - Casual Leaves (1 day each) - Doctor appointment (Approved)

---

## 💰 Salary Calculation Example

**Employee**: John Doe
**Basic Salary**: ₹55,000

**Allowances:**
- HRA (20%): ₹11,000
- Dearness Allowance (10%): ₹5,500

**Gross Salary**: ₹71,500

**Deductions:**
- Income Tax (10%): ₹7,150
- PF Contribution (12%): ₹6,600

**Net Salary**: ₹57,750

---

## 🎯 Quick Actions

### As Admin

**Approve a Leave Request**
1. Go to Dashboard
2. Click on "Pending Approvals"
3. Select leave request
4. Click "Approve"
5. Employee notified automatically

**View Employee Attendance**
1. Go to Attendance section
2. Filter by employee (optional)
3. Select date range
4. View check-in/out times
5. Export as report (optional)

**Process Payroll**
1. Go to Payroll section
2. Select month
3. Review calculations
4. Process payment
5. Generate salary slips

### As Employee

**Check In**
1. Open dashboard
2. Click "Check In" button
3. Time recorded automatically

**Apply for Leave**
1. Go to Leave section
2. Click "Apply New"
3. Select type and dates
4. Add reason
5. Submit (admin approval pending)

**View Salary**
1. Go to Payroll section
2. Select month
3. View breakdown
4. Download salary slip (PDF)

---

## ⚠️ Important Notes

- **Admin Credentials**: Don't share `nextin@gmail.com` login with others
- **Employee Accounts**: Each employee has unique credentials
- **Leave Balance**: Tracked automatically, deducted on approval
- **Attendance**: Auto-recorded on check-in/check-out
- **Payroll**: Calculated monthly, can be paid or pending
- **Backup**: Regularly backup MongoDB data
- **Passwords**: Securely hashed, never shown to anyone

---

## 🐛 Troubleshooting

### Login Issues
- Verify email and password
- Clear browser cache
- Check if account is verified
- Try a different browser

### Data Not Showing
- Ensure database is seeded
- Check MongoDB connection
- Verify user role permissions
- Refresh the page

### Attendance Not Recording
- Ensure you're clicking "Check In" button
- Check system time is correct
- Verify employee is in system
- Check browser console for errors

### Payment Status Not Updating
- Refresh page
- Check if admin has processed
- Verify payroll record exists
- Contact admin if stuck

---

## 📞 Support Contacts

**System Admin**: Contact IT Team
**HR Manager**: nextin@gmail.com
**Technical Issues**: Check system logs

---

## 📅 Key Dates

- **System Launch**: January 2026
- **Version**: 1.0.0 (MVP)
- **Status**: Production Ready
- **Last Updated**: January 3, 2026

---

## 🔄 Re-seeding the Database

If you need to reset test data:

```bash
# Run seed script again
node scripts/seed-database.mjs
```

This will:
1. Clear all existing data
2. Create fresh test accounts
3. Populate all sample data
4. Ready for testing

---

**Happy Testing! 🎉**

For detailed documentation, see:
- [DAYFLOW_SYSTEM_DOCUMENTATION.md](DAYFLOW_SYSTEM_DOCUMENTATION.md) - Full system documentation
- [SEED_GUIDE.md](SEED_GUIDE.md) - Database seeding guide
- [README.md](README.md) - General project info
