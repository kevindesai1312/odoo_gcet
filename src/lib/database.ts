/**
 * Database Connection & Configuration
 * Handles all database operations for Dayflow HRMS using MongoDB
 */

import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'dayflow';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in your .env.local file');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise!;
}

export async function getDb(): Promise<Db> {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}

/**
 * Create indexes for MongoDB collections
 * Call this function during app initialization
 */
export async function initializeDatabase() {
  const db = await getDb();

  // Users collection indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ created_at: 1 });

  // Email verification tokens indexes
  await db.collection('email_verification_tokens').createIndex({ user_id: 1 });
  await db.collection('email_verification_tokens').createIndex({ token: 1 }, { unique: true });
  await db.collection('email_verification_tokens').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

  // Departments collection indexes
  await db.collection('departments').createIndex({ manager_id: 1 });
  await db.collection('departments').createIndex({ created_at: 1 });

  // Employees collection indexes
  await db.collection('employees').createIndex({ user_id: 1 }, { unique: true });
  await db.collection('employees').createIndex({ email: 1 });
  await db.collection('employees').createIndex({ department_id: 1 });
  await db.collection('employees').createIndex({ is_active: 1 });

  // Leave types indexes
  await db.collection('leave_types').createIndex({ name: 1 }, { unique: true });

  // Leave balance indexes
  await db.collection('leave_balance').createIndex({ employee_id: 1 });
  await db.collection('leave_balance').createIndex({ leave_type_id: 1 });
  await db.collection('leave_balance').createIndex({ employee_id: 1, leave_type_id: 1, year: 1 }, { unique: true });

  // Leave applications indexes
  await db.collection('leave_applications').createIndex({ employee_id: 1 });
  await db.collection('leave_applications').createIndex({ status: 1 });
  await db.collection('leave_applications').createIndex({ leave_type_id: 1 });

  // Attendance indexes
  await db.collection('attendance').createIndex({ employee_id: 1 });
  await db.collection('attendance').createIndex({ attendance_date: 1 });
  await db.collection('attendance').createIndex({ employee_id: 1, attendance_date: 1 }, { unique: true });

  // Payroll indexes
  await db.collection('payroll').createIndex({ employee_id: 1 });
  await db.collection('payroll').createIndex({ month: 1, year: 1 });
  await db.collection('payroll').createIndex({ employee_id: 1, month: 1, year: 1 }, { unique: true });

  // Salary components indexes
  await db.collection('salary_components').createIndex({ payroll_id: 1 });

  // Salary slips indexes
  await db.collection('salary_slips').createIndex({ payroll_id: 1 }, { unique: true });
  await db.collection('salary_slips').createIndex({ employee_id: 1 });

  console.log('Database indexes initialized successfully');
}

/**
 * Database Collection Schemas (for reference)
 * MongoDB collections and their structure
 */

export const MONGODB_COLLECTIONS = {
  USERS: 'users',
  EMAIL_VERIFICATION_TOKENS: 'email_verification_tokens',
  DEPARTMENTS: 'departments',
  EMPLOYEES: 'employees',
  LEAVE_TYPES: 'leave_types',
  LEAVE_BALANCE: 'leave_balance',
  LEAVE_APPLICATIONS: 'leave_applications',
  ATTENDANCE: 'attendance',
  PAYROLL: 'payroll',
  SALARY_COMPONENTS: 'salary_components',
  SALARY_SLIPS: 'salary_slips',
} as const;

/**
 * Sample Collection Schemas for MongoDB
 */

export const COLLECTION_SCHEMAS = `
-- 1. Create users collection (Core authentication)
{
  "_id": ObjectId,
  "email": String (unique),
  "password_hash": String,
  "role": String (ADMIN, EMPLOYEE),
  "is_verified": Boolean,
  "created_at": Date,
  "updated_at": Date
}

-- 2. Create email verification tokens collection
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "token": String (unique),
  "expires_at": Date,
  "created_at": Date
}

-- 3. Create departments collection
{
  "_id": ObjectId,
  "name": String,
  "manager_id": ObjectId,
  "created_at": Date,
  "updated_at": Date
}

-- 4. Create employees collection
{
  "_id": ObjectId,
  "user_id": ObjectId (unique),
  "first_name": String,
  "last_name": String,
  "email": String,
  "phone": String,
  "department_id": ObjectId,
  "position": String,
  "hire_date": Date,
  "salary": Number,
  "is_active": Boolean,
  "created_at": Date,
  "updated_at": Date
}

-- 5. Create leave types collection
{
  "_id": ObjectId,
  "name": String (unique),
  "description": String,
  "max_days_per_year": Number,
  "color": String,
  "created_at": Date,
  "updated_at": Date
}

-- 6. Create leave balance collection
{
  "_id": ObjectId,
  "employee_id": ObjectId,
  "leave_type_id": ObjectId,
  "remaining_days": Number,
  "used_days": Number,
  "year": Number,
  "updated_at": Date
}

-- 7. Create leave applications collection
{
  "_id": ObjectId,
  "employee_id": ObjectId,
  "leave_type_id": ObjectId,
  "from_date": Date,
  "to_date": Date,
  "reason": String,
  "status": String (PENDING, APPROVED, REJECTED),
  "approved_by": ObjectId,
  "rejection_reason": String,
  "created_at": Date,
  "updated_at": Date
}

-- 8. Create attendance collection
{
  "_id": ObjectId,
  "employee_id": ObjectId,
  "attendance_date": Date,
  "check_in_time": Date,
  "check_out_time": Date,
  "total_hours": Number,
  "status": String (PRESENT, ABSENT, LEAVE, HALF_DAY, LATE),
  "notes": String,
  "created_at": Date,
  "updated_at": Date
}

-- 9. Create payroll collection
{
  "_id": ObjectId,
  "employee_id": ObjectId,
  "month": Number (1-12),
  "year": Number,
  "base_salary": Number,
  "allowances": Number,
  "deductions": Number,
  "net_salary": Number,
  "status": String (DRAFT, APPROVED, PAID),
  "paid_on": Date,
  "created_at": Date,
  "updated_at": Date
}

-- 10. Create salary components collection
{
  "_id": ObjectId,
  "payroll_id": ObjectId,
  "name": String,
  "amount": Number,
  "type": String (ALLOWANCE, DEDUCTION),
  "created_at": Date
}

-- 11. Create salary slips collection
{
  "_id": ObjectId,
  "payroll_id": ObjectId (unique),
  "employee_id": ObjectId,
  "pdf_url": String,
  "generated_at": Date,
  "created_at": Date
}
`;

// Export for use in migrations
export const getDatabaseSetupScript = () => COLLECTION_SCHEMAS;
