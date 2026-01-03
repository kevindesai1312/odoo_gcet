# Dayflow HRMS - Database Seeding Guide

## Overview

The database seeding script populates your Dayflow HRMS MongoDB database with comprehensive test data including users, employees, attendance records, leave applications, and payroll information.

---

## What Gets Seeded

### 📊 Data Summary

When you run the seed script, it creates:

- **2 Users**
  - 1 Admin account (HR Manager)
  - 1 Employee account (Software Engineer)

- **6 Employee Profiles**
  - Nextin Admin (HR Manager) - Admin role
  - John Doe (Software Engineer) - Test employee
  - Jane Smith (Product Manager)
  - Robert Johnson (Backend Developer)
  - Emily Davis (UI/UX Designer)
  - Michael Brown (QA Engineer)
  - Sarah Wilson (DevOps Engineer)

- **~95 Attendance Records**
  - 20 days of attendance per employee
  - 90% present, 5% absent, 5% late distribution
  - Check-in/out times with working hours

- **8 Leave Applications**
  - Mix of approved and pending requests
  - Various leave types (Earned, Sick, Casual)
  - Complete request history with approval dates

- **18 Payroll Records**
  - 3 months of salary data per employee
  - Salary calculations with deductions (Tax, PF)
  - Mix of paid and pending payments

---

## How to Run the Seed Script

### Prerequisites

1. **MongoDB Connection**
   - Ensure MongoDB is running
   - Default connection: `mongodb://localhost:27017/dayflow`
   - Update `.env` if using different connection string

2. **Dependencies Installed**
   ```bash
   npm install
   ```

### Running the Script

**Option 1: Direct Execution**
```bash
node scripts/seed-database.mjs
```

**Option 2: Using NPM Script (Optional)**

Add to `package.json`:
```json
{
  "scripts": {
    "seed": "node scripts/seed-database.mjs"
  }
}
```

Then run:
```bash
npm run seed
```

### Expected Output

```
🗑️  Clearing existing collections...
✅ Collections cleared
✅ Admin user created: nextin@gmail.com
✅ Employee user created: test@gmail.com
✅ Admin employee profile created
✅ Test employee profile created
✅ Created 5 additional employees
📝 Creating attendance records...
✅ Attendance records created
📝 Creating leave applications...
✅ Leave applications created
📝 Creating payroll records...
✅ Payroll records created

✨ Database seeding completed successfully!
```

---

## Test Accounts

After seeding, use these credentials to test the system:

### Admin/HR Officer Account
```
Email:    nextin@gmail.com
Password: Nextin@123
Role:     Admin
```

**What you can do:**
- Approve/reject leave requests (8 pending requests to review)
- View all employees (6 total)
- See all attendance records
- Manage payroll
- Generate reports
- View analytics

### Employee Account
```
Email:    test@gmail.com
Password: test@123
Role:     Employee
```

**What you can do:**
- Check-in and check-out
- Apply for leave
- View own attendance records (20 days of data)
- View own profile
- Check salary and payroll
- Download salary slips

---

## Seeded Data Details

### Employees Table

| Name | Email | Position | Department | Salary | Role |
|------|-------|----------|-----------|--------|------|
| Nextin Admin | nextin@gmail.com | HR Manager | Human Resources | 75,000 | Admin |
| John Doe | test@gmail.com | Software Engineer | IT | 55,000 | Employee |
| Jane Smith | jane.smith@company.com | Product Manager | Product | 65,000 | Employee |
| Robert Johnson | robert.johnson@company.com | Backend Developer | IT | 58,000 | Employee |
| Emily Davis | emily.davis@company.com | UI/UX Designer | Design | 52,000 | Employee |
| Michael Brown | michael.brown@company.com | QA Engineer | Quality Assurance | 48,000 | Employee |
| Sarah Wilson | sarah.wilson@company.com | DevOps Engineer | Infrastructure | 60,000 | Employee |

### Attendance Data

- **Date Range**: Last 20 business days
- **Check-in Time**: 9:00 AM (regular) or 10:15 AM (late)
- **Check-out Time**: 5:30 PM (regular) or 5:45 PM (late)
- **Status Distribution**:
  - 90% Present (8.5 working hours)
  - 5% Absent (0 hours)
  - 5% Late (7.5 working hours)

### Leave Applications

Sample leave requests across all employees:

| Employee | Type | Status | Days | Dates |
|----------|------|--------|------|-------|
| John Doe | Earned Leave | Approved | 6 | 2024-02-10 to 2024-02-15 |
| John Doe | Sick Leave | Pending | 2 | 2024-01-25 to 2024-01-26 |
| John Doe | Casual Leave | Pending | 1 | 2024-02-01 |
| Other Employees | Earned Leave | Pending | 5 | 2024-02-05 to 2024-02-09 |
| Other Employees | Casual Leave | Approved | 1 | 2024-01-30 |

### Payroll Data

- **Period**: Last 3 months
- **Salary Components**:
  - Basic Salary (100% of base)
  - HRA (20% of basic)
  - Dearness Allowance (10% of basic)
  - Gross Salary = Basic + HRA + DA

- **Deductions**:
  - Income Tax (10% of gross)
  - PF Contribution (12% of basic)
  - Net Salary = Gross - Deductions

- **Payment Status**:
  - Current month: Pending
  - Previous months: Paid

---

## Testing the Dashboard

### Admin Dashboard Test

**What to see:**
1. **Overview**
   - Total Employees: 6
   - Present Today: 5-6
   - On Leave Today: 0
   - Pending Approvals: ~5

2. **Pending Leave Requests**
   - John Doe's sick leave request
   - John Doe's casual leave request
   - Other employees' leave requests

3. **Employee Management**
   - List of 6 employees
   - Can search and filter

4. **Attendance Records**
   - View all attendance with check-in/out times
   - See 20 days of data per employee

5. **Payroll Records**
   - View 3 months of salary data
   - See all salary calculations

### Employee Dashboard Test

**John Doe (test@gmail.com) can see:**
1. **My Attendance**
   - Last 20 working days
   - Check-in and check-out times
   - Working hours per day

2. **My Leaves**
   - Approved leave (Feb 10-15)
   - Pending leave requests (2 requests)
   - Leave balance

3. **My Profile**
   - Personal information
   - Position: Software Engineer
   - Department: IT
   - Salary: 55,000

4. **My Salary**
   - Last 3 months of payroll
   - Salary breakdown (Basic, HRA, DA)
   - Deductions (Tax, PF)
   - Net salary

---

## Clearing the Database

If you want to start fresh, the script automatically clears all collections before seeding. To manually clear:

```javascript
// Connect to MongoDB and run:
db.users.deleteMany({});
db.employees.deleteMany({});
db.attendance.deleteMany({});
db.leave_applications.deleteMany({});
db.payroll.deleteMany({});
```

Or run the seed script again, which will clear and repopulate.

---

## Modifying the Seed Data

### Change Employee Salaries
Edit `seed-database.mjs`:
```javascript
salary: 55000  // Change this value
```

### Add More Employees
Add to the `employees` array:
```javascript
{
  user_id: new ObjectId(),
  first_name: 'Your Name',
  last_name: 'Last Name',
  email: 'email@company.com',
  position: 'Your Position',
  salary: 50000,
  // ... other fields
}
```

### Change Attendance Distribution
Modify the random logic:
```javascript
const random = Math.random();
if (random < 0.10) {  // Change 0.05 to adjust absence rate
  status = 'Absent';
}
```

### Add More Leave Requests
Add to the `leaveApplications` array:
```javascript
{
  employee_id: testEmployeeId,
  leave_type: 'Earned Leave',
  start_date: '2024-02-20',
  end_date: '2024-02-25',
  total_days: 6,
  reason: 'Custom reason',
  status: 'Pending',
  applied_on: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
}
```

---

## Database Collections Structure

### Users
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String ('admin' or 'employee'),
  is_verified: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Employees
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (reference to Users),
  first_name: String,
  last_name: String,
  email: String,
  position: String,
  department: String,
  salary: Number,
  joining_date: Date,
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Attendance
```javascript
{
  _id: ObjectId,
  employee_id: ObjectId (reference to Employees),
  date: String (YYYY-MM-DD),
  check_in_time: String,
  check_out_time: String,
  working_hours: Number,
  status: String ('Present', 'Absent', 'Late'),
  notes: String,
  created_at: Date,
  updated_at: Date
}
```

### Leave Applications
```javascript
{
  _id: ObjectId,
  employee_id: ObjectId,
  leave_type: String,
  start_date: String (YYYY-MM-DD),
  end_date: String (YYYY-MM-DD),
  total_days: Number,
  reason: String,
  status: String ('Pending', 'Approved', 'Rejected'),
  applied_on: Date,
  approved_by: ObjectId (optional),
  approved_on: Date (optional),
  created_at: Date,
  updated_at: Date
}
```

### Payroll
```javascript
{
  _id: ObjectId,
  employee_id: ObjectId,
  pay_period_start: String (YYYY-MM-DD),
  pay_period_end: String (YYYY-MM-DD),
  basic_salary: Number,
  hra: Number,
  dearness_allowance: Number,
  gross_salary: Number,
  income_tax: Number,
  pf_contribution: Number,
  net_salary: Number,
  payment_status: String ('Pending', 'Paid'),
  payment_date: String (optional),
  created_at: Date,
  updated_at: Date
}
```

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### "Database already has data" Error
The script automatically clears collections. If it fails, manually clear:
```bash
# Using MongoDB Compass or CLI
db.dropDatabase()
```

### Password Hashing Issues
Ensure `bcryptjs` is installed:
```bash
npm install bcryptjs
```

### ObjectId Type Error
Make sure to use `new ObjectId()` from mongodb package:
```javascript
import { ObjectId } from 'mongodb';
```

---

## Next Steps

1. **Login with Admin Account**
   - Email: `nextin@gmail.com`
   - Password: `Nextin@123`

2. **Review Pending Approvals**
   - Go to Dashboard → Approvals
   - Review the 5+ pending leave requests
   - Try approving or rejecting

3. **View Employee Directory**
   - Go to Employees section
   - See all 6 employees with their details
   - Search and filter options

4. **Check Attendance**
   - Go to Attendance section
   - View 20 days of records
   - See check-in/out times
   - Generate reports

5. **Manage Payroll**
   - Go to Payroll section
   - View salary details
   - See deductions and calculations

6. **Login as Employee**
   - Logout from admin
   - Email: `test@gmail.com`
   - Password: `test@123`

7. **Employee Actions**
   - Check-in/Check-out
   - Apply for leave
   - View attendance
   - Check salary

---

## Support

For issues or questions:
- Check MongoDB connection
- Verify all dependencies are installed
- Ensure `.env` has correct MongoDB URI
- Review console output for specific error messages

---

**Last Updated**: January 2026
**Seed Version**: 1.0.0
