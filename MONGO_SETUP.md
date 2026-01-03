# MongoDB Setup (Dayflow)

This document explains how to initialize a MongoDB database for Dayflow and seed initial data.

1) Add MongoDB connection string to `.env`:

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/dayflow?retryWrites=true&w=majority
MONGODB_DB=dayflow

2) Install new dependency:

```bash
npm install
```

3) Run the seed script to create collections and a default admin user:

```bash
node scripts/mongo-seed.js
```

4) Open MongoDB Compass and connect using the same `MONGODB_URI`. You should see the `dayflow` database with collections: `users`, `employees`, `departments`, `leave_types`, etc.

Notes:
- The seed script creates a default admin: `admin@dayflow.com` / `AdminPass123` (hashed in DB).
- The application currently still uses Supabase in many routes. Migrating the app fully to MongoDB requires updating API routes to use `src/lib/mongodb.ts`.

If you want, I can:
- Update auth API routes to use MongoDB (signup/signin), or
- Provide a migration plan to switch fully from Supabase to MongoDB.
