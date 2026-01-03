/* eslint-disable no-console */
// Simple MongoDB seed script for Dayflow
// Usage: node scripts/mongo-seed.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'dayflow';

if (!uri) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    // Collections
    const departments = db.collection('departments');
    const users = db.collection('users');
    const employees = db.collection('employees');
    const leaveTypes = db.collection('leave_types');

    // Create indexes
    await users.createIndex({ email: 1 }, { unique: true });
    await employees.createIndex({ user_id: 1 }, { unique: true });

    // Insert default departments
    const defaultDepartments = [
      { name: 'Engineering', description: 'Software development and engineering team' },
      { name: 'Human Resources', description: 'HR and people management' },
      { name: 'Sales', description: 'Sales and business development' },
      { name: 'Finance', description: 'Accounting and financial management' }
    ];

    for (const dept of defaultDepartments) {
      await departments.updateOne({ name: dept.name }, { $setOnInsert: dept }, { upsert: true });
    }
    console.log('Default departments ensured');

    // Insert default leave types
    const defaultLeaveTypes = [
      { name: 'Paid Leave', max_days_per_year: 20, color: '#3B82F6' },
      { name: 'Sick Leave', max_days_per_year: 10, color: '#EF4444' },
      { name: 'Casual Leave', max_days_per_year: 5, color: '#F59E0B' },
      { name: 'Special Leave', max_days_per_year: 3, color: '#8B5CF6' }
    ];

    for (const lt of defaultLeaveTypes) {
      await leaveTypes.updateOne({ name: lt.name }, { $setOnInsert: lt }, { upsert: true });
    }
    console.log('Default leave types ensured');

    // Insert admin user if not exists
    const adminEmail = 'admin@dayflow.com';
    const existingAdmin = await users.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = bcrypt.hashSync('AdminPass123', 10);
      const res = await users.insertOne({
        email: adminEmail,
        password_hash: passwordHash,
        role: 'ADMIN',
        is_verified: true,
        created_at: new Date()
      });
      const userId = res.insertedId;

      // Create linked employee
      await employees.insertOne({
        user_id: userId,
        employee_id: 'EMP-001',
        first_name: 'Admin',
        last_name: 'User',
        email: adminEmail,
        position: 'Administrator',
        is_active: true,
        created_at: new Date()
      });

      console.log('Admin user created: admin@dayflow.com / AdminPass123');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seeding complete');
  } catch (err) {
    console.error('Seed failed', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
