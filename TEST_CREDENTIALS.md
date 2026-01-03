# 🔐 Dayflow HRMS - Test Credentials & Quick Start

## Test Accounts

### Admin Account
```
Email:    nextin@gmail.com
Password: Nextin@123
Role:     Admin / HR Manager
```

### Employee Account
```
Email:    test@gmail.com
Password: test@123
Role:     Employee / Software Engineer
```

---

## Quick Start Guide

### Step 1: Ensure MongoDB is Running
Make sure MongoDB is running on your system:
```bash
# For MongoDB running locally
# Port: 27017 (default)
```

### Step 2: Run the Database Seed Script
Execute the seed script to populate the database with test data:

```bash
npm run seed
```

Or directly:
```bash
node scripts/seed-database.ts
```

### Step 3: Start the Application
```bash
npm run dev
```

The application will start at: `http://localhost:3000`

### Step 4: Login

**For Admin:**
1. Go to http://localhost:3000/auth/signin
2. Enter: `nextin@gmail.com`
3. Enter: `Nextin@123`
4. Click "Sign In"
5. Access Admin Dashboard with full permissions

**For Employee:**
1. Go to http://localhost:3000/auth/signin
2. Enter: `test@gmail.com`
3. Enter: `test@123`
4. Click "Sign In"
5. Access Employee Portal with limited permissions

---

## What You Can Do with Each Account

### Admin (nextin@gmail.com)

#### Employee Management
- ✅ Add new employees
- ✅ View all employees
- ✅ Edit employee information
- ✅ Set/update salaries
- ✅ Deactivate employees

#### Attendance
- ✅ View all employee attendance
- ✅ Generate attendance reports
- ✅ Mark attendance manually
- ✅ Correct attendance records

#### Leave Management
- ✅ View all leave applications
- ✅ Approve/Reject leave requests
- ✅ Adjust leave balances
- ✅ View leave reports

#### Payroll
- ✅ View all salaries
- ✅ Update salary information
- ✅ Generate monthly payroll
- ✅ Download salary reports

#### Dashboard
- ✅ View analytics and statistics
- ✅ See pending approvals
- ✅ View activity logs
- ✅ Generate custom reports

---

### Employee (test@gmail.com)

#### Profile
- ✅ View own profile
- ✅ Update personal contact info
- ✅ View employment details

#### Attendance
- ✅ Check-in to mark arrival
- ✅ Check-out to mark departure
- ✅ View personal attendance records
- ✅ View weekly/monthly summary

#### Leave
- ✅ View leave balance
- ✅ Apply for leave
- ✅ View leave applications status
- ✅ View leave history

#### Salary
- ✅ View salary information
- ✅ View salary slip
- ✅ Download salary slip (PDF)
- ✅ View pay history

#### Dashboard
- ✅ View personal dashboard
- ✅ See quick statistics
- ✅ View notifications

---

## Database Data Created by Seed

When you run `npm run seed`, the following test data is created:

### Users (2)
- **Admin**: nextin@gmail.com (Role: admin)
- **Employee**: test@gmail.com (Role: employee)

### Employee Profiles (7)
1. Nextin Admin (Admin) - HR Manager
2. John Doe (Employee) - Software Engineer
3. Jane Smith - Product Manager
4. Robert Johnson - Backend Developer
5. Emily Davis - UI/UX Designer
6. Michael Brown - QA Engineer
7. Sarah Wilson - DevOps Engineer

### Sample Data
- ~95 Attendance Records (20 days per employee)
- 8 Leave Applications (mix of approved/pending)
- 18 Payroll Records (3 months of salary data)

---

## Testing Workflows

### Test Attendance Flow (Employee)
1. Login as `test@gmail.com`
2. Click "Check In" button
3. System records arrival time
4. Work throughout the day
5. Click "Check Out" button
6. System records departure time and calculates hours

### Test Leave Application Flow (Employee → Admin)
1. **Employee**: Login as `test@gmail.com`
2. **Employee**: Go to Leave → "Apply for Leave"
3. **Employee**: Select dates, type, and add reason
4. **Employee**: Submit application (Status: PENDING)
5. **Admin**: Login as `nextin@gmail.com`
6. **Admin**: Go to Leave → "Pending Approvals"
7. **Admin**: Review and click "Approve" or "Reject"
8. **Employee**: Check application status (updated)

### Test Payroll Flow (Admin)
1. Login as `nextin@gmail.com`
2. Go to Payroll section
3. View all employee salaries
4. Click "Generate Monthly Payroll"
5. Select month and year
6. System calculates salaries based on attendance
7. Generates salary slips
8. Employee can now view their salary slip

---

## Troubleshooting

### Can't Connect to Database
- ✅ Check MongoDB is running: `mongod`
- ✅ Verify `.env` file has correct `MONGODB_URI`
- ✅ Default: `mongodb://localhost:27017/dayflow`

### Seed Script Fails
- ✅ Run: `npm install` (install all dependencies)
- ✅ Check Node.js version: `node --version` (should be 18+)
- ✅ Clear collections manually and retry

### Login Not Working
- ✅ Make sure seed script ran successfully
- ✅ Check email and password are exactly as shown
- ✅ Clear browser cache and try again
- ✅ Check console for error messages (F12)

### Passwords Don't Match
- ✅ Check CAPS LOCK (Nextin@123 ≠ nextin@123)
- ✅ Admin password: `Nextin@123` (capital N)
- ✅ Employee password: `test@123` (lowercase t)

---

## Reset Database

To reset and reseed the database:

```bash
# Clear MongoDB collections
mongo dayflow
db.users.deleteMany({})
db.employees.deleteMany({})
db.attendance.deleteMany({})
db.leave_applications.deleteMany({})
db.payroll.deleteMany({})

# Then run seed again
npm run seed
```

Or simply run the seed script again (it automatically clears collections first).

---

## Environment Variables

Ensure your `.env` file contains:

```env
MONGODB_URI=mongodb://localhost:27017/dayflow
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here
```

---

## File Locations

- **Seed Script**: `scripts/seed-database.ts`
- **Authentication**: `src/lib/auth.ts`
- **API Routes**: `src/app/api/auth/`
- **Seed Guide**: `SEED_GUIDE.md`
- **Setup Guide**: `SETUP_GUIDE.md`

---

## Need Help?

- 📖 See `TESTING_CHECKLIST.md` for comprehensive testing guide
- 📖 See `API_TESTING_GUIDE.md` for API endpoint testing
- 📖 See `SETUP_GUIDE.md` for complete setup instructions
- 📖 See `DAYFLOW_COMPLETE_SYSTEM_GUIDE.md` for system overview

---

**Quick Command Reference:**

```bash
# Install dependencies
npm install

# Run database seed
npm run seed

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

---

**System Ready!** You now have a complete test environment to explore the Dayflow HRMS.
