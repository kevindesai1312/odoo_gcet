# Dayflow HRMS - API Testing Guide

Quick reference for testing all API endpoints during development.

## Quick Start

### 1. Sign Up (Create Account)
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890",
    "hireDate": "2024-01-15"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email to proceed.",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "testuser@example.com"
  }
}
```

---

### 2. Sign In (Login)
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "testuser@example.com",
      "role": "EMPLOYEE"
    }
  }
}
```

**Save the token for subsequent requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Verify Email
```bash
# Get verification token from email link or database
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification-token-from-email"
  }'
```

---

### 4. Check In (Start Work Day)
```bash
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "checkInTime": "2025-01-03T09:00:00Z"
  }'
```

---

### 5. Check Out (End Work Day)
Update attendance record with check-out time (requires attendance ID):

```bash
curl -X PUT http://localhost:3000/api/attendance/{attendanceId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "checkOutTime": "2025-01-03T17:30:00Z"
  }'
```

---

### 6. Get Attendance Records
```bash
curl -X GET "http://localhost:3000/api/attendance?fromDate=2025-01-01&toDate=2025-01-31" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 7. Apply for Leave
```bash
curl -X POST http://localhost:3000/api/leave/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "leaveTypeId": "leave-type-id",
    "fromDate": "2025-02-15",
    "toDate": "2025-02-17",
    "reason": "Personal work"
  }'
```

---

### 8. Get Leave Applications
```bash
curl -X GET "http://localhost:3000/api/leave?status=PENDING" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 9. Get All Employees (Admin Only)
```bash
curl -X GET "http://localhost:3000/api/employees?page=1&pageSize=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

### 10. Get Payroll Records
```bash
curl -X GET "http://localhost:3000/api/payroll?month=1&year=2025" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 11. Process Payroll (Admin Only)
```bash
curl -X POST http://localhost:3000/api/payroll/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "employeeId": "employee-id",
    "month": 1,
    "year": 2025,
    "baseSalary": 100000,
    "allowances": 20000,
    "deductions": 15000,
    "components": [
      {
        "name": "HRA",
        "amount": 15000,
        "type": "ALLOWANCE"
      },
      {
        "name": "Income Tax",
        "amount": 10000,
        "type": "DEDUCTION"
      }
    ]
  }'
```

---

## Postman Collection

### Import Collection
1. Open Postman
2. Click "Import"
3. Paste this collection JSON:

```json
{
  "info": {
    "name": "Dayflow HRMS API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Sign Up",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/signup",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"test@example.com\",\"password\":\"TestPass123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"hireDate\":\"2024-01-15\"}"
            }
          }
        },
        {
          "name": "Sign In",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/signin",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"test@example.com\",\"password\":\"TestPass123\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Attendance",
      "item": [
        {
          "name": "Get Attendance",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/attendance",
            "header": {
              "Authorization": "Bearer {{token}}"
            }
          }
        },
        {
          "name": "Check In",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/attendance",
            "header": {
              "Authorization": "Bearer {{token}}"
            },
            "body": {
              "mode": "raw",
              "raw": "{\"checkInTime\":\"2025-01-03T09:00:00Z\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

### Setup Environment Variables in Postman
1. Create a new environment
2. Add variables:
   - `baseUrl` = `http://localhost:3000`
   - `token` = (leave empty, will be filled after login)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields",
  "error": "email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden",
  "error": "Only admins can process payroll"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Employee record not found",
  "error": "No employee record associated with this user"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

---

## Tips for Testing

### 1. Use VS Code REST Client Extension
Create `test.http` file:
```http
### Sign Up
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123",
  "firstName": "Test",
  "lastName": "User",
  "hireDate": "2024-01-15"
}

### Sign In
POST http://localhost:3000/api/auth/signin
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123"
}
```

Then click "Send Request" above each request.

### 2. Use Thunder Client Extension
Similar to REST Client, built-in to VS Code.

### 3. Debug with Browser DevTools
Network tab shows all API calls and responses.

### 4. Use Console Logs
Server logs appear in terminal where you ran `npm run dev`

---

## Test Data

### Default Users
| Email | Password | Role |
|-------|----------|------|
| admin@dayflow.com | AdminPass123 | ADMIN |
| john.doe@dayflow.com | JohnPass123 | EMPLOYEE |
| jane.smith@dayflow.com | JanePass123 | EMPLOYEE |

⚠️ Change in production!

---

## Common Issues

### Issue: "CORS error"
**Solution:** Make sure API is on same origin or configure CORS in backend

### Issue: "Token expired"
**Solution:** Sign in again to get new token

### Issue: "Employee record not found"
**Solution:** Create employee record or verify user_id matches

### Issue: "Database connection failed"
**Solution:** Check Supabase credentials in .env.local

---

## Load Testing

For performance testing, use:
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/attendance

# Using wrk
wrk -t4 -c100 -d30s http://localhost:3000/api/attendance
```

---

**Last Updated:** January 3, 2026
