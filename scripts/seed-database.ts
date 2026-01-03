import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dayflow';

interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  role: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Employee {
  _id?: ObjectId;
  user_id: ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  joining_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Attendance {
  _id?: ObjectId;
  employee_id: ObjectId;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  working_hours?: number;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

interface LeaveApplication {
  _id?: ObjectId;
  employee_id: ObjectId;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: string;
  applied_on: Date;
  approved_by?: ObjectId;
  approved_on?: Date;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

interface Payroll {
  _id?: ObjectId;
  employee_id: ObjectId;
  pay_period_start: string;
  pay_period_end: string;
  basic_salary: number;
  hra: number;
  dearness_allowance: number;
  gross_salary: number;
  income_tax: number;
  pf_contribution: number;
  net_salary: number;
  payment_status: string;
  payment_date?: string;
  created_at: Date;
  updated_at: Date;
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('dayflow');

    console.log('🗑️  Clearing existing collections...');
    await db.collection('users').deleteMany({});
    await db.collection('employees').deleteMany({});
    await db.collection('attendance').deleteMany({});
    await db.collection('leave_applications').deleteMany({});
    await db.collection('payroll').deleteMany({});

    console.log('✅ Collections cleared');

    // Create admin user
    const adminHashedPassword = await hashPassword('Nextin@123');
    const adminUser: User = {
      email: 'nextin@gmail.com',
      password: adminHashedPassword,
      role: 'admin',
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const adminResult = await db.collection('users').insertOne(adminUser);
    const adminUserId = adminResult.insertedId;

    console.log('✅ Admin user created:', adminUser.email);

    // Create test employee user
    const employeeHashedPassword = await hashPassword('test@123');
    const employeeUser: User = {
      email: 'test@gmail.com',
      password: employeeHashedPassword,
      role: 'employee',
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const employeeResult = await db.collection('users').insertOne(employeeUser);
    const employeeUserId = employeeResult.insertedId;

    console.log('✅ Employee user created:', employeeUser.email);

    // Create admin employee profile
    const adminEmployee: Employee = {
      user_id: adminUserId,
      first_name: 'Nextin',
      last_name: 'Admin',
      email: 'nextin@gmail.com',
      phone: '+91-9876543210',
      position: 'HR Manager',
      department: 'Human Resources',
      salary: 75000,
      joining_date: new Date('2023-01-15'),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const adminEmpResult = await db.collection('employees').insertOne(adminEmployee);
    console.log('✅ Admin employee profile created');

    // Create test employee profile
    const testEmployee: Employee = {
      user_id: employeeUserId,
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@gmail.com',
      phone: '+91-9876543211',
      position: 'Software Engineer',
      department: 'IT',
      salary: 55000,
      joining_date: new Date('2023-06-01'),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const testEmpResult = await db.collection('employees').insertOne(testEmployee);
    const testEmployeeId = testEmpResult.insertedId;

    console.log('✅ Test employee profile created');

    // Create more employees for admin to manage
    const employees: Employee[] = [
      {
        user_id: new ObjectId(),
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+91-9876543212',
        position: 'Product Manager',
        department: 'Product',
        salary: 65000,
        joining_date: new Date('2023-03-10'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: new ObjectId(),
        first_name: 'Robert',
        last_name: 'Johnson',
        email: 'robert.johnson@company.com',
        phone: '+91-9876543213',
        position: 'Backend Developer',
        department: 'IT',
        salary: 58000,
        joining_date: new Date('2023-07-20'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: new ObjectId(),
        first_name: 'Emily',
        last_name: 'Davis',
        email: 'emily.davis@company.com',
        phone: '+91-9876543214',
        position: 'UI/UX Designer',
        department: 'Design',
        salary: 52000,
        joining_date: new Date('2023-08-05'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: new ObjectId(),
        first_name: 'Michael',
        last_name: 'Brown',
        email: 'michael.brown@company.com',
        phone: '+91-9876543215',
        position: 'QA Engineer',
        department: 'Quality Assurance',
        salary: 48000,
        joining_date: new Date('2023-09-12'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: new ObjectId(),
        first_name: 'Sarah',
        last_name: 'Wilson',
        email: 'sarah.wilson@company.com',
        phone: '+91-9876543216',
        position: 'DevOps Engineer',
        department: 'Infrastructure',
        salary: 60000,
        joining_date: new Date('2023-04-18'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const employeeResults = await db.collection('employees').insertMany(employees);
    const employeeIds = [testEmployeeId, ...Object.values(employeeResults.insertedIds)];

    console.log(`✅ Created ${employees.length} additional employees`);

    // Create attendance records for each employee
    console.log('📝 Creating attendance records...');
    for (const empId of employeeIds) {
      const attendanceRecords: Attendance[] = [];
      
      // Create 20 days of attendance records
      for (let i = 20; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayOfWeek = date.getDay();
        
        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          continue;
        }

        let status = 'Present';
        let checkInTime = '';
        let checkOutTime = '';
        let workingHours = 0;

        // Random attendance status (90% present, 5% absent, 5% late)
        const random = Math.random();
        if (random < 0.05) {
          status = 'Absent';
        } else if (random < 0.10) {
          status = 'Late';
          checkInTime = '10:15 AM';
          checkOutTime = '5:45 PM';
          workingHours = 7.5;
        } else {
          checkInTime = '9:00 AM';
          checkOutTime = '5:30 PM';
          workingHours = 8.5;
        }

        attendanceRecords.push({
          employee_id: empId,
          date: dateString,
          check_in_time: checkInTime,
          check_out_time: checkOutTime,
          working_hours: workingHours,
          status,
          notes: status === 'Late' ? 'Traffic delay' : '',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      await db.collection('attendance').insertMany(attendanceRecords);
    }

    console.log('✅ Attendance records created');

    // Create leave applications
    console.log('📝 Creating leave applications...');
    const leaveApplications: LeaveApplication[] = [
      {
        employee_id: testEmployeeId,
        leave_type: 'Earned Leave',
        start_date: '2024-02-10',
        end_date: '2024-02-15',
        total_days: 6,
        reason: 'Family vacation planned',
        status: 'Approved',
        applied_on: new Date('2024-01-20'),
        approved_by: adminEmpResult.insertedId,
        approved_on: new Date('2024-01-21'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: testEmployeeId,
        leave_type: 'Sick Leave',
        start_date: '2024-01-25',
        end_date: '2024-01-26',
        total_days: 2,
        reason: 'Medical appointment',
        status: 'Pending',
        applied_on: new Date('2024-01-24'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: testEmployeeId,
        leave_type: 'Casual Leave',
        start_date: '2024-02-01',
        end_date: '2024-02-01',
        total_days: 1,
        reason: 'Personal work',
        status: 'Pending',
        applied_on: new Date('2024-01-28'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Add leave requests for other employees
    for (let i = 1; i < employeeIds.length; i++) {
      const empId = employeeIds[i];
      leaveApplications.push(
        {
          employee_id: empId,
          leave_type: 'Earned Leave',
          start_date: '2024-02-05',
          end_date: '2024-02-09',
          total_days: 5,
          reason: 'Annual vacation',
          status: 'Pending',
          applied_on: new Date('2024-01-25'),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          employee_id: empId,
          leave_type: 'Casual Leave',
          start_date: '2024-01-30',
          end_date: '2024-01-30',
          total_days: 1,
          reason: 'Doctor appointment',
          status: 'Approved',
          applied_on: new Date('2024-01-25'),
          approved_by: adminEmpResult.insertedId,
          approved_on: new Date('2024-01-26'),
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    await db.collection('leave_applications').insertMany(leaveApplications);

    console.log('✅ Leave applications created');

    // Create payroll records
    console.log('📝 Creating payroll records...');
    const payrollRecords: Payroll[] = [];

    for (const empId of employeeIds) {
      // Get employee details to know their salary
      const emp = await db.collection('employees').findOne({ _id: empId });
      
      if (emp) {
        // Create 3 months of payroll
        for (let month = 0; month < 3; month++) {
          const payPeriodStart = new Date();
          payPeriodStart.setMonth(payPeriodStart.getMonth() - month);
          payPeriodStart.setDate(1);

          const payPeriodEnd = new Date(payPeriodStart);
          payPeriodEnd.setMonth(payPeriodEnd.getMonth() + 1);
          payPeriodEnd.setDate(0);

          const basicSalary = emp.salary;
          const hra = Math.round(basicSalary * 0.20);
          const da = Math.round(basicSalary * 0.10);
          const grossSalary = basicSalary + hra + da;
          const incomeTax = Math.round(grossSalary * 0.10);
          const pfContribution = Math.round(basicSalary * 0.12);
          const netSalary = grossSalary - incomeTax - pfContribution;

          payrollRecords.push({
            employee_id: empId,
            pay_period_start: payPeriodStart.toISOString().split('T')[0],
            pay_period_end: payPeriodEnd.toISOString().split('T')[0],
            basic_salary: basicSalary,
            hra,
            dearness_allowance: da,
            gross_salary: grossSalary,
            income_tax: incomeTax,
            pf_contribution: pfContribution,
            net_salary: netSalary,
            payment_status: month === 0 ? 'Pending' : 'Paid',
            payment_date: month === 0 ? undefined : payPeriodEnd.toISOString().split('T')[0],
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }

    await db.collection('payroll').insertMany(payrollRecords);

    console.log('✅ Payroll records created');

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Admin User: nextin@gmail.com`);
    console.log(`   - Test Employee: test@gmail.com`);
    console.log(`   - Additional Employees: 5`);
    console.log(`   - Attendance Records: ~95 (20 days × 6 employees)`);
    console.log(`   - Leave Applications: 8`);
    console.log(`   - Payroll Records: 18 (3 months × 6 employees)`);
    console.log('\n🔐 Test Credentials:');
    console.log('   Admin: nextin@gmail.com / Nextin@123');
    console.log('   Employee: test@gmail.com / test@123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

seedDatabase();
